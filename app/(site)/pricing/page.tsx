import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { COMPARISON, PLANS } from "@/lib/pricing";

export const metadata = pageMetadata("pricing");

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "TheMailSignature",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: PLANS.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price: plan.monthly.toFixed(2),
            priceCurrency: "USD",
          })),
        }}
      />
      <Section tone="tint">
        <SectionHeading
          as="h1"
          eyebrow="Pricing"
          title="Start free. Upgrade when you need more."
          lede="Prices are in US dollars. Save by paying yearly."
        />
        <div className="mt-12">
          <PricingCards plans={PLANS} />
        </div>
      </Section>
      <Section>
        <SectionHeading title="Compare every feature" />
        <div className="mt-10">
          <ComparisonTable groups={COMPARISON} />
        </div>
      </Section>
      <Section tone="tint">
        <SectionHeading title="Billing questions" />
        <div className="mt-10">
          <FaqList items={FAQS.pricing} />
        </div>
      </Section>
      <CtaBanner
        title="Try it before you pay"
        body="Build your signature on the Free plan first. Upgrade later without starting over."
        cta={{ label: "Create your signature", href: "/editor" }}
      />
    </>
  );
}
