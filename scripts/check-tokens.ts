/**
 * The palette is the brand. This asserts the tokens the components rely on
 * exist with the exact values measured from the logo, that the placeholder
 * palette from the original template (green `brand-*`, purple `taskgo-*`) is
 * gone — leaving it would let a stale utility class ship a colour that is not
 * ours — and that no component under app/components/lib/scripts still
 * references a `brand-*`/`taskgo-*` utility class pointing at a token that no
 * longer exists (such a class renders unstyled or wrong-coloured while still
 * passing tsc, eslint and every other check in `npm test`).
 *
 * It also asserts, numerically, the WCAG contrast ratios of the fg/bg pairs
 * the UI actually puts together on dark surfaces — the class of bug that
 * shipped a 2.38:1 link and a 2.38:1 toggle in fix round 1 of task 3, neither
 * of which any of the string-based checks above would ever catch.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const css = readFileSync("app/globals.css", "utf8");
const failures: string[] = [];

// ---------------------------------------------------------------------------
// 1. Parse every --color-* custom property into an exact name -> hex map.
//    Exact parsing (rather than `css.includes(substring)`) is what stops
//    "--color-navy-50" being satisfied by "--color-navy-500": the two are
//    different keys in this map, never a substring relationship.
// ---------------------------------------------------------------------------
function parseColorTokens(source: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /--(color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) map.set(m[1], m[2].toLowerCase());
  return map;
}

const tokens = parseColorTokens(css);

// Tokens whose exact hex value is load-bearing (measured from the logo).
const REQUIRED_EXACT: Record<string, string> = {
  "color-navy-900": "#0b1f52",
  "color-blue-brand-600": "#0050b8",
};
for (const [name, value] of Object.entries(REQUIRED_EXACT)) {
  if (tokens.get(name) !== value) {
    failures.push(`missing or wrong token: --${name}: ${value} (found ${tokens.get(name) ?? "nothing"})`);
  }
}

// Tokens that must exist (any value) — the ends of the ramps components use.
const REQUIRED_PRESENT = ["color-navy-50", "color-blue-brand-50"];
for (const name of REQUIRED_PRESENT) {
  if (!tokens.has(name)) failures.push(`missing token: --${name}`);
}

// ---------------------------------------------------------------------------
// 2. Forbid the whole stale prefix, not just one literal hex. Reintroducing
//    --color-brand-50 with any other value must still fail: the problem is
//    the token existing at all, not which colour it happens to hold. The key
//    check (^brand-/^taskgo-) cannot be fooled by --color-blue-brand-*, whose
//    parsed key is "color-blue-brand-600" — it does not start with "brand-".
// ---------------------------------------------------------------------------
for (const name of tokens.keys()) {
  const bare = name.replace(/^color-/, "");
  if (/^brand-/.test(bare) || /^taskgo-/.test(bare)) {
    failures.push(`stale palette token present: --${name}`);
  }
}
// Belt-and-suspenders literal check for the two original placeholder hues,
// in case they ever get reintroduced under a different token name.
const FORBIDDEN_HEX = [/#1e866a/i, /#8b5cf6/i];
for (const pattern of FORBIDDEN_HEX) {
  if (pattern.test(css)) failures.push(`stale palette colour present: ${pattern}`);
}

// ---------------------------------------------------------------------------
// 3. Scan every .ts/.tsx source file for a stray brand-*/taskgo-* utility
//    class. A class like `accent-brand-600` compiles fine (Tailwind just
//    emits no rule for an unknown token) and passes tsc/eslint/next build —
//    it only fails visually, at runtime, in a browser. This is what caught
//    components/builder/panels.tsx and TemplateGrid.tsx in the original
//    task-3 pass; it needs to be a standing gate, not a one-off grep.
// ---------------------------------------------------------------------------
const SCAN_ROOTS = ["app", "components", "lib", "scripts"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const SCAN_EXT = new Set([".ts", ".tsx"]);
// Negative lookbehind excludes `blue-brand-*`, which is the correct current
// token family and must never be flagged by this scan.
const STALE_CLASS = /(?<!blue-)\bbrand-\d{2,3}\b|\btaskgo-\d{2,3}\b/;

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (entry === "check-tokens.ts") continue; // this file's own regex literals mention the banned names
    if (!SCAN_EXT.has(extname(path))) continue;
    const text = readFileSync(path, "utf8");
    if (STALE_CLASS.test(text)) {
      failures.push(`stale utility class in ${path}: matches ${STALE_CLASS}`);
    }
  }
}
for (const root of SCAN_ROOTS) {
  try {
    walk(root);
  } catch {
    // A missing root is not this check's problem.
  }
}

// ---------------------------------------------------------------------------
// 4. Numeric WCAG contrast for the fg/bg pairs the UI actually renders on
//    dark surfaces. String-based checks (1-3 above) can never catch a colour
//    that is valid, on-brand and simply too low-contrast against its own
//    background — that is exactly what shipped in fix round 1.
// ---------------------------------------------------------------------------
function relLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrastRatio(a: string, b: string): number {
  const [la, lb] = [relLuminance(a), relLuminance(b)];
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = "#ffffff";

type ContrastCheck = { label: string; fg: string; bg: string; min: number };
const CONTRAST_CHECKS: ContrastCheck[] = [
  // Auth "Sign up" / "Log in" links (app/(auth)/{login,signup}/page.tsx),
  // rendered on the card's white (light) / ink-900 (dark) background.
  { label: "auth link, light mode", fg: "color-blue-brand-600", bg: WHITE, min: 4.5 },
  { label: "auth link, dark mode", fg: "color-blue-brand-300", bg: "color-ink-900", min: 4.5 },
  // Toggle checked track and TemplateGrid selected border/ring and range
  // slider accent — all non-text UI, rendered inside Panel's dark:bg-ink-900.
  { label: "toggle/ring/accent, light mode", fg: "color-blue-brand-600", bg: WHITE, min: 3 },
  { label: "toggle/ring/accent, dark mode", fg: "color-blue-brand-400", bg: "color-ink-900", min: 3 },
];

function resolve(key: string): string | undefined {
  return key === WHITE ? WHITE : tokens.get(key);
}

for (const check of CONTRAST_CHECKS) {
  const fg = resolve(check.fg);
  const bg = resolve(check.bg);
  if (!fg || !bg) {
    failures.push(`contrast check "${check.label}" could not resolve ${check.fg} or ${check.bg}`);
    continue;
  }
  const ratio = contrastRatio(fg, bg);
  if (ratio < check.min) {
    failures.push(
      `contrast check "${check.label}" failed: ${fg} on ${bg} = ${ratio.toFixed(2)}:1, needs >= ${check.min}:1`,
    );
  }
}

if (failures.length) {
  console.error("Token check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Token check passed.");
