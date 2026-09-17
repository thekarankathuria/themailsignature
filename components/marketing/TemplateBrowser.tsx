"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DESIGN_BY_ID, designSignature } from "@/lib/marketing/designs";
import {
  STYLE_TAGS,
  applyFilters,
  filtersToQuery,
  parseFilters,
  type BrowserItem,
  type Filters,
} from "@/lib/marketing/template-filter";
import { renderSignature } from "@/lib/signature/render";
import { DesignCard } from "./DesignCard";

const PAGE = 12;

const STYLE_LABELS: Record<string, string> = {
  all: "All styles",
  minimal: "Minimal",
  classic: "Classic",
  bold: "Bold",
  dark: "Dark",
  creative: "Creative",
};

function previewHtml(id: string): string {
  const design = DESIGN_BY_ID[id];
  if (!design) return "";
  const { data, style } = designSignature(design);
  return renderSignature(data, style, { assetBase: "" });
}

export function TemplateBrowser({
  items,
  industries,
}: {
  items: BrowserItem[];
  industries: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const slugs = useMemo(() => industries.map((i) => i.slug), [industries]);
  const query = params.toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query), slugs), [query, slugs]);
  const [limit, setLimit] = useState(PAGE);

  // With one industry chosen, its free design leads; otherwise keep the
  // server's order, which mixes industries and layouts.
  const results = useMemo(() => {
    const matched = applyFilters(items, filters);
    return filters.industry === "all"
      ? matched
      : [...matched].sort((a, b) => Number(b.tier === "free") - Number(a.tier === "free"));
  }, [items, filters]);
  const shown = results.slice(0, limit);

  function update(patch: Partial<Filters>) {
    const next = filtersToQuery({ ...filters, ...patch });
    setLimit(PAGE);
    router.replace(next ? `${pathname}?${next}#library` : `${pathname}#library`, { scroll: false });
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-navy-900 bg-navy-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-card border border-ink-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="industry-filter" className="text-sm font-medium text-navy-900">
              Industry
            </label>
            <select
              id="industry-filter"
              value={filters.industry}
              onChange={(e) => update({ industry: e.target.value })}
              className="min-w-64 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-navy-900 focus:border-blue-brand-600 focus:outline-none focus:ring-2 focus:ring-blue-brand-600/20"
            >
              <option value="all">All industries</option>
              {industries.map((industry) => (
                <option key={industry.slug} value={industry.slug}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Plan" className="flex gap-2">
              {(["all", "free", "pro"] as const).map((plan) => (
                <button key={plan} type="button" aria-pressed={filters.plan === plan} onClick={() => update({ plan })} className={chip(filters.plan === plan)}>
                  {plan === "all" ? "Any plan" : plan === "free" ? "Free" : "Pro"}
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="mx-1 hidden h-6 w-px bg-ink-200 sm:block" />
            <button type="button" aria-pressed={filters.animated} onClick={() => update({ animated: !filters.animated })} className={chip(filters.animated)}>
              Animated only
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-ink-100 pt-4 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium text-navy-900">Style</span>
          <div role="group" aria-label="Style" className="flex flex-wrap gap-2">
            {(["all", ...STYLE_TAGS] as const).map((tag) => (
              <button key={tag} type="button" aria-pressed={filters.style === tag} onClick={() => update({ style: tag })} className={chip(filters.style === tag)}>
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p role="status" className="mt-6 text-sm text-ink-600">
        {results.length === 1 ? "1 design" : `${results.length} designs`}
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-ink-300 p-10 text-center">
          <p className="font-semibold text-navy-900">No designs match those filters.</p>
          <button type="button" onClick={() => update({ industry: "all", style: "all", plan: "all", animated: false })} className="mt-3 text-sm font-semibold text-blue-brand-600 hover:text-blue-brand-700">
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-6 md:grid-cols-2">
          {shown.map((item) => (
            <li key={item.id}>
              <DesignCard item={item} html={previewHtml(item.id)} />
            </li>
          ))}
        </ul>
      )}

      {results.length > shown.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE)}
            className="rounded-lg border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 active:scale-[0.98]"
          >
            Show {Math.min(PAGE, results.length - shown.length)} more
          </button>
        </div>
      )}
    </div>
  );
}
