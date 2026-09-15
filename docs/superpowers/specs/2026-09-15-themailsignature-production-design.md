# TheMailSignature — production readiness design

Date: 2026-09-15
Status: awaiting review

## 1. Why this document exists

The repository contains a working email-signature render engine, a builder UI and
Supabase password auth, wrapped in a marketing site that is a verbatim clone of
customesignature.com. The clone cannot ship: it carries another company's CSS,
copy, artwork, product videos, legal policies and fabricated social proof.

This document records the decisions taken during brainstorming, the target
architecture, and the phases that take the project from "runs locally" to "safe
to put on the public internet as TheMailSignature".

### What already works and is kept

- `lib/signature/*` — the render engine. Table-based, fully inline-styled output
  that survives Outlook's Word renderer; hostile input is escaped; only
  `http(s):`, `mailto:` and `tel:` URLs survive. Covered by `npm test`.
- `components/builder/*` — the builder UI (8 templates, logo/photo/banner, CTA
  and meeting buttons, 22 social networks, per-client install instructions).
- Supabase auth, `proxy.ts` route gating, `lib/safe-next.ts` open-redirect guard,
  `lib/rate-limit.ts`, `lib/storage/images.ts` content-addressed uploads,
  security headers in `next.config.ts`.
- The build is green: `npm test`, `tsc --noEmit`, `eslint` (0 errors) and
  `next build` (42 routes) all pass as of this date.

### What is discarded

- `app/ces.css`, `app/ces-inline.css`, `app/ces-extra.css` and every
  `components/ces/**` component (cloned Webflow markup and class names).
- `public/ces/**` — cloned imagery, video and Lottie files, including the 30
  images and 9 videos that still show "Custom Esignature" in the pixels.
- `lib/ces/legal.ts` — the other company's policies, copied clause for clause.
- The fabricated social proof: `CesProofWidget` ("Chris from Los Angeles
  purchased Pro Plan"), "50k+ Users", "42% increase reply rate", 5.0/4.9 star
  glyphs, third-party client logos, and the "Evan" founder story.
- Third-party embeds serving the original company's content: the Loom videos on
  `/demo`, `/support`, `/tutorials` and in the homepage FAQ.

## 2. Decisions

| Decision | Choice |
|---|---|
| Brand name | TheMailSignature |
| Marketing site | Rebuilt as original work; reference for structure is mysignature.io |
| Visual direction | "Ink & Signal" repainted to the supplied logo: navy `#0B1F52`, blue `#0050B8`, white surfaces, Inter |
| Homepage | Classic narrative: headline → product shot → features → templates → pricing → FAQ |
| Pricing page | Tier cards plus a full feature comparison matrix |
| Signed-in area | Sidebar workspace: Signatures, Templates, Brand kit, Team, Billing |
| Editor access | Open to everyone; an account is required only to save signatures and upload images |
| Tiers | Free · Pro ($4–5/mo, ~$48/yr) · Business ($4/user/mo, 3-seat minimum) |
| Tier scope | All three live at launch |
| Payments | Stripe at launch; Razorpay (UPI/INR) after; behind a provider-neutral layer |
| Hosting | Self-managed VPS; launch only when complete |
| Legal entity | Undecided — policies written with explicit placeholders |

## 3. Architecture

### 3.1 Design system

One Tailwind v4 design system for marketing and app, replacing the Webflow CSS.
Tokens (colour, type scale, spacing, radii, shadows) are defined once in
`app/globals.css` as CSS variables and consumed by both route groups. The
existing builder already uses Tailwind, so it inherits the system rather than
being restyled twice.

Brand assets are generated from the supplied logo into `public/brand/`: the
wordmark, a light (knockout) variant for dark surfaces, an envelope-only mark for
the favicon and app icons, and a 1200×630 Open Graph image. An SVG original is
requested but not required — raster exports are produced at 1×/2× until one
arrives.

### 3.2 Routes

```
(site)   /                     narrative homepage
         /templates            gallery; each template links into the editor
         /pricing              cards + comparison matrix
         /teams                Business landing page
         /about /contact /help  original copy
         /legal/{terms,privacy,cookies,data-deletion}
         /industries/<slug>    21 existing slugs, rewritten copy (SEO kept)
(auth)   /login /signup /forgot-password /reset-password
(app)    /editor               open to everyone; saving prompts sign-in
         /app/signatures       sidebar workspace (default)
         /app/templates /app/brand /app/team /app/billing /app/settings
api      /api/upload /api/contact /api/stripe/webhook /r/<token>
```

Every currently indexable URL keeps working through a permanent redirect, so no
existing link or search result 404s: `/generator` → `/editor`,
`/solution/<slug>` → `/industries/<slug>`, `/contact-us` → `/contact`,
`/privacypolicy` → `/legal/privacy`, `/terms-of-use` → `/legal/terms`,
`/cookies-policy` → `/legal/cookies`, `/user-data-deletion` →
`/legal/data-deletion`, `/browse-1000-industries` → `/industries`,
`/support` → `/help`, `/tutorials` → `/help`.

### 3.3 Data model (Supabase Postgres, RLS on every table)

```
profiles(id→auth.users, display_name, plan_cache, created_at)
organizations(id, name, owner_id, seats, brand_kit_id, created_at)
org_members(org_id, user_id, role: owner|admin|member, status)
org_invites(id, org_id, email, role, token_hash, expires_at, accepted_at)
signatures(id, owner_id, org_id?, name, data jsonb, style jsonb,
           is_company_default, locked, updated_at)
subscriptions(id, owner_type: user|org, owner_id, provider, provider_customer_id,
              provider_subscription_id, plan, status, seats,
              current_period_end, cancel_at_period_end)
brand_kits(id, org_id, colours jsonb, fonts jsonb, logo_url, banner_url)
link_tokens(token, signature_id, target_url, created_at)
link_clicks(id, token, clicked_at, ip_hash, user_agent_family)
```

RLS: a user reads and writes only their own rows; org members read org rows;
only `owner`/`admin` may write org rows. Entitlements are **always** resolved
server-side from `subscriptions`, never from a client claim. `plan_cache` on
`profiles` is a convenience mirror, never the authority.

### 3.4 Billing abstraction

`lib/billing/` exposes a provider-neutral interface — `createCheckout`,
`createPortalSession`, `syncSubscription`, `handleWebhookEvent` — with
`providers/stripe.ts` as the only implementation at launch. Razorpay slots in
behind the same interface later. Rules:

- Stripe is the source of truth; our `subscriptions` rows are a projection
  rebuilt from webhook events (`checkout.session.completed`,
  `customer.subscription.*`, `invoice.payment_failed`).
- Webhook signature verification is mandatory; the route is exempt from auth and
  from the rate limiter's user key.
- Events are idempotent by `event.id`; replays must not double-apply.
- Seat count for Business is the Stripe quantity; adding a member above the seat
  count is refused with a clear message rather than silently allowed.

### 3.5 Entitlements

One module, `lib/billing/entitlements.ts`, answers "may this actor do X" for:
template access, saved-signature count, footer-link removal, banner/CTA/GIF
fields, team features and analytics. Every gate is enforced on the server (server
components, server actions, API routes); the UI mirrors it for affordance only.
The free tier's "Made with TheMailSignature" link is appended during **render**,
inside `lib/signature/render.ts`, so it cannot be stripped by editing client
state.

### 3.6 Click analytics (Business)

Signature links are rewritten to `/r/<token>`, which records a click and 302s to
the target. Constraints: IPs are stored only as a salted hash, no cookies are
set, the redirect is server-side and fast, and the feature is off for Free and
Pro. Rewriting is opt-in per signature so a user who prefers bare links keeps
them.

### 3.7 Contact, transactional mail and abuse

- Auth mail and contact mail move to a real provider (Resend) with a verified
  sending domain, SPF/DKIM/DMARC configured. Supabase's built-in mailer is rate
  limited and unsuitable for production signups.
- The contact route keeps its "never silently drop" behaviour, but the fallback
  log becomes a database row rather than a file.
- `lib/rate-limit.ts` keeps its signature. On a single VPS process the in-memory
  store is adequate; the interface allows a Redis store if the app is ever
  scaled to more than one process.

### 3.8 Deployment (VPS)

`output: "standalone"`, a multi-stage Dockerfile, `docker compose` with the app
plus Caddy (or nginx) terminating TLS via Let's Encrypt. `X-Forwarded-*` honoured
so `auth/callback` resolves the public origin. Uploaded images continue to go to
Supabase Storage (durable, content-addressed) rather than the container disk.
Daily database backups, uptime monitoring, and structured application logs.

## 4. Content rules (non-negotiable)

1. No statistic, rating, review, customer count or client logo appears unless it
   is true and attributable. Until real numbers exist, the site sells on
   verifiable product facts: "renders in Outlook, Gmail and Apple Mail",
   "8 templates", "no tracking pixels in your signature".
2. No feature is advertised before it ships. "AI" is not claimed at all.
3. Product screenshots are captured from this product.
4. Legal pages are written for this business, with `[PLACEHOLDER]` markers for
   entity name, jurisdiction and address, and a note that a lawyer should review
   them before launch.

## 5. Phases

Each phase gets its own implementation plan and is independently reviewable.
Phase order is dependency-driven: nothing in 2–5 can be built before 1.

**Phase 1 — Foundation and brand.** Delete the clone (components, CSS, assets,
legal data). Generate brand assets. Build the design-system tokens and the shared
primitives (button, input, card, section, nav, footer). Wire the app shell.
*Done when:* `rg -i "customesignature|ces-"` returns nothing, the site builds with
the new shell, and `npm test` still passes.

**Phase 2 — Marketing site.** Homepage (narrative), templates gallery, pricing
(cards + matrix), teams, about, contact, help/FAQ, four legal pages, 21 rewritten
industry pages, redirects from old URLs, sitemap/robots/OG/JSON-LD refreshed.
*Done when:* every route returns 200, no page contains an unverifiable claim, and
Lighthouse SEO ≥ 95 on the homepage.

**Phase 3 — Accounts and editor.** Open editor; save/load signatures; the sidebar
workspace; forgot/reset password; account settings; working account deletion;
Supabase schema and RLS.
*Done when:* an anonymous visitor can build and copy a signature, and a signed-in
user can save, reopen, rename and delete signatures — verified by end-to-end
tests.

**Phase 4 — Billing.** Stripe products and prices, checkout, customer portal,
webhooks, the entitlements module, and gating for every Pro feature including the
render-time footer link.
*Done when:* upgrade, downgrade, cancellation and failed payment each produce the
correct entitlement, proven against Stripe's test clock.

**Phase 5 — Business tier.** Organizations, invitations, roles, seat enforcement,
brand kit, admin-locked company signature, click analytics.
*Done when:* an admin can invite members, lock a company signature, and see click
counts; a member cannot edit locked content.

**Phase 6 — Launch hardening.** Custom 404/500, cookie consent and analytics,
transactional mail with a verified domain, Dockerfile and compose, TLS, backups,
monitoring, a CSP introduced report-only first, final accessibility pass, and a
pre-launch checklist run against staging.
*Done when:* the checklist in §7 is fully ticked on the production host.

## 6. Testing strategy

- Keep and extend the existing node test suites (render safety, `safeNext`,
  hardening).
- Add Playwright end-to-end coverage for: build-and-copy as an anonymous user,
  signup → confirm → save, upgrade to Pro via Stripe test mode, invite a teammate,
  and the locked-signature rule.
- Add a content guard to `npm test` that fails the build if banned strings
  (`customesignature`, `Custom Esignature`, old Loom ids) reappear.

## 7. Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin; canonicals correct
- [ ] Supabase: Site URL and redirect allow-list updated; custom SMTP configured
- [ ] Stripe: live keys, products, prices, webhook endpoint and signing secret
- [ ] Storage bucket public-read, INSERT for `authenticated`, no UPDATE/DELETE
- [ ] TLS, HSTS, security headers verified on the live origin
- [ ] Backups scheduled and one restore rehearsed
- [ ] Legal placeholders filled and reviewed
- [ ] Analytics with consent; cookie policy matches what is actually set
- [ ] `robots.txt` allows indexing; sitemap submitted to Search Console

## 8. Open questions

1. **SVG logo** — raster exports are in use until a vector original is supplied.
2. **Legal entity** — name, jurisdiction and contact address are placeholders.
3. **Final prices** — $4 vs $5 for Pro, and the annual discount, are provisional.
4. **INR pricing** — set when Razorpay is added post-launch.
5. **Industry pages** — 21 pages of original copy is substantial; they may be
   staged in batches after launch, keeping the redirects in place.

## 9. Non-goals for launch

Affiliate programme, blog, multi-language, mobile apps, AI features, Google
Workspace/Microsoft 365 auto-deployment, and Square support.
