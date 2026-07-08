import { siteConfig } from "../site.js";

export interface PageMeta {
  title: string; // full, ready-to-render <title>
  description: string;
  canonicalPath: string; // site-relative, e.g. "/" or "/blog"
  ogType: string;
  ogImage: string; // site-relative
  robots: string;
  jsonLd: object[]; // page-specific structured data
  preloadImage?: string; // optional LCP image to <link rel="preload"> (e.g. hero)
}

/** Build page meta with sensible site-wide defaults. */
export function meta(partial: Partial<PageMeta> = {}): PageMeta {
  return {
    title: partial.title ?? siteConfig.title,
    description: partial.description ?? siteConfig.description,
    canonicalPath: partial.canonicalPath ?? "/",
    ogType: partial.ogType ?? "website",
    ogImage: partial.ogImage ?? siteConfig.ogImage,
    robots: partial.robots ?? "index, follow",
    jsonLd: partial.jsonLd ?? [],
    preloadImage: partial.preloadImage,
  };
}
