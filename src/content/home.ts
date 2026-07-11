/**
 * Static copy for the home-page sections. Kept as data so the EJS views stay
 * presentational and the wording lives in one place. Icons are referenced by
 * key and resolved to inline SVG in views/partials/icon.ejs.
 */

export const hero = {
  eyebrow: "Seller, listing & contractor leads",
  titleLead: "We set the standard for",
  titleAccent: "verified real estate leads",
  titleTail: "that close",
  subhead:
    "Every lead is cold-called and confirmed by our team, then handed to one client: you. We don't resell lists.",
  trustPoints: [
    { icon: "lock", label: "Exclusive, never resold" },
    { icon: "shield", label: "Pre-qualified intent" },
  ],
};

export const stats = [
  { value: "3.4×", label: "Higher close rate vs. shared leads" },
  { value: "1", label: "Client per lead, always exclusive" },
  { value: "100%", label: "Contact info verified before delivery" },
  { value: "<6h", label: "From capture to your pipeline" },
];

export const steps = [
  {
    icon: "phone",
    step: "01",
    title: "We pick up the phone",
    body: "We buy the data, then put real callers to work in your market, reaching real people and surfacing the ones actively looking to sell, list, or start a project right now. This is where every qualified lead begins.",
  },
  {
    icon: "shield",
    step: "02",
    title: "A real person confirms every lead",
    body: "Before anything ships, our team calls the lead directly, confirms their details are accurate, and asks the questions about timeline and intent, then calls again to re-confirm. Nothing reaches you until it clears that bar.",
  },
  {
    icon: "badge",
    step: "03",
    title: "You get it first, and alone",
    body: "The confirmed lead lands in your pipeline within hours, exclusively yours. No one else on the line, no bidding war, just a warm conversation waiting to happen.",
  },
];

export const confirmation = {
  eyebrow: "The confirmation calls",
  title: "We confirm every lead by phone, twice, before you get it",
  paragraphs: [
    "This is the step the rest of the industry skips. On the first call, our team reaches the homeowner directly and confirms it right there: that they are genuinely interested, ready to sell, list, or book the work, that their details are accurate, and that their timeline is real.",
    "Then, about six hours later, we call again to re-confirm. Only the leads that hold up on both calls get sent. So the person you reach isn't a cold form-fill, it's someone our team has spoken with twice and confirmed still wants to move.",
  ],
  checks: [
    "Genuine interest and intent, confirmed by voice",
    "Real urgency and timeline, not idle curiosity",
    "Phone and contact details verified live on the call",
    "Re-confirmed on a second call before it ever ships",
  ],
  card: {
    label: "Lead confirmation",
    manager: "Confirmed by our lead-management team",
    items: [
      "Spoke with the homeowner directly, twice",
      "Interest and timeline confirmed",
      "Contact details verified",
    ],
    status: "Ready to deliver, exclusive to you",
  },
};

export const features = {
  eyebrow: "Why clients trust Nextus",
  title: "What lands in your pipeline",
  subhead:
    "We deliver conversations our team has already confirmed are worth your time, matched to the business you actually want to write.",
  items: [
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

export const team = {
  eyebrow: "The people behind every lead",
  title: "Real people on every call, top of the market",
  subhead:
    "A lead is only as good as the person who confirmed it. Ours are sourced, developed, and confirmed by three specialist teams, staffed with the best callers in the business.",
  groups: [
    {
      icon: "phone",
      name: "Our callers",
      role: "Top-of-market callers",
      body: "The voices on the phone are our highest-paid people: near-native English speakers (CEFR C1+) who hold a real conversation and can tell genuine interest from a polite brush-off. Not a scripted rep racing a quota.",
    },
    {
      icon: "target",
      name: "Our LDS team",
      role: "Lead development specialists",
      body: "Every promising call goes to our Lead Development Specialists, who qualify intent, motivation, and timeline and develop a raw contact into a lead worth your time.",
    },
    {
      icon: "shield",
      name: "Our confirmation team",
      role: "Lead management",
      body: "Before anything ships, our lead-management team verifies the details, calls the lead a second time to re-confirm, and routes it to one client: you.",
    },
  ],
  callers: {
    eyebrow: "Callers, compared",
    title: "Why the caller is the product",
    subhead:
      "Most lead vendors run on the cheapest offshore labor they can find. We run on the most expensive, because the person on the phone is what decides whether a lead is real.",
    head: { offshore: "Industry standard", nextus: "Nextus callers" },
    rows: [
      { label: "English", offshore: "Heavy accent, scripted", nextus: "Near-native (C1+), natural" },
      { label: "Caliber", offshore: "Bottom-of-market pay", nextus: "Highest-paid callers in the market" },
      { label: "Approach", offshore: "Read a script, hit a quota", nextus: "Listen, qualify, build rapport" },
      { label: "Experience", offshore: "High churn, green reps", nextus: "Seasoned top performers" },
      { label: "Priority", offshore: "Volume over quality", nextus: "Quality over volume" },
    ],
  },
};

export const founder = {
  eyebrow: "About the founder",
  title: 'Built by a real <span class="accent">lead generation</span> expert',
  paragraphs: [
    "Nextus was built by Vladimir Selantev, a lead generation expert who has spent years generating deals for some of the biggest names in real estate, including Pace Morby, Jamil Damji, and Grant Cardone. For Grant Cardone alone, he managed a lead generation budget of more than $6.5 million a year.",
    "Before real estate, Vladimir spent nine years in ITAD (IT asset disposition) lead generation and wrote a book on winning Fortune 1000 contracts. Different industry, same discipline: pick up the phone, confirm real intent, and never hand a client a lead no one has spoken to. You can read more about his background at nextus.ai, his lead generation consultancy.",
  ],
  name: "Vladimir Selantev",
  role: "Founder, Nextus Realty",
  photo: "/img/vladimir.jpg",
  // Industry names Vladimir has generated deals for, shown orbiting his photo.
  peers: [
    { name: "Grant Cardone", photo: "/img/grant-cardone.webp" },
    { name: "Jamil Damji", photo: "/img/jamil-damji.jpg" },
    { name: "Pace Morby", photo: "/img/pace-morby.jpg" },
  ],
  moreUrl: "https://nextus.ai",
  credentials: [
    "Managed a $6.5M+ annual lead generation budget for Grant Cardone",
    "Generated deals with Pace Morby, Jamil Damji & Grant Cardone",
    "9 years in ITAD lead generation",
    "Author, How to Successfully Hunt Fortune 1000 Contracts",
    "15+ years generating leads",
  ],
  book: {
    cover: "/img/hunt-fortune-1000-cover.jpg",
    title: "How to Successfully Hunt Fortune 1000 Contracts",
    blurb:
      "Vladimir's playbook from nine years in ITAD lead generation, the same discipline behind every Nextus lead.",
  },
};

export type ComparisonValue = string | boolean;
export const comparison = {
  eyebrow: "Side by side",
  title: 'Lead generation, reimagined by <span class="accent">Nextus Realty</span>.',
  subhead:
    "This is the benchmark we set, line by line. Here's how a Nextus lead measures against what the rest of the industry hands you.",
  rows: [
    { label: "Who gets the lead?", typical: "Multiple clients", nextus: "Only you", highlight: false },
    {
      label: "Who buys the data?",
      typical: "You do",
      nextus: "We do",
      nextusTip: "We buy the underlying data for you and work it ourselves, so you pay for confirmed leads, not raw lists.",
      highlight: false,
    },
    {
      label: "Motivation?",
      typical: "Any",
      nextus: "Confirmed",
      nextusTip: "Sellers with real urgency (relocation, probate, hardship) and homeowners with an actual project, not casual browsers.",
      highlight: false,
    },
    {
      label: "Property targeting?",
      typical: "Any lead",
      nextus: "Your market",
      nextusTip: "Other companies just dial and hand you whatever lead answers. We target your market specifically, by property value, size, and the criteria you want.",
      highlight: false,
    },
    {
      label: "Contact info?",
      typical: "Unverified",
      nextus: "Verified",
      nextusTip: "Both phone and email are verified live on the confirming call. Email is optional; the phone is always confirmed reachable.",
      highlight: false,
    },
    { label: "Human confirmation?", typical: "None", nextus: "Every lead", highlight: false },
    {
      label: "Confirmed before delivery?",
      typical: "Never",
      nextus: "Twice",
      nextusTip: "We confirm interest and details at the end of the first call, then call again about six hours later to re-confirm before the lead is delivered.",
      highlight: false,
    },
    {
      label: "Intent screened?",
      typical: "Unscreened",
      nextus: "Pre-qualified",
      nextusTip: "Our LDS team (Lead Development Specialists) qualifies intent by listening to each lead before it ships.",
      highlight: false,
    },
    {
      label: "How you receive it?",
      typical: "By email",
      nextus: "Into your CRM",
      nextusTip: "Confirmed leads drop straight into your CRM the moment they're ready, no inbox digging or copy-paste.",
      highlight: false,
    },
    {
      label: "Pricing?",
      typical: "Monthly retainer",
      nextus: "Pay per lead",
      nextusTip: "Tell us your target volume, say three leads a week. We generate them and charge per lead as each one is delivered, one at a time.",
      highlight: false,
    },
    {
      label: "Close rate?",
      typical: "~1%",
      nextus: "~3.4%",
      nextusTip: "Averages across Nextus client campaigns; individual results vary.",
      highlight: false,
    },
    {
      label: "If a lead misses?",
      typical: "Counts anyway",
      nextus: "Replaced",
      nextusTip: "We send replacement leads for any lead that isn't qualified or has mistakes in its details.",
      highlight: false,
    },
    {
      label: "If leads go quiet?",
      typical: "Nothing",
      nextus: "Free reactivation",
      nextusTip: "We reactivate quiet leads free of charge within 2 months. After that, a reactivated lead counts as a full new lead.",
      highlight: false,
    },
  ] as Array<{
    label: string;
    typical: ComparisonValue;
    nextus: ComparisonValue;
    typicalTip?: string;
    nextusTip?: string;
    highlight: boolean;
  }>,
};
