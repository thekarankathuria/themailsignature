import { countOwners, findOrgForUser, roleOf, type Org, type Role } from "./store";

/**
 * Who may do what inside an organization.
 *
 * Every team route and server action resolves the caller's membership here.
 * The browser never states its own role: it is read from the database on each
 * request, so a stale page cannot grant anything.
 */
export class TeamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "TeamError";
  }
}

const RANK: Record<Role, number> = { owner: 2, admin: 1, member: 0 };

export function canManageMembers(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export function canEditTemplate(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export function canManageBilling(role: Role): boolean {
  return role === "owner";
}

/** Whether `role` sits strictly above `other`, so nobody can promote a peer. */
export function outranks(role: Role, other: Role): boolean {
  return RANK[role] > RANK[other];
}

export type Membership = { org: Org; role: Role };

export function requireMembership(userId: string): Membership {
  const org = findOrgForUser(userId);
  const role = roleOf(userId);
  if (!org || !role) throw new TeamError(404, "You are not part of a team.");
  return { org, role };
}

export function requireRole(userId: string, roles: Role[]): Membership {
  const membership = requireMembership(userId);
  if (!roles.includes(membership.role)) {
    throw new TeamError(403, "You do not have permission to do that.");
  }
  return membership;
}

/**
 * An organization always keeps one owner, so there is always somebody who can
 * pay for it and let people in.
 */
export function assertNotLastOwner(orgId: string, userId: string): void {
  if (roleOf(userId) !== "owner") return;
  if (countOwners(orgId) <= 1) {
    throw new TeamError(400, "Make somebody else an owner first. A team needs one owner.");
  }
}
