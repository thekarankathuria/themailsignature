/**
 * Local test accounts (npm run seed).
 *
 * Creates verified accounts in the local database and writes their passwords
 * to .env.local (gitignored), so screenshots and flow checks can sign in.
 * Running it again leaves existing accounts alone.
 */
import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { createUser, findUserByEmail, markVerified } from "../lib/auth/users";
import { grantPlan } from "../lib/billing/local";
import { planFor } from "../lib/billing/plans";
import { DEFAULT_DATA, DEFAULT_STYLE } from "../lib/signature/defaults";
import { addMember, findOrgForUser } from "../lib/teams/store";
import { startBusiness } from "../lib/teams/subscribe";
import { writeBrandKit } from "../lib/teams/brand";
import { writeTemplate } from "../lib/teams/template";

const ENV_FILE = ".env.local";

const ACCOUNTS = [
  { key: "SCREENSHOT", email: "thekarankathuria@gmail.com", plan: "pro" },
  { key: "TEST_FREE", email: "free@themailsignature.test", plan: "free" },
  { key: "TEST_PRO", email: "pro@themailsignature.test", plan: "pro" },
  { key: "TEST_OWNER", email: "owner@themailsignature.test", plan: "free" },
  { key: "TEST_MEMBER", email: "member@themailsignature.test", plan: "free" },
] as const;

function envValues(): Record<string, string> {
  if (!existsSync(ENV_FILE)) return {};
  return Object.fromEntries(
    readFileSync(ENV_FILE, "utf8")
      .split(/\r?\n/)
      .filter((line) => /^[A-Z0-9_]+=/.test(line))
      .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
  );
}

async function main() {
  const env = envValues();
  const lines: string[] = [];
  for (const account of ACCOUNTS) {
    const emailKey = `${account.key}_EMAIL`;
    const passwordKey = `${account.key}_PASSWORD`;
    const existing = findUserByEmail(account.email);
    if (existing) {
      if (account.plan !== "free" && planFor(existing.id) === "free") grantPlan(existing.id, account.plan, "year");
      console.log(`exists   ${account.email} (${planFor(existing.id)})`);
      continue;
    }
    const password = env[passwordKey] || randomBytes(15).toString("base64url");
    const user = await createUser(account.email, password);
    markVerified(user.id);
    if (account.plan !== "free") grantPlan(user.id, account.plan, "year");
    console.log(`created  ${account.email} (${account.plan})`);
    if (!env[passwordKey]) lines.push(`${emailKey}=${account.email}`, `${passwordKey}=${password}`);
  }
  await seedTeam();

  if (lines.length) {
    appendFileSync(ENV_FILE, `\n# Local test accounts (npm run seed).\n${lines.join("\n")}\n`);
    console.log(`Passwords written to ${ENV_FILE}.`);
  }
}

/**
 * A Business team to click through: an owner, a member, a company template
 * with two locked groups, a brand kit and click counting switched on.
 */
async function seedTeam() {
  const owner = findUserByEmail("owner@themailsignature.test");
  const member = findUserByEmail("member@themailsignature.test");
  if (!owner || !member) return;
  if (findOrgForUser(owner.id)) {
    console.log("exists   Northbeam Studio (business team)");
    return;
  }

  const started = startBusiness({
    userId: owner.id,
    companyName: "Northbeam Studio",
    seats: 3,
    interval: "month",
  });
  if (!started.ok) {
    console.error(`team     ${started.error}`);
    return;
  }
  addMember(started.orgId, member.id, "member");

  writeTemplate(started.orgId, {
    name: "Northbeam Studio",
    data: {
      ...DEFAULT_DATA,
      company: "Northbeam Studio",
      website: "northbeam.studio",
      addressLine1: "412 W Superior St, Suite 300",
      addressLine2: "Chicago, IL 60654",
      disclaimer: "This email and any files with it are confidential and intended for the addressee.",
      social: { linkedin: "linkedin.com/company/northbeam" },
    },
    style: { ...DEFAULT_STYLE, templateId: "corporate", accent: "#0b1f52" },
    locked: ["logo", "company", "disclaimer", "social"],
  });

  writeBrandKit(started.orgId, {
    colors: ["#0b1f52", "#0050b8", "#5b6b8c"],
    fonts: ["helvetica", "georgia"],
  });

  const { setAnalyticsEnabled } = await import("../lib/teams/store");
  setAnalyticsEnabled(started.orgId, true);
  console.log("created  Northbeam Studio (business team: owner, member, locked template)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
