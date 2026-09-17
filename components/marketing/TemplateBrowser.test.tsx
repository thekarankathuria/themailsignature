import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BrowserItem } from "@/lib/marketing/template-filter";
import { ALL_DESIGNS } from "@/lib/marketing/designs";

let search = "";
const replace = vi.fn((url: string) => {
  search = url.includes("?") ? url.slice(url.indexOf("?") + 1).replace(/#.*$/, "") : "";
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/templates",
  useSearchParams: () => new URLSearchParams(search),
}));

const { TemplateBrowser } = await import("./TemplateBrowser");

const ITEMS: BrowserItem[] = ALL_DESIGNS.slice(0, 30).map((d) => ({
  id: d.id,
  industry: d.industry,
  industryName: d.industry,
  layoutId: d.layoutId,
  name: d.name,
  tier: d.tier,
  animated: d.animated,
  tags: ["minimal"],
}));
const INDUSTRIES = [...new Set(ITEMS.map((i) => i.industry))].map((slug) => ({ slug, name: slug }));

beforeEach(() => {
  search = "";
  replace.mockClear();
});

describe("TemplateBrowser", () => {
  it("shows twelve designs, then more on request", () => {
    render(<TemplateBrowser items={ITEMS} industries={INDUSTRIES} />);
    expect(screen.getAllByRole("article")).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "Show 12 more" }));
    expect(screen.getAllByRole("article")).toHaveLength(24);
  });

  it("writes filters to the URL", () => {
    render(<TemplateBrowser items={ITEMS} industries={INDUSTRIES} />);
    fireEvent.click(within(screen.getByRole("group", { name: "Plan" })).getByRole("button", { name: "Free" }));
    expect(replace).toHaveBeenCalledWith("/templates?plan=free#library", { scroll: false });
  });

  it("renders only matching designs from the URL, each linking to the editor", () => {
    search = "plan=free";
    render(<TemplateBrowser items={ITEMS} industries={INDUSTRIES} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(ITEMS.filter((i) => i.tier === "free").length);
    for (const card of cards) {
      expect(within(card).getByText("Free")).toBeInTheDocument();
      expect(within(card).getByRole("link").getAttribute("href")).toMatch(/^\/editor\?design=/);
    }
  });

  it("offers a way out of an empty result", () => {
    search = "plan=free&animated=1";
    render(<TemplateBrowser items={ITEMS} industries={INDUSTRIES} />);
    expect(screen.getByText("No designs match those filters.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(replace).toHaveBeenCalledWith("/templates#library", { scroll: false });
  });
});
