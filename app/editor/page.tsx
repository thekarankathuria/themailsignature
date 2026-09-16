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

export default async function EditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/editor");
  }

  return <Builder />;
}
