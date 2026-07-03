import type { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "../config.js";

const COOKIE_NAME = "nx_admin";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Validate a username/password pair against the configured admin credentials. */
export function checkCredentials(user: string, password: string): boolean {
  return (
    safeEqual(user, config.admin.user) &&
    safeEqual(password, config.admin.password)
  );
}

/* --------------------------------------------------------- Session tokens */
// A session token is `<expiryMs>.<hmac>`, signed with the session secret.
// Stateless: no server-side store, the signature is the proof.

function sign(payload: string): string {
  return createHmac("sha256", config.sessionSecret).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const exp = String(Date.now() + config.sessionMaxAgeMs);
  return `${exp}.${sign(exp)}`;
}

function isValidToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = sign(exp);
  if (mac.length !== expected.length || !safeEqual(mac, expected)) return false;
  const expMs = Number(exp);
  return Number.isFinite(expMs) && expMs > Date.now();
}

/** Minimal cookie-header parser (no cookie-parser dependency). */
function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}

export function setSessionCookie(res: Response): void {
  res.cookie(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: config.env === "production",
    path: "/admin",
    maxAge: config.sessionMaxAgeMs,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/admin" });
}

export function isAuthenticated(req: Request): boolean {
  const token = readCookie(req, COOKIE_NAME);
  return Boolean(token && isValidToken(token));
}

/**
 * Guard for the CMS admin area. Unauthenticated requests are sent to the
 * styled login page (GET) or rejected (non-GET), preserving the intended
 * destination via `?next=`.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (isAuthenticated(req)) return next();

  if (req.method === "GET") {
    const dest = encodeURIComponent(req.originalUrl);
    return res.redirect(303, `/admin/login?next=${dest}`);
  }
  return res.redirect(303, "/admin/login");
}
