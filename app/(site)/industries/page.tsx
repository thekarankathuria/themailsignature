import Link from "next/link";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { INDUSTRIES } from "@/lib/marketing/industries";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("industries");

export default function IndustriesPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Industries"
          title="Signature advice for your line of work"
          lede="What a lawyer needs in a signature is different from what a realtor or a teacher needs. Pick your field for practical tips and a live example."
        />
      </Section>
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug}>
              <Link
                href={`/industries/${industry.slug}`}
                className="block h-full rounded-card border border-ink-200 p-6 transition-colors hover:border-blue-brand-600"
              >
                <h2 className="font-semibold text-navy-900">{industry.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{industry.hook}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
