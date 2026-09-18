"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  removeMemberAction,
  revokeInvitationAction,
  setRoleAction,
  type TeamActionResult,
} from "@/lib/teams/actions";
import type { Role } from "@/lib/teams/store";

export type MemberRow = {
  userId: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  isYou: boolean;
};

export type InvitationRow = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

/**
 * The team list. Admins may change roles and remove people; the server checks
 * the same rules again, so this only decides what is worth showing.
 */
export function TeamMembers({
  members,
  invitations,
  canManage,
  canMakeOwner,
}: {
  members: MemberRow[];
  invitations: InvitationRow[];
  canManage: boolean;
  canMakeOwner: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function run(action: () => Promise<TeamActionResult>) {
    setError("");
    startTransition(async () => {
      const result = await action();
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          {error}
        </p>
      )}

      <ul className="divide-y divide-ink-100 rounded-card border border-ink-200 bg-white">
        {members.map((member) => (
          <li key={member.userId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-navy-900">
                {member.email}
                {member.isYou && <span className="ml-2 text-xs font-normal text-ink-600">(you)</span>}
              </p>
              {!member.emailVerified && <p className="text-xs text-ink-600">Has not confirmed their email yet.</p>}
            </div>
            {canManage && !member.isYou ? (
              <label className="text-sm">
                <span className="sr-only">Role for {member.email}</span>
                <select
                  value={member.role}
                  disabled={pending}
                  onChange={(event) => run(() => setRoleAction({ userId: member.userId, role: event.target.value }))}
                  className="rounded-lg border border-ink-300 px-2.5 py-1.5"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  {canMakeOwner && <option value="owner">Owner</option>}
                </select>
              </label>
            ) : (
              <span className="text-sm text-ink-600">{ROLE_LABELS[member.role]}</span>
            )}
            {canManage && !member.isYou && (
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm(`Remove ${member.email} from the team? Their signatures stay with them.`)) {
                    run(() => removeMemberAction({ userId: member.userId }));
                  }
                }}
                className="text-sm text-ink-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {invitations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Invitations waiting</h3>
          <ul className="mt-2 divide-y divide-ink-100 rounded-card border border-ink-200 bg-white">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900">{invitation.email}</p>
                  <p className="text-xs text-ink-600">
                    Invited as {invitation.role}. This seat is held until{" "}
                    {new Date(invitation.expiresAt).toLocaleDateString()}.
                  </p>
                </div>
                {canManage && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => revokeInvitationAction({ invitationId: invitation.id }))}
                    className="text-sm text-ink-600 hover:text-red-700"
                  >
                    Take the seat back
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
