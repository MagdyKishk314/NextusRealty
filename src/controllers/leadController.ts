import type { Request, Response } from "express";
import * as home from "../content/home.js";
import { faqs } from "../content/faqs.js";
import { config } from "../config.js";
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

/**
 * Forward a lead to the configured endpoint (LEAD_FORWARD_URL — e.g. a Formspree
 * form or any webhook that emails you). Nothing is stored. Posted as JSON. If
 * the URL isn't set we log the submission and treat it as a success, so the form
 * still works before it's wired up.
 */
async function forwardLead(values: Record<string, string>): Promise<void> {
  const url = config.leadForwardUrl;
  if (!url) {
    console.warn("[lead] LEAD_FORWARD_URL not set — not forwarded:", values);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw new Error(`Lead forward failed: ${res.status} ${res.statusText}`);
  }
}

export async function submitLead(req: Request, res: Response) {
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
  let status = 422;
  if (!values.name || !values.email || !values.city || !values.market) {
    error = "Please fill in the required fields.";
  } else if (!isEmail(values.email)) {
    error = "Please enter a valid email address.";
  } else {
    try {
      await forwardLead(values);
    } catch (err) {
      console.error("[lead] forward error:", err);
      error = "Something went wrong sending your request. Please try again.";
      status = 502;
    }
  }

  if (error) {
    if (wantsJson(req)) {
      return res.status(status).json({ error });
    }
    // No-JS fallback: re-render the home page with the error + entered values.
    return res.status(status).render("home", {
      meta: meta({
        title: siteConfig.title,
        description: siteConfig.description,
        canonicalPath: "/",
        jsonLd: [serviceSchema(), faqSchema()],
      }),
      home,
      faqs,
      submitted: false,
      formError: error,
      formValues: values,
    });
  }

  if (wantsJson(req)) {
    return res.status(201).json({ ok: true });
  }
  // Post/Redirect/Get to avoid resubmission; anchor back to the form.
  return res.redirect(303, "/?submitted=1#get-leads");
}
