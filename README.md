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

Where the bytes land is `lib/storage/images.ts`, not the route, because that is
a deployment concern:

- **`SUPABASE_STORAGE_BUCKET` set** — the durable driver. Objects go to that
  Supabase Storage bucket and resolve at
  `https://<project>.supabase.co/storage/v1/object/public/<bucket>/<hash>.<ext>`.
  The bucket is public-read (mail clients fetch with no credentials) and grants
  INSERT to `authenticated` only. There is deliberately no UPDATE or DELETE
  policy: a content-addressed object is immutable by construction.
- **unset** — the local-disk fallback, writing to `public/u`. Fine for local
  development, **fatal on any host with an ephemeral filesystem** (Vercel,
  containers), where a redeploy wipes the disk and every signature already sent
  goes blank.

Because a duplicate upload is by definition the same bytes, "this object already
exists" is treated as success rather than an error.

**Whichever base is live in production must never change.**

Uploads are also normalised: WebP and AVIF are converted to PNG, because
Outlook cannot display either. GIFs pass through untouched so animation
survives.


## The marketing site

Everything under `app/(site)/` is a clone of customesignature.com, re-skinned to a flat
Gmail-red accent on a pure-white surface and rebranded **Mail Signature**. 33 pages: the
homepage, About, Demo, Contact, Support, Tutorials, Browse 1000 Industries, four legal
pages, and 21 `/solution/<slug>` pages served from one template.

The affiliate page was removed: its signup CTAs pointed at the cloned company's own
Rewardful account, so every would-be affiliate was being enrolled in *their* programme.
Restoring it means adding a real affiliate provider first.

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

## Running it locally

The generator is behind a Supabase session, so the app needs credentials before
`/generator` will load. Without them `proxy.ts` throws and every matched route
returns a blank 500.

```bash
cp .env.example .env.local     # then fill in the two Supabase values
npm install
npm run dev                    # http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` come from the
Supabase dashboard under **Project Settings -> API Keys**. The *publishable*
key (`sb_publishable_...`) is the one that belongs here; it is designed to sit
in a browser bundle. The `sb_secret_...` key must never appear in a
`NEXT_PUBLIC_` variable.

Two things must line up in the Supabase project itself, or signup completes but
the confirmation link goes nowhere:

- **Site URL** set to `http://localhost:3000`
- **Redirect URLs** containing `http://localhost:3000/**`, so the link in the
  confirmation mail can return to `/auth/callback`

Signups require email confirmation. For a login that works immediately, create
a user under **Authentication -> Users -> Add user** with *Auto confirm user*
ticked, rather than turning confirmation off for the whole project.

`lib/env.ts` is the only place these variables are read. It validates at runtime
and throws naming the missing variable — the call sites previously used a `!`
assertion, which is erased at compile time and let `undefined` reach Supabase as
an unreadable stack trace.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build
npm test        # render safety, open-redirect guard, rate limiter, env guard
npm run icons   # regenerate the social icon PNGs
```

`npm test` runs three suites:

- `check-render.ts` renders all eight templates against a hostile payload and
  asserts that no script element, event handler, or dangerous URL scheme
  survives, and that the output stays inside the subset Word understands. Run
  it after any change to `lib/signature`.
- `check-safe-next.ts` guards `safeNext()` against the open-redirect class where
  the URL parser strips tab/LF/CR and re-resolves a path-looking value to
  another origin.
- `check-hardening.ts` covers the rate limiter's boundary (it must refuse
  *after* the allowance, not at it), window expiry, key scoping, and the env
  guard's error message.

## Layout

```
app/
  page.tsx              marketing page
  generator/page.tsx    the builder
  api/upload/route.ts   content-addressed image hosting
components/
  builder/              panels, preview, export, template grid
  site/                 wordmark, theme toggle
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
- The builder keeps its form state in `localStorage`; signature details are
  never stored server-side. Accounts exist only to gate `/generator` and
  `/api/upload` — Supabase holds the credential, and nothing else.
- Public POST routes are rate limited in `lib/rate-limit.ts`: 5 contact messages
  and 20 uploads per IP per ten minutes. The counter lives in one process's
  memory, so it is per-instance and resets on restart. More than one instance
  means moving it to a shared store behind the same `rateLimit()` signature.
- A validated contact submission is never dropped. With `RESEND_API_KEY` set it
  goes to Resend; otherwise `lib/contact/delivery.ts` appends it to
  `.contact-submissions.log` and the route reports a real failure if even that
  does not work.
- `next.config.ts` sets nosniff, a referrer policy, `X-Frame-Options: DENY`, a
  permissions policy and HSTS. It deliberately sets **no** Content-Security-Policy:
  the cloned Webflow CSS leans on inline styles and third-party embeds, so a
  strict policy would break layout before it protected anything. Adding one
  means inventorying those origins and running it report-only first.
