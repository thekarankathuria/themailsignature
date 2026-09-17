import { describe, expect, it } from "vitest";
import { FREE_TEMPLATE_IDS, TEMPLATE_BY_ID } from "@/lib/signature/templates";
import { renderSignature } from "@/lib/signature/render";
import { INDUSTRIES } from "./industries";
import { ALL_DESIGNS, DESIGN_BY_ID, designSignature, designsFor } from "./designs";

describe("designs", () => {
  it("gives every industry at least six designs with exactly one free", () => {
    for (const industry of INDUSTRIES) {
      const designs = designsFor(industry.slug);
      expect(designs.length).toBeGreaterThanOrEqual(6);
      const free = designs.filter((d) => d.tier === "free");
      expect(free).toHaveLength(1);
      expect(FREE_TEMPLATE_IDS).toContain(free[0].layoutId);
      expect(designs[0].tier).toBe("free");
      expect(new Set(designs.map((d) => d.layoutId)).size).toBe(designs.length);
      expect(designs.some((d) => d.animated)).toBe(true);
    }
  });

  it("uses real layouts, unique ids and renders every design", () => {
    expect(Object.keys(DESIGN_BY_ID)).toHaveLength(ALL_DESIGNS.length);
    for (const design of ALL_DESIGNS) {
      expect(TEMPLATE_BY_ID[design.layoutId]).toBeDefined();
      const { data, style } = designSignature(design);
      expect(renderSignature(data, style, { assetBase: "" })).toContain(data.firstName);
    }
  });

  it("marks animated designs honestly", () => {
    for (const design of ALL_DESIGNS) {
      const { style } = designSignature(design);
      expect(design.animated).toBe(style.iconAnimation !== "none" || style.statusDot === "blink");
      if (design.tier === "free") expect(design.animated).toBe(false);
    }
  });
});

describe("homepage design strip", () => {
  it("points at real designs from different industries, one animated", async () => {
    const { HOME } = await import("./home");
    const picked = HOME.templates.designIds.map((id) => DESIGN_BY_ID[id]);
    expect(picked.every(Boolean)).toBe(true);
    expect(new Set(picked.map((d) => d.industry)).size).toBe(picked.length);
    expect(picked.some((d) => d.animated)).toBe(true);
  });
});
