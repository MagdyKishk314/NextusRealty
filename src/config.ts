import path from "node:path";

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
    return process.env.DB_PATH ?? path.join(this.rootDir, "data", "nextus.db");
  },

  // Basic-auth credentials for the CMS admin area.
  admin: {
    user: process.env.ADMIN_USER ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "nextus",
  },
} as const;
