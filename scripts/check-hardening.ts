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
import { MissingEnvError, isSupabaseConfigured, siteUrl } from "../lib/env";
import {
  contentAddress,
  isDurableStorageConfigured,
  storageBucket,
} from "../lib/storage/images";

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
  const saved = process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  check("missing config is not reported as configured", !isSupabaseConfigured());

  let thrown: unknown;
  try {
    // Imported lazily so the deletion above is in effect.
    (await import("../lib/env")).supabaseUrl();
  } catch (error) {
    thrown = error;
  }
  check("missing env throws MissingEnvError", thrown instanceof MissingEnvError);
  check(
    "the error names the variable and how to fix it",
    thrown instanceof Error &&
      thrown.message.includes("NEXT_PUBLIC_SUPABASE_URL") &&
      thrown.message.includes(".env.local"),
  );

  process.env.NEXT_PUBLIC_SUPABASE_URL = "   ";
  let blankThrew = false;
  try {
    (await import("../lib/env")).supabaseUrl();
  } catch {
    blankThrew = true;
  }
  check("a whitespace-only value counts as missing", blankThrew);
  if (saved === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = saved;

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

  const savedBucket = process.env.SUPABASE_STORAGE_BUCKET;
  delete process.env.SUPABASE_STORAGE_BUCKET;
  check("no bucket configured means disk storage", !isDurableStorageConfigured());
  check("storageBucket reports null when unset", storageBucket() === null);
  process.env.SUPABASE_STORAGE_BUCKET = "  signatures  ";
  check("a configured bucket is detected", isDurableStorageConfigured());
  check("the bucket name is trimmed", storageBucket() === "signatures");
  process.env.SUPABASE_STORAGE_BUCKET = "   ";
  check("a whitespace-only bucket counts as unset", !isDurableStorageConfigured());
  if (savedBucket === undefined) delete process.env.SUPABASE_STORAGE_BUCKET;
  else process.env.SUPABASE_STORAGE_BUCKET = savedBucket;

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
