import { Router } from "express";
import { showHome } from "../controllers/homeController.js";
import { showFaq } from "../controllers/faqController.js";
import { showLanding } from "../controllers/landingController.js";
import { showPrivacy, showTerms } from "../controllers/legalController.js";
import { showBlogIndex, showBlogPost } from "../controllers/blogController.js";
import { robots, sitemap } from "../controllers/seoController.js";
import { adminRouter } from "./admin.js";

export const router = Router();

// Marketing
router.get("/", showHome);
// The old Services overview now lives on the home page; keep the URL alive.
router.get("/services", (_req, res) => res.redirect(301, "/#lead-types"));
router.get("/seller-leads", showLanding("seller-leads"));
router.get("/listing-leads", showLanding("listing-leads"));
router.get("/contractor-leads", showLanding("contractor-leads"));
router.get("/faq", showFaq);
router.get("/privacy", showPrivacy);
router.get("/terms", showTerms);

// Blog
router.get("/blog", showBlogIndex);
router.get("/blog/:slug", showBlogPost);

// SEO endpoints
router.get("/robots.txt", robots);
router.get("/sitemap.xml", sitemap);

// CMS
router.use("/admin", adminRouter);
