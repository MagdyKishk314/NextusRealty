/**
 * Generates the static social-share image at public/img/og.png.
 *
 * We rasterize an SVG with @resvg/resvg-js using the system fonts. A committed
 * PNG is what social platforms (Facebook, LinkedIn, X) reliably render.
 *
 * Re-run after changing the headline/brand:  npm run og
 */
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

mkdirSync(join(process.cwd(), "public", "img"), { recursive: true });
const OUT = join(process.cwd(), "public", "img", "og.png");

const NAVY_1 = "#0a0f1c";
const NAVY_2 = "#141d33";
const NAVY_3 = "#1c2942";
const GOLD = "#e9c46a";
const GOLD_SOFT = "#f5d99b";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY_1}"/>
      <stop offset="0.6" stop-color="${NAVY_2}"/>
      <stop offset="1" stop-color="${NAVY_3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0" r="0.8">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Brand row -->
  <rect x="72" y="60" width="64" height="64" rx="14" fill="${GOLD}"/>
  <text x="104" y="106" font-family="Georgia, serif" font-size="40" font-weight="700"
        text-anchor="middle" fill="${NAVY_1}">N</text>
  <text x="152" y="104" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="#ffffff">
    Nextus <tspan fill="${GOLD}">Realty</tspan>
  </text>

  <!-- Headline -->
  <text x="72" y="288" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">Exclusive, verified</text>
  <text x="72" y="366" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="${GOLD}">real estate leads</text>
  <text x="72" y="444" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">that actually close</text>

  <!-- Tagline -->
  <text x="74" y="506" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="400" fill="#ffffff" fill-opacity="0.6">Fewer leads. Bigger closings.</text>

  <!-- Divider + proof line -->
  <rect x="74" y="548" width="1052" height="1" fill="#ffffff" fill-opacity="0.12"/>
  <text x="74" y="590" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="1"
        fill="${GOLD_SOFT}">Exclusive · Verified · Pre-qualified · Never resold</text>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" },
});

const png = resvg.render().asPng();
writeFileSync(OUT, png);
console.log(`Wrote ${OUT} (${(png.length / 1024).toFixed(1)} KB)`);
