# Template Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Twelve new Outlook-safe signature layouts, six curated designs per industry (one free), animated GIF icons and status dots, server-hosted uploads marked as a paid feature, and a filterable `/templates` page.

**Architecture:** The engine (`lib/signature`) gains a few data/style fields, a contact-icon and animated-asset pipeline, and twelve renderers in `lib/signature/designer/` registered alongside the eight classic ones. Designs are data (`lib/marketing/designs.ts`) = layout + industry styling. Pages render previews on the server and hand HTML strings to a small client filter.

**Tech Stack:** Next.js 16.3.1 (App Router; `params`/`searchParams` are Promises), React 19.2, Tailwind v4 tokens, TypeScript strict, sharp 0.35 (PNG and animated GIF output via `join: { animated: true }`), Vitest + Testing Library, tsx node guard scripts.

**Spec:** `docs/superpowers/specs/2026-09-17-template-library-design.md`

**About the design-heavy tasks (4, 5, 6, 8):** layouts and design palettes are specified by structure, measurements and the rules the guards enforce, plus one full reference renderer (`luxe`). The executor loads the Taste skill (`taste-skill:taste-skill`) before each of these tasks, renders the review sheet (`npm run review:layouts`), looks at it, and iterates until it passes the Taste checklist.

## Global Constraints

- Email HTML only: nested tables, inline styles, `bgcolor` + `background-color` on filled cells, no `<style>`, classes, flexbox, grid, SVG, CSS animation or web fonts. Widths ≤ 600px. Every layout passes `scripts/check-render.ts` unchanged.
- Animation is animated GIF only; frame 1 of every GIF is the complete still image.
- Fonts come only from `FONT_STACKS` in `lib/signature/html.ts`. "Script" accents are italic Georgia.
- Free layouts: `meridian`, `stack`, `portrait`, `minimal`. All new layouts are Pro. Each industry: ≥ 6 designs, exactly 1 Free, and the Free one uses a Free layout.
- Text colours in every design meet 4.5:1 against the surface they sit on.
- Samples: fictional people, `.example` domains, `+1 (555) 01NN` phones. Portraits only from the AI portrait script or the generated monograms.
- Every new capability mentioned in copy is a claim in `lib/marketing/claims.ts` and cited by id.
- `npm test`, `npx tsc --noEmit`, `npm run lint` (0 problems), `npx next build` pass at every commit. Commit messages end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- tsx scripts cannot use top-level `await`; `.mjs` scripts can. After moving/deleting routes, `rm -rf .next/types` before `tsc`.

## File map

```
lib/signature/types.ts, defaults.ts, html.ts, parts.ts     fields, textCell font, contact icons, anim paths  (Tasks 1–2)
lib/signature/assets.ts                                    asset path helpers + palettes                     (Task 2)
lib/signature/designer/kit.ts                              shared layout helpers                              (Task 3)
lib/signature/designer/<id>.ts ×12                         layouts                                            (Tasks 4–6)
lib/signature/templates.ts                                 tier/tags + registry of all 20                     (Tasks 1, 4–6)
scripts/gen-contact-icons.mjs, gen-animated-icons.mjs      npm run contact-icons / anim                       (Task 2)
scripts/review-layouts.ts                                  npm run review:layouts → .review/layouts.html      (Task 3)
lib/storage/images.ts, app/u/[file]/route.ts               UPLOAD_DIR + serving                               (Task 7)
lib/marketing/designs.ts                                   Design type, designsFor(), ALL_DESIGNS             (Task 8)
components/builder/*                                       withDesign, picker groups, new controls           (Task 9)
components/marketing/TemplateBrowser.tsx                   client filter                                      (Task 10)
app/(site)/templates/page.tsx, industries/[slug]/page.tsx  pages                                              (Tasks 10–11)
scripts/gen-portraits.mjs                                  npm run portraits (needs OPENAI_API_KEY)           (Task 12)
```

---

### Task 1: Engine fields, template tiers and a font option on `textCell`

**Files:**
- Modify: `lib/signature/types.ts`, `lib/signature/defaults.ts`, `lib/signature/html.ts` (`textCell`), `lib/signature/templates.ts` (`TEMPLATES` entries)
- Create: `lib/signature/engine.test.ts`

**Interfaces:**
- Produces: `SignatureData.sideText: string`; `SignatureStyle.{ iconAnimation: IconAnimation; statusDot: StatusDot; statusColor: string; contactIcons: ContactIconTone; secondaryFont: FontKey }` with `type IconAnimation = "none" | "pulse" | "bounce" | "wiggle"`, `type StatusDot = "none" | "static" | "blink"`, `type ContactIconTone = "none" | "ink" | "muted" | "light"`; `type StyleTag = "minimal" | "classic" | "bold" | "dark" | "creative"`; `TemplateMeta.{ tier: "free" | "pro"; tags: StyleTag[]; group: "classic" | "designer"; supports?: Array<"sideText" | "statusDot"> }`; `textCell(content, style, { ...existing, font?: FontKey })`; `FREE_TEMPLATE_IDS: readonly string[]` exported from `templates.ts`.

- [ ] **Step 1: Write the failing test** — `lib/signature/engine.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "./defaults";
import { FONT_STACKS, textCell } from "./html";
import { FREE_TEMPLATE_IDS, TEMPLATES } from "./templates";

describe("engine defaults", () => {
  it("has neutral defaults for the new fields", () => {
    expect(DEFAULT_DATA.sideText).toBe("");
    expect(DEFAULT_STYLE).toMatchObject({
      iconAnimation: "none",
      statusDot: "none",
      statusColor: "#22A55B",
      contactIcons: "none",
      secondaryFont: DEFAULT_STYLE.font,
    });
  });
});

describe("template metadata", () => {
  it("marks exactly the four classic free layouts as free", () => {
    expect([...FREE_TEMPLATE_IDS].sort()).toEqual(["meridian", "minimal", "portrait", "stack"]);
    for (const t of TEMPLATES) {
      expect(t.tier).toBe(FREE_TEMPLATE_IDS.includes(t.id) ? "free" : "pro");
      expect(t.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("textCell", () => {
  it("uses the style font unless a font is given", () => {
    expect(textCell("x", DEFAULT_STYLE)).toContain(FONT_STACKS[DEFAULT_STYLE.font]);
    expect(textCell("x", DEFAULT_STYLE, { font: "georgia" })).toContain(FONT_STACKS.georgia);
  });
});
```

- [ ] **Step 2: Run it** — `npx vitest run lib/signature/engine.test.ts` → FAIL (`FREE_TEMPLATE_IDS` missing, fields undefined).

- [ ] **Step 3: Implement**

`types.ts`: add to `SignatureData` after `tagline`: `sideText: string;`. Add the four type aliases above, and to `SignatureStyle` after `uppercaseName`:

```ts
  iconAnimation: IconAnimation;
  statusDot: StatusDot;
  statusColor: string;
  contactIcons: ContactIconTone;
  secondaryFont: FontKey;
```

Extend `TemplateMeta`:

```ts
export type StyleTag = "minimal" | "classic" | "bold" | "dark" | "creative";

export interface TemplateMeta {
  id: string;
  name: string;
  blurb: string;
  tier: "free" | "pro";
  group: "classic" | "designer";
  tags: StyleTag[];
  /** Optional fields this layout knows how to show. */
  supports?: Array<"sideText" | "statusDot">;
  omits?: Array<"photo" | "logo" | "banner">;
  styleHints?: Partial<SignatureStyle>;
}
```

`defaults.ts`: `DEFAULT_DATA.sideText = ""`, `EMPTY_DATA.sideText = ""`; `DEFAULT_STYLE` adds `iconAnimation: "none", statusDot: "none", statusColor: "#22A55B", contactIcons: "none", secondaryFont: "arial"`.

`html.ts` `textCell`: add `font?: FontKey` to `opts` and use `FONT_STACKS[opts.font ?? style.font]`.

`templates.ts`: export `FREE_TEMPLATE_IDS = ["meridian", "stack", "portrait", "minimal"] as const satisfies readonly string[];` and give the eight entries `tier`, `group: "classic"` and tags: meridian `["classic"]`, stack `["minimal", "classic"]`, ledger `["classic"]`, portrait `["classic"]`, slate `["dark", "bold"]`, minimal `["minimal"]`, broadcast `["bold"]`, split `["classic"]`.

Fix every type error `tsc` reports (sample data in `lib/marketing/samples.ts` spreads defaults, so it needs nothing; `components/builder` reads `TEMPLATES` and keeps working).

- [ ] **Step 4: Verify and commit** — `npx vitest run lib/signature && npm test && npx tsc --noEmit && npm run lint`.

```bash
git add lib/signature
git commit -m "Add side text, animation, status and contact-icon fields to the engine

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Contact icons, animated social icons and status dots

**Files:**
- Create: `lib/signature/assets.ts`, `lib/signature/assets.test.ts`, `scripts/gen-contact-icons.mjs`, `scripts/gen-animated-icons.mjs`, `public/i/contact/**`, `public/i/social-anim/**`, `public/i/status/**`
- Modify: `lib/signature/parts.ts` (`contactRows`, `socialRow`), `package.json` (`contact-icons`, `anim`)

**Interfaces:**
- Produces:
  - `STATUS_COLORS: readonly string[]` = `["#22A55B", "#0050B8", "#E0A100", "#D93A3A", "#7A4CD9", "#12A3A8"]`
  - `socialIconPath(base: string, style: SignatureStyle, slug: string): string` → `${base}/i/social/<iconStyle>/<slug>.png` or `${base}/i/social-anim/<iconAnimation>/<iconStyle>/<slug>.gif`
  - `contactIconPath(base: string, tone: Exclude<ContactIconTone, "none">, kind: ContactKind): string` → `${base}/i/contact/<tone>/<kind>.png`, `type ContactKind = "phone" | "mobile" | "email" | "web" | "address" | "meeting"`
  - `statusDotPath(base: string, mode: Exclude<StatusDot, "none">, color: string): string` → `${base}/i/status/<mode>-<hex lowercase without #>.gif`; colours not in `STATUS_COLORS` fall back to the first.
  - `contactRows(data, style, { align?, ctx? })` — when `style.contactIcons !== "none"` and `ctx` is given, each line starts with a 14px icon instead of the letter label.

- [ ] **Step 1: Write the failing test** — `lib/signature/assets.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "./defaults";
import { contactRows, socialRow } from "./parts";
import { STATUS_COLORS, contactIconPath, socialIconPath, statusDotPath } from "./assets";

const base = "https://themailsignature.com";

describe("asset paths", () => {
  it("uses static PNG icons without animation", () => {
    expect(socialIconPath(base, DEFAULT_STYLE, "linkedin")).toBe(`${base}/i/social/dark/linkedin.png`);
  });
  it("uses animated GIF icons with animation", () => {
    const style = { ...DEFAULT_STYLE, iconAnimation: "pulse" as const, iconStyle: "circle" as const };
    expect(socialIconPath(base, style, "x")).toBe(`${base}/i/social-anim/pulse/circle/x.gif`);
  });
  it("builds contact icon paths", () => {
    expect(contactIconPath(base, "muted", "email")).toBe(`${base}/i/contact/muted/email.png`);
  });
  it("only offers palette colours for status dots", () => {
    expect(statusDotPath(base, "blink", "#0050B8")).toBe(`${base}/i/status/blink-0050b8.gif`);
    expect(statusDotPath(base, "static", "#123456")).toBe(`${base}/i/status/static-${STATUS_COLORS[0].slice(1).toLowerCase()}.gif`);
  });
});

describe("parts use the assets", () => {
  it("renders animated social icons", () => {
    const html = socialRow(DEFAULT_DATA, { ...DEFAULT_STYLE, iconAnimation: "bounce" }, { assetBase: base });
    expect(html).toContain("/i/social-anim/bounce/dark/linkedin.gif");
  });
  it("swaps letter labels for icons", () => {
    const style = { ...DEFAULT_STYLE, contactIcons: "ink" as const };
    const html = contactRows(DEFAULT_DATA, style, { ctx: { assetBase: base } });
    expect(html).toContain("/i/contact/ink/phone.png");
    expect(html).not.toContain(">P</span>");
  });
});
```

- [ ] **Step 2: Run it** — FAIL (`./assets` missing).

- [ ] **Step 3: Write `lib/signature/assets.ts`**

```ts
import type { ContactIconTone, SignatureStyle, StatusDot } from "./types";

/** Status dot colours we pre-render. The editor offers only these. */
export const STATUS_COLORS = ["#22A55B", "#0050B8", "#E0A100", "#D93A3A", "#7A4CD9", "#12A3A8"] as const;

export type ContactKind = "phone" | "mobile" | "email" | "web" | "address" | "meeting";

const trim = (base: string) => base.replace(/\/$/, "");

export function socialIconPath(base: string, style: SignatureStyle, slug: string): string {
  const root = trim(base);
  return style.iconAnimation === "none"
    ? `${root}/i/social/${style.iconStyle}/${slug}.png`
    : `${root}/i/social-anim/${style.iconAnimation}/${style.iconStyle}/${slug}.gif`;
}

export function contactIconPath(
  base: string,
  tone: Exclude<ContactIconTone, "none">,
  kind: ContactKind,
): string {
  return `${trim(base)}/i/contact/${tone}/${kind}.png`;
}

export function statusDotPath(base: string, mode: Exclude<StatusDot, "none">, color: string): string {
  const known = (STATUS_COLORS as readonly string[]).find((c) => c.toLowerCase() === color.toLowerCase());
  const hex = (known ?? STATUS_COLORS[0]).slice(1).toLowerCase();
  return `${trim(base)}/i/status/${mode}-${hex}.gif`;
}
```

- [ ] **Step 4: Use them in `parts.ts`**

In `socialRow`, replace the `src:` expression with `socialIconPath(ctx.assetBase, style, s.slug)` (remove the local `base`). In `contactLines`, add `kind: ContactKind` to `ContactLine` and set it on each push (`phone`, `mobile`, `email`, `web`, `address`, `meeting`). Change `contactRows` to:

```ts
export function contactRows(
  data: SignatureData,
  style: SignatureStyle,
  opts: { align?: string; ctx?: RenderContext } = {},
): string {
  const lines = contactLines(data, style);
  if (!lines.length) return "";
  const size = Math.max(10, style.fontSize - 1);
  const lh = Math.round(size * 1.6);
  const tone = style.contactIcons;

  return lines
    .map((line) => {
      let lead = "";
      if (tone !== "none" && opts.ctx) {
        lead = `${img({ src: contactIconPath(opts.ctx.assetBase, tone, line.kind), width: 14, height: 14, alt: line.label, extra: "display:inline-block;vertical-align:-2px;" })}&nbsp;&nbsp;`;
      } else if (style.showLabels) {
        lead = `<span style="color:${style.mutedColor};font-weight:700;">${line.label}</span><span style="color:${style.mutedColor};">&#58;&nbsp;</span>`;
      }
      return `<tr>${textCell(lead + line.html, style, {
        size,
        lineHeight: lh,
        color: style.textColor,
        align: opts.align,
      })}</tr>`;
    })
    .join("");
}
```

`img()` emits `display:block` first; the `extra` overrides it because it comes later in the same style attribute.

- [ ] **Step 5: Generators**

`scripts/gen-contact-icons.mjs` — draws six 56×56 glyphs (phone handset, mobile, envelope, globe, map pin, calendar) as SVG paths in three tones (`ink` `#1E2126`, `muted` `#5F6570`, `light` `#E8EAED`) with transparent background, PNG, into `public/i/contact/<tone>/<kind>.png`. Use simple geometric paths drawn inline in the script (rounded rect + strokes); no third-party icon set is needed.

`scripts/gen-animated-icons.mjs` — reuses the icon rendering from `scripts/gen-social-icons.mjs` (import its `svg()`/`variants()` by first moving them into `scripts/lib/social-svg.mjs` and importing that from both scripts). For each slug × style × animation, build 8 frames at 96×96 by wrapping the static SVG's content in a transform, frame 0 = identity:
- `pulse`: scale `[1, 1.06, 1.12, 1.06, 1, 1, 1, 1]` about the centre
- `bounce`: translateY `[0, -6, -10, -6, 0, 2, 0, 0]`
- `wiggle`: rotate `[0, -8, 8, -6, 6, 0, 0, 0]` degrees about the centre

then `sharp(frames, { join: { animated: true } }).gif({ delay: 90, loop: 0 }).toFile(...)`. Status dots: 32×32, for each colour in `STATUS_COLORS`: `static` = one frame (filled circle r=7 with a 2px white ring); `blink` = 8 frames alternating opacity `[1,1,1,0.35,0.15,0.35,1,1]` with a soft outer halo on frames 0–2.

Add scripts `"contact-icons": "node scripts/gen-contact-icons.mjs"`, `"anim": "node scripts/gen-animated-icons.mjs"`. Run both. Expected: 18 contact PNGs, 22 × 6 × 3 = 396 social GIFs, 12 status GIFs. Check total size: `du -sh public/i/social-anim` should be under 3 MB; if not, reduce to 6 frames.

Verify frame 1 equals the static icon: a small check in the script compares the first frame's raw pixels with the static PNG for one icon and throws if more than 1% differ.

- [ ] **Step 6: Verify and commit** — `npx vitest run lib/signature && npm test && npx tsc --noEmit && npm run lint`. Look at one pulse GIF and one blink dot (`Read` the file) and a contact icon.

```bash
git add lib/signature scripts public/i package.json
git commit -m "Generate contact icons, animated social icons and status dots

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Layout kit and the review sheet

**Files:**
- Create: `lib/signature/designer/kit.ts`, `lib/signature/designer/kit.test.ts`, `scripts/review-layouts.ts`
- Modify: `package.json` (`review:layouts`), `.gitignore` (`/.review`)

**Interfaces:**
- Produces (`kit.ts`), all returning HTML strings:
  - `type Renderer = (data: SignatureData, style: SignatureStyle, ctx: RenderContext) => string`
  - `sideLines(data): string[]` — `data.sideText` split on newlines, trimmed, empty removed, max 4
  - `sideColumn(data, style, opts: { upper?: boolean; italic?: boolean; size?: number; color?: string; font?: FontKey }): string` — a `<table>` of the lines, `""` when none
  - `vRule(color: string, width = 1, pad = 18): string` — `<td>` gutter + 1px coloured cell + gutter
  - `nameLine(data, style, opts: { size: number; weight?: number; font?: FontKey; color?: string; tracking?: string; upper?: boolean }): string` — `<tr>`
  - `titleLine(text: string, style, opts: { upper?: boolean; tracking?: string; color?: string; size?: number; weight?: number }): string` — `<tr>`, `""` for empty text
  - `photoWithStatus(data, style, ctx, opts: { size?: number; ring?: string }): string` — photo (shape from style), optional ring (outer cell with `border:3px solid ring`), status dot GIF overlapped at bottom-right via a two-row table (dot in the row under the photo, right-aligned with negative-free spacing: `margin-top:-14px` is not allowed in Outlook, so the dot sits in a 16px row directly below the photo's bottom-right corner)
  - `iconColumn(data, style, ctx): string` — social icons stacked vertically
  - `band(text: string, right: string, style, opts: { bg: string; color: string }): string` — full-width footer `<tr>` with two cells
  - `card(inner: string, opts: { bg: string; pad?: string; border?: string; accentLeft?: { color: string; width: number } }): string`

- [ ] **Step 1: Write the failing test** — `lib/signature/designer/kit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "../defaults";
import { card, sideColumn, sideLines, vRule } from "./kit";

describe("kit", () => {
  it("splits side text into at most four clean lines", () => {
    expect(sideLines({ ...DEFAULT_DATA, sideText: " People \n\nIdeas\nProgress\nMore\nToo many " })).toEqual([
      "People", "Ideas", "Progress", "More",
    ]);
  });

  it("escapes side text and uppercases on request", () => {
    const html = sideColumn({ ...DEFAULT_DATA, sideText: "<b>x</b>" }, DEFAULT_STYLE, { upper: true });
    expect(html).toContain("&lt;B&gt;X&lt;/B&gt;");
    expect(html).not.toContain("<b>");
  });

  it("returns nothing for empty side text", () => {
    expect(sideColumn(DEFAULT_DATA, DEFAULT_STYLE, {})).toBe("");
  });

  it("paints filled cells for Outlook", () => {
    expect(card("x", { bg: "#1E1F22" })).toMatch(/bgcolor="#1E1F22"[^>]*background-color:#1E1F22/);
    expect(vRule("#DDDDDD")).toContain("background-color:#DDDDDD");
  });
});
```

(Uppercasing happens before escaping, so `&lt;` stays lowercase entity names — implement as `esc(upper ? line.toUpperCase() : line)` and adjust the expectation to `"&lt;B&gt;X&lt;/B&gt;"`, which is what `esc("<B>X</B>")` returns.)

- [ ] **Step 2: Run it** — FAIL.

- [ ] **Step 3: Write `kit.ts`** implementing the interfaces above with the primitives from `../html` and `../parts` (`table`, `spacer`, `gutter`, `textCell`, `esc`, `img`, `radiusFor`, `photoImg`, `socialRow`, `nameHtml`) and `statusDotPath`/`socialIconPath` from `../assets`. Every filled cell uses both `bgcolor="…"` and `background-color:…`.

- [ ] **Step 4: Review sheet** — `scripts/review-layouts.ts` writes `.review/layouts.html`: for every entry in `TEMPLATES`, the layout rendered with a rich sample (`sampleSignature("tpl-meridian", id)` data plus `sideText: "People\nIdeas\nProgress"`, `contactIcons: "muted"`), at 600px and at 360px (in a 360px-wide wrapper), on white, each captioned with id, tier and tags. `assetBase` = `http://localhost:3000`. Add `"review:layouts": "tsx scripts/review-layouts.ts"` and `/.review` to `.gitignore`. Screenshot it with the Playwright browser tools against the running dev server (open `file://` path or copy to `public/` is not allowed — serve it by opening the file directly in the browser tool).

- [ ] **Step 5: Verify and commit**

```bash
git add lib/signature/designer scripts/review-layouts.ts package.json .gitignore
git commit -m "Add the designer layout kit and a layout review sheet

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Layouts — Minimal Luxury, Modern Corporate, Creative Studio, Executive Premium

**Before starting:** load `taste-skill:taste-skill`. Look at the user's reference (concepts 1–4) described in the spec.

**Files:**
- Create: `lib/signature/designer/luxe.ts`, `corporate.ts`, `studio.ts`, `executive.ts`, `lib/signature/designer/index.ts`
- Modify: `lib/signature/templates.ts` (import `DESIGNER_RENDERERS`, `DESIGNER_TEMPLATES` from `./designer` and merge them into `RENDERERS` and `TEMPLATES`)

**Interfaces:**
- Produces: `DESIGNER_RENDERERS: Record<string, Renderer>`, `DESIGNER_TEMPLATES: TemplateMeta[]` (all `tier: "pro"`, `group: "designer"`).

- [ ] **Step 1: Reference renderer** — `lib/signature/designer/luxe.ts`:

```ts
import { gap, spacer, table } from "../html";
import { contactRows, ctaButton, footerRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { iconColumn, nameLine, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const luxeMeta: TemplateMeta = {
  id: "luxe",
  name: "Minimal Luxury",
  blurb: "Round portrait, fine rules and a serif name. Quiet and expensive-looking.",
  tier: "pro",
  group: "designer",
  tags: ["minimal", "classic"],
  supports: ["sideText"],
  styleHints: { photoShape: "circle", secondaryFont: "georgia", contactIcons: "ink", showLabels: false },
};

export const luxe: Renderer = (data, style, ctx) => {
  const rule = "#D9D6D0";
  const photo = photoImg(data, style);
  const side = sideColumn(data, style, { upper: true, size: 8, color: style.mutedColor });
  const media = table(
    (photo ? `<tr><td align="center">${photo}</td></tr>` : "") +
      (side ? spacer(22) + `<tr><td>${side}</td></tr>` : ""),
  );

  const details = table(
    nameLine(data, style, { size: style.fontSize + 12, weight: 400, font: style.secondaryFont }) +
      spacer(4) +
      titleLine(data.jobTitle, style, { upper: true, tracking: "0.22em", size: Math.max(9, style.fontSize - 3), color: style.textColor }) +
      titleLine(data.company, style, { size: style.fontSize, color: style.nameColor }) +
      spacer(gap(style) + 8) +
      contactRows(data, style, { ctx }),
  );

  const icons = iconColumn(data, style, ctx);
  const row =
    (media ? `<td valign="top">${media}</td>${vRule(rule)}` : "") +
    `<td valign="top">${details}</td>` +
    (icons ? `${vRule(rule, 1, 16)}<td valign="middle">${icons}</td>` : "");

  const cta = ctaButton(data, style);
  return table(
    `<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` +
      (cta ? spacer(gap(style) + 8) + `<tr><td>${cta}</td></tr>` : "") +
      footerRows(data, style),
  );
};
```

- [ ] **Step 2: Build the other three to these specs**

| Layout | Structure | Measurements / style |
|---|---|---|
| `corporate` Modern Corporate (`tags: ["classic","bold"]`, supports sideText) | `card` with `accentLeft` 5px accent; inside: square photo 96px · details (name 20px bold accent-dark `nameColor`, title in accent, company bold, a muted "Strategy / Design / …" line from `data.department`, contact rows with icons) · `vRule` · side column (italic, 11px) over the vertical icon row | photoShape `square`, contactIcons `muted`, showLabels false |
| `studio` Creative Studio (`["creative"]`, sideText) | left: italic Georgia side statement (first two side lines, 13px) above horizontal social row; centre: photo on a tinted circle (outer cell `bgcolor` = accent at 15% mixed with white, `border-radius:50%`, padding 8px); details (name 22px serif, spaced uppercase title, company); `vRule` in accent; right: uppercase side list (lines 3–4, else all) | circle photo, contactIcons `muted` |
| `executive` Executive Premium (`["dark","classic"]`, sideText) | `card` bg `#1E1F22`, 24px padding; local palette like `slate` (name `#FFFFFF` Georgia 22px, text `#D9DADC`, muted `#A3A6AB`); round photo 100px with social row under it (`iconStyle` forced to `light`); details; `vRule("#3A3C40")`; uppercase spaced side list + 24px rule | contactIcons `light` |

All four: CTA and footer rows appended like `luxe`; banners appended via `bannerImg` below the card when present.

- [ ] **Step 3: Register** — `designer/index.ts` exports `DESIGNER_RENDERERS = { luxe, corporate, studio, executive }` and `DESIGNER_TEMPLATES = [luxeMeta, …]`; `templates.ts` spreads them into `RENDERERS` and `TEMPLATES`.

- [ ] **Step 4: Review** — `npm run review:layouts`, screenshot, compare with the reference, apply the Taste checklist (spacing rhythm, type hierarchy, restraint, alignment), iterate.

- [ ] **Step 5: Verify and commit** — `npm test` (check-render now covers 12 layouts) `&& npx tsc --noEmit && npm run lint`.

```bash
git add lib/signature
git commit -m "Add the Minimal Luxury, Modern Corporate, Creative Studio and Executive Premium layouts

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Layouts — Scandinavian Minimal, Bold Modern, Tech Startup, Editorial

**Before starting:** load `taste-skill:taste-skill`.

**Files:** Create `nordic.ts`, `bold.ts`, `startup.ts`, `editorial.ts` in `lib/signature/designer/`; register in `designer/index.ts`.

| Layout | Structure | Measurements / style |
|---|---|---|
| `nordic` Scandinavian Minimal (`["minimal"]`, sideText) | `card` bg `#FFFFFF`, border `1px solid #E6E3DE`; row: square photo 110px · details (name 20px Georgia regular, spaced uppercase title 9px, company bold, contact rows) · `vRule("#E6E3DE")` · italic side list over horizontal icons; then `band(company upper, tagline upper, { bg: "#F1EEE9", color: "#6B6760" })` spanning the card | letter-spacing 0.2em in band, 9px |
| `bold` Bold Modern (`["bold"]`, sideText) | row: tall photo 110×150 (square) · details: first name and last name on two lines, 30px, weight 800, line-height 32px; `CEO / COMPANY` spaced uppercase 10px; contact rows · `vRule` · italic side statement 16px over a 24px rule and horizontal icons | contactIcons `ink` |
| `startup` Tech Startup (`["creative","minimal"]`, sideText, statusDot) | `photoWithStatus` with ring = accent at 25% tint and the status dot · details (name 20px bold `nameColor`, title, company bold, italic muted department line, contact rows) · `vRule` · tinted side card (`card` bg accent 8% tint, radius 10px, padding 12px, 12px text) over icons in circular style | iconStyle `circle`, statusDot default `static` via styleHints |
| `editorial` Editorial (`["classic","creative"]`, sideText) | `card` bg `#FAF7F2`, padding 22px; top: company spaced uppercase 10px; row: portrait photo 120×150 · details (name 22px Georgia, title, 40px rule, contact rows) · `vRule("#E4DED3")` · italic Georgia side text 14px over icons | photoShape `square` |

Review sheet, Taste checklist, verify, commit:

```bash
git add lib/signature
git commit -m "Add the Scandinavian Minimal, Bold Modern, Tech Startup and Editorial layouts

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Layouts — Personal Brand, Ultra Minimal, Monogram, Color Block

**Before starting:** load `taste-skill:taste-skill`.

| Layout | Structure | Measurements / style |
|---|---|---|
| `personal` Personal Brand (`["creative","bold"]`, sideText) | large square photo 130×160 · details (name 22px Georgia, `jobTitle` rendered with `|` separators as-is, company, contact rows, horizontal icons) · italic Georgia side statement 18px, lines stacked, rotated look faked by indenting each line 6px more than the last | contactIcons `ink` |
| `ultra` Ultra Minimal (`["minimal"]`, sideText) | small round photo 72px · details (name 18px Georgia, "Title, Company" 12px muted, 12px spacer, contact as two lines joined with `&nbsp;&nbsp;|&nbsp;&nbsp;` (phone | email, website | address), 12px spacer, 24px rule, icons) · `vRule` · uppercase side list 8px + 24px rule | no labels, no contact icons |
| `monogram` Monogram (`["classic","minimal"]`) | logo cell (logo at 88px width, else a 64px accent square with the company initials in white 24px bold) · 1px accent rule · details (name, title, company, contact rows, icons) | omits photo |
| `colorblock` Color Block (`["bold","creative"]`) | full-width header row `card` bg = accent, name 20px white bold + title in white at 85% (use `#FFFFFF` with `opacity` not allowed — use a pre-mixed hex computed from accent and white) · body row: photo 72px round · contact rows · icons | nameColor forced white in header; accent must pass 4.5:1 with white (guarded in Task 8) |

Review sheet (all 20 layouts), Taste checklist, verify, commit:

```bash
git add lib/signature
git commit -m "Add the Personal Brand, Ultra Minimal, Monogram and Color Block layouts

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Server-hosted uploads, marked as a paid feature

**Files:**
- Modify: `lib/storage/images.ts` (disk driver uses `UPLOAD_DIR`), `components/builder/ImageField.tsx`, `.env.example`, `README.md` (Image permanence section)
- Create: `app/u/[file]/route.ts`, `lib/storage/upload-dir.ts`, `lib/storage/upload-dir.test.ts`

**Interfaces:**
- Produces: `uploadDir(): string` (absolute; `process.env.UPLOAD_DIR` or `<cwd>/public/u`), `isPublicUploadDir(): boolean`, `safeUploadName(name: string): string | null` (accepts only `^[0-9a-f]{32}\.(png|jpg|gif)$`).

- [ ] **Step 1: Failing test** — `lib/storage/upload-dir.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { join } from "node:path";
import { isPublicUploadDir, safeUploadName, uploadDir } from "./upload-dir";

afterEach(() => vi.unstubAllEnvs());

describe("upload dir", () => {
  it("defaults to public/u", () => {
    vi.stubEnv("UPLOAD_DIR", "");
    expect(uploadDir()).toBe(join(process.cwd(), "public", "u"));
    expect(isPublicUploadDir()).toBe(true);
  });
  it("honours UPLOAD_DIR", () => {
    vi.stubEnv("UPLOAD_DIR", "/srv/uploads");
    expect(uploadDir()).toBe("/srv/uploads");
    expect(isPublicUploadDir()).toBe(false);
  });
  it("only accepts content-addressed names", () => {
    expect(safeUploadName("0123456789abcdef0123456789abcdef.png")).toBe("0123456789abcdef0123456789abcdef.png");
    expect(safeUploadName("../etc/passwd")).toBeNull();
    expect(safeUploadName("0123456789abcdef0123456789abcdef.svg")).toBeNull();
  });
});
```

- [ ] **Step 2: Implement** `upload-dir.ts` (use `path.resolve` for `UPLOAD_DIR`, compare against `resolve(cwd, "public")` for `isPublicUploadDir`). Make the disk driver in `images.ts` write to `uploadDir()` and keep URLs at `/u/<name>`. `app/u/[file]/route.ts`: `GET` awaits `params`, validates with `safeUploadName`, reads from `uploadDir()` (404 when invalid or missing), responds with the right `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`. When `UPLOAD_DIR` is inside `public/`, the static file wins and this route is never hit — that is fine.

- [ ] **Step 3: Editor** — `ImageField`: input placeholder "Paste an image link (hosted anywhere)"; the Upload button gets a small `Pro` pill after its label and `title="Upload and host on TheMailSignature — Pro and Business"`. No blocking.

- [ ] **Step 4: Verify** — unit tests; run the dev server with `UPLOAD_DIR=$TEMP/tms-uploads`, upload through `curl` is session-gated, so instead write a file named with a valid hash into that directory and `curl -I /u/<name>` → 200 with the immutable header; `curl -I /u/../x` → 404.

```bash
git add lib/storage app/u components/builder/ImageField.tsx .env.example README.md
git commit -m "Serve uploads from a configurable server directory and badge upload as Pro

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Designs for every industry, claims and copy

**Before starting:** load `taste-skill:taste-skill` for palette and pairing choices.

**Files:**
- Create: `lib/marketing/designs.ts`, `lib/marketing/designs.test.ts`
- Modify: `lib/marketing/claims.ts`, `lib/pricing.ts`, `lib/marketing/faqs.ts`, `lib/marketing/home.ts`, `lib/marketing/content-index.ts`, `scripts/check-marketing.ts`, `lib/marketing/samples.ts` (accept `Partial` overrides)

**Interfaces:**
- Produces: `type Design = { id; industry; layoutId; name; tier: "free" | "pro"; animated: boolean; style: Partial<SignatureStyle>; data: Partial<SignatureData> }`; `designsFor(industry: string): Design[]`; `ALL_DESIGNS: Design[]`; `DESIGN_BY_ID: Record<string, Design>`; `designSignature(design: Design): { data: SignatureData; style: SignatureStyle }` (sample person for the industry + design overrides).

- [ ] **Step 1: Failing test** — `lib/marketing/designs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { FREE_TEMPLATE_IDS, TEMPLATE_BY_ID } from "@/lib/signature/templates";
import { renderSignature } from "@/lib/signature/render";
import { INDUSTRIES } from "./industries";
import { ALL_DESIGNS, DESIGN_BY_ID, designSignature, designsFor } from "./designs";

describe("designs", () => {
  it("gives every industry at least six designs with exactly one free", () => {
    for (const industry of INDUSTRIES) {
      const designs = designsFor(industry.slug);
      expect(designs.length).toBeGreaterThanOrEqual(6);
      const free = designs.filter((d) => d.tier === "free");
      expect(free).toHaveLength(1);
      expect(FREE_TEMPLATE_IDS).toContain(free[0].layoutId);
      expect(designs[0].tier).toBe("free");
      expect(new Set(designs.map((d) => d.layoutId)).size).toBe(designs.length);
      expect(designs.some((d) => d.animated)).toBe(true);
    }
  });

  it("uses real layouts, unique ids and renders every design", () => {
    expect(Object.keys(DESIGN_BY_ID)).toHaveLength(ALL_DESIGNS.length);
    for (const design of ALL_DESIGNS) {
      expect(TEMPLATE_BY_ID[design.layoutId]).toBeDefined();
      const { data, style } = designSignature(design);
      expect(renderSignature(data, style, { assetBase: "" })).toContain(data.firstName);
    }
  });

  it("marks animated designs honestly", () => {
    for (const design of ALL_DESIGNS) {
      const { style } = designSignature(design);
      expect(design.animated).toBe(style.iconAnimation !== "none" || style.statusDot === "blink");
      if (design.tier === "free") expect(design.animated).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Implement `designs.ts`**

```ts
type IndustryLook = {
  palette: { accent: string; name: string; text: string; muted: string };
  fonts: { body: FontKey; display: FontKey };
  sideText: string;      // three lines joined by \n
  tagline: string;
  layouts: [free: FreeLayout, ...pro: string[]];   // 6+ ids, first is free
  animate: { layoutId: string; iconAnimation?: IconAnimation; statusDot?: StatusDot };
};
const LOOKS: Record<string, IndustryLook> = { /* 21 entries */ };
```

`designsFor` maps `layouts` to `Design`s: `style` = `{ accent, linkColor: accent, nameColor, textColor, mutedColor, font: body, secondaryFont: display, ...TEMPLATE_BY_ID[layout].styleHints }`, plus the `animate` override on its layout; `data` = `{ sideText, tagline }`; `name` = the layout's name; `animated` derived as in the test.

Write the 21 looks with the Taste skill: palettes suited to the profession (e.g. lawyers: ink `#1B1F24` with oxblood accent `#7A2E2E`; healthcare: teal `#0E6B78`; creative agencies: coral `#C2452D`), serif display fonts for traditional fields (Georgia, Palatino, Garamond), sans for tech and sales (Helvetica, Trebuchet). Side-text lines are three short, profession-appropriate words or phrases (no claims, no numbers). Each industry uses 6 distinct layouts, and across all industries each of the 12 designer layouts appears at least 6 times.

- [ ] **Step 3: Guards** — in `scripts/check-marketing.ts` add: for each design, contrast ≥ 4.5 for `nameColor`, `textColor`, `mutedColor` and `accent` on the layout's surface (`executive` → `#1E1F22`, `editorial` → `#FAF7F2`, `slate` → `#141619`, `colorblock` accent vs `#FFFFFF`, others `#FFFFFF`; dark layouts force their own text colours, so for them only check `accent`).

- [ ] **Step 4: Claims and copy**
  - `claims.ts`: replace `free-four-templates` with `free-templates` — "4 classic templates plus a designed template for your industry" (phase 4); add `designer-layouts` — "12 designer layouts and 6 designs for every industry" (phase 1, shipped by this work); `animated-elements` — "Animated social icons and status badges" (phase 4); `pro-image-hosting` — "Upload images and animations and we host them for you" (phase 4); `external-images` — "Use images from your own links" (phase 1).
  - `pricing.ts`: Free features cite `free-templates`, `external-images`; Pro cites `all-templates`, `designer-layouts`, `animated-elements`, `pro-image-hosting`; comparison rows: Templates `"4 + 1 per industry" / "All 20 layouts" / "All 20 layouts"`, new rows "Industry designs" (`"1 per industry"`, `"All 126"`, `"All 126"`), "Animated icons and badges" (false/true/true), "Host uploads on TheMailSignature" (false/true/true), "Use images from your own links" (true/true/true). Rename the `all-templates` label to "Every layout and design".
  - Update `FAQS.home` "Is TheMailSignature free?" and `FAQS.pricing` answers to match; add a pricing FAQ "Do animated signatures work in Outlook?" — "Animated icons play in Gmail, Apple Mail, Outlook on the web and the new Outlook. Classic Outlook for Windows may show only the first frame, which we design to look complete on its own." (cite `animated-elements`).
  - `HOME.features`: add or adjust one feature to cite `designer-layouts` and `animated-elements`.
  - Register `designs` in `content-index.ts`.

- [ ] **Step 5: Verify and commit** — `npx vitest run lib/marketing && npm test && npx tsc --noEmit && npm run lint`.

```bash
git add lib/marketing lib/pricing.ts scripts/check-marketing.ts
git commit -m "Add six designs for every industry and update plan copy

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Editor — designs, grouped picker and new controls

**Files:**
- Modify: `components/builder/initial-state.ts` (+ test), `components/builder/Builder.tsx`, `components/builder/TemplateGrid.tsx`, `components/builder/panels.tsx`, `app/editor/page.tsx`

**Interfaces:**
- Consumes: `DESIGN_BY_ID`, `designSignature` shape (only `style` and `data` overrides are applied).
- Produces: `withDesign(saved: BuilderState, designId: string | undefined): BuilderState` — applies the design's layout, style and `data.sideText`/`data.tagline` only when the saved draft's values are empty (never overwrites personal details); `Builder({ initialTemplate?, initialDesign? })`.

- [ ] **Step 1: Failing tests** — add to `components/builder/initial-state.test.ts`:

```ts
import { withDesign } from "./initial-state";
import { ALL_DESIGNS } from "@/lib/marketing/designs";

describe("withDesign", () => {
  const design = ALL_DESIGNS.find((d) => d.layoutId === "luxe")!;

  it("ignores unknown ids", () => {
    expect(withDesign(saved, "nope")).toBe(saved);
  });

  it("applies layout and styling but keeps personal details", () => {
    const next = withDesign({ ...saved, data: { ...saved.data, firstName: "Kim" } }, design.id);
    expect(next.style.templateId).toBe("luxe");
    expect(next.style.accent).toBe(design.style.accent);
    expect(next.data.firstName).toBe("Kim");
  });

  it("fills side text only when empty", () => {
    const next = withDesign({ ...saved, data: { ...saved.data, sideText: "Mine" } }, design.id);
    expect(next.data.sideText).toBe("Mine");
  });
});
```

- [ ] **Step 2: Implement** `withDesign`; `app/editor/page.tsx` reads `design` like `template` and passes `initialDesign` (also into the login `next` URL); `Builder` applies `withDesign` after `withTemplate`.

- [ ] **Step 3: Picker and controls** — `TemplateGrid` shows two groups, "Classic" and "Designer", each card with a `Pro` pill when `tier === "pro"`. `panels.tsx` style panel: "Animation" `Segmented` (None / Pulse / Bounce / Wiggle) with a Pro pill; "Status dot" `Segmented` (None / Static / Blink) plus colour swatches from `STATUS_COLORS`; "Contact icons" `Segmented` (Letters / Ink / Muted / Light) mapping Letters → `"none"`; "Accent font" `Select` over `FONT_LABELS` bound to `secondaryFont`. Details panel: "Side text" `TextArea` with hint "Up to four short lines, shown by layouts that support it."

- [ ] **Step 4: Verify** — tests, tsc, lint, build; open `/editor?design=<id>` in the running dev server once Supabase is restored (otherwise verify via the unit tests and the review sheet).

```bash
git add components/builder app/editor
git commit -m "Open designs in the editor and add animation, status and side-text controls

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: The templates page

**Before starting:** load `taste-skill:taste-skill`.

**Files:**
- Create: `components/marketing/TemplateBrowser.tsx`, `components/marketing/TemplateBrowser.test.tsx`, `lib/marketing/template-filter.ts`, `lib/marketing/template-filter.test.ts`, `components/marketing/DesignCard.tsx`
- Modify: `app/(site)/templates/page.tsx`, `lib/marketing/pages.ts` (templates description mentions industry designs)

**Interfaces:**
- Produces:
  - `type BrowserItem = { id: string; industry: string; industryName: string; layoutId: string; name: string; tier: "free" | "pro"; animated: boolean; tags: StyleTag[]; html: string }`
  - `type Filters = { industry: string | "all"; style: StyleTag | "all"; plan: "all" | "free" | "pro" }`
  - `parseFilters(params: URLSearchParams): Filters`, `filtersToQuery(f: Filters): string`, `applyFilters(items: BrowserItem[], f: Filters): BrowserItem[]`
  - `TemplateBrowser({ items: BrowserItem[], industries: Array<{ slug: string; name: string }> })` — client; reads/writes filters with `useSearchParams` + `router.replace` (scroll: false); shows 12 per group with "Show more".
  - `DesignCard({ item: BrowserItem })` — preview (`dangerouslySetInnerHTML` of server-rendered, engine-escaped HTML), name, industry, Free/Pro and Animated badges, link `/editor?design=<id>`.

- [ ] **Step 1: Failing tests** — `template-filter.test.ts` covers: default filters from empty params; unknown values fall back to `all`; round trip `parseFilters(new URLSearchParams(filtersToQuery(f)))` equals `f`; `applyFilters` by industry, style tag, plan, and combined. `TemplateBrowser.test.tsx` (mock `next/navigation` with `vi.mock`) covers: renders 12 items of a 30-item group then 24 after "Show more"; choosing "Free" leaves only free cards; each card links to `/editor?design=<id>`.

- [ ] **Step 2: Implement** the filter module, the card, the browser. The page (server component) builds `items` from `ALL_DESIGNS` using `designSignature` + `renderSignature(…, { assetBase: "" })`, and renders: hero; "Featured layouts" row (one design per designer layout, 12 cards, horizontally scrollable on mobile); a `Suspense`-wrapped `TemplateBrowser` (required because it uses `useSearchParams`); the "Classic templates" grid (existing `TemplateCard`s); CTA.

- [ ] **Step 3: Verify** — tests; build; `check:routes`; Lighthouse on `/templates` (SEO, a11y, best practices = 1); screenshot at 1440 and 390 and iterate with the Taste checklist. Page weight: the HTML for 126 previews must stay under 1.5 MB (`curl -s localhost:3000/templates | wc -c`); if over, render only the first 12 of each group on the server and fetch the rest from a static JSON route.

```bash
git add components/marketing lib/marketing "app/(site)/templates"
git commit -m "Rebuild the templates page with filters and industry designs

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Industry pages and homepage use the designs

**Files:** Modify `app/(site)/industries/[slug]/page.tsx`, `lib/marketing/home.ts`, `app/(site)/page.tsx`.

- [ ] Industry page: hero preview uses the industry's Free design (`designSignature(designsFor(slug)[0])`); new section "Six designs for {audience}" after "What to include" with `DesignCard`s for all its designs (Free first); hero button links to `/editor?design=<free id>`.
- [ ] Homepage template strip: four designs from different industries and layouts (at least one animated), linking to `/templates`.
- [ ] Verify (tests, build, `check:routes`, Lighthouse on `/` and two industry pages) and commit:

```bash
git add "app/(site)" lib/marketing
git commit -m "Show each industry's six designs on its page and the homepage

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: AI portraits (runs when a key is available)

**Files:** Create `scripts/gen-portraits.mjs`; modify `lib/marketing/sample-people.json` (optional `photo`), `lib/marketing/samples.ts`, `package.json` (`portraits`).

- [ ] `samples.ts`: `photoUrl` = `person.photo ?? /samples/<key>-avatar.png`.
- [ ] `gen-portraits.mjs`: requires `OPENAI_API_KEY` (exit with a clear message otherwise). For each sample person without `photo`, requests one 1024×1024 image from `POST https://api.openai.com/v1/images/generations` (model `gpt-image-1`) with a prompt built from a fixed template: "Professional corporate headshot of a fictional {age range} {gender presentation} {profession}, soft studio light, neutral warm grey background, shoulders up, natural expression, photorealistic, no text, no logos" — gender presentation and age range stored per person in the JSON (`portrait: { presentation, age }`), chosen for variety. Resizes to 240×240 JPEG (quality 82) with sharp into `public/samples/<key>-photo.jpg` and writes `photo` back to the JSON.
- [ ] Add a line under every preview section: "Sample people and photos are illustrative." (templates page, industry designs section, homepage strip).
- [ ] Run only after the user supplies the key; review every generated image before committing.

```bash
git add scripts/gen-portraits.mjs lib/marketing public/samples package.json "app/(site)"
git commit -m "Add illustrative AI portraits for sample signatures

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: Test account and editor screenshots (blocked on Supabase)

- [ ] Supabase project reachable (`nslookup <project>.supabase.co` resolves). Then `node scripts/create-test-account.mjs thekarankathuria@gmail.com`; the user confirms the email.
- [ ] Run Phase 2 Task 14 (`docs/superpowers/plans/2026-09-16-phase-2-marketing-site.md`) exactly as written.
- [ ] Commit `scripts/create-test-account.mjs` with the screenshots commit.

---

### Task 14: Final verification and documentation

- [ ] `npm test && npx tsc --noEmit && npm run lint && npx next build`.
- [ ] `npm run check:routes` against `next start`; Lighthouse (SEO, a11y, best practices) = 1 on `/`, `/templates`, `/pricing`, two industry pages.
- [ ] Render every layout into Gmail-like conditions: paste `renderDocument` output of three layouts into the review sheet with `<style>` stripped (already true) and confirm nothing depends on classes.
- [ ] README: layouts, designs, animated assets (`npm run anim`, `npm run contact-icons`), `UPLOAD_DIR`, portraits. Update the progress memory.
- [ ] Commit: "Document the template library".

## Exit criteria

- 20 layouts (8 classic, 12 designer) pass `check-render.ts`; 126+ designs pass the design guards; every industry has exactly one Free design on a Free layout.
- `/templates` filters by industry, style and plan with URL state; Lighthouse 100s; page HTML under 1.5 MB.
- Animated icons and blinking status dots render in Pro designs; frame 1 of every GIF is complete.
- Uploads served from `UPLOAD_DIR` at `/u/<hash>`; external image links available in the editor for everyone.
