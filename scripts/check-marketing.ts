/**
 * Marketing content guard (runs in `npm test`).
 *
 * The site sells a product that is still being built, so every capability the
 * copy mentions is registered in lib/marketing/claims.ts with the phase that
 * ships it. This asserts copy only cites registered claims, that every claim is
 * cited somewhere (an unused claim is a claim nobody reviews), that SEO strings
 * fit search-result limits, and that no unverifiable social proof slips in.
 * Unshipped claims and placeholders are reported, not failed: that is
 * `npm run check:launch`'s job.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { CLAIMS, SHIPPED_THROUGH_PHASE } from "../lib/marketing/claims";
import { collectClaimIds } from "../lib/marketing/collect-claims";
import { PAGE_META } from "../lib/marketing/pages";
import { COMPANY, PLACEHOLDER_PREFIX } from "../lib/marketing/company";
import { industrySeo } from "../lib/marketing/industry-seo";
import * as pricing from "../lib/pricing";
import { CONTENT_MODULES } from "../lib/marketing/content-index";

const failures: string[] = [];
const fail = (message: string) => failures.push(message);

// 1. Claim ids.
const cited = new Set<string>();
for (const [name, mod] of Object.entries({ ...CONTENT_MODULES, pricing })) {
  for (const id of collectClaimIds(mod)) {
    if (!(id in CLAIMS)) fail(`${name}: unknown claim id "${id}"`);
    cited.add(id);
  }
}
for (const id of Object.keys(CLAIMS)) {
  if (!cited.has(id)) fail(`claim "${id}" is registered but no copy cites it`);
}

// 2. SEO strings.
const seo: Array<[string, string, string]> = [
  ...Object.entries(PAGE_META).map(
    ([key, m]) => [`page ${key}`, m.title, m.description] as [string, string, string],
  ),
  ...Object.entries(industrySeo).map(
    ([slug, m]) => [`industry ${slug}`, m.title, m.description] as [string, string, string],
  ),
];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
for (const [where, title, description] of seo) {
  if (title.length > 60) fail(`${where}: title is ${title.length} chars (max 60)`);
  if (description.length > 155) fail(`${where}: description is ${description.length} chars (max 155)`);
  if (description.length < 70) fail(`${where}: description is ${description.length} chars (min 70)`);
  if (titles.has(title)) fail(`${where}: title duplicates ${titles.get(title)}`);
  if (descriptions.has(description)) fail(`${where}: description duplicates ${descriptions.get(description)}`);
  titles.set(title, where);
  descriptions.set(description, where);
}

// 3. Banned social proof and unverifiable claims.
const BANNED: Array<[RegExp, string]> = [
  [/\bAI\b/, "no AI claims"],
  [/[★☆⭐]/, "no star glyphs"],
  [/\b\d\.\d\s*\/\s*5\b|\bout of 5\b/i, "no ratings"],
  [/\brating/i, "no ratings"],
  [/\btestimonial/i, "no testimonials"],
  [/\btrusted by\b/i, "no social proof"],
  [/#1\b/, "no superlatives"],
  [/\b\d[\d,.]*\s*[kKmM]?\+?\s+(happy\s+)?(users|customers|companies|teams|professionals)\b/, "no usage numbers"],
];
const SCAN = ["app/(site)", "components/marketing", "lib/marketing", "lib/pricing.ts"];
const TEXT = new Set([".ts", ".tsx", ".json"]);

function scan(path: string) {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) scan(join(path, entry));
    return;
  }
  if (!TEXT.has(extname(path))) return;
  const text = readFileSync(path, "utf8");
  for (const [pattern, why] of BANNED) {
    const match = text.match(pattern);
    if (match) fail(`${path}: "${match[0]}" (${why})`);
  }
}
for (const root of SCAN) scan(root);

// 4. Reports.
const unshipped = Object.entries(CLAIMS)
  .filter(([, c]) => c.shipsIn > SHIPPED_THROUGH_PHASE)
  .map(([id, c]) => `${id} (phase ${c.shipsIn})`);
const placeholders = Object.entries(COMPANY)
  .filter(([, v]) => v.startsWith(PLACEHOLDER_PREFIX))
  .map(([k]) => k);

if (failures.length) {
  console.error("Marketing check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(
  `Marketing check passed: ${cited.size} claims cited, ${seo.length} SEO entries.` +
    ` Pending for launch: ${unshipped.length} unshipped claims, ${placeholders.length} company placeholders.`,
);
