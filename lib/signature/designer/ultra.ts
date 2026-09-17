import { contactIconPath, type ContactKind } from "../assets";
import { anchor, displayUrl, esc, img, mailUrl, safeUrl, spacer, table, telUrl, textCell } from "../html";
import { photoImg } from "../parts";
import type { RenderContext, SignatureData, SignatureStyle, TemplateMeta } from "../types";
import { closing, iconRow, nameLine, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const ultraMeta: TemplateMeta = {
  id: "ultra",
  name: "Ultra Minimal",
  blurb: "A small portrait, two tidy contact lines and a whisper of side text.",
  tier: "pro",
  group: "designer",
  tags: ["minimal"],
  supports: ["sideText"],
  styleHints: { photoShape: "circle", contactIcons: "none", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphDark" },
};

const SEP = `<span style="color:#B8BCC3;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`;

/** Contact details packed into two lines: phone and email, then web and place. */
function contactPairs(data: SignatureData, style: SignatureStyle, ctx: RenderContext): string {
  const size = Math.max(10, style.fontSize - 2);
  const tone = style.contactIcons;
  const lead = (kind: ContactKind, text: string) =>
    text && tone !== "none"
      ? `${img({ src: contactIconPath(ctx.assetBase, tone, kind), width: 12, height: 12, alt: "", extra: "display:inline-block;vertical-align:-1px;" })}&nbsp;${text}`
      : text;
  const phone = data.phone.trim() ? anchor(telUrl(data.phone), esc(data.phone.trim()), style.textColor) : "";
  const email = data.email.trim()
    ? anchor(mailUrl(data.email), esc(data.email.trim()), style.textColor)
    : "";
  const web = data.website.trim()
    ? anchor(safeUrl(data.website), esc(displayUrl(data.website)), style.textColor)
    : "";
  const place = esc([data.addressLine1, data.addressLine2].map((s) => s.trim()).filter(Boolean).join(", "));

  return [
    [lead("phone", phone), lead("email", email)],
    [lead("web", web), lead("address", place)],
  ]
    .map((pair) => pair.filter(Boolean).join(SEP))
    .filter(Boolean)
    .map((line) => `<tr>${textCell(line, style, { size, lineHeight: Math.round(size * 1.7), color: style.textColor })}</tr>`)
    .join("");
}

export const ultra: Renderer = (data, style, ctx) => {
  const photo = photoImg(
    { ...data, photoSize: Math.min(data.photoSize || 92, 76) },
    { ...style, photoShape: "circle" },
  );

  const roleLine = [data.jobTitle, data.company].map((v) => v.trim()).filter(Boolean).join(", ");
  const icons = iconRow(data, style, ctx);

  const details = table(
    nameLine(data, style, { size: style.fontSize + 5, weight: 400, font: style.secondaryFont }) +
      titleLine(roleLine, style, { size: Math.max(11, style.fontSize - 1) }) +
      spacer(12) +
      contactPairs(data, style, ctx) +
      (icons ? spacer(12) + shortRule("#D5D8DD", 24) + spacer(12) + `<tr><td>${icons}</td></tr>` : ""),
  );

  const side = sideColumn(data, style, { upper: true, size: 8 });
  const aside = side ? table(`<tr><td>${side}</td></tr>` + spacer(12) + shortRule("#D5D8DD", 24)) : "";

  const row =
    (photo ? `<td valign="middle">${photo}</td><td width="24" style="width:24px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="middle">${details}</td>` +
    (aside ? `${vRule("#E3E5E8", 1, 24)}<td valign="middle">${aside}</td>` : "");

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
