import { NextResponse } from "next/server";
import { applyStripeEvent, verifyWebhook } from "@/lib/billing/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/billing/webhook - Stripe tells us what happened.
 *
 * The raw body is read before anything else, because the signature covers the
 * exact bytes Stripe sent; parsing first and re-serialising would change them.
 * An unverified request is refused without touching the database.
 *
 * Failures answer 400 so Stripe stops retrying something that will never
 * succeed, but an error while applying a valid event answers 500, because
 * that one IS worth retrying.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "Webhooks are not configured." }, { status: 503 });

  const body = await request.text();
  const result = verifyWebhook({ body, header: request.headers.get("stripe-signature"), secret });
  if (!result.ok) {
    // Deliberately terse: a caller who cannot sign does not need to know why.
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    const applied = applyStripeEvent(result.event);
    return NextResponse.json({ received: true, ...applied });
  } catch (error) {
    console.error("Stripe webhook failed", result.event.type, error);
    return NextResponse.json({ error: "Could not apply the event." }, { status: 500 });
  }
}
