import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { siteUrl } from "@/lib/env";
import type { Interval, PlanId } from "./plans";

/**
 * Stripe, behind the same interface as the local provider.
 *
 * Deliberately no SDK. Two things are needed from Stripe: a Checkout session
 * and a portal link, both plain form-encoded POSTs, and webhook verification,
 * which is an HMAC. Doing it here means every part can be tested without a
 * network and without mocking a library, which matters because this code was
 * written before anyone could run it against a real account.
 *
 * NOT YET EXERCISED AGAINST STRIPE. The signature verification and the event
 * handling are covered by tests; the two API calls are shaped from the
 * documented parameters but have never received a real response. Run through
 * test mode before trusting them with live keys.
 */
const API = "https://api.stripe.com/v1";

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

function secretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  return key;
}

/** The price id for a plan and billing period, from the environment. */
export function priceFor(plan: Exclude<PlanId, "free">, interval: Interval): string | null {
  const key = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  return process.env[key]?.trim() || null;
}

async function post(path: string, form: Record<string, string>): Promise<Record<string, unknown>> {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(form).toString(),
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const error = body.error as { message?: string } | undefined;
    throw new Error(`Stripe ${response.status}: ${error?.message ?? "request failed"}`);
  }
  return body;
}

/**
 * A Checkout session for a plan. The user id travels in client_reference_id so
 * the webhook can tell whose subscription this is without trusting the browser.
 */
export async function createCheckoutSession({
  userId,
  email,
  plan,
  interval,
  seats,
}: {
  userId: string;
  email: string;
  plan: Exclude<PlanId, "free">;
  interval: Interval;
  seats: number;
}): Promise<string> {
  const price = priceFor(plan, interval);
  if (!price) throw new Error(`No price configured for ${plan} ${interval}.`);

  const site = siteUrl();
  const session = await post("/checkout/sessions", {
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": String(Math.max(1, seats)),
    client_reference_id: userId,
    customer_email: email,
    success_url: `${site}/app/billing?upgraded=1`,
    cancel_url: `${site}/pricing`,
    "subscription_data[metadata][user_id]": userId,
    "subscription_data[metadata][plan]": plan,
    "metadata[user_id]": userId,
    "metadata[plan]": plan,
    allow_promotion_codes: "true",
  });

  const url = session.url;
  if (typeof url !== "string") throw new Error("Stripe returned no checkout URL.");
  return url;
}

/** The customer portal, where people change card details and cancel. */
export async function createPortalSession(customerId: string): Promise<string> {
  const session = await post("/billing_portal/sessions", {
    customer: customerId,
    return_url: `${siteUrl()}/app/billing`,
  });
  const url = session.url;
  if (typeof url !== "string") throw new Error("Stripe returned no portal URL.");
  return url;
}

/**
 * Verifies a webhook signature.
 *
 * Stripe signs `${timestamp}.${body}` with the endpoint secret. The timestamp
 * is checked so a captured request cannot be replayed later, and the
 * comparison is constant-time so it cannot be guessed a byte at a time.
 */
export function verifyWebhook({
  body,
  header,
  secret,
  toleranceSeconds = 300,
  now = Date.now(),
}: {
  body: string;
  header: string | null;
  secret: string;
  toleranceSeconds?: number;
  now?: number;
}): { ok: true; event: StripeEvent } | { ok: false; reason: string } {
  if (!header) return { ok: false, reason: "No signature header." };

  const parts = Object.fromEntries(
    header.split(",").map((piece) => {
      const [key, ...rest] = piece.trim().split("=");
      return [key, rest.join("=")];
    }),
  );
  const timestamp = Number(parts.t);
  const signature = parts.v1;
  if (!Number.isFinite(timestamp) || !signature) return { ok: false, reason: "Malformed signature header." };

  const age = Math.abs(now / 1000 - timestamp);
  if (age > toleranceSeconds) return { ok: false, reason: "Signature is too old." };

  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  const given = Buffer.from(signature, "utf8");
  const mine = Buffer.from(expected, "utf8");
  if (given.length !== mine.length || !timingSafeEqual(given, mine)) {
    return { ok: false, reason: "Signature does not match." };
  }

  try {
    return { ok: true, event: JSON.parse(body) as StripeEvent };
  } catch {
    return { ok: false, reason: "Body is not JSON." };
  }
}

export type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

/** True when this event has already been applied, so a retry changes nothing. */
export function alreadyHandled(eventId: string): boolean {
  const row = db()
    .prepare("select 1 as n from billing_events where provider = 'stripe' and provider_event_id = ?")
    .get(eventId);
  return Boolean(row);
}

function remember(event: StripeEvent): void {
  db()
    .prepare(
      `insert or ignore into billing_events (id, provider, provider_event_id, type, payload, received_at)
       values (?, 'stripe', ?, ?, ?, ?)`,
    )
    .run(newId(), event.id, event.type, JSON.stringify(event).slice(0, 100_000), nowIso());
}

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

/** The user this event is about, from the metadata we set when checking out. */
function userIdOf(object: Record<string, unknown>): string | null {
  const metadata = (object.metadata ?? {}) as Record<string, unknown>;
  return str(metadata.user_id) ?? str(object.client_reference_id);
}

function planOf(object: Record<string, unknown>): Exclude<PlanId, "free"> | null {
  const metadata = (object.metadata ?? {}) as Record<string, unknown>;
  const plan = str(metadata.plan);
  return plan === "pro" || plan === "business" ? plan : null;
}

/**
 * Applies one event to the subscription rows.
 *
 * Every write is keyed on the Stripe subscription id, so the rows converge on
 * whatever Stripe last said regardless of the order the events arrive in,
 * which is the only assumption worth making about webhooks.
 */
export function applyStripeEvent(event: StripeEvent): { applied: boolean; reason?: string } {
  if (alreadyHandled(event.id)) return { applied: false, reason: "Already handled." };

  const object = event.data.object;
  switch (event.type) {
    case "checkout.session.completed": {
      const userId = userIdOf(object);
      const plan = planOf(object);
      const subscriptionId = str(object.subscription);
      const customerId = str(object.customer);
      if (!userId || !plan || !subscriptionId) {
        remember(event);
        return { applied: false, reason: "Session carried no user, plan or subscription." };
      }
      upsertSubscription({
        userId,
        plan,
        status: "active",
        interval: "month",
        seats: 1,
        subscriptionId,
        customerId,
        periodEnd: null,
        cancelAtPeriodEnd: false,
      });
      remember(event);
      return { applied: true };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const userId = userIdOf(object);
      const subscriptionId = str(object.id);
      if (!subscriptionId) {
        remember(event);
        return { applied: false, reason: "No subscription id." };
      }

      const deleted = event.type === "customer.subscription.deleted";
      const status = deleted ? "canceled" : stripeStatus(str(object.status));
      const item = firstItem(object);
      const plan = planOf(object) ?? planForPrice(str(item?.price_id)) ?? "pro";

      updateByProviderRef({
        subscriptionId,
        userId,
        plan,
        status,
        interval: item?.interval ?? "month",
        seats: item?.quantity ?? 1,
        periodEnd: secondsToIso(object.current_period_end),
        cancelAtPeriodEnd: object.cancel_at_period_end === true,
        customerId: str(object.customer),
      });
      remember(event);
      return { applied: true };
    }

    case "invoice.payment_failed": {
      const subscriptionId = str(object.subscription);
      if (subscriptionId) {
        db()
          .prepare("update subscriptions set status = 'past_due', updated_at = ? where provider_ref = ?")
          .run(nowIso(), subscriptionId);
      }
      remember(event);
      return { applied: true };
    }

    default:
      remember(event);
      return { applied: false, reason: `Nothing to do for ${event.type}.` };
  }
}

function stripeStatus(status: string | null): "active" | "canceled" | "past_due" {
  if (status === "past_due" || status === "unpaid" || status === "incomplete_expired") return "past_due";
  if (status === "canceled" || status === "incomplete") return "canceled";
  return "active";
}

function firstItem(object: Record<string, unknown>): { price_id: string | null; interval: Interval; quantity: number } | null {
  const items = object.items as { data?: Array<Record<string, unknown>> } | undefined;
  const first = items?.data?.[0];
  if (!first) return null;
  const price = (first.price ?? {}) as Record<string, unknown>;
  const recurring = (price.recurring ?? {}) as Record<string, unknown>;
  return {
    price_id: str(price.id),
    interval: recurring.interval === "year" ? "year" : "month",
    quantity: Number(first.quantity ?? 1) || 1,
  };
}

/** Maps a Stripe price back to a plan, for events that carry no metadata. */
function planForPrice(priceId: string | null): Exclude<PlanId, "free"> | null {
  if (!priceId) return null;
  for (const plan of ["pro", "business"] as const) {
    for (const interval of ["month", "year"] as const) {
      if (priceFor(plan, interval) === priceId) return plan;
    }
  }
  return null;
}

function secondsToIso(value: unknown): string | null {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000).toISOString() : null;
}

type Upsert = {
  userId: string;
  plan: Exclude<PlanId, "free">;
  status: "active" | "canceled" | "past_due";
  interval: Interval;
  seats: number;
  subscriptionId: string;
  customerId: string | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

function upsertSubscription(input: Upsert): void {
  const now = nowIso();
  db()
    .prepare(
      `insert into subscriptions
         (id, user_id, plan, status, interval, seats, provider, provider_ref, current_period_end,
          cancel_at_period_end, created_at, updated_at)
       values (?, ?, ?, ?, ?, ?, 'stripe', ?, ?, ?, ?, ?)
       on conflict(user_id) do update set
         plan = excluded.plan, status = excluded.status, interval = excluded.interval,
         seats = excluded.seats, provider = 'stripe', provider_ref = excluded.provider_ref,
         current_period_end = excluded.current_period_end,
         cancel_at_period_end = excluded.cancel_at_period_end, updated_at = excluded.updated_at`,
    )
    .run(
      newId(),
      input.userId,
      input.plan,
      input.status,
      input.interval,
      Math.max(1, input.seats),
      input.subscriptionId,
      input.periodEnd,
      input.cancelAtPeriodEnd ? 1 : 0,
      now,
      now,
    );
  if (input.customerId) rememberCustomer(input.userId, input.customerId);
}

/**
 * Updates the row Stripe is talking about.
 *
 * Events can arrive out of order and the subscription row may not exist yet
 * (the subscription event can beat the checkout event), so this falls back to
 * creating it when the event carries a user id.
 */
function updateByProviderRef(input: {
  subscriptionId: string;
  userId: string | null;
  plan: Exclude<PlanId, "free">;
  status: "active" | "canceled" | "past_due";
  interval: Interval;
  seats: number;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  customerId: string | null;
}): void {
  const result = db()
    .prepare(
      `update subscriptions set
         plan = ?, status = ?, interval = ?, seats = ?, current_period_end = ?,
         cancel_at_period_end = ?, provider = 'stripe', updated_at = ?
       where provider_ref = ?`,
    )
    .run(
      input.plan,
      input.status,
      input.interval,
      Math.max(1, input.seats),
      input.periodEnd,
      input.cancelAtPeriodEnd ? 1 : 0,
      nowIso(),
      input.subscriptionId,
    );

  if (Number(result.changes) === 0 && input.userId) {
    upsertSubscription({
      userId: input.userId,
      plan: input.plan,
      status: input.status,
      interval: input.interval,
      seats: input.seats,
      subscriptionId: input.subscriptionId,
      customerId: input.customerId,
      periodEnd: input.periodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    });
  }
}

/** The Stripe customer id, so the portal can be opened later. */
export function rememberCustomer(userId: string, customerId: string): void {
  db()
    .prepare(
      `insert into billing_events (id, provider, provider_event_id, type, payload, received_at)
       values (?, 'stripe', ?, 'customer.recorded', ?, ?)
       on conflict (provider, provider_event_id) do nothing`,
    )
    .run(newId(), `customer:${userId}`, JSON.stringify({ userId, customerId }), nowIso());
}

export function customerFor(userId: string): string | null {
  const row = db()
    .prepare("select payload from billing_events where provider = 'stripe' and provider_event_id = ?")
    .get(`customer:${userId}`) as { payload: string } | undefined;
  if (!row) return null;
  try {
    return (JSON.parse(row.payload) as { customerId?: string }).customerId ?? null;
  } catch {
    return null;
  }
}
