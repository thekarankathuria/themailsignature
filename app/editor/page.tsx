import type { Metadata } from "next";
import { Builder } from "@/components/builder/Builder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email signature editor",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/editor" },
};

/** Open to everyone. Copying and saving ask the visitor to sign in. */
export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { template, design } = await searchParams;
  const templateId = typeof template === "string" ? template : undefined;
  const designId = typeof design === "string" ? design : undefined;

  return <Builder initialTemplate={templateId} initialDesign={designId} />;
}
