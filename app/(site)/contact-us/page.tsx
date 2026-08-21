import type { Metadata } from "next";
import { CesContactHero } from "@/components/ces/CesContactHero";
import { CesContactForm } from "@/components/ces/CesContactForm";
import { CesNeedMoreHelp } from "@/components/ces/CesNeedMoreHelp";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Contact Page | Signature Maker Queries" },
  description:
    "Contact Mail Signature for support or sales enquiries. Get help setting up a professional email signature in Outlook, Gmail or any other client.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactUsPage() {
  return (
    <>
      <CesContactHero />
      <CesContactForm />
      <div className="background-color-alternate">
        <CesNeedMoreHelp />
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
