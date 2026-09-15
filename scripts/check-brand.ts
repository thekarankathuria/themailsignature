/**
 * Brand assets are generated, not hand-made, so they are easy to regenerate and
 * easy to get wrong silently. This asserts every file the layout references
 * exists and has the expected geometry.
 */
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const EXPECTED: Array<{ file: string; width: number; height?: number }> = [
  { file: "public/brand/wordmark.png", width: 560 },
  { file: "public/brand/wordmark@2x.png", width: 1120 },
  { file: "public/brand/wordmark-light.png", width: 560 },
  { file: "public/brand/mark.png", width: 512, height: 512 },
  { file: "public/brand/icon-192.png", width: 192, height: 192 },
  { file: "public/brand/icon-512.png", width: 512, height: 512 },
  { file: "public/brand/og.png", width: 1200, height: 630 },
  { file: "app/icon.png", width: 512, height: 512 },
];

const failures: string[] = [];

/**
 * A crop can pass the geometry check above (right pixel dimensions) while
 * still slicing the artwork off at an edge — that is exactly the bug this
 * guards against (see task-2 fix round 1). Ink touching any of the four
 * border rows/columns means the crop is too tight and the glyph is clipped.
 */
async function findClippedEdges(file: string): Promise<string[]> {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const isInk = (x: number, y: number) => {
    const idx = (y * width + x) * channels;
    const [r, g, b, a] = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
    const opaque = a > 250;
    const nearWhite = r > 250 && g > 250 && b > 250;
    return opaque && !nearWhite;
  };
  const edges: string[] = [];
  if ([...Array(width).keys()].some((x) => isInk(x, 0))) edges.push("top");
  if ([...Array(width).keys()].some((x) => isInk(x, height - 1))) edges.push("bottom");
  if ([...Array(height).keys()].some((y) => isInk(0, y))) edges.push("left");
  if ([...Array(height).keys()].some((y) => isInk(width - 1, y))) edges.push("right");
  return edges;
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

  if (existsSync("public/brand/mark.png")) {
    const clipped = await findClippedEdges("public/brand/mark.png");
    if (clipped.length) {
      failures.push(
        `public/brand/mark.png: artwork touches the ${clipped.join(", ")} edge(s) — glyph is clipped`,
      );
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
