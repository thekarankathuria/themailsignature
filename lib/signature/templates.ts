import {
  gap,
  gutter,
  hairline,
  spacer,
  table,
  textCell,
} from "./html";
import {
  bannerImg,
  contactColumns,
  contactRows,
  ctaButton,
  footerRows,
  logoImg,
  nameHtml,
  photoImg,
  roleHtml,
  socialRow,
  taglineRow,
} from "./parts";
import { DESIGNER_RENDERERS, DESIGNER_TEMPLATES } from "./designer";
import type {
  RenderContext,
  SignatureData,
  SignatureStyle,
  TemplateMeta,
} from "./types";

type Renderer = (
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
) => string;

/* Helpers shared by several templates -------------------------------- */

function nameSize(style: SignatureStyle) {
  return style.fontSize + 5;
}

function nameRow(data: SignatureData, style: SignatureStyle, align?: string) {
  const html = nameHtml(data, style);
  if (!html) return "";
  const size = nameSize(style);
  return `<tr>${textCell(html, style, {
    size,
    weight: 700,
    color: style.nameColor,
    lineHeight: Math.round(size * 1.25),
    letterSpacing: style.uppercaseName ? "0.04em" : "-0.01em",
    align,
  })}</tr>`;
}

function roleRow(data: SignatureData, style: SignatureStyle, align?: string) {
  const html = roleHtml(data, style);
  if (!html) return "";
  const size = style.fontSize;
  return `<tr>${textCell(html, style, {
    size,
    color: style.mutedColor,
    lineHeight: Math.round(size * 1.45),
    align,
  })}</tr>`;
}

/** Photo stacked over logo, for templates with a dedicated media column. */
function mediaStack(data: SignatureData, style: SignatureStyle) {
  const photo = photoImg(data, style);
  const logo = logoImg(data);
  if (photo && logo) {
    return table(
      `<tr><td>${photo}</td></tr>` + spacer(gap(style) + 4) + `<tr><td>${logo}</td></tr>`,
    );
  }
  return photo || logo;
}

/** Banner, CTA and legal block appended under most templates. */
function trailer(
  data: SignatureData,
  style: SignatureStyle,
  colspan = 1,
): string {
  let out = "";
  const banner = bannerImg(data);
  const cta = ctaButton(data, style);

  if (cta) {
    out += spacer(gap(style) + 6, colspan);
    out += `<tr><td${colspan > 1 ? ` colspan="${colspan}"` : ""}>${cta}</td></tr>`;
  }
  if (banner) {
    out += spacer(gap(style) + 8, colspan);
    out += `<tr><td${colspan > 1 ? ` colspan="${colspan}"` : ""}>${banner}</td></tr>`;
  }
  const footer = footerRows(data, style);
  if (footer) {
    // footerRows emits full <tr> markup already sized for one column.
    out += footer;
  }
  return out;
}

/* 1. Meridian -------------------------------------------------------- */

const meridian: Renderer = (data, style, ctx) => {
  const media = mediaStack(data, style);
  const social = socialRow(data, style, ctx);

  const details = table(
    nameRow(data, style) +
      roleRow(data, style) +
      (contactRows(data, style, { ctx })
        ? spacer(gap(style) + 2) + contactRows(data, style, { ctx })
        : "") +
      (social ? spacer(gap(style) + 4) + `<tr><td>${social}</td></tr>` : "") +
      taglineRow(data, style),
  );

  const rule = style.showDivider
    ? `${gutter(16)}<td width="2" style="width:2px;background-color:${style.accent};font-size:0;line-height:0;">&nbsp;</td>${gutter(16)}`
    : gutter(18);

  // With no logo or photo there is no media column, so the accent survives as
  // a left bar rather than vanishing entirely.
  const main = media
    ? table(
        `<tr><td valign="top">${media}</td>${rule}<td valign="top">${details}</td></tr>`,
      )
    : style.showDivider
      ? table(
          `<tr><td width="3" style="width:3px;background-color:${style.accent};font-size:0;line-height:0;">&nbsp;</td>${gutter(14)}<td valign="top">${details}</td></tr>`,
        )
      : details;

  return table(`<tr><td>${main}</td></tr>` + trailer(data, style));
};

/* 2. Stack ----------------------------------------------------------- */

const stack: Renderer = (data, style, ctx) => {
  const logo = logoImg(data);
  const photo = photoImg(data, style);
  const social = socialRow(data, style, ctx);
  const top = photo || logo;

  let rows = "";
  if (top) rows += `<tr><td>${top}</td></tr>` + spacer(gap(style) + 6);
  rows += nameRow(data, style) + roleRow(data, style);
  if (style.showDivider) {
    rows += spacer(gap(style) + 4);
    rows += `<tr><td style="border-top:2px solid ${style.accent};font-size:0;line-height:0;width:44px;height:2px;">&nbsp;</td></tr>`;
    rows += spacer(gap(style) + 4);
  } else {
    rows += spacer(gap(style) + 2);
  }
  rows += contactRows(data, style, { ctx });
  if (photo && logo) rows += spacer(gap(style) + 4) + `<tr><td>${logo}</td></tr>`;
  if (social) rows += spacer(gap(style) + 6) + `<tr><td>${social}</td></tr>`;
  rows += taglineRow(data, style);
  rows += trailer(data, style);

  return table(rows);
};

/* 3. Ledger ---------------------------------------------------------- */

const ledger: Renderer = (data, style, ctx) => {
  const logo = logoImg(data);
  const social = socialRow(data, style, ctx);

  const header = logo
    ? table(
        `<tr><td valign="middle">${table(nameRow(data, style) + roleRow(data, style))}</td>` +
          gutter(24) +
          `<td valign="middle" align="right">${logo}</td></tr>`,
      )
    : table(nameRow(data, style) + roleRow(data, style));

  let rows = `<tr><td>${header}</td></tr>`;
  rows += spacer(gap(style) + 6);
  if (style.showDivider) rows += hairline(style.accent);
  rows += spacer(gap(style) + 6);
  rows += `<tr><td>${table(contactColumns(data, style, ctx))}</td></tr>`;
  if (social) rows += spacer(gap(style) + 6) + `<tr><td>${social}</td></tr>`;
  rows += taglineRow(data, style);
  rows += trailer(data, style);

  return table(rows);
};

/* 4. Portrait -------------------------------------------------------- */

const portrait: Renderer = (data, style, ctx) => {
  const photo = photoImg(data, style);
  const social = socialRow(data, style, ctx);
  const logo = logoImg(data);

  const heading = table(
    nameRow(data, style) +
      roleRow(data, style) +
      (social ? spacer(gap(style) + 4) + `<tr><td>${social}</td></tr>` : ""),
  );

  const head = photo
    ? table(
        `<tr><td valign="middle">${photo}</td>${gutter(18)}<td valign="middle">${heading}</td></tr>`,
      )
    : heading;

  let rows = `<tr><td>${head}</td></tr>`;
  rows += spacer(gap(style) + 6);
  if (style.showDivider) rows += hairline(style.mutedColor + "40");
  rows += spacer(gap(style) + 6);
  rows += `<tr><td>${table(contactColumns(data, style, ctx))}</td></tr>`;
  if (logo) rows += spacer(gap(style) + 8) + `<tr><td>${logo}</td></tr>`;
  rows += taglineRow(data, style);
  rows += trailer(data, style);

  return table(rows);
};

/* 5. Slate ----------------------------------------------------------- */

const slate: Renderer = (data, style, ctx) => {
  // The card owns its own palette so the signature stays legible whatever
  // the user picked for the light templates. Accent still comes through.
  const local: SignatureStyle = {
    ...style,
    nameColor: "#FFFFFF",
    textColor: "#DFE1E5",
    mutedColor: "#9BA0A8",
    linkColor: style.accent,
    contactIcons: style.contactIcons === "none" ? "none" : "light",
  };

  const media = mediaStack(data, local);
  const social = socialRow(data, local, ctx);

  const details = table(
    nameRow(data, local) +
      roleRow(data, local) +
      (contactRows(data, local, { ctx })
        ? spacer(gap(local) + 2) + contactRows(data, local, { ctx })
        : "") +
      (social ? spacer(gap(local) + 4) + `<tr><td>${social}</td></tr>` : ""),
  );

  const inner = media
    ? table(
        `<tr><td valign="top">${media}</td>${gutter(18)}<td valign="top">${details}</td></tr>`,
      )
    : details;

  const card = table(
    `<tr>` +
      `<td width="4" style="width:4px;background-color:${style.accent};font-size:0;line-height:0;">&nbsp;</td>` +
      `<td bgcolor="#141619" style="background-color:#141619;padding:18px 22px;">${inner}</td>` +
      `</tr>`,
  );

  return table(
    `<tr><td>${card}</td></tr>` + taglineRow(data, style) + trailer(data, style),
  );
};

/* 6. Minimal --------------------------------------------------------- */

const minimal: Renderer = (data, style, ctx) => {
  const social = socialRow(data, style, ctx);

  const details = table(
    nameRow(data, style) +
      roleRow(data, style) +
      (contactRows(data, style, { ctx })
        ? spacer(gap(style) + 2) + contactRows(data, style, { ctx })
        : "") +
      (social ? spacer(gap(style) + 4) + `<tr><td>${social}</td></tr>` : ""),
  );

  const body = style.showDivider
    ? table(
        `<tr><td width="3" style="width:3px;background-color:${style.accent};font-size:0;line-height:0;">&nbsp;</td>${gutter(14)}<td valign="top">${details}</td></tr>`,
      )
    : details;

  return table(
    `<tr><td>${body}</td></tr>` + taglineRow(data, style) + trailer(data, style),
  );
};

/* 7. Broadcast ------------------------------------------------------- */

const broadcast: Renderer = (data, style, ctx) => {
  const logo = logoImg(data);
  const social = socialRow(data, style, ctx);

  const left = table(nameRow(data, style) + roleRow(data, style));
  const head = logo
    ? table(
        `<tr><td valign="top">${left}</td>${gutter(24)}<td valign="top" align="right">${logo}</td></tr>`,
      )
    : left;

  let rows = `<tr><td>${head}</td></tr>`;
  rows += spacer(gap(style) + 4);
  rows += `<tr><td>${table(contactColumns(data, style, ctx))}</td></tr>`;
  if (social) rows += spacer(gap(style) + 6) + `<tr><td>${social}</td></tr>`;

  const banner = bannerImg(data);
  if (banner) {
    rows += spacer(gap(style) + 10);
    rows += `<tr><td>${banner}</td></tr>`;
  }
  const cta = ctaButton(data, style);
  if (cta) rows += spacer(gap(style) + 8) + `<tr><td>${cta}</td></tr>`;

  rows += taglineRow(data, style);
  rows += footerRows(data, style);

  return table(rows);
};

/* 8. Split ----------------------------------------------------------- */

const split: Renderer = (data, style, ctx) => {
  const media = mediaStack(data, style);
  const social = socialRow(data, style, ctx);

  const details = table(
    nameRow(data, style) +
      roleRow(data, style) +
      (contactRows(data, style, { ctx })
        ? spacer(gap(style) + 2) + contactRows(data, style, { ctx })
        : ""),
  );

  const head = media
    ? table(
        `<tr><td valign="top">${details}</td>${gutter(28)}<td valign="top" align="right">${media}</td></tr>`,
      )
    : details;

  let rows = `<tr><td>${head}</td></tr>`;
  if (social || data.ctaText.trim()) {
    rows += spacer(gap(style) + 6);
    if (style.showDivider) rows += hairline(style.mutedColor + "40");
    rows += spacer(gap(style) + 6);
    const cta = ctaButton(data, style);
    if (social && cta) {
      rows += `<tr><td>${table(
        `<tr><td valign="middle">${social}</td>${gutter(20)}<td valign="middle" align="right">${cta}</td></tr>`,
      )}</td></tr>`;
    } else if (social) {
      rows += `<tr><td>${social}</td></tr>`;
    } else if (cta) {
      rows += `<tr><td>${cta}</td></tr>`;
    }
  }

  const banner = bannerImg(data);
  if (banner) rows += spacer(gap(style) + 8) + `<tr><td>${banner}</td></tr>`;
  rows += taglineRow(data, style);
  rows += footerRows(data, style);

  return table(rows);
};

/* Registry ----------------------------------------------------------- */

export const RENDERERS: Record<string, Renderer> = {
  meridian,
  stack,
  ledger,
  portrait,
  slate,
  minimal,
  broadcast,
  split,
  ...DESIGNER_RENDERERS,
};

/** Layouts available on the Free plan. Everything else is Pro. */
export const FREE_TEMPLATE_IDS: readonly string[] = ["meridian", "stack", "portrait", "minimal"];

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "meridian",
    tier: "free",
    group: "classic",
    tags: ["classic"],
    name: "Meridian",
    blurb: "Media column, accent rule, details right. The safe workhorse.",
  },
  {
    id: "stack",
    tier: "free",
    group: "classic",
    tags: ["minimal", "classic"],
    name: "Stack",
    blurb: "One column, logo on top. Narrowest footprint on mobile.",
  },
  {
    id: "ledger",
    tier: "pro",
    group: "classic",
    tags: ["classic"],
    name: "Ledger",
    blurb: "Name and logo across the top, contact details in two columns.",
  },
  {
    id: "portrait",
    tier: "free",
    group: "classic",
    tags: ["classic"],
    name: "Portrait",
    blurb: "Headshot beside the name, details beneath.",
    styleHints: { photoShape: "circle" },
  },
  {
    id: "slate",
    tier: "pro",
    group: "classic",
    tags: ["dark", "bold"],
    name: "Slate",
    blurb: "Dark card with an accent edge. Manages its own text colours.",
  },
  {
    id: "minimal",
    tier: "free",
    group: "classic",
    tags: ["minimal"],
    name: "Minimal",
    blurb: "Text and a single accent bar. No images at all.",
    omits: ["photo", "logo"],
  },
  {
    id: "broadcast",
    tier: "pro",
    group: "classic",
    tags: ["bold"],
    name: "Broadcast",
    blurb: "Built around a full-width banner for campaigns.",
  },
  {
    id: "split",
    tier: "pro",
    group: "classic",
    tags: ["classic"],
    name: "Split",
    blurb: "Details left, logo right, social and button on one baseline.",
  },
  ...DESIGNER_TEMPLATES,
];

export const TEMPLATE_BY_ID: Record<string, TemplateMeta> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);
