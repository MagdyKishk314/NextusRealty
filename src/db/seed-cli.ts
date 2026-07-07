/**
 * CLI entry for `npm run seed`. Kept separate from seed.ts so that module has
 * no top-level side effects - it's imported by the app (which seeds on boot in
 * serverless) and must stay a pure set of exports.
 */
import { seedIfEmpty } from "./seed.js";

const added = seedIfEmpty();
console.log(`Seed complete. Posts: ${added} added.`);
