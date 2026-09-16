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

  it("offers a retina source for the knockout wordmark too", () => {
    render(<Logo tone="light" />);
    expect(screen.getByAltText("TheMailSignature")).toHaveAttribute(
      "srcset",
      expect.stringContaining("wordmark-light@2x.png 2x"),
    );
  });

  it("sets intrinsic width and height so the image reserves its layout box before loading", () => {
    render(<Logo height={28} />);
    const img = screen.getByAltText("TheMailSignature");
    // Real asset is 560x128 (aspect ratio 4.375:1) — see
    // scripts/gen-brand-assets.mjs. width must scale with the requested
    // render height, not be left for the browser to guess post-load.
    expect(img).toHaveAttribute("height", "28");
    expect(img).toHaveAttribute("width", "123");
  });

  it("scales the intrinsic width with a custom render height", () => {
    render(<Logo height={56} />);
    const img = screen.getByAltText("TheMailSignature");
    expect(img).toHaveAttribute("height", "56");
    expect(img).toHaveAttribute("width", "245");
  });
});
