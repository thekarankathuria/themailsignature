import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandKitEditor } from "@/components/app/BrandKitEditor";
import { currentUser } from "@/lib/auth/current";
import { readBrandKit } from "@/lib/teams/brand";
import { canEditTemplate } from "@/lib/teams/guard";
import { findOrgForUser, roleOf } from "@/lib/teams/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Brand kit" };

export default async function BrandKitPage() {
  const user = (await currentUser())!;
  const org = findOrgForUser(user.id);
  const role = org ? roleOf(user.id) : null;
  if (!org || !role) redirect("/app/billing");
  if (!canEditTemplate(role)) redirect("/app/team");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/app/team" className="text-sm font-medium text-ink-600 hover:text-navy-900">
          Back to {org.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">Brand kit</h1>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-600">
          Approved colours, fonts and images, ready in every signature your team builds. To make something impossible to
          change rather than easy to find, lock it in the company template.
        </p>
      </div>
      <BrandKitEditor kit={readBrandKit(org.id)} />
    </div>
  );
}
