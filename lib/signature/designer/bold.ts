import { esc, gap, spacer, table, textCell } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { closing, iconRow, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const boldMeta: TemplateMeta = {
  id: "bold",
  name: "Bold Modern",
  blurb: "An oversized two-line name and a short italic statement. Hard to miss.",
  tier: "pro",
  group: "designer",
  tags: ["bold"],
  supports: ["sideText"],
  styleHints: { photoShape: "square", contactIcons: "ink", showLabels: false, iconStyle: "glyphDark" },
};

export const bold: Renderer = (data, style, ctx) => {
  const rule = "#E3E5E8";
  const photo = photoImg(data, style);
  const size = style.fontSize + 16;

  // First and last name on their own lines, tight leading.
  const nameRows = [data.firstName, data.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .map(
      (part) =>
        `<tr>${textCell(esc(style.uppercaseName ? part.toUpperCase() : part), style, {
          size,
          weight: 800,
          color: style.nameColor,
          lineHeight: Math.round(size * 1.02),
          letterSpacing: "-0.02em",
        })}</tr>`,
    )
    .join("");

  const roleLine = [data.jobTitle, data.company].map((v) => v.trim()).filter(Boolean).join("  /  ");

  const details = table(
    nameRows +
      spacer(8) +
      titleLine(roleLine, style, { upper: true, size: Math.max(9, style.fontSize - 3), color: style.textColor, tracking: "0.2em" }) +
      spacer(gap(style) + 8) +
      contactRows(data, style, { ctx }),
  );

  const side = sideColumn(data, style, { italic: true, size: style.fontSize + 3, color: style.nameColor });
  const icons = iconRow(data, style, ctx);
  const aside =
    side || icons
      ? table((side ? `<tr><td>${side}</td></tr>` + spacer(14) + shortRule(style.mutedColor, 24) + spacer(14) : "") + (icons ? `<tr><td>${icons}</td></tr>` : ""))
      : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="22" style="width:22px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(rule, 1, 20)}<td valign="middle">${aside}</td>` : "");

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
