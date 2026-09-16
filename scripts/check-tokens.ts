/**
 * The palette is the brand. This asserts the tokens the components rely on
 * exist, and that the placeholder palette from the original template (green
 * `brand-*`, purple `taskgo-*`) is gone — leaving them would let a stale
 * utility class ship a colour that is not ours.
 */
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");
const failures: string[] = [];

const REQUIRED = [
  "--color-navy-900: #0b1f52",
  "--color-blue-brand-600: #0050b8",
  "--color-navy-50",
  "--color-blue-brand-50",
];
for (const token of REQUIRED) {
  if (!css.toLowerCase().includes(token.toLowerCase())) failures.push(`missing token: ${token}`);
}

const FORBIDDEN = [/--color-taskgo-/, /#1e866a/i, /#8b5cf6/i];
for (const pattern of FORBIDDEN) {
  if (pattern.test(css)) failures.push(`stale palette present: ${pattern}`);
}

if (failures.length) {
  console.error("Token check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Token check passed.");
