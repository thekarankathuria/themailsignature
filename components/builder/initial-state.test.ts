import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { ALL_DESIGNS } from "@/lib/marketing/designs";
import { withDesign, withTemplate } from "./initial-state";

const saved = { data: DEFAULT_DATA, style: { ...DEFAULT_STYLE, photoShape: "square" as const } };

describe("withTemplate", () => {
  it("leaves the state alone without a template", () => {
    expect(withTemplate(saved, undefined)).toBe(saved);
  });

  it("ignores unknown template ids", () => {
    expect(withTemplate(saved, "<script>")).toBe(saved);
  });

  it("applies the template and its style hints, keeping the details", () => {
    const next = withTemplate(saved, "portrait");
    expect(next.style.templateId).toBe("portrait");
    expect(next.style.photoShape).toBe("circle");
    expect(next.data).toBe(saved.data);
  });
});

describe("withDesign", () => {
  const design = ALL_DESIGNS.find((d) => d.layoutId === "luxe")!;

  it("ignores unknown ids", () => {
    expect(withDesign(saved, "nope")).toBe(saved);
    expect(withDesign(saved, undefined)).toBe(saved);
  });

  it("applies layout and styling but keeps personal details", () => {
    const next = withDesign({ ...saved, data: { ...saved.data, firstName: "Kim" } }, design.id);
    expect(next.style.templateId).toBe("luxe");
    expect(next.style.accent).toBe(design.style.accent);
    expect(next.data.firstName).toBe("Kim");
  });

  it("fills side text and tagline only when empty", () => {
    const empty = withDesign({ ...saved, data: { ...saved.data, sideText: "", tagline: "" } }, design.id);
    expect(empty.data.sideText).toBe(design.data.sideText);
    const mine = withDesign({ ...saved, data: { ...saved.data, sideText: "Mine", tagline: "Also mine" } }, design.id);
    expect(mine.data.sideText).toBe("Mine");
    expect(mine.data.tagline).toBe("Also mine");
  });
});
