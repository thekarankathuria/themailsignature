import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Cookie Policy | TheMailSignature" },
  description:
    "Create an email signature that renders correctly in Gmail, Outlook and Apple Mail. Free, no account needed to start.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-navy-900">
        Cookie Policy
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        An email signature that renders correctly everywhere.
      </p>
    </main>
  );
}
