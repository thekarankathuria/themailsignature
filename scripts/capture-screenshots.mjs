/**
 * Editor screenshots for the marketing site (npm run screenshots).
 *
 *   npm run seed                                  # once, for the test account
 *   npx next build && npx next start -p 3107 &
 *   BASE_URL=http://localhost:3107 npm run screenshots
 *
 * Signs in with the seeded account, fills in the sample details, and captures
 * three parts of the editor at 2x into public/product/.
 */
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = "public/product";

function fromEnvFile(name) {
  if (!existsSync(".env.local")) return undefined;
  const line = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));
  return line?.slice(name.length + 1).trim();
}

const email = process.env.SCREENSHOT_EMAIL ?? fromEnvFile("SCREENSHOT_EMAIL");
const password = process.env.SCREENSHOT_PASSWORD ?? fromEnvFile("SCREENSHOT_PASSWORD");
if (!email || !password) {
  console.error("No test account. Run `npm run seed` first, or set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();

await page.goto(`${BASE}/login?next=/editor`);
await page.fill("input[name=email]", email);
await page.fill("input[name=password]", password);
await page.click("button[type=submit]");
await page.waitForURL(`${BASE}/editor**`);

// Start from the built-in example rather than whatever this account last saved.
await page.evaluate(() => {
  localStorage.clear();
});
await page.goto(`${BASE}/editor?design=consultants-corporate`);
await page.waitForLoadState("networkidle");

// All three sit side by side on the homepage, so they are cropped to one
// shape. A panel taller than this reads as a scrolled panel, which is fine.
const HEIGHT = 505;
const shots = [
  ["details", "editor-details.png"],
  ["templates", "editor-templates.png"],
  ["install", "editor-install.png"],
];

for (const [name, file] of shots) {
  const target = page.locator(`[data-screenshot="${name}"]`);
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  // clip is in document coordinates, so it is read after the scroll.
  const box = await target.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  });
  await page.screenshot({
    path: `${OUT}/${file}`,
    fullPage: true,
    clip: { ...box, height: Math.min(box.height, HEIGHT) },
  });
  console.log(`Saved ${OUT}/${file}`);
}

await browser.close();
