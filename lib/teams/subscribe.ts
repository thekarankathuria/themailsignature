import { MAX_SEATS, MIN_BUSINESS_SEATS } from "@/lib/billing/limits";
import { grantBusiness, setSeats } from "@/lib/billing/local";
import type { Interval } from "@/lib/billing/plans";
import { transaction } from "@/lib/db";
import { seatUsage } from "./seats";
import { createOrg, findOrgForUser, roleOf } from "./store";

/**
 * Buying the Business plan, and changing how many seats it has.
 *
 * The first purchase creates the organization and its owner in the same
 * transaction as the subscription, so there is never an organization that
 * nobody owns or a Business subscription with no team behind it.
 */
export type BusinessResult = { ok: true; orgId: string } | { ok: false; error: string };

export { MAX_SEATS, MIN_BUSINESS_SEATS };

export function cleanSeats(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return MIN_BUSINESS_SEATS;
  return Math.max(MIN_BUSINESS_SEATS, Math.min(MAX_SEATS, n));
}

export function startBusiness({
  userId,
  companyName,
  seats,
  interval,
}: {
  userId: string;
  companyName: string;
  seats: number;
  interval: Interval;
}): BusinessResult {
  const name = companyName.trim();
  if (name.length < 2 || name.length > 80) return { ok: false, error: "Enter your company name." };

  const wanted = cleanSeats(seats);
  const existing = findOrgForUser(userId);

  if (existing) {
    // Already on a team: this is a seat change, and only an owner may make it.
    if (roleOf(userId) !== "owner") {
      return { ok: false, error: "Your team already has a plan. Ask an owner to change it." };
    }
    return changeSeats(existing.id, userId, wanted, interval);
  }

  return transaction(() => {
    const org = createOrg({ name, ownerId: userId });
    grantBusiness(userId, { orgId: org.id, seats: wanted, interval });
    return { ok: true as const, orgId: org.id };
  });
}

/** Seats never drop below the people already using them. */
export function changeSeats(orgId: string, ownerId: string, seats: number, interval?: Interval): BusinessResult {
  const wanted = cleanSeats(seats);
  const usage = seatUsage(orgId);
  if (wanted < usage.used) {
    return {
      ok: false,
      error: `${usage.used} of your seats are in use. Remove somebody from the team before going below that.`,
    };
  }
  if (interval) grantBusiness(ownerId, { orgId, seats: wanted, interval });
  else setSeats(orgId, wanted);
  return { ok: true, orgId };
}
