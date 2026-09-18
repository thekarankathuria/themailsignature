import Link from "next/link";
import { redirect } from "next/navigation";
import { InviteForm } from "@/components/app/InviteForm";
import { TeamMembers } from "@/components/app/TeamMembers";
import { TeamSettings } from "@/components/app/TeamSettings";
import { currentUser } from "@/lib/auth/current";
import { listInvitations } from "@/lib/teams/invitations";
import { seatUsage } from "@/lib/teams/seats";
import { findOrgForUser, membersOf, roleOf } from "@/lib/teams/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team" };

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; joined?: string }>;
}) {
  const user = (await currentUser())!;
  const { welcome, joined } = await searchParams;
  const org = findOrgForUser(user.id);
  const role = org ? roleOf(user.id) : null;
  if (!org || !role) redirect("/app/billing");

  const members = membersOf(org.id);
  const usage = seatUsage(org.id);
  const canManage = role === "owner" || role === "admin";
  const invitations = canManage ? listInvitations(org.id) : [];

  return (
    <div className="flex flex-col gap-6">
      {welcome === "1" && (
        <p role="status" className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-navy-900">
          {org.name} is set up. Build the company template first, lock what should not change, then invite your team.
        </p>
      )}
      {joined === "1" && (
        <p role="status" className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-navy-900">
          You are on the {org.name} team. Add your own details in the editor and your signature is ready to install.
        </p>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">{org.name}</h1>
        <p className="mt-1 text-sm text-ink-600">
          {members.length} {members.length === 1 ? "person" : "people"} on {usage.seats} seats.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/app/team/template"
          className="rounded-card border border-ink-200 bg-white p-5 transition-colors hover:border-navy-900"
        >
          <h2 className="font-semibold text-navy-900">Company template</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            Set the layout, logo, colours and disclaimer once, and lock what members must not change.
          </p>
        </Link>
        <Link
          href="/app/team/brand"
          className="rounded-card border border-ink-200 bg-white p-5 transition-colors hover:border-navy-900"
        >
          <h2 className="font-semibold text-navy-900">Brand kit</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            Keep approved colours, fonts, the logo and the current banner in one place.
          </p>
        </Link>
      </div>

      {canManage && (
        <section className="rounded-card border border-ink-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-navy-900">Invite somebody</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            They get an email with a link that works for seven days. It only works for the address you send it to.
          </p>
          <div className="mt-5">
            <InviteForm seatsLeft={Math.max(0, usage.seats - usage.used)} canMakeAdmin={role === "owner"} />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-navy-900">People</h2>
        <div className="mt-3">
          <TeamMembers
            members={members.map((member) => ({
              userId: member.userId,
              email: member.email,
              role: member.role,
              emailVerified: member.emailVerified,
              isYou: member.userId === user.id,
            }))}
            invitations={invitations.map((invitation) => ({
              id: invitation.id,
              email: invitation.email,
              role: invitation.role,
              expiresAt: invitation.expiresAt,
            }))}
            canManage={canManage}
            canMakeOwner={role === "owner"}
          />
        </div>
      </section>

      {canManage && (
        <TeamSettings name={org.name} analyticsEnabled={org.analyticsEnabled} />
      )}
    </div>
  );
}
