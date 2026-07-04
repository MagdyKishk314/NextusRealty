import type { Request, Response } from "express";
import { listPublishedPosts, getPostBySlug } from "../models/postModel.js";
import { meta } from "../seo/meta.js";
import { pageTitle, siteConfig } from "../site.js";
import { blogPostingSchema } from "../seo/jsonld.js";
import { textToHtml, formatDate, excerptFrom } from "../utils.js";

export function showBlogIndex(_req: Request, res: Response) {
  const posts = listPublishedPosts();
  res.render("blog/index", {
    meta: meta({
      title: pageTitle("Blog"),
      description:
        "Notes on exclusive, human-confirmed real estate leads: how we source, verify, and deliver them.",
      canonicalPath: "/blog",
    }),
    posts,
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
      jsonLd: [blogPostingSchema(post)],
    }),
    post,
    posts: listPublishedPosts(),
    bodyHtml: textToHtml(post.body),
    formatDate,
    siteName: siteConfig.name,
  });
}
