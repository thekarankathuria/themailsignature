import Link from "next/link";
import { BillingControls } from "@/components/app/BillingControls";
import { currentUser } from "@/lib/auth/current";
import { localCheckoutEnabled } from "@/lib/billing/local";
import { PLAN_NAMES, planFor, subscriptionFor } from "@/lib/billing/plans";
import { PLANS, formatPrice } from "@/lib/pricing";

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
        <div className="mt-5">
          <BillingControls plan={plan} cancelAtPeriodEnd={Boolean(subscription?.cancelAtPeriodEnd)} />
        </div>
      </section>

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
