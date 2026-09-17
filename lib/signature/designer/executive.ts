import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { SignatureStyle, TemplateMeta } from "../types";
import { card, closing, iconRow, nameLine, shortRule, sideColumn, titleLine, vRule, type Renderer } from "./kit";

/** The card's own surface; guards check design accents against it. */
export const EXECUTIVE_SURFACE = "#1E1F22";

export const executiveMeta: TemplateMeta = {
  id: "executive",
  name: "Executive Premium",
  blurb: "A charcoal card with light serif type. Confident without being loud.",
  tier: "pro",
  group: "designer",
  tags: ["dark", "classic"],
  supports: ["sideText"],
  styleHints: { photoShape: "circle", contactIcons: "light", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphLight" },
};

export const executive: Renderer = (data, style, ctx) => {
  // The card sets its own text colours so any palette stays legible on it;
  // the accent still shows in links.
  const local: SignatureStyle = {
    ...style,
    nameColor: "#F4F4F5",
    textColor: "#D9DADC",
    mutedColor: "#A3A6AB",
    linkColor: "#D9DADC",
    iconStyle: style.iconStyle === "glyphDark" || style.iconStyle === "light" ? "glyphLight" : style.iconStyle,
    contactIcons: style.contactIcons === "none" ? "none" : "light",
  };
  const rule = "#3A3C40";

  const photo = photoImg(data, local);
  const icons = iconRow(data, local, ctx);
  const media = table(
    (photo ? `<tr><td align="center">${photo}</td></tr>` : "") +
      (icons ? spacer(16) + `<tr><td align="center">${icons}</td></tr>` : ""),
  );

  const details = table(
    nameLine(data, local, { size: local.fontSize + 10, weight: 400, font: local.secondaryFont }) +
      spacer(4) +
      titleLine(data.jobTitle, local, { color: local.textColor, font: local.secondaryFont }) +
      titleLine(data.company, local, { color: local.textColor, font: local.secondaryFont }) +
      spacer(gap(local) + 8) +
      contactRows(data, local, { ctx }),
  );

  const side = sideColumn(data, local, { upper: true, size: 8, color: local.mutedColor });
  const aside = side ? table(`<tr><td>${side}</td></tr>` + spacer(14) + shortRule(local.mutedColor, 24)) : "";

  const row =
    (photo || icons ? `<td valign="top">${media}</td><td width="24" style="width:24px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (aside ? `${vRule(rule, 1, 20)}<td valign="middle">${aside}</td>` : "");

  const inner = card(table(`<tr>${row}</tr>`), { bg: EXECUTIVE_SURFACE, pad: "24px 28px", radius: 4 });
  return table(`<tr><td>${inner}</td></tr>` + closing(data, style));
};
