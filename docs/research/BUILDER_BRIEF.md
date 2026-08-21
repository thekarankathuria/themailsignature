# Builder brief — customesignature.com clone

You are porting one section of a Webflow site into this Next.js 16 App Router project as a
pixel-exact React component. The original stylesheet ships verbatim as `app/ces.css`, so you
do **not** write CSS — you reproduce the original DOM and its class names, and the stylesheet
does the rest.

## Non-negotiable rules

1. **Emit the same DOM as the original.** Same tags, same nesting, same `class` values, same
   order. Your extract file contains the exact HTML subtree — follow it element for element.
   Do not "simplify", do not collapse wrappers, do not swap a `div` for a `section`.
   Webflow's CSS is class-driven and deeply nested; one missing wrapper breaks the layout.
2. **`class` becomes `className`.** `for` becomes `htmlFor`. Inline `style="a:b;c:d"` becomes a
   `style={{ a: "b", c: "d" }}` object. Self-close void elements (`<img />`, `<br />`).
3. **Assets.** Every `https://cdn.prod.website-files.com/...` or `https://d3e54v103j8qbb.cloudfront.net/...`
   URL must be replaced with its local path. The mapping is `docs/research/raw/asset-map.json`
   (original URL → `/ces/...`). Read that file and translate every `src`, `srcset`, `poster`,
   `data-src` and inline `background-image`. Never leave a remote CDN URL in the output.
   Use plain `<img>`, not `next/image` — the original sizing rules depend on the raw element.
4. **Drop Webflow runtime plumbing** that has no meaning in React: `data-w-id`, `data-wf-*`,
   `data-ix2-*`, `w-node-*` classes **stay** (they carry grid-placement CSS), but
   `data-w-id`/`data-wf-*` attributes should be removed. Keep every other class.
5. **Keep the text verbatim.** Every heading, paragraph, label and `alt` exactly as the original,
   including the emoji, the typos and the odd spacing. Do not rewrite copy.
6. **Interactivity.** If your section has behaviour, add `"use client"` and implement it in React.
   `docs/research/BEHAVIORS.md` documents every behaviour with its exact timings and triggers.
   Webflow IX2 is not available — reimplement with React state, `IntersectionObserver`, or the
   `motion` package (already a dependency). Never add a new dependency without checking
   `package.json` first.
7. **Lottie.** Files are in `public/ces/lottie/`. Use `lottie-web` — it is NOT yet installed, so
   if your section needs it, install it with `npm i lottie-web` before using it, and render into
   a `useRef` div inside a `useEffect`.
8. **Verify.** `npx tsc --noEmit` must pass before you finish. Do not run `npm run build` (other
   agents are working in the same tree concurrently and it would race).
9. **Touch only your own file.** Do not edit `app/ces.css`, `app/layout.tsx`, `app/(site)/page.tsx`
   or any other agent's component. If you need a shared helper, inline it in your own file.

## Export shape

```tsx
export function CesWhatever() {
  return ( /* the section's root element, exactly as in the extract */ );
}
```

Named export, matching the filename. No default export. No props unless your section is a
template that another page reuses.

---

## Theme overrides (applied AFTER the clone — these win over the original)

The site has been re-skinned. When you port a section, keep the original DOM and class
names exactly as rule 1 says, but apply these four substitutions to any literal value you
carry across from the extract:

1. **Brand name.** The original says "Custom Esignature" / "Customesignature" /
   "CustomEsignature". Everywhere it appears in TEXT, write **Mail Signature**.
   `customesignature.com` becomes `mailsignature.com` (including inside demo email
   addresses like `ev@customesignature.com` → `ev@mailsignature.com`).
   `app.customesignature.com` → `app.mailsignature.com`.
   For the logo, import `CesWordmark` from `@/components/ces/CesWordmark` instead of the
   original's logo `<img>` or inline SVG letterform paths.
   Leave the name alone inside `alt` text describing third-party brands (Webflow, Cisco…).

2. **One flat accent colour: `#EA4335`.** No gradients anywhere. If the extract has a
   `linear-gradient(...)` or an SVG `<linearGradient>` whose stops are the original's blues
   (`#26B7FF`, `#1D4AFE`, `#2D62FF`, `#2176FE`, `#4D7FFF`, `#0CF`), emit a flat `#EA4335`
   instead — for SVG that means every `stopColor` in that gradient becomes `#EA4335`.

3. **No glows, no coloured shadows.** Drop any `box-shadow` or `filter: drop-shadow(...)`
   that carries an accent tint. Neutral structural shadows on cards may stay.

4. **Pure white surface.** The page background is `#fff` everywhere, including the sections
   the original rendered on near-black. `app/ces-extra.css` already forces this and flips
   the text in `.background-color-alternate` to dark — you do not need to add colour rules.
   But DO drop decorative background layers from your markup if the extract has them:
   blurred gradient blobs, full-bleed background-image washes, dotted-grid overlays.

`app/ces.css` has already been recoloured by `scripts/recolor-css.mjs`, so class-driven
colour is handled for you. These rules only cover values you would otherwise hard-code
into your component.

Do NOT edit `app/ces.css`, `app/ces-extra.css` or `scripts/recolor-css.mjs`.
