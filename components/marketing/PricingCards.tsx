"use client";

import Link from "next/link";
import { useState } from "react";
import { CLAIMS } from "@/lib/marketing/claims";
import { formatPrice, type Plan } from "@/lib/pricing";

type Cycle = "monthly" | "yearly";

export function annualMonthly(plan: Plan): number {
  return Math.round((plan.annual / 12) * 100) / 100;
}

export function PricingCards({ plans }: { plans: Plan[] }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <div>
      <div role="radiogroup" aria-label="Billing period" className="mx-auto flex w-fit rounded-full border border-ink-200 bg-white p-1">
        {(["monthly", "yearly"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={cycle === value}
            onClick={() => setCycle(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cycle === value ? "bg-navy-900 text-white" : "text-ink-600 hover:text-navy-900"
            }`}
          >
            {value === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = cycle === "monthly" ? plan.monthly : annualMonthly(plan);
          const unit = plan.perSeat ? "per seat / month" : "/ month";
          const titleId = `plan-${plan.id}`;
          return (
            <article
              key={plan.id}
              aria-labelledby={titleId}
              className={`flex flex-col rounded-card border bg-white p-7 ${
                plan.highlighted ? "border-blue-brand-600 shadow-lg shadow-blue-brand-600/10" : "border-ink-200"
              }`}
            >
              <h3 id={titleId} className="text-lg font-semibold text-navy-900">{plan.name}</h3>
              <p className="mt-1 text-ink-600">{plan.tagline}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-navy-900">{formatPrice(price)}</span>
                <span className="text-sm text-ink-500">{unit}</span>
              </p>
              <p className="mt-1 min-h-5 text-sm text-ink-500">
                {plan.monthly === 0
                  ? "Free for as long as you like"
                  : cycle === "yearly"
                    ? `${formatPrice(plan.annual)} billed yearly${plan.perSeat ? " per seat" : ""}`
                    : "Billed monthly"}
                {plan.perSeat && `, minimum ${plan.minSeats} seats`}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-700">
                {plan.features.map((id) => (
                  <li key={id} className="flex gap-2">
                    <span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span>
                    {CLAIMS[id].label}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-8 rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-blue-brand-600 text-white hover:bg-blue-brand-700"
                    : "border border-ink-300 text-navy-900 hover:border-navy-900"
                }`}
              >
                {plan.cta.label}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
