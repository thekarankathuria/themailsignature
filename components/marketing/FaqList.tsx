import type { Faq } from "@/lib/marketing/faqs";
import { JsonLd } from "./JsonLd";

export function faqSchema(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Native <details> accordion: works without JavaScript and is keyboard-accessible. */
export function FaqList({ items, schema = true }: { items: Faq[]; schema?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink-200 rounded-card border border-ink-200 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden="true" className="text-xl text-blue-brand-600 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink-600">{item.a}</p>
        </details>
      ))}
      {schema && <JsonLd data={faqSchema(items)} />}
    </div>
  );
}
