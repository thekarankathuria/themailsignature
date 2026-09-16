import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("links every legal page", () => {
    render(<SiteFooter />);
    const expected: Array<[string, string]> = [
      ["Terms of Use", "/legal/terms"],
      ["Privacy Policy", "/legal/privacy"],
      ["Cookie Policy", "/legal/cookies"],
      ["Delete your data", "/legal/data-deletion"],
    ];
    for (const [label, href] of expected) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }
  });

  it("has no placeholder links", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelectorAll('a[href="#"]')).toHaveLength(0);
  });

  it("states the current copyright year", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`${year}.*TheMailSignature`))).toBeInTheDocument();
  });
});
