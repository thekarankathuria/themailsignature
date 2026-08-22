"use client";

import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ next }: { next?: string }) {
  function handleClick() {
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
  }

  // The Google provider isn't configured in Supabase yet: signInWithOAuth
  // would resolve with no error and navigate off-site to a raw GoTrue
  // "Unsupported provider" page. Self-hide until it's turned on so enabling
  // it later is a one-env-var change, with no call-site edits.
  if (process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED !== "true") {
    return null;
  }

  return (
    <>
      <Button type="button" variant="secondary" onClick={handleClick} className="w-full">
        Continue with Google
      </Button>
      <div className="flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        or
        <span className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
    </>
  );
}
