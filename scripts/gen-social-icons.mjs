/**
 * Rasterises the social icons the signature templates link to.
 *
 * Email cannot use inline SVG, icon fonts, or CSS, so every icon has to be a
 * PNG at an absolute URL. Paths come from simple-icons; nothing is hand-drawn.
 *
 * Run with: npm run icons
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as simpleIcons from "simple-icons";
import { SLUGS, iconKey, svg, variants } from "./lib/social-svg.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "i", "social");

const missing = [];
let written = 0;

for (const slug of SLUGS) {
  const icon = simpleIcons[iconKey(slug)];
  if (!icon) {
    missing.push(slug);
    continue;
  }
  for (const [style, spec] of Object.entries(variants(icon))) {
    const dir = join(OUT, style);
    await mkdir(dir, { recursive: true });
    const png = await sharp(Buffer.from(svg(spec)))
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    await writeFile(join(dir, `${slug}.png`), png);
    written += 1;
  }
}

console.log(`Wrote ${written} icons to public/i/social`);
if (missing.length) {
  console.error(`Missing from simple-icons: ${missing.join(", ")}`);
  process.exit(1);
}
