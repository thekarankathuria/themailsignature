"use client";

import { useState, useTransition } from "react";
import { logoutAndReturnAction } from "@/lib/auth/actions";
import { acceptInvitationAction } from "@/lib/teams/actions";

/** The one button that joins a team. */
export function InviteAccept({ token, orgName }: { token: string; orgName: string }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await acceptInvitationAction({ token });
            if (result && !result.ok) setError(result.error);
          })
        }
        className="rounded-lg bg-blue-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-brand-700 disabled:opacity-60"
      >
        {pending ? "Joining..." : `Join ${orgName}`}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** Signs out and comes back to the invitation, for the wrong-address case. */
export function SwitchAccount({ next }: { next: string }) {
  return (
    <form action={() => logoutAndReturnAction({ next })} className="mt-4">
      <button
        type="submit"
        className="block w-full rounded-lg border border-ink-300 px-4 py-3 text-center text-sm font-semibold text-navy-900 hover:border-navy-900"
      >
        Sign out and switch accounts
      </button>
    </form>
  );
}
