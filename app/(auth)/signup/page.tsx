import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
        Create your account
      </h1>
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        or
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
      <SignupForm />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
