import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { FaqList } from "@/components/marketing/FaqList";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Steps } from "@/components/marketing/Steps";
import { FAQS } from "@/lib/marketing/faqs";
import { pageMetadata } from "@/lib/marketing/pages";
import { TEAMS } from "@/lib/marketing/teams";
import { PLANS, formatPrice } from "@/lib/pricing";

export const metadata = pageMetadata("teams");

const business = PLANS.find((p) => p.id === "business")!;

export default function TeamsPage() {
  return (
    <>
      <Section tone="tint">
        <SectionHeading as="h1" eyebrow="For teams" title={TEAMS.hero.title} lede={TEAMS.hero.lede} />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={business.cta.href}>{business.cta.label}</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">See pricing</ButtonLink>
        </div>
      </Section>

      <Section>
        <SectionHeading title={TEAMS.problems.title} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TEAMS.problems.items.map((item) => (
            <li key={item.title} className="rounded-card border border-ink-200 p-6">
              <h3 className="font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint">
        <SectionHeading title={TEAMS.capabilities.title} lede={TEAMS.capabilities.lede} />
        <FeatureGrid features={TEAMS.capabilities.items} />
      </Section>

      <Section>
        <SectionHeading title={TEAMS.rollout.title} />
        <Steps steps={TEAMS.rollout.items} />
        <p className="mt-12 text-center text-ink-600">
          Business is {formatPrice(business.monthly)} per seat per month, or {formatPrice(business.annual)} per seat per year,
          with a minimum of {business.minSeats} seats.
        </p>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Questions from team admins" />
        <div className="mt-10">
          <FaqList items={FAQS.teams} />
        </div>
      </Section>

      <CtaBanner {...TEAMS.cta} />
    </>
  );
}
