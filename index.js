/**
 * Vercel entrypoint. Vercel's native Express support detects a root-level
 * `index.js` that exports the app and runs the whole Express app as a single
 * Vercel Function. Static assets in public/ are served by Vercel's CDN
 * (note: express.static is ignored on Vercel — assets must live in public/).
 *
 * Serverless notes: the filesystem is read-only except /tmp, so the SQLite DB
 * and uploads live in /tmp (see src/config.ts). /tmp is per-instance and
 * ephemeral — admin-authored posts/uploads don't persist across cold starts;
 * the sample blog posts are re-seeded on boot. Lead-form submissions are
 * emailed over Gmail SMTP, not stored.
 *
 * Locally, use `npm run dev` / `npm start` (src/server.ts) — this file is only
 * the production entrypoint for Vercel.
 */
"use strict";

require("ejs"); // ensure the view engine is bundled with the function
const { createApp } = require("./dist/app.js");

const app = createApp();

// Seed the fresh /tmp database on cold start (idempotent — only runs if empty).
try {
  require("./dist/db/seed.js").seedIfEmpty();
} catch (err) {
  console.error("Boot seed skipped:", err);
}

module.exports = app;
