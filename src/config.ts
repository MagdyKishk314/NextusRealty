import path from "node:path";

// Load a local .env file if present, before reading any environment variables.
// Real environment variables (e.g. those set by a host) still take precedence
// and a missing .env is fine - we just fall back to them or the defaults below.
try {
  process.loadEnvFile();
} catch {
  /* no .env file - rely on the process environment / defaults */
}

/** Runtime configuration, all overridable via environment variables. */
export const config = {
  port: Number(process.env.PORT ?? 3000),
  env: process.env.NODE_ENV ?? "development",

  // Absolute paths (this file lives in src/, or dist/ once compiled).
  rootDir: path.resolve(__dirname, ".."),
  get viewsDir() {
    return path.join(this.rootDir, "views");
  },
  get publicDir() {
    return path.join(this.rootDir, "public");
  },
  get dbPath() {
    if (process.env.DB_PATH) return process.env.DB_PATH;
    // Vercel's filesystem is read-only except /tmp, so the DB lives there.
    // NOTE: /tmp is per-instance and ephemeral - writes do NOT persist across
    // cold starts. Point DB_PATH at a hosted database for durable storage.
    if (process.env.VERCEL) return "/tmp/nextus.db";
    return path.join(this.rootDir, "data", "nextus.db");
  },
  get uploadsDir() {
    // Same read-only-filesystem constraint as the DB (see dbPath): uploaded
    // images on Vercel land in /tmp and are neither persisted nor served.
    return process.env.VERCEL
      ? "/tmp/uploads"
      : path.join(this.publicDir, "uploads");
  },

  // Lead-form delivery (nothing is stored): email each submission to
  // leadToEmail over Gmail SMTP. Requires a Gmail account with 2-Step
  // Verification and an App Password (https://myaccount.google.com/apppasswords).
  // Unset = submissions are only logged server-side.
  gmailUser: process.env.GMAIL_USER ?? "",
  gmailAppPassword: (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""),
  leadToEmail: process.env.LEAD_TO_EMAIL ?? "magdykishk314@gmail.com",

  // Credentials for the CMS admin area.
  admin: {
    user: process.env.ADMIN_USER ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "nextus",
  },

  // Secret used to sign the admin session cookie. Set SESSION_SECRET in
  // production; the dev fallback is fine only for local use.
  sessionSecret:
    process.env.SESSION_SECRET ?? "nextus-dev-session-secret-change-me",

  // Admin session lifetime (12 hours).
  sessionMaxAgeMs: 12 * 60 * 60 * 1000,
} as const;
