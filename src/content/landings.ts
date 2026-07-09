/**
 * Dedicated, keyword-targeted SEO landing pages (SEO Phase 3).
 *
 * Each entry is a self-contained page focused on one high-intent search term
 * (e.g. "motivated seller leads", "listing leads for realtors"), with its own
 * unique copy, meta, FAQ set, and Service schema. Kept as data so a single
 * view (views/landing.ejs) stays presentational and the wording lives in one
 * place. Icons resolve to inline SVG in views/partials/icon.ejs.
 */

export type LandingFaq = { q: string; a: string };

export type Landing = {
  slug: string; // URL path segment, e.g. "seller-leads"
  breadcrumbName: string; // label in the breadcrumb trail + nav
  metaTitle: string; // inner <title>, before the brand template
  metaDescription: string;

  hero: {
    eyebrow: string;
    h1: string;
    lead: string; // supporting subhead paragraph
    ctaLabel: string;
    image: string; // /img path (a .webp sibling is served when present)
    imageAlt: string;
    trustPoints: string[]; // short reassurance chips under the CTA
  };

  intro: { title: string; paragraphs: string[] };
  benefits: { icon: string; title: string; body: string }[];
  includes: { title: string; items: string[] };
  steps: { step: string; title: string; body: string }[];
  audience: { title: string; blurb: string; tags: string[] };
  faqs: LandingFaq[];
  related: { label: string; href: string }[]; // internal cross-links
  cta: { eyebrow: string; title: string; subhead: string; ctaLabel: string };

  // Service JSON-LD fields.
  serviceName: string;
  serviceType: string;
  serviceDescription: string;
  audienceType: string;
};

const sellerLeads: Landing = {
  slug: "seller-leads",
  breadcrumbName: "Seller Leads",
  metaTitle: "Motivated Seller Leads for Investors & Wholesalers",
  metaDescription:
    "Exclusive motivated seller leads, cold-called and confirmed for motivation, property condition, and timeline before they reach you. One buyer per lead, never resold.",

  hero: {
    eyebrow: "Motivated seller leads",
    h1: "Motivated Seller Leads, Cold-Called and Confirmed",
    lead:
      "Stop paying for scraped lists and shared seller data. Every seller lead we deliver is spoken to by a real person, qualified for genuine motivation, and handed to you alone.",
    ctaLabel: "Request seller leads",
    image: "/img/service-wholesale.jpg",
    imageAlt: "House keys and signed paperwork on a desk, a closed off-market deal",
    trustPoints: ["Confirmed by a human", "Exclusive to you", "Never resold"],
  },

  intro: {
    title: "What makes a Nextus seller lead different",
    paragraphs: [
      "Most seller leads are just data: a name and a number pulled from a list and sold to whoever pays. You spend your acquisition hours dialing dead numbers and talking to owners who never had any intention of selling.",
      "We work the phones first. Before a seller lead reaches you, a real person has already reached the owner, confirmed a genuine reason to sell, and captured the details that tell you whether the deal is worth your time. You get fewer leads, but every one is a real conversation waiting to happen.",
    ],
  },

  benefits: [
    {
      icon: "target",
      title: "Confirmed motivation",
      body:
        "Every seller is qualified for a real reason to move: probate, pre-foreclosure, a tired landlord, an inherited or vacant property. Not curiosity, motivation.",
    },
    {
      icon: "clipboard",
      title: "Condition & timeline captured",
      body:
        "Property condition and a rough selling timeline are noted on the call, so you can prioritize the deals closest to a contract.",
    },
    {
      icon: "shield",
      title: "Exclusive to you",
      body:
        "Each seller lead goes to one buyer. You are never racing three other wholesalers to the same distressed owner.",
    },
    {
      icon: "phone",
      title: "Verified and reachable",
      body:
        "The direct phone is confirmed reachable before delivery, so your first dial actually connects.",
    },
  ],

  includes: {
    title: "What every seller lead includes",
    items: [
      "Confirmed motivation, not a scraped list of addresses",
      "Property condition captured on the call",
      "A rough selling timeline in the owner's words",
      "Direct phone verified reachable before delivery",
      "Property address and owner name",
      "Exclusive to you, never sold to another buyer",
    ],
  },

  steps: [
    {
      step: "01",
      title: "We source",
      body:
        "We build target lists around distressed and off-market situations in your buy box: probate, pre-foreclosure, vacant, inherited, tired landlords.",
    },
    {
      step: "02",
      title: "We confirm",
      body:
        "Our team calls each owner, confirms genuine motivation, and captures condition and timeline. Anything that does not qualify never reaches you.",
    },
    {
      step: "03",
      title: "You close",
      body:
        "The confirmed seller lands with you alone, ready to work. You spend your time writing offers, not dialing dead numbers.",
    },
  ],

  audience: {
    title: "Who these seller leads are for",
    blurb:
      "If your business runs on a steady flow of motivated sellers, these leads are built for you.",
    tags: [
      "Wholesalers",
      "Fix-and-flip investors",
      "Buy-and-hold investors",
      "Cash buyers",
      "Small acquisition teams",
    ],
  },

  faqs: [
    {
      q: "What counts as a motivated seller lead?",
      a: "A homeowner our team has spoken to and confirmed has a genuine reason to sell, such as probate, pre-foreclosure, a vacant or inherited property, or a landlord ready to be done. We capture their motivation, the property condition, and a rough timeline before the lead reaches you.",
    },
    {
      q: "Are these seller leads exclusive?",
      a: "Yes. Every seller lead is delivered to one buyer only. We never resell a lead or hand the same owner to multiple wholesalers.",
    },
    {
      q: "How are the leads verified?",
      a: "A real person calls each seller, confirms motivation, and checks the direct phone is reachable before delivery. Leads that do not qualify never reach you.",
    },
    {
      q: "Can I target a specific market or property type?",
      a: "Yes. We build your target lists around your buy box: your markets, price bands, and the distressed situations you want, from probate to tired landlords.",
    },
    {
      q: "How do I get started?",
      a: "Book a short call and tell us what you buy and where. We put together a confirmed sample for your exact market, with no contract and no obligation.",
    },
  ],

  related: [
    { label: "Listing leads for realtors", href: "/listing-leads" },
    { label: "Contractor leads", href: "/contractor-leads" },
  ],

  cta: {
    eyebrow: "Get started",
    title: "Ready for seller leads that actually pick up?",
    subhead:
      "Tell us your market and buy box. We'll put together a confirmed sample of motivated seller leads, ready to work. No contract, no obligation.",
    ctaLabel: "Request seller leads",
  },

  serviceName: "Motivated Seller Lead Generation",
  serviceType: "Real estate lead generation",
  serviceDescription:
    "Exclusive motivated seller leads for wholesalers and investors, cold-called and confirmed for motivation, condition, and timeline before delivery.",
  audienceType: "Real estate investors and wholesalers",
};

const listingLeads: Landing = {
  slug: "listing-leads",
  breadcrumbName: "Listing Leads",
  metaTitle: "Listing Leads for Realtors & Listing Agents",
  metaDescription:
    "Exclusive listing leads for real estate agents: homeowners confirmed to be planning a sale in your market, verified and delivered to one agent, never shared.",

  hero: {
    eyebrow: "Listing leads for realtors",
    h1: "Listing Leads for Realtors, Ready to List",
    lead:
      "Spend your time in listing appointments, not chasing tire-kickers. Every listing lead is a homeowner we've confirmed is planning to sell, matched to your market and delivered to you alone.",
    ctaLabel: "Request listing leads",
    image: "/img/service-listing.jpg",
    imageAlt: "A For Sale sign in the front yard of a suburban home",
    trustPoints: ["Confirmed intent", "One agent per lead", "Verified contact"],
  },

  intro: {
    title: "Listing leads built for how agents actually win business",
    paragraphs: [
      "Shared portal leads put you in a race with a dozen other agents to reach a homeowner who filled out a form on a whim. Most never answer, and the ones who do were rarely ready to list.",
      "We do the qualifying first. Before a listing lead reaches you, our team has confirmed the homeowner is genuinely planning to sell on a real timeline, in your area and price band. You walk into listing appointments instead of dialing into voicemail.",
    ],
  },

  benefits: [
    {
      icon: "target",
      title: "Genuine seller intent",
      body:
        "Every homeowner is screened for a real plan to sell on a timeline worth your time, not idle curiosity about their home's value.",
    },
    {
      icon: "home",
      title: "Targeted to your market",
      body:
        "Leads are matched to your area, price band, and property type, so the listings fit the business you actually want.",
    },
    {
      icon: "phone",
      title: "Verified contact info",
      body:
        "Name, phone, and email are confirmed before delivery, so your outreach reaches the homeowner on the first try.",
    },
    {
      icon: "shield",
      title: "One agent per lead",
      body:
        "Each listing lead is exclusive to you. You are never competing with five other agents for the same appointment.",
    },
  ],

  includes: {
    title: "What every listing lead includes",
    items: [
      "A homeowner screened for genuine intent to sell",
      "A real selling timeline captured on the call",
      "Targeted to your area, price band, and property type",
      "Name, phone, and email verified before delivery",
      "The property and its rough profile",
      "One agent per property, delivered to you alone",
    ],
  },

  steps: [
    {
      step: "01",
      title: "We target",
      body:
        "We build outreach around your market and the seller profiles you want: relocations, downsizers, expired listings, FSBOs, equity-rich owners.",
    },
    {
      step: "02",
      title: "We confirm",
      body:
        "Our team reaches each homeowner, confirms a genuine plan to sell and a timeline, and verifies their contact details before anything reaches you.",
    },
    {
      step: "03",
      title: "You list",
      body:
        "The confirmed seller arrives with you alone. You spend your time in listing appointments, not chasing cold form fills.",
    },
  ],

  audience: {
    title: "Who these listing leads are for",
    blurb:
      "If you would rather take listings than chase them, these leads are built for you.",
    tags: [
      "Listing agents",
      "Real estate teams",
      "Brokerages",
      "Luxury specialists",
      "Agents building a pipeline",
    ],
  },

  faqs: [
    {
      q: "What is a listing lead?",
      a: "A homeowner our team has confirmed is genuinely planning to sell, matched to your market and price band. We verify their intent, timeline, and contact details before the lead reaches you.",
    },
    {
      q: "Are the listing leads exclusive to me?",
      a: "Yes. Each listing lead goes to one agent. You are never competing with other agents for the same homeowner.",
    },
    {
      q: "Can I choose my market and price range?",
      a: "Yes. We target by your area, price band, and property type, so the sellers we send fit the listings you want to take.",
    },
    {
      q: "How are the sellers qualified?",
      a: "A real person speaks with each homeowner, confirms a genuine plan to sell on a real timeline, and verifies name, phone, and email before delivery. Leads that do not qualify never reach you.",
    },
    {
      q: "How do I start getting listing leads?",
      a: "Book a short call and tell us your market and the listings you want. We put together a confirmed sample for your exact area, with no contract and no obligation.",
    },
  ],

  related: [
    { label: "Motivated seller leads", href: "/seller-leads" },
    { label: "Contractor leads", href: "/contractor-leads" },
  ],

  cta: {
    eyebrow: "Get started",
    title: "Ready to fill your calendar with listing appointments?",
    subhead:
      "Tell us your market and the listings you want. We'll put together a confirmed sample of listing leads, ready to work. No contract, no obligation.",
    ctaLabel: "Request listing leads",
  },

  serviceName: "Listing Lead Generation for Realtors",
  serviceType: "Real estate lead generation",
  serviceDescription:
    "Exclusive listing leads for real estate agents: homeowners confirmed to be planning a sale, matched to the agent's market and delivered to one agent only.",
  audienceType: "Real estate agents",
};

const contractorLeads: Landing = {
  slug: "contractor-leads",
  breadcrumbName: "Contractor Leads",
  metaTitle: "Contractor Leads for Roofing, HVAC & Home Services",
  metaDescription:
    "Exclusive contractor leads for roofing, HVAC, solar, and the trades. Every homeowner is called and confirmed to have a real project, then routed to one contractor. Never shared.",

  hero: {
    eyebrow: "Contractor leads",
    h1: "Contractor Leads With a Real Project, Confirmed",
    lead:
      "Stop racing three other trucks to the same driveway. Every contractor lead is a homeowner we've confirmed has an actual job to book, matched to your trade and service area, and delivered to you alone.",
    ctaLabel: "Request contractor leads",
    image: "/img/service-contractor.jpg",
    imageAlt: "A contractor installing shingles on a residential roof",
    trustPoints: ["Confirmed project", "One contractor per lead", "Verified homeowner"],
  },

  intro: {
    title: "Contractor leads built for trades that live on their pipeline",
    paragraphs: [
      "Shared lead platforms sell the same homeowner to four contractors and let you fight it out on price. You burn hours quoting jobs that were never really yours, against trucks that were called at the same time.",
      "We qualify first. Before a contractor lead reaches you, our team has confirmed the homeowner has a real project, captured the need and urgency, and checked it fits your trade and service area. The job is routed to one contractor: you.",
    ],
  },

  benefits: [
    {
      icon: "target",
      title: "Confirmed project",
      body:
        "Every homeowner has an actual job on the table, a leaking roof, a dead AC, a quote to get, not renters or browsers pricing a someday project.",
    },
    {
      icon: "wrench",
      title: "Matched to your trade",
      body:
        "Leads are routed by trade and service area, so roofing goes to roofers and HVAC to HVAC, in the zip codes you actually cover.",
    },
    {
      icon: "phone",
      title: "Verified homeowner",
      body:
        "The homeowner and their contact details are confirmed before delivery, so your first call reaches the decision-maker.",
    },
    {
      icon: "shield",
      title: "Exclusive to you",
      body:
        "Each job goes to one contractor. You are never underbidding three other trucks that got the same lead.",
    },
  ],

  includes: {
    title: "What every contractor lead includes",
    items: [
      "A confirmed project, not a renter or a browser",
      "The service need and urgency captured on the call",
      "Matched to your trade and service area",
      "Homeowner name and property confirmed",
      "Direct phone verified reachable before delivery",
      "Exclusive to you, the job is yours alone",
    ],
  },

  steps: [
    {
      step: "01",
      title: "We source",
      body:
        "We build outreach around homeowners with real jobs in your trades and service area: roofing, HVAC, solar, storm damage, remodels.",
    },
    {
      step: "02",
      title: "We confirm",
      body:
        "Our team calls each homeowner, confirms the project, and captures the need and urgency. Anything that does not qualify never reaches you.",
    },
    {
      step: "03",
      title: "You book",
      body:
        "The confirmed job lands with you alone, ready to quote. You spend your time on estimates that convert, not price wars.",
    },
  ],

  audience: {
    title: "Who these contractor leads are for",
    blurb:
      "If your business runs on a steady flow of booked jobs, these leads are built for you.",
    tags: [
      "Roofing companies",
      "HVAC contractors",
      "Solar installers",
      "Storm damage & restoration",
      "Remodelers",
    ],
  },

  faqs: [
    {
      q: "What is a contractor lead?",
      a: "A homeowner our team has spoken to and confirmed has a real project in your trade, such as a roof replacement, an HVAC install, or a solar quote. We capture the need and urgency, and verify the homeowner before the lead reaches you.",
    },
    {
      q: "Are the contractor leads exclusive?",
      a: "Yes. Every contractor lead is routed to one contractor only. We never sell the same job to multiple trucks.",
    },
    {
      q: "Can I choose my trade and service area?",
      a: "Yes. We match leads to your trade and the zip codes you cover, so you only get jobs you can actually run.",
    },
    {
      q: "How are the homeowners qualified?",
      a: "A real person calls each homeowner, confirms the project and urgency, and checks the direct phone is reachable before delivery. Leads that do not qualify never reach you.",
    },
    {
      q: "How do I start getting contractor leads?",
      a: "Book a short call and tell us your trade and service area. We put together a confirmed sample for your exact market, with no contract and no obligation.",
    },
  ],

  related: [
    { label: "Motivated seller leads", href: "/seller-leads" },
    { label: "Listing leads for realtors", href: "/listing-leads" },
  ],

  cta: {
    eyebrow: "Get started",
    title: "Ready for jobs that are yours alone?",
    subhead:
      "Tell us your trade and service area. We'll put together a confirmed sample of contractor leads, ready to quote. No contract, no obligation.",
    ctaLabel: "Request contractor leads",
  },

  serviceName: "Contractor Lead Generation",
  serviceType: "Home services lead generation",
  serviceDescription:
    "Exclusive contractor leads for roofing, HVAC, solar, and the trades: homeowners confirmed to have a real project, matched to the contractor's trade and routed to one contractor only.",
  audienceType: "Home-service contractors",
};

/** All landing pages, in nav/sitemap order. */
export const landings: Landing[] = [sellerLeads, listingLeads, contractorLeads];

/** Look up a landing page by its slug. */
export function getLanding(slug: string): Landing | undefined {
  return landings.find((l) => l.slug === slug);
}
