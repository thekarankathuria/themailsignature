// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb, db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import {
  createOrg,
  deleteOrg,
  findOrgForUser,
  membersOf,
  removeMember,
  renameOrg,
  roleOf,
  setAnalyticsEnabled,
  setRole,
} from "./store";
import { seatUsage, seatsAvailable } from "./seats";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

function makeUser(email: string): string {
  const id = newId();
  const now = nowIso();
  db()
    .prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)")
    .run(id, email, "x", now, now);
  return id;
}

/** An invitation row written straight to the table, for seat arithmetic. */
function makeInvitation(orgId: string, email: string, extra: { expiresAt?: string; revoked?: boolean; accepted?: boolean } = {}) {
  const now = nowIso();
  const later = new Date(Date.now() + 7 * 864e5).toISOString();
  db()
    .prepare(
      `insert into invitations (id, org_id, email, role, token_hash, invited_by, expires_at, accepted_at, revoked_at, created_at)
       values (?, ?, ?, 'member', ?, null, ?, ?, ?, ?)`,
    )
    .run(
      newId(),
      orgId,
      email,
      newId(),
      extra.expiresAt ?? later,
      extra.accepted ? now : null,
      extra.revoked ? now : null,
      now,
    );
}

describe("organizations", () => {
  it("creates an organization with its owner", () => {
    const user = makeUser("owner@example.com");
    const org = createOrg({ name: "Northbeam Studio", ownerId: user });

    expect(org.id).toMatch(/^[0-9a-f]{32}$/);
    expect(org.name).toBe("Northbeam Studio");
    expect(org.analyticsEnabled).toBe(false);
    expect(findOrgForUser(user)?.id).toBe(org.id);
    expect(roleOf(user)).toBe("owner");
    expect(membersOf(org.id)).toEqual([
      expect.objectContaining({ userId: user, email: "owner@example.com", role: "owner" }),
    ]);
  });

  it("keeps a user in at most one organization", () => {
    const user = makeUser("owner@example.com");
    const first = createOrg({ name: "First", ownerId: user });
    expect(() => createOrg({ name: "Second", ownerId: user })).toThrow();
    expect(findOrgForUser(user)?.id).toBe(first.id);
  });

  it("has no organization for a user who never joined one", () => {
    const user = makeUser("solo@example.com");
    expect(findOrgForUser(user)).toBeNull();
    expect(roleOf(user)).toBeNull();
  });

  it("renames and switches analytics", () => {
    const org = createOrg({ name: "Old name", ownerId: makeUser("owner@example.com") });
    renameOrg(org.id, "New name");
    setAnalyticsEnabled(org.id, true);
    const after = db().prepare("select * from organizations where id = ?").get(org.id) as {
      name: string;
      analytics_enabled: number;
    };
    expect(after.name).toBe("New name");
    expect(after.analytics_enabled).toBe(1);
  });

  it("changes and removes members", () => {
    const owner = makeUser("owner@example.com");
    const mate = makeUser("mate@example.com");
    const org = createOrg({ name: "Northbeam", ownerId: owner });
    db()
      .prepare("insert into memberships (id, org_id, user_id, role, created_at) values (?, ?, ?, 'member', ?)")
      .run(newId(), org.id, mate, nowIso());

    expect(roleOf(mate)).toBe("member");
    setRole(org.id, mate, "admin");
    expect(roleOf(mate)).toBe("admin");
    expect(membersOf(org.id)).toHaveLength(2);

    removeMember(org.id, mate);
    expect(roleOf(mate)).toBeNull();
    expect(findOrgForUser(mate)).toBeNull();
    expect(membersOf(org.id)).toHaveLength(1);
  });

  it("deletes memberships and invitations with the organization", () => {
    const owner = makeUser("owner@example.com");
    const org = createOrg({ name: "Northbeam", ownerId: owner });
    makeInvitation(org.id, "invited@example.com");

    deleteOrg(org.id);

    const counts = db()
      .prepare("select (select count(*) from memberships) as m, (select count(*) from invitations) as i")
      .get() as { m: number; i: number };
    expect(counts).toEqual({ m: 0, i: 0 });
    expect(findOrgForUser(owner)).toBeNull();
    // The person survives the organization.
    expect(db().prepare("select count(*) as n from users").get()).toEqual({ n: 1 });
  });
});

/** The Business subscription an organization's seats are counted against. */
function makeSubscription(orgId: string, ownerId: string, seats: number) {
  const now = nowIso();
  db()
    .prepare(
      `insert into subscriptions (id, user_id, org_id, plan, status, interval, seats, provider, created_at, updated_at)
       values (?, ?, ?, 'business', 'active', 'month', ?, 'local', ?, ?)`,
    )
    .run(newId(), ownerId, orgId, seats, now, now);
}

describe("seats", () => {
  it("counts members and invitations that are still live", () => {
    const owner = makeUser("owner@example.com");
    const org = createOrg({ name: "Northbeam", ownerId: owner });
    makeSubscription(org.id, owner, 3);
    makeInvitation(org.id, "pending@example.com");
    makeInvitation(org.id, "revoked@example.com", { revoked: true });
    makeInvitation(org.id, "expired@example.com", { expiresAt: new Date(Date.now() - 1000).toISOString() });
    makeInvitation(org.id, "joined@example.com", { accepted: true });

    // One owner plus one live invitation. Revoked, expired and already
    // accepted invitations do not hold a seat open.
    expect(seatUsage(org.id)).toEqual({ members: 1, invitations: 1, used: 2, seats: 3 });
    expect(seatsAvailable(org.id)).toBe(1);
  });

  it("reports no seats left once every one is taken", () => {
    const owner = makeUser("owner@example.com");
    const org = createOrg({ name: "Northbeam", ownerId: owner });
    makeSubscription(org.id, owner, 1);
    expect(seatsAvailable(org.id)).toBe(0);
  });

  it("offers no seats to an organization with no subscription", () => {
    const org = createOrg({ name: "Northbeam", ownerId: makeUser("owner@example.com") });
    expect(seatUsage(org.id)).toEqual({ members: 1, invitations: 0, used: 1, seats: 0 });
    expect(seatsAvailable(org.id)).toBe(0);
  });
});
