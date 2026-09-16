/**
 * Brand assets are generated, not hand-made, so they are easy to regenerate and
 * easy to get wrong silently. This asserts every file the layout references
 * exists, has the expected geometry, and clears a small set of cheap content
 * sanity checks (not blank, not clipped, not a solid fill, a transparent
 * knockout is genuinely transparent, the OG card has real contrast).
 *
 * What this file deliberately does NOT prove: that the ink is the *correct*
 * glyph. A 512x512 crop of the letter "T", padded so nothing touches an
 * edge, passes every check below — geometry, border-clip, and ink-coverage
 * band all look fine on a wrong-but-well-formed crop. Confirming the crop is
 * actually the envelope requires a human eye (or a reference image this repo
 * doesn't have) and was done manually when `markGenerousLeft`/`Right` were
 * tuned in scripts/gen-brand-assets.mjs (see task-2 fix round 1 report). If
 * the crop window in that script ever moves, re-eyeball mark.png by hand —
 * this gate cannot do it for you.
 */
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const EXPECTED: Array<{ file: string; width: number; height?: number }> = [
  { file: "public/brand/wordmark.png", width: 560 },
  { file: "public/brand/wordmark@2x.png", width: 1120 },
  { file: "public/brand/wordmark-light.png", width: 560 },
  { file: "public/brand/wordmark-light@2x.png", width: 1120 },
  { file: "public/brand/mark.png", width: 512, height: 512 },
  { file: "public/brand/icon-192.png", width: 192, height: 192 },
  { file: "public/brand/icon-512.png", width: 512, height: 512 },
  { file: "public/brand/og.png", width: 1200, height: 630 },
  { file: "app/icon.png", width: 512, height: 512 },
];

const failures: string[] = [];

type RGB = [number, number, number];
const WHITE: RGB = [255, 255, 255];
const NAVY: RGB = [0x0b, 0x1f, 0x52];

function isNearColour(r: number, g: number, b: number, target: RGB, tol = 20): boolean {
  return Math.abs(r - target[0]) <= tol && Math.abs(g - target[1]) <= tol && Math.abs(b - target[2]) <= tol;
}

async function readRaw(file: string) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/**
 * Border-clip check (fix round 1): a crop can pass the geometry check above
 * while still slicing the artwork off at an edge. Ink touching any of the
 * four border rows/columns means the crop is too tight and the glyph is
 * clipped. Only meaningful for the square icon crops (mark.png and the
 * icons derived from it) — the wordmark/OG assets are deliberately trimmed
 * tight to their own bounding box and are expected to have ink at their
 * edges (a wordmark's first letter starts right at the left edge).
 */
async function findClippedEdges(file: string): Promise<string[]> {
  const { data, width, height, channels } = await readRaw(file);
  const isInk = (x: number, y: number) => {
    const idx = (y * width + x) * channels;
    const [r, g, b, a] = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    return a > 250 && !isNearColour(r, g, b, WHITE, 5);
  };
  const edges: string[] = [];
  if ([...Array(width).keys()].some((x) => isInk(x, 0))) edges.push("top");
  if ([...Array(width).keys()].some((x) => isInk(x, height - 1))) edges.push("bottom");
  if ([...Array(height).keys()].some((y) => isInk(0, y))) edges.push("left");
  if ([...Array(height).keys()].some((y) => isInk(width - 1, y))) edges.push("right");
  return edges;
}

/**
 * Ink-coverage band (fix round 2): the cheap general catch for a blank
 * (~0% ink) or solid-filled (~100% ink) raster — e.g. a knockout that came
 * out fully transparent or fully opaque, a crop that landed entirely on
 * background, or a composite step that silently painted the whole canvas
 * one colour. `background` says which colour counts as "not ink" for that
 * file; `"alpha"` means the file is meant to have a transparent ground, so
 * opacity itself is the ink test.
 */
async function inkCoverage(file: string, background: "white" | "navy" | "alpha"): Promise<number> {
  const { data, width, height, channels } = await readRaw(file);
  const total = width * height;
  let ink = 0;
  for (let i = 0; i < total; i++) {
    const idx = i * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    const isInk =
      background === "alpha"
        ? a > 128
        : a > 128 && !isNearColour(r, g, b, background === "white" ? WHITE : NAVY);
    if (isInk) ink++;
  }
  return ink / total;
}

const MIN_INK = 0.01; // 1%: catches a blank/near-blank raster
const MAX_INK = 0.6; // 60%: catches a solid-filled raster
const BACKGROUND_OF: Record<string, "white" | "navy" | "alpha"> = {
  "public/brand/wordmark.png": "white",
  "public/brand/wordmark@2x.png": "white",
  "public/brand/wordmark-light.png": "alpha",
  "public/brand/wordmark-light@2x.png": "alpha",
  "public/brand/mark.png": "white",
  "public/brand/icon-192.png": "white",
  "public/brand/icon-512.png": "white",
  "public/brand/og.png": "navy",
  "app/icon.png": "white",
};

/**
 * wordmark-light.png must be genuine white ink on a *transparent* ground.
 * This is the assertion that would have caught the original negate() bug
 * (task-2 fix round 1) automatically instead of by eye: that bug produced a
 * fully OPAQUE file (an inverted-to-black background), so alpha never
 * varied. Assert both halves: alpha genuinely varies (some pixels near-0,
 * some near-255 — a uniform fill of either fails), and the colour of the
 * opaque pixels is actually white/near-white, not some other flat colour.
 */
async function checkKnockout(file: string): Promise<string[]> {
  const { data, width, height, channels } = await readRaw(file);
  const total = width * height;
  let alphaMin = 255;
  let alphaMax = 0;
  let sumR = 0, sumG = 0, sumB = 0, opaqueCount = 0;
  for (let i = 0; i < total; i++) {
    const idx = i * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    if (a < alphaMin) alphaMin = a;
    if (a > alphaMax) alphaMax = a;
    if (a > 128) {
      opaqueCount++;
      sumR += r; sumG += g; sumB += b;
    }
  }
  const out: string[] = [];
  if (!(alphaMin < 50 && alphaMax > 200)) {
    out.push(`alpha does not vary (min ${alphaMin}, max ${alphaMax}) — not a transparent knockout`);
  }
  if (opaqueCount > 0) {
    const mean: RGB = [sumR / opaqueCount, sumG / opaqueCount, sumB / opaqueCount];
    if (!isNearColour(mean[0], mean[1], mean[2], WHITE, 25)) {
      out.push(`opaque ink colour rgb(${mean.map((v) => Math.round(v)).join(",")}) is not near-white`);
    }
  }
  return out;
}

/**
 * og.png is a social card: it must have a minimum share of pixels that
 * differ materially from the navy background (not a blank rectangle), and
 * that ink must contrast strongly against navy — unreadable low-contrast
 * text is the real-world failure mode for a card like this, not just "some
 * pixels differ".
 */
async function checkOgContrast(file: string): Promise<string[]> {
  const { data, width, height, channels } = await readRaw(file);
  const total = width * height;
  let ink = 0, sumR = 0, sumG = 0, sumB = 0;
  for (let i = 0; i < total; i++) {
    const idx = i * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    if (a > 128 && !isNearColour(r, g, b, NAVY)) {
      ink++;
      sumR += r; sumG += g; sumB += b;
    }
  }
  const out: string[] = [];
  const inkFraction = ink / total;
  if (inkFraction < 0.005) {
    out.push(`only ${(inkFraction * 100).toFixed(2)}% of the canvas differs from navy — looks blank`);
    return out;
  }
  const mean: RGB = [sumR / ink, sumG / ink, sumB / ink];
  const contrast = Math.sqrt(
    (mean[0] - NAVY[0]) ** 2 + (mean[1] - NAVY[1]) ** 2 + (mean[2] - NAVY[2]) ** 2,
  );
  if (contrast < 80) {
    out.push(
      `ink colour rgb(${mean.map((v) => Math.round(v)).join(",")}) has low contrast against navy (${contrast.toFixed(0)})`,
    );
  }
  return out;
}

// This repo's package.json has no "type": "module", so tsx transpiles .ts
// scripts as CommonJS and top-level await is unavailable (every other
// scripts/check-*.ts avoids it for the same reason). An async main() wrapper
// keeps the rest of the logic identical to a top-level-await version.
async function main() {
  for (const { file, width, height } of EXPECTED) {
    if (!existsSync(file)) {
      failures.push(`${file}: missing (run \`npm run brand\`)`);
      continue;
    }
    const meta = await sharp(file).metadata();
    if (meta.width !== width) failures.push(`${file}: width ${meta.width}, expected ${width}`);
    if (height && meta.height !== height) {
      failures.push(`${file}: height ${meta.height}, expected ${height}`);
    }
    if (statSync(file).size > 400 * 1024) failures.push(`${file}: over 400KB`);
  }

  // Border-clip: only the square icon crops are expected to have margin on
  // every side.
  for (const file of [
    "public/brand/mark.png",
    "public/brand/icon-192.png",
    "public/brand/icon-512.png",
    "app/icon.png",
  ]) {
    if (!existsSync(file)) continue;
    const clipped = await findClippedEdges(file);
    if (clipped.length) {
      failures.push(`${file}: artwork touches the ${clipped.join(", ")} edge(s) — glyph is clipped`);
    }
  }

  // Ink-coverage band: every raster should have *some* ink and not be a solid fill.
  for (const [file, background] of Object.entries(BACKGROUND_OF)) {
    if (!existsSync(file)) continue;
    const coverage = await inkCoverage(file, background);
    if (coverage < MIN_INK) {
      failures.push(`${file}: only ${(coverage * 100).toFixed(2)}% ink — looks blank`);
    } else if (coverage > MAX_INK) {
      failures.push(`${file}: ${(coverage * 100).toFixed(2)}% ink — looks like a solid fill`);
    }
  }

  for (const file of ["public/brand/wordmark-light.png", "public/brand/wordmark-light@2x.png"]) {
    if (!existsSync(file)) continue;
    for (const msg of await checkKnockout(file)) {
      failures.push(`${file}: ${msg}`);
    }
  }

  if (existsSync("public/brand/og.png")) {
    for (const msg of await checkOgContrast("public/brand/og.png")) {
      failures.push(`public/brand/og.png: ${msg}`);
    }
  }

  if (failures.length) {
    console.error("Brand asset check failed:");
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`Brand asset check passed: ${EXPECTED.length} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
