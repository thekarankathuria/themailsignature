import Link from "next/link";
import { SignatureList, type SignatureRow } from "@/components/app/SignatureList";
import { currentUser } from "@/lib/auth/current";
import { proFeatures } from "@/lib/billing/entitlements";
import { planFor } from "@/lib/billing/plans";
import { renderSignature } from "@/lib/signature/render";
import { FREE_SIGNATURE_LIMIT, listSignatures } from "@/lib/signatures/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "My signatures" };

export default async function SignaturesPage({ searchParams }: { searchParams: Promise<{ verified?: string; reset?: string }> }) {
  const user = (await currentUser())!;
  const { verified, reset } = await searchParams;
  const plan = planFor(user.id);
  const saved = listSignatures(user.id);

  const rows: SignatureRow[] = saved.map((signature) => ({
    id: signature.id,
    name: signature.name,
    updatedAt: signature.updatedAt,
    // Relative asset URLs: these previews are shown on our own pages.
    html: renderSignature(signature.data, signature.style, { assetBase: "" }),
    proFeatures: proFeatures(signature.data, signature.style).map((f) => f.label),
  }));

  const canAddMore = plan !== "free" || saved.length < FREE_SIGNATURE_LIMIT;

  return (
    <div className="flex flex-col gap-6">
      {verified === "1" && (
        <p role="status" className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm text-navy-900">
          Your email is confirmed. Thanks.
        </p>
      )}
      {reset === "1" && (
        <p role="status" className="rounded-card border border-ink-200 bg-white px-4 py-3 text-sm text-navy-900">
          Your password was changed and other devices were signed out.
        </p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">My signatures</h1>
          <p className="mt-1 text-sm text-ink-600">
            {saved.length === 0
              ? "Nothing saved yet."
              : `${saved.length} saved${plan === "free" ? ` of ${FREE_SIGNATURE_LIMIT} on the Free plan` : ""}.`}
          </p>
        </div>
        {canAddMore ? (
          <Link href="/editor" className="rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-900">
            Create another
          </Link>
        ) : (
          <Link href="/app/billing" className="rounded-lg bg-blue-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-brand-700">
            Upgrade to save more
          </Link>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink-300 bg-white p-10 text-center">
          <p className="font-semibold text-navy-900">Your signatures will appear here</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
            Build one in the editor and it is saved to your account, ready to copy into Gmail, Outlook or Apple Mail.
          </p>
          <Link href="/editor" className="mt-5 inline-block rounded-lg bg-blue-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-brand-700">
            Open the editor
          </Link>
        </div>
      ) : (
        <SignatureList signatures={rows} canAddMore={canAddMore} />
      )}
    </div>
  );
}
