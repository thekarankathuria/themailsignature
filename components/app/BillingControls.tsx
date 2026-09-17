"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cancelPlanAction, resumePlanAction } from "@/lib/billing/actions";
import type { PlanId } from "@/lib/billing/plans";

/** Cancel or resume a paid plan, or start one from the Free plan. */
export function BillingControls({ plan, cancelAtPeriodEnd }: { plan: PlanId; cancelAtPeriodEnd: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError("");
    startTransition(async () => {
      const result = await action();
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  if (plan === "free") {
    return (
      <Link href="/checkout?plan=pro" className="inline-block rounded-lg bg-blue-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-brand-700">
        Upgrade to Pro
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {cancelAtPeriodEnd ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(resumePlanAction)}
          className="rounded-lg bg-blue-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-brand-700 disabled:opacity-60"
        >
          Keep my plan
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Cancel at the end of the current period? You keep Pro features until then.")) run(cancelPlanAction);
          }}
          className="rounded-lg border border-ink-300 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-900 disabled:opacity-60"
        >
          Cancel plan
        </button>
      )}
      {error && <span role="alert" className="text-sm text-red-700">{error}</span>}
    </div>
  );
}
