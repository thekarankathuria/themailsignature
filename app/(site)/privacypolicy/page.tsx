import type { Metadata } from "next";
import { CesLegalPage } from "@/components/ces/legal/CesLegalPage";
import { privacyPolicyContent } from "@/lib/ces/legal";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Privacy Policy – Email Signature Maker" },
  description:
    "Understand Mail Signature’s Privacy Policy to ensure secure and private use of our online signature creator and professional email signature features.",
  alternates: { canonical: "/privacypolicy" },
};

export default function PrivacyPolicyPage() {
  return <CesLegalPage content={privacyPolicyContent} />;
}
