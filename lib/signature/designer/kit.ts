/**
 * Building blocks shared by the designer layouts.
 *
 * Same rules as the classic templates: nested tables, inline styles, and every
 * filled cell painted twice (bgcolor for Outlook, background-color for the
 * rest). Nothing here positions content with margins or overlaps, because
 * Word's renderer ignores both.
 */
import { socialIconPath, statusDotPath } from "../assets";
import { esc, gap, gutter, img, safeUrl, spacer, table, textCell } from "../html";
import { bannerImg, ctaButton, footerRows, fullName, photoImg, socialRow } from "../parts";
import { SOCIALS } from "../social";
import type { FontKey, RenderContext, SignatureData, SignatureStyle } from "../types";

export type Renderer = (
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
) => string;

/** Side text as clean lines: trimmed, blanks dropped, at most four. */
export function sideLines(data: SignatureData): string[] {
  return data.sideText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

/** The short stacked words some layouts set beside the details. */
export function sideColumn(
  data: SignatureData,
  style: SignatureStyle,
  opts: { upper?: boolean; italic?: boolean; size?: number; color?: string; font?: FontKey; lines?: string[] },
): string {
  const lines = opts.lines ?? sideLines(data);
  if (!lines.length) return "";
  const size = opts.size ?? Math.max(10, style.fontSize - 2);
  const lh = Math.round(size * (opts.upper ? 1.9 : 1.45));
  return table(
    lines
      .map((line) => {
        const text = esc(opts.upper ? line.toUpperCase() : line);
        return `<tr>${textCell(opts.italic ? `<i>${text}</i>` : text, style, {
          size,
          lineHeight: lh,
          color: opts.color ?? style.mutedColor,
          letterSpacing: opts.upper ? "0.2em" : undefined,
          font: opts.font,
        })}</tr>`;
      })
      .join(""),
  );
}

/** A thin vertical rule between columns, with gutters either side. */
export function vRule(color: string, width = 1, pad = 18): string {
  return (
    gutter(pad) +
    `<td width="${width}" bgcolor="${color}" style="width:${width}px;background-color:${color};font-size:0;line-height:0;">&nbsp;</td>` +
    gutter(pad)
  );
}

/** A short horizontal rule, for under names and side statements. */
export function shortRule(color: string, width = 28): string {
  return `<tr><td>${table(
    `<tr><td width="${width}" height="1" bgcolor="${color}" style="width:${width}px;height:1px;background-color:${color};font-size:0;line-height:0;">&nbsp;</td></tr>`,
  )}</td></tr>`;
}

export function nameLine(
  data: SignatureData,
  style: SignatureStyle,
  opts: { size: number; weight?: number; font?: FontKey; color?: string; tracking?: string; upper?: boolean; text?: string },
): string {
  const raw = opts.text ?? fullName(data);
  if (!raw) return "";
  const shown = opts.upper || style.uppercaseName ? raw.toUpperCase() : raw;
  return `<tr>${textCell(esc(shown), style, {
    size: opts.size,
    weight: opts.weight ?? 700,
    color: opts.color ?? style.nameColor,
    lineHeight: Math.round(opts.size * 1.18),
    letterSpacing: opts.tracking ?? (opts.upper ? "0.04em" : "-0.01em"),
    font: opts.font,
  })}</tr>`;
}

export function titleLine(
  text: string,
  style: SignatureStyle,
  opts: { upper?: boolean; tracking?: string; color?: string; size?: number; weight?: number; italic?: boolean; font?: FontKey } = {},
): string {
  const value = text.trim();
  if (!value) return "";
  const size = opts.size ?? style.fontSize;
  const shown = esc(opts.upper ? value.toUpperCase() : value);
  return `<tr>${textCell(opts.italic ? `<i>${shown}</i>` : shown, style, {
    size,
    weight: opts.weight ?? 400,
    color: opts.color ?? style.mutedColor,
    lineHeight: Math.round(size * 1.5),
    letterSpacing: opts.tracking ?? (opts.upper ? "0.18em" : undefined),
    font: opts.font,
  })}</tr>`;
}

/**
 * Photo with an optional ring and a status dot. Outlook cannot overlap
 * elements, so the dot sits in a short row under the photo's right edge.
 */
export function photoWithStatus(
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
  opts: { ring?: string } = {},
): string {
  const photo = photoImg(data, style);
  if (!photo) return "";
  const size = data.photoSize || 92;
  const framed = opts.ring
    ? table(
        `<tr><td bgcolor="${opts.ring}" style="background-color:${opts.ring};padding:5px;border-radius:${Math.round((size + 10) / 2)}px;line-height:0;font-size:0;">${photo}</td></tr>`,
      )
    : photo;
  if (style.statusDot === "none") return framed;
  const dot = img({
    src: statusDotPath(ctx.assetBase, style.statusDot, style.statusColor),
    width: 16,
    height: 16,
    alt: "Available",
  });
  return table(`<tr><td>${framed}</td></tr><tr><td align="right" style="line-height:0;font-size:0;padding-right:${opts.ring ? 12 : 6}px;">${dot}</td></tr>`);
}

/** Social icons stacked vertically, for layouts with an icon rail. */
export function iconColumn(data: SignatureData, style: SignatureStyle, ctx: RenderContext): string {
  const active = SOCIALS.filter((s) => (data.social[s.key] ?? "").trim());
  if (!active.length) return "";
  const size = Math.min(style.iconSize || 22, 20);
  return table(
    active
      .map((s, i) => {
        const href = safeUrl(data.social[s.key] as string);
        const icon = img({ src: socialIconPath(ctx.assetBase, style, s.slug), width: size, height: size, alt: s.label });
        const wrapped = href ? `<a href="${href}" style="text-decoration:none;">${icon}</a>` : icon;
        return (i ? spacer(10) : "") + `<tr><td style="line-height:0;font-size:0;">${wrapped}</td></tr>`;
      })
      .join(""),
  );
}

/** The existing horizontal icon row, re-exported so layouts import one module. */
export const iconRow = socialRow;

/** A full-width footer strip with text at either end. */
export function band(
  left: string,
  right: string,
  style: SignatureStyle,
  opts: { bg: string; color: string; colspan?: number },
): string {
  if (!left.trim() && !right.trim()) return "";
  const span = opts.colspan && opts.colspan > 1 ? ` colspan="${opts.colspan}"` : "";
  const cell = (text: string, align: string) =>
    textCell(esc(text.trim().toUpperCase()), style, {
      size: 9,
      lineHeight: 14,
      color: opts.color,
      letterSpacing: "0.2em",
      align,
    });
  return `<tr><td${span} bgcolor="${opts.bg}" style="background-color:${opts.bg};padding:10px 22px;">${table(
    `<tr>${cell(left, "left")}${gutter(16)}${cell(right, "right")}</tr>`,
    "width:100%;",
  )}</td></tr>`;
}

/** A filled or bordered panel, optionally with an accent bar on its left. */
export function card(
  inner: string,
  opts: { bg: string; pad?: string; border?: string; radius?: number; accentLeft?: { color: string; width: number } },
): string {
  const border = opts.border ? `border:${opts.border};` : "";
  const radius = opts.radius ? `border-radius:${opts.radius}px;` : "";
  const bar = opts.accentLeft
    ? `<td width="${opts.accentLeft.width}" bgcolor="${opts.accentLeft.color}" style="width:${opts.accentLeft.width}px;background-color:${opts.accentLeft.color};font-size:0;line-height:0;">&nbsp;</td>`
    : "";
  return table(
    `<tr>${bar}<td bgcolor="${opts.bg}" style="background-color:${opts.bg};padding:${opts.pad ?? "20px 24px"};${border}${radius}">${inner}</td></tr>`,
  );
}

/** Mixes a hex colour with white; `amount` is the share of the colour kept. */
export function tint(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const mix = (i: number) =>
    Math.round(parseInt(clean.slice(i, i + 2), 16) * amount + 255 * (1 - amount))
      .toString(16)
      .padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`.toUpperCase();
}

/** Call to action, banner and legal lines, appended under every layout. */
export function closing(data: SignatureData, style: SignatureStyle): string {
  let out = "";
  const cta = ctaButton(data, style);
  if (cta) out += spacer(gap(style) + 10) + `<tr><td>${cta}</td></tr>`;
  const banner = bannerImg(data);
  if (banner) out += spacer(gap(style) + 10) + `<tr><td>${banner}</td></tr>`;
  return out + footerRows(data, style);
}
