# Behaviour bible — customesignature.com

Extracted from the live page's inline scripts (`docs/research/raw/js/`) and from the
Webflow component attributes in `docs/research/raw/home.html`.

## 1. Social-proof toast (`#proofWidget`) — timed
Source: `docs/research/raw/js/inline-11.js` (verbatim).
- Fixed bottom-left card, `backdrop-filter: blur(8px)`, `background: rgba(255,255,255,.9)`,
  `border: 1px solid #26b7ff`, `border-radius: 12px`, `box-shadow: 0 0 8px rgba(38,183,255,.6)`,
  `padding: 12px 44px 12px 12px`, flex row, `gap: 12px`.
- Feed of 5 entries (name / plan / relative time / signature thumbnail). Entries 0 and 2 show
  "Just now" inside a gradient pill `linear-gradient(135deg,#26b7ff,#1d4afe)`; the rest show
  plain grey text.
- Timing: first card after 5000 ms; each card visible 5500 ms; fade 600 ms
  (`opacity` + `translateY(±6px)`, `ease-out`); inter-card delays `[5000,8000,8000,12000,7000]`.
- The × button removes the whole widget permanently.

## 2. Deliverability video player — click-driven
Source: `docs/research/raw/js/inline-12.js`.
- Two stacked `<video>`s: `#bgVideo` (looping poster loop) and `#customVideo` (the real clip).
- Play button swaps `#bgVideo` to `display:none`, shows `#customVideo`, plays it, swaps the
  icon between `play_white.png` and `pause_white.png`.
- `#timeStamp` counts **down** from a hard-coded total of 170 s, formatted `m:ss`.
- Close button pauses both, fades the wrapper `opacity → 0` over `0.4s ease`, then `display:none`.

## 3. Our Platform — click-driven slick carousel + tab pills
Source: `docs/research/raw/js/inline-15.js`.
- `.slider-nav` runs slick: `slidesToShow: 1`, `arrows: false`, `infinite: false`,
  `centerMode: true`, `centerPadding: '15%'`.
  Responsive `centerPadding`: `8%` ≤991px, `5%` ≤767px, `0%` ≤557px.
- `.tab-link[data-slide]` pills drive `slickGoTo(index)`; `afterChange` syncs `.active`
  back onto the matching pill. So the pills and the slider are two views of one index —
  dragging the slider must move the pills and vice versa.
- Three slides: **Signature Manager**, **Visual Editor**, **Analytics**.

## 4. Lottie animations
Eight Lottie JSONs in `public/ces/lottie/`. All are `data-renderer="svg"`.
- Brand logos in the Top-User cards: `Shopify`, `Cisco`, `Blue tees`, `Robinhood`, `Webflow`,
  `CES (1)` — `data-autoplay="0"`, `data-loop="0"`, driven by Webflow IX2 on scroll-into-view.
  Clone as: play once when the card enters the viewport (IntersectionObserver).
- `ClickUP final update 1` and `Email CRM transperent STATIC (3)` — `data-autoplay="1"`,
  `data-loop="1"` for the first: play immediately, loop.

## 5. Nav
- `.nav_fixed` is `position: fixed` and does **not** change on scroll — it keeps the same
  floating pill (white, rounded, shadowed) at every scroll position. Verified by screenshots
  at scroll 0, 2000, 7400 and page bottom: identical.
- `Solutions` is a Webflow `w-dropdown` mega-menu holding 21 solution links in a multi-column
  grid, each with a title + one-line description, plus a "Trusted by 1000+" promo block and a
  "View all industries" / "Create custom signature" footer row.

## 6. Marquees
- `.client-section` scrolls a row of 6 brand logos horizontally, greyscale.
- The hero's signature-card strip scrolls horizontally behind the email mock.
Both are CSS `@keyframes` translations already present in `app/ces.css` — reuse the original
class names rather than re-authoring them.

## 7. FAQ
Four accordion items in a 2-column grid; `+` icon rotates to `×` on open. Click-driven,
independent (multiple can be open).

## 8. Responsive
Layout collapses at the Webflow breakpoints listed in PAGE_TOPOLOGY.md. Every multi-column
grid in the page becomes a single column at ≤767px; the nav collapses to a hamburger
(`.w-nav-button`) at ≤991px.
