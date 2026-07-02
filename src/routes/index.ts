import { Router } from "express";
import { showHome } from "../controllers/homeController.js";
import { submitLead } from "../controllers/leadController.js";
import { showBlogIndex, showBlogPost } from "../controllers/blogController.js";
import { robots, sitemap } from "../controllers/seoController.js";
import { adminRouter } from "./admin.js";

export const router = Router();

// Marketing
router.get("/", showHome);
router.post("/leads", submitLead);

// Blog
router.get("/blog", showBlogIndex);
router.get("/blog/:slug", showBlogPost);

// SEO endpoints
router.get("/robots.txt", robots);
router.get("/sitemap.xml", sitemap);

// CMS
router.use("/admin", adminRouter);
