import { ContactForm } from "@/components/marketing/ContactForm";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { COMPANY } from "@/lib/marketing/company";
import { pageMetadata } from "@/lib/marketing/pages";
import Link from "next/link";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <Section tone="tint">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Contact"
            title="Talk to us"
            lede="Questions about your signature, billing or setting up a team? Send a message and we will reply by email."
          />
          <p className="mt-6 text-ink-600">Typical reply time: {COMPANY.responseTime}.</p>
          <p className="mt-2 text-ink-600">
            Setting up a signature? The <Link href="/help" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">help guides</Link> may answer it faster.
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
