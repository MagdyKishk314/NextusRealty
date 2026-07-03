import type { Request, Response } from "express";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { slugify, formatDate, textToHtml } from "../utils.js";
import { countLeads, listLeads } from "../models/leadModel.js";
import { countSignups, listSignups } from "../models/signupModel.js";
import {
  listAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  setPostStatus,
  slugExists,
  type PostStatus,
} from "../models/postModel.js";
import {
  listAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialStatus,
} from "../models/testimonialModel.js";

const adminMeta = (title: string) =>
  meta({ title: pageTitle(title), robots: "noindex, nofollow" });

/* ---------------------------------------------------------------- Dashboard */

export function dashboard(_req: Request, res: Response) {
  res.render("admin/dashboard", {
    meta: adminMeta("CMS"),
    leadCount: countLeads(),
    leads: listLeads(25),
    signupCount: countSignups(),
    signups: listSignups(25),
    posts: listAllPosts(),
    testimonials: listAllTestimonials(),
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
    status,
    slugSource: slugify(slugSource),
  };
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
    formAction: "/admin/posts",
    error: null,
  });
}

export function createPostHandler(req: Request, res: Response) {
  const data = readPostBody(req);
  if (!data.title) {
    return res.status(422).render("admin/post-form", {
      meta: adminMeta("New post"),
      post: { ...req.body, id: 0 },
      formAction: "/admin/posts",
      error: "Title is required.",
    });
  }
  createPost({
    slug: uniqueSlug(data.slugSource),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    status: data.status,
  });
  res.redirect(303, "/admin");
}

export function editPost(req: Request, res: Response) {
  const post = getPostById(Number(req.params.id));
  if (!post) return res.redirect(303, "/admin");
  res.render("admin/post-form", {
    meta: adminMeta("Edit post"),
    post,
    formAction: `/admin/posts/${post.id}`,
    error: null,
  });
}

export function updatePostHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const existing = getPostById(id);
  if (!existing) return res.redirect(303, "/admin");

  const data = readPostBody(req);
  if (!data.title) {
    return res.status(422).render("admin/post-form", {
      meta: adminMeta("Edit post"),
      post: { ...existing, ...req.body },
      formAction: `/admin/posts/${id}`,
      error: "Title is required.",
    });
  }
  updatePost(id, {
    slug: uniqueSlug(data.slugSource, id),
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    status: data.status,
  });
  res.redirect(303, "/admin");
}

export function deletePostHandler(req: Request, res: Response) {
  deletePost(Number(req.params.id));
  res.redirect(303, "/admin");
}

/* ------------------------------------------------------------- Testimonials */

function readTestimonialBody(req: Request) {
  const b = req.body as Record<string, string>;
  const status: TestimonialStatus =
    b.status === "published" ? "published" : "draft";
  const rating = Math.min(5, Math.max(1, Number(b.rating) || 5));
  const sort_order = Number(b.sort_order) || 0;
  return {
    name: (b.name ?? "").trim(),
    role: (b.role ?? "").trim(),
    quote: (b.quote ?? "").trim(),
    rating,
    status,
    sort_order,
  };
}

export function newTestimonial(_req: Request, res: Response) {
  res.render("admin/testimonial-form", {
    meta: adminMeta("New testimonial"),
    testimonial: null,
    formAction: "/admin/testimonials",
    error: null,
  });
}

export function createTestimonialHandler(req: Request, res: Response) {
  const data = readTestimonialBody(req);
  if (!data.name || !data.quote) {
    return res.status(422).render("admin/testimonial-form", {
      meta: adminMeta("New testimonial"),
      testimonial: { ...req.body, id: 0 },
      formAction: "/admin/testimonials",
      error: "Name and quote are required.",
    });
  }
  createTestimonial(data);
  res.redirect(303, "/admin");
}

export function editTestimonial(req: Request, res: Response) {
  const testimonial = getTestimonialById(Number(req.params.id));
  if (!testimonial) return res.redirect(303, "/admin");
  res.render("admin/testimonial-form", {
    meta: adminMeta("Edit testimonial"),
    testimonial,
    formAction: `/admin/testimonials/${testimonial.id}`,
    error: null,
  });
}

export function updateTestimonialHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const existing = getTestimonialById(id);
  if (!existing) return res.redirect(303, "/admin");

  const data = readTestimonialBody(req);
  if (!data.name || !data.quote) {
    return res.status(422).render("admin/testimonial-form", {
      meta: adminMeta("Edit testimonial"),
      testimonial: { ...existing, ...req.body },
      formAction: `/admin/testimonials/${id}`,
      error: "Name and quote are required.",
    });
  }
  updateTestimonial(id, data);
  res.redirect(303, "/admin");
}

export function deleteTestimonialHandler(req: Request, res: Response) {
  deleteTestimonial(Number(req.params.id));
  res.redirect(303, "/admin");
}
