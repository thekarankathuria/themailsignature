import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { CLIENTS, CLIENT_GROUPS } from "@/lib/signature/clients";

export const metadata = pageMetadata("help");

export default function HelpPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Help"
          title="Add your signature to any email client"
          lede="Choose your email client for step-by-step instructions. The editor shows the same steps next to your finished signature."
        />
        <nav aria-label="Email clients" className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENT_GROUPS.map((group) => (
            <div key={group}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-600">{group}</h2>
              <ul className="mt-2 space-y-1">
                {CLIENTS.filter((c) => c.group === group).map((client) => (
                  <li key={client.id}>
                    <a href={`#${client.id}`} className="text-sm font-medium text-blue-brand-600 hover:text-blue-brand-700">
                      {client.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {CLIENTS.map((client) => (
            <article key={client.id} id={client.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy-900">{client.name}</h2>
              {client.note && <p className="mt-3 rounded-lg bg-navy-50 p-4 text-sm text-navy-900">{client.note}</p>}
              <ol className="mt-4 list-decimal space-y-2 pl-6 leading-relaxed text-ink-700">
                {client.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Troubleshooting" />
        <div className="mt-10">
          <FaqList items={FAQS.help} />
        </div>
        <p className="mt-10 text-center text-ink-600">
          Still stuck? <Link href="/contact" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">Send us a message</Link>.
        </p>
      </Section>
    </>
  );
}
