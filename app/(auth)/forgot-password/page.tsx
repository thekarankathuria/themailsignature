import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-navy-900">Reset your password</h1>
      <p className="mt-1 mb-6 text-sm text-ink-600">Enter your account email and we will send you a reset link.</p>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-ink-600">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">
          Log in
        </Link>
      </p>
    </>
  );
}
