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

const ENV_FILE = ".env.local";

const ACCOUNTS = [
  { key: "SCREENSHOT", email: "thekarankathuria@gmail.com", plan: "pro" },
  { key: "TEST_FREE", email: "free@themailsignature.test", plan: "free" },
  { key: "TEST_PRO", email: "pro@themailsignature.test", plan: "pro" },
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
  if (lines.length) {
    appendFileSync(ENV_FILE, `\n# Local test accounts (npm run seed).\n${lines.join("\n")}\n`);
    console.log(`Passwords written to ${ENV_FILE}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
