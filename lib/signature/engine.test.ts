import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "./defaults";
import { FONT_STACKS, textCell } from "./html";
import { FREE_TEMPLATE_IDS, TEMPLATES } from "./templates";

describe("engine defaults", () => {
  it("has neutral defaults for the new fields", () => {
    expect(DEFAULT_DATA.sideText).toBe("");
    expect(DEFAULT_STYLE).toMatchObject({
      iconAnimation: "none",
      statusDot: "none",
      statusColor: "#22A55B",
      contactIcons: "none",
      secondaryFont: DEFAULT_STYLE.font,
    });
  });
});

describe("template metadata", () => {
  it("marks exactly the four classic free layouts as free", () => {
    expect([...FREE_TEMPLATE_IDS].sort()).toEqual(["meridian", "minimal", "portrait", "stack"]);
    for (const t of TEMPLATES) {
      expect(t.tier).toBe(FREE_TEMPLATE_IDS.includes(t.id) ? "free" : "pro");
      expect(t.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("textCell", () => {
  it("uses the style font unless a font is given", () => {
    expect(textCell("x", DEFAULT_STYLE)).toContain(FONT_STACKS[DEFAULT_STYLE.font]);
    expect(textCell("x", DEFAULT_STYLE, { font: "georgia" })).toContain(FONT_STACKS.georgia);
  });
});
