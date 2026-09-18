import { db } from "@/lib/db";

/**
 * A user's plan, read from their subscription. The database row is the only
 * authority; nothing the browser sends can change it.
 */
export type PlanId = "free" | "pro" | "business";
export type Interval = "month" | "year";

export type Subscription = {
  id: string;
  userId: string;
  plan: PlanId;
  status: "active" | "canceled" | "past_due";
  interval: Interval;
  seats: number;
  provider: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

type Row = {
  id: string;
  user_id: string;
  plan: PlanId;
  status: Subscription["status"];
  interval: Interval;
  seats: number;
  provider: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
};

/**
 * The subscription this person pays for. A member of an organization has none
 * of their own, and this stays null for them: cancelling and resuming act on
 * what it returns, and a member must not be able to cancel the company's plan.
 */
export function subscriptionFor(userId: string): Subscription | null {
  const row = db().prepare("select * from subscriptions where user_id = ?").get(userId) as Row | undefined;
  return row ? toSubscription(row) : null;
}

/** The organization subscription this person is covered by, if any. */
export function orgSubscriptionFor(userId: string): Subscription | null {
  const row = db()
    .prepare(
      `select s.* from subscriptions s
         join memberships m on m.org_id = s.org_id
        where m.user_id = ?`,
    )
    .get(userId) as Row | undefined;
  return row ? toSubscription(row) : null;
}

/**
 * The subscription that decides what this person may do: the organization's
 * while it is live, otherwise their own.
 */
export function effectiveSubscription(userId: string): Subscription | null {
  const org = orgSubscriptionFor(userId);
  if (org && isLive(org)) return org;
  return subscriptionFor(userId);
}

function toSubscription(row: Row): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    interval: row.interval,
    seats: row.seats,
    provider: row.provider,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end === 1,
  };
}

/** Whether a subscription entitles anyone to anything at this moment. */
function isLive(sub: Subscription): boolean {
  if (sub.plan === "free" || sub.status !== "active") return false;
  const ended = sub.currentPeriodEnd !== null && new Date(sub.currentPeriodEnd).getTime() <= Date.now();
  return !(sub.cancelAtPeriodEnd && ended);
}

/** The plan in force right now, through an organization or on their own. */
export function planFor(userId: string): PlanId {
  const sub = effectiveSubscription(userId);
  if (!sub || !isLive(sub)) return "free";
  return sub.plan;
}

export const PLAN_NAMES: Record<PlanId, string> = { free: "Free", pro: "Pro", business: "Business" };

/**
 * The smallest Business subscription. Billing is the authority on this number
 * and `lib/pricing.ts` shows it, so the page and the checkout cannot drift.
 */
export const MIN_BUSINESS_SEATS = 3;
