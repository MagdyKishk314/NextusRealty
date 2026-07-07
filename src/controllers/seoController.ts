import type { Request, Response } from "express";
import { siteConfig, absoluteUrl } from "../site.js";
import { listPublishedPosts } from "../models/postModel.js";
import { escapeHtml } from "../utils.js";

export function robots(_req: Request, res: Response) {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /leads",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Host: ${siteConfig.url}`,
    "",
  ].join("\n");
  res.type("text/plain").send(body);
}

export function sitemap(_req: Request, res: Response) {
  const urls: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: absoluteUrl("/"), priority: "1.0" },
    { loc: absoluteUrl("/services"), priority: "0.8" },
    { loc: absoluteUrl("/faq"), priority: "0.7" },
    { loc: absoluteUrl("/blog"), priority: "0.7" },
  ];

  for (const post of listPublishedPosts()) {
    urls.push({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: (post.updated_at ?? post.published_at ?? "").slice(0, 10) || undefined,
      priority: "0.6",
    });
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "";
        return (
          "  <url>\n" +
          `    <loc>${escapeHtml(u.loc)}</loc>\n` +
          lastmod +
          `    <priority>${u.priority}</priority>\n` +
          "  </url>"
        );
      })
      .join("\n") +
    "\n</urlset>\n";

  res.type("application/xml").send(xml);
}
