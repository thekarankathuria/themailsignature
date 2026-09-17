"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/current";
import { sendMail } from "@/lib/mail";
import * as templates from "@/lib/mail/templates";
import { PLANS, formatPrice } from "@/lib/pricing";
import { cancelAtPeriodEnd, grantPlan, localCheckoutEnabled, resumePlan } from "./local";
import { PLAN_NAMES, planFor, subscriptionFor, type Interval, type PlanId } from "./plans";

/**
 * Plan changes. Today they run against the local provider, which moves no
 * money; a real provider will call the same functions from its webhooks.
 */
export type BillingFailure = { ok: false; error: string };

const longDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

function paidPlan(value: unknown): Exclude<PlanId, "free"> | null {
  return value === "pro" || value === "business" ? value : null;
}

export async function completeTestCheckout(input: { plan: string; interval: string; seats?: number }) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  if (!localCheckoutEnabled()) {
    return { ok: false, error: "Payments are not available yet." } satisfies BillingFailure;
  }
  const plan = paidPlan(input.plan);
  if (!plan) return { ok: false, error: "Choose a plan." } satisfies BillingFailure;
  const interval: Interval = input.interval === "year" ? "year" : "month";
  const seats = plan === "business" ? Math.max(3, Math.min(200, Number(input.seats) || 3)) : 1;

  grantPlan(user.id, plan, interval, seats);

  const priced = PLANS.find((p) => p.id === plan);
  const amount = priced
    ? `${formatPrice(interval === "year" ? priced.annual : priced.monthly)}${priced.perSeat ? ` per seat (${seats} seats)` : ""}`
    : "";
  await sendMail({
    to: user.email,
    ...templates.subscriptionStarted({
      plan: PLAN_NAMES[plan],
      interval,
      amount,
      periodEnd: longDate(subscriptionFor(user.id)?.currentPeriodEnd ?? null),
    }),
  });

  revalidatePath("/app/billing");
  redirect("/app/billing?upgraded=1");
}

export async function cancelPlanAction() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  const plan = planFor(user.id);
  if (plan === "free") return { ok: false, error: "There is nothing to cancel." } satisfies BillingFailure;

  cancelAtPeriodEnd(user.id);
  await sendMail({
    to: user.email,
    ...templates.subscriptionCanceled({
      plan: PLAN_NAMES[plan],
      periodEnd: longDate(subscriptionFor(user.id)?.currentPeriodEnd ?? null),
    }),
  });
  revalidatePath("/app/billing");
  return { ok: true as const };
}

export async function resumePlanAction() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  resumePlan(user.id);
  revalidatePath("/app/billing");
  return { ok: true as const };
}
