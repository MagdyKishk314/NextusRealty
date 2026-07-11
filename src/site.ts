/**
 * Single source of truth for site-wide SEO + brand copy.
 * Every <meta> tag, Open Graph value, and JSON-LD block derives from here.
 *
 * NOTE: set `url` to your real production domain before going live; it drives
 * canonical URLs, the sitemap, robots, and absolute Open Graph image URLs.
 */
export const siteConfig = {
  name: "Nextus Realty",
  legalName: "Nextus Realty",

  // 👇 change to your live domain
  url: "https://www.nextusrealty.com",

  tagline: "Fewer leads. Bigger closings.",

  title: "Exclusive, Verified Real Estate Leads | Nextus Realty",
  titleTemplate: "%s | Nextus Realty",

  description:
    "Nextus Realty delivers exclusive real estate leads, every one cold-called and confirmed by our team before it reaches you. Verified, never resold.",

  keywords: [
    "real estate leads",
    "exclusive real estate leads",
    "verified real estate leads",
    "pre-qualified leads",
    "realtor leads",
    "motivated seller leads",
    "seller leads",
    "listing leads",
    "contractor leads",
    "real estate lead generation",
    "high quality real estate leads",
  ],

  locale: "en_US",
  contactEmail: "hello@nextusrealty.com",
  socials: [] as string[],

  ogImage: "/img/og.png",
} as const;

export type SiteConfig = typeof siteConfig;

/** Build a page <title>, applying the template to non-home pages. */
export function pageTitle(title?: string): string {
  if (!title) return siteConfig.title;
  return siteConfig.titleTemplate.replace("%s", title);
}

/** Resolve a site-relative path to an absolute URL (for canonical/OG). */
export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, siteConfig.url).toString();
}
