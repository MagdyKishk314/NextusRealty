import { db } from "../db/database.js";

export interface Signup {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  brokerage: string | null;
  market: string;
  message: string | null;
  created_at: string;
}

export interface NewSignup {
  name: string;
  email: string;
  phone?: string | null;
  brokerage?: string | null;
  market: string;
  message?: string | null;
}

export function createSignup(input: NewSignup): number {
  const info = db
    .prepare(
      `INSERT INTO signups (name, email, phone, brokerage, market, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.email,
      input.phone ?? null,
      input.brokerage ?? null,
      input.market,
      input.message ?? null,
    );
  return Number(info.lastInsertRowid);
}

export function listSignups(limit = 200): Signup[] {
  return db
    .prepare(`SELECT * FROM signups ORDER BY id DESC LIMIT ?`)
    .all(limit) as unknown as Signup[];
}

export function countSignups(): number {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM signups`).get() as {
    n: number;
  };
  return row.n;
}
