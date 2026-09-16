/**
 * Every URL the old site exposed is indexed somewhere. This asserts the
 * redirect map in next.config.ts still covers each one, so a future edit
 * cannot quietly strand a page that search engines already know about.
 */
import nextConfig from "../next.config";

const EXPECTED: Record<string, string> = {
  "/generator": "/editor",
  "/solution/:slug": "/industries/:slug",
  "/contact-us": "/contact",
  "/privacypolicy": "/legal/privacy",
  "/terms-of-use": "/legal/terms",
  "/cookies-policy": "/legal/cookies",
  "/user-data-deletion": "/legal/data-deletion",
  "/browse-1000-industries": "/industries",
  "/support": "/help",
  "/tutorials": "/help",
};

async function main() {
  const rules = (await nextConfig.redirects?.()) ?? [];
  const failures: string[] = [];

  for (const [source, destination] of Object.entries(EXPECTED)) {
    const rule = rules.find((r) => r.source === source);
    if (!rule) {
      failures.push(`no redirect for ${source}`);
      continue;
    }
    if (rule.destination !== destination) {
      failures.push(`${source} -> ${rule.destination}, expected ${destination}`);
    }
    if (!("permanent" in rule) || rule.permanent !== true) {
      failures.push(`${source} is not permanent`);
    }
  }

  if (failures.length) {
    console.error("Redirect check failed:");
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`Redirect check passed: ${Object.keys(EXPECTED).length} legacy URLs covered.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
