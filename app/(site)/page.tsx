import type { Metadata } from "next";
import { CesHero } from "@/components/ces/CesHero";
import { CesClients } from "@/components/ces/CesClients";
import { CesNumbers } from "@/components/ces/CesNumbers";
import { CesTopUsers } from "@/components/ces/CesTopUsers";
import { CesHowItWorks } from "@/components/ces/CesHowItWorks";
import { CesEmailReplies } from "@/components/ces/CesEmailReplies";
import { CesDeliverability } from "@/components/ces/CesDeliverability";
import { CesInteractive } from "@/components/ces/CesInteractive";
import { CesOurPlatform } from "@/components/ces/CesOurPlatform";
import { CesFeatures } from "@/components/ces/CesFeatures";
import { CesIntegrations } from "@/components/ces/CesIntegrations";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";
import { SITE_URL, homePageGraph, jsonLd } from "@/lib/ces/structured-data";

const TITLE = "Email Signature Generator | Free AI Signature Maker";
const DESCRIPTION =
  "Build a polished signature in minutes with our free email signature generator. Works in Gmail, Outlook and Apple Mail \u2014 no account needed.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Mail Signature",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homePageGraph()) }}
      />
      <CesHero />
      <CesClients />
      <CesNumbers />
      <CesTopUsers />
      <CesHowItWorks />
      <CesEmailReplies />
      <CesDeliverability />
      <div className="background-color-alternate">
        <CesInteractive />
        <CesOurPlatform />
        <CesFeatures />
        <CesIntegrations />
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
