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

That's the whole reason we deliver every lead to a single client and never resell it.`,
    },
    {
      title: "What our lead manager confirms before a lead ships",
      category: "Verification",
      excerpt:
        "Every Nextus lead is called by a real person first. Here's exactly what we check before it reaches your pipeline.",
      body: `A form-fill is a guess. A confirmed lead is a fact.

Before anything ships, our team calls the lead directly and confirms the essentials: that the name and contact details are accurate, that the homeowner is genuinely ready to sell, list, or book the work, and that their timeline is real. Then, a few hours later, we call again to re-confirm.

We also note the little things that make your first call easier: their preferred contact time, the market they're focused on, and where they are in the process. By the time a lead reaches you, someone on our team has already spoken with them, twice.`,
    },
    {
      title: "Cold calling done right: how we source in your market",
      category: "Sourcing",
      excerpt:
        "We buy the data, then put top callers on the phone. A look at how we turn a raw list into leads worth your time.",
      body: `A raw list is just names and numbers. What turns it into a lead is the conversation, and who is having it.

We buy the data, then put our best callers to work in your market, listening for genuine intent. When we find a homeowner ready to sell, list, or book the work, we confirm the details and route it to one client.

It costs more than a scraped list resold ten times over, and that's exactly the point. Fewer, better leads mean bigger closings.`,
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
