/**
 * Static copy for the home-page sections. Kept as data so the EJS views stay
 * presentational and the wording lives in one place. Icons are referenced by
 * key and resolved to inline SVG in views/partials/icon.ejs.
 */

export const hero = {
  eyebrow: "The standard for verified real estate leads",
  titleLead: "We set the standard for",
  titleAccent: "verified real estate leads",
  titleTail: "that close",
  tagline: "This is what a real lead looks like.",
  subhead:
    "Nextus Realty defines what a qualified lead should be. Every one is cold-called and confirmed by our team, then handed to a single agent: you. We don't sell lists. We set the bar the rest of the industry falls short of.",
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
  eyebrow: "What the industry gets wrong",
  title: "The industry sells leads by the pound. We decided that wasn't good enough.",
  subhead:
    "A raw list resold to seven agents isn't a head start. It's a race to voicemail. We built Nextus to end that. Every lead is cold-called and confirmed by a real person, because that is the only standard worth delivering.",
  typical: {
    heading: "The industry standard",
    items: [
      "Sold to 5–8 agents at once, so you're in a race, not a relationship",
      "Fake numbers, dead emails, and “just browsing” tire-kickers",
      "Hours of dials for a single callback",
      "Raw form-fills no one has actually spoken to",
    ],
  },
  nextus: {
    heading: "The Nextus standard",
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
    body: "No scraped lists, no recycled databases. Our team cold calls in your market and reaches real people, surfacing the ones actively looking to buy or sell right now. This is where every qualified lead begins.",
  },
  {
    icon: "shield",
    step: "02",
    title: "A real person confirms every lead",
    body: "Before anything ships, our lead manager calls the lead directly, confirms their details are accurate, and asks the questions about timeline and intent. Nothing reaches you until it clears that bar.",
  },
  {
    icon: "badge",
    step: "03",
    title: "You get it first, and alone",
    body: "The confirmed lead lands in your inbox within hours, exclusively yours. No competing agents, no bidding war, just a warm conversation waiting to happen.",
  },
];

export const features = {
  eyebrow: "Why agents trust Nextus",
  title: "The standard every lead is held to before it reaches you",
  subhead:
    "We don't sell raw lists. We deliver conversations our team has already confirmed are worth your time. This is the bar we hold, on every single lead.",
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
      body: "Real name, working number, valid email, confirmed intent. If it doesn't pass our checks, it doesn't reach you. No exceptions.",
    },
    {
      icon: "target",
      title: "Matched to your market",
      body: "We target by location and property type so the leads fit the business you actually want to write.",
    },
    {
      icon: "trending",
      title: "Ready to convert",
      body: "Pre-qualified intent is why our leads close at 3.4× the rate of shared lists. Your time goes to people who are genuinely ready to move.",
    },
    {
      icon: "clock",
      title: "Fresh, never recycled",
      body: "Leads reach you while intent is hot, in under six hours from the confirming call, not weeks-old data sold on repeat.",
    },
  ],
};

export type ComparisonValue = string | boolean;
export const comparison = {
  eyebrow: "The measure of a lead",
  title: "The same market. A completely different standard.",
  subhead:
    "This is the benchmark we set, line by line. Here's how a Nextus lead measures against what the rest of the industry hands you.",
  rows: [
    { label: "Sold to how many agents", typical: "5–8 agents", nextus: "You only", highlight: false },
    { label: "Who buys the data", typical: "You buy it", nextus: "We buy it for you", highlight: false },
    { label: "Seller motivation", typical: "Cash & flip shoppers", nextus: "Relocation, probate, hardship", highlight: false },
    { label: "Property targeting", typical: "Any interested lead", nextus: "Your market & price range", highlight: false },
    { label: "Contact info verified", typical: false, nextus: true, highlight: false },
    { label: "Confirmed by a real person", typical: false, nextus: true, highlight: true },
    { label: "Times confirmed before delivery", typical: "None", nextus: "Twice", highlight: false },
    { label: "Intent pre-qualified", typical: false, nextus: true, highlight: false },
    { label: "Pricing model", typical: "Monthly retainer", nextus: "Pay per lead", highlight: false },
    { label: "Typical close rate", typical: "~1%", nextus: "~3.4%", highlight: false },
    { label: "Replaced if it misses", typical: false, nextus: true, highlight: false },
    { label: "Reactivation if leads go quiet", typical: false, nextus: "Free for 2 months", highlight: false },
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
