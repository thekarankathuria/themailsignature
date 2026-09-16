import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { TemplateCard } from "@/components/marketing/TemplateCard";
import { pageMetadata } from "@/lib/marketing/pages";
import { TEMPLATES } from "@/lib/signature/templates";

export const metadata = pageMetadata("templates");

export default function TemplatesPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Templates"
          title="Eight signature layouts, all built for Outlook"
          lede="Every template is made of HTML tables with inline styles, the only format Outlook for Windows renders reliably. The examples below are live renders, not images. Open one in the editor and replace the details with yours."
        />
      </Section>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {TEMPLATES.map((t) => <TemplateCard key={t.id} templateId={t.id} headingLevel="h2" />)}
        </div>
      </Section>
      <CtaBanner
        title="Not sure which one?"
        body="Start with any template. You can switch layouts in the editor at any time without retyping your details."
        cta={{ label: "Open the editor", href: "/editor" }}
      />
    </>
  );
}
