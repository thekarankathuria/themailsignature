import type { Metadata } from "next";
import { Builder } from "@/components/builder/Builder";
import { currentUser } from "@/lib/auth/current";
import { planFor } from "@/lib/billing/plans";
import { getSignature } from "@/lib/signatures/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email signature editor",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/editor" },
};

const first = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);

/**
 * Open to everyone. Copying and saving ask for an account; `resume=1` comes
 * back from the login pages and tells the editor to save the waiting draft.
 */
export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await currentUser();
  const params = await searchParams;
  const requestedId = first(params.id);
  const signature = user && requestedId ? getSignature(user.id, requestedId) : null;

  return (
    <Builder
      initialTemplate={first(params.template)}
      initialDesign={first(params.design)}
      signedIn={Boolean(user)}
      plan={user ? planFor(user.id) : "free"}
      initialSignatureId={signature?.id}
      initialSaved={signature ? { data: signature.data, style: signature.style, name: signature.name } : undefined}
      resume={first(params.resume) === "1"}
    />
  );
}
