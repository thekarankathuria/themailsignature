import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSolution, solutions } from "@/lib/ces/solutions";
import { getSolutionSeo } from "@/lib/ces/solution-seo";
import { CesClients } from "@/components/ces/CesClients";
import { CesCta } from "@/components/ces/CesCta";
import { SolutionHero } from "@/components/ces/solution/SolutionHero";
import { SolutionFeatures } from "@/components/ces/solution/SolutionFeatures";
import { SolutionTopUsers } from "@/components/ces/solution/SolutionTopUsers";
import { SolutionCore } from "@/components/ces/solution/SolutionCore";
import { SolutionFaq } from "@/components/ces/solution/SolutionFaq";
import { SolutionCta } from "@/components/ces/solution/SolutionCta";

/**
 * One template for all 21 `/solution/<slug>` pages.
 *
 * Every string, image and Lottie on this page comes from `lib/ces/solutions.ts`, which
 * `scripts/extract-solutions.mjs` derives from the 21 saved originals — nothing here is
 * hand-transcribed, so the copy cannot drift from the source pages.
 *
 * `app/(site)/layout.tsx` already renders the nav, footer and proof widget, so this renders
 * only the sections between them.
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  // `lib/ces/solutions.ts` is generated, so the search copy is overridden from the
  // hand-written `lib/ces/solution-seo.ts` rather than edited into the generated data.
  // The originals ship a bare industry noun as their <title> ("Realtor") and repeat one
  // description across ten pages; the overrides are keyword-bearing and unique.
  const seo = getSolutionSeo(solution.slug);
  return {
    title: seo ? { absolute: seo.title } : solution.title,
    description: seo?.description ?? solution.description,
    alternates: { canonical: `/solution/${solution.slug}` },
  };
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <>
      <SolutionHero hero={solution.hero} />
      <CesClients />
      <SolutionFeatures features={solution.features} />
      <SolutionTopUsers topUsers={solution.topUsers} />
      {solution.core.map((section, index) => (
        <SolutionCore key={index} section={section} />
      ))}
      <div className="background-color-alternate">
        <SolutionFaq faq={solution.faq} />
        {solution.usesSharedCta || !solution.solutionCta ? (
          <CesCta />
        ) : (
          <SolutionCta cta={solution.solutionCta} />
        )}
      </div>
    </>
  );
}
