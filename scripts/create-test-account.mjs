/**
 * Creates the confirmed-account-to-be used by `npm run screenshots`.
 *
 *   node scripts/create-test-account.mjs you@example.com
 *
 * Signs up through Supabase with the publishable key (exactly what the signup
 * page does), generates a strong password, and appends SCREENSHOT_EMAIL and
 * SCREENSHOT_PASSWORD to .env.local, which is gitignored. Supabase then emails
 * a confirmation link that the account owner must click. Refuses to run if
 * .env.local already names a screenshot account, so a password is never lost.
 */
import { randomBytes } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const ENV_FILE = ".env.local";
const email = process.argv[2]?.trim();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: node scripts/create-test-account.mjs <email>");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(ENV_FILE, "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
);

if (env.SCREENSHOT_EMAIL) {
  console.error(`${ENV_FILE} already has SCREENSHOT_EMAIL=${env.SCREENSHOT_EMAIL}; not creating another account.`);
  process.exit(1);
}
for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]) {
  if (!env[key]) {
    console.error(`${key} is missing from ${ENV_FILE}.`);
    process.exit(1);
  }
}

// 24 URL-safe characters; comfortably above Supabase's password rules.
const password = randomBytes(18).toString("base64url");
const site = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: `${site}/auth/callback` },
});

if (error) {
  console.error(`Sign-up failed: ${error.message}`);
  process.exit(1);
}

// Supabase returns a user with no identities when the address is already registered.
if (data.user && data.user.identities && data.user.identities.length === 0) {
  console.error(`${email} is already registered. Reset its password from the login page instead.`);
  process.exit(1);
}

appendFileSync(
  ENV_FILE,
  `\n# Test account for \`npm run screenshots\` (created ${new Date().toISOString().slice(0, 10)}).\n` +
    `SCREENSHOT_EMAIL=${email}\nSCREENSHOT_PASSWORD=${password}\n`,
);
console.log(`Account created for ${email}. Credentials saved to ${ENV_FILE}.`);
console.log("Open the confirmation email Supabase just sent and click the link before running screenshots.");
