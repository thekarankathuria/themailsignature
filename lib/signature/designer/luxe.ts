import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { closing, iconColumn, nameLine, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const luxeMeta: TemplateMeta = {
  id: "luxe",
  name: "Minimal Luxury",
  blurb: "Round portrait, fine rules and a serif name. Quiet and expensive-looking.",
  tier: "pro",
  group: "designer",
  tags: ["minimal", "classic"],
  supports: ["sideText"],
  styleHints: { photoShape: "circle", secondaryFont: "georgia", contactIcons: "ink", showLabels: false },
};

export const luxe: Renderer = (data, style, ctx) => {
  const rule = "#D9D6D0";
  const photo = photoImg(data, style);
  const side = sideColumn(data, style, { upper: true, size: 8, color: style.mutedColor });
  const media = table(
    (photo ? `<tr><td align="center">${photo}</td></tr>` : "") +
      (side ? spacer(22) + `<tr><td>${side}</td></tr>` : ""),
  );

  const details = table(
    nameLine(data, style, { size: style.fontSize + 12, weight: 400, font: style.secondaryFont }) +
      spacer(4) +
      titleLine(data.jobTitle, style, { upper: true, tracking: "0.22em", size: Math.max(9, style.fontSize - 3), color: style.textColor }) +
      titleLine(data.company, style, { size: style.fontSize, color: style.nameColor }) +
      spacer(gap(style) + 8) +
      contactRows(data, style, { ctx }),
  );

  const icons = iconColumn(data, style, ctx);
  const row =
    (media ? `<td valign="top">${media}</td>${vRule(rule)}` : "") +
    `<td valign="top">${details}</td>` +
    (icons ? `${vRule(rule, 1, 16)}<td valign="middle">${icons}</td>` : "");

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
