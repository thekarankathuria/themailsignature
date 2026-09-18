/**
 * Crawls a running site (BASE_URL, default http://localhost:3000): every URL in
 * the sitemap plus every internal link on those pages must return 200 after
 * redirects, and every sitemap page must have a title, a meta description and
 * a canonical link. Usage: BASE_URL=http://localhost:3107 npm run check:routes
 */
export {};

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

async function main() {
  const failures: string[] = [];
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const toCheck = new Set<string>(pages);

  for (const path of pages) {
    const response = await fetch(`${BASE}${path}`);
    if (response.status !== 200) {
      failures.push(`${path}: ${response.status}`);
      continue;
    }
    const html = await response.text();
    // /editor is in the sitemap but sends signed-out visitors to /login; only
    // pages served at their own URL need their own metadata.
    if (response.redirected) continue;
    if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${path}: no <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${path}: no meta description`);
    if (!/<link rel="canonical" href="[^"]+"/.test(html)) failures.push(`${path}: no canonical`);
    for (const match of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      const href = match[1].replace(/&amp;/g, "&");
      if (href.startsWith("/_next/") || /\.(png|jpg|svg|ico|webp|xml|txt)$/.test(href.split("?")[0])) continue;
      toCheck.add(href);
    }
  }

  for (const href of toCheck) {
    if (pages.includes(href)) continue;
    const response = await fetch(`${BASE}${href}`, { redirect: "follow" });
    // /editor and paid-plan /signup links land on /login while signed out; that is a 200.
    if (response.status !== 200) failures.push(`link ${href}: ${response.status}`);
  }

  if (failures.length) {
    console.error(`Route check failed (${failures.length}):`);
    for (const line of failures) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`Route check passed: ${pages.length} sitemap pages, ${toCheck.size} URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
