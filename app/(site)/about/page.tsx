import type { Metadata } from "next";
import { CesClients } from "@/components/ces/CesClients";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";
import { CesAboutHero } from "@/components/ces/about/CesAboutHero";
import { CesAbout42 } from "@/components/ces/about/CesAbout42";
import { CesAboutWhy } from "@/components/ces/about/CesAboutWhy";
import { CesAboutMission } from "@/components/ces/about/CesAboutMission";
import { CesAboutValues } from "@/components/ces/about/CesAboutValues";
import { CesAboutFounder } from "@/components/ces/about/CesAboutFounder";

export const metadata: Metadata = {
  title: {
    absolute: "Mail Signature – About Our Team & Signature maker Tools",
  },
  description:
    "Create professional email signature examples and set up signature in Outlook quickly with Mail Signature – fast, secure, and simple.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <CesAboutHero />
      <CesClients />
      <CesAbout42 />
      <CesAboutWhy />
      <CesAboutMission />
      <CesAboutValues />
      <div className="background-color-alternate">
        <CesAboutFounder />
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
