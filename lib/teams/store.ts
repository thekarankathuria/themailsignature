import { db, transaction } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";

/**
 * Organizations and who belongs to them.
 *
 * A person belongs to at most one organization, so every question about their
 * plan and their permissions has a single answer. That rule is a unique index
 * on memberships.user_id, not a check in this file.
 */
export type Role = "owner" | "admin" | "member";

export type Org = {
  id: string;
  name: string;
  analyticsEnabled: boolean;
  createdAt: string;
};

export type Member = {
  userId: string;
  email: string;
  role: Role;
  joinedAt: string;
  emailVerified: boolean;
};

type OrgRow = { id: string; name: string; analytics_enabled: number; created_at: string };

function toOrg(row: OrgRow): Org {
  return {
    id: row.id,
    name: row.name,
    analyticsEnabled: row.analytics_enabled === 1,
    createdAt: row.created_at,
  };
}

export function createOrg({ name, ownerId }: { name: string; ownerId: string }): Org {
  const id = newId();
  const now = nowIso();
  return transaction(() => {
    db()
      .prepare("insert into organizations (id, name, created_at, updated_at) values (?, ?, ?, ?)")
      .run(id, name.trim(), now, now);
    db()
      .prepare("insert into memberships (id, org_id, user_id, role, created_at) values (?, ?, ?, 'owner', ?)")
      .run(newId(), id, ownerId, now);
    return toOrg({ id, name: name.trim(), analytics_enabled: 0, created_at: now });
  });
}

export function findOrg(orgId: string): Org | null {
  const row = db().prepare("select * from organizations where id = ?").get(orgId) as OrgRow | undefined;
  return row ? toOrg(row) : null;
}

export function findOrgForUser(userId: string): Org | null {
  const row = db()
    .prepare(
      `select o.* from organizations o
         join memberships m on m.org_id = o.id
        where m.user_id = ?`,
    )
    .get(userId) as OrgRow | undefined;
  return row ? toOrg(row) : null;
}

export function roleOf(userId: string): Role | null {
  const row = db().prepare("select role from memberships where user_id = ?").get(userId) as
    | { role: Role }
    | undefined;
  return row?.role ?? null;
}

export function membersOf(orgId: string): Member[] {
  const rows = db()
    .prepare(
      `select m.user_id, m.role, m.created_at, u.email, u.email_verified_at
         from memberships m join users u on u.id = m.user_id
        where m.org_id = ?
        order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, u.email`,
    )
    .all(orgId) as Array<{
    user_id: string;
    role: Role;
    created_at: string;
    email: string;
    email_verified_at: string | null;
  }>;
  return rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    role: row.role,
    joinedAt: row.created_at,
    emailVerified: row.email_verified_at !== null,
  }));
}

export function countOwners(orgId: string): number {
  const row = db()
    .prepare("select count(*) as n from memberships where org_id = ? and role = 'owner'")
    .get(orgId) as { n: number };
  return row.n;
}

export function addMember(orgId: string, userId: string, role: Role): void {
  db()
    .prepare("insert into memberships (id, org_id, user_id, role, created_at) values (?, ?, ?, ?, ?)")
    .run(newId(), orgId, userId, role, nowIso());
}

export function setRole(orgId: string, userId: string, role: Role): void {
  db().prepare("update memberships set role = ? where org_id = ? and user_id = ?").run(role, orgId, userId);
}

/**
 * Removing someone keeps their signatures: they stop following the company
 * template and fall back to their own plan.
 */
export function removeMember(orgId: string, userId: string): void {
  transaction(() => {
    db().prepare("update signatures set org_template_id = null where user_id = ?").run(userId);
    db().prepare("delete from memberships where org_id = ? and user_id = ?").run(orgId, userId);
  });
}

export function renameOrg(orgId: string, name: string): void {
  db()
    .prepare("update organizations set name = ?, updated_at = ? where id = ?")
    .run(name.trim(), nowIso(), orgId);
}

export function setAnalyticsEnabled(orgId: string, enabled: boolean): void {
  db()
    .prepare("update organizations set analytics_enabled = ?, updated_at = ? where id = ?")
    .run(enabled ? 1 : 0, nowIso(), orgId);
}

/** Deletes the organization and everything that hangs off it. People remain. */
export function deleteOrg(orgId: string): void {
  db().prepare("delete from organizations where id = ?").run(orgId);
}
