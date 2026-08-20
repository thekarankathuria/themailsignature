import type { Density, FontKey, SignatureStyle } from "./types";

/* ------------------------------------------------------------------ *
 * Escaping and URL safety
 *
 * Everything here ends up on the user's clipboard and then inside their
 * outgoing mail, so nothing is interpolated raw and no scheme other than
 * the four safe ones is ever emitted.
 * ------------------------------------------------------------------ */

export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;

export function safeUrl(raw: string): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (SAFE_SCHEME.test(value)) return esc(value);
  // Root-relative paths are used by the on-site previews, where the browser
  // resolves them. The builder always hands templates an absolute origin, so
  // anything that reaches a real inbox is fully qualified.
  if (value.startsWith("/")) return esc(value);
  // Anything with a scheme we do not recognise (javascript:, data:, ...) is dropped.
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "";
  return esc("https://" + value.replace(/^\/+/, ""));
}

export function telUrl(raw: string): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  return "tel:" + esc(value.replace(/[^\d+]/g, ""));
}

export function mailUrl(raw: string): string {
  const value = String(raw ?? "").trim();
  if (!value || !/^[^\s@]+@[^\s@]+$/.test(value)) return "";
  return "mailto:" + esc(value);
}

/** Strips the scheme so a website reads "studio.com" rather than "https://studio.com/". */
export function displayUrl(raw: string): string {
  return String(raw ?? "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
}

/* ------------------------------------------------------------------ *
 * Typography and spacing
 * ------------------------------------------------------------------ */

export const FONT_STACKS: Record<FontKey, string> = {
  arial: "Arial, Helvetica, sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
  tahoma: "Tahoma, Verdana, sans-serif",
  trebuchet: "'Trebuchet MS', Tahoma, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
  garamond: "Garamond, Georgia, serif",
  palatino: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  courier: "'Courier New', Courier, monospace",
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
};

export const FONT_LABELS: Record<FontKey, string> = {
  arial: "Arial",
  helvetica: "Helvetica",
  verdana: "Verdana",
  tahoma: "Tahoma",
  trebuchet: "Trebuchet MS",
  georgia: "Georgia",
  times: "Times New Roman",
  garamond: "Garamond",
  palatino: "Palatino",
  courier: "Courier New",
  system: "System UI",
};

const DENSITY_GAP: Record<Density, number> = {
  compact: 3,
  cozy: 6,
  roomy: 10,
};

export function gap(style: SignatureStyle): number {
  return DENSITY_GAP[style.density];
}

export function lineHeight(style: SignatureStyle): number {
  return Math.round(style.fontSize * (style.density === "compact" ? 1.4 : 1.55));
}

/* ------------------------------------------------------------------ *
 * Table primitives
 *
 * Outlook for Windows renders through Word, so layout is tables with
 * inline styles. No flexbox, no grid, no <style> block, no classes.
 * ------------------------------------------------------------------ */

export const TABLE_ATTRS =
  'cellpadding="0" cellspacing="0" border="0" role="presentation"';

export const TABLE_RESET =
  "border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;";

export function table(inner: string, extraStyle = ""): string {
  return `<table ${TABLE_ATTRS} style="${TABLE_RESET}${extraStyle}">${inner}</table>`;
}

/** Vertical spacer that survives Outlook's line-height collapsing. */
export function spacer(height: number, colspan = 1): string {
  if (height <= 0) return "";
  const span = colspan > 1 ? ` colspan="${colspan}"` : "";
  return `<tr><td${span} height="${height}" style="height:${height}px;line-height:${height}px;font-size:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>`;
}

/** Horizontal spacer cell, for gutters between columns. */
export function gutter(width: number): string {
  return `<td width="${width}" style="width:${width}px;font-size:0;line-height:0;">&nbsp;</td>`;
}

export function hairline(color: string, colspan = 1): string {
  const span = colspan > 1 ? ` colspan="${colspan}"` : "";
  return `<tr><td${span} style="border-top:1px solid ${color};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>`;
}

export function img(opts: {
  src: string;
  width: number;
  height?: number;
  alt?: string;
  radius?: number;
  extra?: string;
}): string {
  const { src, width, height, alt = "", radius = 0, extra = "" } = opts;
  const url = safeUrl(src);
  if (!url) return "";
  const h = height ? ` height="${height}"` : "";
  const hs = height ? `height:${height}px;` : "";
  const r = radius ? `border-radius:${radius}px;` : "";
  return `<img src="${url}" width="${width}"${h} alt="${esc(alt)}" style="display:block;border:0;outline:none;text-decoration:none;width:${width}px;${hs}${r}-ms-interpolation-mode:bicubic;${extra}" />`;
}

/**
 * Anchor with the colour pinned twice. Outlook and Gmail both like to
 * repaint link text with their own blue unless the colour is declared on
 * the anchor and on an inner span.
 */
export function anchor(href: string, inner: string, color: string, extra = ""): string {
  if (!href) return inner;
  return `<a href="${href}" style="color:${color};text-decoration:none;${extra}"><span style="color:${color};text-decoration:none;">${inner}</span></a>`;
}

export function textCell(
  content: string,
  style: SignatureStyle,
  opts: {
    size?: number;
    color?: string;
    weight?: number;
    lineHeight?: number;
    letterSpacing?: string;
    align?: string;
    extra?: string;
    colspan?: number;
    valign?: string;
  } = {},
): string {
  const size = opts.size ?? style.fontSize;
  const lh = opts.lineHeight ?? Math.round(size * 1.5);
  const span = opts.colspan && opts.colspan > 1 ? ` colspan="${opts.colspan}"` : "";
  const valign = opts.valign ? ` valign="${opts.valign}"` : "";
  const align = opts.align ? `text-align:${opts.align};` : "";
  const ls = opts.letterSpacing ? `letter-spacing:${opts.letterSpacing};` : "";
  return `<td${span}${valign} style="font-family:${FONT_STACKS[style.font]};font-size:${size}px;line-height:${lh}px;color:${opts.color ?? style.textColor};font-weight:${opts.weight ?? 400};${align}${ls}mso-line-height-rule:exactly;${opts.extra ?? ""}">${content}</td>`;
}

export function radiusFor(shape: string, size: number): number {
  if (shape === "circle") return Math.round(size / 2);
  if (shape === "rounded") return Math.max(4, Math.round(size * 0.16));
  return 0;
}
