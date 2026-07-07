/**
 * Vercel serverless entry. Wraps the Express app as the function handler.
 *
 * Serverless notes:
 * - The filesystem is read-only except /tmp, so the SQLite DB and uploads live
 *   in /tmp (see src/config.ts). /tmp is per-instance and ephemeral: writes
 *   (captured leads, admin-authored posts, uploaded images) do NOT persist
 *   across cold starts or between instances. For durable data, set DB_PATH to a
 *   hosted database. The public marketing pages are static content from
 *   src/content/*.ts and are unaffected.
 * - /tmp starts empty on a cold start, so we seed the sample blog posts on boot.
 *
 * All requests are routed here by the rewrite in vercel.json; static assets in
 * public/ are served by Vercel's CDN before ever reaching this function.
 */
"use strict";

// Force the EJS runtime into the function bundle. Express requires the view
// engine lazily, which Vercel's static import tracing would otherwise miss.
require("ejs");

const { createApp } = require("../dist/app.js");

const app = createApp();

// Seed the fresh /tmp database on cold start (idempotent — only runs if empty).
try {
  require("../dist/db/seed.js").seedIfEmpty();
} catch (err) {
  console.error("Boot seed skipped:", err);
}

module.exports = app;
