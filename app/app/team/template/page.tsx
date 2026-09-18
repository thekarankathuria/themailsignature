import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyTemplateEditor } from "@/components/app/CompanyTemplateEditor";
import { currentUser } from "@/lib/auth/current";
import { siteUrl } from "@/lib/env";
import { canEditTemplate } from "@/lib/teams/guard";
import { findOrgForUser, roleOf } from "@/lib/teams/store";
import { templateOrBlank } from "@/lib/teams/template";

export const dynamic = "force-dynamic";
export const metadata = { title: "Company template" };

export default async function CompanyTemplatePage() {
  const user = (await currentUser())!;
  const org = findOrgForUser(user.id);
  const role = org ? roleOf(user.id) : null;
  if (!org || !role) redirect("/app/billing");
  if (!canEditTemplate(role)) redirect("/app/team");

  const template = templateOrBlank(org.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/app/team" className="text-sm font-medium text-ink-600 hover:text-navy-900">
          Back to {org.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">Company template</h1>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-600">
          Build the signature your team should have, then lock the parts that must not change. Members fill in their own
          name, role and contact details around what you lock.
        </p>
      </div>
      <CompanyTemplateEditor
        orgName={org.name}
        initial={{ name: template.name, data: template.data, style: template.style, locked: template.locked }}
        assetBase={process.env.NEXT_PUBLIC_ASSET_BASE?.trim() || siteUrl()}
      />
    </div>
  );
}
