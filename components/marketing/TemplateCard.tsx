import Link from "next/link";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import { TEMPLATE_SAMPLES } from "@/lib/marketing/samples";
import { SignaturePreview } from "./SignaturePreview";

export function TemplateCard({ templateId }: { templateId: string }) {
  const template = TEMPLATE_BY_ID[templateId];
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  return (
    <article className="flex flex-col rounded-card border border-ink-200 bg-white">
      <div className="flex min-h-56 items-center justify-center border-b border-ink-100 p-6">
        <SignaturePreview personKey={TEMPLATE_SAMPLES[templateId]} templateId={templateId} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-semibold text-navy-900">{template.name}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-600">{template.blurb}</p>
        <Link
          href={`/editor?template=${template.id}`}
          aria-label={`Use ${template.name}`}
          className="mt-4 text-sm font-semibold text-blue-brand-600 hover:text-blue-brand-700"
        >
          Use this template →
        </Link>
      </div>
    </article>
  );
}
