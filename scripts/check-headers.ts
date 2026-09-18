/**
 * Checks the security headers and the health endpoint against a running site.
 *
 *   npx next build && npx next start -p 3107 &
 *   BASE_URL=http://localhost:3107 npm run check:headers
 *
 * These are the headers a browser will not tell you are missing, so they are
 * worth asserting rather than assuming.
 */
export {};

const BASE = (process.env.BASE_URL ?? "http://localhost:3107").replace(/\/$/, "");

const failures: string[] = [];

function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail && !ok ? ` (${detail})` : ""}`);
}

const EXPECTED: Array<[string, (value: string) => boolean, string]> = [
  ["x-content-type-options", (v) => v === "nosniff", "nosniff"],
  ["referrer-policy", (v) => v === "strict-origin-when-cross-origin", "strict-origin-when-cross-origin"],
  ["x-frame-options", (v) => v.toUpperCase() === "DENY", "DENY"],
  ["permissions-policy", (v) => v.includes("camera=()") && v.includes("geolocation=()"), "camera and geolocation off"],
  ["strict-transport-security", (v) => /max-age=\d{7,}/.test(v), "a long max-age"],
];

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

async function main() {
  const response = await fetch(`${BASE}/`);
  check("homepage answers", response.status === 200, `status ${response.status}`);

  for (const [header, valid, expected] of EXPECTED) {
    const value = response.headers.get(header);
    check(`${header}`, Boolean(value && valid(value)), value ? `got "${value}", wanted ${expected}` : "missing");
  }

  const enforcing = process.env.CSP_ENFORCE === "1";
  const cspHeader = enforcing ? "content-security-policy" : "content-security-policy-report-only";
  const csp = response.headers.get(cspHeader);
  check(cspHeader, Boolean(csp), "missing");
  for (const directive of CSP_DIRECTIVES) {
    check(`csp has ${directive}`, Boolean(csp?.includes(directive)));
  }
  // The nonce is what makes this policy enforceable at all: Next streams its
  // hydration data in inline scripts, which 'self' alone would block.
  check("csp carries a nonce", /'nonce-[a-f0-9]{16,}'/.test(csp ?? ""));
  check("csp uses strict-dynamic", Boolean(csp?.includes("'strict-dynamic'")));
  check("csp allows no inline script keyword", !csp?.includes("'unsafe-inline' 'strict-dynamic'"));

  const second = await fetch(`${BASE}/`);
  const secondCsp = second.headers.get(cspHeader) ?? "";
  const nonceOf = (value: string) => value.match(/'nonce-([a-f0-9]+)'/)?.[1];
  check("every response gets a fresh nonce", Boolean(nonceOf(csp ?? "")) && nonceOf(csp ?? "") !== nonceOf(secondCsp));

  if (!enforcing) {
    // Turning the policy on by accident would break the editor for everybody
    // at once, so the enforcing header must be absent until somebody means it.
    check("csp is still report-only", !response.headers.get("content-security-policy"));
    // Browsers ignore this directive in a report-only policy and log an error
    // about it in every visitor's console.
    check("report-only csp omits upgrade-insecure-requests", !csp?.includes("upgrade-insecure-requests"));
  }

  check("framework version is not advertised", !response.headers.get("x-powered-by"));

  // Uploaded images are immutable, so they should be cached hard.
  const upload = await fetch(`${BASE}/u/does-not-exist.png`);
  const cache = upload.headers.get("cache-control") ?? "";
  check("uploads are cached immutably", cache.includes("immutable"), `got "${cache}"`);

  const health = await fetch(`${BASE}/api/health`);
  const body = (await health.json().catch(() => ({}))) as { status?: string; checks?: Record<string, string> };
  check("health endpoint answers 200", health.status === 200, `status ${health.status} ${JSON.stringify(body.checks)}`);
  check("health says ok", body.status === "ok", JSON.stringify(body.checks));
  check("health is not cached", (health.headers.get("cache-control") ?? "").includes("no-store"));

  // The development-only outbox must not exist in a production build.
  const outbox = await fetch(`${BASE}/dev/outbox`);
  check("the local outbox is not public", outbox.status === 404, `status ${outbox.status}`);

  if (failures.length) {
    console.error(`\nFAILED (${failures.length}):`);
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`\nHeader check passed against ${BASE}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
