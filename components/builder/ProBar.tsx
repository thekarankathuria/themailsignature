"use client";

import { Sparkle } from "@phosphor-icons/react";
import type { ProFeature } from "@/lib/billing/entitlements";
import type { PlanId } from "@/lib/billing/plans";

/**
 * Says, while the signature is being built, which parts of it need a paid
 * plan. Free users see it as a warning with a way out; paid users see a quiet
 * confirmation that the extras are theirs.
 */
export function ProBar({
  features,
  plan,
  onSwitchToFree,
}: {
  features: ProFeature[];
  plan: PlanId;
  onSwitchToFree: () => void;
}) {
  if (features.length === 0) return null;
  const list = features.map((f) => f.label).join(", ");
  const paid = plan !== "free";

  return (
    <div
      className={
        paid
          ? "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] border border-ink-200 bg-ink-50 px-3 py-2 text-xs text-ink-700 dark:border-ink-800 dark:bg-ink-950 dark:text-ink-300"
          : "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] border border-blue-brand-200 bg-blue-brand-50 px-3 py-2 text-xs text-navy-900 dark:border-blue-brand-900 dark:bg-blue-brand-950 dark:text-blue-brand-100"
      }
    >
      <span className="flex items-center gap-1.5 font-semibold">
        <Sparkle size={14} weight="fill" aria-hidden />
        {paid ? "Pro features in use" : "Uses Pro features"}
      </span>
      <span className="min-w-0 flex-1">{list}</span>
      {!paid && (
        <button
          type="button"
          onClick={onSwitchToFree}
          className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline"
        >
          Switch to free options
        </button>
      )}
    </div>
  );
}
