import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { EditorNotice, fromEditor, redirectIfSignedIn } from "../auth-context";

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
  await redirectIfSignedIn(next);
  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : "/signup";

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-navy-900">Log in</h1>
      <p className="mt-1 mb-6 text-sm text-ink-600">Welcome back. Your saved signatures are waiting.</p>
      {fromEditor(next) && <EditorNotice />}
      {error === "verify" && (
        <p role="alert" className="mb-4 rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-900">
          That confirmation link has expired or was already used. Log in and request a new one from your settings.
        </p>
      )}
      <LoginForm next={next} />
      <p className="mt-6 text-center text-sm text-ink-600">
        New here?{" "}
        <Link href={signupHref} className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">
          Create a free account
        </Link>
      </p>
    </>
  );
}
