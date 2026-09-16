import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ABOUT } from "@/lib/marketing/about";
import { pageMetadata } from "@/lib/marketing/pages";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading as="h1" eyebrow="About" title={ABOUT.title} lede={ABOUT.lede} />
      </Section>
      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {ABOUT.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold text-navy-900">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-ink-700">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </Section>
      <CtaBanner
        title="See it for yourself"
        body="Build a signature and paste it into your email client."
        cta={{ label: "Create your signature", href: "/editor" }}
      />
    </>
  );
}
