/**
 * Seeds sample content. Idempotent: only inserts into a table when it's empty,
 * so running it repeatedly (or on boot) is safe.
 *
 * Run manually with:  npm run seed
 */
import { db } from "./database.js";
import { createPost } from "../models/postModel.js";
import { slugify } from "../utils.js";

function isEmpty(table: string): boolean {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as {
    n: number;
  };
  return row.n === 0;
}

/** Seed sample blog posts when the table is empty. Safe to call on every boot. */
export function seedIfEmpty(): number {
  if (!isEmpty("posts")) return 0;

  const posts = [
    {
      title: "Why exclusive leads close at a higher rate",
      category: "Playbook",
      excerpt:
        "When a lead is shared with eight agents, you're not selling. You're racing. Here's what exclusivity actually changes about your day.",
      body: `Most lead vendors sell the same contact to a handful of agents at once. The moment that record is created, the clock starts and everyone is dialing the same person.

Exclusivity flips that dynamic. When a lead is yours alone, the first conversation is a conversation, not an interruption competing with four other calls. You can slow down, ask better questions, and actually build the relationship that leads to a signed contract.

That's the whole reason we deliver every lead to a single agent and never resell it.`,
    },
    {
      title: "What our lead manager confirms before a lead ships",
      category: "Verification",
      excerpt:
        "Every Nextus lead is called by a real person first. Here's exactly what we check before it reaches your inbox.",
      body: `A form-fill is a guess. A confirmed lead is a fact.

Before anything ships, our lead manager calls the lead directly and confirms the essentials: that the name and contact details are accurate, that the person is genuinely looking to buy or sell, and that their timeline is real.

We also note the little things that make your first call easier: their preferred contact time, the market they're focused on, and where they are in the process. By the time a lead reaches you, someone on our team has already spoken with them.`,
    },
    {
      title: "Cold calling done right: how we source in your market",
      category: "Sourcing",
      excerpt:
        "No scraped lists, no recycled databases. A look at how our team surfaces real buyers and sellers by picking up the phone.",
      body: `Good leads don't come from buying the same tired database everyone else already has. They come from conversations.

Our team works the phones in your market, reaching real people and listening for genuine intent. When we find someone actively looking to buy or sell, we confirm the details and match them to the agent best positioned to help.

It's slower than scraping a list, and that's exactly the point. Fewer, better leads mean bigger closings.`,
    },
  ];

  for (const p of posts) {
    createPost({
      slug: slugify(p.title),
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      category: p.category,
      image: null,
      status: "published",
    });
  }
  return posts.length;
}
