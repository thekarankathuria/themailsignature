import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "../defaults";
import { card, sideColumn, sideLines, vRule } from "./kit";

describe("kit", () => {
  it("splits side text into at most four clean lines", () => {
    expect(sideLines({ ...DEFAULT_DATA, sideText: " People \n\nIdeas\nProgress\nMore\nToo many " })).toEqual([
      "People", "Ideas", "Progress", "More",
    ]);
  });

  it("escapes side text and uppercases on request", () => {
    const html = sideColumn({ ...DEFAULT_DATA, sideText: "<b>x</b>" }, DEFAULT_STYLE, { upper: true });
    expect(html).toContain("&lt;B&gt;X&lt;/B&gt;");
    expect(html).not.toContain("<b>");
  });

  it("returns nothing for empty side text", () => {
    expect(sideColumn(DEFAULT_DATA, DEFAULT_STYLE, {})).toBe("");
  });

  it("paints filled cells for Outlook", () => {
    expect(card("x", { bg: "#1E1F22" })).toMatch(/bgcolor="#1E1F22"[^>]*background-color:#1E1F22/);
    expect(vRule("#DDDDDD")).toContain("background-color:#DDDDDD");
  });
});
