// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUser } from "@/lib/auth/users";
import { MIN_BUSINESS_SEATS } from "@/lib/billing/plans";
import { planFor, subscriptionFor } from "@/lib/billing/plans";
import { closeDb } from "@/lib/db";
import { seatUsage } from "./seats";
import { addMember, findOrgForUser, roleOf } from "./store";
import { changeSeats, cleanSeats, MAX_SEATS, startBusiness } from "./subscribe";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

describe("starting Business", () => {
  it("creates the organization, the owner and the subscription together", async () => {
    const user = await createUser("owner@example.com", "a sensible passphrase");
    const result = startBusiness({ userId: user.id, companyName: "Northbeam Studio", seats: 5, interval: "month" });

    expect(result).toMatchObject({ ok: true });
    expect(findOrgForUser(user.id)?.name).toBe("Northbeam Studio");
    expect(roleOf(user.id)).toBe("owner");
    expect(planFor(user.id)).toBe("business");
    expect(subscriptionFor(user.id)?.seats).toBe(5);
  });

  it("wants a company name", async () => {
    const user = await createUser("owner@example.com", "a sensible passphrase");
    expect(startBusiness({ userId: user.id, companyName: "  ", seats: 3, interval: "month" }).ok).toBe(false);
    expect(findOrgForUser(user.id)).toBeNull();
    expect(planFor(user.id)).toBe("free");
  });

  it("holds seats to the minimum and the maximum", () => {
    expect(cleanSeats(1)).toBe(MIN_BUSINESS_SEATS);
    expect(cleanSeats(0)).toBe(MIN_BUSINESS_SEATS);
    expect(cleanSeats("nonsense")).toBe(MIN_BUSINESS_SEATS);
    expect(cleanSeats(10_000)).toBe(MAX_SEATS);
    expect(cleanSeats(7.6)).toBe(7);
  });

  it("does not create a second organization for an owner buying again", async () => {
    const user = await createUser("owner@example.com", "a sensible passphrase");
    const first = startBusiness({ userId: user.id, companyName: "Northbeam", seats: 3, interval: "month" });
    const second = startBusiness({ userId: user.id, companyName: "Another name", seats: 6, interval: "year" });

    expect(second).toMatchObject({ ok: true });
    if (first.ok && second.ok) expect(second.orgId).toBe(first.orgId);
    expect(findOrgForUser(user.id)?.name).toBe("Northbeam");
    expect(subscriptionFor(user.id)?.seats).toBe(6);
    expect(subscriptionFor(user.id)?.interval).toBe("year");
  });

  it("refuses a member who tries to buy over their team's plan", async () => {
    const owner = await createUser("owner@example.com", "a sensible passphrase");
    const mate = await createUser("mate@example.com", "a sensible passphrase");
    const started = startBusiness({ userId: owner.id, companyName: "Northbeam", seats: 3, interval: "month" });
    if (!started.ok) throw new Error("setup failed");
    addMember(started.orgId, mate.id, "member");

    const result = startBusiness({ userId: mate.id, companyName: "Mine", seats: 3, interval: "month" });
    expect(result).toMatchObject({ ok: false });
    expect(subscriptionFor(mate.id)).toBeNull();
  });
});

describe("changing seats", () => {
  it("will not go below the seats in use", async () => {
    const owner = await createUser("owner@example.com", "a sensible passphrase");
    const started = startBusiness({ userId: owner.id, companyName: "Northbeam", seats: 6, interval: "month" });
    if (!started.ok) throw new Error("setup failed");
    for (const email of ["a@example.com", "b@example.com", "c@example.com"]) {
      const user = await createUser(email, "a sensible passphrase");
      addMember(started.orgId, user.id, "member");
    }

    expect(seatUsage(started.orgId).used).toBe(4);
    const tooFew = changeSeats(started.orgId, owner.id, 3);
    expect(tooFew).toMatchObject({ ok: false });
    if (!tooFew.ok) expect(tooFew.error).toContain("4 of your seats");

    expect(changeSeats(started.orgId, owner.id, 4).ok).toBe(true);
    expect(subscriptionFor(owner.id)?.seats).toBe(4);
  });
});
