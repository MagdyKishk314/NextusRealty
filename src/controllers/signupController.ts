import type { Request, Response } from "express";
import * as home from "../content/home.js";
import { createSignup } from "../models/signupModel.js";
import { meta } from "../seo/meta.js";
import { pageTitle } from "../site.js";
import { isEmail } from "../utils.js";

const signupMeta = () =>
  meta({
    title: pageTitle("Agent sign up"),
    description:
      "Join Nextus Realty as an agent partner and start receiving exclusive, human-confirmed real estate leads in your market.",
    canonicalPath: "/signup",
  });

function renderSignup(
  res: Response,
  status: number,
  extra: {
    submitted: boolean;
    formError: string | null;
    formValues: Record<string, string>;
  },
) {
  res.status(status).render("signup", {
    meta: signupMeta(),
    markets: home.leadForm.markets,
    ...extra,
  });
}

export function showSignup(req: Request, res: Response) {
  renderSignup(res, 200, {
    submitted: req.query.submitted === "1",
    formError: null,
    formValues: {},
  });
}

export function submitSignup(req: Request, res: Response) {
  const body = req.body as Record<string, string>;
  const values = {
    name: (body.name ?? "").trim(),
    email: (body.email ?? "").trim(),
    phone: (body.phone ?? "").trim(),
    brokerage: (body.brokerage ?? "").trim(),
    market: (body.market ?? "").trim(),
    message: (body.message ?? "").trim(),
  };

  let error: string | null = null;
  if (!values.name || !values.email || !values.market) {
    error = "Please fill in the required fields.";
  } else if (!isEmail(values.email)) {
    error = "Please enter a valid email address.";
  }

  if (error) {
    return renderSignup(res, 422, {
      submitted: false,
      formError: error,
      formValues: values,
    });
  }

  createSignup({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    brokerage: values.brokerage || null,
    market: values.market,
    message: values.message || null,
  });

  // Post/Redirect/Get to avoid resubmission.
  return res.redirect(303, "/signup?submitted=1");
}
