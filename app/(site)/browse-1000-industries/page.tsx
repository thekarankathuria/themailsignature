import type { Metadata } from "next";
import { CesBrowseHero } from "@/components/ces/browse/CesBrowseHero";
import { CesBrowseIndustries } from "@/components/ces/browse/CesBrowseIndustries";
import { CesClients } from "@/components/ces/CesClients";
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

export const metadata: Metadata = {
  title: { absolute: "Browse Email Signatures for 1000+ Industries" },
  description:
    "Find a ready-made email signature for your profession across 1000+ industries, then customise the wording, colours and links in a few minutes.",
  alternates: { canonical: "/browse-1000-industries" },
};

export default function BrowseIndustriesPage() {
  return (
    <>
      <CesBrowseHero />
      <CesClients />
      <CesBrowseIndustries />
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
