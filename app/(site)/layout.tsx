import "../globals.css";
import { currentUser } from "@/lib/auth/current";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader signedIn={Boolean(user)} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
