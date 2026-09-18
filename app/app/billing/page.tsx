import Link from "next/link";
import { BillingControls } from "@/components/app/BillingControls";
import { SeatControl } from "@/components/app/SeatControl";
import { currentUser } from "@/lib/auth/current";
import { localCheckoutEnabled } from "@/lib/billing/local";
import { MIN_BUSINESS_SEATS, PLAN_NAMES, effectiveSubscription, planFor, subscriptionFor } from "@/lib/billing/plans";
import { PLANS, formatPrice } from "@/lib/pricing";
import { seatUsage } from "@/lib/teams/seats";
import { findOrgForUser, roleOf } from "@/lib/teams/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plan and billing" };

const longDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const user = (await currentUser())!;
  const { upgraded } = await searchParams;
  const plan = planFor(user.id);
  const subscription = subscriptionFor(user.id);
  const pro = PLANS.find((p) => p.id === "pro")!;
  const business = PLANS.find((p) => p.id === "business")!;

  // A member is covered by their team's plan and pays for nothing, so the
  // page shows them what they have and who to ask, and no controls at all.
  const org = findOrgForUser(user.id);
  const role = org ? roleOf(user.id) : null;
  const owner = role === "owner";
  const team = org ? { org, usage: seatUsage(org.id), subscription: effectiveSubscription(user.id) } : null;

  return (
    <div className="flex flex-col gap-6">
      {upgraded === "1" && (
        <p role="status" className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm text-navy-900">
          Your plan is active. Every layout and Pro option is now available in the editor.
        </p>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Plan and billing</h1>
        <p className="mt-1 text-sm text-ink-600">See what your plan includes and change it here.</p>
      </div>

      <section className="rounded-card border border-ink-200 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">{PLAN_NAMES[plan]}</h2>
          {subscription && plan !== "free" && (
            <p className="text-sm text-ink-600">
              {subscription.cancelAtPeriodEnd ? "Ends on " : "Renews on "}
              {longDate(subscription.currentPeriodEnd)}
              {subscription.seats > 1 && `, ${subscription.seats} seats`}
            </p>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {plan === "free"
            ? "Four classic templates, one designed template for your industry and one saved signature."
            : "Every layout and industry design, animated icons, image hosting and unlimited saved signatures."}
        </p>
        {team && !owner ? (
          <p className="mt-5 rounded-lg bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
            Your plan comes with your place on the {team.org.name} team. An owner of the team looks after the plan and
            the seats.
          </p>
        ) : (
          <div className="mt-5">
            <BillingControls plan={plan} cancelAtPeriodEnd={Boolean(subscription?.cancelAtPeriodEnd)} />
          </div>
        )}
      </section>

      {team && owner && (
        <section className="rounded-card border border-ink-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-navy-900">Seats for {team.org.name}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            Every seat is a person on your team. A pending invitation holds its seat until it is accepted or you take it
            back.
          </p>
          <div className="mt-5">
            <SeatControl
              seats={team.subscription?.seats ?? MIN_BUSINESS_SEATS}
              used={team.usage.used}
              minSeats={MIN_BUSINESS_SEATS}
            />
          </div>
          <Link href="/app/team" className="mt-4 inline-block text-sm font-semibold text-blue-brand-600 hover:text-blue-brand-700">
            Manage your team
          </Link>
        </section>
      )}

      {plan === "free" && (
        <section className="grid gap-4 sm:grid-cols-2">
          {[pro, business].map((option) => (
            <div key={option.id} className="flex flex-col rounded-card border border-ink-200 bg-white p-6">
              <h3 className="font-semibold text-navy-900">{option.name}</h3>
              <p className="mt-1 text-sm text-ink-600">{option.tagline}</p>
              <p className="mt-4 text-2xl font-bold text-navy-900">
                {formatPrice(option.monthly)}
                <span className="text-sm font-medium text-ink-500">{option.perSeat ? " per seat / month" : " / month"}</span>
              </p>
              <Link
                href={`/checkout?plan=${option.id}`}
                className="mt-5 rounded-lg bg-blue-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-brand-700"
              >
                Choose {option.name}
              </Link>
            </div>
          ))}
        </section>
      )}

      <p className="text-xs leading-relaxed text-ink-600">
        {localCheckoutEnabled()
          ? "Payments run in test mode on this machine. No card is charged and no money moves."
          : "Card payments are not switched on yet."}{" "}
        Questions about billing? <Link href="/contact" className="font-semibold text-blue-brand-600">Contact us</Link>.
      </p>
    </div>
  );
}
