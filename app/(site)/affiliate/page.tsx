import type { Metadata } from "next";
import { CesAffiliateHero } from "@/components/ces/affiliate/CesAffiliateHero";
import { CesAffiliateHow } from "@/components/ces/affiliate/CesAffiliateHow";
import { CesAffiliateBenefits } from "@/components/ces/affiliate/CesAffiliateBenefits";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Affiliate – Email Signature Maker" },
  description:
    "Join the Mail Signature affiliate program and promote our online signature creator. Help users design professional Outlook mail signatures easily.",
  alternates: { canonical: "/affiliate" },
};

export default function AffiliatePage() {
  return (
    <>
      <CesAffiliateHero />
      <CesAffiliateHow />
      <CesAffiliateBenefits />
      <div className="background-color-alternate">
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
