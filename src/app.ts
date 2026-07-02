import express from "express";
import type { Request, Response, NextFunction } from "express";
import { config } from "./config.js";
import { siteConfig, absoluteUrl } from "./site.js";
import { meta } from "./seo/meta.js";
import { pageTitle } from "./site.js";
import { organizationSchema, websiteSchema } from "./seo/jsonld.js";
import { router } from "./routes/index.js";

// Site-wide structured data is static; build it once.
const BASE_JSONLD = [organizationSchema(), websiteSchema()];

export function createApp() {
  const app = express();

  // Views (EJS)
  app.set("view engine", "ejs");
  app.set("views", config.viewsDir);
  app.set("trust proxy", true);

  // Body parsing (built into Express; no body-parser dependency)
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Static assets
  app.use(
    express.static(config.publicDir, {
      maxAge: config.env === "production" ? "7d" : 0,
      extensions: ["html"],
    }),
  );

  // Shared view locals for every render
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.site = siteConfig;
    res.locals.currentPath = req.path;
    res.locals.absoluteUrl = absoluteUrl;
    res.locals.baseJsonLd = BASE_JSONLD;
    res.locals.year = new Date().getFullYear();
    next();
  });

  // Routes
  app.use("/", router);

  // 404
  app.use((_req: Request, res: Response) => {
    res.status(404).render("error", {
      meta: meta({ title: pageTitle("Not found"), robots: "noindex" }),
      status: 404,
      heading: "Page not found",
      message: "The page you're looking for doesn't exist.",
    });
  });

  // 500
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).render("error", {
      meta: meta({ title: pageTitle("Something went wrong"), robots: "noindex" }),
      status: 500,
      heading: "Something went wrong",
      message: "An unexpected error occurred. Please try again.",
    });
  });

  return app;
}
