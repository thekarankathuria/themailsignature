import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "#", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#why-choose", label: "Why Choose" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/50 bg-white/80 backdrop-blur dark:border-ink-800/50 dark:bg-ink-950/80">
      <nav className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Wordmark />
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-sm font-medium text-ink-600 transition-colors hover:text-taskgo-600 dark:text-ink-300 dark:hover:text-taskgo-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="#contact"
            className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-800 active:translate-y-px shadow-sm hover:shadow dark:bg-ink-100 dark:text-ink-950 dark:hover:bg-white"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
}
