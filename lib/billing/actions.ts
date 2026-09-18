"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/current";
import { sendMail } from "@/lib/mail";
import * as templates from "@/lib/mail/templates";
import { PLANS, formatPrice } from "@/lib/pricing";
import { requireRole, TeamError } from "@/lib/teams/guard";
import { changeSeats, cleanSeats, startBusiness } from "@/lib/teams/subscribe";
import { cancelAtPeriodEnd, grantPlan, localCheckoutEnabled, resumePlan } from "./local";
import { PLAN_NAMES, subscriptionFor, type Interval, type PlanId } from "./plans";

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

export async function completeTestCheckout(input: {
  plan: string;
  interval: string;
  seats?: number;
  companyName?: string;
}) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  if (!localCheckoutEnabled()) {
    return { ok: false, error: "Payments are not available yet." } satisfies BillingFailure;
  }
  const plan = paidPlan(input.plan);
  if (!plan) return { ok: false, error: "Choose a plan." } satisfies BillingFailure;
  const interval: Interval = input.interval === "year" ? "year" : "month";
  const seats = plan === "business" ? cleanSeats(input.seats) : 1;

  if (plan === "business") {
    // Business buys a team, not just a plan: the organization and its owner
    // are created with the subscription.
    const started = startBusiness({
      userId: user.id,
      companyName: input.companyName ?? "",
      seats,
      interval,
    });
    if (!started.ok) return { ok: false, error: started.error } satisfies BillingFailure;
  } else {
    grantPlan(user.id, plan, interval, seats);
  }

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
  // A new Business owner has a team to set up, not a receipt to read.
  redirect(plan === "business" ? "/app/team?welcome=1" : "/app/billing?upgraded=1");
}

export async function cancelPlanAction() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  // The subscription they pay for, not the plan they enjoy: a member of a
  // team must not be able to cancel the company's plan.
  const subscription = subscriptionFor(user.id);
  if (!subscription || subscription.plan === "free") {
    return { ok: false, error: "There is nothing for you to cancel." } satisfies BillingFailure;
  }

  cancelAtPeriodEnd(user.id);
  await sendMail({
    to: user.email,
    ...templates.subscriptionCanceled({
      plan: PLAN_NAMES[subscription.plan],
      periodEnd: longDate(subscriptionFor(user.id)?.currentPeriodEnd ?? null),
    }),
  });
  revalidatePath("/app/billing");
  return { ok: true as const };
}

export async function resumePlanAction() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  if (!subscriptionFor(user.id)) {
    return { ok: false, error: "There is nothing for you to resume." } satisfies BillingFailure;
  }
  resumePlan(user.id);
  revalidatePath("/app/billing");
  return { ok: true as const };
}

/** An owner adding or removing seats on the team's plan. */
export async function changeSeatsAction(input: { seats: number }) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/billing");
  try {
    const { org } = requireRole(user.id, ["owner"]);
    const result = changeSeats(org.id, user.id, input.seats);
    if (!result.ok) return { ok: false, error: result.error } satisfies BillingFailure;
  } catch (error) {
    return { ok: false, error: error instanceof TeamError ? error.message : "That did not work." } satisfies BillingFailure;
  }
  revalidatePath("/app/billing");
  revalidatePath("/app/team");
  return { ok: true as const };
}
