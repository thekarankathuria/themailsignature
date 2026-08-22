import type { Metadata } from "next";
import { Builder } from "@/components/builder/Builder";

export const metadata: Metadata = {
  title: "Email signature builder",
  description:
    "Fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
  alternates: { canonical: "/generator" },
};

export default function GeneratorPage() {
  return <Builder />;
}
