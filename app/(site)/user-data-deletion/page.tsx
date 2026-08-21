import type { Metadata } from "next";
import { CesLegalPage } from "@/components/ces/legal/CesLegalPage";
import { userDataDeletionContent } from "@/lib/ces/legal";

export const metadata: Metadata = {
  title: { absolute: "User Data Deletion | Mail Signature" },
  description:
    "How to request deletion of your Mail Signature account and any personal data we hold, what gets removed, and how long the process takes.",
  alternates: { canonical: "/user-data-deletion" },
};

export default function UserDataDeletionPage() {
  return <CesLegalPage content={userDataDeletionContent} />;
}
