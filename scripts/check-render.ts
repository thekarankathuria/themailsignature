/**
 * Render smoke test.
 *
 * The output of this renderer is copied onto a clipboard and pasted into other
 * people's mail, so two properties matter more than anything else: hostile
 * input must not survive as markup or as an active URL, and the result must
 * stay inside the subset of HTML that Word's rendering engine understands.
 *
 * Checks run against parsed tags rather than the raw string, because escaped
 * user text legitimately contains things like "onerror=" as visible content.
 *
 * Run with: npm test
 */
import { renderPlainText, renderSignature } from "../lib/signature/render";
import { DEFAULT_DATA, DEFAULT_STYLE } from "../lib/signature/defaults";
import { TEMPLATES } from "../lib/signature/templates";
import type { SignatureData } from "../lib/signature/types";

const HOSTILE: SignatureData = {
  ...DEFAULT_DATA,
  firstName: "<img src=x onerror=alert(1)>",
  lastName: '"><script>alert(2)</script>',
  jobTitle: "Sales & <b>Marketing</b>",
  company: "O'Brien & Sons",
  website: "javascript:alert(3)",
  email: "a@b.co",
  meetingUrl: "data:text/html,<script>alert(4)</script>",
  meetingLabel: "Book",
  logoUrl: "javascript:alert(5)",
  photoUrl: "vbscript:msgbox(6)",
  bannerUrl: "  HTTPS://cdn.example.com/banner.png  ",
  bannerLink: "example.com/promo",
  ctaText: "Go",
  ctaUrl: "example.com/go",
  tagline: "5 > 3 & 2 < 4",
  sideText: "<b>Ideas</b>\nPeople\n\"><script>alert(9)</script>",
  disclaimer: "Confidential </td></table><script>alert(7)</script>",
  greenFooter: true,
  social: { linkedin: "javascript:alert(8)", x: "x.com/real" },
};

const DANGEROUS = /^\s*(javascript|data|vbscript|file|blob)\s*:/i;

const failures: string[] = [];
const check = (name: string, ok: boolean) => {
  if (!ok) failures.push(name);
};

/** Every opening tag in the document, so attributes can be read in isolation. */
function tagsOf(html: string): string[] {
  return html.match(/<[a-z][^>]*>/gi) ?? [];
}

function attrValues(tags: string[], attr: string): string[] {
  const pattern = new RegExp(`${attr}="([^"]*)"`, "gi");
  return tags.flatMap((tag) => [...tag.matchAll(pattern)].map((m) => m[1]));
}

/** Anchors that wrap text need an explicit colour; image wrappers do not. */
function textAnchorsMissingColour(html: string): number {
  let count = 0;
  const pattern = /<a\s([^>]*)>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(pattern)) {
    const [, attrs, inner] = match;
    if (inner.includes("<img")) continue;
    if (!/style="color:/i.test(attrs)) count += 1;
  }
  return count;
}

// The designer options (animation, status dot, contact icons) add images and
// columns, so every layout is also checked with all of them switched on.
const EXTRAS = {
  iconAnimation: "pulse",
  statusDot: "blink",
  contactIcons: "muted",
} as const;

for (const template of TEMPLATES) {
  const plain = { ...DEFAULT_STYLE, templateId: template.id };
  const extras = { ...plain, iconAnimation: EXTRAS.iconAnimation, statusDot: EXTRAS.statusDot, contactIcons: EXTRAS.contactIcons };

  for (const [variant, data, style] of [
    ["hostile", HOSTILE, plain],
    ["default", DEFAULT_DATA, plain],
    ["hostile+extras", { ...HOSTILE, photoUrl: "https://cdn.test/p.png" }, extras],
  ] as const) {
    const html = renderSignature(data, style, { assetBase: "https://cdn.test" });
    const tags = tagsOf(html);
    const at = (rule: string) => `${template.name}/${variant}: ${rule}`;

    check(at("renders something"), html.length > 200);

    // Injection: user input must never become markup or an active URL.
    check(at("no script element"), !tags.some((t) => /^<script/i.test(t)));
    // Quoted values are blanked first: escaped user text inside an alt or href
    // can legitimately read "onerror=", but it is text, not an attribute.
    check(
      at("no event handler attribute"),
      !tags.some((t) => /\son[a-z]+\s*=/i.test(t.replace(/"[^"]*"/g, '""'))),
    );
    check(at("no dangerous href"), !attrValues(tags, "href").some((v) => DANGEROUS.test(v)));
    check(at("no dangerous src"), !attrValues(tags, "src").some((v) => DANGEROUS.test(v)));
    check(at("payload not reflected as markup"), !html.includes("<img src=x"));
    check(at("closing tag payload escaped"), !html.includes("</td></table><script"));
    check(at("side text escaped"), !html.includes("<b>Ideas</b>") && !html.includes("alert(9)</script>"));
    if (variant === "hostile+extras") {
      check(at("animated icons used"), !html.includes("/i/social/") && html.includes("/i/social-anim/pulse/"));
      check(at("contact icons used"), html.includes("/i/contact/"));
    }

    // Mail-client safety: the subset Word actually renders.
    check(at("no stylesheet block"), !tags.some((t) => /^<style/i.test(t)));
    check(at("no external stylesheet"), !tags.some((t) => /^<link/i.test(t)));
    check(at("no class attribute"), !tags.some((t) => /\sclass=/i.test(t)));
    check(at("no flex or grid"), !/display:\s*(flex|grid)/i.test(html));
    check(at("tables carry cellpadding"), html.includes('cellpadding="0"'));
    check(at("tables collapse borders"), html.includes("border-collapse:collapse"));
    check(
      at("every img is display:block"),
      tags.filter((t) => /^<img/i.test(t)).every((t) => t.includes("display:block")),
    );
    check(at("text anchors set their colour"), textAnchorsMissingColour(html) === 0);
  }
}

// URL normalising.
const normalised = renderSignature(
  HOSTILE,
  { ...DEFAULT_STYLE, templateId: "broadcast" },
  { assetBase: "https://cdn.test" },
);
check("bare domain gains https", normalised.includes("https://example.com/promo"));
check("existing scheme preserved", normalised.includes("HTTPS://cdn.example.com/banner.png"));
check("icons use the asset base", normalised.includes("https://cdn.test/i/social/"));
check(
  "dangerous social link dropped",
  !normalised.includes("alert(8)") && normalised.includes("x.com/real"),
);

// Plain text fallback must never carry markup.
const text = renderPlainText(HOSTILE, DEFAULT_STYLE);
check("plain text is not empty", text.trim().length > 0);
// The user's own text may contain angle brackets; what must not survive is
// the markup this renderer wraps around it.
check("plain text has no anchors", !/<a\s+href=/i.test(text));
check("plain text has no inline styles", !text.includes('style="'));
check("contact lines are readable", text.includes("Phone: +1 (312) 847-1928"));
check("plain text has no leftover entities", !/&(amp|quot|#39|#58|lt|gt);/.test(text));

if (failures.length) {
  console.error(`FAILED (${failures.length}):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(
  `All render checks passed: ${TEMPLATES.length} templates x 3 payloads, plus URL and plain-text checks.`,
);
