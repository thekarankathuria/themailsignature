/**
 * Content guard: the marketing site was once a verbatim clone of
 * customesignature.com. Deleting it is only half the fix — this asserts the
 * clone cannot creep back in through a copied component, a stale asset or a
 * pasted string. Runs as part of `npm test`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOTS = ["app", "components", "lib", "scripts", "public"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "u"]);
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md", ".html"]);

/** Each pattern is a launch blocker, not a style preference. */
const BANNED: Array<{ pattern: RegExp; why: string }> = [
  { pattern: /customesignature/i, why: "cloned company domain" },
  { pattern: /custom\s+esignature/i, why: "cloned company name" },
  { pattern: /\bMail Signature\b/, why: "old brand name; use TheMailSignature" },
  // Negative lookbehind so this does not also flag "themailsignature.com" —
  // the correct domain used throughout app/layout.tsx, robots.ts and
  // sitemap.ts — which contains the banned substring as a false positive.
  { pattern: /(?<!the)mailsignature\.com/i, why: "old domain; use themailsignature.com" },
  { pattern: /getrewardful/i, why: "cloned affiliate programme" },
  { pattern: /loom\.com\/(share|embed)/i, why: "third-party product video" },
  { pattern: /embedly\.com/i, why: "third-party embed of cloned videos" },
];

const offences: string[] = [];

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    // This script's own source necessarily spells out the banned substrings
    // inside its regex literals (and their `why` text) — exclude it from
    // scanning itself, or the guard could never pass.
    if (entry === "check-content.ts") continue;
    // Binary assets are checked by name only — their bytes may legitimately
    // contain anything, but a cloned file keeps its cloned filename.
    const isText = TEXT_EXT.has(extname(path));
    const haystack = isText ? readFileSync(path, "utf8") : path;
    for (const { pattern, why } of BANNED) {
      if (pattern.test(haystack)) offences.push(`${path}: ${pattern} (${why})`);
    }
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // A deleted root is the expected end state for public/ces — not an error.
  }
}

if (offences.length) {
  console.error(`Content guard found ${offences.length} banned reference(s):`);
  for (const line of offences.slice(0, 40)) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Content guard passed: no cloned brand references.");
