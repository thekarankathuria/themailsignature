// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb, db } from "@/lib/db";
import { planFor, subscriptionFor } from "./plans";
import { alreadyHandled, applyStripeEvent, priceFor, stripeEnabled, verifyWebhook, type StripeEvent } from "./stripe";

const SECRET = "whsec_test_secret";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
  vi.stubEnv("STRIPE_PRICE_PRO_MONTH", "price_pro_month");
  vi.stubEnv("STRIPE_PRICE_PRO_YEAR", "price_pro_year");
  vi.stubEnv("STRIPE_PRICE_BUSINESS_MONTH", "price_business_month");
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
});

function sign(body: string, { secret = SECRET, at = Date.now() } = {}): string {
  const timestamp = Math.floor(at / 1000);
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

describe("configuration", () => {
  it("knows whether Stripe is switched on", () => {
    expect(stripeEnabled()).toBe(true);
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect(stripeEnabled()).toBe(false);
  });

  it("finds the price for a plan and period", () => {
    expect(priceFor("pro", "month")).toBe("price_pro_month");
    expect(priceFor("pro", "year")).toBe("price_pro_year");
    expect(priceFor("business", "year")).toBeNull();
  });
});

describe("webhook signatures", () => {
  const body = JSON.stringify({ id: "evt_1", type: "ping", data: { object: {} } });

  it("accepts a signature it just made", () => {
    const result = verifyWebhook({ body, header: sign(body), secret: SECRET });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.event.id).toBe("evt_1");
  });

  it("refuses a body that changed after signing", () => {
    const header = sign(body);
    const tampered = JSON.stringify({ id: "evt_1", type: "ping", data: { object: { plan: "business" } } });
    expect(verifyWebhook({ body: tampered, header, secret: SECRET })).toMatchObject({ ok: false });
  });

  it("refuses the wrong secret", () => {
    expect(verifyWebhook({ body, header: sign(body, { secret: "whsec_other" }), secret: SECRET })).toMatchObject({
      ok: false,
    });
  });

  it("refuses a replay of an old request", () => {
    const header = sign(body, { at: Date.now() - 40 * 60 * 1000 });
    const result = verifyWebhook({ body, header, secret: SECRET });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.reason).toContain("too old");
  });

  it("refuses a missing or malformed header", () => {
    expect(verifyWebhook({ body, header: null, secret: SECRET })).toMatchObject({ ok: false });
    expect(verifyWebhook({ body, header: "nonsense", secret: SECRET })).toMatchObject({ ok: false });
    expect(verifyWebhook({ body, header: "t=abc,v1=def", secret: SECRET })).toMatchObject({ ok: false });
  });

  it("refuses a signed body that is not JSON", () => {
    expect(verifyWebhook({ body: "not json", header: sign("not json"), secret: SECRET })).toMatchObject({ ok: false });
  });
});

function event(type: string, object: Record<string, unknown>, id = `evt_${Math.random()}`): StripeEvent {
  return { id, type, data: { object } };
}

describe("applying events", () => {
  async function user() {
    return createUser("owner@example.com", "a sensible passphrase");
  }

  it("puts somebody on a plan when checkout completes", async () => {
    const owner = await user();
    const applied = applyStripeEvent(
      event("checkout.session.completed", {
        subscription: "sub_1",
        customer: "cus_1",
        client_reference_id: owner.id,
        metadata: { user_id: owner.id, plan: "pro" },
      }),
    );

    expect(applied.applied).toBe(true);
    expect(planFor(owner.id)).toBe("pro");
    expect(subscriptionFor(owner.id)?.provider).toBe("stripe");
  });

  it("ignores a repeat of the same event", async () => {
    const owner = await user();
    const one = event("checkout.session.completed", {
      subscription: "sub_1",
      client_reference_id: owner.id,
      metadata: { user_id: owner.id, plan: "pro" },
    });

    expect(applyStripeEvent(one).applied).toBe(true);
    expect(alreadyHandled(one.id)).toBe(true);
    expect(applyStripeEvent(one)).toMatchObject({ applied: false, reason: "Already handled." });
  });

  it("follows a subscription update, including seats and period", async () => {
    const owner = await user();
    applyStripeEvent(
      event("checkout.session.completed", {
        subscription: "sub_1",
        client_reference_id: owner.id,
        metadata: { user_id: owner.id, plan: "business" },
      }),
    );

    const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86400;
    applyStripeEvent(
      event("customer.subscription.updated", {
        id: "sub_1",
        status: "active",
        current_period_end: periodEnd,
        cancel_at_period_end: true,
        metadata: { user_id: owner.id, plan: "business" },
        items: { data: [{ quantity: 7, price: { id: "price_business_month", recurring: { interval: "month" } } }] },
      }),
    );

    const subscription = subscriptionFor(owner.id)!;
    expect(subscription.seats).toBe(7);
    expect(subscription.cancelAtPeriodEnd).toBe(true);
    expect(subscription.currentPeriodEnd?.slice(0, 10)).toBe(new Date(periodEnd * 1000).toISOString().slice(0, 10));
    // Cancelling at period end keeps the plan until the period actually ends.
    expect(planFor(owner.id)).toBe("business");
  });

  it("takes the plan away when the subscription is deleted", async () => {
    const owner = await user();
    applyStripeEvent(
      event("checkout.session.completed", {
        subscription: "sub_1",
        client_reference_id: owner.id,
        metadata: { user_id: owner.id, plan: "pro" },
      }),
    );
    applyStripeEvent(event("customer.subscription.deleted", { id: "sub_1", status: "canceled" }));

    expect(planFor(owner.id)).toBe("free");
    expect(subscriptionFor(owner.id)?.status).toBe("canceled");
  });

  it("marks a failed payment past due", async () => {
    const owner = await user();
    applyStripeEvent(
      event("checkout.session.completed", {
        subscription: "sub_1",
        client_reference_id: owner.id,
        metadata: { user_id: owner.id, plan: "pro" },
      }),
    );
    applyStripeEvent(event("invoice.payment_failed", { subscription: "sub_1" }));

    expect(subscriptionFor(owner.id)?.status).toBe("past_due");
    expect(planFor(owner.id)).toBe("free");
  });

  it("copes with a subscription event arriving before its checkout event", async () => {
    const owner = await user();
    applyStripeEvent(
      event("customer.subscription.created", {
        id: "sub_1",
        status: "active",
        metadata: { user_id: owner.id, plan: "pro" },
        items: { data: [{ quantity: 1, price: { id: "price_pro_year", recurring: { interval: "year" } } }] },
      }),
    );

    expect(planFor(owner.id)).toBe("pro");
    expect(subscriptionFor(owner.id)?.interval).toBe("year");
  });

  it("works out the plan from the price when the event carries no metadata", async () => {
    const owner = await user();
    applyStripeEvent(
      event("customer.subscription.created", {
        id: "sub_1",
        status: "active",
        client_reference_id: owner.id,
        items: { data: [{ quantity: 3, price: { id: "price_business_month", recurring: { interval: "month" } } }] },
      }),
    );
    expect(planFor(owner.id)).toBe("business");
  });

  it("records an event it does not act on, so it is not retried forever", () => {
    const one = event("customer.updated", { id: "cus_1" });
    expect(applyStripeEvent(one).applied).toBe(false);
    expect(alreadyHandled(one.id)).toBe(true);
  });

  it("keeps a copy of every event it saw", async () => {
    const owner = await user();
    applyStripeEvent(
      event("checkout.session.completed", {
        subscription: "sub_1",
        client_reference_id: owner.id,
        metadata: { user_id: owner.id, plan: "pro" },
      }),
    );
    const rows = db().prepare("select type from billing_events where provider = 'stripe'").all() as Array<{
      type: string;
    }>;
    expect(rows.map((row) => row.type)).toContain("checkout.session.completed");
  });
});
