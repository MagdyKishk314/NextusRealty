import { db } from "../db/database.js";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  market: string;
  volume: string | null;
  created_at: string;
}

export interface NewLead {
  name: string;
  email: string;
  phone?: string | null;
  city: string;
  market: string;
  volume?: string | null;
}

export function createLead(input: NewLead): number {
  const info = db
    .prepare(
      `INSERT INTO leads (name, email, phone, city, market, volume)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.email,
      input.phone ?? null,
      input.city,
      input.market,
      input.volume ?? null,
    );
  return Number(info.lastInsertRowid);
}

export function listLeads(limit = 200): Lead[] {
  return db
    .prepare(`SELECT * FROM leads ORDER BY id DESC LIMIT ?`)
    .all(limit) as unknown as Lead[];
}

export function countLeads(): number {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM leads`).get() as {
    n: number;
  };
  return row.n;
}
