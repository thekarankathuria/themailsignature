import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("links home and names the brand for screen readers", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: "TheMailSignature home" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses the knockout wordmark on dark surfaces", () => {
    render(<Logo tone="light" />);
    expect(screen.getByAltText("TheMailSignature")).toHaveAttribute(
      "src",
      expect.stringContaining("wordmark-light"),
    );
  });

  it("uses the navy wordmark by default", () => {
    render(<Logo />);
    const img = screen.getByAltText("TheMailSignature");
    expect(img.getAttribute("src")).toContain("wordmark");
    expect(img.getAttribute("src")).not.toContain("light");
  });
});
