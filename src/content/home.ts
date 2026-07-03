/**
 * Static copy for the home-page sections. Kept as data so the EJS views stay
 * presentational and the wording lives in one place. Icons are referenced by
 * key and resolved to inline SVG in views/partials/icon.ejs.
 */

export const hero = {
  eyebrow: "Exclusive, human-confirmed real estate leads",
  titleLead: "Exclusive, verified",
  titleAccent: "real estate leads",
  titleTail: "that actually close",
  tagline: "Fewer leads. Bigger closings.",
  subhead:
    "Nextus Realty delivers pre-qualified buyer and seller leads to a single agent: you. Every lead is cold-called and confirmed by a real person before it reaches you, so fewer, better leads mean bigger closings.",
  trustPoints: [
    { icon: "lock", label: "Exclusive, never resold" },
    { icon: "shield", label: "Pre-qualified intent" },
  ],
};

export const stats = [
  { value: "3.4×", label: "Higher close rate vs. shared leads" },
  { value: "1", label: "Agent per lead, always exclusive" },
  { value: "100%", label: "Contact info verified before delivery" },
  { value: "<6h", label: "From capture to your inbox" },
];

export const problem = {
  eyebrow: "The difference",
  title: "Most leads are sold by the pound. Ours are confirmed by hand.",
  subhead:
    "A raw list resold to seven agents isn't a head start. It's a race to voicemail. Every Nextus lead is cold-called and confirmed by a real person, so the ones you receive are ready to talk.",
  typical: {
    heading: "The typical lead",
    items: [
      "Sold to 5–8 agents at once, so you're in a race, not a relationship",
      "Fake numbers, dead emails, and “just browsing” tire-kickers",
      "Hours of dials for a single callback",
      "Raw form-fills no one has actually spoken to",
    ],
  },
  nextus: {
    heading: "The Nextus lead",
    items: [
      "Delivered to you and no one else. Full stop.",
      "Every phone and email verified before it reaches you",
      "Screened for real buying or selling intent and timeline",
      "Cold-called and confirmed by our lead manager before it ships",
    ],
  },
};

export const steps = [
  {
    icon: "phone",
    step: "01",
    title: "We pick up the phone",
    body: "No scraped lists, no recycled databases. Our team cold calls in your market and reaches real people, surfacing the ones actively looking to buy or sell right now.",
  },
  {
    icon: "shield",
    step: "02",
    title: "A real person confirms every lead",
    body: "Before anything ships, our lead manager calls the lead directly, confirms their details are accurate, and asks a few questions about their timeline and intent.",
  },
  {
    icon: "badge",
    step: "03",
    title: "You get it first, and alone",
    body: "The confirmed lead lands in your inbox within 24 hours, exclusively yours. No competing agents, no bidding war, just a warm conversation waiting to happen.",
  },
];

export const features = {
  eyebrow: "Why agents switch",
  title: "Every lead is touched by a human before it reaches you",
  subhead:
    "We don't sell raw lists. We deliver conversations our team has already confirmed are worth your time.",
  items: [
    {
      icon: "lock",
      title: "Exclusivity, guaranteed",
      body: "Every lead is delivered once, and only to you. You'll never dial a prospect who's already fielding calls from four other agents.",
    },
    {
      icon: "phone",
      title: "Confirmed by a real person",
      body: "Our lead manager calls every lead, confirms their details are accurate, and asks the questions that matter, before it ever reaches you.",
    },
    {
      icon: "badge",
      title: "Verified, not just captured",
      body: "Real name, working number, valid email, confirmed intent. If it doesn't pass our checks, it doesn't reach you.",
    },
    {
      icon: "target",
      title: "Matched to your market",
      body: "We target by location and property type so the leads fit the business you actually want to write.",
    },
    {
      icon: "trending",
      title: "Ready to convert",
      body: "Pre-qualified intent means dramatically higher close rates. Your time goes to people who are genuinely ready to move.",
    },
    {
      icon: "clock",
      title: "Fresh, never recycled",
      body: "Leads reach you while intent is hot, typically within 24 hours of the confirming call, not weeks-old data sold on repeat.",
    },
  ],
};

export type ComparisonValue = string | boolean;
export const comparison = {
  eyebrow: "Side by side",
  title: "The same market. A completely different lead.",
  subhead:
    "Not all leads are created equal. Here's how a Nextus lead stacks up against what most vendors hand you.",
  rows: [
    { label: "Sold to how many agents", typical: "5–8 agents", nextus: "You only", highlight: false },
    { label: "Contact info verified", typical: false, nextus: true, highlight: false },
    { label: "Confirmed by a real person", typical: false, nextus: true, highlight: true },
    { label: "Intent pre-qualified", typical: false, nextus: true, highlight: false },
    { label: "Typical close rate", typical: "~1%", nextus: "~3.4%", highlight: false },
    { label: "Replaced if it misses", typical: false, nextus: true, highlight: false },
  ] as Array<{
    label: string;
    typical: ComparisonValue;
    nextus: ComparisonValue;
    highlight: boolean;
  }>,
};

export const leadForm = {
  markets: [
    "Residential: buyer leads",
    "Residential: seller leads",
    "Luxury / high-net-worth",
    "Commercial",
    "Investment / multifamily",
  ],
  volumes: ["10–25 / month", "25–50 / month", "50–100 / month", "100+ / month"],
};
