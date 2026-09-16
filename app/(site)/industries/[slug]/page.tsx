import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/marketing/ButtonLink";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { EmailFrame } from "@/components/marketing/EmailFrame";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { Section } from "@/components/marketing/Section";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SignaturePreview } from "@/components/marketing/SignaturePreview";
import { INDUSTRIES, INDUSTRY_BY_SLUG } from "@/lib/marketing/industries";
import { getIndustrySeo } from "@/lib/marketing/industry-seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seo = getIndustrySeo(slug);
  if (!seo) return {};
  const path = `/industries/${slug}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      type: "article",
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TheMailSignature" }],
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = INDUSTRY_BY_SLUG[slug];
  if (!industry) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE}/industries` },
            { "@type": "ListItem", position: 3, name: industry.name, item: `${SITE}/industries/${slug}` },
          ],
        }}
      />
      <Section tone="tint">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
          <Link href="/industries" className="hover:text-navy-900">Industries</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-navy-900">{industry.name}</span>
        </nav>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1" align="left" title={`Email signatures for ${industry.audience}`} lede={industry.intro} />
            <div className="mt-8">
              <ButtonLink href={`/editor?template=${industry.templateId}`}>Start with this layout</ButtonLink>
            </div>
          </div>
          <EmailFrame subject="Following up on our call">
            <SignaturePreview personKey={industry.slug} templateId={industry.templateId} />
          </EmailFrame>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">What to include</h2>
            <ul className="mt-6 space-y-4">
              {industry.include.map((tip) => (
                <li key={tip} className="flex gap-3 leading-relaxed text-ink-700">
                  <span aria-hidden="true" className="font-bold text-blue-brand-600">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Mistakes to avoid</h2>
            <ul className="mt-6 space-y-4">
              {industry.avoid.map((tip) => (
                <li key={tip} className="flex gap-3 leading-relaxed text-ink-700">
                  <span aria-hidden="true" className="font-bold text-ink-400">✕</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <SectionHeading title="Common questions" />
        <div className="mt-10">
          <FaqList items={industry.faqs} />
        </div>
      </Section>

      <Section>
        <h2 className="text-xl font-bold text-navy-900">Related industries</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {industry.related.map((relatedSlug) => (
            <li key={relatedSlug}>
              <Link
                href={`/industries/${relatedSlug}`}
                className="inline-block rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-navy-900 hover:border-navy-900"
              >
                {INDUSTRY_BY_SLUG[relatedSlug].name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner
        title={`Signatures for ${industry.audience}, ready in minutes`}
        body="Fill in your details, pick a layout and copy it into your email client."
        cta={{ label: "Open the editor", href: `/editor?template=${industry.templateId}` }}
      />
    </>
  );
}
