"use client";

import type { ProFeature } from "./editor-session";

/**
 * Shown when a Free account tries to copy a signature that uses Pro features.
 * The signature stays saved and editable; only copying waits for the upgrade.
 */
export function UpgradeNotice({
  features,
  onSwitchToFree,
  onDismiss,
}: {
  features: ProFeature[];
  onSwitchToFree: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-[14px] border border-blue-brand-200 bg-blue-brand-50 p-4 dark:border-blue-brand-900 dark:bg-blue-brand-950"
    >
      <h3 className="text-sm font-semibold text-navy-900 dark:text-blue-brand-100">
        Upgrade to copy this signature
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-navy-900/80 dark:text-blue-brand-100/80">
        It uses {features.map((f) => f.label).join(", ")}, which {features.length === 1 ? "is" : "are"} part of Pro.
        Your signature stays saved either way.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href="/checkout?plan=pro"
          className="rounded-lg bg-blue-brand-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-brand-700"
        >
          Upgrade to Pro
        </a>
        <button
          type="button"
          onClick={onSwitchToFree}
          className="rounded-lg border border-ink-300 px-3.5 py-2 text-xs font-semibold text-navy-900 transition-colors hover:border-navy-900 dark:border-ink-700 dark:text-ink-100"
        >
          Switch to free options
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-3.5 py-2 text-xs font-semibold text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
