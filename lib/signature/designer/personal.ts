import { esc, gap, spacer, table, textCell } from "../html";
import { contactRows, photoImg } from "../parts";
import type { TemplateMeta } from "../types";
import { closing, iconRow, nameLine, sideLines, titleLine, type Renderer } from "./kit";

export const personalMeta: TemplateMeta = {
  id: "personal",
  name: "Personal Brand",
  blurb: "A large portrait and a stepped italic statement. Made for speakers and founders.",
  tier: "pro",
  group: "designer",
  tags: ["creative", "bold"],
  supports: ["sideText"],
  styleHints: { photoShape: "square", contactIcons: "ink", showLabels: false, secondaryFont: "georgia", iconStyle: "glyphDark" },
};

export const personal: Renderer = (data, style, ctx) => {
  const photo = photoImg(data, style);

  const details = table(
    nameLine(data, style, { size: style.fontSize + 9, weight: 400, font: style.secondaryFont }) +
      spacer(2) +
      titleLine(data.jobTitle, style, { color: style.textColor, font: style.secondaryFont }) +
      titleLine(data.company, style, { color: style.nameColor, size: Math.max(11, style.fontSize - 1) }) +
      spacer(gap(style) + 8) +
      contactRows(data, style, { ctx }) +
      (iconRow(data, style, ctx) ? spacer(12) + `<tr><td>${iconRow(data, style, ctx)}</td></tr>` : ""),
  );

  // A stepped statement: each line indented a little further than the last,
  // which reads like handwriting without needing a script font.
  const lines = sideLines(data);
  const size = style.fontSize + 6;
  const statement = lines.length
    ? table(
        lines
          .map((line, i) =>
            `<tr>${textCell(`<i>${esc(line)}</i>`, style, {
              size,
              lineHeight: Math.round(size * 1.2),
              color: style.accent,
              font: style.secondaryFont,
              extra: `padding-left:${i * 8}px;`,
            })}</tr>`,
          )
          .join(""),
      )
    : "";

  const row =
    (photo ? `<td valign="top">${photo}</td><td width="24" style="width:24px;font-size:0;">&nbsp;</td>` : "") +
    `<td valign="top">${details}</td>` +
    (statement ? `<td width="28" style="width:28px;font-size:0;">&nbsp;</td><td valign="middle">${statement}</td>` : "");

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
