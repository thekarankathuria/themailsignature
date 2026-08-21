# customesignature.com — clone topology

Source: Webflow site. Stylesheet `esignature-37fa6f.webflow.shared.57eae6438.min.css`
(155 KB) captured verbatim to `app/ces.css` with every `url()` rewritten to `/ces/...`.
166 assets downloaded to `public/ces/{img,fonts,lottie,video}`.

Because the clone must be pixel-exact, we keep the original Webflow class names and ship
the original stylesheet rather than re-deriving it in Tailwind. Each React component emits
the same DOM the live site emits.

## Fonts
- **Switzer** — self-hosted OTF, weights 400/500/600/700 (`/ces/fonts/*.otf`), `@font-face`
  already present in `app/ces.css`. Primary display + body face.
- **Inter** and **Urbanist** — Google Fonts, weights 300–700, loaded via `<link>` in the
  site layout (the original loads them through `WebFont.load`).

## Breakpoints (Webflow defaults)
`991px` (tablet) · `767px` (mobile landscape) · `479px` (mobile portrait)

## Homepage sections, in DOM order

| # | Class | Height @1440 | Component | Interaction model |
|---|-------|--------------|-----------|-------------------|
| 0 | `.nav_fixed` | 104 | `CesNav` | fixed overlay; `Solutions` mega-dropdown on hover/click |
| 1 | `.section_hero` | 876 | `CesHero` | static + auto-scrolling signature-card marquee |
| 2 | `.client-section` | 195 | `CesClients` | CSS marquee of brand logos |
| 3 | `.supercharge-your-emails` | 708 | `CesNumbers` | static stat cards with embedded mock UI |
| 4 | `.top_user_examples_evan` | 986 | `CesTopUsers` | static grid, Lottie logos |
| 5 | `.how-it-work` | 741 | `CesHowItWorks` | static 3-up cards |
| 6 | `.email-replies` | 984 | `CesEmailReplies` | static before/after email compare |
| 7 | `.deliverability` | 1308 | `CesDeliverability` | 6 cards + custom `<video>` player |
| 8 | `.interactive_sections_new` | 758 | `CesInteractive` | dark section, hover-driven signature card |
| 9 | `.our-platform` | 518 | `CesOurPlatform` | **slick carousel + tab pills, click-driven** |
| 10 | `.features` | 804 | `CesFeatures` | static 3+2 card grid |
| 11 | `.integrations` | 1098 | `CesIntegrations` | orbiting app icons |
| 12 | `.faq` | 569 | `CesFaq` | accordion, click-driven |
| 13 | `.cta_section` | 690 | `CesCta` | static |
| 14 | `.footer` | 467 | `CesFooter` | static |
| — | `#proofWidget` | fixed | `CesProofWidget` | timed social-proof toast, bottom-left |

Sections 8–14 live inside `.background-color-alternate` (the dark half of the page).

## Site pages (35 in sitemap)
`/` · `/about` · `/affiliate` · `/browse-1000-industries` · `/contact-us` · `/cookies-policy` ·
`/demo` · `/design-concepts` · `/privacypolicy` · `/support` · `/terms-of-use` · `/test-2` ·
`/tutorials` · `/user-data-deletion` · plus 21 `/solution/<slug>` pages that share one template.

Raw HTML for every page is saved under `docs/research/raw/pages/`.
