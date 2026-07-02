import type { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "node:crypto";
import { config } from "../config.js";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** HTTP Basic Auth guard for the CMS admin area (no session dependency). */
export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const [scheme, encoded] = header.split(" ");

  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (safeEqual(user, config.admin.user) && safeEqual(pass, config.admin.password)) {
      return next();
    }
  }

  res.set("WWW-Authenticate", 'Basic realm="Nextus CMS", charset="UTF-8"');
  res.status(401).send("Authentication required.");
}
