import type { Request, Response } from "express";
import { privacy, terms } from "../content/legal.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { breadcrumbSchema } from "../seo/jsonld.js";

export function showPrivacy(_req: Request, res: Response) {
  res.render("legal", {
    meta: meta({
      title: pageTitle("Privacy Policy"),
      description: "How Nextus Realty collects, uses, and protects your information.",
      canonicalPath: "/privacy",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ]),
      ],
    }),
    doc: privacy,
  });
}

export function showTerms(_req: Request, res: Response) {
  res.render("legal", {
    meta: meta({
      title: pageTitle("Terms of Service"),
      description: "The terms that govern your use of the Nextus Realty website.",
      canonicalPath: "/terms",
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ]),
      ],
    }),
    doc: terms,
  });
}
