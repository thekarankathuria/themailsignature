import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Builder } from "@/components/builder/Builder";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email signature builder",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/generator" },
};

export default async function GeneratorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/generator");
  }

  return <Builder />;
}
