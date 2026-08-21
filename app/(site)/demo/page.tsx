import type { Metadata } from "next";
import { CesDemoHero } from "@/components/ces/demo/CesDemoHero";
import { CesDemoSection } from "@/components/ces/demo/CesDemoSection";
import { CesFaq } from "@/components/ces/CesFaq";
import { CesCta } from "@/components/ces/CesCta";

export const metadata: Metadata = {
  title: { absolute: "See Mail Signature in Action – Email Signature Demo" },
  description:
    "Watch the Mail Signature demo: build a branded signature, customise it, and install it in Outlook or Gmail without touching any HTML.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <CesDemoHero />
      <CesDemoSection />
      <div className="background-color-alternate">
        <CesFaq />
        <CesCta />
      </div>
    </>
  );
}
