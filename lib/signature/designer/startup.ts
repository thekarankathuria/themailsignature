import { gap, spacer, table } from "../html";
import { contactRows } from "../parts";
import type { TemplateMeta } from "../types";
import { card, closing, iconRow, nameLine, ringedPhoto, sideColumn, statusDot, tint, titleLine, vRule, type Renderer } from "./kit";

export const startupMeta: TemplateMeta = {
  id: "startup",
  name: "Tech Startup",
  blurb: "A ringed portrait with an availability dot and a soft side card.",
  tier: "pro",
  group: "designer",
  tags: ["creative", "minimal"],
  supports: ["sideText", "statusDot"],
  styleHints: { photoShape: "circle", contactIcons: "muted", showLabels: false, iconStyle: "circle", statusDot: "static" },
};

export const startup: Renderer = (data, style, ctx) => {
  const rule = "#E6E8EC";
  const photo = ringedPhoto(data, style, tint(style.accent, 0.22));

  const details = table(
    nameLine(data, style, { size: style.fontSize + 7, suffix: statusDot(style, ctx) }) +
      titleLine(data.jobTitle, style, { color: style.textColor }) +
      titleLine(data.company, style, { color: style.accent, weight: 700 }) +
      titleLine(data.department, style, { italic: true, size: Math.max(10, style.fontSize - 2) }) +
      spacer(gap(style) + 6) +
      contactRows(data, style, { ctx }),
  );

  const side = sideColumn(data, style, { size: style.fontSize - 1, color: style.nameColor });
  const icons = iconRow(data, style, ctx);
  const aside =
    side || icons
      ? table(
          (side ? `<tr><td>${card(side, { bg: tint(style.accent, 0.08), pad: "12px 14px", radius: 10 })}</td></tr>` + spacer(16) : "") +
            (icons ? `<tr><td>${icons}</td></tr>` : ""),
        )
      : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="22" style="width:22px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(rule, 1, 18)}<td valign="middle">${aside}</td>` : "");

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
