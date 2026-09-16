# Template library, animated elements and image hosting — design

Date: 2026-09-17
Status: approved by the user in chat (design sections A–C); Taste skill required for visual design
Parent spec: `2026-09-15-themailsignature-production-design.md`; builds on `2026-09-16-phase-2-marketing-site-design.md`

## 1. Goal

Give every industry at least six attractive, minimal, Outlook-safe signature
designs (one free, five paid), add animated signature elements for paid plans,
make "upload and host on our server" a paid feature while external image links
stay free, and reorganise `/templates` so 126 designs are easy to browse. Also
create the test account that unblocks the editor screenshots.

## 2. Decisions

| Question | Decision |
|---|---|
| How to reach 126 designs | ~12 new layouts in the engine; a *design* is a layout + an industry palette, fonts, tagline and side text. 6 per industry. |
| Free vs paid | Tier lives on layouts and on designs. Free layouts: `meridian`, `stack`, `portrait`, `minimal` (the four classic ones Free already promised). Each industry has exactly one Free design, and it must use a Free layout. Everything else is Pro. |
| Sample photos | AI-generated portraits of people who do not exist, labelled as illustrative. Needs `OPENAI_API_KEY` + `ENABLE_GARDEN_IMAGEGEN=1`; until supplied, samples keep the generated monograms and the portraits drop in without code changes. |
| Animation | Animated GIFs only (email clients strip CSS animation). First frame of every GIF is the complete still design, because classic Outlook for Windows may show only frame one. |
| Image hosting | Uploads stored on our server disk (`UPLOAD_DIR`, a persistent VPS volume), served from `/u/…` on our own domain; Supabase Storage stays as an alternative driver. Pro/Business in copy and editor UI now; enforced server-side in Phase 4. Pasting an external image URL is available to everyone, always. |
| Visual direction | Taste skill (`taste-skill:taste-skill`) is loaded before designing layouts, design palettes, and the templates page. |

## 3. Part A — test account and screenshots

- `scripts/create-test-account.mjs` calls Supabase `auth.signUp` with the public
  (publishable) key for `thekarankathuria@gmail.com` and a generated
  24-character password, and writes `SCREENSHOT_EMAIL` / `SCREENSHOT_PASSWORD`
  to `.env.local` (never committed). Supabase emails a confirmation link; the
  user clicks it. The script refuses to overwrite existing values.
- Then Phase 2 Task 14 (`npm run screenshots`) runs as planned.

## 4. Part B — engine

### 4.1 Data and style additions (`lib/signature/types.ts`, `defaults.ts`)

- `SignatureData.sideText: string` — up to four short lines separated by
  newlines, shown in a side column by layouts that support it
  ("People / Ideas / Progress"). Escaped like all text; empty hides the column.
- `SignatureStyle.iconAnimation: "none" | "pulse" | "bounce" | "wiggle"` —
  social icons switch to animated GIFs when not `none`.
- `SignatureStyle.statusDot: "none" | "static" | "blink"` — a small dot on the
  photo corner (Tech Startup) or beside the name; colour `statusColor`
  (default `#22A55B`).
- `SignatureStyle.secondaryFont: FontKey` — used for names and side text in
  serif-led layouts; defaults to `font`.
- Defaults: `sideText: ""`, `iconAnimation: "none"`, `statusDot: "none"`,
  `statusColor: "#22A55B"`, `secondaryFont` = `DEFAULT_STYLE.font`. The builder
  already merges saved drafts over defaults, so old drafts keep working.
- `TemplateMeta` gains `tier: "free" | "pro"`, `tags: StyleTag[]`
  (`"minimal" | "classic" | "bold" | "dark" | "creative"`), and
  `supports?: Array<"sideText" | "statusDot">`.

### 4.2 Layouts

The 8 existing renderers stay. `lib/signature/templates.ts` is split into
`lib/signature/templates/` (one file per family plus `index.ts` exporting the
same `RENDERERS`, `TEMPLATES`, `TEMPLATE_BY_ID`), because 20 renderers do not
fit one readable file. New layouts, all Pro:

| id | Name | Distinctive feature |
|---|---|---|
| `luxe` | Minimal Luxury | round photo, thin rule, spaced uppercase title, serif name, right icon column, side text under photo |
| `corporate` | Modern Corporate | full-height accent bar, square photo, company line in accent, side text column |
| `studio` | Creative Studio | photo on a tinted circle, italic serif side quote, accent vertical rule, uppercase side list |
| `executive` | Executive Premium | dark card (`#1E1F22`), round photo, light serif text, side text column |
| `nordic` | Scandinavian Minimal | square photo, muted palette, footer band with company and tagline |
| `bold` | Bold Modern | oversized two-line name, italic side statement |
| `startup` | Tech Startup | ringed round photo with status dot, tinted side card |
| `editorial` | Editorial | company label on top, serif name, short rule, italic side text, warm paper tint |
| `personal` | Personal Brand | large square photo, title list with separators, italic serif side statement |
| `ultra` | Ultra Minimal | small round photo, contact on two lines with separators, uppercase side list |
| `monogram` | Monogram | logo-led: large logo block left, text right, no photo |
| `colorblock` | Color Block | accent-filled header row with name, details below |

Rules for every layout: nested tables, inline styles only, `bgcolor` plus
`background-color` on filled cells, widths ≤ 600px, images via `img()`, text via
`textCell()`/existing parts, script-looking text rendered as italic Georgia.
Every layout passes `scripts/check-render.ts` (hostile payload, allowed tags,
coloured anchors) with no changes to the checks.

### 4.3 Animated elements

- `scripts/gen-animated-icons.mjs` (`npm run anim`) renders, for every social
  network × icon style × animation (`pulse`, `bounce`, `wiggle`), an 8-frame GIF
  at 96×96 into `public/i/social-anim/<animation>/<style>/<slug>.gif`, frame 1
  identical to the static PNG. Status dots: `public/i/status/<static|blink>-<hex>.gif`
  for a fixed palette of 6 colours (the editor offers only those).
- `socialRow()` picks the GIF path when `style.iconAnimation !== "none"`.
- Claim `animated-elements` (Pro, ships in phase 4 as a gated feature; the
  rendering itself ships in this work).

### 4.4 Image hosting

- `lib/storage/images.ts` disk driver writes to `UPLOAD_DIR` (default
  `public/u` for development) and a route handler `app/u/[file]/route.ts`
  serves files from `UPLOAD_DIR` with the immutable cache header when
  `UPLOAD_DIR` is outside `public/`. Content addressing is unchanged.
- Editor `ImageField`: Upload button shows a "Pro" badge; the URL input stays
  first-class with the hint "Paste a link to an image hosted anywhere".
- Claims: `pro-image-hosting` (phase 4) — "Upload images and animations and we
  host them on TheMailSignature". The existing `image-hosting` claim text stays
  true for hosted images.

## 5. Designs — `lib/marketing/designs.ts`

```ts
type Design = {
  id: string;              // `${industry}-${layoutId}`
  industry: string;        // slug from INDUSTRIES
  layoutId: string;        // TEMPLATE_BY_ID key
  name: string;            // layout name, shown with the industry
  tier: "free" | "pro";
  style: Partial<SignatureStyle>;   // palette, fonts, animation, status dot
  data: Partial<SignatureData>;     // tagline, sideText
};
```

Per industry: one palette (`primary`, `ink`, `tint`), one serif/sans pairing,
three side-text lines and a tagline, and the list of 6 layout ids, the first
of which is the Free one. `designsFor(industry)` builds the 6 `Design`s.
Selected Pro designs showcase animation (at least one per industry uses
`iconAnimation` or a blinking `statusDot`).

Guard additions in `scripts/check-marketing.ts`: every industry has ≥ 6
designs; exactly one Free design, on a Free layout; `(industry, layoutId)`
unique; every design's accent, name colour and text colour meet 4.5:1 on its
layout's background; every design renders without throwing.

## 6. Part C — pages and editor

- `/templates`: hero; a "Featured" row (12 designs, one per layout); a filter
  bar (industry select, style tag chips, Free/Pro toggle) whose state lives in
  the URL (`?industry=&style=&plan=`); results grouped by industry with a
  "Show more" button revealing 12 at a time. Previews are rendered server-side
  as HTML strings and passed to a small client component that filters them.
  Cards show layout name, industry, a Free or Pro badge and an "animated"
  badge, and link to `/editor?design=<id>`.
- `/industries/[slug]`: a "Designs for <audience>" section with the 6 designs
  (Free first) replacing the single example; the hero keeps the Free design.
- Editor: `/editor?design=<id>` applies the design's layout, style and data
  presets over the saved draft (keeping the user's personal details);
  `?template=` keeps working. The template picker groups Classic and Designer
  layouts and shows Pro badges; animation and status-dot controls appear in the
  style panel with a Pro badge.
- Copy: Free plan claim becomes "4 classic templates plus one designed template
  for your industry"; Pro adds "All 20 layouts and every industry design",
  "Animated icons and status badges", "Upload and host images on
  TheMailSignature". Comparison table, pricing FAQ and home FAQ updated to
  match; external image links listed as available on every plan.

## 7. Testing

- `check-render.ts` covers all 20 layouts automatically (it iterates
  `TEMPLATES`), plus a new case that renders every layout with
  `iconAnimation: "pulse"` and `statusDot: "blink"` and asserts GIF paths.
- Vitest: `designsFor` (6 per industry, one Free), design preset application
  in the editor (`withDesign`), template filter logic (industry, style, plan,
  URL round-trip), `socialRow` animated path selection.
- `check-marketing.ts` design guards (above); `check:routes` and Lighthouse
  (SEO/a11y/best practices = 100) on `/templates` and two industry pages.
- Visual review of every layout at desktop and mobile width against the Taste
  skill checklist.

## 8. Out of scope

Server-side enforcement of Pro features (Phase 4), saving designs to an
account (Phase 3), CSS or AMP animation, video in signatures.
