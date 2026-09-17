import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false },
  // The reset token is in the URL; keep it out of Referer headers.
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-navy-900">Choose a new password</h1>
      {token ? (
        <div className="mt-6">
          <ResetPasswordForm token={token} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink-600">
          This page needs the link from your reset email.{" "}
          <Link href="/forgot-password" className="font-semibold text-blue-brand-600">
            Request a new link
          </Link>
          .
        </p>
      )}
    </>
  );
}
