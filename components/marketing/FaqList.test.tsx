import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqList, faqSchema } from "./FaqList";

const items = [
  { q: "Does it work in Outlook?", a: "Yes, it uses table-based HTML." },
  { q: "Can I change fonts?", a: "Yes, from the style panel." },
];

describe("FaqList", () => {
  it("renders every question and answer", () => {
    render(<FaqList items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
  });

  it("emits FAQPage structured data by default", () => {
    const { container } = render(<FaqList items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual(faqSchema(items));
  });

  it("can skip structured data", () => {
    const { container } = render(<FaqList items={items} schema={false} />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("escapes markup-breaking characters in the JSON", () => {
    const { container } = render(<FaqList items={[{ q: "</script>?", a: "a" }]} />);
    expect(container.querySelector("script")!.innerHTML).not.toContain("</script>");
  });
});

describe("faqSchema", () => {
  it("maps questions to schema.org Question entities", () => {
    expect(faqSchema(items)).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
  });
});
