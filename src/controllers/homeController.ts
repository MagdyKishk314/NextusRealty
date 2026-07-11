import type { Request, Response } from "express";
import * as home from "../content/home.js";
import { faqs } from "../content/faqs.js";
import { testimonials } from "../content/testimonials.js";
import { servicesIntro, services } from "../content/services.js";
import { listPublishedPosts } from "../models/postModel.js";
import { meta } from "../seo/meta.js";
import { siteConfig } from "../site.js";
import { serviceSchema, servicesSchema, faqSchema } from "../seo/jsonld.js";
import { formatDate } from "../utils.js";

export function showHome(_req: Request, res: Response) {
  res.render("home", {
    meta: meta({
      title: siteConfig.title,
      description: siteConfig.description,
      canonicalPath: "/",
      jsonLd: [serviceSchema(), servicesSchema(), faqSchema()],
      preloadImage: "/img/hero.webp",
    }),
    home,
    faqs,
    testimonials,
    servicesIntro,
    services,
    posts: listPublishedPosts().slice(0, 4), // 4 most recent for the home slider
    formatDate,
  });
}
