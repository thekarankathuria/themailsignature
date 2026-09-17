import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { closing, iconRow, nameLine, sideColumn, sideLines, tint, titleLine, vRule, type Renderer } from "./kit";

export const studioMeta: TemplateMeta = {
  id: "studio",
  name: "Creative Studio",
  blurb: "A portrait on a soft colour disc, an italic line and a playful side list.",
  tier: "pro",
  group: "designer",
  tags: ["creative"],
  supports: ["sideText"],
  styleHints: { photoShape: "circle", contactIcons: "muted", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphDark" },
};

export const studio: Renderer = (data, style, ctx) => {
  const lines = sideLines(data);
  // Four lines split two and two: an italic statement on the left and an
  // uppercase list on the right. Fewer lines are all statement, so the list
  // never shows a single orphaned word.
  const statement = lines.length === 4 ? lines.slice(0, 2) : lines;
  const list = lines.length === 4 ? lines.slice(2) : [];

  const photo = photoImg(data, style);
  const disc = photo
    ? table(
        `<tr><td bgcolor="${tint(style.accent, 0.16)}" style="background-color:${tint(style.accent, 0.16)};padding:8px;border-radius:${Math.round(((data.photoSize || 92) + 16) / 2)}px;line-height:0;font-size:0;">${photo}</td></tr>`,
      )
    : "";

  const left = table(
    (statement.length
      ? `<tr><td>${sideColumn(data, style, { italic: true, size: style.fontSize, color: style.nameColor, font: style.secondaryFont, lines: statement })}</td></tr>` +
        spacer(14)
      : "") +
      (iconRow(data, style, ctx) ? `<tr><td>${iconRow(data, style, ctx)}</td></tr>` : ""),
  );

  const details = table(
    nameLine(data, style, { size: style.fontSize + 9, weight: 400, font: style.secondaryFont }) +
      spacer(3) +
      titleLine(data.jobTitle, style, { upper: true, size: Math.max(9, style.fontSize - 4), color: style.textColor, tracking: "0.24em" }) +
      titleLine(data.company, style, { color: style.nameColor, weight: 700 }) +
      spacer(gap(style) + 6) +
      contactRows(data, style, { ctx }),
  );

  const right = list.length
    ? `${vRule(style.accent, 1, 16)}<td valign="middle">${sideColumn(data, style, { upper: true, size: 8, lines: list })}</td>`
    : "";

  const row =
    `<td valign="bottom">${left}</td><td width="18" style="width:18px;font-size:0;">&nbsp;</td>` +
    (disc ? `<td valign="top">${disc}</td><td width="18" style="width:18px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    right;

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
