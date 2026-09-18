import { hashToken, newToken } from "@/lib/auth/tokens";
import { findUserById, normaliseEmail } from "@/lib/auth/users";
import { siteUrl } from "@/lib/env";
import { db, transaction } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { sendMail } from "@/lib/mail";
import * as templates from "@/lib/mail/templates";
import { rateLimit } from "@/lib/rate-limit";
import { seatUsage } from "./seats";
import { addMember, findOrg, findOrgForUser, type Role } from "./store";

/**
 * Invitations to join an organization.
 *
 * Like every other token here, only the SHA-256 is stored. An invitation is
 * bound to the address it was sent to, so forwarding one to a colleague does
 * not quietly add a stranger to the company's plan.
 */
export type InvitableRole = Exclude<Role, "owner">;

export type Invitation = {
  id: string;
  email: string;
  role: InvitableRole;
  invitedBy: string | null;
  expiresAt: string;
  createdAt: string;
};

export type InviteResult = { ok: true; token: string } | { ok: false; field: string; error: string };
export type AcceptResult = { ok: true; orgId: string } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const fail = (field: string, error: string): InviteResult => ({ ok: false, field, error });

export function invitationLink(token: string): string {
  return `${siteUrl()}/invite/${token}`;
}

export async function invite({
  orgId,
  invitedBy,
  email: raw,
  role,
}: {
  orgId: string;
  invitedBy: string;
  email: string;
  role: InvitableRole;
}): Promise<InviteResult> {
  const email = normaliseEmail(raw);
  if (!EMAIL.test(email) || email.length > 254) return fail("email", "Enter a valid email address.");

  const limit = rateLimit(`invite:${orgId}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!limit.ok) return fail("form", "That is a lot of invitations at once. Try again in an hour.");

  const org = findOrg(orgId);
  if (!org) return fail("form", "That team no longer exists.");

  const existing = db()
    .prepare(
      `select 1 from memberships m join users u on u.id = m.user_id
        where m.org_id = ? and u.email = ? collate nocase`,
    )
    .get(orgId, email);
  if (existing) return fail("email", "That person is already on your team.");

  const pending = db()
    .prepare(
      `select 1 from invitations
        where org_id = ? and email = ? collate nocase
          and accepted_at is null and revoked_at is null and expires_at > ?`,
    )
    .get(orgId, email, nowIso());
  if (pending) return fail("email", "That address has already been invited.");

  const usage = seatUsage(orgId);
  if (usage.used >= usage.seats) {
    const seats = `${usage.seats} seat${usage.seats === 1 ? "" : "s"}`;
    return fail("form", `Your plan has ${seats} and they are all taken. Add a seat to invite somebody else.`);
  }

  const token = newToken();
  db()
    .prepare(
      `insert into invitations (id, org_id, email, role, token_hash, invited_by, expires_at, created_at)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      newId(),
      orgId,
      email,
      role,
      hashToken(token),
      invitedBy,
      new Date(Date.now() + LIFETIME_MS).toISOString(),
      nowIso(),
    );

  const inviter = findUserById(invitedBy);
  const mail = templates.teamInvite({
    orgName: org.name,
    invitedBy: inviter?.email ?? null,
    role,
    url: invitationLink(token),
  });
  await sendMail({ to: email, ...mail });

  return { ok: true, token };
}

type Row = {
  id: string;
  org_id: string;
  email: string;
  role: InvitableRole;
  invited_by: string | null;
  expires_at: string;
  created_at: string;
};

/** What the invitation page shows before anyone commits to anything. */
export function peekInvitation(
  token: string,
): { id: string; orgId: string; orgName: string; email: string; role: InvitableRole } | null {
  const row = liveRow(token);
  if (!row) return null;
  const org = findOrg(row.org_id);
  if (!org) return null;
  return { id: row.id, orgId: org.id, orgName: org.name, email: row.email, role: row.role };
}

function liveRow(token: string): Row | undefined {
  if (!token || token.length > 100) return undefined;
  const row = db()
    .prepare(
      `select * from invitations
        where token_hash = ? and accepted_at is null and revoked_at is null and expires_at > ?`,
    )
    .get(hashToken(token), nowIso()) as Row | undefined;
  return row;
}

export async function acceptInvitation(token: string, userId: string): Promise<AcceptResult> {
  const row = liveRow(token);
  if (!row) return { ok: false, error: "That invitation has expired or has already been used." };

  const user = findUserById(userId);
  if (!user) return { ok: false, error: "Sign in to accept this invitation." };
  if (normaliseEmail(user.email) !== normaliseEmail(row.email)) {
    return {
      ok: false,
      error: `This invitation was sent to ${row.email}. Sign in with that address to accept it.`,
    };
  }
  if (findOrgForUser(userId)) {
    return { ok: false, error: "You are already part of a team. Leave it before joining another." };
  }

  const org = findOrg(row.org_id);
  if (!org) return { ok: false, error: "That team no longer exists." };

  const usage = seatUsage(row.org_id);
  if (usage.members >= usage.seats) {
    return { ok: false, error: "That team has no seats left. Ask an owner to add one." };
  }

  transaction(() => {
    addMember(row.org_id, userId, row.role);
    db().prepare("update invitations set accepted_at = ? where id = ?").run(nowIso(), row.id);
  });

  const mail = templates.joinedTeam(org.name);
  await sendMail({ to: user.email, ...mail });
  return { ok: true, orgId: row.org_id };
}

/** Invitations that are still worth showing: not accepted, revoked or expired. */
export function listInvitations(orgId: string): Invitation[] {
  const rows = db()
    .prepare(
      `select * from invitations
        where org_id = ? and accepted_at is null and revoked_at is null and expires_at > ?
        order by created_at`,
    )
    .all(orgId, nowIso()) as Row[];
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

export function revokeInvitation(orgId: string, invitationId: string): void {
  db()
    .prepare("update invitations set revoked_at = ? where id = ? and org_id = ? and accepted_at is null")
    .run(nowIso(), invitationId, orgId);
}
