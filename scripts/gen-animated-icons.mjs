/**
 * Animated signature assets (npm run anim).
 *
 * Email clients strip CSS animation, so movement in a signature has to be an
 * animated GIF. Classic Outlook for Windows may show only the first frame, so
 * frame one of every GIF is the finished still image: the static icon, or a
 * solid status dot.
 *
 *   public/i/social-anim/<pulse|bounce|wiggle>/<style>/<slug>.gif
 *   public/i/status/<static|blink>-<hex>.gif
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import * as simpleIcons from "simple-icons";
import { SLUGS, iconKey, svg, variants } from "./lib/social-svg.mjs";

const SOCIAL_OUT = join("public", "i", "social-anim");
const STATUS_OUT = join("public", "i", "status");
const DELAY_MS = 90;

/** Glyph transforms per frame; frame 0 is always the untouched icon. */
const ANIMATIONS = {
  pulse: [1, 1.08, 1.16, 1.08, 1, 1, 1, 1].map((k) => `scale(${k})`),
  bounce: [0, -5, -9, -5, 0, 2, 0, 0].map((y) => `translate(0 ${y})`),
  wiggle: [0, -9, 9, -7, 7, -3, 0, 0].map((deg) => `rotate(${deg})`),
};

/** Keep in step with STATUS_COLORS in lib/signature/assets.ts */
const STATUS_COLORS = ["#22A55B", "#0050B8", "#E0A100", "#D93A3A", "#7A4CD9", "#12A3A8"];

async function gif(svgFrames, path) {
  const frames = await Promise.all(
    svgFrames.map((s) => sharp(Buffer.from(s)).png().toBuffer()),
  );
  const pipeline = frames.length > 1
    ? sharp(frames, { join: { animated: true } })
    : sharp(frames[0]);
  await pipeline.gif({ delay: DELAY_MS, loop: 0, effort: 10, dither: 0 }).toFile(path);
}

/** Frame one must match the static PNG, or Outlook shows a different icon. */
async function assertFirstFrame(gifPath, staticSvg) {
  const [a, b] = await Promise.all([
    sharp(gifPath, { pages: 1 }).ensureAlpha().raw().toBuffer(),
    sharp(Buffer.from(staticSvg)).ensureAlpha().raw().toBuffer(),
  ]);
  let off = 0;
  for (let i = 0; i < a.length; i += 4) {
    // Compare only visible pixels; GIF has one-bit transparency.
    if (a[i + 3] > 127 !== b[i + 3] > 127) off++;
    else if (a[i + 3] > 127 && Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 90) off++;
  }
  const ratio = off / (a.length / 4);
  if (ratio > 0.02) throw new Error(`${gifPath}: first frame differs from the static icon (${(ratio * 100).toFixed(1)}%)`);
}

let socialCount = 0;
for (const slug of SLUGS) {
  const icon = simpleIcons[iconKey(slug)];
  if (!icon) throw new Error(`Missing from simple-icons: ${slug}`);
  for (const [style, spec] of Object.entries(variants(icon))) {
    for (const [name, transforms] of Object.entries(ANIMATIONS)) {
      const dir = join(SOCIAL_OUT, name, style);
      await mkdir(dir, { recursive: true });
      const path = join(dir, `${slug}.gif`);
      await gif(transforms.map((t, i) => svg(spec, i === 0 ? "" : t)), path);
      if (slug === "linkedin") await assertFirstFrame(path, svg(spec));
      socialCount++;
    }
  }
}

/** GIF transparency is on/off, so a soft halo has to be an opaque pale tint. */
function tint(hex, amount) {
  const mix = (i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * amount + 255 * (1 - amount));
  return `#${[1, 3, 5].map((i) => mix(i).toString(16).padStart(2, "0")).join("")}`;
}

function dot(color, { opacity = 1, halo = 0 } = {}) {
  const haloCircle = halo
    ? `<circle cx="16" cy="16" r="${9 + halo}" fill="${tint(color, 0.28)}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${haloCircle}<circle cx="16" cy="16" r="9" fill="#FFFFFF"/><circle cx="16" cy="16" r="7" fill="${opacity === 1 ? color : tint(color, opacity)}"/></svg>`;
}

await mkdir(STATUS_OUT, { recursive: true });
let statusCount = 0;
for (const color of STATUS_COLORS) {
  const hex = color.slice(1).toLowerCase();
  await gif([dot(color)], join(STATUS_OUT, `static-${hex}.gif`));
  const blink = [
    { opacity: 1 },
    { opacity: 1, halo: 3 },
    { opacity: 1, halo: 5 },
    { opacity: 0.35 },
    { opacity: 0.15 },
    { opacity: 0.35 },
    { opacity: 1 },
    { opacity: 1 },
  ].map((f) => dot(color, f));
  await gif(blink, join(STATUS_OUT, `blink-${hex}.gif`));
  statusCount += 2;
}

console.log(`Wrote ${socialCount} animated social icons and ${statusCount} status dots.`);
