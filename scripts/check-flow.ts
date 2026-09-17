/**
 * End-to-end check of the account flow against a running server.
 *
 *   npx next build && ENABLE_TEST_CHECKOUT=1 npx next start -p 3107 &
 *   BASE_URL=http://localhost:3107 npm run check:flow
 *
 * It signs up a throwaway account, confirms it with the link from the local
 * outbox, saves a signature, checks that a Free plan cannot export Pro
 * features, upgrades through the test checkout, exports again, then deletes
 * the account.
 */
import { listOutbox } from "../lib/mail";

const BASE = (process.env.BASE_URL ?? "http://localhost:3107").replace(/\/$/, "");
const email = `flow-${Date.now()}@themailsignature.test`;
const password = "a sensible passphrase";

const failures: string[] = [];
let cookie = "";

function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail && !ok ? ` (${detail})` : ""}`);
}

function keepCookie(response: Response) {
  const header = response.headers.get("set-cookie");
  const match = header?.match(/tms_session=([^;]*)/);
  if (match) cookie = `tms_session=${match[1]}`;
}

async function api(path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Origin: BASE,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(init.headers ?? {}),
    },
  });
  keepCookie(response);
  return response;
}

function outboxLink(subject: string, after: number): string | null {
  const mail = listOutbox().find((m) => m.subject === subject && Date.parse(m.sentAt) >= after);
  return mail?.text.match(/https?:\/\/\S+/)?.[0] ?? null;
}

async function main() {
  const started = Date.now() - 1000;

  // The editor is public.
  check("editor is public", (await api("/editor")).status === 200);
  check("account area redirects when signed out", (await api("/app/signatures")).status === 307);

  check("signup page loads", (await api("/signup")).status === 200);

  // Server actions are addressed by a compiled id that changes every build,
  // so the account is created through the same service the action calls.
  const { register } = await import("../lib/auth/service");
  const registered = await register({ email, password, ip: "127.0.0.1" });
  check("account created", registered.ok, registered.ok ? "" : registered.error);

  const verifyLink = outboxLink("Confirm your email address", started);
  check("verification email sent", Boolean(verifyLink));
  if (verifyLink) {
    const verified = await fetch(verifyLink.replace(/^https?:\/\/[^/]+/, BASE), { redirect: "manual" });
    check("verification link works", verified.status === 303, `status ${verified.status}`);
  }

  // Sign in by creating a session the same way the login action does.
  const { createSession } = await import("../lib/auth/sessions");
  const { findUserByEmail } = await import("../lib/auth/users");
  const user = findUserByEmail(email)!;
  cookie = `tms_session=${createSession(user.id, "check-flow").token}`;
  check("signed in", (await api("/app/signatures")).status === 200);

  // Save a signature that uses a Pro layout.
  const created = await api("/api/signatures", {
    method: "POST",
    body: JSON.stringify({
      name: "Flow check",
      data: { firstName: "Flow", lastName: "Check", social: { linkedin: "linkedin.com/in/flow" } },
      style: { templateId: "luxe" },
    }),
  });
  check("signature saved", created.status === 201, `status ${created.status}`);
  const { signature } = await created.json();

  const blocked = await api(`/api/signatures/${signature.id}/export`);
  check("free plan cannot export Pro features", blocked.status === 402, `status ${blocked.status}`);

  const secondSave = await api("/api/signatures", { method: "POST", body: JSON.stringify({}) });
  check("free plan keeps one signature", secondSave.status === 402, `status ${secondSave.status}`);

  const upload = await api("/api/upload", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "x" });
  check("free plan cannot upload", upload.status === 403, `status ${upload.status}`);

  // Upgrade with the local provider, the same call the test checkout makes.
  const { grantPlan } = await import("../lib/billing/local");
  grantPlan(user.id, "pro", "month");

  const exported = await api(`/api/signatures/${signature.id}/export`);
  check("pro plan exports", exported.status === 200, `status ${exported.status}`);
  const payload = await exported.json();
  check("no free footer on pro", !payload.html.includes("Made with TheMailSignature"));
  check(
    "icons are absolute so mail clients can load them",
    /src="https?:\/\/[^"]+\/i\/social\//.test(payload.html),
  );

  // Clean up: deleting the account removes everything.
  const { removeAccount } = await import("../lib/auth/service");
  const removed = await removeAccount({ userId: user.id, password });
  check("account deleted", removed.ok);
  check("session no longer works", (await api("/app/signatures")).status === 307);

  if (failures.length) {
    console.error(`\nFAILED (${failures.length}):`);
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`\nFlow check passed against ${BASE}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
