import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  applyFilters,
  filtersToQuery,
  parseFilters,
  type BrowserItem,
} from "./template-filter";

const item = (patch: Partial<BrowserItem>): BrowserItem => ({
  id: "x",
  industry: "lawyers",
  industryName: "Lawyers",
  layoutId: "luxe",
  name: "Minimal Luxury",
  tier: "pro",
  animated: false,
  tags: ["minimal"],
  ...patch,
});

const ITEMS = [
  item({ id: "a", industry: "lawyers", tier: "free", tags: ["minimal"] }),
  item({ id: "b", industry: "lawyers", tier: "pro", tags: ["dark", "classic"] }),
  item({ id: "c", industry: "realtor", tier: "pro", tags: ["bold"], animated: true }),
];

describe("parseFilters", () => {
  it("defaults to everything", () => {
    expect(parseFilters(new URLSearchParams(), ["lawyers"])).toEqual(DEFAULT_FILTERS);
  });

  it("falls back to all for unknown values", () => {
    const f = parseFilters(new URLSearchParams("industry=astronauts&style=neon&plan=vip"), ["lawyers"]);
    expect(f).toEqual(DEFAULT_FILTERS);
  });

  it("round-trips through the query string", () => {
    const f = { industry: "lawyers", style: "dark", plan: "pro", animated: true } as const;
    expect(parseFilters(new URLSearchParams(filtersToQuery(f)), ["lawyers"])).toEqual(f);
    expect(filtersToQuery(DEFAULT_FILTERS)).toBe("");
  });
});

describe("applyFilters", () => {
  it("filters by industry, style, plan and animation", () => {
    expect(applyFilters(ITEMS, { ...DEFAULT_FILTERS, industry: "realtor" }).map((i) => i.id)).toEqual(["c"]);
    expect(applyFilters(ITEMS, { ...DEFAULT_FILTERS, style: "dark" }).map((i) => i.id)).toEqual(["b"]);
    expect(applyFilters(ITEMS, { ...DEFAULT_FILTERS, plan: "free" }).map((i) => i.id)).toEqual(["a"]);
    expect(applyFilters(ITEMS, { ...DEFAULT_FILTERS, animated: true }).map((i) => i.id)).toEqual(["c"]);
  });

  it("combines filters", () => {
    expect(applyFilters(ITEMS, { ...DEFAULT_FILTERS, industry: "lawyers", plan: "pro" }).map((i) => i.id)).toEqual(["b"]);
  });
});
