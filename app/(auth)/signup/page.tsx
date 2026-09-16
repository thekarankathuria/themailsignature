import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  alternates: { canonical: "/signup" },
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
        Create your account
      </h1>
      <GoogleButton />
      <SignupForm />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-brand-600 dark:text-blue-brand-300">
          Log in
        </Link>
      </p>
    </div>
  );
}
