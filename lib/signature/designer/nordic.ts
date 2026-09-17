import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { band, closing, iconRow, nameLine, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const nordicMeta: TemplateMeta = {
  id: "nordic",
  name: "Scandinavian Minimal",
  blurb: "Muted tones, a square portrait and a quiet footer band with your company.",
  tier: "pro",
  group: "designer",
  tags: ["minimal"],
  supports: ["sideText"],
  styleHints: { photoShape: "square", contactIcons: "muted", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphDark" },
};

const LINE = "#E6E3DE";
const BAND = "#F1EFEC";
const BAND_TEXT = "#5F5B55";

export const nordic: Renderer = (data, style, ctx) => {
  const photo = photoImg(data, style);

  const details = table(
    nameLine(data, style, { size: style.fontSize + 8, weight: 400, font: style.secondaryFont }) +
      spacer(3) +
      titleLine(data.jobTitle, style, { upper: true, size: Math.max(9, style.fontSize - 4), color: style.textColor, tracking: "0.22em" }) +
      titleLine(data.company, style, { color: style.nameColor, weight: 700 }) +
      spacer(gap(style) + 6) +
      contactRows(data, style, { ctx }),
  );

  const side = sideColumn(data, style, { italic: true, size: style.fontSize - 1, font: style.secondaryFont });
  const icons = iconRow(data, style, ctx);
  const aside =
    side || icons
      ? table((side ? `<tr><td>${side}</td></tr>` + spacer(12) + shortRule(LINE) + spacer(12) : "") + (icons ? `<tr><td>${icons}</td></tr>` : ""))
      : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="22" style="width:22px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(LINE, 1, 18)}<td valign="middle">${aside}</td>` : "");

  const body = `<tr><td style="padding:20px 22px;">${table(`<tr>${row}</tr>`)}</td></tr>`;
  const footer = band(data.company, data.tagline, style, { bg: BAND, color: BAND_TEXT });
  const panel = table(body + footer, `border:1px solid ${LINE};`);

  return table(`<tr><td>${panel}</td></tr>` + closing({ ...data, tagline: "" }, style));
};
