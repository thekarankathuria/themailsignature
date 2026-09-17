import { esc, gap, spacer, table, textCell } from "../html";
import { contactRows, logoImg } from "../parts";
import type { SignatureData, SignatureStyle, TemplateMeta } from "../types";
import { closing, iconRow, nameLine, titleLine, type Renderer } from "./kit";

export const monogramMeta: TemplateMeta = {
  id: "monogram",
  name: "Monogram",
  blurb: "A bold initials block leads; your logo sits quietly under the details.",
  tier: "pro",
  group: "designer",
  tags: ["classic", "minimal"],
  omits: ["photo"],
  styleHints: { contactIcons: "muted", showLabels: false, iconStyle: "glyphDark" },
};

function initials(data: SignatureData): string {
  const source = data.company.trim() || [data.firstName, data.lastName].join(" ");
  return source
    .split(/\s+/)
    .filter((word) => word && !/^(and|of|the|&)$/i.test(word))
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

/** The initials on an accent square. */
function mark(data: SignatureData, style: SignatureStyle): string {
  const letters = initials(data);
  if (!letters) return "";
  return table(
    `<tr><td width="64" height="64" align="center" valign="middle" bgcolor="${style.accent}" style="width:64px;height:64px;background-color:${style.accent};border-radius:6px;">` +
      `${table(`<tr>${textCell(esc(letters), style, { size: 24, weight: 700, color: "#FFFFFF", lineHeight: 64, align: "center" })}</tr>`, "width:100%;")}` +
      `</td></tr>`,
  );
}

export const monogram: Renderer = (data, style, ctx) => {
  const block = mark(data, style);
  const logo = data.logoUrl.trim() ? logoImg({ ...data, logoWidth: Math.min(data.logoWidth || 100, 100) }) : "";
  const icons = iconRow(data, style, ctx);

  const details = table(
    nameLine(data, style, { size: style.fontSize + 6 }) +
      titleLine(data.jobTitle, style, { color: style.textColor }) +
      titleLine(data.company, style, { color: style.accent, weight: 700 }) +
      spacer(gap(style) + 6) +
      contactRows(data, style, { ctx }) +
      (icons ? spacer(12) + `<tr><td>${icons}</td></tr>` : "") +
      (logo ? spacer(14) + `<tr><td>${logo}</td></tr>` : ""),
  );

  const row =
    (block
      ? `<td valign="top">${block}</td><td width="20" style="width:20px;font-size:0;">&nbsp;</td>` +
        `<td width="2" bgcolor="${style.accent}" style="width:2px;background-color:${style.accent};font-size:0;line-height:0;">&nbsp;</td>` +
        `<td width="20" style="width:20px;font-size:0;">&nbsp;</td>`
      : "") +
    `<td valign="top">${details}</td>`;

  return table(`<tr><td>${table(`<tr>${row}</tr>`)}</td></tr>` + closing(data, style));
};
