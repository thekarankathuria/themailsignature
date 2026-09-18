import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/current";
import { canManageMembers } from "@/lib/teams/guard";
import { clicksFor, totalClicks } from "@/lib/teams/links";
import { findOrgForUser, roleOf } from "@/lib/teams/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Click counts" };

const KIND_LABELS: Record<string, string> = {
  social: "Social profile",
  meeting: "Meeting link",
  link: "Link",
};

export default async function AnalyticsPage() {
  const user = (await currentUser())!;
  const org = findOrgForUser(user.id);
  const role = org ? roleOf(user.id) : null;
  if (!org || !role) redirect("/app/billing");
  if (!canManageMembers(role)) redirect("/app/team");

  const links = clicksFor(org.id, 30);
  const total = totalClicks(org.id, 30);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/app/team" className="text-sm font-medium text-ink-600 hover:text-navy-900">
          Back to {org.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">Click counts</h1>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-600">
          How often links in your team&rsquo;s signatures were followed in the last 30 days. A click is counted when
          somebody follows a link. No tracking pixel is added to anyone&rsquo;s email, and we record only the link, the
          day and a number.
        </p>
      </div>

      {!org.analyticsEnabled && (
        <p className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm leading-relaxed text-navy-900">
          Click counting is switched off, so nothing new is being counted. Turn it on in team settings.
        </p>
      )}

      {links.length === 0 ? (
        <p className="rounded-card border border-ink-200 bg-white px-4 py-8 text-center text-sm text-ink-600">
          Nothing counted yet. Links start counting once your team copies a signature and somebody follows one.
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-600">
            <span className="text-2xl font-bold text-navy-900">{total}</span> clicks across {links.length}{" "}
            {links.length === 1 ? "link" : "links"}.
          </p>
          <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Link</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Kind</th>
                  <th scope="col" className="px-4 py-3 font-semibold">In whose signature</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {links.map((link) => (
                  <tr key={link.id}>
                    <td className="max-w-[20rem] truncate px-4 py-3 text-navy-900">{link.url}</td>
                    <td className="px-4 py-3 text-ink-600">{KIND_LABELS[link.kind] ?? "Link"}</td>
                    <td className="px-4 py-3 text-ink-600">{link.email}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy-900">{link.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
