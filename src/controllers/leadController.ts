import type { Request, Response } from "express";
import * as home from "../content/home.js";
import { faqs } from "../content/faqs.js";
import { createLead } from "../models/leadModel.js";
import { listPublishedTestimonials } from "../models/testimonialModel.js";
import { meta } from "../seo/meta.js";
import { siteConfig } from "../site.js";
import { serviceSchema, faqSchema } from "../seo/jsonld.js";
import { isEmail } from "../utils.js";

function wantsJson(req: Request): boolean {
  return (
    req.xhr ||
    req.get("X-Requested-With") === "fetch" ||
    (req.get("Accept")?.includes("application/json") ?? false)
  );
}

export function submitLead(req: Request, res: Response) {
  const body = req.body as Record<string, string>;
  const values = {
    name: (body.name ?? "").trim(),
    email: (body.email ?? "").trim(),
    phone: (body.phone ?? "").trim(),
    city: (body.city ?? "").trim(),
    market: (body.market ?? "").trim(),
    volume: (body.volume ?? "").trim(),
  };

  let error: string | null = null;
  if (!values.name || !values.email || !values.city || !values.market) {
    error = "Please fill in the required fields.";
  } else if (!isEmail(values.email)) {
    error = "Please enter a valid email address.";
  }

  if (error) {
    if (wantsJson(req)) {
      return res.status(422).json({ error });
    }
    // No-JS fallback: re-render the home page with the error + entered values.
    return res.status(422).render("home", {
      meta: meta({
        title: siteConfig.title,
        description: siteConfig.description,
        canonicalPath: "/",
        jsonLd: [serviceSchema(), faqSchema()],
      }),
      home,
      faqs,
      testimonials: listPublishedTestimonials(),
      submitted: false,
      formError: error,
      formValues: values,
    });
  }

  createLead({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    city: values.city,
    market: values.market,
    volume: values.volume || null,
  });

  if (wantsJson(req)) {
    return res.status(201).json({ ok: true });
  }
  // Post/Redirect/Get to avoid resubmission; anchor back to the form.
  return res.redirect(303, "/?submitted=1#get-leads");
}
