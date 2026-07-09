# Nextus Realty

Marketing site + lightweight CMS for **Nextus Realty** - exclusive, verified
real estate leads.

A **classic MVC monolith**, deliberately minimal-dependency:

- **TypeScript** models & controllers
- **Express** routing
- **EJS** server-rendered views
- **`node:sqlite`** (Node's built-in SQLite) - no ORM, no external database
- **esbuild** for a tiny vanilla-TS client bundle
- **Hand-written CSS** - no framework build

The positioning never mentions price. The differentiator is the process: every
lead is cold-called and confirmed by a real lead manager before it ships,
exclusively, to one agent.

## Requirements

- Node.js **22.5+** (uses the built-in `node:sqlite` module; developed on 26)

## Getting started

```bash
npm install
npm run seed     # sample blog posts
npm run dev      # builds the client bundle, then runs the server with reload
```

Open <http://localhost:3000>. The CMS is at <http://localhost:3000/admin>
(default login `admin` / `nextus` - override with env vars, see below).

> `npm run dev` watches everything: it recompiles the server (`tsc --watch`),
> rebundles the client (`esbuild --watch`), and restarts the server on change
> (`node --watch`). No `tsx` - it doesn't run on Node 26.

## Scripts

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Watch + rebuild client & server, restart on change  |
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
  models/                 postModel (raw SQL)
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
| GET    | `/blog`                      | Blog index (published posts)     |
| GET    | `/blog/:slug`                | Single post                      |
| GET    | `/robots.txt`, `/sitemap.xml`| SEO endpoints (sitemap is dynamic) |
| \*     | `/admin`, `/admin/...`       | CMS (posts, leads), auth |

## CMS

`/admin` is a small server-rendered CMS behind HTTP Basic Auth:

- **Blog** - create/edit/delete posts; drafts are hidden from the public site.

## Configuration (env vars)

Copy `.env.example` to `.env` and edit it - the app loads `.env` automatically
on boot (via `process.loadEnvFile()`). Real environment variables set by your
host take precedence over the file, and a missing `.env` just falls back to the
defaults below.

| Variable                       | Default              | Notes                          |
| ------------------------------ | -------------------- | ------------------------------ |
| `PORT`                         | `3000`               |                                |
| `DB_PATH`                      | `data/nextus.db`     | SQLite file location           |
| `ADMIN_USER` / `ADMIN_PASSWORD`| `admin` / `nextus`   | **Change before deploying**    |
| `SESSION_SECRET`               | dev fallback         | Signs the admin session cookie; set a long random value in production (`openssl rand -hex 32`) |
| `GA_MEASUREMENT_ID`            | *(empty)*            | GA4 Measurement ID (`G-…`) — enables Google Analytics |
| `GSC_VERIFICATION`             | *(empty)*            | Google Search Console meta-tag verification token (optional; DNS also works) |

## Deploy (Vercel)

Vercel natively detects Express: `src/app.ts` default-exports the app, which
Vercel compiles and runs as a single Vercel Function. `vercel.json` runs
`npm run build` (bundles the client script into `public/`) and includes the EJS
`views/` in the function. Static assets are served from `public/` by Vercel's
CDN - note `express.static` is ignored on Vercel, so every asset must live in
`public/`. Node 24 (Vercel's default LTS) is pinned via `engines` in
`package.json`; `node:sqlite` runs natively there, no flag needed. (`npm start`
still runs `src/server.ts` locally.)

1. Import the repo in Vercel (or run `vercel --prod`) - no framework preset
   needed; `vercel.json` configures the build.
2. Set project **Environment Variables**: `ADMIN_USER`, `ADMIN_PASSWORD`, and
   `SESSION_SECRET` (see the table above).

> **⚠️ Storage is ephemeral on serverless.** Vercel's filesystem is read-only
> except `/tmp`, so the SQLite database (blog posts) lives at `/tmp/nextus.db`
> and uploads at `/tmp/uploads`. **Admin-authored blog posts and uploaded images
> do not persist** across cold starts or between instances (the sample posts are
> re-seeded on each cold start). The static marketing pages are unaffected.
> For a durable blog, point `DB_PATH` at a hosted SQLite/libSQL such as
> [Turso](https://turso.tech).

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

## Booking

The home page's call-to-action embeds a [Calendly](https://calendly.com) inline
widget (`views/home.ejs`, the `#get-leads` section) so visitors book a call
directly. Point the widget's `data-url` at your own Calendly scheduling link.
