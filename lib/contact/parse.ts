import type { ContactPayload } from "./delivery";

/** Shared by the form's <select> and the server-side check. */
export const CONTACT_TOPICS = [
  "General question",
  "Help with my signature",
  "Billing",
  "Teams and the Business plan",
  "Privacy or data request",
  "Something else",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export type ParseResult =
  | { kind: "ok"; payload: ContactPayload }
  | { kind: "spam" }
  | { kind: "error"; field: string; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a contact-form submission. `website` is a honeypot: the field is
 * hidden from people, so any value means a bot filled every input it found.
 * The route answers spam with a normal success so the bot learns nothing.
 */
export function parseContact(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { kind: "error", field: "body", error: "Expected a JSON object." };
  }
  const source = body as Record<string, unknown>;
  if (read(source, "website")) return { kind: "spam" };

  const payload: ContactPayload = {
    firstName: read(source, "firstName"),
    lastName: read(source, "lastName"),
    email: read(source, "email"),
    company: read(source, "company"),
    topic: read(source, "topic"),
    message: read(source, "message"),
  };

  const fail = (field: keyof ContactPayload, error: string): ParseResult => ({
    kind: "error",
    field,
    error,
  });

  if (!payload.firstName) return fail("firstName", "Enter your first name.");
  if (payload.firstName.length > 100) return fail("firstName", "First name is too long.");
  if (!payload.lastName) return fail("lastName", "Enter your last name.");
  if (payload.lastName.length > 100) return fail("lastName", "Last name is too long.");
  if (!EMAIL_RE.test(payload.email) || payload.email.length > 254) {
    return fail("email", "Enter a valid email address.");
  }
  if (payload.company.length > 200) return fail("company", "Company name is too long.");
  if (!(CONTACT_TOPICS as readonly string[]).includes(payload.topic)) {
    return fail("topic", "Choose what your message is about.");
  }
  if (!payload.message) return fail("message", "Write a message.");
  if (payload.message.length > 5000) {
    return fail("message", "Keep your message under 5,000 characters.");
  }
  return { kind: "ok", payload };
}
