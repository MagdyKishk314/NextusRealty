/**
 * Static copy for the Services page. Three verticals, each held to the same
 * Nextus standard (cold-called, confirmed, exclusive). Kept as data so the view
 * stays presentational and the wording lives in one place. Icons resolve to
 * inline SVG in views/partials/icon.ejs; `image` is the describing photo,
 * `examples` render as tags over it, and `includes` as the standard checklist.
 */

export type Service = {
  id: string; // anchor id, e.g. "wholesaling"
  kicker: string; // small "who it's for" label
  icon: string; // icon key resolved in partials/icon.ejs
  title: string;
  tagline: string;
  body: string;
  includes: string[]; // the checklist of what every opportunity carries
  examples: string[]; // typical types, rendered as tags over the photo
  image: string; // /img path to the describing photo
  imageAlt: string;
  ctaLabel: string;
  learnMore?: { href: string; label: string }; // optional link to a dedicated landing page
};

export const servicesIntro = {
  eyebrow: "Real estate lead generation",
  title: "High-Quality Real Estate Leads, Built for How You Close",
  subhead:
    "Wholesalers, listing agents, and home-service contractors run different plays, but they all lose the same way: on prospects no one confirmed. Whatever you close, every opportunity we send is cold-called, confirmed by a real person, and handed to you alone.",
};

export const services: Service[] = [
  {
    id: "wholesaling",
    kicker: "For wholesalers & investors",
    icon: "target",
    title: "Motivated Seller Leads",
    tagline: "Motivated sellers with a real reason to move.",
    body:
      "We work the phones for distressed and off-market situations: owners who need to sell, not the ones idly testing the market. Every seller is spoken to and qualified for motivation, property condition, and timeline before it reaches you, so your acquisitions time goes to contracts, not dead numbers.",
    includes: [
      "Confirmed motivation, not a scraped list of addresses",
      "Property condition and rough timeline captured on the call",
      "Direct phone verified reachable before delivery",
      "Exclusive to you, never sold to three other wholesalers",
    ],
    examples: ["Probate", "Pre-foreclosure", "Tired landlords", "Vacant / inherited", "Relocation"],
    image: "/img/service-wholesale.jpg",
    imageAlt: "House keys and signed paperwork on a desk, a closed off-market deal",
    ctaLabel: "Request seller leads",
    learnMore: { href: "/seller-leads", label: "More on motivated seller leads" },
  },
  {
    id: "listing",
    kicker: "For listing agents",
    icon: "home",
    title: "Listing Leads for Realtors",
    tagline: "Homeowners ready to list, matched to your market.",
    body:
      "Sellers for agents who would rather take listings than chase them. We target by area and property profile, then confirm the homeowner is genuinely planning to sell on a timeline worth your time, so you walk into listing appointments, not tire-kicking.",
    includes: [
      "Sellers screened for genuine intent and a real timeline",
      "Targeted to your area, price band, and property type",
      "Name, phone, and email verified before delivery",
      "One agent per property, delivered to you and no one else",
    ],
    examples: ["Relocation", "Downsizing", "Expired listings", "FSBO", "Equity-rich"],
    image: "/img/service-listing.jpg",
    imageAlt: "A For Sale sign in the front yard of a suburban home",
    ctaLabel: "Request listing leads",
    learnMore: { href: "/listing-leads", label: "More on listing leads" },
  },
  {
    id: "contractor",
    kicker: "For home-service contractors",
    icon: "wrench",
    title: "Contractor Leads",
    tagline: "Homeowners with a project and the intent to book it.",
    body:
      "Roofing, HVAC, solar, and the trades that live or die by their pipeline. We reach homeowners who actually have the job (a leaking roof, a dead AC, a quote to get), confirm the need and the property, and route it to one contractor, so you are not racing three other trucks to the driveway.",
    includes: [
      "Confirmed project and homeowner, not renters or browsers",
      "Service need and urgency captured on the call",
      "Matched to your trade and service area",
      "Exclusive: the job is yours alone",
    ],
    examples: ["Roofing", "HVAC", "Solar", "Storm damage", "Remodel"],
    image: "/img/service-contractor.jpg",
    imageAlt: "A contractor installing shingles on a residential roof",
    ctaLabel: "Request contractor leads",
    learnMore: { href: "/contractor-leads", label: "More on contractor leads" },
  },
];

