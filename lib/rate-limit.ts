/**
 * Fixed-window rate limiter for the public POST routes.
 *
 * SCOPE, stated plainly: this counts in the memory of a single process. It
 * stops casual abuse and accidental retry storms from one client. It is NOT a
 * distributed limiter — behind more than one instance each process keeps its
 * own tally, so the effective limit multiplies by the instance count, and a
 * restart clears every window. Moving to several instances means moving this
 * to a shared store (Upstash/Redis) behind the same `rateLimit()` signature.
 *
 * The map is parked on globalThis so Next's dev hot-reload doesn't hand out a
 * fresh, empty limiter on every edit.
 */

type Window = { count: number; resetAt: number };

const store: Map<string, Window> =
  (globalThis as { __rateLimitStore?: Map<string, Window> }).__rateLimitStore ??
  new Map<string, Window>();
(globalThis as { __rateLimitStore?: Map<string, Window> }).__rateLimitStore = store;

/** Drop expired windows so the map can't grow without bound. */
function sweep(now: number): void {
  if (store.size < 512) return;
  for (const [key, window] of store) {
    if (window.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > options.limit) {
    return { ok: false, remaining: 0, retryAfterSeconds };
  }
  return {
    ok: true,
    remaining: options.limit - existing.count,
    retryAfterSeconds,
  };
}

/**
 * Best-effort client identity. `x-forwarded-for` is client-controlled unless a
 * trusted proxy overwrites it, so this is a throttling key, never an
 * authorization decision.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `${scope}:${ip}`;
}

/** Exported for tests. */
export function __resetRateLimitStore(): void {
  store.clear();
}
