import "../globals.css";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-4 py-10">
      <header className="mx-auto w-full max-w-md">
        <Logo height={30} />
      </header>
      <main id="main" className="mx-auto mt-8 w-full max-w-md flex-1">
        <div className="rounded-card border border-ink-200 bg-white p-6 shadow-lg shadow-navy-900/5 sm:p-8">{children}</div>
      </main>
      <footer className="mx-auto mt-10 flex w-full max-w-md justify-between text-xs text-ink-600">
        <Link href="/legal/privacy" className="hover:text-navy-900">Privacy</Link>
        <Link href="/help" className="hover:text-navy-900">Help</Link>
        <Link href="/contact" className="hover:text-navy-900">Contact</Link>
      </footer>
    </div>
  );
}
