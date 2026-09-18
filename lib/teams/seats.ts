import { db } from "@/lib/db";
import { nowIso } from "@/lib/db/ids";

/**
 * Seat arithmetic.
 *
 * A pending invitation holds a seat open. Without that, three seats could be
 * offered to ten people and whoever accepted last would find the team full,
 * which is a worse conversation than "you need another seat" up front.
 */
export type SeatUsage = {
  members: number;
  invitations: number;
  used: number;
  seats: number;
};

export function seatUsage(orgId: string): SeatUsage {
  const now = nowIso();
  const row = db()
    .prepare(
      `select
         (select count(*) from memberships where org_id = :org) as members,
         (select count(*) from invitations
           where org_id = :org and accepted_at is null and revoked_at is null and expires_at > :now) as invitations,
         (select coalesce(seats, 0) from subscriptions where org_id = :org and status = 'active') as seats`,
    )
    .get({ org: orgId, now }) as { members: number; invitations: number; seats: number | null };

  const seats = row.seats ?? 0;
  return {
    members: row.members,
    invitations: row.invitations,
    used: row.members + row.invitations,
    seats,
  };
}

export function seatsAvailable(orgId: string): number {
  const usage = seatUsage(orgId);
  return Math.max(0, usage.seats - usage.used);
}
