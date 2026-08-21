import type { Metadata } from "next";
import { CesLegalPage } from "@/components/ces/legal/CesLegalPage";
import { termsOfUseContent } from "@/lib/ces/legal";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Terms of Use – Email Signature Maker" },
  description:
    "Mail Signature Terms of Use explain the rules, policies, and guidelines for using our online signature creator securely and responsibly.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  return <CesLegalPage content={termsOfUseContent} />;
}
