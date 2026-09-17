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

export function subscriptionFor(userId: string): Subscription | null {
  const row = db().prepare("select * from subscriptions where user_id = ?").get(userId) as Row | undefined;
  if (!row) return null;
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

/** The plan in force right now. */
export function planFor(userId: string): PlanId {
  const sub = subscriptionFor(userId);
  if (!sub || sub.plan === "free" || sub.status !== "active") return "free";
  const ended = sub.currentPeriodEnd !== null && new Date(sub.currentPeriodEnd).getTime() <= Date.now();
  if (sub.cancelAtPeriodEnd && ended) return "free";
  return sub.plan;
}

export const PLAN_NAMES: Record<PlanId, string> = { free: "Free", pro: "Pro", business: "Business" };
