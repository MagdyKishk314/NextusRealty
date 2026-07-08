import type { Request, Response } from "express";
import {
  listPublishedPosts,
  listCategories,
  getPostBySlug,
} from "../models/postModel.js";
import { meta } from "../seo/meta.js";
import { pageTitle, siteConfig } from "../site.js";
import { blogPostingSchema, breadcrumbSchema } from "../seo/jsonld.js";
import { textToHtml, formatDate, excerptFrom } from "../utils.js";

export function showBlogIndex(req: Request, res: Response) {
  const categories = listCategories();
  const requested = typeof req.query.category === "string" ? req.query.category : "";
  // Only honour a category that actually exists.
  const currentCategory = categories.includes(requested) ? requested : null;
  const posts = listPublishedPosts(currentCategory ?? undefined);

  res.render("blog/index", {
    meta: meta({
      title: pageTitle(currentCategory ? `Blog: ${currentCategory}` : "Blog"),
      description:
        "Notes on exclusive, human-confirmed real estate leads: how we source, verify, and deliver them.",
      canonicalPath: "/blog",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
      ],
    }),
    posts,
    categories,
    currentCategory,
    formatDate,
  });
}

export function showBlogPost(req: Request, res: Response) {
  const post = getPostBySlug(req.params.slug ?? "");
  if (!post) {
    res.status(404).render("error", {
      meta: meta({ title: pageTitle("Not found"), robots: "noindex" }),
      status: 404,
      heading: "Post not found",
      message: "That article may have moved or been unpublished.",
    });
    return;
  }

  res.render("blog/show", {
    meta: meta({
      title: pageTitle(post.title),
      description: post.excerpt || excerptFrom(post.body),
      canonicalPath: `/blog/${post.slug}`,
      ogType: "article",
      jsonLd: [
        blogPostingSchema(post),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]),
      ],
    }),
    post,
    categories: listCategories(),
    currentCategory: post.category || null,
    bodyHtml: textToHtml(post.body),
    formatDate,
    siteName: siteConfig.name,
  });
}
