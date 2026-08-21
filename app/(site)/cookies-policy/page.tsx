import type { Metadata } from "next";
import { CesLegalPage } from "@/components/ces/legal/CesLegalPage";
import { cookiesPolicyContent } from "@/lib/ces/legal";

export const metadata: Metadata = {
  title: { absolute: "Mail Signature Cookie Policy – Signature Maker Details" },
  description:
    "Mail Signature Cookies Policy explains how cookies help enhance functionality and security while using our online signature maker.",
  alternates: { canonical: "/cookies-policy" },
};

export default function CookiesPolicyPage() {
  return <CesLegalPage content={cookiesPolicyContent} />;
}
