import "./globals.css";
import Link from "next/link";
import { currentUser } from "@/lib/auth/current";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata = { title: "Page not found", robots: { index: false, follow: false } };

const ROUTES = [
  { href: "/editor", label: "Make a signature", body: "The editor, with every layout and no account needed to start." },
  { href: "/templates", label: "Browse templates", body: "Designs for 21 industries, one free in each." },
  { href: "/help", label: "Setup guides", body: "Step-by-step instructions for 14 email clients." },
  { href: "/contact", label: "Contact us", body: "If a link brought you here, tell us and we will fix it." },
];

/**
 * The 404 page. It renders the site shell itself, because a root not-found is
 * outside the (site) route group and would otherwise arrive with no header.
 */
export default async function NotFound() {
  const user = await currentUser();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader signedIn={Boolean(user)} />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-brand-600">Page not found</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            That page is not here
          </h1>
          <p className="mt-4 max-w-prose leading-relaxed text-ink-600">
            The address may be mistyped, or the page may have moved. Everything below still works.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="block h-full rounded-card border border-ink-200 p-5 transition-colors hover:border-navy-900"
                >
                  <span className="font-semibold text-navy-900">{route.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-600">{route.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
