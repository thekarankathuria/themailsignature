import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Transactional email. With RESEND_API_KEY set, mail goes out through Resend;
 * otherwise every message is written to the outbox directory, where the
 * development-only page /dev/outbox shows it. Nothing is ever dropped
 * silently: a failed send is returned to the caller.
 */
export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

export type SendResult =
  | { ok: true; transport: "resend" | "outbox"; id: string }
  | { ok: false; transport: "resend" | "outbox"; reason: string };

export type OutboxMessage = Mail & { id: string; sentAt: string };

export function outboxDir(): string {
  return resolve(/*turbopackIgnore: true*/ process.env.OUTBOX_DIR?.trim() || "data/outbox");
}

export function mailFrom(): string {
  return process.env.MAIL_FROM?.trim() || "TheMailSignature <hello@themailsignature.com>";
}

export async function sendMail(mail: Mail): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  return key ? viaResend(mail, key) : viaOutbox(mail);
}

async function viaResend(mail: Mail, key: string): Promise<SendResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: mailFrom(),
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        reply_to: mail.replyTo,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, transport: "resend", reason: `Resend returned ${response.status}. ${detail.slice(0, 200)}` };
    }
    const json = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, transport: "resend", id: json.id ?? "" };
  } catch (error) {
    return { ok: false, transport: "resend", reason: error instanceof Error ? error.message : "Network failure." };
  }
}

function viaOutbox(mail: Mail): SendResult {
  try {
    const dir = outboxDir();
    mkdirSync(dir, { recursive: true });
    const sentAt = new Date().toISOString();
    const id = `${sentAt.replace(/[:.]/g, "-")}-${randomBytes(4).toString("hex")}`;
    const message: OutboxMessage = { id, sentAt, ...mail };
    writeFileSync(join(/*turbopackIgnore: true*/ dir, `${id}.json`), JSON.stringify(message, null, 2));
    return { ok: true, transport: "outbox", id };
  } catch (error) {
    return { ok: false, transport: "outbox", reason: error instanceof Error ? error.message : "Write failed." };
  }
}

const ID = /^[0-9TZ-]+-[0-9a-f]{8}$/;

export function listOutbox(): OutboxMessage[] {
  try {
    return readdirSync(/*turbopackIgnore: true*/ outboxDir())
      .filter((name) => name.endsWith(".json"))
      .map((name) => readOutbox(name.slice(0, -5)))
      .filter((m): m is OutboxMessage => m !== null)
      .sort((a, b) => b.id.localeCompare(a.id));
  } catch {
    return [];
  }
}

export function readOutbox(id: string): OutboxMessage | null {
  if (!ID.test(id)) return null;
  try {
    return JSON.parse(readFileSync(join(/*turbopackIgnore: true*/ outboxDir(), `${id}.json`), "utf8")) as OutboxMessage;
  } catch {
    return null;
  }
}
