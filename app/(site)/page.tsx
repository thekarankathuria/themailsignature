import Link from "next/link";
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { EmailFrame } from "@/components/marketing/EmailFrame";
import { FaqList } from "@/components/marketing/FaqList";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { JsonLd } from "@/components/marketing/JsonLd";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SignaturePreview } from "@/components/marketing/SignaturePreview";
import { Steps } from "@/components/marketing/Steps";
import { DesignCard } from "@/components/marketing/DesignCard";
import { designHtml, toBrowserItem } from "@/lib/marketing/design-items";
import { ALL_DESIGNS, DESIGN_BY_ID } from "@/lib/marketing/designs";
import { FAQS } from "@/lib/marketing/faqs";
import { HOME } from "@/lib/marketing/home";
import { pageMetadata } from "@/lib/marketing/pages";
import { PLANS, formatPrice } from "@/lib/pricing";
import { CLIENTS } from "@/lib/signature/clients";

export const metadata = pageMetadata("home");

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: "TheMailSignature", url: SITE, logo: `${SITE}/brand/icon-512.png` },
            { "@type": "WebSite", name: "TheMailSignature", url: SITE },
          ],
        }}
      />

      <section className="bg-linear-to-b from-navy-50 to-white pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1" align="left" eyebrow={HOME.hero.eyebrow} title={HOME.hero.title} lede={HOME.hero.lede} />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={HOME.hero.primary.href}>{HOME.hero.primary.label}</ButtonLink>
              <ButtonLink href={HOME.hero.secondary.href} variant="secondary">{HOME.hero.secondary.label}</ButtonLink>
            </div>
          </div>
          <EmailFrame subject="Proposal for next quarter">
            <SignaturePreview personKey="tpl-meridian" templateId="meridian" />
          </EmailFrame>
        </div>
      </section>

      <section aria-labelledby="works-in" className="border-y border-ink-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 id="works-in" className="text-sm font-semibold uppercase tracking-wider text-ink-500">
            Setup guides for
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {CLIENTS.map((client) => (
              <li key={client.id}>
                <Link href={`/help#${client.id}`} className="text-sm font-medium text-navy-900 hover:text-blue-brand-600">
                  {client.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="how-it-works">
        <SectionHeading title={HOME.steps.title} lede={HOME.steps.lede} />
        <Steps steps={HOME.steps.items} />
      </Section>

      <Section tone="tint" id="features">
        <SectionHeading title={HOME.features.title} lede={HOME.features.lede} />
        <FeatureGrid features={HOME.features.items} />
      </Section>

      <Section id="templates">
        <SectionHeading title={HOME.templates.title} lede={HOME.templates.lede} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {HOME.templates.designIds.map((id) => (
            <li key={id}>
              <DesignCard item={toBrowserItem(DESIGN_BY_ID[id])} html={designHtml(DESIGN_BY_ID[id])} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/templates" variant="secondary">See all {ALL_DESIGNS.length} designs</ButtonLink>
        </div>
      </Section>

      <Section tone="tint" id="pricing">
        <SectionHeading title={HOME.pricing.title} lede={HOME.pricing.lede} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <li key={plan.id} className="rounded-card border border-ink-200 bg-white p-6">
              <h3 className="font-semibold text-navy-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-navy-900">
                {formatPrice(plan.monthly)}
                <span className="text-sm font-medium text-ink-500">
                  {plan.perSeat ? " per user / month" : " / month"}
                </span>
              </p>
              <p className="mt-2 text-ink-600">{plan.tagline}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/pricing" variant="secondary">Compare plans</ButtonLink>
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading title={HOME.faq.title} />
        <div className="mt-10">
          <FaqList items={FAQS.home} />
        </div>
      </Section>

      <CtaBanner {...HOME.cta} />
    </>
  );
}
