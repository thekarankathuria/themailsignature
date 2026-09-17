import { AccountSettings } from "@/components/app/AccountSettings";
import { currentUser } from "@/lib/auth/current";
import { planFor } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = (await currentUser())!;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-600">Your email, password and account.</p>
      </div>
      <AccountSettings
        email={user.email}
        verified={Boolean(user.emailVerifiedAt)}
        plan={planFor(user.id)}
        memberSince={user.createdAt}
      />
    </div>
  );
}
