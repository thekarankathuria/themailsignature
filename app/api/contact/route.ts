import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { deliverContact, type ContactPayload } from "@/lib/contact/delivery";

/**
 * POST /api/contact — receiver for the Phase 2 contact form at `app/(site)/contact`.
 *
 * This handler validates the payload and hands it to `deliverContact`, which either
 * sends it through a configured provider or appends it to a local log. It never
 * reports success for a message that went nowhere.
 */

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Five submissions per IP per ten minutes: generous for a human, useless for a bot. */
const LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function parse(body: unknown): { payload: ContactPayload } | { error: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Expected a JSON object." };
  }
  const source = body as Record<string, unknown>;

  const payload: ContactPayload = {
    firstName: readString(source, "First-Name-2"),
    lastName: readString(source, "Last-Name-2"),
    email: readString(source, "Email-4"),
    companyWebsite: readString(source, "company-website-2"),
    purpose: readString(source, "field-2"),
    phone: readString(source, "Phone-Number-2"),
    message: readString(source, "Your-message-2"),
    optIn: source["checkbox-2"] === true,
  };

  if (!payload.firstName) return { error: "First name is required." };
  if (!payload.lastName) return { error: "Last name is required." };
  if (!EMAIL_RE.test(payload.email)) return { error: "A valid email address is required." };
  if (!payload.purpose || payload.purpose === "Purpose?") {
    return { error: "Please choose a purpose." };
  }
  if (!payload.phone) return { error: "Phone number is required." };
  if (!payload.message) return { error: "A message is required." };
  if (payload.message.length > 5000) return { error: "Message is too long." };
  if (!payload.optIn) return { error: "The opt-in checkbox must be ticked." };

  return { payload };
}

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

  const result = parse(body);
  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const delivery = await deliverContact(result.payload);
  if (!delivery.ok) {
    // Surface the failure so the form's `.w-form-fail` block shows. The reason
    // is logged, not returned: it can carry provider detail.
    console.error(`[contact] delivery failed via ${delivery.transport}: ${delivery.reason}`);
    return NextResponse.json(
      { ok: false, error: "We could not send that message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
