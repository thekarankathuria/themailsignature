"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { inviteAction } from "@/lib/teams/actions";

/** Invite one person by email. A free seat is required, and checked again on the server. */
export function InviteForm({ seatsLeft, canMakeAdmin }: { seatsLeft: number; canMakeAdmin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (seatsLeft <= 0) {
    return (
      <p className="rounded-lg bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
        Every seat on your plan is taken. Add a seat on the billing page to invite somebody else.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        setSentTo("");
        startTransition(async () => {
          const result = await inviteAction({ email, role });
          if (result.ok) {
            setSentTo(email);
            setEmail("");
            router.refresh();
          } else setError(result.error);
        });
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5 text-sm font-medium text-navy-900">
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@yourcompany.com"
            className="rounded-lg border border-ink-300 px-3 py-2 font-normal"
          />
        </label>
        {canMakeAdmin && (
          <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-lg border border-ink-300 px-3 py-2 font-normal"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-brand-700 disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send invitation"}
        </button>
      </div>
      <p className="text-xs text-ink-600">
        {seatsLeft} {seatsLeft === 1 ? "seat is" : "seats are"} free. An invitation holds its seat for seven days.
      </p>
      {sentTo && (
        <p role="status" className="text-sm text-navy-900">
          Invitation sent to {sentTo}.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
