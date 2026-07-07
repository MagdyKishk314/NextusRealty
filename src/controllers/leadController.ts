import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import * as home from "../content/home.js";
import { faqs } from "../content/faqs.js";
import { config } from "../config.js";
import { meta } from "../seo/meta.js";
import { siteConfig } from "../site.js";
import { serviceSchema, faqSchema } from "../seo/jsonld.js";
import { isEmail, escapeHtml } from "../utils.js";

type LeadValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  market: string;
  volume: string;
};

function wantsJson(req: Request): boolean {
  return (
    req.xhr ||
    req.get("X-Requested-With") === "fetch" ||
    (req.get("Accept")?.includes("application/json") ?? false)
  );
}

/** Human-readable label/value pairs, in the order they appear on the form. */
function leadFields(v: LeadValues): Array<[string, string]> {
  return [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone || "-"],
    ["Market / city", v.city],
    ["Lead type", v.market],
    ["Monthly volume", v.volume || "-"],
  ];
}

/** Email the lead to config.leadToEmail over Gmail SMTP (App Password auth). */
async function sendViaGmail(v: LeadValues): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
    // Bounded timeouts so a stuck SMTP connection can't hold a serverless
    // function open until its platform limit.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const fields = leadFields(v);
  const text = fields.map(([k, val]) => `${k}: ${val}`).join("\n");
  const html =
    `<h2 style="margin:0 0 14px;font-family:sans-serif">New lead from the Nextus Realty site</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    fields
      .map(
        ([k, val]) =>
          `<tr><td style="color:#64748b;padding-right:16px">${k}</td>` +
          `<td><strong>${escapeHtml(val)}</strong></td></tr>`,
      )
      .join("") +
    `</table>`;

  await transporter.sendMail({
    // Gmail sends as the authenticated account; reply goes to the lead.
    from: `Nextus Realty <${config.gmailUser}>`,
    to: config.leadToEmail,
    replyTo: v.email,
    subject: `New lead: ${v.name} - ${v.market}`,
    text,
    html,
  });
}

/**
 * Deliver a lead. Nothing is stored: we email it over Gmail SMTP when
 * configured, else log it so the form still works before it's wired up.
 * Throws on a delivery failure so the caller can surface a retry.
 */
async function deliverLead(v: LeadValues): Promise<void> {
  if (config.gmailUser && config.gmailAppPassword) return sendViaGmail(v);
  console.warn("[lead] Gmail SMTP not configured - not delivered:", v);
}

export async function submitLead(req: Request, res: Response) {
  const body = req.body as Record<string, string>;
  const values: LeadValues = {
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
      await deliverLead(values);
    } catch (err) {
      console.error("[lead] delivery error:", err);
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
