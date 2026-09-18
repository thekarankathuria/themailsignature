"use client";

import { useState, useTransition } from "react";
import { completeTestCheckout } from "@/lib/billing/actions";
import { formatPrice, type Plan } from "@/lib/pricing";

/**
 * The stand-in for a card form while payments are not connected. It is only
 * rendered when test checkout is enabled, and it says plainly that no money
 * moves.
 */
export function TestCheckout({ plan, defaultInterval }: { plan: Plan; defaultInterval: "month" | "year" }) {
  const [interval, setInterval] = useState<"month" | "year">(defaultInterval);
  const [seats, setSeats] = useState(plan.minSeats);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const unit = interval === "year" ? plan.annual : plan.monthly;
  const total = plan.perSeat ? unit * seats : unit;

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div role="group" aria-label="Billing period" className="flex rounded-lg border border-ink-200 p-1">
        {(["month", "year"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={interval === option}
            onClick={() => setInterval(option)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              interval === option ? "bg-navy-900 text-white" : "text-ink-600 hover:text-navy-900"
            }`}
          >
            {option === "month" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      {plan.perSeat && (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          Company name
          <input
            name="companyName"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Northbeam Studio"
            className="rounded-lg border border-ink-300 px-3 py-2 font-normal"
          />
          <span className="text-xs font-normal text-ink-600">
            Your team sees this name on invitations and on the company template.
          </span>
        </label>
      )}

      {plan.perSeat && (
        <label className="flex items-center justify-between gap-4 text-sm font-medium text-navy-900">
          Seats
          <input
            type="number"
            min={plan.minSeats}
            max={200}
            value={seats}
            onChange={(event) => setSeats(Math.max(plan.minSeats, Number(event.target.value) || plan.minSeats))}
            className="w-24 rounded-lg border border-ink-300 px-3 py-2 text-right"
          />
        </label>
      )}

      <dl className="rounded-lg bg-navy-50 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-600">{plan.name}, billed {interval === "year" ? "yearly" : "monthly"}</dt>
          <dd className="font-semibold text-navy-900">{formatPrice(total)}</dd>
        </div>
        {plan.perSeat && (
          <div className="mt-1 flex justify-between text-xs text-ink-600">
            <dt>{formatPrice(unit)} per seat</dt>
            <dd>{seats} seats</dd>
          </div>
        )}
      </dl>

      <p className="rounded-lg border border-ink-200 px-4 py-3 text-xs leading-relaxed text-ink-600">
        Test checkout. No card is taken and no money moves. Your plan changes immediately so the paid features can be
        tried out.
      </p>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await completeTestCheckout({ plan: plan.id, interval, seats, companyName });
            if (result && !result.ok) setError(result.error);
          })
        }
        className="rounded-lg bg-blue-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700 disabled:opacity-60"
      >
        {pending ? "Completing..." : `Complete test purchase`}
      </button>
    </div>
  );
}
