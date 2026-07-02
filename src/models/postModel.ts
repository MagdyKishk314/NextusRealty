import { db } from "../db/database.js";

export type PostStatus = "draft" | "published";

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
}

export function listPublishedPosts(): Post[] {
  return db
    .prepare(
      `SELECT * FROM posts
       WHERE status = 'published'
       ORDER BY COALESCE(published_at, created_at) DESC, id DESC`,
    )
    .all() as unknown as Post[];
}

export function listAllPosts(): Post[] {
  return db
    .prepare(`SELECT * FROM posts ORDER BY updated_at DESC, id DESC`)
    .all() as unknown as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  return db
    .prepare(`SELECT * FROM posts WHERE slug = ? AND status = 'published'`)
    .get(slug) as unknown as Post | undefined;
}

export function getPostById(id: number): Post | undefined {
  return db.prepare(`SELECT * FROM posts WHERE id = ?`).get(id) as unknown as
    | Post
    | undefined;
}

export function slugExists(slug: string, exceptId?: number): boolean {
  const row = db
    .prepare(`SELECT id FROM posts WHERE slug = ? AND id != ?`)
    .get(slug, exceptId ?? 0) as { id: number } | undefined;
  return Boolean(row);
}

export function createPost(input: PostInput): number {
  const publishedAt =
    input.status === "published" ? new Date().toISOString() : null;
  const info = db
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, body, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.slug,
      input.title,
      input.excerpt,
      input.body,
      input.status,
      publishedAt,
    );
  return Number(info.lastInsertRowid);
}

export function updatePost(id: number, input: PostInput): void {
  const existing = getPostById(id);
  // Stamp published_at the first time a post goes live.
  const publishedAt =
    input.status === "published"
      ? (existing?.published_at ?? new Date().toISOString())
      : null;
  db.prepare(
    `UPDATE posts
     SET slug = ?, title = ?, excerpt = ?, body = ?, status = ?,
         published_at = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    input.slug,
    input.title,
    input.excerpt,
    input.body,
    input.status,
    publishedAt,
    id,
  );
}

export function deletePost(id: number): void {
  db.prepare(`DELETE FROM posts WHERE id = ?`).run(id);
}
