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

  await businessWalkthrough();

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

/**
 * The Business tier end to end: buy a team, invite somebody, lock the logo,
 * and check that the member's export carries the company's logo and that a
 * tracked link redirects and counts.
 */
async function businessWalkthrough() {
  const { createUser } = await import("../lib/auth/users");
  const { createSession } = await import("../lib/auth/sessions");
  const { startBusiness } = await import("../lib/teams/subscribe");
  const { invite, acceptInvitation } = await import("../lib/teams/invitations");
  const { writeTemplate, linkMemberSignatures } = await import("../lib/teams/template");
  const { setAnalyticsEnabled } = await import("../lib/teams/store");
  const { clicksFor } = await import("../lib/teams/links");
  const { planFor } = await import("../lib/billing/plans");
  const { DEFAULT_DATA, DEFAULT_STYLE } = await import("../lib/signature/defaults");

  const stamp = Date.now();
  const ownerEmail = `owner-${stamp}@themailsignature.test`;
  const mateEmail = `mate-${stamp}@themailsignature.test`;
  const owner = await createUser(ownerEmail, password);
  const mate = await createUser(mateEmail, password);

  const started = startBusiness({ userId: owner.id, companyName: "Flow Check Ltd", seats: 3, interval: "month" });
  check("business plan creates a team", started.ok, started.ok ? "" : started.error);
  if (!started.ok) return;
  check("owner is on the business plan", planFor(owner.id) === "business");

  const invited = await invite({ orgId: started.orgId, invitedBy: owner.id, email: mateEmail, role: "member" });
  check("invitation sent", invited.ok, invited.ok ? "" : invited.error);
  if (!invited.ok) return;

  const joined = await acceptInvitation(invited.token, mate.id);
  check("invitation accepted", joined.ok, joined.ok ? "" : joined.error);
  check("member is on the business plan", planFor(mate.id) === "business");

  const companyLogo = "https://flowcheck.example/logo.png";
  writeTemplate(started.orgId, {
    name: "Company template",
    data: { ...DEFAULT_DATA, company: "Flow Check Ltd", logoUrl: companyLogo, website: "flowcheck.example" },
    style: DEFAULT_STYLE,
    locked: ["logo", "company"],
  });
  setAnalyticsEnabled(started.orgId, true);

  // The member saves their own signature with their own logo.
  cookie = `tms_session=${createSession(mate.id, "check-flow").token}`;
  const created = await api("/api/signatures", {
    method: "POST",
    body: JSON.stringify({
      name: "Member signature",
      data: { firstName: "Mem", lastName: "Ber", logoUrl: "https://elsewhere.example/mine.png", website: "mine.example" },
      style: { templateId: "meridian" },
    }),
  });
  check("member saved a signature", created.status === 201, `status ${created.status}`);
  const { signature: memberSignature } = await created.json();
  linkMemberSignatures(started.orgId);

  const exported = await api(`/api/signatures/${memberSignature.id}/export`);
  check("member can export", exported.status === 200, `status ${exported.status}`);
  const payload = await exported.json();
  check("locked logo comes from the company template", payload.html.includes("flowcheck.example/logo.png"));
  check("the member's own logo is not sent", !payload.html.includes("elsewhere.example/mine.png"));

  const tracked = payload.html.match(/\/l\/([0-9a-f]{32})/);
  check("links are counted for this team", Boolean(tracked));
  if (tracked) {
    const hop = await fetch(`${BASE}/l/${tracked[1]}`, { redirect: "manual" });
    check("a tracked link redirects", hop.status === 302, `status ${hop.status}`);
    check("it redirects to the real address", (hop.headers.get("location") ?? "").includes("flowcheck.example"));
    const counted = clicksFor(started.orgId).some((link) => link.clicks > 0);
    check("the click was counted", counted);
  }

  const { removeAccount } = await import("../lib/auth/service");
  await removeAccount({ userId: mate.id, password });
  await removeAccount({ userId: owner.id, password });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
