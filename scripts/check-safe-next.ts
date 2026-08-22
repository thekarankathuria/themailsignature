/**
 * safeNext guard smoke test.
 *
 * safeNext() decides where a freshly-authenticated user lands. The URL
 * Standard strips ASCII tab/LF/CR from a URL *before* parsing, so a value
 * that looks path-relative under a naive `startsWith("/")` check can still
 * resolve to another origin (e.g. "/\t/evil.com" becomes "https://evil.com/"
 * once handed to `new URL(...)`). This guards against that class of open
 * redirect.
 *
 * Run with: npm test
 */
import { safeNext } from "../lib/safe-next";

const failures: string[] = [];
const check = (name: string, ok: boolean) => {
  if (!ok) failures.push(name);
};

const REJECTED = [
  "/\t/evil.com",
  "/\n/evil.com",
  "/\r/evil.com",
  "//evil.com",
  "/\\evil.com",
  "@evil.com",
  "https://evil.com",
  undefined,
  "",
];

for (const input of REJECTED) {
  const result = safeNext(input);
  check(`rejects ${JSON.stringify(input)} -> /generator`, result === "/generator");
}

const PASSED_THROUGH = ["/generator", "/generator?a=b"];

for (const input of PASSED_THROUGH) {
  const result = safeNext(input);
  check(`passes through ${JSON.stringify(input)} unchanged`, result === input);
}

if (failures.length) {
  console.error(`FAILED (${failures.length}):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(
  `All safeNext checks passed: ${REJECTED.length} rejected inputs, ${PASSED_THROUGH.length} passthrough inputs.`,
);
