import type { Metadata } from "next";
import { CesSupportHero } from "@/components/ces/CesSupportHero";
import { CesVideoTutorials } from "@/components/ces/CesVideoTutorials";
import { CesNeedMoreHelp } from "@/components/ces/CesNeedMoreHelp";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";

export const metadata: Metadata = {
  title: { absolute: "Email Signature Maker Support | Mail Signature" },
  description:
    "Get support from Mail Signature for any issues or guidance. Learn how to create and manage a professional signature for mail easily and securely.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <>
      <CesSupportHero />
      <div className="spacer-xlarge" />
      <CesVideoTutorials />
      <div className="background-color-alternate">
        <CesNeedMoreHelp />
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
