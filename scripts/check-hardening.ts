/**
 * Hardening smoke tests: the rate limiter and the env guard.
 *
 * Both exist to fail in a specific, deliberate way — the limiter must refuse
 * the request *after* the allowance rather than at it, and the env guard must
 * name the missing variable instead of letting `undefined` reach a vendor
 * library. Off-by-one and message-quality bugs in those are exactly the kind
 * that go unnoticed until production, so they are asserted here.
 *
 * Run with: npm test
 */
import {
  __resetRateLimitStore,
  clientKey,
  rateLimit,
} from "../lib/rate-limit";
import { MissingEnvError, requiredEnv, siteUrl } from "../lib/env";
import { contentAddress } from "../lib/storage/images";

const failures: string[] = [];
const check = (name: string, ok: boolean) => {
  if (!ok) failures.push(name);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // --- rate limiter -------------------------------------------------------
  __resetRateLimitStore();
  const opts = { limit: 3, windowMs: 10_000 };

  const verdicts = [1, 2, 3, 4].map(() => rateLimit("k", opts).ok);
  check("allows exactly `limit` requests, refuses the next", 
    JSON.stringify(verdicts) === JSON.stringify([true, true, true, false]));

  const blocked = rateLimit("k", opts);
  check("refusal reports a positive Retry-After", blocked.retryAfterSeconds > 0);
  check("refusal reports zero remaining", blocked.remaining === 0);

  __resetRateLimitStore();
  rateLimit("a", opts);
  rateLimit("a", opts);
  check("separate keys keep independent counters", rateLimit("b", opts).remaining === 2);

  __resetRateLimitStore();
  const shortWindow = { limit: 1, windowMs: 60 };
  check("first call in window passes", rateLimit("w", shortWindow).ok);
  check("second call in window is refused", !rateLimit("w", shortWindow).ok);
  await sleep(90);
  check("window reopens once it has elapsed", rateLimit("w", shortWindow).ok);

  // --- client key ---------------------------------------------------------
  const keyed = clientKey(
    new Request("http://x/", { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } }),
    "contact",
  );
  check("clientKey takes the first x-forwarded-for hop", keyed === "contact:203.0.113.9");

  const bare = clientKey(new Request("http://x/"), "upload");
  check("clientKey falls back to a stable placeholder", bare === "upload:unknown");

  check(
    "scope namespaces the key so routes cannot share a budget",
    clientKey(new Request("http://x/"), "contact") !== bare,
  );

  // --- env guard ----------------------------------------------------------
  delete process.env.TMS_HARDENING_PROBE;
  let thrown: unknown;
  try {
    requiredEnv("TMS_HARDENING_PROBE");
  } catch (error) {
    thrown = error;
  }
  check("missing env throws MissingEnvError", thrown instanceof MissingEnvError);
  check(
    "the error names the variable and how to fix it",
    thrown instanceof Error &&
      thrown.message.includes("TMS_HARDENING_PROBE") &&
      thrown.message.includes(".env.local"),
  );
  process.env.TMS_HARDENING_PROBE = "   ";
  let blankThrew = false;
  try {
    requiredEnv("TMS_HARDENING_PROBE");
  } catch {
    blankThrew = true;
  }
  check("a whitespace-only value counts as missing", blankThrew);
  process.env.TMS_HARDENING_PROBE = " value ";
  check("a present value is trimmed", requiredEnv("TMS_HARDENING_PROBE") === "value");
  delete process.env.TMS_HARDENING_PROBE;

  // --- site url -----------------------------------------------------------
  const savedSite = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
  check("siteUrl strips the trailing slash", siteUrl() === "https://example.com");
  delete process.env.NEXT_PUBLIC_SITE_URL;
  check("siteUrl falls back to localhost", siteUrl() === "http://localhost:3000");
  if (savedSite !== undefined) process.env.NEXT_PUBLIC_SITE_URL = savedSite;

  // --- image storage ------------------------------------------------------
  const bytesA = Buffer.from("the same bytes");
  const bytesB = Buffer.from("the same bytes");
  const bytesC = Buffer.from("different bytes");

  check(
    "identical bytes get identical addresses",
    contentAddress(bytesA, "png") === contentAddress(bytesB, "png"),
  );
  check(
    "different bytes get different addresses",
    contentAddress(bytesA, "png") !== contentAddress(bytesC, "png"),
  );
  check(
    "the address carries the extension",
    contentAddress(bytesA, "gif").endsWith(".gif"),
  );
  check(
    "a gif and a png of the same bytes never collide",
    contentAddress(bytesA, "gif") !== contentAddress(bytesA, "png"),
  );
  check(
    "the address is 32 hex chars plus extension",
    /^[0-9a-f]{32}\.png$/.test(contentAddress(bytesA, "png")),
  );

  if (failures.length) {
    console.error(`FAILED (${failures.length}):`);
    for (const f of failures) console.error("  - " + f);
    process.exit(1);
  }
  console.log(
    "All hardening checks passed: rate limiter, client key, env guard, site URL, image addressing.",
  );
}

main();
