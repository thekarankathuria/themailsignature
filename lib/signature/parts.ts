import {
  anchor,
  displayUrl,
  esc,
  FONT_STACKS,
  gap,
  gutter,
  img,
  mailUrl,
  radiusFor,
  safeUrl,
  spacer,
  table,
  telUrl,
  textCell,
} from "./html";
import { SOCIALS } from "./social";
import { contactIconPath, socialIconPath, type ContactKind } from "./assets";
import type { RenderContext, SignatureData, SignatureStyle } from "./types";

/* Identity ---------------------------------------------------------- */

export function fullName(data: SignatureData): string {
  return [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
}

export function hasName(data: SignatureData): boolean {
  return fullName(data).length > 0;
}

export function nameHtml(data: SignatureData, style: SignatureStyle): string {
  const name = fullName(data);
  if (!name) return "";
  const shown = style.uppercaseName ? name.toUpperCase() : name;
  let out = esc(shown);
  if (data.credentials.trim()) {
    out += `<span style="color:${style.mutedColor};font-weight:400;">, ${esc(data.credentials.trim())}</span>`;
  }
  if (data.pronouns.trim()) {
    out += `<span style="color:${style.mutedColor};font-weight:400;font-size:${Math.max(10, style.fontSize - 2)}px;"> (${esc(data.pronouns.trim())})</span>`;
  }
  return out;
}

/** Job title, department and company on one line, separated by thin bars. */
export function roleHtml(data: SignatureData, style: SignatureStyle): string {
  const bits: string[] = [];
  if (data.jobTitle.trim()) bits.push(esc(data.jobTitle.trim()));
  if (data.department.trim()) bits.push(esc(data.department.trim()));
  if (!bits.length && !data.company.trim()) return "";
  let out = bits.join(
    `<span style="color:${style.mutedColor};"> &#124; </span>`,
  );
  if (data.company.trim()) {
    const company = `<span style="color:${style.accent};font-weight:700;">${esc(data.company.trim())}</span>`;
    out = out ? `${out}<span style="color:${style.mutedColor};"> at </span>${company}` : company;
  }
  return out;
}

/* Contact ----------------------------------------------------------- */

interface ContactLine {
  label: string;
  kind: ContactKind;
  html: string;
}

export function contactLines(
  data: SignatureData,
  style: SignatureStyle,
): ContactLine[] {
  const lines: ContactLine[] = [];

  if (data.phone.trim()) {
    lines.push({
      label: "P",
      kind: "phone",
      html: anchor(telUrl(data.phone), esc(data.phone.trim()), style.textColor),
    });
  }
  if (data.mobile.trim()) {
    lines.push({
      label: "M",
      kind: "mobile",
      html: anchor(telUrl(data.mobile), esc(data.mobile.trim()), style.textColor),
    });
  }
  if (data.email.trim()) {
    const href = mailUrl(data.email);
    lines.push({
      label: "E",
      kind: "email",
      html: href
        ? anchor(href, esc(data.email.trim()), style.linkColor)
        : esc(data.email.trim()),
    });
  }
  if (data.website.trim()) {
    lines.push({
      label: "W",
      kind: "web",
      html: anchor(
        safeUrl(data.website),
        esc(displayUrl(data.website)),
        style.linkColor,
      ),
    });
  }
  const address = [data.addressLine1, data.addressLine2]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  if (address) {
    lines.push({ label: "A",
      kind: "address", html: esc(address) });
  }
  if (data.meetingUrl.trim()) {
    lines.push({
      label: "B",
      kind: "meeting",
      html: anchor(
        safeUrl(data.meetingUrl),
        esc(data.meetingLabel.trim() || "Book a meeting"),
        style.linkColor,
      ),
    });
  }
  return lines;
}

/** Contact block as stacked rows, led by icons, letter labels, or nothing. */
export function contactRows(
  data: SignatureData,
  style: SignatureStyle,
  opts: { align?: string; ctx?: RenderContext } = {},
): string {
  const lines = contactLines(data, style);
  if (!lines.length) return "";
  const size = Math.max(10, style.fontSize - 1);
  const lh = Math.round(size * 1.6);
  const tone = style.contactIcons;

  return lines
    .map((line) => {
      let lead = "";
      if (tone !== "none" && opts.ctx) {
        lead = `${img({
          src: contactIconPath(opts.ctx.assetBase, tone, line.kind),
          width: 14,
          height: 14,
          alt: line.label,
          extra: "display:inline-block;vertical-align:-2px;",
        })}&nbsp;&nbsp;`;
      } else if (style.showLabels) {
        lead = `<span style="color:${style.mutedColor};font-weight:700;">${line.label}</span><span style="color:${style.mutedColor};">&#58;&nbsp;</span>`;
      }
      return `<tr>${textCell(lead + line.html, style, {
        size,
        lineHeight: lh,
        color: style.textColor,
        align: opts.align,
      })}</tr>`;
    })
    .join("");
}

/** Contact block laid out as two balanced columns, for wider templates. */
export function contactColumns(
  data: SignatureData,
  style: SignatureStyle,
): string {
  const lines = contactLines(data, style);
  if (!lines.length) return "";
  const half = Math.ceil(lines.length / 2);
  const size = Math.max(10, style.fontSize - 1);
  const lh = Math.round(size * 1.6);

  const column = (items: ContactLine[]) =>
    table(
      items
        .map((line) => {
          const label = style.showLabels
            ? `<span style="color:${style.mutedColor};font-weight:700;">${line.label}</span><span style="color:${style.mutedColor};">&#58;&nbsp;</span>`
            : "";
          return `<tr>${textCell(label + line.html, style, { size, lineHeight: lh })}</tr>`;
        })
        .join(""),
    );

  const left = column(lines.slice(0, half));
  const right = lines.length > half ? column(lines.slice(half)) : "";
  if (!right) return `<tr><td>${left}</td></tr>`;
  return `<tr><td valign="top">${left}</td>${gutter(28)}<td valign="top">${right}</td></tr>`;
}

/* Images ------------------------------------------------------------ */

export function logoImg(data: SignatureData): string {
  if (!data.logoUrl.trim()) return "";
  const el = img({
    src: data.logoUrl,
    width: data.logoWidth || 120,
    alt: data.company.trim() || "Company logo",
  });
  if (!el) return "";
  const href = safeUrl(data.logoLink || data.website);
  return href ? `<a href="${href}" style="text-decoration:none;">${el}</a>` : el;
}

export function photoImg(data: SignatureData, style: SignatureStyle): string {
  if (!data.photoUrl.trim()) return "";
  const size = data.photoSize || 92;
  return img({
    src: data.photoUrl,
    width: size,
    height: size,
    alt: fullName(data) || "Profile photo",
    radius: radiusFor(style.photoShape, size),
    extra: "object-fit:cover;",
  });
}

export function bannerImg(data: SignatureData): string {
  if (!data.bannerUrl.trim()) return "";
  const el = img({
    src: data.bannerUrl,
    width: data.bannerWidth || 420,
    alt: "",
    extra: "max-width:100%;",
  });
  if (!el) return "";
  const href = safeUrl(data.bannerLink);
  return href ? `<a href="${href}" style="text-decoration:none;">${el}</a>` : el;
}

/* Social ------------------------------------------------------------ */

export function socialRow(
  data: SignatureData,
  style: SignatureStyle,
  ctx: RenderContext,
): string {
  const active = SOCIALS.filter((s) => (data.social[s.key] ?? "").trim());
  if (!active.length) return "";
  const size = style.iconSize || 22;

  const cells = active
    .map((s) => {
      const href = safeUrl(data.social[s.key] as string);
      const icon = img({
        src: socialIconPath(ctx.assetBase, style, s.slug),
        width: size,
        height: size,
        alt: s.label,
      });
      const wrapped = href
        ? `<a href="${href}" style="text-decoration:none;">${icon}</a>`
        : icon;
      return `<td style="padding:0 6px 0 0;line-height:0;font-size:0;">${wrapped}</td>`;
    })
    .join("");

  return table(`<tr>${cells}</tr>`);
}

/* Call to action ---------------------------------------------------- */

export function ctaButton(data: SignatureData, style: SignatureStyle): string {
  const label = data.ctaText.trim();
  const href = safeUrl(data.ctaUrl);
  if (!label || !href) return "";
  const size = Math.max(11, style.fontSize - 1);
  // Padded table cell rather than a styled <a>: Outlook ignores padding on anchors.
  return table(
    `<tr><td align="center" bgcolor="${style.accent}" style="background-color:${style.accent};border-radius:6px;padding:9px 18px;">` +
      `<a href="${href}" style="color:#ffffff;text-decoration:none;font-family:${FONT_STACKS[style.font]};font-size:${size}px;font-weight:700;line-height:${size + 2}px;display:inline-block;">` +
      `<span style="color:#ffffff;">${esc(label)}</span></a></td></tr>`,
  );
}

/* Footers ----------------------------------------------------------- */

export function taglineRow(data: SignatureData, style: SignatureStyle): string {
  if (!data.tagline.trim()) return "";
  const size = Math.max(10, style.fontSize - 1);
  return (
    spacer(gap(style)) +
    `<tr>${textCell(
      `<span style="font-style:italic;">${esc(data.tagline.trim())}</span>`,
      style,
      { size, color: style.mutedColor, lineHeight: Math.round(size * 1.5) },
    )}</tr>`
  );
}

export function footerRows(data: SignatureData, style: SignatureStyle): string {
  let out = "";
  const size = Math.max(9, style.fontSize - 3);
  const lh = Math.round(size * 1.5);

  if (data.disclaimer.trim()) {
    out +=
      spacer(gap(style) + 4) +
      `<tr>${textCell(esc(data.disclaimer.trim()), style, {
        size,
        color: style.mutedColor,
        lineHeight: lh,
      })}</tr>`;
  }
  if (data.greenFooter) {
    out +=
      spacer(gap(style)) +
      `<tr>${textCell(
        "Please consider the environment before printing this email.",
        style,
        { size, color: style.mutedColor, lineHeight: lh },
      )}</tr>`;
  }
  return out;
}
