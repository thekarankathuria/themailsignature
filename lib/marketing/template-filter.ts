import type { StyleTag } from "@/lib/signature/types";

/** One design in the templates browser. Previews are rendered on demand. */
export type BrowserItem = {
  id: string;
  industry: string;
  industryName: string;
  layoutId: string;
  name: string;
  tier: "free" | "pro";
  animated: boolean;
  tags: StyleTag[];
};

export type Filters = {
  industry: string;
  style: StyleTag | "all";
  plan: "all" | "free" | "pro";
  animated: boolean;
};

export const STYLE_TAGS: StyleTag[] = ["minimal", "classic", "bold", "dark", "creative"];

export const DEFAULT_FILTERS: Filters = { industry: "all", style: "all", plan: "all", animated: false };

/** Reads filters from the URL, ignoring anything unrecognised. */
export function parseFilters(params: URLSearchParams, industries: string[]): Filters {
  const industry = params.get("industry") ?? "";
  const style = params.get("style") ?? "";
  const plan = params.get("plan") ?? "";
  return {
    industry: industries.includes(industry) ? industry : "all",
    style: (STYLE_TAGS as string[]).includes(style) ? (style as StyleTag) : "all",
    plan: plan === "free" || plan === "pro" ? plan : "all",
    animated: params.get("animated") === "1",
  };
}

/** The query string for a set of filters; defaults are left out. */
export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.industry !== "all") params.set("industry", filters.industry);
  if (filters.style !== "all") params.set("style", filters.style);
  if (filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.animated) params.set("animated", "1");
  return params.toString();
}

export function applyFilters(items: BrowserItem[], filters: Filters): BrowserItem[] {
  return items.filter(
    (item) =>
      (filters.industry === "all" || item.industry === filters.industry) &&
      (filters.style === "all" || item.tags.includes(filters.style)) &&
      (filters.plan === "all" || item.tier === filters.plan) &&
      (!filters.animated || item.animated),
  );
}
