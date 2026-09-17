import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Builder } from "@/components/builder/Builder";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email signature editor",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/editor" },
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { template, design } = await searchParams;
  const templateId = typeof template === "string" ? template : undefined;
  const designId = typeof design === "string" ? design : undefined;

  if (!user) {
    const query = new URLSearchParams();
    if (templateId) query.set("template", templateId);
    if (designId) query.set("design", designId);
    const next = query.size ? `/editor?${query}` : "/editor";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return <Builder initialTemplate={templateId} initialDesign={designId} />;
}
