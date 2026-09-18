"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/current";
import { rateLimit } from "@/lib/rate-limit";
import { requireRole, TeamError, assertNotLastOwner, outranks } from "./guard";
import { acceptInvitation, invite, revokeInvitation, type InvitableRole } from "./invitations";
import { removeMember, renameOrg, roleOf, setAnalyticsEnabled, setRole, type Role } from "./store";

/**
 * Team actions. Every one resolves the caller's role from the database first,
 * so nothing the browser sends decides what it may do.
 */
export type TeamActionResult = { ok: true } | { ok: false; field: string; error: string };

const fail = (field: string, error: string): TeamActionResult => ({ ok: false, field, error });

function asFailure(error: unknown): TeamActionResult {
  if (error instanceof TeamError) return fail("form", error.message);
  throw error;
}

function refresh(): void {
  revalidatePath("/app/team");
  revalidatePath("/app/billing");
}

async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/team");
  return user;
}

function invitableRole(value: unknown): InvitableRole {
  return value === "admin" ? "admin" : "member";
}

export async function inviteAction(input: { email: string; role: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org } = requireRole(user.id, ["owner", "admin"]);
    const result = await invite({
      orgId: org.id,
      invitedBy: user.id,
      email: input.email,
      role: invitableRole(input.role),
    });
    if (!result.ok) return fail(result.field, result.error);
    refresh();
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

export async function revokeInvitationAction(input: { invitationId: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org } = requireRole(user.id, ["owner", "admin"]);
    revokeInvitation(org.id, input.invitationId);
    refresh();
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

export async function setRoleAction(input: { userId: string; role: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org, role } = requireRole(user.id, ["owner", "admin"]);
    const next = (input.role === "owner" ? "owner" : invitableRole(input.role)) as Role;

    // Nobody hands out a role they do not hold themselves.
    if (next === "owner" && role !== "owner") return fail("form", "Only an owner can make somebody else an owner.");
    if (input.userId === user.id) return fail("form", "Ask another owner to change your own role.");
    const theirs = roleOf(input.userId);
    if (!theirs) return fail("form", "That person is not on your team.");
    if (role !== "owner" && !outranks(role, theirs)) return fail("form", "You cannot change that person's role.");
    if (theirs === "owner") assertNotLastOwner(org.id, input.userId);

    setRole(org.id, input.userId, next);
    refresh();
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

export async function removeMemberAction(input: { userId: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org, role } = requireRole(user.id, ["owner", "admin"]);
    if (input.userId === user.id) return fail("form", "Leave the team from your settings instead.");
    const theirs = roleOf(input.userId);
    if (!theirs) return fail("form", "That person is not on your team.");
    if (role !== "owner" && !outranks(role, theirs)) return fail("form", "You cannot remove that person.");
    assertNotLastOwner(org.id, input.userId);

    removeMember(org.id, input.userId);
    refresh();
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

export async function renameTeamAction(input: { name: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org } = requireRole(user.id, ["owner", "admin"]);
    const name = input.name.trim();
    if (name.length < 2 || name.length > 80) return fail("name", "Enter a company name.");
    renameOrg(org.id, name);
    refresh();
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

export async function setAnalyticsAction(input: { enabled: boolean }): Promise<TeamActionResult> {
  const user = await requireUser();
  try {
    const { org } = requireRole(user.id, ["owner", "admin"]);
    setAnalyticsEnabled(org.id, input.enabled);
    refresh();
    revalidatePath("/app/team/analytics");
    return { ok: true };
  } catch (error) {
    return asFailure(error);
  }
}

/** Accepting an invitation, from the page the link opens. */
export async function acceptInvitationAction(input: { token: string }): Promise<TeamActionResult> {
  const user = await requireUser();
  const limit = rateLimit(`invite-accept:${user.id}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.ok) return fail("form", "Too many attempts. Try again in an hour.");

  const result = await acceptInvitation(input.token, user.id);
  if (!result.ok) return fail("form", result.error);
  revalidatePath("/app/team");
  redirect("/app/team?joined=1");
}
