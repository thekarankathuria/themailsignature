import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { card, closing, iconRow, nameLine, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

/** The paper tint; guards check design colours against it. */
export const EDITORIAL_SURFACE = "#F7F6F3";

export const editorialMeta: TemplateMeta = {
  id: "editorial",
  name: "Editorial",
  blurb: "A magazine masthead, a tall portrait and an italic pull quote.",
  tier: "pro",
  group: "designer",
  tags: ["classic", "creative"],
  supports: ["sideText"],
  styleHints: { photoShape: "square", contactIcons: "ink", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphDark" },
};

export const editorial: Renderer = (data, style, ctx) => {
  const rule = "#DEDAD2";
  const photo = photoImg(data, style);

  const masthead = titleLine(data.company, style, { upper: true, size: 10, color: style.textColor, tracking: "0.26em" });

  const details = table(
    nameLine(data, style, { size: style.fontSize + 9, weight: 400, font: style.secondaryFont }) +
      titleLine(data.jobTitle, style, { color: style.textColor, font: style.secondaryFont }) +
      spacer(10) +
      shortRule(style.nameColor, 36) +
      spacer(gap(style) + 8) +
      contactRows(data, style, { ctx }),
  );

  const side = sideColumn(data, style, { italic: true, size: style.fontSize + 1, color: style.nameColor, font: style.secondaryFont });
  const icons = iconRow(data, style, ctx);
  const aside =
    side || icons
      ? table((side ? `<tr><td>${side}</td></tr>` + spacer(16) : "") + (icons ? `<tr><td>${icons}</td></tr>` : ""))
      : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="22" style="width:22px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(rule, 1, 18)}<td valign="middle">${aside}</td>` : "");

  const inner = card(
    table((masthead ? masthead + spacer(14) : "") + `<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>`),
    { bg: EDITORIAL_SURFACE, pad: "20px 24px" },
  );

  return table(`<tr><td>${inner}</td></tr>` + closing(data, style));
};
