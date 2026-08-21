// Derive lib/ces/solutions.ts from the 21 saved /solution/<slug> pages.
//
// The 21 pages share one Webflow template; only copy, imagery and a handful of class
// variants differ. Rather than transcribe 21 pages of copy by hand (which drifts), this
// script parses every saved page, pulls the per-page content out of the shared skeleton,
// rewrites every CDN asset URL to its local /ces/... path via docs/research/raw/asset-map.json,
// applies the theme's brand rename, and emits one typed data module.
//
// Usage: node scripts/extract-solutions.mjs
//
// Anything the template cannot reproduce is reported on stderr — a missing asset-map entry
// is a hard failure, so no remote CDN URL can leak into the output.

import { parse } from "node-html-parser";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGES = path.join(ROOT, "docs/research/raw/pages");
const ASSET_MAP = path.join(ROOT, "docs/research/raw/asset-map.json");
const OUT = path.join(ROOT, "lib/ces/solutions.ts");

/* -------------------------------------------------------------------------- */
/* assets                                                                      */
/* -------------------------------------------------------------------------- */

const rawMap = JSON.parse(fs.readFileSync(ASSET_MAP, "utf8"));

// The saved HTML and the map do not always agree on percent-encoding (`%20` vs `%2520`
// vs a literal space), so index every spelling we can derive from each key.
const assetIndex = new Map();
const indexKey = (k, v) => {
  if (!assetIndex.has(k)) assetIndex.set(k, v);
};
for (const [url, local] of Object.entries(rawMap)) {
  indexKey(url, local);
  try {
    indexKey(decodeURIComponent(url), local);
    indexKey(decodeURIComponent(decodeURIComponent(url)), local);
  } catch {
    /* malformed escape — the literal key is enough */
  }
  indexKey(url.replace(/%2520/g, "%20"), local);
}

const missingAssets = new Set();

function localAsset(url) {
  if (!url) return url;
  const trimmed = url.trim();
  if (!/^https?:\/\//.test(trimmed)) return trimmed;
  const candidates = [trimmed];
  try {
    candidates.push(decodeURIComponent(trimmed));
    candidates.push(decodeURIComponent(decodeURIComponent(trimmed)));
  } catch {
    /* ignore */
  }
  candidates.push(trimmed.replace(/%2520/g, "%20"));
  for (const c of candidates) {
    const hit = assetIndex.get(c);
    if (hit) return hit;
  }
  missingAssets.add(trimmed);
  return trimmed;
}

function localSrcset(srcset) {
  if (!srcset) return undefined;
  return srcset
    .split(",")
    .map((part) => {
      const bits = part.trim().split(/\s+/);
      if (!bits[0]) return null;
      bits[0] = localAsset(bits[0]);
      return bits.join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

/* -------------------------------------------------------------------------- */
/* text                                                                        */
/* -------------------------------------------------------------------------- */

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#x27;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&hellip;": "…",
};

function decodeEntities(s) {
  return s.replace(/&(?:#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m) => {
    if (ENTITIES[m]) return ENTITIES[m];
    const hex = /^&#x([0-9a-fA-F]+);$/.exec(m);
    if (hex) return String.fromCodePoint(parseInt(hex[1], 16));
    const dec = /^&#(\d+);$/.exec(m);
    if (dec) return String.fromCodePoint(parseInt(dec[1], 10));
    return m;
  });
}

// Theme override 1: the clone is "Mail Signature", not "Custom Esignature". Applied to
// every extracted string, including hrefs and raw FAQ answer HTML.
function rebrand(s) {
  if (typeof s !== "string") return s;
  return (
    s
      .replace(/app\.customesignature\.com/gi, "app.mailsignature.com")
      .replace(/customesignature\.com/gi, "mailsignature.com")
      // The original spells the brand four ways — "Customesignature", "CustomEsignature",
      // "Custom Esignature" and "Custom E-Signature" — and a possessive apostrophe (raw or
      // as `&#x27;`) simply rides along after the match.
      .replace(/Custom\s*e?-?\s*signature/gi, "Mail Signature")
  );
}

// Collapse Webflow's pretty-printing but keep whether a run of text had a leading or
// trailing space — `Custom <span>Realtor</span>` and `Custom<span>Finance</span>` are
// different headlines and both must survive.
function collapse(s) {
  const decoded = decodeEntities(s).replace(/\s+/g, " ");
  return rebrand(decoded);
}

function textOf(el) {
  if (!el) return "";
  return collapse(el.text).trim();
}

/* -------------------------------------------------------------------------- */
/* rich headings                                                               */
/* -------------------------------------------------------------------------- */

// A heading is a flat mix of plain text, `<span class="highlight-text">` runs and `<br>`.
// Capturing it as a node list keeps every per-page variation in the data file and leaves
// the template with nothing but structure.
function richOf(el) {
  if (!el) return [];
  const out = [];
  for (const node of el.childNodes) {
    if (node.nodeType === 3) {
      const text = collapse(node.rawText);
      if (text.trim() === "" && text !== " ") continue;
      out.push(text);
      continue;
    }
    if (node.nodeType !== 1) continue;
    const tag = (node.rawTagName || "").toLowerCase();
    if (tag === "br") {
      out.push({ br: true });
      continue;
    }
    const cls = node.getAttribute("class") || "";
    if (/highlight[-_]text/.test(cls)) {
      // `solution_customer-support.html` puts a <br> inside the highlighted run, so the
      // span's contents are themselves a rich node list.
      out.push({ hl: richOf(node), cls });
      continue;
    }
    const text = collapse(node.text);
    if (text) out.push(text);
  }
  // Merge adjacent plain strings so the data stays readable.
  const merged = [];
  for (const item of out) {
    if (typeof item === "string" && typeof merged[merged.length - 1] === "string") {
      merged[merged.length - 1] += item;
    } else {
      merged.push(item);
    }
  }
  return merged;
}

/* -------------------------------------------------------------------------- */
/* element helpers                                                             */
/* -------------------------------------------------------------------------- */

function imageOf(el) {
  if (!el) return null;
  const img = {
    src: localAsset(el.getAttribute("src") || ""),
    alt: decodeEntities(el.getAttribute("alt") ?? ""),
  };
  const srcset = localSrcset(el.getAttribute("srcset"));
  if (srcset) img.srcset = srcset;
  const sizes = el.getAttribute("sizes");
  if (sizes) img.sizes = sizes;
  return img;
}

// The chip label is rich too: `solution_healthcare.html` ends its preview chip with a <br>.
function chipOf(section) {
  return richOf(section.querySelector(".button-text"));
}

function buttonOf(anchor) {
  if (!anchor) return null;
  return {
    href: rebrand(anchor.getAttribute("href") || "#"),
    // Rich, because two pages end their button label with a stray <br>.
    label: richOf(anchor.querySelector(".text-button, .text-block-303")),
    chevron: Boolean(anchor.querySelector(".button-icon")),
  };
}

const classOf = (el) => (el ? el.getAttribute("class") || "" : "");

/* -------------------------------------------------------------------------- */
/* per-section extraction                                                      */
/* -------------------------------------------------------------------------- */

const divergences = [];
let droppedTextures = 0;
const note = (slug, message) => divergences.push({ slug, message });

function extractHero(section, slug) {
  const h1 = section.querySelector("h1");
  const h2 = section.querySelector("h2");
  const headingWrap = h1?.closest(".heading_block")?.parentNode ?? null;
  const paragraph = section.querySelector("p.text-size-medium");
  const cta = buttonOf(section.querySelector(".solution-btn-wrap a"));
  const subline = textOf(section.querySelector(".solution-btn-wrap .text-size-regular"));
  const image = imageOf(section.querySelector(".commercial-img"));
  const lottieEl = section.querySelector(".sign_example_lottie");
  const lottie = lottieEl ? localAsset(lottieEl.getAttribute("data-src") || "") : "";

  if (!image) note(slug, "hero has no .commercial-img");
  if (!lottie) note(slug, "hero has no lottie");

  // The three rhythm spacers inside `.about-hero-text-wrapper`. Most pages use
  // `.spacer-custom1` for the first one; `ceos` and `marketers` use `.spacer-small`.
  const wrapperDivs = section
    .querySelectorAll(".about-hero-text-wrapper > div")
    .map((el) => classOf(el));
  const spacers = wrapperDivs.filter((cls) => /^spacer[-\s]/.test(cls));
  if (spacers.length !== 3) note(slug, `hero has ${spacers.length} spacers, expected 3`);

  return {
    eyebrow: chipOf(section),
    spacerClasses: spacers,
    headingWrapClass: classOf(headingWrap),
    h1Class: classOf(h1),
    h1: richOf(h1),
    h2Class: classOf(h2),
    h2: textOf(h2),
    paragraphClass: classOf(paragraph),
    paragraph: textOf(paragraph),
    cta,
    subline,
    image,
    lottie,
  };
}

function extractFeatures(section, slug) {
  const header = section.querySelector(".section_header_container");
  const h2 = header.querySelector("h2");
  const cards = section.querySelectorAll(".img-wraper").map((card) => ({
    wrapperClass: classOf(card),
    gridId: card.getAttribute("id") || "",
    image: imageOf(card.querySelector("img")),
    title: textOf(card.querySelector(".text-size-medium._20px")),
    body: textOf(card.querySelector(".text-size-small")),
  }));
  if (cards.length !== 3) note(slug, `features has ${cards.length} cards, expected 3`);
  return {
    id: section.getAttribute("id") || "",
    headerClass: classOf(header),
    headingBlockClass: classOf(h2.closest(".heading_block")),
    h2Class: classOf(h2),
    paragraphClass: classOf(header.querySelector(".paragraph_wrapper")),
    eyebrow: chipOf(section),
    heading: richOf(h2),
    paragraph: textOf(header.querySelector(".paragraph_wrapper p")),
    cards,
  };
}

function extractTopUsers(section, slug) {
  const header = section.querySelector(".section_header_container");
  const h2 = header.querySelector("h2");
  const items = section.querySelectorAll(".top-user-example-wrapper").map((wrapper) => {
    const lottieEl = wrapper.querySelector(".sign_example_lottie");
    return {
      cta: buttonOf(wrapper.querySelector("a")),
      lottie: lottieEl ? localAsset(lottieEl.getAttribute("data-src") || "") : "",
    };
  });
  if (items.length !== 6) note(slug, `top users has ${items.length} cards, expected 6`);
  const footerBtn = buttonOf(section.querySelector(".button-wrap a"));
  if (!footerBtn) note(slug, "top users section has no closing Get Started button");
  return {
    headerClass: classOf(header),
    h2Class: classOf(h2),
    paragraphClass: classOf(header.querySelector(".paragraph_wrapper")),
    eyebrow: chipOf(section),
    heading: richOf(h2),
    paragraph: textOf(header.querySelector(".paragraph_wrapper p")),
    items,
    cta: footerBtn,
  };
}

function extractCore(section, slug, index) {
  const header = section.querySelector(".section_header_container");
  const h2 = header.querySelector("h2");
  const cards = section.querySelectorAll(".card-benefits").map((card) => ({
    icon: imageOf(card.querySelector(".benefit-img")),
    title: textOf(card.querySelector("h3")),
    body: textOf(card.querySelector(".text-size-small")),
  }));
  if (cards.length !== 6) note(slug, `core[${index}] has ${cards.length} cards, expected 6`);
  const wrapperClass = classOf(section);
  if (wrapperClass !== "core-feature-section") {
    note(slug, `core[${index}] wrapper is .${wrapperClass}, not .core-feature-section`);
  }
  // Theme override 4: the texture wash under this section is a decorative background layer
  // (`app/ces-extra.css` already forces `.bg-img-mobile { display: none }`), so it is not
  // carried into the data at all. Counted, not reported per-section.
  if (section.querySelector(".bg-img-mobile")) droppedTextures++;
  return {
    wrapperClass,
    // `solution_marketers.html` nests this section one level deeper in `.padding-global`.
    paddingGlobal: section.childNodes.some(
      (n) => n.nodeType === 1 && classOf(n).split(/\s+/).includes("padding-global")
    ),
    headerClass: classOf(header),
    h2Class: classOf(h2),
    paragraphClass: classOf(header.querySelector(".paragraph_wrapper")),
    eyebrow: chipOf(section),
    heading: richOf(h2),
    paragraph: textOf(header.querySelector(".paragraph_wrapper p")),
    cards,
    cta: buttonOf(section.querySelector(".supercharge-main-wrapper > a.try-for-free_btn--b")),
  };
}

function extractFaq(section) {
  const header = section.querySelector(".section_header_container");
  const h2 = header.querySelector("h2");
  const items = section.querySelectorAll(".faq6_accordion").map((accordion) => ({
    question: textOf(accordion.querySelector(".faq6_question .text-size-medium")),
    // The answers carry inline <strong>/<span> emphasis and one embed; keeping them as
    // HTML is what lets the template stay structure-only.
    answerHtml: rebrand(
      accordion
        .querySelector(".faq6_answer")
        .innerHTML.replace(/\s+/g, " ")
        .trim()
    ),
  }));
  return {
    eyebrow: chipOf(section),
    h2Class: classOf(h2),
    heading: richOf(h2),
    paragraph: textOf(header.querySelector("p.text-size-medium")),
    items,
  };
}

function extractSolutionCta(section) {
  const h2 = section.querySelector("h2");
  return {
    h2Class: classOf(h2),
    heading: richOf(h2),
    paragraph: textOf(section.querySelector(".paragraph_wrapper p")),
    cta: buttonOf(section.querySelector("a.try-for-free_btn--b")),
  };
}

/* -------------------------------------------------------------------------- */
/* page                                                                        */
/* -------------------------------------------------------------------------- */

function extractPage(file) {
  const slug = file.replace(/^solution_/, "").replace(/\.html$/, "");
  const html = fs.readFileSync(path.join(PAGES, file), "utf8");
  const root = parse(html, { blockTextElements: { script: true, style: true } });

  const title = rebrand(decodeEntities(root.querySelector("title")?.text?.trim() ?? ""));
  const metaDescription = rebrand(
    decodeEntities(
      root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? ""
    )
  );
  if (!title) note(slug, "no <title>");

  const main = root.querySelector(".main-wrapper");
  const kids = main.childNodes.filter((n) => n.nodeType === 1);

  const hero = kids[0];
  const features = kids[2];
  const topUsers = kids[3];
  const core1 = kids[4];
  const core2 = kids[5];
  const alternate = kids.find((k) => classOf(k).includes("background-color-alternate"));
  const altKids = alternate.childNodes.filter((n) => n.nodeType === 1);
  const faq = altKids.find((k) => classOf(k).includes("faq"));
  const ctaEl = altKids.find(
    (k) => classOf(k).includes("solution-cta") || classOf(k).includes("cta_section")
  );

  if (!classOf(hero).includes("section_hero")) note(slug, "first section is not .section_hero");
  if (!classOf(kids[1]).includes("client-section")) note(slug, "second section is not .client-section");
  if (!classOf(features).includes("features-section")) note(slug, "third section is not .features-section");
  if (!classOf(topUsers).includes("top_user_examples_evan")) {
    note(slug, "fourth section is not .top_user_examples_evan");
  }

  const usesSharedCta = classOf(ctaEl).includes("cta_section");
  if (usesSharedCta) {
    note(slug, "closes with the shared .cta_section, not .solution-cta");
  }

  const heroData = extractHero(hero, slug);

  // 12 of the 21 originals ship no meta description at all. Rather than emit an empty one,
  // fall back to the page's own hero paragraph — on-page copy, still verbatim.
  const description = metaDescription || heroData.paragraph;
  if (!metaDescription) note(slug, "no meta description in the original (fell back to the hero paragraph)");

  return {
    slug,
    title,
    description,
    hero: heroData,
    features: extractFeatures(features, slug),
    topUsers: extractTopUsers(topUsers, slug),
    core: [extractCore(core1, slug, 0), extractCore(core2, slug, 1)],
    faq: extractFaq(faq),
    usesSharedCta,
    solutionCta: usesSharedCta ? null : extractSolutionCta(ctaEl),
  };
}

/* -------------------------------------------------------------------------- */
/* emit                                                                        */
/* -------------------------------------------------------------------------- */

const lit = (value, indent = 0) => JSON.stringify(value, null, 2).replace(/\n/g, "\n" + " ".repeat(indent));

const files = fs
  .readdirSync(PAGES)
  .filter((f) => /^solution_.+\.html$/.test(f))
  .sort();

const solutions = files.map(extractPage);

// Every page ships the same FAQ block; dedupe it so the data file states the copy once and
// still keeps a per-page reference (a page that ever diverges simply gets its own const).
const faqConsts = new Map();
for (const s of solutions) {
  const key = JSON.stringify(s.faq);
  if (!faqConsts.has(key)) faqConsts.set(key, `FAQ_${faqConsts.size + 1}`);
  s.faqRef = faqConsts.get(key);
}

const header = `// GENERATED FILE — do not edit by hand.
// Produced by scripts/extract-solutions.mjs from the 21 saved pages in
// docs/research/raw/pages/solution_*.html. Re-run \`node scripts/extract-solutions.mjs\`
// to regenerate. Every asset path is local (/ces/...), translated through
// docs/research/raw/asset-map.json.
//
// The copy is verbatim from the original, with one deliberate substitution: the brand is
// "Mail Signature" throughout (see docs/research/BUILDER_BRIEF.md, "Theme overrides").

/**
 * One run of rich text: plain text, a line break, or a highlighted span (whose contents are
 * themselves rich — \`solution_customer-support.html\` breaks the line inside the highlight).
 * Headings, chip labels and button labels all use it, because every one of them carries a
 * stray \`<br>\` on at least one of the 21 pages.
 */
export type SolutionRich = string | { br: true } | { hl: SolutionRich[]; cls: string };

export type SolutionImage = {
  src: string;
  alt: string;
  srcset?: string;
  sizes?: string;
};

export type SolutionButton = {
  href: string;
  label: SolutionRich[];
  /** The original renders a double-chevron glyph inside \`.button-icon-wrap\` on some buttons. */
  chevron: boolean;
};

export type SolutionHero = {
  eyebrow: SolutionRich[];
  /** The three rhythm spacers inside \`.about-hero-text-wrapper\`, in order. */
  spacerClasses: string[];
  headingWrapClass: string;
  h1Class: string;
  h1: SolutionRich[];
  h2Class: string;
  h2: string;
  paragraphClass: string;
  paragraph: string;
  cta: SolutionButton | null;
  subline: string;
  image: SolutionImage | null;
  lottie: string;
};

export type SolutionFeatureCard = {
  /** \`img-wraper\`, plus the \`auto\` / \`auto2\` height modifiers finance-banking adds. */
  wrapperClass: string;
  /** Webflow \`w-node-*\` id — it carries grid-placement CSS, so it has to survive. */
  gridId: string;
  image: SolutionImage | null;
  title: string;
  body: string;
};

export type SolutionFeatures = {
  id: string;
  headerClass: string;
  headingBlockClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  cards: SolutionFeatureCard[];
};

export type SolutionTopUserItem = {
  cta: SolutionButton | null;
  lottie: string;
};

export type SolutionTopUsers = {
  headerClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  items: SolutionTopUserItem[];
  cta: SolutionButton | null;
};

export type SolutionBenefit = {
  icon: SolutionImage | null;
  title: string;
  body: string;
};

export type SolutionCoreSection = {
  /** \`core-feature-section\` on 20 pages, \`supercharge-your-emails\` on real-estate-firms. */
  wrapperClass: string;
  /** \`solution_marketers.html\` nests this section inside an extra \`.padding-global\`. */
  paddingGlobal: boolean;
  headerClass: string;
  h2Class: string;
  paragraphClass: string;
  eyebrow: SolutionRich[];
  heading: SolutionRich[];
  paragraph: string;
  cards: SolutionBenefit[];
  cta: SolutionButton | null;
};

export type SolutionFaqItem = {
  question: string;
  /** Inline emphasis and one Loom embed; rendered with \`dangerouslySetInnerHTML\`. */
  answerHtml: string;
};

export type SolutionFaq = {
  eyebrow: SolutionRich[];
  h2Class: string;
  heading: SolutionRich[];
  paragraph: string;
  items: SolutionFaqItem[];
};

export type SolutionCta = {
  h2Class: string;
  heading: SolutionRich[];
  paragraph: string;
  cta: SolutionButton | null;
};

export type Solution = {
  slug: string;
  title: string;
  description: string;
  hero: SolutionHero;
  features: SolutionFeatures;
  topUsers: SolutionTopUsers;
  core: SolutionCoreSection[];
  faq: SolutionFaq;
  /** \`freelancers\` and \`teachers\` close with the site-wide \`.cta_section\` instead. */
  usesSharedCta: boolean;
  solutionCta: SolutionCta | null;
};
`;

let body = "\n";
for (const [key, name] of faqConsts) {
  body += `const ${name}: SolutionFaq = ${lit(JSON.parse(key))};\n\n`;
}

body += "export const solutions: Solution[] = [\n";
for (const s of solutions) {
  const { faq, faqRef, ...rest } = s;
  // Point at the shared FAQ const instead of inlining the same block 21 times. The sentinel
  // survives JSON.stringify as a quoted string, then becomes a bare identifier.
  const entry = lit({ ...rest, faq: `__REF__${faqRef}` }, 2);
  body += "  " + entry.replace(/"__REF__([A-Za-z0-9_]+)"/g, "$1") + ",\n";
}
body += "];\n\n";

body += `export const solutionSlugs: string[] = solutions.map((s) => s.slug);

const bySlug = new Map(solutions.map((s) => [s.slug, s]));

export function getSolution(slug: string): Solution | undefined {
  return bySlug.get(slug);
}
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, header + body);

/* -------------------------------------------------------------------------- */
/* report                                                                      */
/* -------------------------------------------------------------------------- */

console.log(`wrote ${path.relative(ROOT, OUT)} — ${solutions.length} solutions`);
console.log(`FAQ variants: ${faqConsts.size}`);

console.log(`dropped decorative .bg-img-mobile textures: ${droppedTextures}`);

if (divergences.length) {
  // Group by message so a template-wide quirk reads as one line, not 21.
  const grouped = new Map();
  for (const d of divergences) {
    if (!grouped.has(d.message)) grouped.set(d.message, []);
    grouped.get(d.message).push(d.slug);
  }
  console.log("\ntemplate divergences:");
  for (const [message, slugs] of grouped) {
    console.log(`  [${slugs.length}] ${message}`);
    console.log(`      ${slugs.join(", ")}`);
  }
}

if (missingAssets.size) {
  console.error(`\nERROR: ${missingAssets.size} asset URL(s) missing from asset-map.json:`);
  for (const url of missingAssets) console.error("  " + url);
  process.exitCode = 1;
}
