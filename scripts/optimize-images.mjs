/**
 * Generate optimized WebP versions of the site's photos next to the JPEGs.
 * Run after adding/replacing an image:  node scripts/optimize-images.mjs
 * The WebP files are committed and referenced by the templates/CSS; the JPEGs
 * stay as a fallback for the rare browser without WebP support.
 */
import sharp from "sharp";
import { join } from "node:path";

const DIR = "public/img";

// [file, maxWidth, quality]
const targets = [
  ["hero.jpg", 1800, 72],
  ["service-wholesale.jpg", 1200, 74],
  ["service-listing.jpg", 1200, 74],
  ["service-contractor.jpg", 1200, 74],
];

for (const [file, width, quality] of targets) {
  const out = join(DIR, file.replace(/\.jpg$/, ".webp"));
  const info = await sharp(join(DIR, file))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(out);
  console.log(`${out}  ${(info.size / 1024).toFixed(0)}KB  ${info.width}x${info.height}`);
}
