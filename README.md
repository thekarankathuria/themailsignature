# Mail Signature

A free email signature generator. Fill in your details, pick a template, copy a
signature that survives Outlook.

## Why it is built this way

Outlook for Windows renders mail through Word. Word ignores flexbox, grid,
external stylesheets, `<style>` blocks and classes. So every template here
emits **nested tables with 100% inline styles** and nothing else. That
constraint drives the whole architecture:

- `lib/signature/html.ts` holds the table, spacer and anchor primitives, plus
  the escaping and URL sanitising. Nothing reaches output unescaped, and only
  `http(s):`, `mailto:` and `tel:` survive as links.
- `lib/signature/parts.ts` composes those primitives into reusable blocks
  (name, role, contact rows, social row, button, footer).
- `lib/signature/templates.ts` arranges the blocks eight different ways.
  Templates are data, not components, so adding one is a single function.
- `lib/signature/render.ts` is the only entry point the UI calls.

Social icons cannot be inline SVG or an icon font in mail, so they are
rasterised to PNG ahead of time from `simple-icons` by
`scripts/gen-social-icons.mjs`: 22 networks in 6 styles.

## Image permanence

A signature is markup pointing at an image on a server. Move that image and
every email already sent goes blank. Uploads are therefore stored
**content-addressed**: the filename is a hash of the bytes, so an address can
never be reused for different content and never needs to move.

`app/api/upload/route.ts` writes to `public/u` on the local filesystem. Moving
to object storage means changing the write call and setting
`NEXT_PUBLIC_ASSET_BASE`. **Once that base is live, it must never change.**

Uploads are also normalised: WebP and AVIF are converted to PNG, because
Outlook cannot display either. GIFs pass through untouched so animation
survives.


## The marketing site

Everything under `app/(site)/` is a clone of customesignature.com, re-skinned to a flat
Gmail-red accent on a pure-white surface and rebranded **Mail Signature**. 34 pages: the
homepage, About, Demo, Affiliate, Contact, Support, Tutorials, Browse 1000 Industries, four
legal pages, and 21 `/solution/<slug>` pages served from one template.

It is a **CSS-verbatim** clone, not a re-implementation. The original Webflow stylesheet
ships as `app/ces.css` and every component emits the original class names, because that is
the only way to match a 155 KB Webflow stylesheet exactly. Two consequences:

- **Class names are load-bearing.** Renaming one silently breaks a layout rule.
- **`app/ces.css` is generated. Never hand-edit it.** Hand-written overrides live in
  `app/ces-extra.css`, which loads after it.

The route group matters too: `app/(site)/layout.tsx` imports `ces.css`, while
`app/generator/layout.tsx` imports `globals.css`. That keeps Tailwind's preflight away from
the cloned CSS, which would otherwise reset half of it.

### Regenerating the site's CSS and assets

```bash
node scripts/download-assets.mjs   # every page's assets -> public/ces, writes asset-map.json
node scripts/download-bcdn.mjs     # the b-cdn.net videos (must run AFTER download-assets)
node scripts/localize-css.mjs      # raw/site.css -> app/ces.css, urls rewritten to /ces
node scripts/recolor-css.mjs       # accent ramp -> flat red, flattens gradients and glows
node scripts/rebrand-lottie.mjs    # rewrites the brand text inside the Lottie JSONs
node scripts/extract-solutions.mjs # rebuilds lib/ces/solutions.ts from the 21 saved pages
```

`download-assets.mjs` rebuilds `asset-map.json` from scratch, so re-running it drops the
b-cdn video entries — always run `download-bcdn.mjs` after it.

`scripts/prune-assets.mjs` reports (or with `--apply`, deletes) files under `public/ces`
that nothing references.

### Working with a section

`scripts/extract-section.mjs <selector>` and `scripts/extract-any.mjs <page> <selector>`
pull a section's exact HTML subtree plus every CSS rule that applies to it into
`docs/research/extract/`. That is how every component here was specified, and how to spec
a new one. `docs/research/BUILDER_BRIEF.md` holds the rules for porting one.

### Known gaps

`docs/research/BRANDED-ASSETS.md` lists the artwork that still carries the original brand:
30 raster images and 9 videos have the old name baked into the pixels, and several Loom
embeds still serve the original company's recordings. Lottie animations were rebranded
programmatically because their text is JSON, not pixels.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build
npm test        # render safety checks: injection and mail-client subset
npm run icons   # regenerate the social icon PNGs
```

`npm test` renders all eight templates against a hostile payload and asserts
that no script element, event handler, or dangerous URL scheme survives, and
that the output stays inside the subset Word understands. Run it after any
change to `lib/signature`.

## Layout

```
app/
  page.tsx              marketing page
  generator/page.tsx    the builder
  api/upload/route.ts   content-addressed image hosting
components/
  builder/              panels, preview, export, template grid
  site/                 nav, footer, theme toggle
lib/
  signature/            the render engine (no React, no DOM)
  clipboard.ts          rich-HTML clipboard write with a legacy fallback
scripts/
  gen-social-icons.mjs  simple-icons to PNG
  check-render.ts       the test above
```

## Notes

- Copying puts *rendered* HTML on the clipboard as `text/html`, with plain text
  as the fallback flavour. Pasting source text into Gmail shows the recipient
  markup, which is the most common way these tools get this wrong.
- `simple-icons` is pinned to v13 because LinkedIn and Slack were removed from
  later releases over trademark policy.
- The builder keeps everything in `localStorage`. There is no account system
  and no server-side storage of user details.
