# Phase 1 — Foundation and Brand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every trace of the customesignature.com clone and replace it with TheMailSignature's own brand assets, design tokens and page shell, leaving a green build that later phases fill with real content.

**Architecture:** The cloned Webflow CSS and its `components/ces/**` tree are deleted outright rather than edited, because the class names are load-bearing for a stylesheet we are discarding. In their place: one Tailwind v4 token set in `app/globals.css` (navy `#0B1F52` / blue `#0050B8`), brand raster assets generated from the supplied logo by a repeatable script, and a small set of shared layout primitives (`Logo`, `SiteHeader`, `SiteFooter`, `Container`, `Section`) used by every marketing route. Marketing routes survive this phase as thin placeholder pages so the build and the URL space stay intact; Phase 2 replaces their bodies.

**Tech Stack:** Next.js 16.3.1 (App Router, Turbopack), React 19.2, Tailwind CSS v4, TypeScript (strict), Supabase, sharp (asset generation), Vitest + Testing Library (added here), tsx-run node assertion scripts (existing `npm test`).

**Spec:** `docs/superpowers/specs/2026-09-15-themailsignature-production-design.md`

## Global Constraints

- Brand name is exactly `TheMailSignature`. The strings `Mail Signature`, `mailsignature.com`, `Custom Esignature` and `customesignature` must not appear in shipped code, copy or metadata.
- Brand colours: navy `#0B1F52`, blue `#0050B8`. These come from the supplied logo and are the only accent colours.
- No fabricated statistic, rating, review, customer count or third-party client logo may be introduced. No claim of a feature that does not exist (no "AI", no analytics, no team features in Phase 1 copy).
- Every existing indexable URL keeps working via a permanent (308) redirect: `/generator`→`/editor`, `/solution/<slug>`→`/industries/<slug>`, `/contact-us`→`/contact`, `/privacypolicy`→`/legal/privacy`, `/terms-of-use`→`/legal/terms`, `/cookies-policy`→`/legal/cookies`, `/user-data-deletion`→`/legal/data-deletion`, `/browse-1000-industries`→`/industries`, `/support`→`/help`, `/tutorials`→`/help`.
- `lib/signature/**` is not modified in this phase. `npm test` must stay green at every commit.
- TypeScript is `strict`; `npx tsc --noEmit` and `npm run lint` (0 errors) must pass before each commit.
- Path alias `@/` maps to the repository root (see `tsconfig.json`).

---

### Task 1: Content guard, then delete the clone

**Files:**
- Create: `scripts/check-content.ts`
- Modify: `package.json` (the `test` script)
- Delete: `components/ces/` (whole tree), `app/ces.css`, `app/ces-inline.css`, `app/ces-extra.css`, `public/ces/`, `lib/ces/legal.ts`, `lib/ces/solutions.ts`, `lib/ces/structured-data.ts`, `lib/showcase.ts`, `docs/research/`, `scripts/download-assets.mjs`, `scripts/download-bcdn.mjs`, `scripts/localize-css.mjs`, `scripts/recolor-css.mjs`, `scripts/rebrand-lottie.mjs`, `scripts/extract-any.mjs`, `scripts/extract-section.mjs`, `scripts/extract-solutions.mjs`, `scripts/page-topology.mjs`, `scripts/prune-assets.mjs`, `scripts/ocr-assets.swift`
- Replace bodies: every page under `app/(site)/` (see Step 5)
- Modify: `app/api/contact/route.ts:7` — its doc comment points at the deleted `components/ces/CesContactForm.tsx`; change it to name the Phase 2 contact form instead. The route's logic is unchanged in this phase.
- Keep: `lib/ces/solution-seo.ts` (our own rewritten titles; moved in Task 7)

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` now also runs `scripts/check-content.ts`, which fails the build if a banned string reappears anywhere in `app/`, `components/`, `lib/`, `public/` or `scripts/`.

- [ ] **Step 1: Write the failing guard**

Create `scripts/check-content.ts`:

```ts
/**
 * Content guard: the marketing site was once a verbatim clone of
 * customesignature.com. Deleting it is only half the fix — this asserts the
 * clone cannot creep back in through a copied component, a stale asset or a
 * pasted string. Runs as part of `npm test`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOTS = ["app", "components", "lib", "scripts", "public"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "u"]);
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md", ".html"]);

/** Each pattern is a launch blocker, not a style preference. */
const BANNED: Array<{ pattern: RegExp; why: string }> = [
  { pattern: /customesignature/i, why: "cloned company domain" },
  { pattern: /custom\s+esignature/i, why: "cloned company name" },
  { pattern: /\bMail Signature\b/, why: "old brand name; use TheMailSignature" },
  { pattern: /mailsignature\.com/i, why: "old domain; use themailsignature.com" },
  { pattern: /getrewardful/i, why: "cloned affiliate programme" },
  { pattern: /loom\.com\/(share|embed)/i, why: "third-party product video" },
  { pattern: /embedly\.com/i, why: "third-party embed of cloned videos" },
];

const offences: string[] = [];

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    // Binary assets are checked by name only — their bytes may legitimately
    // contain anything, but a cloned file keeps its cloned filename.
    const isText = TEXT_EXT.has(extname(path));
    const haystack = isText ? readFileSync(path, "utf8") : path;
    for (const { pattern, why } of BANNED) {
      if (pattern.test(haystack)) offences.push(`${path}: ${pattern} (${why})`);
    }
  }
}

for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    // A deleted root is the expected end state for public/ces — not an error.
  }
}

if (offences.length) {
  console.error(`Content guard found ${offences.length} banned reference(s):`);
  for (const line of offences.slice(0, 40)) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Content guard passed: no cloned brand references.");
```

- [ ] **Step 2: Wire it into the test script and run it to watch it fail**

In `package.json`, change the `test` script to:

```json
"test": "tsx scripts/check-render.ts && tsx scripts/check-safe-next.ts && tsx scripts/check-hardening.ts && tsx scripts/check-content.ts"
```

Run: `npx tsx scripts/check-content.ts`
Expected: FAIL, listing hundreds of offences under `components/ces`, `public/ces`, `lib/ces`.

- [ ] **Step 3: Delete the clone**

```bash
git rm -r --quiet components/ces public/ces docs/research
git rm --quiet app/ces.css app/ces-inline.css app/ces-extra.css
git rm --quiet lib/ces/legal.ts lib/ces/solutions.ts lib/ces/structured-data.ts lib/showcase.ts
git rm --quiet scripts/download-assets.mjs scripts/download-bcdn.mjs scripts/localize-css.mjs \
  scripts/recolor-css.mjs scripts/rebrand-lottie.mjs scripts/extract-any.mjs \
  scripts/extract-section.mjs scripts/extract-solutions.mjs scripts/page-topology.mjs \
  scripts/prune-assets.mjs scripts/ocr-assets.swift
```

- [ ] **Step 4: Replace the site layout with a bare shell**

Replace `app/(site)/layout.tsx` entirely (the header and footer arrive in Task 5):

```tsx
import "../globals.css";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
```

- [ ] **Step 5: Replace every marketing page with a placeholder**

Delete the old page bodies and the now-dangling route folders, then create these files. Each is deliberately minimal — Phase 2 writes the real content.

`app/(site)/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Free Email Signature Generator | TheMailSignature" },
  description:
    "Create an email signature that renders correctly in Gmail, Outlook and Apple Mail. Free, no account needed to start.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-[#0B1F52]">
        TheMailSignature
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        An email signature that renders correctly everywhere.
      </p>
    </main>
  );
}
```

Create the same shape for each remaining route, changing only the slug, `title`, `description` and `<h1>`:

| File | Title | H1 |
|---|---|---|
| `app/(site)/templates/page.tsx` | `Email Signature Templates \| TheMailSignature` | Templates |
| `app/(site)/pricing/page.tsx` | `Pricing \| TheMailSignature` | Pricing |
| `app/(site)/teams/page.tsx` | `Email Signatures for Teams \| TheMailSignature` | For teams |
| `app/(site)/about/page.tsx` | `About \| TheMailSignature` | About |
| `app/(site)/contact/page.tsx` | `Contact \| TheMailSignature` | Contact |
| `app/(site)/help/page.tsx` | `Help Centre \| TheMailSignature` | Help |
| `app/(site)/industries/page.tsx` | `Signatures by Industry \| TheMailSignature` | Industries |
| `app/(site)/legal/terms/page.tsx` | `Terms of Use \| TheMailSignature` | Terms of Use |
| `app/(site)/legal/privacy/page.tsx` | `Privacy Policy \| TheMailSignature` | Privacy Policy |
| `app/(site)/legal/cookies/page.tsx` | `Cookie Policy \| TheMailSignature` | Cookie Policy |
| `app/(site)/legal/data-deletion/page.tsx` | `Delete Your Data \| TheMailSignature` | Delete your data |

Then remove the old folders:

```bash
git rm -r --quiet "app/(site)/browse-1000-industries" "app/(site)/contact-us" \
  "app/(site)/cookies-policy" "app/(site)/demo" "app/(site)/privacypolicy" \
  "app/(site)/solution" "app/(site)/support" "app/(site)/terms-of-use" \
  "app/(site)/tutorials" "app/(site)/user-data-deletion"
```

- [ ] **Step 6: Fix the root metadata**

In `app/layout.tsx`, replace the `SITE` constant and `metadata` block:

```tsx
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "TheMailSignature — free email signature generator",
    template: "%s | TheMailSignature",
  },
  description:
    "Create a professional email signature that renders correctly in Gmail, Outlook and Apple Mail.",
  robots: { index: true, follow: true },
};
```

Also delete the two Google Fonts `<link>` tags and the `preconnect` pair from the `<head>`; Task 3 loads type through `next/font` instead.

- [ ] **Step 7: Fix the sitemap**

Replace the `PAGES` array in `app/sitemap.ts` and drop the `solutionSlugs` import:

```ts
import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

const PAGES: Array<[path: string, priority: number]> = [
  ["", 1],
  ["/editor", 0.9],
  ["/templates", 0.8],
  ["/pricing", 0.8],
  ["/teams", 0.7],
  ["/industries", 0.7],
  ["/about", 0.5],
  ["/help", 0.5],
  ["/contact", 0.5],
  ["/legal/terms", 0.3],
  ["/legal/privacy", 0.3],
  ["/legal/cookies", 0.3],
  ["/legal/data-deletion", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({
    url: `${SITE}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
```

- [ ] **Step 8: Verify the guard now passes and the app still builds**

Run: `npm test`
Expected: all four suites PASS, ending with "Content guard passed: no cloned brand references."

Run: `npx tsc --noEmit && npm run lint && npx next build`
Expected: no errors; the route list no longer contains `/solution/*`, `/demo`, `/support`, `/tutorials`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Remove the customesignature.com clone and guard against its return

Deletes the cloned Webflow CSS, components, assets, legal text and generated
solution copy, replacing the marketing routes with placeholder pages that keep
the URL space and the build intact. scripts/check-content.ts now fails the test
run if any cloned brand string reappears.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Brand asset pipeline

**Files:**
- Create: `scripts/gen-brand-assets.mjs`
- Create (generated): `public/brand/wordmark.png`, `public/brand/wordmark@2x.png`, `public/brand/wordmark-light.png`, `public/brand/mark.png`, `public/brand/icon-192.png`, `public/brand/icon-512.png`, `public/brand/og.png`
- Create: `app/icon.png` (copied from `mark.png` by the script), `app/apple-icon.png`
- Delete: `app/favicon.ico` — Next's unbranded template icon. It is served at `/favicon.ico` in preference to anything generated, so leaving it means browsers and tabs keep showing the old mark.
- Create: `scripts/check-brand.ts`
- Modify: `package.json` (add `brand` script; extend `test`)
- Keep: `public/brand/logo-source.png` (the supplied original)

**Interfaces:**
- Consumes: `public/brand/logo-source.png` (1254×1254 PNG, artwork occupies 1109×254 after trim).
- Produces: the asset files above, and `npm run brand` to regenerate them. `Logo` (Task 4) consumes `wordmark.png`, `wordmark@2x.png` and `wordmark-light.png`.

- [ ] **Step 1: Write the failing asset check**

Create `scripts/check-brand.ts`:

```ts
/**
 * Brand assets are generated, not hand-made, so they are easy to regenerate and
 * easy to get wrong silently. This asserts every file the layout references
 * exists and has the expected geometry.
 */
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const EXPECTED: Array<{ file: string; width: number; height?: number }> = [
  { file: "public/brand/wordmark.png", width: 560 },
  { file: "public/brand/wordmark@2x.png", width: 1120 },
  { file: "public/brand/wordmark-light.png", width: 560 },
  { file: "public/brand/mark.png", width: 512, height: 512 },
  { file: "public/brand/icon-192.png", width: 192, height: 192 },
  { file: "public/brand/icon-512.png", width: 512, height: 512 },
  { file: "public/brand/og.png", width: 1200, height: 630 },
  { file: "app/icon.png", width: 512, height: 512 },
];

const failures: string[] = [];

for (const { file, width, height } of EXPECTED) {
  if (!existsSync(file)) {
    failures.push(`${file}: missing (run \`npm run brand\`)`);
    continue;
  }
  const meta = await sharp(file).metadata();
  if (meta.width !== width) failures.push(`${file}: width ${meta.width}, expected ${width}`);
  if (height && meta.height !== height) {
    failures.push(`${file}: height ${meta.height}, expected ${height}`);
  }
  if (statSync(file).size > 400 * 1024) failures.push(`${file}: over 400KB`);
}

if (failures.length) {
  console.error("Brand asset check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`Brand asset check passed: ${EXPECTED.length} files.`);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-brand.ts`
Expected: FAIL — every file except nothing is missing ("run `npm run brand`").

- [ ] **Step 3: Write the generator**

Create `scripts/gen-brand-assets.mjs`:

```js
/**
 * Generates every brand raster from the single supplied logo.
 *
 * The source is a square PNG with the artwork floating in white space, so each
 * output starts from a trimmed copy. The light ("knockout") variant is derived
 * by inverting the trimmed art: the logo is dark ink on white, so an inversion
 * yields white ink on dark, which is what a navy footer needs. Replace this
 * step if a proper vector original arrives.
 */
import { mkdirSync, copyFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "public/brand/logo-source.png";
const OUT = "public/brand";
const NAVY = { r: 0x0b, g: 0x1f, b: 0x52 };

mkdirSync(OUT, { recursive: true });

const trimmed = await sharp(SRC).trim({ threshold: 12 }).toBuffer();

// Wordmark, 1x and 2x, on transparent-safe white.
await sharp(trimmed).resize({ width: 560 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark.png`);
await sharp(trimmed).resize({ width: 1120 }).png({ compressionLevel: 9 })
  .toFile(`${OUT}/wordmark@2x.png`);

// Knockout variant for navy/dark surfaces.
await sharp(trimmed).negate({ alpha: false }).resize({ width: 560 })
  .png({ compressionLevel: 9 }).toFile(`${OUT}/wordmark-light.png`);

// Square mark: the envelope glyph sits in the left-centre third of the lockup.
const meta = await sharp(trimmed).metadata();
const markSide = meta.height;
const markLeft = Math.round(meta.width * 0.21);
await sharp(trimmed)
  .extract({ left: markLeft, top: 0, width: markSide, height: markSide })
  .resize(512, 512, { fit: "contain", background: "#ffffff" })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/mark.png`);

for (const size of [192, 512]) {
  await sharp(`${OUT}/mark.png`).resize(size, size).png({ compressionLevel: 9 })
    .toFile(`${OUT}/icon-${size}.png`);
}
copyFileSync(`${OUT}/mark.png`, "app/icon.png");
copyFileSync(`${OUT}/icon-192.png`, "app/apple-icon.png");

// Open Graph card: wordmark centred on navy.
const ogLogo = await sharp(trimmed).negate({ alpha: false }).resize({ width: 760 }).toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: NAVY },
})
  .composite([{ input: ogLogo, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og.png`);

console.log("Brand assets written to public/brand and app/.");
```

- [ ] **Step 4: Add the scripts and run the generator**

In `package.json`, add `"brand": "node scripts/gen-brand-assets.mjs"` and append `&& tsx scripts/check-brand.ts` to `test`.

```bash
git rm --quiet app/favicon.ico
npm run brand
```

Run: `npx tsx scripts/check-brand.ts`
Expected: PASS — "Brand asset check passed: 8 files."

- [ ] **Step 5: Eyeball the output**

Open `public/brand/mark.png` and `public/brand/og.png`. The mark must contain the envelope glyph, not a slice of the letter "T" — if the crop is off, adjust `markLeft` (the `0.21` factor) and re-run. This is the one step a test cannot judge.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-brand-assets.mjs scripts/check-brand.ts package.json public/brand app/icon.png app/apple-icon.png
git commit -m "Generate TheMailSignature brand assets from the supplied logo

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Design tokens

**Files:**
- Modify: `app/globals.css` (replace the `@theme` block)
- Modify: `app/layout.tsx` (load Inter through `next/font`)
- Create: `scripts/check-tokens.ts`
- Modify: `package.json` (extend `test`)

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities `bg-navy-*`, `text-navy-*`, `bg-blue-brand-*`, plus the existing `ink-*` scale. Tasks 4–7 use only these.

- [ ] **Step 1: Write the failing token check**

Create `scripts/check-tokens.ts`:

```ts
/**
 * The palette is the brand. This asserts the tokens the components rely on
 * exist, and that the placeholder palette from the original template (green
 * `brand-*`, purple `taskgo-*`) is gone — leaving them would let a stale
 * utility class ship a colour that is not ours.
 */
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");
const failures: string[] = [];

const REQUIRED = [
  "--color-navy-900: #0b1f52",
  "--color-blue-brand-600: #0050b8",
  "--color-navy-50",
  "--color-blue-brand-50",
];
for (const token of REQUIRED) {
  if (!css.toLowerCase().includes(token.toLowerCase())) failures.push(`missing token: ${token}`);
}

const FORBIDDEN = [/--color-taskgo-/, /#1e866a/i, /#8b5cf6/i];
for (const pattern of FORBIDDEN) {
  if (pattern.test(css)) failures.push(`stale palette present: ${pattern}`);
}

if (failures.length) {
  console.error("Token check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Token check passed.");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-tokens.ts`
Expected: FAIL — missing navy/blue tokens, stale `--color-taskgo-` present.

- [ ] **Step 3: Replace the `@theme` block in `app/globals.css`**

Replace lines 5–46 (the whole `@theme { … }` block) with:

```css
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Navy — the logo's serif and script ink. Primary text and dark surfaces. */
  --color-navy-50: #eef2fa;
  --color-navy-100: #d6def1;
  --color-navy-200: #aebde3;
  --color-navy-300: #7a90cc;
  --color-navy-400: #4a63a8;
  --color-navy-500: #26417f;
  --color-navy-600: #163264;
  --color-navy-700: #0f2757;
  --color-navy-800: #0c2250;
  --color-navy-900: #0b1f52;
  --color-navy-950: #061334;

  /* Blue — the logo's envelope and signature stroke. Actions and links. */
  --color-blue-brand-50: #eaf2fd;
  --color-blue-brand-100: #d0e2fb;
  --color-blue-brand-200: #a3c6f6;
  --color-blue-brand-300: #6ba4ef;
  --color-blue-brand-400: #3a82e4;
  --color-blue-brand-500: #1565d8;
  --color-blue-brand-600: #0050b8;
  --color-blue-brand-700: #004096;
  --color-blue-brand-800: #003679;
  --color-blue-brand-900: #002d63;
  --color-blue-brand-950: #001c42;

  /* Neutrals (unchanged — the builder already uses these). */
  --color-ink-50: #f7f8fa;
  --color-ink-100: #eef0f4;
  --color-ink-200: #dfe3ea;
  --color-ink-300: #c6ccd8;
  --color-ink-400: #969eae;
  --color-ink-500: #6c7486;
  --color-ink-600: #4d5464;
  --color-ink-700: #3a404d;
  --color-ink-800: #23272f;
  --color-ink-900: #171920;
  --color-ink-950: #0e1014;

  --radius-card: 14px;
}
```

Then, further down the same file, replace every remaining `brand-*` / `taskgo-*` reference: `::selection` background becomes `var(--color-blue-brand-100)` with colour `var(--color-navy-900)`; the dark `::selection` becomes `var(--color-navy-700)` / `var(--color-navy-50)`; the focus ring outline becomes `var(--color-blue-brand-600)`.

- [ ] **Step 4: Load Inter through `next/font`**

In `app/layout.tsx`, add at the top and apply the variable to `<html>`:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
```

```tsx
<html lang="en" className={inter.variable}>
```

- [ ] **Step 5: Fix the two components that use the old palette**

`components/ui.tsx`: in `Button`, change `primary` to `bg-blue-brand-600 text-white hover:bg-blue-brand-700 active:translate-y-px disabled:bg-blue-brand-600/50`; in `Toggle`, change `bg-brand-600` to `bg-blue-brand-600`.
`app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx`: change `text-brand-600` to `text-blue-brand-600`.

- [ ] **Step 6: Verify**

Run: `npx tsx scripts/check-tokens.ts && npx tsc --noEmit && npm run lint && npx next build`
Expected: token check PASS; build succeeds. Then `rg "brand-600|taskgo" app components` returns only `blue-brand-*` matches.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx components/ui.tsx "app/(auth)" scripts/check-tokens.ts package.json
git commit -m "Replace the placeholder palette with the logo's navy and blue tokens

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Component test setup and the `Logo` component

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Create: `components/brand/Logo.tsx`
- Create: `components/brand/Logo.test.tsx`
- Delete: `components/site/Wordmark.tsx` (old lockup)
- Modify: `components/builder/Builder.tsx:13,143` (import and use `Logo`)
- Modify: `package.json` (add `test:unit`, extend `test`)

**Interfaces:**
- Consumes: `public/brand/wordmark.png`, `wordmark@2x.png`, `wordmark-light.png` (Task 2).
- Produces: `<Logo tone="dark" | "light" href="/" className? />` — a `next/link` wrapping the wordmark image, `aria-label="TheMailSignature home"`. Tasks 5 and 7 consume it.

- [ ] **Step 1: Install the test toolchain**

```bash
npm i -D vitest@^3 @vitejs/plugin-react@^5 jsdom@^26 @testing-library/react@^16 @testing-library/jest-dom@^6
```

- [ ] **Step 2: Configure Vitest**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["components/**/*.test.tsx", "lib/**/*.test.ts"],
  },
  resolve: { alias: { "@": resolve(__dirname, ".") } },
});
```

`vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write the failing test**

`components/brand/Logo.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("links home and names the brand for screen readers", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: "TheMailSignature home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses the knockout wordmark on dark surfaces", () => {
    render(<Logo tone="light" />);
    expect(screen.getByAltText("TheMailSignature")).toHaveAttribute(
      "src",
      expect.stringContaining("wordmark-light"),
    );
  });

  it("uses the navy wordmark by default", () => {
    render(<Logo />);
    const img = screen.getByAltText("TheMailSignature");
    expect(img.getAttribute("src")).toContain("wordmark");
    expect(img.getAttribute("src")).not.toContain("light");
  });
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npx vitest run components/brand/Logo.test.tsx`
Expected: FAIL — cannot resolve `./Logo`.

- [ ] **Step 5: Write the component**

`components/brand/Logo.tsx`:

```tsx
import Link from "next/link";

/**
 * The brand lockup. Raster rather than inline SVG because the supplied logo is
 * a PNG; swap the `src` pair for an SVG if a vector original arrives — nothing
 * else needs to change.
 */
export function Logo({
  tone = "dark",
  href = "/",
  className = "",
  height = 28,
}: {
  tone?: "dark" | "light";
  href?: string;
  className?: string;
  height?: number;
}) {
  const file = tone === "light" ? "wordmark-light" : "wordmark";
  return (
    <Link
      href={href}
      aria-label="TheMailSignature home"
      className={`inline-flex items-center ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/${file}.png`}
        srcSet={tone === "light" ? undefined : "/brand/wordmark.png 1x, /brand/wordmark@2x.png 2x"}
        alt="TheMailSignature"
        style={{ height, width: "auto" }}
        decoding="async"
      />
    </Link>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/brand/Logo.test.tsx`
Expected: 3 tests PASS.

- [ ] **Step 7: Replace the old wordmark in the builder**

In `components/builder/Builder.tsx`, change the import on line 13 from `import { Wordmark } from "@/components/site/Wordmark";` to `import { Logo } from "@/components/brand/Logo";`, and the usage on line 143 from `<Wordmark />` to `<Logo />`. Then `git rm components/site/Wordmark.tsx`.

- [ ] **Step 8: Wire unit tests into `npm test` and verify everything**

In `package.json`: add `"test:unit": "vitest run"` and append `&& vitest run` to the `test` script.

Run: `npm test && npx tsc --noEmit && npm run lint`
Expected: all node suites PASS, Vitest PASS, no type or lint errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add component testing and the TheMailSignature Logo lockup

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Site header and footer

**Files:**
- Create: `components/site/SiteHeader.tsx`, `components/site/SiteHeader.test.tsx`
- Create: `components/site/SiteFooter.tsx`, `components/site/SiteFooter.test.tsx`
- Create: `components/site/Container.tsx`

**Interfaces:**
- Consumes: `Logo` from Task 4.
- Produces: `<SiteHeader />`, `<SiteFooter />`, `<Container>{children}</Container>`. Task 6 mounts all three in `app/(site)/layout.tsx`.

- [ ] **Step 1: Write the failing tests**

`components/site/SiteHeader.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("offers the primary navigation", () => {
    render(<SiteHeader />);
    for (const label of ["Templates", "Pricing", "For teams", "Help"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("sends the primary call to action to the editor", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Create my signature" }))
      .toHaveAttribute("href", "/editor");
  });

  it("starts with a skip link for keyboard users", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Skip to content" }))
      .toHaveAttribute("href", "#main");
  });
});
```

`components/site/SiteFooter.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("links every legal page", () => {
    render(<SiteFooter />);
    const expected: Array<[string, string]> = [
      ["Terms of Use", "/legal/terms"],
      ["Privacy Policy", "/legal/privacy"],
      ["Cookie Policy", "/legal/cookies"],
      ["Delete your data", "/legal/data-deletion"],
    ];
    for (const [label, href] of expected) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }
  });

  it("has no placeholder links", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelectorAll('a[href="#"]')).toHaveLength(0);
  });

  it("states the current copyright year", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`${year}.*TheMailSignature`))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run components/site`
Expected: FAIL — cannot resolve `./SiteHeader` and `./SiteFooter`.

- [ ] **Step 3: Write `Container`**

```tsx
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}
```

- [ ] **Step 4: Write `SiteHeader`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "For teams", href: "/teams" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-ink-700 hover:text-navy-900 sm:inline">
            Log in
          </Link>
          <Link
            href="/editor"
            className="rounded-[10px] bg-blue-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700"
          >
            Create my signature
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-nav-mobile"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-ink-700 md:hidden"
          >
            <span aria-hidden className="block h-0.5 w-5 bg-current" />
            <span aria-hidden className="mt-1 block h-0.5 w-5 bg-current" />
            <span aria-hidden className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </Container>
      {open ? (
        <nav id="site-nav-mobile" aria-label="Main" className="border-t border-ink-200 bg-white md:hidden">
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-ink-700"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium text-ink-700">
              Log in
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
```

- [ ] **Step 5: Write `SiteFooter`**

```tsx
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Signature editor", href: "/editor" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "For teams", href: "/teams" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help", href: "/help" },
      { label: "Signatures by industry", href: "/industries" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Delete your data", href: "/legal/data-deletion" },
    ],
  },
];

/**
 * Social links are deliberately absent until the accounts exist. An `href="#"`
 * placeholder is a broken promise to the reader and was one of the defects
 * inherited from the cloned site.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-200 bg-navy-900 text-navy-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" height={26} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
            Email signatures that render correctly in Gmail, Outlook and Apple Mail.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-100 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-t border-navy-700 py-6">
        <p className="text-xs text-navy-300">
          © {new Date().getFullYear()} TheMailSignature. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/site`
Expected: 6 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add components/site components/brand
git commit -m "Add the site header, footer and container primitives

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Mount the shell and add the redirects

**Files:**
- Modify: `app/(site)/layout.tsx`
- Modify: `next.config.ts` (add `redirects()`)
- Create: `scripts/check-redirects.ts`
- Modify: `package.json` (extend `test`)

**Interfaces:**
- Consumes: `SiteHeader`, `SiteFooter` (Task 5).
- Produces: every legacy URL 308s to its new home; `#main` exists as the skip-link target.

- [ ] **Step 1: Write the failing redirect check**

`scripts/check-redirects.ts`:

```ts
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

const rules = await nextConfig.redirects!();
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
  if (rule.permanent !== true) failures.push(`${source} is not permanent`);
}

if (failures.length) {
  console.error("Redirect check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`Redirect check passed: ${Object.keys(EXPECTED).length} legacy URLs covered.`);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-redirects.ts`
Expected: FAIL — "no redirect for /generator" and nine more.

- [ ] **Step 3: Add the redirects to `next.config.ts`**

Inside `nextConfig`, after `headers()`:

```ts
  async redirects() {
    return [
      { source: "/generator", destination: "/editor", permanent: true },
      { source: "/solution/:slug", destination: "/industries/:slug", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacypolicy", destination: "/legal/privacy", permanent: true },
      { source: "/terms-of-use", destination: "/legal/terms", permanent: true },
      { source: "/cookies-policy", destination: "/legal/cookies", permanent: true },
      { source: "/user-data-deletion", destination: "/legal/data-deletion", permanent: true },
      { source: "/browse-1000-industries", destination: "/industries", permanent: true },
      { source: "/support", destination: "/help", permanent: true },
      { source: "/tutorials", destination: "/help", permanent: true },
    ];
  },
```

- [ ] **Step 4: Mount the shell**

Replace `app/(site)/layout.tsx`:

```tsx
import "../globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
```

Then remove the now-duplicated `<main>` wrapper from each placeholder page created in Task 1, leaving the inner `<div className="mx-auto max-w-3xl px-6 py-24">`.

- [ ] **Step 5: Verify**

Run: `npx tsx scripts/check-redirects.ts && npx next build`
Expected: redirect check PASS; build succeeds.

Run: `npm run dev`, then in a second shell:

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/solution/lawyers
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/privacypolicy
```

Expected: `308 -> http://localhost:3000/industries/lawyers` and `308 -> http://localhost:3000/legal/privacy`.

- [ ] **Step 6: Commit**

```bash
git add "app/(site)" next.config.ts scripts/check-redirects.ts package.json
git commit -m "Mount the site shell and redirect every legacy URL

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Move the generator to /editor

**Files:**
- Create: `app/editor/layout.tsx`, `app/editor/page.tsx`
- Delete: `app/generator/layout.tsx`, `app/generator/page.tsx`
- Modify: `proxy.ts:5,54` (protect `/editor`, not `/generator`)
- Modify: `lib/safe-next.ts:2,7` (the post-authentication default destination)
- Modify: `scripts/check-safe-next.ts:34,37` (assertions that name `/generator`)
- Modify: `lib/ces/solution-seo.ts` → move to `lib/marketing/industry-seo.ts`

**Interfaces:**
- Consumes: `Builder` (`components/builder/Builder.tsx`), unchanged.
- Produces: `/editor` serves the builder. It stays behind the session gate in this phase; Phase 3 opens it to anonymous visitors.

- [ ] **Step 1: Create the editor route**

`app/editor/layout.tsx`:

```tsx
import "../globals.css";

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
```

`app/editor/page.tsx`:

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Builder } from "@/components/builder/Builder";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email signature editor",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/editor" },
};

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/editor");

  return <Builder />;
}
```

- [ ] **Step 2: Repoint the proxy and the post-login default**

In `proxy.ts`, change line 5 to `const PROTECTED_PREFIXES = ["/editor"];` and the matcher on line 54 to `matcher: ["/editor/:path*"]`.

`lib/safe-next.ts` returns `/generator` as its fallback whenever the `next`
parameter is missing or unsafe, so it decides where every login lands. Change
both occurrences (lines 2 and 7) to `/editor`:

```ts
export function safeNext(next?: string): string {
  if (!next) return "/editor";
  const clean = next.replace(/[\t\n\r]/g, "");
  if (!/^\/(?!\/|\\)/.test(clean)) return "/editor";
  return clean;
}
```

Keep the rest of the file exactly as it is — the tab/LF/CR stripping and the
`//`-prefix rejection are the open-redirect guard, and `scripts/check-safe-next.ts`
covers nine hostile inputs against them.

Then update that test's expectations, which name the old path on lines 34 and 37:

```ts
  check(`rejects ${JSON.stringify(input)} -> /editor`, result === "/editor");
```

```ts
const PASSED_THROUGH = ["/editor", "/editor?a=b"];
```

Run: `npx tsx scripts/check-safe-next.ts`
Expected: PASS — "All safeNext checks passed: 9 rejected inputs, 2 passthrough inputs."

- [ ] **Step 3: Move the industry SEO data**

```bash
mkdir -p lib/marketing
git mv lib/ces/solution-seo.ts lib/marketing/industry-seo.ts
rmdir lib/ces 2>/dev/null || true
```

In the moved file, rename the export `solutionSeo` to `industrySeo` and the type `SolutionSeo` to `IndustrySeo`, and update the header comment to refer to `/industries/<slug>` and TheMailSignature.

- [ ] **Step 4: Delete the old route and verify**

```bash
git rm -r --quiet app/generator
```

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: everything PASS; the route list shows `/editor` and no `/generator`.

Run `npm run dev`, then: `curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" http://localhost:3000/generator`
Expected: `308 -> http://localhost:3000/editor`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Move the builder from /generator to /editor

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Refresh the project documentation

**Files:**
- Modify: `README.md`
- Modify: `.env.example`

**Interfaces:**
- Consumes: the finished state of Tasks 1–7.
- Produces: documentation matching the code, for whoever picks up Phase 2.

- [ ] **Step 1: Rewrite the README sections that describe the clone**

Delete the "The marketing site", "Regenerating the site's CSS and assets", "Working with a section" and "Known gaps" sections wholesale. Add in their place:

```markdown
## The marketing site

`app/(site)/` is original work for TheMailSignature. It uses the Tailwind token
set in `app/globals.css` (navy `#0B1F52`, blue `#0050B8`) and the shared shell in
`components/site/`. There is no second stylesheet and no cloned markup: the
former Webflow clone was removed in Phase 1, and `scripts/check-content.ts`
fails the test run if any of its strings return.

Brand rasters are generated from `public/brand/logo-source.png`:

```bash
npm run brand   # wordmark, knockout, square mark, icons, OG card
```
```

Update the `Commands` section to list `npm test` as running five suites (render, safeNext, hardening, content, brand, tokens, redirects) plus Vitest component tests, and change every remaining "Mail Signature" to "TheMailSignature".

- [ ] **Step 2: Update `.env.example`**

Change the two default URLs to `https://themailsignature.com` and `https://cdn.themailsignature.com`, and the comment referring to the generator to say `/editor`.

- [ ] **Step 3: Final full verification**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: every suite PASS, 0 lint errors, build succeeds.

Run: `rg -i "customesignature|custom esignature|mailsignature\.com|\bMail Signature\b" app components lib scripts README.md .env.example`
Expected: no matches (only `themailsignature.com` should appear).

- [ ] **Step 4: Commit**

```bash
git add README.md .env.example
git commit -m "Update the documentation for TheMailSignature

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Phase 1 exit criteria

- `npm test` runs render, safeNext, hardening, content, brand, token and redirect suites plus the Vitest component tests, all green.
- `npx next build` succeeds; the route list contains `/editor`, the placeholder marketing routes and no `/solution/*`.
- `rg -i "customesignature|Mail Signature"` returns nothing across the repository.
- Every legacy URL 308s to its replacement.
- The header, footer and logo render in the brand palette with no `href="#"` links.

## What Phase 1 deliberately does not do

Real marketing copy, the templates gallery, the pricing matrix, legal text, the open (signed-out) editor, accounts, billing and teams. Those are Phases 2–6, each with its own plan.
