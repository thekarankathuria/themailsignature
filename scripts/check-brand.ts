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
