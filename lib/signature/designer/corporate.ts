import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { card, closing, iconRow, nameLine, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

export const corporateMeta: TemplateMeta = {
  id: "corporate",
  name: "Modern Corporate",
  blurb: "An accent bar, a square portrait and a clear company line. Built for leadership.",
  tier: "pro",
  group: "designer",
  tags: ["classic", "bold"],
  supports: ["sideText"],
  styleHints: { photoShape: "square", contactIcons: "muted", showLabels: false, iconStyle: "glyphDark" },
};

export const corporate: Renderer = (data, style, ctx) => {
  const rule = "#E3E5E8";
  const photo = photoImg(data, style);

  const details = table(
    nameLine(data, style, { size: style.fontSize + 8, color: style.nameColor }) +
      titleLine(data.jobTitle, style, { color: style.accent, size: style.fontSize }) +
      spacer(8) +
      titleLine(data.company, style, { color: style.nameColor, weight: 700 }) +
      titleLine(data.department, style, { size: Math.max(10, style.fontSize - 3) }) +
      spacer(gap(style) + 6) +
      contactRows(data, style, { ctx }),
  );

  const side = sideColumn(data, style, { size: Math.max(11, style.fontSize - 2) });
  const icons = iconRow(data, style, ctx);
  const aside =
    side || icons
      ? table(
          (side ? `<tr><td>${side}</td></tr>` + spacer(14) + shortRule(rule) + spacer(14) : "") +
            (icons ? `<tr><td>${icons}</td></tr>` : ""),
        )
      : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="20" style="width:20px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(rule, 1, 18)}<td valign="middle">${aside}</td>` : "");

  const inner = card(table(`<tr>${row}</tr>`), {
    bg: "#FFFFFF",
    pad: "18px 22px",
    accentLeft: { color: style.accent, width: 5 },
  });

  return table(`<tr><td>${inner}</td></tr>` + closing(data, style));
};
