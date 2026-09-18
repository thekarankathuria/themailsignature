"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * The error page for anything that throws below the root layout.
 *
 * The visitor is told what to do next and nothing about what broke: a digest
 * or a stack trace here helps nobody except somebody probing the server.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The server logs the real error; this records it for browser-side ones.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col justify-center px-5 py-20 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-brand-600">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        That did not work
      </h1>
      <p className="mt-4 leading-relaxed text-ink-600">
        Something on our side failed. Nothing you had saved is lost. Try again, and if it keeps happening, tell us and we
        will look into it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-blue-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-ink-300 px-5 py-3 text-sm font-semibold text-navy-900 hover:border-navy-900"
        >
          Go to the homepage
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-ink-300 px-5 py-3 text-sm font-semibold text-navy-900 hover:border-navy-900"
        >
          Tell us what happened
        </Link>
      </div>
    </div>
  );
}
