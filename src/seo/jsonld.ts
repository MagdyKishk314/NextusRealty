import { siteConfig, absoluteUrl } from "../site.js";
import { faqs } from "../content/faqs.js";
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
