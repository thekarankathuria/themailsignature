import "../globals.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { AccountMenu } from "@/components/app/AccountMenu";
import { WorkspaceNav } from "@/components/app/WorkspaceNav";
import { currentUser } from "@/lib/auth/current";
import { planFor } from "@/lib/billing/plans";

export const metadata = { robots: { index: false, follow: false } };

/** The signed-in area. The proxy checks for a cookie; this checks the session. */
export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  if (!user) redirect("/login?next=/app/signatures");
  const plan = planFor(user.id);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-navy-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
          <Logo height={26} />
          <Link href="/editor" className="ml-auto rounded-lg bg-blue-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700">
            New signature
          </Link>
          <AccountMenu email={user.email} plan={plan} verified={Boolean(user.emailVerifiedAt)} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row">
        <WorkspaceNav />
        <main id="main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
