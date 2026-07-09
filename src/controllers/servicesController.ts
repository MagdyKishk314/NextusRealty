import type { Request, Response } from "express";
import { servicesIntro, services, servicesOutro } from "../content/services.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { servicesSchema, breadcrumbSchema } from "../seo/jsonld.js";

export function showServices(_req: Request, res: Response) {
  res.render("services", {
    meta: meta({
      title: pageTitle("Seller, Listing & Contractor Leads"),
      description:
        "Exclusive, high-quality real estate leads for agents and investors: motivated seller leads, listing leads, and contractor leads, each cold-called and confirmed by our team before delivery.",
      canonicalPath: "/services",
      jsonLd: [
        servicesSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
      ],
    }),
    servicesIntro,
    services,
    servicesOutro,
  });
}
