import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccountGate } from "./AccountGate";
import { ProBar } from "./ProBar";
import { UpgradeNotice } from "./UpgradeNotice";
import { authHref, clearUiState, readUiState, saveUiState } from "./editor-session";

afterEach(() => {
  clearUiState();
  vi.restoreAllMocks();
});

describe("editor UI state", () => {
  it("round-trips and ignores anything odd", () => {
    saveUiState({ clientId: "outlook-windows", signatureId: "abc" });
    expect(readUiState()).toEqual({ clientId: "outlook-windows", signatureId: "abc" });
    localStorage.setItem("tms.editor.ui", "{not json");
    expect(readUiState()).toEqual({});
    localStorage.setItem("tms.editor.ui", JSON.stringify({ clientId: 42 }));
    expect(readUiState()).toEqual({ clientId: undefined, signatureId: undefined });
  });

  it("builds auth links that come back to the editor", () => {
    expect(authHref("signup", "?design=lawyers-luxe")).toBe(
      "/signup?next=%2Feditor%3Fdesign%3Dlawyers-luxe%26resume%3D1",
    );
    expect(authHref("login", "")).toBe("/login?next=%2Feditor%3Fresume%3D1");
  });
});

const FEATURES = [
  { id: "layout" as const, label: "designer layout" },
  { id: "animation" as const, label: "animated icons" },
];

describe("ProBar", () => {
  it("says nothing when no Pro features are used", () => {
    const { container } = render(<ProBar features={[]} plan="free" onSwitchToFree={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("warns free users and offers a way out", () => {
    const onSwitch = vi.fn();
    render(<ProBar features={FEATURES} plan="free" onSwitchToFree={onSwitch} />);
    expect(screen.getByText("Uses Pro features")).toBeInTheDocument();
    expect(screen.getByText("designer layout, animated icons")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Switch to free options" }));
    expect(onSwitch).toHaveBeenCalled();
  });

  it("just confirms for paid plans", () => {
    render(<ProBar features={FEATURES} plan="pro" onSwitchToFree={() => {}} />);
    expect(screen.getByText("Pro features in use")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Switch to free options" })).toBeNull();
  });
});

describe("AccountGate", () => {
  it("links to signup and login, keeping the editor query", () => {
    render(<AccountGate search="?template=slate" onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Create free account" })).toHaveAttribute(
      "href",
      "/signup?next=%2Feditor%3Ftemplate%3Dslate%26resume%3D1",
    );
    expect(within(dialog).getByRole("link", { name: "I already have an account" })).toHaveAttribute(
      "href",
      "/login?next=%2Feditor%3Ftemplate%3Dslate%26resume%3D1",
    );
  });

  it("closes on Escape and on the close button", () => {
    const onClose = vi.fn();
    render(<AccountGate search="" onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe("UpgradeNotice", () => {
  it("explains what needs Pro and offers both ways forward", () => {
    const onSwitch = vi.fn();
    render(<UpgradeNotice features={FEATURES} onSwitchToFree={onSwitch} onDismiss={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("designer layout, animated icons");
    expect(screen.getByRole("link", { name: "Upgrade to Pro" })).toHaveAttribute("href", "/checkout?plan=pro");
    fireEvent.click(screen.getByRole("button", { name: "Switch to free options" }));
    expect(onSwitch).toHaveBeenCalled();
  });
});
