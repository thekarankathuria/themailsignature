// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb } from "@/lib/db";
import {
  assertNotLastOwner,
  canEditTemplate,
  canManageBilling,
  canManageMembers,
  outranks,
  requireMembership,
  requireRole,
  TeamError,
} from "./guard";
import { addMember, createOrg, type Role } from "./store";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

async function team() {
  const owner = await createUser("owner@example.com", "a sensible passphrase");
  const admin = await createUser("admin@example.com", "a sensible passphrase");
  const member = await createUser("member@example.com", "a sensible passphrase");
  const outsider = await createUser("outsider@example.com", "a sensible passphrase");
  const org = createOrg({ name: "Northbeam", ownerId: owner.id });
  addMember(org.id, admin.id, "admin");
  addMember(org.id, member.id, "member");
  return { owner, admin, member, outsider, org };
}

describe("capabilities", () => {
  const all: Role[] = ["owner", "admin", "member"];

  it("says who can do what", () => {
    expect(all.filter(canManageMembers)).toEqual(["owner", "admin"]);
    expect(all.filter(canEditTemplate)).toEqual(["owner", "admin"]);
    // Only an owner touches the money.
    expect(all.filter(canManageBilling)).toEqual(["owner"]);
  });

  it("ranks roles so nobody promotes above themselves", () => {
    expect(outranks("owner", "admin")).toBe(true);
    expect(outranks("admin", "member")).toBe(true);
    expect(outranks("admin", "owner")).toBe(false);
    expect(outranks("admin", "admin")).toBe(false);
    expect(outranks("member", "member")).toBe(false);
  });
});

describe("requireMembership", () => {
  it("returns the organization and the role", async () => {
    const { admin, org } = await team();
    const found = requireMembership(admin.id);
    expect(found.org.id).toBe(org.id);
    expect(found.role).toBe("admin");
  });

  it("refuses someone with no organization", async () => {
    const { outsider } = await team();
    expect(() => requireMembership(outsider.id)).toThrow(TeamError);
    try {
      requireMembership(outsider.id);
    } catch (error) {
      expect((error as TeamError).status).toBe(404);
    }
  });
});

describe("requireRole", () => {
  it("lets an allowed role through", async () => {
    const { owner, admin } = await team();
    expect(requireRole(owner.id, ["owner"]).role).toBe("owner");
    expect(requireRole(admin.id, ["owner", "admin"]).role).toBe("admin");
  });

  it("refuses a role that is not allowed, with 403", async () => {
    const { member, admin } = await team();
    const cases: Array<{ user: { id: string }; roles: Role[] }> = [
      { user: member, roles: ["owner", "admin"] },
      { user: admin, roles: ["owner"] },
    ];
    for (const { user, roles } of cases) {
      try {
        requireRole(user.id, roles);
        throw new Error("should have refused");
      } catch (error) {
        expect(error).toBeInstanceOf(TeamError);
        expect((error as TeamError).status).toBe(403);
      }
    }
  });
});

describe("the last owner", () => {
  it("cannot be removed or demoted", async () => {
    const { owner, org } = await team();
    expect(() => assertNotLastOwner(org.id, owner.id)).toThrow(TeamError);
  });

  it("can step back once someone else is an owner", async () => {
    const { owner, admin, org } = await team();
    const { setRole } = await import("./store");
    setRole(org.id, admin.id, "owner");
    expect(() => assertNotLastOwner(org.id, owner.id)).not.toThrow();
  });

  it("does not stand in the way of removing anyone else", async () => {
    const { member, org } = await team();
    expect(() => assertNotLastOwner(org.id, member.id)).not.toThrow();
  });
});
