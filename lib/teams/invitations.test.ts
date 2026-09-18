// @vitest-environment node
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser } from "@/lib/auth/users";
import { grantBusiness } from "@/lib/billing/local";
import { planFor } from "@/lib/billing/plans";
import { closeDb, db } from "@/lib/db";
import { listOutbox } from "@/lib/mail";
import { __resetRateLimitStore } from "@/lib/rate-limit";
import { acceptInvitation, invite, listInvitations, peekInvitation, revokeInvitation } from "./invitations";
import { createOrg } from "./store";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  vi.stubEnv("OUTBOX_DIR", mkdtempSync(join(tmpdir(), "tms-outbox-")));
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themailsignature.test");
  __resetRateLimitStore();
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

async function team(seats = 3) {
  const owner = await createUser("owner@example.com", "a sensible passphrase");
  const org = createOrg({ name: "Northbeam", ownerId: owner.id });
  grantBusiness(owner.id, { orgId: org.id, seats, interval: "month" });
  return { owner, org };
}

async function inviteOne(orgId: string, ownerId: string, email = "mate@example.com") {
  const result = await invite({ orgId, invitedBy: ownerId, email, role: "member" });
  if (!result.ok) throw new Error(`invite failed: ${result.error}`);
  return result.token;
}

describe("inviting", () => {
  it("creates an invitation, emails it, and stores only the hash", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);

    expect(token).toMatch(/^[A-Za-z0-9_-]{20,}$/);
    const rows = db().prepare("select * from invitations").all() as Array<{ token_hash: string; email: string }>;
    expect(rows).toHaveLength(1);
    expect(rows[0].token_hash).not.toBe(token);
    expect(rows[0].email).toBe("mate@example.com");

    const mail = listOutbox().find((m) => m.to === "mate@example.com");
    expect(mail?.subject).toContain("Northbeam");
    expect(mail?.text).toContain(token);
  });

  it("refuses when every seat is taken, naming the number of seats", async () => {
    // Three seats: the owner, then two invitations, and the team is full.
    const { owner, org } = await team(3);
    await inviteOne(org.id, owner.id, "one@example.com");
    await inviteOne(org.id, owner.id, "two@example.com");

    const result = await invite({ orgId: org.id, invitedBy: owner.id, email: "three@example.com", role: "member" });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.error).toContain("3 seats");
  });

  it("refuses an address that is already on the team or already invited", async () => {
    const { owner, org } = await team();
    await inviteOne(org.id, owner.id);
    const again = await invite({ orgId: org.id, invitedBy: owner.id, email: "MATE@example.com", role: "member" });
    expect(again.ok).toBe(false);

    const self = await invite({ orgId: org.id, invitedBy: owner.id, email: "owner@example.com", role: "member" });
    expect(self.ok).toBe(false);
  });

  it("refuses an address that is not an address", async () => {
    const { owner, org } = await team();
    expect((await invite({ orgId: org.id, invitedBy: owner.id, email: "not-an-email", role: "member" })).ok).toBe(false);
  });
});

describe("accepting", () => {
  it("adds the member once and puts them on the team's plan", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    const mate = await createUser("mate@example.com", "a sensible passphrase");

    const joined = await acceptInvitation(token, mate.id);
    expect(joined).toMatchObject({ ok: true });
    expect(planFor(mate.id)).toBe("business");

    const again = await acceptInvitation(token, mate.id);
    expect(again.ok).toBe(false);
    expect(listInvitations(org.id)).toHaveLength(0);
  });

  it("refuses a token offered by a different address", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    const stranger = await createUser("stranger@example.com", "a sensible passphrase");

    const result = await acceptInvitation(token, stranger.id);
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(result.error).toContain("mate@example.com");
    expect(planFor(stranger.id)).toBe("free");
  });

  it("refuses an expired invitation", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    const mate = await createUser("mate@example.com", "a sensible passphrase");

    vi.setSystemTime(Date.now() + 8 * 24 * 60 * 60 * 1000);
    expect(peekInvitation(token)).toBeNull();
    expect((await acceptInvitation(token, mate.id)).ok).toBe(false);
  });

  it("refuses a revoked invitation", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    const pending = listInvitations(org.id);
    expect(pending).toHaveLength(1);

    revokeInvitation(org.id, pending[0].id);
    const mate = await createUser("mate@example.com", "a sensible passphrase");
    expect(peekInvitation(token)).toBeNull();
    expect((await acceptInvitation(token, mate.id)).ok).toBe(false);
  });

  it("refuses somebody who is already in another organization", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    const mate = await createUser("mate@example.com", "a sensible passphrase");
    createOrg({ name: "Their own company", ownerId: mate.id });

    const result = await acceptInvitation(token, mate.id);
    expect(result.ok).toBe(false);
  });

  it("shows the company and the role before anyone joins", async () => {
    const { owner, org } = await team();
    const token = await inviteOne(org.id, owner.id);
    expect(peekInvitation(token)).toMatchObject({
      orgName: "Northbeam",
      email: "mate@example.com",
      role: "member",
    });
    expect(peekInvitation("not-a-real-token")).toBeNull();
  });
});
