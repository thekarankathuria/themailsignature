import Link from "next/link";
import { InviteAccept, SwitchAccount } from "@/components/app/InviteAccept";
import { Logo } from "@/components/brand/Logo";
import { currentUser } from "@/lib/auth/current";
import { normaliseEmail } from "@/lib/auth/users";
import { peekInvitation } from "@/lib/teams/invitations";
import { findOrgForUser } from "@/lib/teams/store";
import "../../globals.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Join a team", robots: { index: false } };

/**
 * The page an invitation link opens. It never names the company until the
 * token has proved itself, so a guessed link tells a stranger nothing.
 */
export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = peekInvitation(token);
  const user = await currentUser();
  const next = `/invite/${encodeURIComponent(token)}`;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-4 py-10">
      <header className="mx-auto w-full max-w-md">
        <Logo height={28} />
      </header>
      <main id="main" className="mx-auto mt-8 w-full max-w-md flex-1">
        <div className="rounded-card border border-ink-200 bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-8">
          {!invitation ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-navy-900">This invitation has expired</h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Invitations work for seven days and can be used once. Ask whoever invited you to send another.
              </p>
              <Link
                href="/"
                className="mt-6 block rounded-lg bg-navy-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-navy-800"
              >
                Go to the homepage
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-navy-900">Join {invitation.orgName}</h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                You have been invited as {invitation.role === "admin" ? "an admin" : "a member"}, using{" "}
                <span className="font-medium text-navy-900">{invitation.email}</span>. Your signature will follow the
                company template, and you fill in your own details.
              </p>

              {!user ? (
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={`/signup?next=${encodeURIComponent(next)}&email=${encodeURIComponent(invitation.email)}`}
                    className="rounded-lg bg-blue-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-brand-700"
                  >
                    Create an account
                  </Link>
                  <Link
                    href={`/login?next=${encodeURIComponent(next)}`}
                    className="rounded-lg border border-ink-300 px-4 py-3 text-center text-sm font-semibold text-navy-900 hover:border-navy-900"
                  >
                    I already have an account
                  </Link>
                </div>
              ) : normaliseEmail(user.email) !== normaliseEmail(invitation.email) ? (
                <div className="mt-6">
                  <p className="rounded-lg bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
                    You are signed in as {user.email}. This invitation was sent to {invitation.email}, so sign in with
                    that address to accept it.
                  </p>
                  <SwitchAccount next={next} />
                </div>
              ) : findOrgForUser(user.id) ? (
                <p className="mt-6 rounded-lg bg-navy-50 px-4 py-3 text-sm leading-relaxed text-navy-900">
                  You are already on a team. Leave that team before joining another.
                </p>
              ) : (
                <div className="mt-6">
                  <InviteAccept token={token} orgName={invitation.orgName} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
