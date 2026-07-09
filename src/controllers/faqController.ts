import type { Request, Response } from "express";
import { faqs } from "../content/faqs.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { faqSchema, breadcrumbSchema } from "../seo/jsonld.js";

export function showFaq(_req: Request, res: Response) {
  res.render("faq", {
    meta: meta({
      title: pageTitle("Real Estate Leads FAQ"),
      description:
        "Answers to common questions about Nextus Realty's exclusive, human-confirmed real estate leads.",
      canonicalPath: "/faq",
      jsonLd: [
        faqSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]),
      ],
    }),
    faqs,
  });
}
