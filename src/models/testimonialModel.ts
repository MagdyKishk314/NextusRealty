import { db } from "../db/database.js";

export type TestimonialStatus = "draft" | "published";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  status: TestimonialStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialInput {
  name: string;
  role: string;
  quote: string;
  rating: number;
  status: TestimonialStatus;
  sort_order: number;
}

export function listPublishedTestimonials(): Testimonial[] {
  return db
    .prepare(
      `SELECT * FROM testimonials
       WHERE status = 'published'
       ORDER BY sort_order ASC, id ASC`,
    )
    .all() as unknown as Testimonial[];
}

export function listAllTestimonials(): Testimonial[] {
  return db
    .prepare(`SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC`)
    .all() as unknown as Testimonial[];
}

export function getTestimonialById(id: number): Testimonial | undefined {
  return db
    .prepare(`SELECT * FROM testimonials WHERE id = ?`)
    .get(id) as unknown as Testimonial | undefined;
}

export function createTestimonial(input: TestimonialInput): number {
  const info = db
    .prepare(
      `INSERT INTO testimonials (name, role, quote, rating, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.role,
      input.quote,
      input.rating,
      input.status,
      input.sort_order,
    );
  return Number(info.lastInsertRowid);
}

export function updateTestimonial(id: number, input: TestimonialInput): void {
  db.prepare(
    `UPDATE testimonials
     SET name = ?, role = ?, quote = ?, rating = ?, status = ?,
         sort_order = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(
    input.name,
    input.role,
    input.quote,
    input.rating,
    input.status,
    input.sort_order,
    id,
  );
}

export function deleteTestimonial(id: number): void {
  db.prepare(`DELETE FROM testimonials WHERE id = ?`).run(id);
}
