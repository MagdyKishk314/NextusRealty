import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

/** Where uploaded post images live (served statically from /uploads/...). */
export const UPLOAD_DIR = path.join(config.publicDir, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith("image/") && ALLOWED.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

/**
 * Runs the single-image upload but never rejects the request: on any multer
 * error (too large, wrong type) it records the message on `req.uploadError`
 * so the controller can re-render the form with a friendly message.
 */
export function postImageUpload(req: Request, res: Response, next: NextFunction) {
  uploadImage.single("image")(req, res, (err: unknown) => {
    if (err) {
      (req as Request & { uploadError?: string }).uploadError =
        err instanceof Error ? err.message : "Image upload failed.";
    }
    next();
  });
}

/** Public URL path for an uploaded file (what we store in the DB). */
export function publicPath(filename: string): string {
  return `/uploads/${filename}`;
}

/** Delete a previously uploaded image by its stored public path (best effort). */
export function removeUpload(publicUrl: string | null | undefined): void {
  if (!publicUrl || !publicUrl.startsWith("/uploads/")) return;
  const file = path.join(UPLOAD_DIR, path.basename(publicUrl));
  fs.rm(file, { force: true }, () => {});
}
