import type { Request, Response } from "express";
import * as home from "../content/home.js";
import { faqs } from "../content/faqs.js";
import { listPublishedPosts } from "../models/postModel.js";
import { meta } from "../seo/meta.js";
import { siteConfig } from "../site.js";
import { serviceSchema, faqSchema } from "../seo/jsonld.js";
import { formatDate } from "../utils.js";

export function showHome(req: Request, res: Response) {
  res.render("home", {
    meta: meta({
      title: siteConfig.title,
      description: siteConfig.description,
      canonicalPath: "/",
      jsonLd: [serviceSchema(), faqSchema()],
    }),
    home,
    faqs,
    posts: listPublishedPosts().slice(0, 4), // 4 most recent for the home slider
    formatDate,
    submitted: req.query.submitted === "1",
    formError: null as string | null,
    formValues: {} as Record<string, string>,
  });
}
