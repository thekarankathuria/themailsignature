import Link from "next/link";
import type { BrowserItem } from "@/lib/marketing/template-filter";

/**
 * One design: a scaled live preview, its name and industry, and plan badges.
 * `html` comes from the signature engine, which escapes every field
 * (scripts/check-render.ts), so injecting it is safe.
 */
export function DesignCard({
  item,
  html,
  href = `/editor?design=${item.id}`,
  headingLevel = "h3",
}: {
  item: BrowserItem;
  html: string;
  href?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className="@container flex flex-col overflow-hidden rounded-card border border-ink-200 bg-white transition-colors hover:border-ink-300">
      <div className="h-[160px] overflow-hidden border-b border-ink-100 bg-white px-4 pt-4 @[420px]:h-[200px] @[520px]:h-[248px]">
        <div
          inert
          aria-hidden="true"
          className="w-[620px] origin-top-left [&_img]:max-w-none scale-[0.5] @[420px]:scale-[0.64] @[520px]:scale-[0.8]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className="flex flex-1 items-end justify-between gap-4 p-5">
        <div className="min-w-0">
          <Heading className="font-semibold text-navy-900">{item.name}</Heading>
          <p className="mt-0.5 text-sm text-ink-600">{item.industryName}</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                item.tier === "free" ? "bg-ink-100 text-ink-800" : "bg-blue-brand-50 text-blue-brand-700"
              }`}
            >
              {item.tier === "free" ? "Free" : "Pro"}
            </span>
            {item.animated && (
              <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-900">Animated</span>
            )}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`Use ${item.name} for ${item.industryName}`}
          className="shrink-0 rounded-lg border border-ink-300 px-3.5 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 active:scale-[0.98]"
        >
          Use design
        </Link>
      </div>
    </article>
  );
}
