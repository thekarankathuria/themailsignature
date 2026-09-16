# Phase 2 — Marketing site design

Date: 2026-09-16
Status: approved (decisions delegated to Claude by the user)
Parent spec: `2026-09-15-themailsignature-production-design.md` (§4 content rules, §5 Phase 2)

## 1. Goal

Replace the Phase 1 placeholder pages in `app/(site)/` with TheMailSignature's
real marketing site: homepage, templates gallery, pricing, teams, 21 industry
pages, help, about, contact and four legal pages, plus refreshed SEO plumbing.
Every word is original, and nothing on the site can claim something the product
does not do by launch day.

## 2. Decisions

| Question | Decision |
|---|---|
| Content architecture | Copy lives in typed data under `lib/marketing/`; pages are thin compositions of `components/marketing/` sections. No MDX. |
| Industry pages | One shared template + per-industry data. All 21 ship in this phase, each with distinct copy. |
| Prices | Placeholder numbers in one file, `lib/pricing.ts`, flagged `provisional`. Pro $5/mo or $48/yr; Business $4/user/mo or $38/user/yr, 3-seat minimum. |
| Product imagery | Signatures are rendered live by `lib/signature` inside an "email window" frame. Editor screenshots are captured by a Playwright script into `public/product/`. |
| Unshipped features | Described as they will be at launch, but every claim is registered with its shipping phase; `npm run check:launch` fails while any is unshipped. |
| Sample data | Fictional people and companies on the reserved `.example` TLD. Logos and avatars are generated monograms, never photos of real people. |

## 3. Routes and page content

| Route | Sections |
|---|---|
| `/` | Hero (headline, subhead, "Create your signature" → `/editor`, secondary "See templates"; a live signature in an email frame) → "Works in" strip (the client names from `CLIENTS` in `lib/signature/clients.ts`, as text linking to their `/help` anchors — no third-party logos) → How it works (3 steps with editor screenshots) → Feature grid → Template strip (4 live templates, link to `/templates`) → Pricing summary (the three plan cards) → FAQ → Final CTA |
| `/templates` | Intro → grid of all 8 templates, each rendered live with its own sample person, name and blurb from `TEMPLATES`, button "Use this template" → `/editor?template=<id>` → CTA |
| `/pricing` | Intro → plan cards with a monthly/annual toggle → full comparison matrix grouped by category → billing FAQ |
| `/teams` | Business hero → problems it solves (inconsistent signatures, off-brand edits, no visibility) → capabilities (company template with locked fields, brand kit, member invites and seats, click analytics) → how rollout works (3 steps) → Business price → FAQ → CTA |
| `/industries` | Intro → grid of 21 cards (name + one-line hook) linking to each page |
| `/industries/[slug]` | Hero (industry H1, intro paragraph) → "What to include" (4–6 industry-specific tips) → live example signature (industry sample person, recommended template) → "Mistakes to avoid" (3 items) → 3 FAQs → CTA → links to 3 related industries. `generateStaticParams` over the 21 slugs; `dynamicParams = false` so any other slug 404s. |
| `/help` | Setup guide per email client (grouped as in `CLIENT_GROUPS`, one anchor per client id, steps and notes from `CLIENTS`) → troubleshooting FAQ → "Still stuck?" → `/contact` |
| `/about` | What the product is and why it exists (render-everywhere engineering, privacy stance: no tracking pixels in signatures). No founder story, team photos or numbers. |
| `/contact` | Short intro → contact form → expected response time stated as `[PLACEHOLDER]` |
| `/legal/terms`, `/privacy`, `/cookies`, `/data-deletion` | Original policies for this business. Entity name, jurisdiction, address and contact email come from `lib/marketing/company.ts`, whose unset values are `[PLACEHOLDER: …]` strings. Each page shows "last updated" and, while placeholders remain, a visible "draft — pending legal review" notice. The cookie policy lists only what the app actually sets today (Supabase auth cookies; the editor's `localStorage` draft) and states that no analytics run yet. Data deletion describes the email-request process until Phase 3 adds self-serve deletion (a tracked claim). |

Site-wide: the root layout's default Open Graph image is `/brand/og.png`; each
page sets its own title, description and canonical from `lib/marketing/pages.ts`.
The sitemap adds the 21 industry URLs. JSON-LD: `Organization` + `WebSite` on
`/`, `SoftwareApplication` with `offers` from `lib/pricing.ts` on `/pricing` (no
`aggregateRating`, ever), `FAQPage` wherever an FAQ renders, `BreadcrumbList` on
industry pages.

## 4. Units

### 4.1 Content data — `lib/marketing/`

| File | Holds |
|---|---|
| `claims.ts` | `CLAIMS`: the registry of every product capability the site mentions — `{ id, label, shipsIn: 1–5 }`, where `shipsIn` is the phase that delivers it (1 = already shipped). `SHIPPED_THROUGH_PHASE` constant (currently `2`). `isShipped(id)`. |
| `pages.ts` | `PAGE_META`: title, description and canonical path for every static route; `pageMetadata(key)` returns a Next `Metadata` object. |
| `home.ts`, `teams.ts`, `about.ts` | Section copy for those pages. Any block that describes a capability lists the claim ids it relies on in a `claims` array. |
| `faqs.ts` | FAQ sets keyed by page (`home`, `pricing`, `teams`, `help`). |
| `industries.ts` | `INDUSTRIES`: 21 entries — `slug, name, hook, intro, include[], avoid[], faqs[], templateId, sample (SignatureData overrides), related[]`. SEO strings keep living in `industry-seo.ts`. |
| `samples.ts` | `sampleSignature(overrides, templateId)` → `{ data, style }` built on `DEFAULT_DATA`/`DEFAULT_STYLE`; the 8 per-template sample people. |
| `company.ts` | `COMPANY`: legal name, jurisdiction, address, support email, response time — placeholders until supplied. `PLACEHOLDER_PREFIX`. |
| `lib/pricing.ts` | `PLANS` (id, name, monthly, annual, seat rules, `features: claimId[]`), `COMPARISON` (category → rows of `{ claimId, free, pro, business }`), `PRICES_PROVISIONAL = true`. Phase 4 reads the same file to map plans to Stripe prices. |

### 4.2 Components — `components/marketing/`

Server components unless noted:

- `Section`, `SectionHeading` — vertical rhythm and heading/eyebrow/lede pattern on top of `Container`.
- `EmailFrame` — a faux mail window (from/to/subject lines, body skeleton) that wraps children.
- `SignaturePreview` — calls `renderSignature(data, style, { assetBase: "" })` and injects the result. Safe because all input is our own sample data and the engine escapes everything (covered by `check-render.ts`).
- `FeatureGrid`, `Steps`, `TemplateCard`, `FaqList` (native `<details>`, no JS) + its `FAQPage` JSON-LD, `CtaBanner`, `JsonLd`, `LegalPage` (prose wrapper, last-updated line, draft notice).
- `PricingCards` (client: monthly/annual toggle), `ComparisonTable`.
- `ContactForm` (client): posts JSON to `/api/contact`, shows field errors, a success state and a server-error state; includes a visually hidden honeypot field.

### 4.3 Changes outside the marketing tree

- `app/api/contact/route.ts` + `lib/contact/delivery.ts`: payload becomes `{ firstName, lastName, email, company?, topic, message, website (honeypot) }`. Phone and the mandatory marketing opt-in are dropped (a contact reply needs neither). A filled honeypot returns `200 { ok: true }` without delivering. Parsing moves to an exported `parseContact()` so it can be unit-tested.
- `app/editor/page.tsx` + `components/builder/Builder.tsx`: the page reads `searchParams.template`, validates it against `TEMPLATE_BY_ID`, and passes `initialTemplate`; the builder applies it once over the restored state. `lib/signature/**` is not modified.
- `app/layout.tsx`: default `openGraph`/`twitter` image. `app/sitemap.ts`: industry URLs.
- Deleted: unused `public/dashboard_mockup.jpg`, `public/hero_bg.jpg`, `public/logo_symbol.png`, the create-next-app SVGs, and `docs/design-references/` (screenshots of the removed clone, which carry exactly the fake ratings and "AI" claims this site must not copy).

### 4.4 Scripts

- `scripts/gen-sample-assets.mjs` (`npm run samples`): sharp renders monogram logos and initials avatars for every sample person into `public/samples/`. Committed output.
- `scripts/capture-screenshots.mjs` (`npm run screenshots`): Playwright (`@playwright/test` dev dependency; browsers already cached locally) starts from `BASE_URL` (default `http://localhost:3000`), signs in with `SCREENSHOT_EMAIL`/`SCREENSHOT_PASSWORD` from the environment (fails with a clear message if unset), and captures three editor states (details form, template picker, copy/install panel) at 2× into `public/product/`. Once Phase 3 opens the editor, the sign-in step becomes unnecessary.

## 5. Guards and testing

Added to `npm test`:

- `scripts/check-marketing.ts`
  - every `claims` id referenced by `lib/marketing/*` and `lib/pricing.ts` exists in `CLAIMS`;
  - `PAGE_META` and `industry-seo.ts`: titles ≤ 60 chars, descriptions ≤ 155 chars, all unique;
  - `INDUSTRIES` has exactly the 21 slugs of `industry-seo.ts`, each `related` slug exists, each `templateId` exists, and no two industries share an intro;
  - banned-claim scan over `app/(site)`, `components/marketing`, `lib/marketing`, `lib/pricing.ts`: `\bAI\b`, star glyphs, `\d(\.\d)?\s*/\s*5`, `\d+[kKmM]?\+?\s+(users|customers|companies|teams)`, `trusted by`, `#1`, `rating`, `testimonial`;
  - prints (does not fail on) unshipped claims and remaining placeholders.
- Vitest: `PricingCards` toggle switches prices; `FaqList` renders every Q&A and valid JSON-LD; `SignaturePreview` output contains the sample name; `ContactForm` shows errors and success; `parseContact` accepts a valid payload, rejects each invalid field, and flags the honeypot.

Separate command, not part of `npm test`:

- `npm run check:launch` (`scripts/check-launch.ts`): fails if any claim has `shipsIn > SHIPPED_THROUGH_PHASE`, any `[PLACEHOLDER` string remains in `lib/marketing/company.ts` or the legal pages, or `PRICES_PROVISIONAL` is true. Added to the parent spec's pre-launch checklist.
- `scripts/check-routes.ts` (`npm run check:routes`): against a running server (`BASE_URL`), fetches every sitemap URL plus every internal `href` found in those pages; fails on any non-200 (redirects followed) and on any page missing a `<title>`, meta description or canonical.

## 6. Done criteria

- `npm test`, `tsc --noEmit`, `npm run lint` and `next build` pass; the build lists all 21 `/industries/<slug>` pages as static.
- `npm run check:routes` passes against `next start`.
- Lighthouse SEO score ≥ 95 on `/`, `/pricing` and one industry page (headless, using the cached Playwright Chromium).
- `check-marketing.ts` reports no banned phrase; `check:launch` is expected to fail at this point, listing only Phase 3–5 claims, the company placeholders and provisional prices.
- `/solution/lawyers` 308s to `/industries/lawyers`, which returns 200.

## 7. Out of scope

Opening the editor to anonymous users (Phase 3), any billing behaviour behind the
pricing buttons (Phase 4; until then paid-plan buttons link to `/signup`),
analytics and cookie consent (Phase 6), a blog, and non-English pages.
