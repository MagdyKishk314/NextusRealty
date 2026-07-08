import type { Request, Response } from "express";
import { servicesIntro, services, servicesOutro } from "../content/services.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { servicesSchema, breadcrumbSchema } from "../seo/jsonld.js";

export function showServices(_req: Request, res: Response) {
  res.render("services", {
    meta: meta({
      title: pageTitle("Services"),
      description:
        "Exclusive, human-confirmed leads for wholesalers, listing agents, and home-service contractors - roofing, HVAC and more. Cold-called, verified, and never resold.",
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
