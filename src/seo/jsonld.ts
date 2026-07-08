import { siteConfig, absoluteUrl } from "../site.js";
import { faqs } from "../content/faqs.js";
import { services } from "../content/services.js";
import type { Post } from "../models/postModel.js";

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.contactEmail,
    ...(siteConfig.socials.length ? { sameAs: siteConfig.socials } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Exclusive Real Estate Lead Generation",
    serviceType: "Real estate lead generation",
    description: siteConfig.description,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    audience: { "@type": "Audience", audienceType: "Real estate agents" },
    offers: { "@type": "Offer", category: "Exclusive, verified real estate leads" },
  };
}

/** OfferCatalog of the three lead verticals shown on the Services page. */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Real Estate & Contractor Lead Generation",
    serviceType: "Lead generation",
    description:
      "Exclusive, human-confirmed leads for wholesalers, listing agents, and home-service contractors.",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "United States" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Nextus lead services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.tagline },
      })),
    },
  };
}

/** Home > … breadcrumb trail for an inner page. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "en-US",
  };
}
