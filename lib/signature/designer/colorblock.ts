import { gap, spacer, table } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { closing, iconRow, nameLine, tint, titleLine, type Renderer } from "./kit";

export const colorblockMeta: TemplateMeta = {
  id: "colorblock",
  name: "Color Block",
  blurb: "Your name on a solid band of brand colour, details beneath.",
  tier: "pro",
  group: "designer",
  tags: ["bold", "creative"],
  styleHints: { photoShape: "circle", contactIcons: "muted", showLabels: false, iconStyle: "circle" },
};

export const colorblock: Renderer = (data, style, ctx) => {
  // Text on the band is white; guards require every design's accent to hold
  // 4.5:1 against it.
  const onBand = "#FFFFFF";
  const subtle = tint(style.accent, 0.12);

  const header = table(
    nameLine(data, style, { size: style.fontSize + 7, color: onBand }) +
      titleLine([data.jobTitle, data.company].map((v) => v.trim()).filter(Boolean).join(", "), style, {
        color: subtle,
      }),
  );

  const photo = photoImg({ ...data, photoSize: Math.min(data.photoSize || 92, 72) }, style);
  const icons = iconRow(data, style, ctx);
  const body = table(
    `<tr>` +
      (photo ? `<td valign="top">${photo}</td><td width="20" style="width:20px;font-size:0;">&nbsp;</td>` : "") +
      `<td valign="top">${table(contactRows(data, style, { ctx }) + (icons ? spacer(gap(style) + 8) + `<tr><td>${icons}</td></tr>` : ""))}</td>` +
      `</tr>`,
  );

  const panel = table(
    `<tr><td bgcolor="${style.accent}" style="background-color:${style.accent};padding:16px 22px;border-radius:6px 6px 0 0;">${header}</td></tr>` +
      `<tr><td style="padding:18px 22px;border:1px solid #E3E5E8;border-top:0;border-radius:0 0 6px 6px;">${body}</td></tr>`,
  );

  return table(`<tr><td>${panel}</td></tr>` + closing(data, style));
};
