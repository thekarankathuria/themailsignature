import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("offers the primary navigation", () => {
    render(<SiteHeader />);
    for (const label of ["Templates", "Pricing", "For teams", "Help"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("sends the primary call to action to the editor", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Create my signature" }))
      .toHaveAttribute("href", "/editor");
  });

  it("starts with a skip link for keyboard users", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Skip to content" }))
      .toHaveAttribute("href", "#main");
  });
});
