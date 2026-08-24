import { appendFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Delivery for validated contact-form submissions.
 *
 * The route used to validate a payload and then drop it on the floor, so a
 * visitor saw a success message for a message nobody would ever read. Silent
 * data loss is worse than a visible failure, so there is no "do nothing" path
 * here: either a provider accepts the message, or it is appended to a local
 * log and the caller is told which happened.
 *
 * Transport is chosen by configuration, not by a build flag:
 *   RESEND_API_KEY set -> POST to Resend over fetch (no SDK dependency)
 *   otherwise          -> append JSON Lines to .contact-submissions.log
 *
 * Adding another provider means adding one branch to `deliverContact`; the
 * route never learns which transport ran.
 */

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  companyWebsite: string;
  purpose: string;
  phone: string;
  message: string;
  optIn: boolean;
};

export type DeliveryResult =
  | { ok: true; transport: "resend" | "file" }
  | { ok: false; transport: "resend" | "file"; reason: string };

const LOG_FILE = ".contact-submissions.log";

function asPlainText(payload: ContactPayload): string {
  return [
    `Name:    ${payload.firstName} ${payload.lastName}`,
    `Email:   ${payload.email}`,
    `Phone:   ${payload.phone}`,
    `Company: ${payload.companyWebsite || "(not given)"}`,
    `Purpose: ${payload.purpose}`,
    `Opt-in:  ${payload.optIn ? "yes" : "no"}`,
    "",
    payload.message,
  ].join("\n");
}

async function viaResend(
  payload: ContactPayload,
  apiKey: string,
): Promise<DeliveryResult> {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!to) {
    return {
      ok: false,
      transport: "resend",
      reason: "RESEND_API_KEY is set but CONTACT_TO_EMAIL is not.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL?.trim() || "onboarding@resend.dev",
        to: [to],
        reply_to: payload.email,
        subject: `Contact form: ${payload.purpose} - ${payload.firstName} ${payload.lastName}`,
        text: asPlainText(payload),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        ok: false,
        transport: "resend",
        reason: `Resend returned ${response.status}. ${detail.slice(0, 200)}`,
      };
    }
    return { ok: true, transport: "resend" };
  } catch (error) {
    return {
      ok: false,
      transport: "resend",
      reason: error instanceof Error ? error.message : "Network failure.",
    };
  }
}

async function viaFile(payload: ContactPayload): Promise<DeliveryResult> {
  try {
    const line = JSON.stringify({
      receivedAt: new Date().toISOString(),
      ...payload,
    });
    await appendFile(join(process.cwd(), LOG_FILE), line + "\n", "utf8");
    return { ok: true, transport: "file" };
  } catch (error) {
    return {
      ok: false,
      transport: "file",
      reason: error instanceof Error ? error.message : "Write failed.",
    };
  }
}

export async function deliverContact(
  payload: ContactPayload,
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey ? viaResend(payload, apiKey) : viaFile(payload);
}

/** True when a real mail provider is configured rather than the local log. */
export function hasMailProvider(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}
