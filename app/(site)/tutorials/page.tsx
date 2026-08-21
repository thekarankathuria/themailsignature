import type { Metadata } from "next";
import { CesVideoTutorials } from "@/components/ces/CesVideoTutorials";
import { CesNeedMoreHelp } from "@/components/ces/CesNeedMoreHelp";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Tutorials – Email Signature Maker Guides" },
  description:
    "Explore Mail Signature tutorials to learn how to create, customize, and set up professional email signatures easily with our step-by-step guides.",
  alternates: { canonical: "/tutorials" },
};

export default function TutorialsPage() {
  return (
    <>
      <CesVideoTutorials isPageHeading />
      <div className="background-color-alternate">
        <CesNeedMoreHelp />
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
