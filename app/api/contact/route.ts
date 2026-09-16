import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { deliverContact } from "@/lib/contact/delivery";
import { parseContact } from "@/lib/contact/parse";

/**
 * POST /api/contact — receiver for the contact form at `app/(site)/contact`.
 *
 * This handler validates the payload and hands it to `deliverContact`, which either
 * sends it through a configured provider or appends it to a local log. It never
 * reports success for a message that went nowhere.
 */

export const runtime = "nodejs";

/** Five submissions per IP per ten minutes: generous for a human, useless for a bot. */
const LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const throttle = rateLimit(clientKey(request, "contact"), LIMIT);
  if (!throttle.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this address. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(throttle.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed JSON body." }, { status: 400 });
  }

  const result = parseContact(body);
  if (result.kind === "spam") {
    return NextResponse.json({ ok: true });
  }
  if (result.kind === "error") {
    return NextResponse.json(
      { ok: false, error: result.error, field: result.field },
      { status: 400 },
    );
  }

  const delivery = await deliverContact(result.payload);
  if (!delivery.ok) {
    // The reason is logged, not returned: it can carry provider detail.
    console.error(`[contact] delivery failed via ${delivery.transport}: ${delivery.reason}`);
    return NextResponse.json(
      { ok: false, error: "We could not send that message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
