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

  return (
    <Button type="button" variant="secondary" onClick={handleClick} className="w-full">
      Continue with Google
    </Button>
  );
}
