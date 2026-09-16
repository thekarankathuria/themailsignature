/**
 * Launch gate (`npm run check:launch`). Fails while the site would say
 * something untrue in production: a cited feature that has not shipped,
 * a business-detail placeholder, or provisional prices.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { CLAIMS, SHIPPED_THROUGH_PHASE } from "../lib/marketing/claims";
import { PLACEHOLDER_PREFIX } from "../lib/marketing/company";
import { PRICES_PROVISIONAL } from "../lib/pricing";

const blockers: string[] = [];

for (const [id, claim] of Object.entries(CLAIMS)) {
  if (claim.shipsIn > SHIPPED_THROUGH_PHASE) {
    blockers.push(`claim "${id}" ships in phase ${claim.shipsIn}: ${claim.label}`);
  }
}

function scan(path: string) {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) scan(join(path, entry));
    return;
  }
  if (!/\.(ts|tsx)$/.test(path)) return;
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.includes(PLACEHOLDER_PREFIX) && !line.includes("PLACEHOLDER_PREFIX")) {
        blockers.push(`${path}:${i + 1} still has a placeholder`);
      }
    });
}
for (const root of ["lib/marketing", "app/(site)", "components/marketing"]) scan(root);

if (PRICES_PROVISIONAL) blockers.push("lib/pricing.ts: PRICES_PROVISIONAL is still true");

if (blockers.length) {
  console.error(`Not ready to launch (${blockers.length} blockers):`);
  for (const line of blockers) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Launch check passed: every claim shipped, no placeholders, final prices.");
