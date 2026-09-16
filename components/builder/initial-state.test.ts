import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { withTemplate } from "./initial-state";

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
