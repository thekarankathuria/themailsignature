import { describe, expect, it } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "./defaults";
import { contactRows, socialRow } from "./parts";
import { STATUS_COLORS, contactIconPath, socialIconPath, statusDotPath } from "./assets";

const base = "https://themailsignature.com";

describe("asset paths", () => {
  it("uses static PNG icons without animation", () => {
    expect(socialIconPath(base, DEFAULT_STYLE, "linkedin")).toBe(`${base}/i/social/dark/linkedin.png`);
  });
  it("uses animated GIF icons with animation", () => {
    const style = { ...DEFAULT_STYLE, iconAnimation: "pulse" as const, iconStyle: "circle" as const };
    expect(socialIconPath(base, style, "x")).toBe(`${base}/i/social-anim/pulse/circle/x.gif`);
  });
  it("builds contact icon paths", () => {
    expect(contactIconPath(base, "muted", "email")).toBe(`${base}/i/contact/muted/email.png`);
  });
  it("only offers palette colours for status dots", () => {
    expect(statusDotPath(base, "blink", "#0050B8")).toBe(`${base}/i/status/blink-0050b8.gif`);
    expect(statusDotPath(base, "static", "#123456")).toBe(`${base}/i/status/static-${STATUS_COLORS[0].slice(1).toLowerCase()}.gif`);
  });
});

describe("parts use the assets", () => {
  it("renders animated social icons", () => {
    const html = socialRow(DEFAULT_DATA, { ...DEFAULT_STYLE, iconAnimation: "bounce" }, { assetBase: base });
    expect(html).toContain("/i/social-anim/bounce/dark/linkedin.gif");
  });
  it("swaps letter labels for icons", () => {
    const style = { ...DEFAULT_STYLE, contactIcons: "ink" as const };
    const html = contactRows(DEFAULT_DATA, style, { ctx: { assetBase: base } });
    expect(html).toContain("/i/contact/ink/phone.png");
    expect(html).not.toContain(">P</span>");
  });
});
