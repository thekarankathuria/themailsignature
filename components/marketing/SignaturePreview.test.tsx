import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/signature/templates";
import { SAMPLE_PEOPLE, TEMPLATE_SAMPLES, sampleSignature } from "@/lib/marketing/samples";
import { SignaturePreview } from "./SignaturePreview";
import { TemplateCard } from "./TemplateCard";

describe("sample data", () => {
  it("has a sample person for every template", () => {
    for (const t of TEMPLATES) expect(SAMPLE_PEOPLE[TEMPLATE_SAMPLES[t.id]]).toBeDefined();
  });

  it("uses only reserved example domains", () => {
    for (const p of Object.values(SAMPLE_PEOPLE)) expect(p.domain).toMatch(/\.example$/);
  });

  it("applies the template's style hints and the person's accent", () => {
    const { style, data } = sampleSignature(TEMPLATE_SAMPLES.portrait, "portrait");
    expect(style.templateId).toBe("portrait");
    expect(style.photoShape).toBe("circle");
    expect(style.accent).toBe(SAMPLE_PEOPLE[TEMPLATE_SAMPLES.portrait].accent);
    expect(data.email).toMatch(/@.+\.example$/);
  });

  it("throws on unknown input", () => {
    expect(() => sampleSignature("nobody", "meridian")).toThrow();
    expect(() => sampleSignature(TEMPLATE_SAMPLES.meridian, "nope")).toThrow();
  });
});

describe("SignaturePreview", () => {
  it("renders the sample person's name", () => {
    const person = SAMPLE_PEOPLE.lawyers;
    const { container } = render(<SignaturePreview personKey="lawyers" templateId="meridian" />);
    expect(container.textContent).toContain(`${person.firstName} ${person.lastName}`);
  });
});

describe("TemplateCard", () => {
  it("links into the editor with the template preselected", () => {
    const { getByRole } = render(<TemplateCard templateId="slate" />);
    expect(getByRole("link", { name: /use slate/i })).toHaveAttribute("href", "/editor?template=slate");
  });
});
