import Link from "next/link";
import { Wordmark } from "./Wordmark";

const PRODUCT_LINKS = [
  { href: "#features", name: "Features" },
  { href: "#why-choose", name: "Why Choose" },
  { href: "#pricing", name: "Pricing" },
  { href: "#", name: "Integrations" },
];

const COMPANY_LINKS = [
  { href: "#", name: "About Us" },
  { href: "#", name: "Careers" },
  { href: "#contact", name: "Contact" },
  { href: "#", name: "Press" },
];

const RESOURCE_LINKS = [
  { href: "#", name: "Blog" },
  { href: "#", name: "Documentation" },
  { href: "#", name: "Help Center" },
  { href: "#", name: "Guides" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-600 dark:text-ink-400">
            Simplify task management and boost productivity. Easily manage tasks and enhance productivity from start to finish.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-ink-100">
            Product
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PRODUCT_LINKS.map((t) => (
              <li key={t.name}>
                <Link
                  href={t.href}
                  className="text-sm text-ink-600 transition-colors hover:text-taskgo-600 dark:text-ink-400 dark:hover:text-taskgo-400"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-ink-100">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {COMPANY_LINKS.map((c) => (
              <li key={c.name}>
                <Link
                  href={c.href}
                  className="text-sm text-ink-600 transition-colors hover:text-taskgo-600 dark:text-ink-400 dark:hover:text-taskgo-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-ink-100">
            Resources
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {RESOURCE_LINKS.map((r) => (
              <li key={r.name}>
                <Link
                  href={r.href}
                  className="text-sm text-ink-600 transition-colors hover:text-taskgo-600 dark:text-ink-400 dark:hover:text-taskgo-400"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
        <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-6 sm:px-8 text-xs text-ink-500 dark:text-ink-400">
          <p>© {new Date().getFullYear()} TaskGo Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-taskgo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-taskgo-600">Terms of Service</Link>
            <Link href="#" className="hover:text-taskgo-600">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
