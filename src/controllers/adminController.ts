import type { Request, Response } from "express";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { slugify, formatDate, textToHtml } from "../utils.js";
import {
  listAllPosts,
  listCategories,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setPostStatus,
  slugExists,
  type PostStatus,
} from "../models/postModel.js";
import { publicPath, removeUpload } from "../middleware/upload.js";

const adminMeta = (title: string) =>
  meta({ title: pageTitle(title), robots: "noindex, nofollow" });

/* ---------------------------------------------------------------- Dashboard */

export function dashboard(_req: Request, res: Response) {
  res.render("admin/dashboard", {
    meta: adminMeta("CMS"),
    posts: listAllPosts(),
    formatDate,
  });
}

/* -------------------------------------------------------------------- Posts */

function uniqueSlug(desired: string, exceptId?: number): string {
  let base = desired || "post";
  let slug = base;
  let n = 2;
  while (slugExists(slug, exceptId)) slug = `${base}-${n++}`;
  return slug;
}

function readPostBody(req: Request) {
  const b = req.body as Record<string, string>;
  const title = (b.title ?? "").trim();
  const status: PostStatus = b.status === "published" ? "published" : "draft";
  const slugSource = (b.slug ?? "").trim() || title;
  return {
    title,
    excerpt: (b.excerpt ?? "").trim(),
    body: (b.body ?? "").trim(),
    category: (b.category ?? "").trim(),
    status,
    slugSource: slugify(slugSource),
  };
}

/** Public path of the just-uploaded image, or null. */
function uploadedImage(req: Request): string | null {
  return req.file ? publicPath(req.file.filename) : null;
}

/** Any error recorded by the upload middleware. */
function uploadError(req: Request): string | null {
  return (req as Request & { uploadError?: string }).uploadError ?? null;
}

export function postsManage(_req: Request, res: Response) {
  res.render("admin/posts", {
    meta: adminMeta("Blog posts"),
    posts: listAllPosts(),
    formatDate,
  });
}

export function viewPost(req: Request, res: Response) {
  const post = getPostById(Number(req.params.id));
  if (!post) return res.redirect(303, "/admin/posts");
  res.render("admin/post-view", {
    meta: adminMeta(post.title),
    post,
    bodyHtml: textToHtml(post.body),
    formatDate,
  });
}

export function togglePostStatus(req: Request, res: Response) {
  const post = getPostById(Number(req.params.id));
  if (post) {
    setPostStatus(post.id, post.status === "published" ? "draft" : "published");
  }
  res.redirect(303, req.get("referer") ?? "/admin/posts");
}

export function newPost(_req: Request, res: Response) {
  res.render("admin/post-form", {
    meta: adminMeta("New post"),
    post: null,
    categories: listCategories(),
    formAction: "/admin/posts",
    error: null,
  });
}

export function createPostHandler(req: Request, res: Response) {
  const data = readPostBody(req);
  const err = uploadError(req) ?? (!data.title ? "Title is required." : null);
  if (err) {
    removeUpload(uploadedImage(req)); // discard any orphaned upload
    return res.status(422).render("admin/post-form", {
      meta: adminMeta("New post"),
      post: { ...req.body, id: 0, image: null },
      categories: listCategories(),
      formAction: "/admin/posts",
      error: err,
    });
  }
  createPost({
    slug: uniqueSlug(data.slugSource),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    image: uploadedImage(req),
    status: data.status,
  });
  res.redirect(303, "/admin/posts");
}

export function editPost(req: Request, res: Response) {
  const post = getPostById(Number(req.params.id));
  if (!post) return res.redirect(303, "/admin/posts");
  res.render("admin/post-form", {
    meta: adminMeta("Edit post"),
    post,
    categories: listCategories(),
    formAction: `/admin/posts/${post.id}`,
    error: null,
  });
}

export function updatePostHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const existing = getPostById(id);
  if (!existing) return res.redirect(303, "/admin/posts");

  const data = readPostBody(req);
  const err = uploadError(req) ?? (!data.title ? "Title is required." : null);
  if (err) {
    removeUpload(uploadedImage(req));
    return res.status(422).render("admin/post-form", {
      meta: adminMeta("Edit post"),
      post: { ...existing, ...req.body },
      categories: listCategories(),
      formAction: `/admin/posts/${id}`,
      error: err,
    });
  }

  // Resolve the image: new upload replaces, "remove" clears, else keep current.
  const newUpload = uploadedImage(req);
  const removeExisting = (req.body as Record<string, string>).removeImage === "1";
  let image = existing.image;
  if (newUpload) {
    removeUpload(existing.image);
    image = newUpload;
  } else if (removeExisting) {
    removeUpload(existing.image);
    image = null;
  }

  updatePost(id, {
    slug: uniqueSlug(data.slugSource, id),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    image,
    status: data.status,
  });
  res.redirect(303, "/admin/posts");
}

export function deletePostHandler(req: Request, res: Response) {
  deletePost(Number(req.params.id));
  res.redirect(303, "/admin");
}
