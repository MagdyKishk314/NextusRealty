import type { Request, Response } from "express";
import { getLanding } from "../content/landings.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import {
  landingServiceSchema,
  faqPageSchema,
  breadcrumbSchema,
} from "../seo/jsonld.js";

/**
 * Render a keyword-targeted landing page (SEO Phase 3) from its slug.
 * Returns an Express handler bound to one landing so routes stay declarative.
 */
export function showLanding(slug: string) {
  return function (_req: Request, res: Response) {
    const landing = getLanding(slug);
    if (!landing) {
      res.status(404).render("error", {
        meta: meta({ title: pageTitle("Not found"), robots: "noindex" }),
        status: 404,
        heading: "Page not found",
        message: "That page may have moved.",
      });
      return;
    }

    res.render("landing", {
      meta: meta({
        title: pageTitle(landing.metaTitle),
        description: landing.metaDescription,
        canonicalPath: `/${landing.slug}`,
        jsonLd: [
          landingServiceSchema(landing),
          faqPageSchema(landing.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: landing.breadcrumbName, path: `/${landing.slug}` },
          ]),
        ],
      }),
      landing,
    });
  };
}
