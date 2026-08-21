import "../ces.css";
import "../ces-inline.css";
import "../ces-extra.css";
import { CesNav } from "@/components/ces/CesNav";
import { CesFooter } from "@/components/ces/CesFooter";
import { CesProofWidget } from "@/components/ces/CesProofWidget";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-wrapper">
      <CesNav />
      <main className="main-wrapper">{children}</main>
      <CesFooter />
      <CesProofWidget />
    </div>
  );
}
