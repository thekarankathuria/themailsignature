"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { renameTeamAction, setAnalyticsAction } from "@/lib/teams/actions";

/** The company name and the click-counting switch. */
export function TeamSettings({ name, analyticsEnabled }: { name: string; analyticsEnabled: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [enabled, setEnabled] = useState(analyticsEnabled);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-navy-900">Team settings</h2>

      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          startTransition(async () => {
            const result = await renameTeamAction({ name: value });
            if (result.ok) router.refresh();
            else setError(result.error);
          });
        }}
      >
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5 text-sm font-medium text-navy-900">
          Company name
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="rounded-lg border border-ink-300 px-3 py-2 font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={pending || value.trim() === name}
          className="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
        >
          Save name
        </button>
      </form>

      <div className="mt-6 border-t border-ink-100 pt-5">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            disabled={pending}
            onChange={(event) => {
              const next = event.target.checked;
              setEnabled(next);
              setError("");
              startTransition(async () => {
                const result = await setAnalyticsAction({ enabled: next });
                if (result.ok) router.refresh();
                else {
                  setEnabled(!next);
                  setError(result.error);
                }
              });
            }}
            className="mt-0.5 size-4"
          />
          <span>
            <span className="font-medium text-navy-900">Count clicks on signature links</span>
            <span className="mt-1 block leading-relaxed text-ink-600">
              Links in your team&rsquo;s signatures are sent through this site so they can be counted, then go straight
              to where they point. No tracking pixel is added to anyone&rsquo;s email, and we record only the link, the
              day and a number.
            </span>
          </span>
        </label>
        {enabled && (
          <Link
            href="/app/team/analytics"
            className="mt-3 inline-block text-sm font-semibold text-blue-brand-600 hover:text-blue-brand-700"
          >
            See click counts
          </Link>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
