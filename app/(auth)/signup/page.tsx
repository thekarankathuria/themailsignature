import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { EditorNotice, fromEditor, redirectIfSignedIn } from "../auth-context";

export const metadata: Metadata = {
  title: "Create your account",
  alternates: { canonical: "/signup" },
  robots: { index: false },
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string; plan?: string }> }) {
  const { next, plan } = await searchParams;
  // Paid-plan buttons on the pricing page link here; send new accounts on to checkout.
  const checkoutNext = plan === "pro" || plan === "business" ? `/checkout?plan=${plan}` : undefined;
  const destination = next ?? checkoutNext;
  await redirectIfSignedIn(destination);
  const loginHref = destination ? `/login?next=${encodeURIComponent(destination)}` : "/login";

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-navy-900">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-ink-600">Free forever. Save your signatures and copy them into any email client.</p>
      {fromEditor(destination) && <EditorNotice />}
      <SignupForm next={destination} />
      <p className="mt-6 text-center text-sm text-ink-600">
        Already have an account?{" "}
        <Link href={loginHref} className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">
          Log in
        </Link>
      </p>
    </>
  );
}
