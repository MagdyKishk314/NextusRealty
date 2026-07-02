# Nextus Realty

Marketing site + lightweight CMS for **Nextus Realty** — exclusive, verified
real estate leads.

A **classic MVC monolith**, deliberately minimal-dependency:

- **TypeScript** models & controllers
- **Express** routing
- **EJS** server-rendered views
- **`node:sqlite`** (Node's built-in SQLite) — no ORM, no external database
- **esbuild** for a tiny vanilla-TS client bundle
- **Hand-written CSS** — no framework build

The positioning never mentions price. The differentiator is the process: every
lead is cold-called and confirmed by a real lead manager before it ships,
exclusively, to one agent.

## Requirements

- Node.js **22.5+** (uses the built-in `node:sqlite` module; developed on 26)

## Getting started

```bash
npm install
npm run seed     # sample blog posts + (draft) testimonials
npm run dev      # builds the client bundle, then runs the server with reload
```

Open <http://localhost:3000>. The CMS is at <http://localhost:3000/admin>
(default login `admin` / `nextus` — override with env vars, see below).

> Note: `npm run dev` builds the client bundle once. If you change files in
> `src/client/`, re-run `npm run build:client` (or `npm run watch:client` in a
> second terminal).

## Scripts

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Build client, then run server with reload (tsx)     |
| `npm run build`        | Build client bundle + compile server to `dist/`     |
| `npm start`            | Run the compiled server (`node dist/server.js`)     |
| `npm run seed`         | Seed sample content (idempotent)                    |
| `npm run typecheck`    | Type-check server and client                        |
| `npm run og`           | Regenerate the Open Graph image (`public/img/og.png`) |
| `npm run watch:client` | Rebuild the client bundle on change                 |

## Project structure

```
src/
  server.ts               App entry (listen)
  app.ts                  Express app: views, static, locals, routes, errors
  config.ts               Env-driven config (port, paths, admin creds)
  site.ts                 SEO/brand source of truth (title, description, keywords)
  utils.ts                slugify, escapeHtml, textToHtml, formatDate, isEmail
  content/                Static home-page copy (home.ts) + FAQs (faqs.ts)
  seo/
    meta.ts               Per-page <meta> builder with defaults
    jsonld.ts             Organization/WebSite/Service/FAQPage/BlogPosting schema
  db/
    database.ts           node:sqlite connection + schema (runs on boot)
    seed.ts               Sample content seeder
  models/                 leadModel, postModel, testimonialModel (raw SQL)
  controllers/            home, lead, blog, admin, seo
  routes/                 index (public) + admin (basic-auth guarded)
  middleware/auth.ts      HTTP Basic Auth for /admin
  client/main.ts          Vanilla TS: FAQ accordion + AJAX lead form
views/                    EJS templates (partials, home, blog/, admin/, error)
public/                   Static assets (css/, js/bundle.js, img/og.png, icon.svg)
data/nextus.db            SQLite database (gitignored, created at runtime)
scripts/generate-og.mjs   Rasterizes the OG image from an SVG
```

## Routes

| Method | Path                         | Purpose                          |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/`                          | Home (all marketing sections)    |
| POST   | `/leads`                     | Lead capture → SQLite (JSON + no-JS) |
| GET    | `/blog`                      | Blog index (published posts)     |
| GET    | `/blog/:slug`                | Single post                      |
| GET    | `/robots.txt`, `/sitemap.xml`| SEO endpoints (sitemap is dynamic) |
| \*     | `/admin`, `/admin/...`       | CMS (posts + testimonials), auth |

## CMS

`/admin` is a small server-rendered CMS behind HTTP Basic Auth:

- **Leads** — every submission is stored and listed on the dashboard.
- **Blog** — create/edit/delete posts; drafts are hidden from the public site.
- **Testimonials** — create/edit/delete; **only published** testimonials appear
  on the home page (seeded ones are drafts, so the section stays hidden until
  you publish real ones).

## Configuration (env vars)

| Variable                       | Default              | Notes                         |
| ------------------------------ | -------------------- | ----------------------------- |
| `PORT`                         | `3000`               |                               |
| `DB_PATH`                      | `data/nextus.db`     | SQLite file location          |
| `ADMIN_USER` / `ADMIN_PASSWORD`| `admin` / `nextus`   | **Change before deploying**   |

## SEO

Server-rendered, so all metadata is in the initial HTML:

- Descriptive, keyword-first H1; brand tagline as a styled subline.
- Full `<meta>` set (title template, description, keywords, canonical, robots,
  Open Graph, Twitter card) built from `src/site.ts`.
- JSON-LD: `Organization` + `WebSite` site-wide; `Service` + `FAQPage` on home;
  `BlogPosting` on each article.
- Dynamic `robots.txt` and `sitemap.xml` (the sitemap includes every published
  post).

> **Before launch:** set your real domain in `src/site.ts` (`url`), change the
> admin credentials, and put the app behind HTTPS.

## Notes on the lead form

The form works with **and** without JavaScript. With JS it submits via `fetch`
and swaps in a success state; without JS it posts normally and redirects
(Post/Redirect/Get). Either way the lead lands in SQLite and shows in the CMS.
Wire up email/CRM forwarding in `src/controllers/leadController.ts` when ready.
