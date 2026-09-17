import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import type { Interval, PlanId } from "./plans";

/**
 * The local payment provider: subscriptions change immediately and no money
 * moves. It backs the test checkout during development, and the seed script.
 * A real provider (Stripe) will write the same rows from its webhooks.
 */
export function localCheckoutEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_TEST_CHECKOUT === "1";
}

function periodEnd(interval: Interval): string {
  const end = new Date();
  if (interval === "year") end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  return end.toISOString();
}

export function grantPlan(userId: string, plan: Exclude<PlanId, "free">, interval: Interval, seats = 1): void {
  const now = nowIso();
  db()
    .prepare(
      `insert into subscriptions (id, user_id, plan, status, interval, seats, provider, current_period_end, cancel_at_period_end, created_at, updated_at)
       values (?, ?, ?, 'active', ?, ?, 'local', ?, 0, ?, ?)
       on conflict(user_id) do update set
         plan = excluded.plan, status = 'active', interval = excluded.interval, seats = excluded.seats,
         provider = 'local', current_period_end = excluded.current_period_end, cancel_at_period_end = 0,
         updated_at = excluded.updated_at`,
    )
    .run(newId(), userId, plan, interval, Math.max(1, seats), periodEnd(interval), now, now);
}

export function cancelAtPeriodEnd(userId: string): void {
  db().prepare("update subscriptions set cancel_at_period_end = 1, updated_at = ? where user_id = ?").run(nowIso(), userId);
}

export function resumePlan(userId: string): void {
  db().prepare("update subscriptions set cancel_at_period_end = 0, updated_at = ? where user_id = ?").run(nowIso(), userId);
}
