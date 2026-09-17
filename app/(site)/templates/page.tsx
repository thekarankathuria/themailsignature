import { Suspense } from "react";
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { DesignCard } from "@/components/marketing/DesignCard";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { TemplateBrowser } from "@/components/marketing/TemplateBrowser";
import { designHtml as html, toBrowserItem as toItem } from "@/lib/marketing/design-items";
import { ALL_DESIGNS, designsFor, type Design } from "@/lib/marketing/designs";
import { TEMPLATE_SAMPLES, sampleSignature } from "@/lib/marketing/samples";
import { INDUSTRIES } from "@/lib/marketing/industries";
import { pageMetadata } from "@/lib/marketing/pages";
import { renderSignature } from "@/lib/signature/render";
import { TEMPLATES } from "@/lib/signature/templates";

export const metadata = pageMetadata("templates");

/** One design per designer layout, preferring animated ones so motion shows. */
function featured(): Design[] {
  const designer = TEMPLATES.filter((t) => t.group === "designer");
  return designer
    .map((t) => {
      const options = ALL_DESIGNS.filter((d) => d.layoutId === t.id);
      return options.find((d) => d.animated) ?? options[0];
    })
    .filter((d): d is Design => Boolean(d));
}

export default function TemplatesPage() {
  // Round-robin: every industry's first designer design, then the second,
  // and so on, with the free designs last. The first screen of the library
  // then shows variety instead of one industry's six.
  const order = new Map(INDUSTRIES.map((industry, i) => [industry.slug, i]));
  const rank = (design: Design) =>
    design.tier === "free" ? 99 : designsFor(design.industry).findIndex((d) => d.id === design.id);
  const items = [...ALL_DESIGNS]
    .sort((a, b) => rank(a) - rank(b) || (order.get(a.industry) ?? 0) - (order.get(b.industry) ?? 0))
    .map(toItem);
  const industries = INDUSTRIES.map((i) => ({ slug: i.slug, name: i.name }));
  const highlights = featured();

  return (
    <>
      <Section tone="tint">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Templates"
            title="Signature designs for every line of work"
            lede={`${ALL_DESIGNS.length} designs across ${INDUSTRIES.length} industries, all built on Outlook-safe layouts. Every industry has a free design.`}
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="#library">Browse all designs</ButtonLink>
            <ButtonLink href="/editor" variant="secondary">
              Start from scratch
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading align="left" title="Twelve designer layouts" lede="Each one shown in a design made for a real profession." />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {highlights.map((design) => (
            <li key={design.id}>
              <DesignCard item={toItem(design)} html={html(design)} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint" id="library">
        <SectionHeading align="left" title="Find a design for your industry" />
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-ink-600">Loading designs.</p>}>
            <TemplateBrowser items={items} industries={industries} />
          </Suspense>
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="left"
          title="Classic templates"
          lede="Simple, dependable layouts. Four of them are free on every plan."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TEMPLATES.filter((t) => t.group === "classic").map((t) => {
            const { data, style } = sampleSignature(TEMPLATE_SAMPLES[t.id], t.id);
            return (
              <li key={t.id}>
                <DesignCard
                  item={{
                    id: t.id,
                    industry: "classic",
                    industryName: "Classic template",
                    layoutId: t.id,
                    name: t.name,
                    tier: t.tier,
                    animated: false,
                    tags: t.tags,
                  }}
                  html={renderSignature(data, style, { assetBase: "" })}
                  href={`/editor?template=${t.id}`}
                />
              </li>
            );
          })}
        </ul>
      </Section>

      <p className="bg-white pb-10 text-center text-xs text-ink-600">
        Sample people, companies and photos are illustrative.
      </p>

      <CtaBanner
        title="Not sure which one?"
        body="Start with any design. You can switch layouts in the editor without retyping your details."
        cta={{ label: "Open the editor", href: "/editor" }}
      />
    </>
  );
}
