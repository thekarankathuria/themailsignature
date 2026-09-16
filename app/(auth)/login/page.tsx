import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-100">
        Log in
      </h1>
      {error ? (
        <p className="text-sm text-red-600">
          We couldn&apos;t complete that sign-in link. If you already confirmed
          your email, log in with your password below.
        </p>
      ) : null}
      <GoogleButton next={next} />
      <LoginForm next={next} />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        No account?{" "}
        <Link href="/signup" className="font-medium text-blue-brand-600 dark:text-blue-brand-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
