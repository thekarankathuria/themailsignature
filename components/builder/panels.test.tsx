import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { TEMPLATES } from "@/lib/signature/templates";
import { StylePanel } from "./panels";
import { TemplateGrid } from "./TemplateGrid";

describe("TemplateGrid", () => {
  it("groups designer and classic layouts and badges the Pro ones", () => {
    render(<TemplateGrid data={DEFAULT_DATA} style={DEFAULT_STYLE} assetBase="" onSelect={() => {}} />);
    const designer = screen.getByRole("region", { name: "Designer layouts" });
    const classic = screen.getByRole("region", { name: "Classic templates" });
    expect(within(designer).getAllByRole("button")).toHaveLength(TEMPLATES.filter((t) => t.group === "designer").length);
    expect(within(classic).getAllByRole("button")).toHaveLength(TEMPLATES.filter((t) => t.group === "classic").length);
    expect(within(classic).getByRole("button", { name: /Meridian/ })).not.toHaveTextContent("Pro");
    expect(within(classic).getByRole("button", { name: /Ledger/ })).toHaveTextContent("Pro");
  });
});

describe("StylePanel designer controls", () => {
  it("sets the icon animation and status dot", () => {
    const setStyle = vi.fn();
    render(<StylePanel data={DEFAULT_DATA} set={() => {}} style={DEFAULT_STYLE} setStyle={setStyle} />);
    fireEvent.click(within(screen.getByRole("group", { name: "Icon animation" })).getByRole("button", { name: "Bounce" }));
    expect(setStyle).toHaveBeenCalledWith({ iconAnimation: "bounce" });
    fireEvent.click(within(screen.getByRole("group", { name: "Status dot" })).getByRole("button", { name: "Blink" }));
    expect(setStyle).toHaveBeenCalledWith({ statusDot: "blink" });
  });

  it("offers status colours only when a dot is on", () => {
    const { rerender } = render(
      <StylePanel data={DEFAULT_DATA} set={() => {}} style={DEFAULT_STYLE} setStyle={() => {}} />,
    );
    expect(screen.queryByRole("group", { name: "Status dot colour" })).toBeNull();
    rerender(
      <StylePanel data={DEFAULT_DATA} set={() => {}} style={{ ...DEFAULT_STYLE, statusDot: "static" }} setStyle={() => {}} />,
    );
    expect(within(screen.getByRole("group", { name: "Status dot colour" })).getAllByRole("button")).toHaveLength(6);
  });
});
