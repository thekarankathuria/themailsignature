import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  alternates: { canonical: "/login" },
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
          Something went wrong signing you in, please try again.
        </p>
      ) : null}
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        or
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
      <LoginForm next={next} />
      <p className="text-center text-sm text-ink-600 dark:text-ink-400">
        No account?{" "}
        <Link href="/signup" className="font-medium text-brand-600">
          Sign up
        </Link>
      </p>
    </div>
  );
}
