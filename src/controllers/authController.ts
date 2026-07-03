import type { Request, Response } from "express";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import {
  checkCredentials,
  setSessionCookie,
  clearSessionCookie,
  isAuthenticated,
} from "../middleware/auth.js";

const loginMeta = () =>
  meta({ title: pageTitle("Admin sign in"), robots: "noindex, nofollow" });

/** Only permit redirects back into the admin area (no open redirect). */
function safeNext(raw: unknown): string {
  const value = typeof raw === "string" ? raw : "";
  // Must be a relative /admin path and not the login page itself.
  if (/^\/admin(\/(?!login\b)[^]*)?$/.test(value) && !value.startsWith("//")) {
    return value;
  }
  return "/admin";
}

export function showLogin(req: Request, res: Response) {
  // Already signed in? Skip the form.
  if (isAuthenticated(req)) return res.redirect(303, safeNext(req.query.next));
  res.render("admin/login", {
    meta: loginMeta(),
    error: null,
    next: safeNext(req.query.next),
    username: "",
  });
}

export function login(req: Request, res: Response) {
  const body = req.body as Record<string, string>;
  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  const next = safeNext(body.next);

  if (!checkCredentials(username, password)) {
    return res.status(401).render("admin/login", {
      meta: loginMeta(),
      error: "Incorrect username or password.",
      next,
      username,
    });
  }

  setSessionCookie(res);
  return res.redirect(303, next);
}

export function logout(_req: Request, res: Response) {
  clearSessionCookie(res);
  return res.redirect(303, "/admin/login");
}
