# Phase 2 — Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Phase 1 placeholder pages with TheMailSignature's real, original marketing site — homepage, templates, pricing, teams, 21 industry pages, help, about, contact, four legal pages — with every product claim tracked so nothing false can reach production.

**Architecture:** Copy is typed data in `lib/marketing/` (plus prices in `lib/pricing.ts`); pages in `app/(site)/` are thin server components composed from `components/marketing/`. Example signatures are rendered live by the existing engine (`lib/signature`) with fictional sample people. Node guard scripts (`npm test`) validate claim ids, SEO lengths and banned phrases; `npm run check:launch` blocks launch while claims are unshipped, placeholders remain or prices are provisional.

**Tech Stack:** Next.js 16.3.1 (App Router; `params`/`searchParams` are Promises), React 19.2, Tailwind CSS v4 tokens in `app/globals.css`, TypeScript strict, Vitest + Testing Library (jsdom), tsx node scripts, sharp, Playwright (`@playwright/test`, browsers already cached).

**Spec:** `docs/superpowers/specs/2026-09-16-phase-2-marketing-site-design.md` (parent: `docs/superpowers/specs/2026-09-15-themailsignature-production-design.md`)

**About the copy-heavy tasks (8, 9, 10, 11, 12, 13):** their data files are specified by exact type, required counts, per-entry facts and the rules the guard scripts enforce, rather than by pre-written prose. The executor writes the prose inside those constraints; the guards and the review gate check it.

## Global Constraints

- Brand name is exactly `TheMailSignature`. Never `Mail Signature`, `mailsignature.com` (except as part of `themailsignature.com`), `Custom Esignature`.
- Colours only from the tokens in `app/globals.css`: `navy-*`, `blue-brand-*`, `ink-*`; radius `rounded-card`. Light surfaces only on marketing pages.
- No statistic, rating, review, testimonial, customer count, "trusted by", "#1", "AI", or third-party company logo. Mail-client names appear as plain text only.
- Every product capability mentioned in copy is registered in `lib/marketing/claims.ts` and referenced by id from the copy block that mentions it.
- Sample people and companies are fictional, use the reserved `.example` TLD, and phone numbers in the `+1 (555) 01xx` fictional range. No photos of real people.
- `lib/signature/**` is not modified. `npm test`, `npx tsc --noEmit`, `npm run lint` (0 errors) pass at every commit.
- Next 16: page `params` and `searchParams` are `Promise`s and must be awaited. Read `node_modules/next/dist/docs/` before using any other Next API.
- tsx scripts cannot use top-level `await` (package is CommonJS): wrap in `async function main()`. After moving or deleting a route, `rm -rf .next/types .next/dev/types` before `tsc --noEmit`.
- Path alias `@/` = repository root. Commit messages end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## File map

```
lib/contact/parse.ts            parseContact() + CONTACT_TOPICS            (Task 1)
lib/contact/parse.test.ts                                                  (Task 1)
lib/marketing/claims.ts         CLAIMS registry, SHIPPED_THROUGH_PHASE      (Task 2)
lib/marketing/company.ts        COMPANY placeholders                        (Task 2)
lib/marketing/pages.ts          PAGE_META, pageMetadata()                   (Task 2)
lib/pricing.ts                  PLANS, COMPARISON, PRICES_PROVISIONAL       (Task 2)
lib/marketing/faqs.ts           Faq type, FAQS                              (Task 3, filled 6–11)
lib/marketing/sample-people.json  fictional people (29)                     (Task 4)
lib/marketing/samples.ts        sampleSignature(), TEMPLATE_SAMPLES         (Task 4)
lib/marketing/home.ts, teams.ts, about.ts, industries.ts                    (Tasks 6, 9, 11, 10)
components/marketing/*          section primitives and page parts           (Tasks 3–13)
scripts/check-marketing.ts      npm test guard                              (Task 2, extended 10)
scripts/check-launch.ts         npm run check:launch                        (Task 2)
scripts/gen-sample-assets.mjs   npm run samples                             (Task 4)
scripts/capture-screenshots.mjs npm run screenshots                         (Task 14)
scripts/check-routes.ts         npm run check:routes                        (Task 15)
```

---

### Task 1: Clean up the contact API

**Files:**
- Create: `lib/contact/parse.ts`, `lib/contact/parse.test.ts`
- Modify: `lib/contact/delivery.ts` (type + `asPlainText` + subject), `app/api/contact/route.ts` (use `parseContact`)

**Interfaces:**
- Produces: `CONTACT_TOPICS: readonly string[]`; `type ContactTopic`; `parseContact(body: unknown): ParseResult` where `ParseResult = { kind: "ok"; payload: ContactPayload } | { kind: "spam" } | { kind: "error"; field: string; error: string }`; `ContactPayload = { firstName; lastName; email; company; topic; message }` (all `string`). Request JSON keys are the same names plus the honeypot `website`.

- [ ] **Step 1: Write the failing test** — `lib/contact/parse.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseContact } from "./parse";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "",
  topic: "General question",
  message: "Hello there",
  website: "",
};

describe("parseContact", () => {
  it("accepts a valid payload and trims it", () => {
    const result = parseContact({ ...valid, firstName: "  Ada " });
    expect(result).toEqual({
      kind: "ok",
      payload: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        company: "",
        topic: "General question",
        message: "Hello there",
      },
    });
  });

  it.each([
    ["firstName", { firstName: "" }],
    ["lastName", { lastName: " " }],
    ["email", { email: "not-an-email" }],
    ["topic", { topic: "Free money" }],
    ["message", { message: "" }],
    ["message", { message: "x".repeat(5001) }],
    ["company", { company: "x".repeat(201) }],
  ])("rejects a bad %s", (field, patch) => {
    const result = parseContact({ ...valid, ...patch });
    expect(result).toMatchObject({ kind: "error", field });
  });

  it("rejects a non-object body", () => {
    expect(parseContact(null)).toMatchObject({ kind: "error", field: "body" });
    expect(parseContact([valid])).toMatchObject({ kind: "error", field: "body" });
  });

  it("flags a filled honeypot as spam before validating anything else", () => {
    expect(parseContact({ website: "http://spam.example" })).toEqual({ kind: "spam" });
  });

  it("does not require a phone number or marketing opt-in", () => {
    expect(parseContact(valid).kind).toBe("ok");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run lib/contact/parse.test.ts`
Expected: FAIL — cannot resolve `./parse`.

- [ ] **Step 3: Write `lib/contact/parse.ts`**

```ts
import type { ContactPayload } from "./delivery";

/** Shared by the form's <select> and the server-side check. */
export const CONTACT_TOPICS = [
  "General question",
  "Help with my signature",
  "Billing",
  "Teams and the Business plan",
  "Privacy or data request",
  "Something else",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export type ParseResult =
  | { kind: "ok"; payload: ContactPayload }
  | { kind: "spam" }
  | { kind: "error"; field: string; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a contact-form submission. `website` is a honeypot: the field is
 * hidden from people, so any value means a bot filled every input it found.
 * The route answers spam with a normal success so the bot learns nothing.
 */
export function parseContact(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { kind: "error", field: "body", error: "Expected a JSON object." };
  }
  const source = body as Record<string, unknown>;
  if (read(source, "website")) return { kind: "spam" };

  const payload: ContactPayload = {
    firstName: read(source, "firstName"),
    lastName: read(source, "lastName"),
    email: read(source, "email"),
    company: read(source, "company"),
    topic: read(source, "topic"),
    message: read(source, "message"),
  };

  const fail = (field: keyof ContactPayload, error: string): ParseResult => ({
    kind: "error",
    field,
    error,
  });

  if (!payload.firstName) return fail("firstName", "Enter your first name.");
  if (payload.firstName.length > 100) return fail("firstName", "First name is too long.");
  if (!payload.lastName) return fail("lastName", "Enter your last name.");
  if (payload.lastName.length > 100) return fail("lastName", "Last name is too long.");
  if (!EMAIL_RE.test(payload.email) || payload.email.length > 254) {
    return fail("email", "Enter a valid email address.");
  }
  if (payload.company.length > 200) return fail("company", "Company name is too long.");
  if (!(CONTACT_TOPICS as readonly string[]).includes(payload.topic)) {
    return fail("topic", "Choose what your message is about.");
  }
  if (!payload.message) return fail("message", "Write a message.");
  if (payload.message.length > 5000) {
    return fail("message", "Keep your message under 5,000 characters.");
  }
  return { kind: "ok", payload };
}
```

- [ ] **Step 4: Update `lib/contact/delivery.ts`**

Replace the `ContactPayload` type with:

```ts
export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  topic: string;
  message: string;
};
```

Replace `asPlainText` with:

```ts
function asPlainText(payload: ContactPayload): string {
  return [
    `Name:    ${payload.firstName} ${payload.lastName}`,
    `Email:   ${payload.email}`,
    `Company: ${payload.company || "(not given)"}`,
    `Topic:   ${payload.topic}`,
    "",
    payload.message,
  ].join("\n");
}
```

and the Resend subject line with ``subject: `Contact form: ${payload.topic} - ${payload.firstName} ${payload.lastName}`,``.

- [ ] **Step 5: Update `app/api/contact/route.ts`**

Delete `EMAIL_RE`, `readString` and `parse`. Import `parseContact` from `@/lib/contact/parse`, change the header comment's first line to `POST /api/contact — receiver for the contact form at app/(site)/contact.`, and replace everything from `const result = parse(body);` to the end of the handler with:

```ts
  const result = parseContact(body);
  if (result.kind === "spam") {
    return NextResponse.json({ ok: true });
  }
  if (result.kind === "error") {
    return NextResponse.json(
      { ok: false, error: result.error, field: result.field },
      { status: 400 },
    );
  }

  const delivery = await deliverContact(result.payload);
  if (!delivery.ok) {
    // The reason is logged, not returned: it can carry provider detail.
    console.error(`[contact] delivery failed via ${delivery.transport}: ${delivery.reason}`);
    return NextResponse.json(
      { ok: false, error: "We could not send that message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
```

The import of `ContactPayload` in the route becomes unused — remove it.

- [ ] **Step 6: Verify**

Run: `npx vitest run lib/contact/parse.test.ts && npx tsc --noEmit && npm run lint`
Expected: 11 tests PASS; no type or lint errors.

- [ ] **Step 7: Commit**

```bash
git add lib/contact app/api/contact
git commit -m "Give the contact API plain field names and drop forced opt-in

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Claims registry, pricing, page metadata and the guard scripts

**Files:**
- Create: `lib/marketing/claims.ts`, `lib/marketing/company.ts`, `lib/marketing/pages.ts`, `lib/pricing.ts`, `scripts/check-marketing.ts`, `scripts/check-launch.ts`
- Modify: `package.json` (`test`, new `check:launch`)

**Interfaces:**
- Produces:
  - `type ClaimId` (union of the ids below); `CLAIMS: Record<ClaimId, { label: string; shipsIn: 1 | 2 | 3 | 4 | 5 }>`; `SHIPPED_THROUGH_PHASE: number` (= 2); `isShipped(id: ClaimId): boolean`.
  - `COMPANY: { name; legalName; jurisdiction; address; supportEmail; privacyEmail; responseTime }` (strings); `PLACEHOLDER_PREFIX = "[PLACEHOLDER"`.
  - `type PageKey`; `PAGE_META: Record<PageKey, { path: string; title: string; description: string }>`; `pageMetadata(key: PageKey): Metadata`.
  - `type PlanId = "free" | "pro" | "business"`; `PLANS: Plan[]` where `Plan = { id: PlanId; name: string; tagline: string; monthly: number; annual: number; perSeat: boolean; minSeats: number; cta: { label: string; href: string }; highlighted: boolean; features: ClaimId[] }`; `COMPARISON: Array<{ category: string; rows: Array<{ claims: ClaimId[]; label: string; free: Cell; pro: Cell; business: Cell }> }>` with `Cell = boolean | string`; `PRICES_PROVISIONAL: boolean`; `formatPrice(amount: number): string`.
  - `collectClaimIds(value: unknown): string[]` exported from `scripts/check-marketing.ts`'s helper module `lib/marketing/collect-claims.ts` (used by both scripts).

- [ ] **Step 1: Write the failing guard** — `scripts/check-marketing.ts`:

```ts
/**
 * Marketing content guard (runs in `npm test`).
 *
 * The site sells a product that is still being built, so every capability the
 * copy mentions is registered in lib/marketing/claims.ts with the phase that
 * ships it. This asserts copy only cites registered claims, that every claim is
 * cited somewhere (an unused claim is a claim nobody reviews), that SEO strings
 * fit search-result limits, and that no unverifiable social proof slips in.
 * Unshipped claims and placeholders are reported, not failed: that is
 * `npm run check:launch`'s job.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { CLAIMS, SHIPPED_THROUGH_PHASE } from "../lib/marketing/claims";
import { collectClaimIds } from "../lib/marketing/collect-claims";
import { PAGE_META } from "../lib/marketing/pages";
import { COMPANY, PLACEHOLDER_PREFIX } from "../lib/marketing/company";
import { industrySeo } from "../lib/marketing/industry-seo";
import * as pricing from "../lib/pricing";
import { CONTENT_MODULES } from "../lib/marketing/content-index";

const failures: string[] = [];
const fail = (message: string) => failures.push(message);

// 1. Claim ids.
const cited = new Set<string>();
for (const [name, mod] of Object.entries({ ...CONTENT_MODULES, pricing })) {
  for (const id of collectClaimIds(mod)) {
    if (!(id in CLAIMS)) fail(`${name}: unknown claim id "${id}"`);
    cited.add(id);
  }
}
for (const id of Object.keys(CLAIMS)) {
  if (!cited.has(id)) fail(`claim "${id}" is registered but no copy cites it`);
}

// 2. SEO strings.
const seo: Array<[string, string, string]> = [
  ...Object.entries(PAGE_META).map(
    ([key, m]) => [`page ${key}`, m.title, m.description] as [string, string, string],
  ),
  ...Object.entries(industrySeo).map(
    ([slug, m]) => [`industry ${slug}`, m.title, m.description] as [string, string, string],
  ),
];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
for (const [where, title, description] of seo) {
  if (title.length > 60) fail(`${where}: title is ${title.length} chars (max 60)`);
  if (description.length > 155) fail(`${where}: description is ${description.length} chars (max 155)`);
  if (description.length < 70) fail(`${where}: description is ${description.length} chars (min 70)`);
  if (titles.has(title)) fail(`${where}: title duplicates ${titles.get(title)}`);
  if (descriptions.has(description)) fail(`${where}: description duplicates ${descriptions.get(description)}`);
  titles.set(title, where);
  descriptions.set(description, where);
}

// 3. Banned social proof and unverifiable claims.
const BANNED: Array<[RegExp, string]> = [
  [/\bAI\b/, "no AI claims"],
  [/[★☆⭐]/, "no star glyphs"],
  [/\b\d\.\d\s*\/\s*5\b|\bout of 5\b/i, "no ratings"],
  [/\brating/i, "no ratings"],
  [/\btestimonial/i, "no testimonials"],
  [/\btrusted by\b/i, "no social proof"],
  [/#1\b/, "no superlatives"],
  [/\b\d[\d,.]*\s*[kKmM]?\+?\s+(happy\s+)?(users|customers|companies|teams|professionals)\b/, "no usage numbers"],
];
const SCAN = ["app/(site)", "components/marketing", "lib/marketing", "lib/pricing.ts"];
const TEXT = new Set([".ts", ".tsx", ".json"]);

function scan(path: string) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) scan(join(path, entry));
    return;
  }
  if (!TEXT.has(extname(path))) return;
  const text = readFileSync(path, "utf8");
  for (const [pattern, why] of BANNED) {
    const match = text.match(pattern);
    if (match) fail(`${path}: "${match[0]}" (${why})`);
  }
}
for (const root of SCAN) scan(root);

// 4. Reports.
const unshipped = Object.entries(CLAIMS)
  .filter(([, c]) => c.shipsIn > SHIPPED_THROUGH_PHASE)
  .map(([id, c]) => `${id} (phase ${c.shipsIn})`);
const placeholders = Object.entries(COMPANY)
  .filter(([, v]) => v.startsWith(PLACEHOLDER_PREFIX))
  .map(([k]) => k);

if (failures.length) {
  console.error("Marketing check failed:");
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(
  `Marketing check passed: ${cited.size} claims cited, ${seo.length} SEO entries.` +
    ` Pending for launch: ${unshipped.length} unshipped claims, ${placeholders.length} company placeholders.`,
);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-marketing.ts`
Expected: FAIL — cannot find module `../lib/marketing/claims`.

- [ ] **Step 3: Write `lib/marketing/claims.ts`**

```ts
/**
 * Every product capability the marketing site mentions, with the phase of the
 * production plan that delivers it. Copy cites these ids; `npm test` checks the
 * ids exist and are all cited, and `npm run check:launch` refuses to pass while
 * any cited claim belongs to a phase that has not shipped.
 *
 * When a phase ships, raise SHIPPED_THROUGH_PHASE. When a feature is cut,
 * delete its claim and let the checks point at every sentence that cited it.
 */
export const SHIPPED_THROUGH_PHASE = 2;

export const CLAIMS = {
  // Shipped: the editor and render engine that already exist.
  "templates-8": { label: "8 signature templates", shipsIn: 1 },
  "renders-everywhere": { label: "Table-based HTML that holds up in Outlook, Gmail and Apple Mail", shipsIn: 1 },
  "social-icons": { label: "Icons for 22 social networks", shipsIn: 1 },
  "images": { label: "Logo, headshot and banner images", shipsIn: 1 },
  "buttons": { label: "Call-to-action and meeting buttons", shipsIn: 1 },
  "install-guides": { label: "Step-by-step setup for 14 email clients", shipsIn: 1 },
  "copy-export": { label: "One-click copy, HTML download and a plain-text version", shipsIn: 1 },
  "no-tracking-pixels": { label: "No tracking pixels in your signature", shipsIn: 1 },
  "image-hosting": { label: "Image hosting that keeps sent signatures intact", shipsIn: 1 },
  "styling": { label: "Fonts, colours, spacing and icon styles", shipsIn: 1 },
  // Phase 3 — accounts and editor.
  "no-signup-to-start": { label: "Build and copy a signature without an account", shipsIn: 3 },
  "saved-signatures": { label: "Save signatures to your account and edit them later", shipsIn: 3 },
  "self-serve-deletion": { label: "Delete your account and data from settings", shipsIn: 3 },
  // Phase 4 — billing.
  "free-four-templates": { label: "4 templates on the Free plan", shipsIn: 4 },
  "free-one-signature": { label: "1 saved signature on the Free plan", shipsIn: 4 },
  "free-footer-link": { label: "A small \"Made with TheMailSignature\" link on Free signatures", shipsIn: 4 },
  "all-templates": { label: "Every template", shipsIn: 4 },
  "unlimited-signatures": { label: "Unlimited saved signatures", shipsIn: 4 },
  "no-footer-link": { label: "No TheMailSignature link", shipsIn: 4 },
  "pro-extras": { label: "Banners, animated GIFs, call-to-action and meeting buttons", shipsIn: 4 },
  "self-serve-billing": { label: "Change plan, update payment and cancel yourself", shipsIn: 4 },
  // Phase 5 — Business.
  "team-invites": { label: "Invite teammates and manage seats", shipsIn: 5 },
  "company-template": { label: "A company signature template with admin-locked fields", shipsIn: 5 },
  "brand-kit": { label: "A shared brand kit: colours, fonts, logo and banner", shipsIn: 5 },
  "click-analytics": { label: "Click counts for signature links and banners", shipsIn: 5 },
  "roles": { label: "Owner, admin and member roles", shipsIn: 5 },
} as const satisfies Record<string, { label: string; shipsIn: 1 | 2 | 3 | 4 | 5 }>;

export type ClaimId = keyof typeof CLAIMS;

export function isShipped(id: ClaimId): boolean {
  return CLAIMS[id].shipsIn <= SHIPPED_THROUGH_PHASE;
}
```

The two counted labels were verified when this plan was written: `CLIENTS` in `lib/signature/clients.ts` has 14 entries and `SocialKey` in `lib/signature/types.ts` has 22 members. If either count has changed, update the label.

- [ ] **Step 4: Write `lib/marketing/collect-claims.ts`**

```ts
/**
 * Walks any value and returns every string found under a `claims` array,
 * a `features` array or a `claimId` field. Content modules use those three
 * shapes to cite entries in CLAIMS; the guard scripts use this to find them.
 */
export function collectClaimIds(value: unknown, seen = new Set<unknown>()): string[] {
  if (value === null || typeof value !== "object" || seen.has(value)) return [];
  seen.add(value);
  const found: string[] = [];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if ((key === "claims" || key === "features") && Array.isArray(child)) {
      found.push(...child.filter((c): c is string => typeof c === "string"));
    } else if (key === "claimId" && typeof child === "string") {
      found.push(child);
    }
    found.push(...collectClaimIds(child, seen));
  }
  return found;
}
```

- [ ] **Step 5: Write `lib/marketing/company.ts`**

```ts
/**
 * Business details used by the legal pages, the contact page and structured
 * data. The legal entity has not been formed yet, so the unknown values are
 * explicit placeholders; `npm run check:launch` fails until each is replaced,
 * and the legal pages show a "draft" notice while any remains.
 */
export const PLACEHOLDER_PREFIX = "[PLACEHOLDER";

export const COMPANY = {
  name: "TheMailSignature",
  legalName: "[PLACEHOLDER: legal entity name]",
  jurisdiction: "[PLACEHOLDER: governing jurisdiction]",
  address: "[PLACEHOLDER: registered business address]",
  supportEmail: "[PLACEHOLDER: support email address]",
  privacyEmail: "[PLACEHOLDER: privacy contact email address]",
  responseTime: "[PLACEHOLDER: typical reply time, e.g. two business days]",
};

export function hasPlaceholders(): boolean {
  return Object.values(COMPANY).some((v) => v.startsWith(PLACEHOLDER_PREFIX));
}
```

- [ ] **Step 6: Write `lib/marketing/pages.ts`**

```ts
import type { Metadata } from "next";

/** One entry per static marketing route. Titles are absolute (no suffix). */
export const PAGE_META = {
  home: {
    path: "/",
    title: "Free Email Signature Generator | TheMailSignature",
    description:
      "Build an email signature that looks right in Gmail, Outlook and Apple Mail. Pick a template, add your details and copy it in minutes.",
  },
  templates: {
    path: "/templates",
    title: "Email Signature Templates | TheMailSignature",
    description:
      "Eight email signature templates built from Outlook-safe HTML tables. Preview each one with real details, then open it in the editor.",
  },
  pricing: {
    path: "/pricing",
    title: "Pricing | TheMailSignature",
    description:
      "Compare the Free, Pro and Business plans for TheMailSignature, from one personal signature to company-wide signatures for your team.",
  },
  teams: {
    path: "/teams",
    title: "Email Signatures for Teams | TheMailSignature",
    description:
      "Give every employee a consistent, on-brand email signature. Lock company fields, share a brand kit and see which signature links get clicks.",
  },
  industries: {
    path: "/industries",
    title: "Email Signature Examples by Industry | TheMailSignature",
    description:
      "Email signature advice and live examples for 21 professions, from lawyers and realtors to teachers, healthcare staff and sales teams.",
  },
  help: {
    path: "/help",
    title: "Help: Add Your Email Signature | TheMailSignature",
    description:
      "Step-by-step instructions for adding your signature to Gmail, Outlook, Apple Mail, Thunderbird and more, plus fixes for common problems.",
  },
  about: {
    path: "/about",
    title: "About TheMailSignature",
    description:
      "Why TheMailSignature exists: email signatures that survive every mail client, built without tracking pixels or design shortcuts.",
  },
  contact: {
    path: "/contact",
    title: "Contact Us | TheMailSignature",
    description:
      "Questions about your signature, billing or the Business plan? Send the TheMailSignature team a message and we will get back to you.",
  },
  terms: {
    path: "/legal/terms",
    title: "Terms of Use | TheMailSignature",
    description:
      "The terms that apply when you use TheMailSignature to create, save and install email signatures, including plans and acceptable use.",
  },
  privacy: {
    path: "/legal/privacy",
    title: "Privacy Policy | TheMailSignature",
    description:
      "What personal data TheMailSignature collects, why we collect it, who processes it for us, and the choices and rights you have over it.",
  },
  cookies: {
    path: "/legal/cookies",
    title: "Cookie Policy | TheMailSignature",
    description:
      "The cookies and browser storage TheMailSignature uses to keep you signed in and remember your signature draft, and how to control them.",
  },
  dataDeletion: {
    path: "/legal/data-deletion",
    title: "Delete Your Data | TheMailSignature",
    description:
      "How to delete your TheMailSignature account, saved signatures and uploaded images, what happens to them, and how long removal takes.",
  },
} satisfies Record<string, { path: string; title: string; description: string }>;

export type PageKey = keyof typeof PAGE_META;

export function pageMetadata(key: PageKey): Metadata {
  const { path, title, description } = PAGE_META[key];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}
```

- [ ] **Step 7: Write `lib/pricing.ts`**

```ts
import type { ClaimId } from "@/lib/marketing/claims";

/**
 * Plans and prices. The numbers are placeholders until the owner sets final
 * prices; `npm run check:launch` fails while PRICES_PROVISIONAL is true.
 * Phase 4 maps these plan ids to Stripe prices, so ids must not change.
 */
export const PRICES_PROVISIONAL = true;

export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Price per month, billed monthly (per seat when perSeat). */
  monthly: number;
  /** Price per year, billed yearly (per seat when perSeat). */
  annual: number;
  perSeat: boolean;
  minSeats: number;
  cta: { label: string; href: string };
  highlighted: boolean;
  features: ClaimId[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "One polished signature for yourself.",
    monthly: 0,
    annual: 0,
    perSeat: false,
    minSeats: 1,
    cta: { label: "Create my signature", href: "/editor" },
    highlighted: false,
    features: ["free-four-templates", "free-one-signature", "renders-everywhere", "install-guides", "free-footer-link"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Every template and extra, without our link.",
    monthly: 5,
    annual: 48,
    perSeat: false,
    minSeats: 1,
    cta: { label: "Get Pro", href: "/signup?plan=pro" },
    highlighted: true,
    features: ["all-templates", "unlimited-signatures", "no-footer-link", "pro-extras", "self-serve-billing"],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Consistent signatures across your whole team.",
    monthly: 4,
    annual: 38,
    perSeat: true,
    minSeats: 3,
    cta: { label: "Start with Business", href: "/signup?plan=business" },
    highlighted: false,
    features: ["team-invites", "company-template", "brand-kit", "click-analytics", "roles"],
  },
];

export type Cell = boolean | string;

export interface ComparisonRow {
  label: string;
  claims: ClaimId[];
  free: Cell;
  pro: Cell;
  business: Cell;
}

export const COMPARISON: Array<{ category: string; rows: ComparisonRow[] }> = [
  {
    category: "Signatures",
    rows: [
      { label: "Templates", claims: ["templates-8", "free-four-templates", "all-templates"], free: "4", pro: "All 8", business: "All 8" },
      { label: "Saved signatures", claims: ["free-one-signature", "unlimited-signatures", "saved-signatures"], free: "1", pro: "Unlimited", business: "Unlimited" },
      { label: "Works in Outlook, Gmail and Apple Mail", claims: ["renders-everywhere"], free: true, pro: true, business: true },
      { label: "Fonts, colours and spacing", claims: ["styling"], free: true, pro: true, business: true },
      { label: "Social icons", claims: ["social-icons"], free: true, pro: true, business: true },
      { label: "Logo and headshot", claims: ["images", "image-hosting"], free: true, pro: true, business: true },
      { label: "Banners, GIFs and buttons", claims: ["pro-extras", "buttons"], free: false, pro: true, business: true },
      { label: "TheMailSignature link removed", claims: ["free-footer-link", "no-footer-link"], free: false, pro: true, business: true },
    ],
  },
  {
    category: "Install and export",
    rows: [
      { label: "One-click copy and HTML download", claims: ["copy-export"], free: true, pro: true, business: true },
      { label: "Setup guides for 14 email clients", claims: ["install-guides"], free: true, pro: true, business: true },
      { label: "No tracking pixels", claims: ["no-tracking-pixels"], free: true, pro: true, business: true },
    ],
  },
  {
    category: "Teams",
    rows: [
      { label: "Invite teammates", claims: ["team-invites"], free: false, pro: false, business: true },
      { label: "Company template with locked fields", claims: ["company-template"], free: false, pro: false, business: true },
      { label: "Shared brand kit", claims: ["brand-kit"], free: false, pro: false, business: true },
      { label: "Link click counts", claims: ["click-analytics"], free: false, pro: false, business: true },
      { label: "Owner, admin and member roles", claims: ["roles"], free: false, pro: false, business: true },
    ],
  },
  {
    category: "Account",
    rows: [
      { label: "Manage billing yourself", claims: ["self-serve-billing"], free: "Not needed", pro: true, business: true },
      { label: "Delete your data yourself", claims: ["self-serve-deletion"], free: true, pro: true, business: true },
    ],
  },
];

/** "$5", "$4.50" — whole dollars stay whole. */
export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
```

- [ ] **Step 8: Write the content index** — `lib/marketing/content-index.ts`:

```ts
/**
 * Every module whose copy may cite claims. Pages add their module here when
 * they are built, so the guard scripts see all of them.
 */
import * as pages from "./pages";

export const CONTENT_MODULES: Record<string, unknown> = { pages };
```

- [ ] **Step 9: Run the guard**

Run: `npx tsx scripts/check-marketing.ts`
Expected: FAIL only with "registered but no copy cites it" lines for claims not in `lib/pricing.ts` — `no-signup-to-start`, `saved-signatures` is cited (comparison), so the expected list is exactly: `no-signup-to-start`. Every SEO line passes. (Later tasks cite the rest; `no-signup-to-start` is cited by Task 6.) To keep `npm test` green in this commit, temporarily do NOT wire the script into `npm test` yet — Task 6 wires it once the homepage cites the last claim.

- [ ] **Step 10: Write `scripts/check-launch.ts`**

```ts
/**
 * Launch gate (`npm run check:launch`). Fails while the site would say
 * something untrue in production: a cited feature that has not shipped,
 * a business-detail placeholder, or provisional prices.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { CLAIMS, SHIPPED_THROUGH_PHASE } from "../lib/marketing/claims";
import { PLACEHOLDER_PREFIX } from "../lib/marketing/company";
import { PRICES_PROVISIONAL } from "../lib/pricing";

const blockers: string[] = [];

for (const [id, claim] of Object.entries(CLAIMS)) {
  if (claim.shipsIn > SHIPPED_THROUGH_PHASE) {
    blockers.push(`claim "${id}" ships in phase ${claim.shipsIn}: ${claim.label}`);
  }
}

function scan(path: string) {
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) scan(join(path, entry));
    return;
  }
  if (!/\.(ts|tsx)$/.test(path)) return;
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.includes(PLACEHOLDER_PREFIX) && !line.includes("PLACEHOLDER_PREFIX")) {
        blockers.push(`${path}:${i + 1} still has a placeholder`);
      }
    });
}
for (const root of ["lib/marketing", "app/(site)", "components/marketing"]) scan(root);

if (PRICES_PROVISIONAL) blockers.push("lib/pricing.ts: PRICES_PROVISIONAL is still true");

if (blockers.length) {
  console.error(`Not ready to launch (${blockers.length} blockers):`);
  for (const line of blockers) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Launch check passed: every claim shipped, no placeholders, final prices.");
```

Add to `package.json` scripts: `"check:launch": "tsx scripts/check-launch.ts"`.

Run: `npm run check:launch`
Expected: FAIL listing 16 unshipped claims, 6 placeholder lines in `lib/marketing/company.ts`, and provisional prices.

- [ ] **Step 11: Verify and commit**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: PASS (check-marketing is not in `npm test` yet).

```bash
git add lib/marketing lib/pricing.ts scripts/check-marketing.ts scripts/check-launch.ts package.json
git commit -m "Add the claims registry, plans, page metadata and launch gate

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Marketing section primitives

**Files:**
- Create: `components/marketing/Section.tsx`, `SectionHeading.tsx`, `ButtonLink.tsx`, `JsonLd.tsx`, `FaqList.tsx`, `FaqList.test.tsx`, `FeatureGrid.tsx`, `Steps.tsx`, `CtaBanner.tsx`, `lib/marketing/faqs.ts`

**Interfaces:**
- Consumes: `Container` (`components/site/Container.tsx`), `ClaimId`.
- Produces:
  - `Section({ id?, tone?: "white" | "tint" | "navy", className?, children })`
  - `SectionHeading({ eyebrow?, title, lede?, as?: "h1" | "h2", align?: "left" | "center", invert?: boolean })`
  - `ButtonLink({ href, children, variant?: "primary" | "secondary" | "light" })`
  - `JsonLd({ data: object })`
  - `type Faq = { q: string; a: string; claims?: ClaimId[] }`; `FAQS: Record<"home" | "pricing" | "teams" | "help", Faq[]>` (filled by later tasks; starts with empty arrays); `FaqList({ items: Faq[], schema?: boolean })`; `faqSchema(items: Faq[]): object`
  - `type Feature = { title: string; body: string; icon: PhosphorIconName; claims: ClaimId[] }` with `PhosphorIconName = "Layout" | "Envelope" | "Palette" | "Image" | "ShareNetwork" | "Copy" | "ShieldCheck" | "Users" | "Lock" | "ChartBar" | "Swatches" | "Cursor"`; `FeatureGrid({ features: Feature[] })`
  - `type Step = { title: string; body: string; image?: { src: string; alt: string; width: number; height: number } }`; `Steps({ steps: Step[] })`
  - `CtaBanner({ title, body, cta: { label, href } })`

- [ ] **Step 1: Write the failing test** — `components/marketing/FaqList.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqList, faqSchema } from "./FaqList";

const items = [
  { q: "Does it work in Outlook?", a: "Yes, it uses table-based HTML." },
  { q: "Can I change fonts?", a: "Yes, from the style panel." },
];

describe("FaqList", () => {
  it("renders every question and answer", () => {
    render(<FaqList items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
  });

  it("emits FAQPage structured data by default", () => {
    const { container } = render(<FaqList items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual(faqSchema(items));
  });

  it("can skip structured data", () => {
    const { container } = render(<FaqList items={items} schema={false} />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("escapes markup-breaking characters in the JSON", () => {
    const { container } = render(<FaqList items={[{ q: "</script>?", a: "a" }]} />);
    expect(container.querySelector("script")!.innerHTML).not.toContain("</script>");
  });
});

describe("faqSchema", () => {
  it("maps questions to schema.org Question entities", () => {
    expect(faqSchema(items)).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/marketing/FaqList.test.tsx`
Expected: FAIL — cannot resolve `./FaqList`.

- [ ] **Step 3: Write the primitives**

`lib/marketing/faqs.ts`:

```ts
import type { ClaimId } from "./claims";

export type Faq = { q: string; a: string; claims?: ClaimId[] };

/** FAQ sets by page. Each page's task fills its own list. */
export const FAQS: Record<"home" | "pricing" | "teams" | "help", Faq[]> = {
  home: [],
  pricing: [],
  teams: [],
  help: [],
};
```

`components/marketing/JsonLd.tsx`:

```tsx
/** Structured data. `<` is escaped so no string can close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

`components/marketing/FaqList.tsx`:

```tsx
import type { Faq } from "@/lib/marketing/faqs";
import { JsonLd } from "./JsonLd";

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Native <details> accordion: works without JavaScript and is keyboard-accessible. */
export function FaqList({ items, schema = true }: { items: Faq[]; schema?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink-200 rounded-card border border-ink-200 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden="true" className="text-xl text-blue-brand-600 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink-600">{item.a}</p>
        </details>
      ))}
      {schema && <JsonLd data={faqSchema(items)} />}
    </div>
  );
}
```

`components/marketing/Section.tsx`:

```tsx
import { Container } from "@/components/site/Container";

const TONES = {
  white: "bg-white",
  tint: "bg-navy-50",
  navy: "bg-navy-900 text-white",
} as const;

export function Section({
  id,
  tone = "white",
  className = "",
  children,
}: {
  id?: string;
  tone?: keyof typeof TONES;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${TONES[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
```

`components/marketing/SectionHeading.tsx`:

```tsx
export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  align = "center",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
  invert?: boolean;
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const size = Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl";
  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wider ${invert ? "text-blue-brand-200" : "text-blue-brand-600"}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`mt-2 font-bold tracking-tight text-balance ${size} ${invert ? "text-white" : "text-navy-900"}`}>
        {title}
      </Tag>
      {lede && (
        <p className={`mt-4 text-lg leading-relaxed text-pretty ${invert ? "text-navy-100" : "text-ink-600"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
```

`components/marketing/ButtonLink.tsx`:

```tsx
import Link from "next/link";

const VARIANTS = {
  primary: "bg-blue-brand-600 text-white hover:bg-blue-brand-700",
  secondary: "border border-ink-300 bg-white text-navy-900 hover:border-navy-900",
  light: "bg-white text-navy-900 hover:bg-navy-50",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-brand-600 ${VARIANTS[variant]}`}
    >
      {children}
    </Link>
  );
}
```

`components/marketing/FeatureGrid.tsx`:

```tsx
import {
  ChartBar, Copy, Cursor, Envelope, Image as ImageIcon, Layout, Lock, Palette,
  ShareNetwork, ShieldCheck, Swatches, Users,
} from "@phosphor-icons/react/dist/ssr";
import type { ClaimId } from "@/lib/marketing/claims";

const ICONS = {
  ChartBar, Copy, Cursor, Envelope, Image: ImageIcon, Layout, Lock, Palette,
  ShareNetwork, ShieldCheck, Swatches, Users,
};

export type PhosphorIconName = keyof typeof ICONS;

export type Feature = {
  title: string;
  body: string;
  icon: PhosphorIconName;
  claims: ClaimId[];
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => {
        const Icon = ICONS[feature.icon];
        return (
          <li key={feature.title} className="rounded-card border border-ink-200 bg-white p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-blue-brand-50 text-blue-brand-600">
              <Icon size={22} weight="duotone" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-navy-900">{feature.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-600">{feature.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
```

Before relying on `@phosphor-icons/react/dist/ssr`, confirm it exists: `ls node_modules/@phosphor-icons/react/dist/ssr/index.d.ts`. If it does not, import from `@phosphor-icons/react` and add `"use client"` to `FeatureGrid.tsx`.

`components/marketing/Steps.tsx`:

```tsx
import Image from "next/image";

export type Step = {
  title: string;
  body: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-12 grid gap-8 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-navy-900">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-600">{step.body}</p>
          {step.image && (
            <Image
              src={step.image.src}
              alt={step.image.alt}
              width={step.image.width}
              height={step.image.height}
              className="mt-5 rounded-card border border-ink-200 shadow-sm"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
```

`components/marketing/CtaBanner.tsx`:

```tsx
import { ButtonLink } from "./ButtonLink";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function CtaBanner({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <Section tone="navy">
      <SectionHeading title={title} lede={body} invert />
      <div className="mt-8 flex justify-center">
        <ButtonLink href={cta.href} variant="light">
          {cta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
```

Register `faqs` in `lib/marketing/content-index.ts`: add `import * as faqs from "./faqs";` and include `faqs` in `CONTENT_MODULES`.

- [ ] **Step 4: Verify and commit**

Run: `npx vitest run components/marketing && npx tsc --noEmit && npm run lint`
Expected: 5 tests PASS; no errors.

```bash
git add components/marketing lib/marketing
git commit -m "Add the marketing section primitives and FAQ structured data

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Sample people, sample assets and live signature previews

**Files:**
- Create: `lib/marketing/sample-people.json`, `lib/marketing/samples.ts`, `scripts/gen-sample-assets.mjs`, `public/samples/*` (generated), `components/marketing/SignaturePreview.tsx`, `components/marketing/EmailFrame.tsx`, `components/marketing/TemplateCard.tsx`, `components/marketing/SignaturePreview.test.tsx`
- Modify: `package.json` (`samples` script)

**Interfaces:**
- Consumes: `DEFAULT_DATA`, `DEFAULT_STYLE` (`lib/signature/defaults`), `TEMPLATE_BY_ID`, `TEMPLATES` (`lib/signature/templates`), `renderSignature` (`lib/signature/render`).
- Produces:
  - `type SamplePerson = { key: string; firstName: string; lastName: string; jobTitle: string; company: string; domain: string; phone: string; city: string; accent: string; cta?: { text: string } }`
  - `SAMPLE_PEOPLE: Record<string, SamplePerson>` (keyed by `key`)
  - `sampleSignature(personKey: string, templateId: string): { data: SignatureData; style: SignatureStyle }` — throws on an unknown key or template
  - `TEMPLATE_SAMPLES: Record<string, string>` — template id → person key
  - `SignaturePreview({ personKey, templateId, className? })`
  - `EmailFrame({ subject, children })`
  - `TemplateCard({ templateId })` — live preview + name + blurb + "Use this template" → `/editor?template=<id>`
  - Asset URLs: `/samples/<key>-logo.png` (264×88), `/samples/<key>-avatar.png` (184×184), `/samples/banner.png` (880×176).

- [ ] **Step 1: Write the people file** — `lib/marketing/sample-people.json`

A JSON array of 29 objects of type `SamplePerson`. Rules:
- 8 template people with keys `tpl-meridian`, `tpl-stack`, `tpl-ledger`, `tpl-portrait`, `tpl-slate`, `tpl-minimal`, `tpl-broadcast`, `tpl-split`.
- 21 industry people with keys equal to the industry slugs in `lib/marketing/industry-seo.ts` (`accountants`, `ceos`, `consultants`, `customer-support`, `education-schools-universities`, `entrepreneurs`, `finance-banking`, `freelancers`, `healthcare`, `hr-admin`, `it-operations`, `lawyers`, `marketers`, `marketing-creative-agencies`, `marketing-teams`, `personal-assistants`, `real-estate-firms`, `realtor`, `sales-teams`, `students`, `teachers`), each with a job title and company that fit the industry.
- Names are varied across cultures and genders; no famous names. `domain` ends in `.example` (e.g. `harbourlegal.example`). `phone` is `+1 (555) 01NN` with a unique `NN`. `city` is a real city, `"City, Region"`. `accent` is a hex colour with at least 4.5:1 contrast on white (pick from `#0050B8`, `#0F7B5F`, `#6B2E7A`, `#B03059`, `#0E6B78`, `#955800`, `#1E2126`, `#C6432B`). People shown with the Slate template need the reverse: 4.5:1 against its dark card `#141619` (use `#F2845C`). `check-marketing.ts` enforces both.
- `tpl-broadcast` and 4 industry people (`sales-teams`, `marketers`, `realtor`, `entrepreneurs`) have a `cta.text` (e.g. "Book a demo").

Example entry:

```json
{ "key": "lawyers", "firstName": "Priya", "lastName": "Raman", "jobTitle": "Partner, Employment Law",
  "company": "Harbour Legal LLP", "domain": "harbourlegal.example", "phone": "+1 (555) 0142",
  "city": "Toronto, ON", "accent": "#1E2126" }
```

- [ ] **Step 2: Write the failing test** — `components/marketing/SignaturePreview.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/signature/templates";
import { SAMPLE_PEOPLE, TEMPLATE_SAMPLES, sampleSignature } from "@/lib/marketing/samples";
import { SignaturePreview } from "./SignaturePreview";
import { TemplateCard } from "./TemplateCard";

describe("sample data", () => {
  it("has a sample person for every template", () => {
    for (const t of TEMPLATES) expect(SAMPLE_PEOPLE[TEMPLATE_SAMPLES[t.id]]).toBeDefined();
  });

  it("uses only reserved example domains", () => {
    for (const p of Object.values(SAMPLE_PEOPLE)) expect(p.domain).toMatch(/\.example$/);
  });

  it("applies the template's style hints and the person's accent", () => {
    const { style, data } = sampleSignature(TEMPLATE_SAMPLES.portrait, "portrait");
    expect(style.templateId).toBe("portrait");
    expect(style.photoShape).toBe("circle");
    expect(style.accent).toBe(SAMPLE_PEOPLE[TEMPLATE_SAMPLES.portrait].accent);
    expect(data.email).toMatch(/@.+\.example$/);
  });

  it("throws on unknown input", () => {
    expect(() => sampleSignature("nobody", "meridian")).toThrow();
    expect(() => sampleSignature(TEMPLATE_SAMPLES.meridian, "nope")).toThrow();
  });
});

describe("SignaturePreview", () => {
  it("renders the sample person's name", () => {
    const person = SAMPLE_PEOPLE.lawyers;
    const { container } = render(<SignaturePreview personKey="lawyers" templateId="meridian" />);
    expect(container.textContent).toContain(`${person.firstName} ${person.lastName}`);
  });
});

describe("TemplateCard", () => {
  it("links into the editor with the template preselected", () => {
    const { getByRole } = render(<TemplateCard templateId="slate" />);
    expect(getByRole("link", { name: /use slate/i })).toHaveAttribute("href", "/editor?template=slate");
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run components/marketing/SignaturePreview.test.tsx`
Expected: FAIL — cannot resolve `@/lib/marketing/samples`.

- [ ] **Step 4: Write `lib/marketing/samples.ts`**

```ts
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import people from "./sample-people.json";

export type SamplePerson = {
  key: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  domain: string;
  phone: string;
  city: string;
  accent: string;
  cta?: { text: string };
};

export const SAMPLE_PEOPLE: Record<string, SamplePerson> = Object.fromEntries(
  (people as SamplePerson[]).map((p) => [p.key, p]),
);

export const TEMPLATE_SAMPLES: Record<string, string> = Object.fromEntries(
  Object.keys(TEMPLATE_BY_ID).map((id) => [id, `tpl-${id}`]),
);

/**
 * A complete signature for a fictional person. Links point at the person's
 * `.example` domain or a network's home page, never at a real individual.
 */
export function sampleSignature(
  personKey: string,
  templateId: string,
): { data: SignatureData; style: SignatureStyle } {
  const person = SAMPLE_PEOPLE[personKey];
  const template = TEMPLATE_BY_ID[templateId];
  if (!person) throw new Error(`Unknown sample person: ${personKey}`);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const site = `https://${person.domain}`;
  const data: SignatureData = {
    ...DEFAULT_DATA,
    firstName: person.firstName,
    lastName: person.lastName,
    jobTitle: person.jobTitle,
    company: person.company,
    website: person.domain,
    email: `${person.firstName.toLowerCase()}@${person.domain}`,
    phone: person.phone,
    mobile: "",
    addressLine1: person.city,
    addressLine2: "",
    logoUrl: `/samples/${person.key}-logo.png`,
    logoLink: site,
    photoUrl: `/samples/${person.key}-avatar.png`,
    bannerUrl: templateId === "broadcast" ? "/samples/banner.png" : "",
    bannerLink: templateId === "broadcast" ? site : "",
    ctaText: person.cta?.text ?? "",
    ctaUrl: person.cta ? site : "",
    meetingUrl: "",
    social: { linkedin: "https://www.linkedin.com/", x: "https://x.com/" },
  };
  const style: SignatureStyle = {
    ...DEFAULT_STYLE,
    ...(template.styleHints ?? {}),
    templateId,
    accent: person.accent,
    linkColor: person.accent,
  };
  return { data, style };
}
```

If `tsc` rejects the JSON import's inferred type, keep the `as SamplePerson[]` cast (it is already there); `resolveJsonModule` is enabled in `tsconfig.json`.

- [ ] **Step 5: Write the preview components**

`components/marketing/SignaturePreview.tsx`:

```tsx
import { renderSignature } from "@/lib/signature/render";
import { sampleSignature } from "@/lib/marketing/samples";

/**
 * A signature rendered by the real engine. Injecting the HTML is safe: the
 * input is our own sample data and the engine escapes every field
 * (scripts/check-render.ts). An empty assetBase keeps icon URLs root-relative,
 * which is correct on our own pages.
 */
export function SignaturePreview({
  personKey,
  templateId,
  className = "",
}: {
  personKey: string;
  templateId: string;
  className?: string;
}) {
  const { data, style } = sampleSignature(personKey, templateId);
  const html = renderSignature(data, style, { assetBase: "" });
  return (
    <div
      className={`overflow-x-auto ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

(If eslint reports the disable comment as unused, delete that line.)

`components/marketing/EmailFrame.tsx`:

```tsx
/** A mail-client window that sets a signature in context. Decorative chrome is aria-hidden. */
export function EmailFrame({ subject, children }: { subject: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-card border border-ink-200 bg-white text-left shadow-xl shadow-navy-900/10">
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-ink-200 bg-ink-50 px-4 py-3">
        <span className="size-3 rounded-full bg-ink-300" />
        <span className="size-3 rounded-full bg-ink-300" />
        <span className="size-3 rounded-full bg-ink-300" />
      </div>
      <div className="space-y-1 border-b border-ink-100 px-5 py-3 text-sm text-ink-600">
        <p><span className="text-ink-400">Subject:</span> {subject}</p>
      </div>
      <div className="px-5 py-5">
        <div aria-hidden="true" className="space-y-2">
          <div className="h-2.5 w-3/4 rounded bg-ink-100" />
          <div className="h-2.5 w-full rounded bg-ink-100" />
          <div className="h-2.5 w-2/3 rounded bg-ink-100" />
        </div>
        <div className="mt-6 border-t border-ink-100 pt-5">{children}</div>
      </div>
    </figure>
  );
}
```

`components/marketing/TemplateCard.tsx`:

```tsx
import Link from "next/link";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import { TEMPLATE_SAMPLES } from "@/lib/marketing/samples";
import { SignaturePreview } from "./SignaturePreview";

export function TemplateCard({ templateId }: { templateId: string }) {
  const template = TEMPLATE_BY_ID[templateId];
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return (
    <article className="flex flex-col rounded-card border border-ink-200 bg-white">
      <div className="flex min-h-56 items-center justify-center border-b border-ink-100 p-6">
        <SignaturePreview personKey={TEMPLATE_SAMPLES[templateId]} templateId={templateId} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold text-navy-900">{template.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-600">{template.blurb}</p>
        <Link
          href={`/editor?template=${template.id}`}
          aria-label={`Use ${template.name}`}
          className="mt-4 text-sm font-semibold text-blue-brand-600 hover:text-blue-brand-700"
        >
          Use this template →
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 6: Write `scripts/gen-sample-assets.mjs` and generate**

```js
/**
 * Generates the fictional logos, avatars and campaign banner used by the
 * example signatures on the marketing site. Monograms only: no photographs,
 * so no real person's likeness ever appears in a sample.
 */
import { mkdirSync, readFileSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/samples";
mkdirSync(OUT, { recursive: true });
const people = JSON.parse(readFileSync("lib/marketing/sample-people.json", "utf8"));

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const initials = (words) =>
  words.filter(Boolean).map((w) => w[0].toUpperCase()).slice(0, 2).join("");

for (const p of people) {
  const companyWords = p.company.replace(/[^A-Za-z ]/g, " ").split(/\s+/);
  const mark = initials(companyWords);
  const shortName = companyWords.filter(Boolean).slice(0, 2).join(" ");

  const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="264" height="88">
    <rect x="4" y="12" width="64" height="64" rx="14" fill="${p.accent}"/>
    <text x="36" y="54" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700"
      fill="#fff" text-anchor="middle">${escapeXml(mark)}</text>
    <text x="82" y="53" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700"
      fill="#1E2126">${escapeXml(shortName)}</text>
  </svg>`;
  await sharp(Buffer.from(logo)).png({ compressionLevel: 9 }).toFile(`${OUT}/${p.key}-logo.png`);

  const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="184" height="184">
    <rect width="184" height="184" fill="${p.accent}" opacity="0.14"/>
    <text x="92" y="112" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700"
      fill="${p.accent}" text-anchor="middle">${escapeXml(initials([p.firstName, p.lastName]))}</text>
  </svg>`;
  await sharp(Buffer.from(avatar)).png({ compressionLevel: 9 }).toFile(`${OUT}/${p.key}-avatar.png`);
}

const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="176">
  <rect width="880" height="176" rx="16" fill="#0B1F52"/>
  <rect x="0" y="0" width="12" height="176" fill="#3A82E4"/>
  <text x="48" y="78" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#fff">Spring product webinar</text>
  <text x="48" y="122" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#D0E2FB">Save your seat for April 24</text>
</svg>`;
await sharp(Buffer.from(banner)).png({ compressionLevel: 9 }).toFile(`${OUT}/banner.png`);

console.log(`Generated ${people.length * 2 + 1} sample images in ${OUT}.`);
```

Add `"samples": "node scripts/gen-sample-assets.mjs"` to `package.json` scripts.

Run: `npm run samples`
Expected: "Generated 59 sample images in public/samples." Open two logos and one avatar with the Read tool to confirm the text is legible and not clipped.

- [ ] **Step 7: Verify and commit**

Run: `npx vitest run components/marketing && npx tsc --noEmit && npm run lint && npm test`
Expected: all PASS (the content guard scans `public/` file names only — sample names contain no banned strings).

```bash
git add lib/marketing components/marketing scripts/gen-sample-assets.mjs public/samples package.json
git commit -m "Add fictional sample people and live signature previews

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Open a template in the editor from a link

**Files:**
- Modify: `app/editor/page.tsx`, `components/builder/Builder.tsx`, `proxy.ts` (keep the query string in `next`)
- Create: `components/builder/initial-state.ts`, `components/builder/initial-state.test.ts`
- Modify: `vitest.config.ts` (include `components/**/*.test.ts`)

**Interfaces:**
- Consumes: `TEMPLATE_BY_ID`.
- Produces: `withTemplate(saved: { data; style }, templateId: string | undefined): { data; style }` — returns `saved` unchanged when the id is missing or unknown; otherwise applies the template's `styleHints` and `templateId`. `Builder({ initialTemplate?: string })`.

- [ ] **Step 1: Write the failing test** — `components/builder/initial-state.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { withTemplate } from "./initial-state";

const saved = { data: DEFAULT_DATA, style: { ...DEFAULT_STYLE, photoShape: "square" as const } };

describe("withTemplate", () => {
  it("leaves the state alone without a template", () => {
    expect(withTemplate(saved, undefined)).toBe(saved);
  });

  it("ignores unknown template ids", () => {
    expect(withTemplate(saved, "<script>")).toBe(saved);
  });

  it("applies the template and its style hints, keeping the details", () => {
    const next = withTemplate(saved, "portrait");
    expect(next.style.templateId).toBe("portrait");
    expect(next.style.photoShape).toBe("circle");
    expect(next.data).toBe(saved.data);
  });
});
```

In `vitest.config.ts`, change `include` to `["components/**/*.test.{ts,tsx}", "lib/**/*.test.ts"]`.

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/builder`
Expected: FAIL — cannot resolve `./initial-state`.

- [ ] **Step 3: Write `components/builder/initial-state.ts`**

```ts
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";

export interface BuilderState {
  data: SignatureData;
  style: SignatureStyle;
}

/** Applies a template chosen on the marketing site, e.g. /editor?template=slate. */
export function withTemplate(saved: BuilderState, templateId: string | undefined): BuilderState {
  const template = templateId ? TEMPLATE_BY_ID[templateId] : undefined;
  if (!template) return saved;
  return {
    data: saved.data,
    style: { ...saved.style, ...(template.styleHints ?? {}), templateId: template.id },
  };
}
```

- [ ] **Step 4: Wire it into the builder and the page**

In `components/builder/Builder.tsx`: import `withTemplate` from `./initial-state`; change the signature to `export function Builder({ initialTemplate }: { initialTemplate?: string } = {})`; and replace `const initial = useMemo(() => load(), []);` with

```ts
  const initial = useMemo(() => withTemplate(load(), initialTemplate), [initialTemplate]);
```

In `app/editor/page.tsx`, change the component to:

```tsx
export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { template } = await searchParams;
  const templateId = typeof template === "string" ? template : undefined;

  if (!user) {
    const next = templateId ? `/editor?template=${encodeURIComponent(templateId)}` : "/editor";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return <Builder initialTemplate={templateId} />;
}
```

`Builder` validates the id, so an arbitrary value only ever reaches `TEMPLATE_BY_ID` as a lookup key.

`proxy.ts` redirects signed-out visitors before the page runs and currently drops the query string. Change

```ts
    url.searchParams.set("next", request.nextUrl.pathname);
```

to

```ts
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
```

`safeNext` already accepts `/editor?template=slate` (it is one of its passthrough cases).

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run components/builder && npx tsc --noEmit && npm run lint && npm test`
Expected: all PASS.

```bash
git add components/builder app/editor vitest.config.ts proxy.ts
git commit -m "Let marketing links open the editor on a chosen template

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Homepage, site-wide metadata and cleanup

**Files:**
- Create: `lib/marketing/home.ts`
- Modify: `app/(site)/page.tsx`, `app/layout.tsx`, `lib/marketing/faqs.ts` (`home`), `lib/marketing/content-index.ts`, `package.json` (add `check-marketing` to `test`)
- Delete: `public/dashboard_mockup.jpg`, `public/hero_bg.jpg`, `public/logo_symbol.png`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `docs/design-references/`

**Interfaces:**
- Consumes: Task 3 primitives, `SignaturePreview`, `EmailFrame`, `TemplateCard`, `PlanCards` is NOT used here (built in Task 8) — the homepage pricing summary is a static three-column list built from `PLANS` directly.
- Produces: `HOME: { hero: { eyebrow; title; lede; primary: {label; href}; secondary: {label; href}; claims: ClaimId[] }; steps: { title; lede; items: Array<Step & { claims: ClaimId[] }> }; features: { title; lede; items: Feature[] }; templates: { title; lede; ids: string[] }; pricing: { title; lede }; faq: { title }; cta: { title; body; cta: {label; href} } }`

- [ ] **Step 1: Write `lib/marketing/home.ts`**

Type it as above (type-only imports: `Feature` from `@/components/marketing/FeatureGrid`, `Step` from `@/components/marketing/Steps`, `ClaimId` from `./claims`). Content requirements:
- `hero.title`: at most 8 words, says what the product does (an email signature that looks right in every inbox). `hero.lede`: one or two sentences. `hero.primary` = `{ label: "Create your signature", href: "/editor" }`, `hero.secondary` = `{ label: "Browse templates", href: "/templates" }`. `hero.claims`: `["renders-everywhere", "no-signup-to-start"]` and the lede says you can start without an account.
- `steps.items`: 3 steps — fill in your details; choose a template and style; copy it into your email client. Cite `styling`, `templates-8`, `copy-export`, `install-guides`.
- `features.items`: 6 features citing, between them: `renders-everywhere`, `images`, `image-hosting`, `social-icons`, `buttons`, `no-tracking-pixels`, `saved-signatures`. Icons from `PhosphorIconName`.
- `templates.ids`: `["meridian", "portrait", "slate", "split"]`.
- `cta`: invites building a signature now, links to `/editor`.

Add `FAQS.home` in `lib/marketing/faqs.ts`: 6 entries — is it free (cite `free-four-templates`), which email clients (cite `install-guides`), do I need an account (cite `no-signup-to-start`, `saved-signatures`), will images break later (cite `image-hosting`), do you track recipients (cite `no-tracking-pixels`), can my team use it (cite `team-invites`). Answers are 1–3 sentences, factual, and match `CLAIMS` labels.

Register: `import * as home from "./home";` in `content-index.ts`.

- [ ] **Step 2: Write `app/(site)/page.tsx`**

```tsx
import Link from "next/link";
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { EmailFrame } from "@/components/marketing/EmailFrame";
import { FaqList } from "@/components/marketing/FaqList";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { JsonLd } from "@/components/marketing/JsonLd";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SignaturePreview } from "@/components/marketing/SignaturePreview";
import { Steps } from "@/components/marketing/Steps";
import { TemplateCard } from "@/components/marketing/TemplateCard";
import { FAQS } from "@/lib/marketing/faqs";
import { HOME } from "@/lib/marketing/home";
import { pageMetadata } from "@/lib/marketing/pages";
import { PLANS, formatPrice } from "@/lib/pricing";
import { CLIENTS } from "@/lib/signature/clients";

export const metadata = pageMetadata("home");

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: "TheMailSignature", url: SITE, logo: `${SITE}/brand/icon-512.png` },
            { "@type": "WebSite", name: "TheMailSignature", url: SITE },
          ],
        }}
      />

      <section className="bg-linear-to-b from-navy-50 to-white pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1" align="left" eyebrow={HOME.hero.eyebrow} title={HOME.hero.title} lede={HOME.hero.lede} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={HOME.hero.primary.href}>{HOME.hero.primary.label}</ButtonLink>
              <ButtonLink href={HOME.hero.secondary.href} variant="secondary">{HOME.hero.secondary.label}</ButtonLink>
            </div>
          </div>
          <EmailFrame subject="Proposal for next quarter">
            <SignaturePreview personKey="tpl-meridian" templateId="meridian" />
          </EmailFrame>
        </div>
      </section>

      <section aria-labelledby="works-in" className="border-y border-ink-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 id="works-in" className="text-sm font-semibold uppercase tracking-wider text-ink-500">
            Setup guides for
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {CLIENTS.map((client) => (
              <li key={client.id}>
                <Link href={`/help#${client.id}`} className="text-sm font-medium text-navy-900 hover:text-blue-brand-600">
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="how-it-works">
        <SectionHeading title={HOME.steps.title} lede={HOME.steps.lede} />
        <Steps steps={HOME.steps.items} />
      </Section>

      <Section tone="tint" id="features">
        <SectionHeading title={HOME.features.title} lede={HOME.features.lede} />
        <FeatureGrid features={HOME.features.items} />
      </Section>

      <Section id="templates">
        <SectionHeading title={HOME.templates.title} lede={HOME.templates.lede} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {HOME.templates.ids.map((id) => <TemplateCard key={id} templateId={id} />)}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/templates" variant="secondary">See all templates</ButtonLink>
        </div>
      </Section>

      <Section tone="tint" id="pricing">
        <SectionHeading title={HOME.pricing.title} lede={HOME.pricing.lede} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <li key={plan.id} className="rounded-card border border-ink-200 bg-white p-6">
              <h3 className="font-semibold text-navy-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-navy-900">
                {formatPrice(plan.monthly)}
                <span className="text-sm font-medium text-ink-500">
                  {plan.perSeat ? " per user / month" : " / month"}
                </span>
              </p>
              <p className="mt-2 text-ink-600">{plan.tagline}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/pricing" variant="secondary">Compare plans</ButtonLink>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading title={HOME.faq.title} />
        <div className="mt-10">
          <FaqList items={FAQS.home} />
        </div>
      </Section>

      <CtaBanner {...HOME.cta} />
    </>
  );
}
```

`HOME.steps.items` is `Step & { claims }`, so it is assignable to `Step[]` as is. Task 14 adds screenshots to these steps through `Step.image`.

- [ ] **Step 3: Site-wide metadata** — in `app/layout.tsx` add to `metadata`:

```ts
  openGraph: {
    siteName: "TheMailSignature",
    type: "website",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TheMailSignature" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"] },
```

Check `public/brand/og.png` is 1200×630: `node -e "require('sharp')('public/brand/og.png').metadata().then(m=>console.log(m.width,m.height))"`. If not, use its real size.

Because each page's `openGraph` from `pageMetadata` replaces the layout's object, add the same `images` array inside `pageMetadata`'s `openGraph` in `lib/marketing/pages.ts`.

- [ ] **Step 4: Delete leftovers and wire the guard**

```bash
git rm -q public/dashboard_mockup.jpg public/hero_bg.jpg public/logo_symbol.png public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
git rm -rq docs/design-references
grep -rn "dashboard_mockup\|hero_bg\|logo_symbol\|design-references" app components lib scripts README.md docs || echo "no references"
```

Expected: "no references" (the Phase 1 plan mentions none by these names; if a doc does, reword that line).

In `package.json`, insert `tsx scripts/check-marketing.ts && ` before `vitest run` in `test`.

- [ ] **Step 5: Verify and look at it**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: all PASS; check-marketing reports 0 uncited claims.

Run `npx next start -p 3107` in the background, open `http://localhost:3107/` with Playwright or Chrome at 1440px and 390px width, and check: hero headline and signature visible above the fold on desktop, no horizontal scroll on mobile, the signature preview shows logo/avatar images. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A app lib components public package.json docs
git commit -m "Build the homepage and remove leftover clone-era assets

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Templates gallery

**Files:**
- Modify: `app/(site)/templates/page.tsx`

**Interfaces:**
- Consumes: `TEMPLATES`, `TemplateCard`, `Section`, `SectionHeading`, `CtaBanner`, `pageMetadata`.

- [ ] **Step 1: Write the page**

```tsx
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { TemplateCard } from "@/components/marketing/TemplateCard";
import { pageMetadata } from "@/lib/marketing/pages";
import { TEMPLATES } from "@/lib/signature/templates";

export const metadata = pageMetadata("templates");

export default function TemplatesPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Templates"
          title="Eight signature layouts, all built for Outlook"
          lede="Every template is made of HTML tables with inline styles, the only format Outlook for Windows renders reliably. The examples below are live renders, not images. Open one in the editor and replace the details with yours."
        />
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {TEMPLATES.map((t) => <TemplateCard key={t.id} templateId={t.id} />)}
        </div>
      </Section>
      <CtaBanner
        title="Not sure which one?"
        body="Start with any template. You can switch layouts in the editor at any time without retyping your details."
        cta={{ label: "Open the editor", href: "/editor" }}
      />
    </>
  );
}
```

The page cites `templates-8` and `renders-everywhere` implicitly through its copy; they are already cited elsewhere, so no registry change is needed.

- [ ] **Step 2: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: PASS; `/templates` is static.

```bash
git add "app/(site)/templates"
git commit -m "Build the templates gallery with live renders

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Pricing page

**Files:**
- Create: `components/marketing/PricingCards.tsx`, `components/marketing/PricingCards.test.tsx`, `components/marketing/ComparisonTable.tsx`
- Modify: `app/(site)/pricing/page.tsx`, `lib/marketing/faqs.ts` (`pricing`)

**Interfaces:**
- Consumes: `PLANS`, `COMPARISON`, `formatPrice`, `CLAIMS`, `PRICES_PROVISIONAL`.
- Produces: `PricingCards({ plans: Plan[] })` (client); `ComparisonTable({ groups: typeof COMPARISON })`; `annualMonthly(plan: Plan): number` exported from `PricingCards.tsx` (annual price ÷ 12, rounded to 2 dp).

- [ ] **Step 1: Write the failing test** — `components/marketing/PricingCards.test.tsx`:

```tsx
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PLANS } from "@/lib/pricing";
import { PricingCards, annualMonthly } from "./PricingCards";

describe("PricingCards", () => {
  it("shows monthly prices by default", () => {
    render(<PricingCards plans={PLANS} />);
    const pro = screen.getByRole("article", { name: "Pro" });
    expect(within(pro).getByText("$5")).toBeInTheDocument();
  });

  it("switches to the annual price per month", () => {
    render(<PricingCards plans={PLANS} />);
    fireEvent.click(screen.getByRole("radio", { name: /yearly/i }));
    const pro = screen.getByRole("article", { name: "Pro" });
    expect(within(pro).getByText("$4")).toBeInTheDocument();
    expect(within(pro).getByText(/\$48 billed yearly/)).toBeInTheDocument();
  });

  it("states the Business seat minimum", () => {
    render(<PricingCards plans={PLANS} />);
    const business = screen.getByRole("article", { name: "Business" });
    expect(within(business).getByText(/minimum 3 seats/i)).toBeInTheDocument();
  });

  it("links each plan to its call to action", () => {
    render(<PricingCards plans={PLANS} />);
    for (const plan of PLANS) {
      const card = screen.getByRole("article", { name: plan.name });
      expect(within(card).getByRole("link", { name: plan.cta.label })).toHaveAttribute("href", plan.cta.href);
    }
  });
});

describe("annualMonthly", () => {
  it("divides the yearly price by twelve", () => {
    expect(annualMonthly({ ...PLANS[1], annual: 48 })).toBe(4);
    expect(annualMonthly({ ...PLANS[2], annual: 38 })).toBe(3.17);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/marketing/PricingCards.test.tsx`
Expected: FAIL — cannot resolve `./PricingCards`.

- [ ] **Step 3: Write `components/marketing/PricingCards.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { CLAIMS } from "@/lib/marketing/claims";
import { formatPrice, type Plan } from "@/lib/pricing";

type Cycle = "monthly" | "yearly";

export function annualMonthly(plan: Plan): number {
  return Math.round((plan.annual / 12) * 100) / 100;
}

export function PricingCards({ plans }: { plans: Plan[] }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <div>
      <div role="radiogroup" aria-label="Billing period" className="mx-auto flex w-fit rounded-full border border-ink-200 bg-white p-1">
        {(["monthly", "yearly"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={cycle === value}
            onClick={() => setCycle(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cycle === value ? "bg-navy-900 text-white" : "text-ink-600 hover:text-navy-900"
            }`}
          >
            {value === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = cycle === "monthly" ? plan.monthly : annualMonthly(plan);
          const unit = plan.perSeat ? "per seat / month" : "/ month";
          const titleId = `plan-${plan.id}`;
          return (
            <article
              key={plan.id}
              aria-labelledby={titleId}
              className={`flex flex-col rounded-card border bg-white p-7 ${
                plan.highlighted ? "border-blue-brand-600 shadow-lg shadow-blue-brand-600/10" : "border-ink-200"
              }`}
            >
              <h3 id={titleId} className="text-lg font-semibold text-navy-900">{plan.name}</h3>
              <p className="mt-1 text-ink-600">{plan.tagline}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-navy-900">{formatPrice(price)}</span>
                <span className="text-sm text-ink-500">{unit}</span>
              </p>
              <p className="mt-1 min-h-5 text-sm text-ink-500">
                {plan.monthly === 0
                  ? "Free for as long as you like"
                  : cycle === "yearly"
                    ? `${formatPrice(plan.annual)} billed yearly${plan.perSeat ? " per seat" : ""}`
                    : "Billed monthly"}
                {plan.perSeat && `, minimum ${plan.minSeats} seats`}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-700">
                {plan.features.map((id) => (
                  <li key={id} className="flex gap-2">
                    <span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span>
                    {CLAIMS[id].label}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-8 rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-blue-brand-600 text-white hover:bg-blue-brand-700"
                    : "border border-ink-300 text-navy-900 hover:border-navy-900"
                }`}
              >
                {plan.cta.label}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
```

`getByText("$4")` in the test needs the price in its own element — it is (`<span>`). The Business card in yearly mode shows `$3.17`, and in monthly mode `$4` — the Pro test scopes to the Pro card, so there is no ambiguity.

- [ ] **Step 4: Write `components/marketing/ComparisonTable.tsx`**

```tsx
import type { Cell, ComparisonRow } from "@/lib/pricing";

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <><span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span><span className="sr-only">Included</span></>;
  if (value === false) return <><span aria-hidden="true" className="text-ink-300">—</span><span className="sr-only">Not included</span></>;
  return <span className="text-navy-900">{value}</span>;
}

export function ComparisonTable({ groups }: { groups: Array<{ category: string; rows: ComparisonRow[] }> }) {
  return (
    <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="sr-only">Feature comparison of the Free, Pro and Business plans</caption>
        <thead>
          <tr className="border-b border-ink-200">
            <th scope="col" className="p-4 font-semibold text-ink-500">Feature</th>
            {["Free", "Pro", "Business"].map((name) => (
              <th key={name} scope="col" className="p-4 text-center font-semibold text-navy-900">{name}</th>
            ))}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.category}>
            <tr className="bg-navy-50">
              <th scope="colgroup" colSpan={4} className="px-4 py-2 font-semibold text-navy-900">{group.category}</th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="border-t border-ink-100">
                <th scope="row" className="p-4 font-normal text-ink-700">{row.label}</th>
                <td className="p-4 text-center"><CellValue value={row.free} /></td>
                <td className="p-4 text-center"><CellValue value={row.pro} /></td>
                <td className="p-4 text-center"><CellValue value={row.business} /></td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
```

- [ ] **Step 5: Write the page and its FAQ**

`FAQS.pricing`: 5 entries — can I switch plans (cite `self-serve-billing`), what happens to my signatures if I downgrade (cite `free-one-signature`), how Business seats work (cite `team-invites`), what the free plan's link is (cite `free-footer-link`), are prices final — answer: prices are shown in US dollars; taxes may apply based on location (no claim).

`app/(site)/pricing/page.tsx`:

```tsx
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { COMPARISON, PLANS } from "@/lib/pricing";

export const metadata = pageMetadata("pricing");

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TheMailSignature",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: PLANS.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price: plan.monthly.toFixed(2),
            priceCurrency: "USD",
          })),
        }}
      />
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          title="Start free. Upgrade when you need more."
          lede="Prices are in US dollars. Save by paying yearly."
        />
        <div className="mt-12">
          <PricingCards plans={PLANS} />
        </div>
      </Section>
      <Section>
        <SectionHeading title="Compare every feature" />
        <div className="mt-10">
          <ComparisonTable groups={COMPARISON} />
        </div>
      </Section>
      <Section tone="tint">
        <SectionHeading title="Billing questions" />
        <div className="mt-10">
          <FaqList items={FAQS.pricing} />
        </div>
      </Section>
      <CtaBanner
        title="Try it before you pay"
        body="Build your signature on the Free plan first. Upgrade later without starting over."
        cta={{ label: "Create your signature", href: "/editor" }}
      />
    </>
  );
}
```

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run components/marketing && npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: all PASS.

```bash
git add components/marketing "app/(site)/pricing" lib/marketing/faqs.ts
git commit -m "Build the pricing page with plan cards and a comparison table

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Teams page

**Files:**
- Create: `lib/marketing/teams.ts`
- Modify: `app/(site)/teams/page.tsx`, `lib/marketing/faqs.ts` (`teams`), `lib/marketing/content-index.ts`

**Interfaces:**
- Produces: `TEAMS: { hero: { title; lede; claims: ClaimId[] }; problems: { title; items: Array<{ title; body }> }; capabilities: { title; lede; items: Feature[] }; rollout: { title; items: Step[] }; cta: { title; body; cta } }`

- [ ] **Step 1: Write the content**

`lib/marketing/teams.ts` (type-only imports of `Feature`, `Step`). Requirements: hero cites `team-invites`, `company-template`; 3 problems (signatures drift from brand, people edit fields they should not, no idea whether signature links are used — no statistics); 4 capabilities citing `company-template`, `brand-kit`, `team-invites` + `roles`, `click-analytics` (+ `no-tracking-pixels`: analytics counts link clicks through a redirect and never adds tracking pixels); 3 rollout steps (set up the brand kit and company template; invite your team; each member fills in their own details and installs). CTA → `/signup?plan=business`, label "Start with Business". Register in `content-index.ts`.

`FAQS.teams`: 4 entries — can members change the company template (cite `company-template`), how is click data collected (cite `click-analytics`, `no-tracking-pixels`), what is the minimum team size (3 seats; cite `team-invites`), who can manage billing (cite `roles`, `self-serve-billing`).

- [ ] **Step 2: Write the page**

```tsx
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { FaqList } from "@/components/marketing/FaqList";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Steps } from "@/components/marketing/Steps";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { TEAMS } from "@/lib/marketing/teams";
import { PLANS, formatPrice } from "@/lib/pricing";

export const metadata = pageMetadata("teams");

const business = PLANS.find((p) => p.id === "business")!;

export default function TeamsPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading as="h1" eyebrow="For teams" title={TEAMS.hero.title} lede={TEAMS.hero.lede} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={business.cta.href}>{business.cta.label}</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">See pricing</ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeading title={TEAMS.problems.title} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TEAMS.problems.items.map((item) => (
            <li key={item.title} className="rounded-card border border-ink-200 p-6">
              <h3 className="font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint">
        <SectionHeading title={TEAMS.capabilities.title} lede={TEAMS.capabilities.lede} />
        <FeatureGrid features={TEAMS.capabilities.items} />
      </Section>

      <Section>
        <SectionHeading title={TEAMS.rollout.title} />
        <Steps steps={TEAMS.rollout.items} />
        <p className="mt-12 text-center text-ink-600">
          Business is {formatPrice(business.monthly)} per seat per month, or {formatPrice(business.annual)} per seat per year,
          with a minimum of {business.minSeats} seats.
        </p>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Questions from team admins" />
        <div className="mt-10">
          <FaqList items={FAQS.teams} />
        </div>
      </Section>

      <CtaBanner {...TEAMS.cta} />
    </>
  );
}
```

- [ ] **Step 3: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`

```bash
git add lib/marketing "app/(site)/teams"
git commit -m "Build the teams landing page

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Industry pages

**Files:**
- Create: `lib/marketing/industries.ts`, `app/(site)/industries/[slug]/page.tsx`
- Modify: `app/(site)/industries/page.tsx`, `app/sitemap.ts`, `scripts/check-marketing.ts`, `lib/marketing/content-index.ts`

**Interfaces:**
- Consumes: `industrySeo`, `getIndustrySeo` (`lib/marketing/industry-seo.ts`), `SignaturePreview`, `EmailFrame`, `FaqList`.
- Produces: `type Industry = { slug: string; name: string; audience: string; hook: string; intro: string; include: string[]; avoid: string[]; faqs: Faq[]; templateId: string; related: string[] }`; `INDUSTRIES: Industry[]`; `INDUSTRY_BY_SLUG: Record<string, Industry>`.

- [ ] **Step 1: Extend the guard (failing first)**

Add these imports to the top of `scripts/check-marketing.ts`:

```ts
import { INDUSTRIES } from "../lib/marketing/industries";
import { SAMPLE_PEOPLE } from "../lib/marketing/samples";
import { TEMPLATE_BY_ID } from "../lib/signature/templates";
```

and insert this block before the "4. Reports" block:

```ts
// 5. Industry pages.
const seoSlugs = Object.keys(industrySeo).sort();
const pageSlugs = INDUSTRIES.map((i) => i.slug).sort();
if (JSON.stringify(seoSlugs) !== JSON.stringify(pageSlugs)) {
  fail(`industries: slugs ${pageSlugs.join(",")} do not match industry-seo.ts ${seoSlugs.join(",")}`);
}
const intros = new Set<string>();
for (const industry of INDUSTRIES) {
  const where = `industry ${industry.slug}`;
  if (intros.has(industry.intro)) fail(`${where}: intro duplicates another industry`);
  intros.add(industry.intro);
  if (industry.intro.length < 250) fail(`${where}: intro is under 250 chars`);
  if (industry.include.length < 4 || industry.include.length > 6) fail(`${where}: needs 4-6 include tips`);
  if (industry.avoid.length !== 3) fail(`${where}: needs exactly 3 mistakes`);
  if (industry.faqs.length !== 3) fail(`${where}: needs exactly 3 FAQs`);
  if (!TEMPLATE_BY_ID[industry.templateId]) fail(`${where}: unknown template ${industry.templateId}`);
  if (!SAMPLE_PEOPLE[industry.slug]) fail(`${where}: no sample person`);
  if (industry.related.length !== 3) fail(`${where}: needs exactly 3 related industries`);
  for (const slug of industry.related) {
    if (slug === industry.slug || !pageSlugs.includes(slug)) fail(`${where}: bad related slug ${slug}`);
  }
}
```

Run: `npx tsx scripts/check-marketing.ts` — Expected: FAIL (module `industries` not found).

- [ ] **Step 2: Write `lib/marketing/industries.ts`**

```ts
import type { Faq } from "./faqs";

export type Industry = {
  slug: string;
  name: string;
  /** The name as it reads mid-sentence: "lawyers", "CEOs and founders", "IT and operations teams". */
  audience: string;
  /** One line for the index card. */
  hook: string;
  /** 250+ characters, unique, specific to how this profession uses email. */
  intro: string;
  include: string[];
  avoid: string[];
  faqs: Faq[];
  templateId: string;
  related: string[];
};

export const INDUSTRIES: Industry[] = [ /* 21 entries, see table */ ];

export const INDUSTRY_BY_SLUG: Record<string, Industry> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.slug, i]),
);
```

Fill all 21 entries in this order (name, template, related are fixed; write the prose):

| slug | name | templateId | related |
|---|---|---|---|
| accountants | Accountants | ledger | finance-banking, consultants, lawyers |
| ceos | CEOs and founders | portrait | entrepreneurs, consultants, sales-teams |
| consultants | Consultants | meridian | freelancers, ceos, accountants |
| customer-support | Customer support teams | stack | it-operations, sales-teams, hr-admin |
| education-schools-universities | Schools and universities | ledger | teachers, students, hr-admin |
| entrepreneurs | Entrepreneurs | split | ceos, freelancers, marketers |
| finance-banking | Finance and banking | minimal | accountants, lawyers, real-estate-firms |
| freelancers | Freelancers | portrait | consultants, entrepreneurs, marketing-creative-agencies |
| healthcare | Healthcare professionals | stack | hr-admin, lawyers, teachers |
| hr-admin | HR and administration | meridian | personal-assistants, customer-support, healthcare |
| it-operations | IT and operations | minimal | customer-support, hr-admin, sales-teams |
| lawyers | Lawyers | minimal | accountants, finance-banking, consultants |
| marketers | Marketers | broadcast | marketing-teams, marketing-creative-agencies, sales-teams |
| marketing-creative-agencies | Creative agencies | slate | marketers, freelancers, marketing-teams |
| marketing-teams | Marketing teams | broadcast | marketers, marketing-creative-agencies, sales-teams |
| personal-assistants | Personal and executive assistants | stack | hr-admin, ceos, customer-support |
| real-estate-firms | Real estate firms | split | realtor, finance-banking, marketing-teams |
| realtor | Realtors | portrait | real-estate-firms, entrepreneurs, sales-teams |
| sales-teams | Sales teams | meridian | marketers, customer-support, ceos |
| students | Students | stack | teachers, education-schools-universities, freelancers |
| teachers | Teachers | meridian | education-schools-universities, students, healthcare |

`audience` is `name` in sentence case, keeping acronyms (CEOs, HR, IT) capitalised.

Prose rules (enforced by review, lengths by the guard): the advice must be accurate and profession-specific (e.g. lawyers: confidentiality notice placement and length; healthcare: never put patient information in signatures, credentials after the name; realtors: licence number where regulators require it — phrase as "where your regulator requires it", never assert a specific jurisdiction's rule); no statistics; no feature claims beyond what `CLAIMS` already lists (if an FAQ answer mentions a product capability, add a `claims` array to that FAQ). Register the module in `content-index.ts`.

- [ ] **Step 3: Write `app/(site)/industries/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { EmailFrame } from "@/components/marketing/EmailFrame";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SignaturePreview } from "@/components/marketing/SignaturePreview";
import { INDUSTRIES, INDUSTRY_BY_SLUG } from "@/lib/marketing/industries";
import { getIndustrySeo } from "@/lib/marketing/industry-seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = getIndustrySeo(slug);
  if (!seo) return {};
  const path = `/industries/${slug}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      type: "article",
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TheMailSignature" }],
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = INDUSTRY_BY_SLUG[slug];
  if (!industry) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE}/industries` },
            { "@type": "ListItem", position: 3, name: industry.name, item: `${SITE}/industries/${slug}` },
          ],
        }}
      />
      <Section tone="tint">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
          <Link href="/industries" className="hover:text-navy-900">Industries</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-navy-900">{industry.name}</span>
        </nav>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1" align="left" title={`Email signatures for ${industry.audience}`} lede={industry.intro} />
            <div className="mt-8">
              <ButtonLink href={`/editor?template=${industry.templateId}`}>Start with this layout</ButtonLink>
            </div>
          </div>
          <EmailFrame subject="Following up on our call">
            <SignaturePreview personKey={industry.slug} templateId={industry.templateId} />
          </EmailFrame>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">What to include</h2>
            <ul className="mt-6 space-y-4">
              {industry.include.map((tip) => (
                <li key={tip} className="flex gap-3 leading-relaxed text-ink-700">
                  <span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Mistakes to avoid</h2>
            <ul className="mt-6 space-y-4">
              {industry.avoid.map((tip) => (
                <li key={tip} className="flex gap-3 leading-relaxed text-ink-700">
                  <span aria-hidden="true" className="font-bold text-ink-400">✕</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Common questions" />
        <div className="mt-10">
          <FaqList items={industry.faqs} />
        </div>
      </Section>

      <Section>
        <h2 className="text-xl font-bold text-navy-900">Related industries</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {industry.related.map((relatedSlug) => (
            <li key={relatedSlug}>
              <Link
                href={`/industries/${relatedSlug}`}
                className="inline-block rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-navy-900 hover:border-navy-900"
              >
                {INDUSTRY_BY_SLUG[relatedSlug].name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner
        title={`Signatures for ${industry.audience}, ready in minutes`}
        body="Fill in your details, pick a layout and copy it into your email client."
        cta={{ label: "Open the editor", href: `/editor?template=${industry.templateId}` }}
      />
    </>
  );
}
```

Before writing, confirm `dynamicParams` and `generateStaticParams` in `node_modules/next/dist/docs/01-app/03-api-reference/` for this Next version.

- [ ] **Step 4: Write the index page** — `app/(site)/industries/page.tsx`:

```tsx
import Link from "next/link";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { INDUSTRIES } from "@/lib/marketing/industries";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("industries");

export default function IndustriesPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Industries"
          title="Signature advice for your line of work"
          lede="What a lawyer needs in a signature is different from what a realtor or a teacher needs. Pick your field for practical tips and a live example."
        />
      </Section>
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug}>
              <Link
                href={`/industries/${industry.slug}`}
                className="block h-full rounded-card border border-ink-200 p-6 transition-colors hover:border-blue-brand-600"
              >
                <h2 className="font-semibold text-navy-900">{industry.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{industry.hook}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Add the industry URLs to the sitemap** — in `app/sitemap.ts` import `INDUSTRIES` and return

```ts
  return [
    ...PAGES.map(([path, priority]) => ({
      url: `${SITE}${path}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...INDUSTRIES.map((industry) => ({
      url: `${SITE}/industries/${industry.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
```

- [ ] **Step 6: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: PASS; build output lists `● /industries/[slug]` with 21 paths.

Run `npx next start -p 3107` in the background and:
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3107/industries/lawyers` → `200`;
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3107/industries/astronauts` → `404`;
`curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3107/solution/lawyers` → `308 …/industries/lawyers`. Stop the server.

```bash
git add lib/marketing "app/(site)/industries" app/sitemap.ts scripts/check-marketing.ts
git commit -m "Build the 21 industry pages from shared data

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Help and About pages

**Files:**
- Create: `lib/marketing/about.ts`
- Modify: `app/(site)/help/page.tsx`, `app/(site)/about/page.tsx`, `lib/marketing/faqs.ts` (`help`), `lib/marketing/content-index.ts`

**Interfaces:**
- Consumes: `CLIENTS`, `CLIENT_GROUPS` (`lib/signature/clients.ts`, `MailClient = { id; name; group; method; note?; steps }`).
- Produces: `ABOUT: { title; lede; sections: Array<{ heading: string; body: string[]; claims: ClaimId[] }> }`.

- [ ] **Step 1: Help content** — `FAQS.help`: 6 troubleshooting entries: images do not show for recipients (images hosted; some clients block images until the recipient allows them — cite `image-hosting`); Outlook adds extra spacing (paste the rendered signature, not source; cite `renders-everywhere`); signature looks different on phone (mobile apps may use their own signature setting); pasted code appears instead of the design (use Copy signature, not the HTML source, for paste-method clients; cite `copy-export`); icons look blurry (they are 2× PNGs; clients that rescale images can soften them); how to update a signature later (re-open the editor, copy again; cite `saved-signatures`).

- [ ] **Step 2: Help page** — `app/(site)/help/page.tsx`:

```tsx
import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { CLIENTS, CLIENT_GROUPS } from "@/lib/signature/clients";

export const metadata = pageMetadata("help");

export default function HelpPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Help"
          title="Add your signature to any email client"
          lede="Choose your email client for step-by-step instructions. The editor shows the same steps next to your finished signature."
        />
        <nav aria-label="Email clients" className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENT_GROUPS.map((group) => (
            <div key={group}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">{group}</h2>
              <ul className="mt-2 space-y-1">
                {CLIENTS.filter((c) => c.group === group).map((client) => (
                  <li key={client.id}>
                    <a href={`#${client.id}`} className="text-sm font-medium text-blue-brand-600 hover:text-blue-brand-700">
                      {client.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {CLIENTS.map((client) => (
            <article key={client.id} id={client.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy-900">{client.name}</h2>
              {client.note && <p className="mt-3 rounded-lg bg-navy-50 p-4 text-sm text-navy-900">{client.note}</p>}
              <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed text-ink-700">
                {client.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Troubleshooting" />
        <div className="mt-10">
          <FaqList items={FAQS.help} />
        </div>
        <p className="mt-10 text-center text-ink-600">
          Still stuck? <Link href="/contact" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">Send us a message</Link>.
        </p>
      </Section>
    </>
  );
}
```

If two clients share an identical step string, React will warn about duplicate keys — use `key={`${client.id}-${index}`}` instead.

- [ ] **Step 3: About content and page**

`lib/marketing/about.ts`: `title` "Email signatures that hold up everywhere"; `lede` 1–2 sentences; 3 sections — "Why we built it" (signatures break in Outlook because Word renders them; cite `renders-everywhere`), "How it works" (tables, inline styles, hosted images that never move; cite `image-hosting`, `copy-export`), "What we do not do" (no tracking pixels, no selling data; cite `no-tracking-pixels`). No founder names, team size, locations, dates or numbers. Register in `content-index.ts`.

`app/(site)/about/page.tsx`:

```tsx
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ABOUT } from "@/lib/marketing/about";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading as="h1" eyebrow="About" title={ABOUT.title} lede={ABOUT.lede} />
      </Section>
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {ABOUT.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-navy-900">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-ink-700">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </Section>
      <CtaBanner
        title="See it for yourself"
        body="Build a signature and paste it into your email client."
        cta={{ label: "Create your signature", href: "/editor" }}
      />
    </>
  );
}
```

- [ ] **Step 4: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`

```bash
git add lib/marketing "app/(site)/help" "app/(site)/about"
git commit -m "Build the help and about pages

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: Contact page and form

**Files:**
- Create: `components/marketing/ContactForm.tsx`, `components/marketing/ContactForm.test.tsx`
- Modify: `app/(site)/contact/page.tsx`

**Interfaces:**
- Consumes: `CONTACT_TOPICS` (`lib/contact/parse.ts`); `POST /api/contact` returning `{ ok: true }` or `{ ok: false, error: string, field?: string }`; `COMPANY.responseTime`.
- Produces: `ContactForm()` (client).

- [ ] **Step 1: Write the failing test** — `components/marketing/ContactForm.test.tsx`:

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

function fill() {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Topic"), { target: { value: "Billing" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
}

afterEach(() => vi.unstubAllGlobals());

describe("ContactForm", () => {
  it("posts the fields as JSON and shows success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/message sent/i));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toEqual({
      firstName: "Ada", lastName: "Lovelace", email: "ada@example.com",
      company: "", topic: "Billing", message: "Hello", website: "",
    });
  });

  it("shows the server's field error next to the field", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: false, field: "email", error: "Enter a valid email address." }), { status: 400 }),
    ));
    render(<ContactForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument());
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a general error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/could not send/i));
  });

  it("hides the honeypot from people and assistive tech", () => {
    const { container } = render(<ContactForm />);
    const trap = container.querySelector('input[name="website"]')!;
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run components/marketing/ContactForm.test.tsx`
Expected: FAIL — cannot resolve `./ContactForm`.

- [ ] **Step 3: Write `components/marketing/ContactForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact/parse";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const FIELDS = ["firstName", "lastName", "email", "company", "topic", "message", "website"] as const;

const inputClass =
  "mt-1 block w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-navy-900 focus:border-blue-brand-600 focus:outline-none focus:ring-2 focus:ring-blue-brand-600/20 aria-[invalid=true]:border-red-600";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(FIELDS.map((f) => [f, String(form.get(f) ?? "")]));
    setStatus({ kind: "sending" });
    setFieldError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; field?: string };
      if (result.ok) {
        setStatus({ kind: "sent" });
        return;
      }
      if (result.field && result.field !== "body") {
        setFieldError({ field: result.field, message: result.error ?? "Check this field." });
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "failed", message: result.error ?? "We could not send that message. Please try again." });
    } catch {
      setStatus({ kind: "failed", message: "We could not send that message. Check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <p role="status" className="rounded-card border border-ink-200 bg-navy-50 p-6 text-navy-900">
        Message sent. We will reply to the email address you gave us.
      </p>
    );
  }

  const errorFor = (field: string) =>
    fieldError?.field === field ? (
      <p id={`${field}-error`} className="mt-1 text-sm text-red-700">{fieldError.message}</p>
    ) : null;
  const invalid = (field: string) => ({
    "aria-invalid": fieldError?.field === field ? true : undefined,
    "aria-describedby": fieldError?.field === field ? `${field}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium text-navy-900">First name</label>
          <input id="firstName" name="firstName" autoComplete="given-name" required className={inputClass} {...invalid("firstName")} />
          {errorFor("firstName")}
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-navy-900">Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" required className={inputClass} {...invalid("lastName")} />
          {errorFor("lastName")}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy-900">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} {...invalid("email")} />
        {errorFor("email")}
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-navy-900">Company <span className="text-ink-500">(optional)</span></label>
        <input id="company" name="company" autoComplete="organization" className={inputClass} {...invalid("company")} />
        {errorFor("company")}
      </div>
      <div>
        <label htmlFor="topic" className="text-sm font-medium text-navy-900">Topic</label>
        <select id="topic" name="topic" required defaultValue="" className={inputClass} {...invalid("topic")}>
          <option value="" disabled>Choose a topic</option>
          {CONTACT_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        {errorFor("topic")}
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy-900">Message</label>
        <textarea id="message" name="message" rows={6} maxLength={5000} required className={inputClass} {...invalid("message")} />
        {errorFor("message")}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "failed" && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{status.message}</p>
      )}
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-lg bg-blue-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700 disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
```

`red-*` is Tailwind's default palette, which v4 keeps unless `app/globals.css` resets colours; confirm with `grep -n "color-\*: initial\|--color-red" app/globals.css` — if the defaults were removed, use `text-navy-900` with a `border-l-4 border-blue-brand-600` error style instead. `check-tokens.ts` may also forbid non-brand colours; run it.

- [ ] **Step 4: Write the page**

```tsx
import { ContactForm } from "@/components/marketing/ContactForm";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";
import Link from "next/link";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <Section tone="tint">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Contact"
            title="Talk to us"
            lede="Questions about your signature, billing or setting up a team? Send a message and we will reply by email."
          />
          <p className="mt-6 text-ink-600">Typical reply time: {COMPANY.responseTime}.</p>
          <p className="mt-2 text-ink-600">
            Setting up a signature? The <Link href="/help" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">help guides</Link> may answer it faster.
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: Verify end to end and commit**

Run: `npx vitest run components/marketing && npm test && npx tsc --noEmit && npm run lint && npx next build`

Run `npx next start -p 3107` in the background and submit once:
`curl -s -X POST http://localhost:3107/api/contact -H "Content-Type: application/json" -d '{"firstName":"Test","lastName":"User","email":"test@example.com","company":"","topic":"Billing","message":"Phase 2 check","website":""}'` → `{"ok":true}`; confirm a new line in `.contact-submissions.log` (the file transport, since `RESEND_API_KEY` is unset locally), then delete that test line. Stop the server.

```bash
git add components/marketing "app/(site)/contact"
git commit -m "Build the contact page and form

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: Legal pages

**Files:**
- Create: `components/marketing/LegalPage.tsx`
- Modify: `app/(site)/legal/terms/page.tsx`, `privacy/page.tsx`, `cookies/page.tsx`, `data-deletion/page.tsx`

**Interfaces:**
- Consumes: `COMPANY`, `hasPlaceholders()`, `pageMetadata`.
- Produces: `LegalPage({ title, updated: string /* "16 September 2026" */, children })` — renders H1, "Last updated", a draft notice when `hasPlaceholders()`, and a `prose`-styled body.

- [ ] **Step 1: Write `components/marketing/LegalPage.tsx`**

```tsx
import { Container } from "@/components/site/Container";
import { hasPlaceholders } from "@/lib/marketing/company";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-navy-900">{title}</h1>
        <p className="mt-3 text-sm text-ink-500">Last updated {updated}</p>
        {hasPlaceholders() && (
          <p role="note" className="mt-6 rounded-lg border-l-4 border-blue-brand-600 bg-navy-50 p-4 text-sm text-navy-900">
            Draft pending legal review. Bracketed items will be completed before launch.
          </p>
        )}
        <div className="mt-10 space-y-5 leading-relaxed text-ink-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-blue-brand-600">
          {children}
        </div>
      </article>
    </Container>
  );
}
```

- [ ] **Step 2: Write the four policies**

Each page: `export const metadata = pageMetadata("<key>")` and a `LegalPage` whose children are `<h2>` sections with `<p>`/`<ul>`. Every business detail is interpolated from `COMPANY` (never typed inline). Required sections, accurate to what the code does today and will do at launch:

- **Terms** (`terms`): who we are (`COMPANY.legalName`, `COMPANY.address`); the service; accounts; plans, billing and cancellation (paid plans billed in advance through our payment processor, cancel any time, access continues to the end of the paid period, prices can change with notice); acceptable use (no impersonation, no unlawful content, no phishing); your content (you own it; you grant us the licence needed to host and display the images you upload); hosted images (kept available so sent signatures keep working, removed on deletion request); availability and changes; disclaimers and limitation of liability; termination; governing law (`COMPANY.jurisdiction`); contact (`COMPANY.supportEmail`).
- **Privacy** (`privacy`): controller (`COMPANY.legalName`, `COMPANY.privacyEmail`); data we collect — account data (email, password hash held by our auth provider), signature details you save, images you upload, contact-form messages, technical data (IP address used for rate limiting and security, kept in memory only); what the editor keeps only in your browser (`localStorage` draft); purposes and legal bases; processors — Supabase (authentication, database, file storage), Resend (email delivery), Stripe (payments, from launch of paid plans); international transfers; retention; your rights (access, correction, deletion, portability, objection; CASL/PIPEDA and GDPR/UK GDPR, India DPDP Act 2023 named generally); children (not directed at under-16s); changes; contact.
- **Cookies** (`cookies`): strictly necessary Supabase session cookies (names beginning `sb-`) set only when you sign in; `localStorage` key `sendmark.signature.v1` holding your editor draft on your device; no analytics or advertising cookies today, and consent will be asked before any are added; how to clear them.
- **Data deletion** (`dataDeletion`): what deleting your account removes (account, saved signatures, uploaded images, subscription records kept only as tax law requires); how to request it today — email `COMPANY.privacyEmail` from your account address; timeline (we act within 30 days); the note that images already embedded in sent emails stop displaying once deleted; self-serve deletion from account settings arriving with accounts. That capability is the `self-serve-deletion` claim, already cited by `COMPARISON`, so `check:launch` keeps it tracked.
- Clear-your-editor-draft instructions reference the key name exactly as in `lib/signature/defaults.ts` (`STORAGE_KEY`) — import it rather than typing it.

Set `updated="16 September 2026"` on all four.

- [ ] **Step 3: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build && npm run check:launch`
Expected: all PASS except `check:launch`, which fails listing unshipped claims, the 6 company placeholders and provisional prices — and nothing else (no inline `[PLACEHOLDER` in the legal pages, because they interpolate `COMPANY`).

```bash
git add components/marketing "app/(site)/legal"
git commit -m "Write original legal policies with tracked placeholders

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 14: Editor screenshots

**Files:**
- Create: `scripts/capture-screenshots.mjs`, `public/product/editor-details.png`, `public/product/editor-templates.png`, `public/product/editor-install.png`
- Modify: `package.json` (`@playwright/test` dev dependency, `screenshots` script), `lib/marketing/home.ts` (step images), `.env.example` (document the two variables)

**Interfaces:**
- Consumes: a running app at `BASE_URL`; `SCREENSHOT_EMAIL`, `SCREENSHOT_PASSWORD` (a confirmed Supabase test user — **ask the user for these before starting this task**; do not create accounts on their Supabase project unasked).
- Produces: three PNGs, 1280×800 viewport captured at `deviceScaleFactor: 2`, cropped to the element named below.

- [ ] **Step 1: Install Playwright**

```bash
npm install --save-dev @playwright/test@1.56.1
npx playwright --version
```

If the installed version needs a browser build that is not in `%LOCALAPPDATA%/ms-playwright`, run `npx playwright install chromium`.

- [ ] **Step 2: Inspect the editor to pick selectors**

Run the app, sign in manually with Playwright's codegen or read `components/builder/Builder.tsx`, `panels.tsx`, `TemplateGrid.tsx` and `ExportPanel.tsx`, and note a stable selector (heading text or `aria-label`) for: the details panel, the template grid, and the export/install panel. If none is stable, add a `data-screenshot="details" | "templates" | "install"` attribute to the three wrappers (the only builder change allowed in this task).

- [ ] **Step 3: Write `scripts/capture-screenshots.mjs`**

```js
/**
 * Captures editor screenshots for the marketing site (npm run screenshots).
 * Requires a running app and a confirmed test account:
 *   BASE_URL=http://localhost:3000 SCREENSHOT_EMAIL=... SCREENSHOT_PASSWORD=... npm run screenshots
 * Once the editor is open to signed-out visitors (Phase 3), the sign-in step
 * can be removed.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const { SCREENSHOT_EMAIL: email, SCREENSHOT_PASSWORD: password } = process.env;
if (!email || !password) {
  console.error("Set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD to a confirmed test account.");
  process.exit(1);
}

const OUT = "public/product";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await context.newPage();

await page.goto(`${BASE_URL}/login?next=/editor`);
await page.getByLabel("Email").fill(email);
await page.getByLabel("Password").fill(password);
await page.getByRole("button", { name: /log in|sign in/i }).click();
await page.waitForURL(`${BASE_URL}/editor**`);
// Start from the built-in example rather than whatever the account left behind.
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForLoadState("networkidle");

const shots = [
  ["details", "editor-details.png"],
  ["templates", "editor-templates.png"],
  ["install", "editor-install.png"],
];
for (const [name, file] of shots) {
  const target = page.locator(`[data-screenshot="${name}"]`);
  await target.scrollIntoViewIfNeeded();
  await target.screenshot({ path: `${OUT}/${file}` });
  console.log(`Saved ${OUT}/${file}`);
}

await browser.close();
```

Adjust the login labels to match `components/auth/LoginForm.tsx` exactly. Add `"screenshots": "node scripts/capture-screenshots.mjs"` to `package.json`, and to `.env.example`:

```
# Test account used by `npm run screenshots` to capture editor images.
# SCREENSHOT_EMAIL=
# SCREENSHOT_PASSWORD=
```

- [ ] **Step 4: Capture and wire in**

Run the app (`npx next start -p 3107` after a build), then `BASE_URL=http://localhost:3107 npm run screenshots` with the credentials. Read each PNG to check it shows the intended panel and contains no personal data. Get each file's size with sharp, then in `lib/marketing/home.ts` add `image: { src: "/product/editor-details.png", alt: "…", width, height }` (width/height halved for the 2× capture) to the three steps, in order details → templates → install. Alt text describes what the screenshot shows.

- [ ] **Step 5: Verify and commit**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`

```bash
git add scripts/capture-screenshots.mjs public/product lib/marketing/home.ts package.json package-lock.json .env.example components/builder
git commit -m "Capture editor screenshots for the homepage

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 15: Route check, Lighthouse, documentation

**Files:**
- Create: `scripts/check-routes.ts`
- Modify: `package.json` (`check:routes`), `README.md`, `docs/superpowers/specs/2026-09-15-themailsignature-production-design.md` (§7 checklist)

- [ ] **Step 1: Write `scripts/check-routes.ts`**

```ts
/**
 * Crawls a running site (BASE_URL, default http://localhost:3000): every URL in
 * the sitemap plus every internal link on those pages must return 200 after
 * redirects, and every sitemap page must have a title, a meta description and
 * a canonical link. Usage: BASE_URL=http://localhost:3107 npm run check:routes
 */
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
```

Add `"check:routes": "tsx scripts/check-routes.ts"` to `package.json`.

Run: `npx next build`, `npx next start -p 3107` (background), then `BASE_URL=http://localhost:3107 npm run check:routes`
Expected: PASS with 34 sitemap pages (the 13 entries in `PAGES`, including `/editor`, plus 21 industries). Fix any failure it reports.

- [ ] **Step 2: Lighthouse SEO**

With the server still running:

```bash
CHROME_PATH="$(node -e "console.log(require('@playwright/test').chromium.executablePath())")" \
  npx --yes lighthouse@12 http://localhost:3107/ --only-categories=seo,accessibility --quiet \
  --chrome-flags="--headless=new" --output=json --output-path="$TEMP/lh-home.json"
node -e "const r=require(process.env.TEMP+'/lh-home.json');console.log('seo',r.categories.seo.score,'a11y',r.categories.accessibility.score)"
```

Repeat for `/pricing` and `/industries/lawyers`. Expected: SEO ≥ 0.95 on all three. Record accessibility scores; fix any failing audit the report lists (contrast, labels, heading order) before continuing. Stop the server.

- [ ] **Step 3: Documentation**

- `README.md`, "The marketing site" section: replace "The page bodies are placeholders until Phase 2 writes the real copy." with a paragraph describing `lib/marketing/` (copy as data), `lib/pricing.ts`, the claims registry and `SHIPPED_THROUGH_PHASE`, and the commands `npm run samples`, `npm run screenshots`, `npm run check:routes`, `npm run check:launch`. In "Commands", list `check-marketing.ts` among the `npm test` suites (eight node suites now).
- Parent spec §7 checklist: add `- [ ] \`npm run check:launch\` passes (all cited claims shipped, no placeholders, final prices)`.

- [ ] **Step 4: Final verification**

Run: `npm test && npx tsc --noEmit && npm run lint && npx next build`
Expected: all PASS.
Run: `npm run check:launch` — expected FAIL, listing only claims with `shipsIn` 3–5, the company placeholders and provisional prices.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-routes.ts package.json README.md docs/superpowers/specs
git commit -m "Add the route crawler and document the marketing site

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Phase 2 exit criteria

- `npm test`, `tsc --noEmit`, `npm run lint`, `next build` pass; build lists 21 static industry pages.
- `npm run check:routes` passes against `next start`.
- Lighthouse SEO ≥ 95 on `/`, `/pricing`, `/industries/lawyers`.
- `check-marketing.ts` passes (no banned phrase, every claim cited); `check:launch` fails only on Phase 3–5 claims, company placeholders and provisional prices.
- `/solution/lawyers` → 308 → `/industries/lawyers` → 200.
