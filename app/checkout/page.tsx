import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { TestCheckout } from "@/components/app/TestCheckout";
import { currentUser } from "@/lib/auth/current";
import { localCheckoutEnabled } from "@/lib/billing/local";
import { PLANS } from "@/lib/pricing";
import "../globals.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const { plan: planParam, interval } = await searchParams;
  const plan = PLANS.find((p) => p.id === planParam && p.id !== "free");
  if (!plan) redirect("/pricing");

  const user = await currentUser();
  if (!user) redirect(`/signup?next=${encodeURIComponent(`/checkout?plan=${plan.id}`)}`);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-4 py-10">
      <header className="mx-auto w-full max-w-md">
        <Logo height={28} />
      </header>
      <main id="main" className="mx-auto mt-8 w-full max-w-md flex-1">
        <div className="rounded-card border border-ink-200 bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Upgrade to {plan.name}</h1>
          <p className="mt-1 text-sm text-ink-600">Signed in as {user.email}.</p>
          {localCheckoutEnabled() ? (
            <TestCheckout plan={plan} defaultInterval={interval === "year" ? "year" : "month"} />
          ) : (
            <div className="mt-6">
              <p className="rounded-lg bg-navy-50 p-4 text-sm leading-relaxed text-navy-900">
                Card payments are not switched on yet. Get in touch and we will set your plan up by hand in the meantime.
              </p>
              <Link
                href="/contact?topic=Billing"
                className="mt-4 block rounded-lg bg-blue-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-brand-700"
              >
                Contact us
              </Link>
            </div>
          )}
          <Link href="/app/billing" className="mt-6 block text-center text-sm font-medium text-ink-600 hover:text-navy-900">
            Back to billing
          </Link>
        </div>
      </main>
    </div>
  );
}
