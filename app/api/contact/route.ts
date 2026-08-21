import { NextResponse } from "next/server";

/**
 * POST /api/contact — receiver for the contact form in `components/ces/CesContactForm.tsx`.
 *
 * The original page posted to Webflow's own form collector, which does not exist here.
 * This handler validates the payload and reports the outcome; it deliberately does not
 * deliver the message anywhere yet — see the marked block below.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  companyWebsite: string;
  purpose: string;
  phone: string;
  message: string;
  optIn: boolean;
};

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

  // ---------------------------------------------------------------------------
  // TODO — DELIVERY GOES HERE, and nowhere else.
  //
  // `result.payload` is validated and ready to send. Drop the provider call on the
  // next line (Resend / Postmark / SendGrid / SMTP / a CRM webhook — whichever the
  // project settles on), `await` it, and return a 502 with `{ ok: false }` if it
  // throws so the form's `.w-form-fail` block still shows.
  //
  // Nothing is installed or configured for this yet: no mail dependency was added
  // and no API key is read, so right now a valid submission is accepted and then
  // discarded.
  // ---------------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
