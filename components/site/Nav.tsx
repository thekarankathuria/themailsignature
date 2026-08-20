import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "/#templates", label: "Templates" },
  { href: "/#features", label: "How it works" },
  { href: "/#clients", label: "Mail apps" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur dark:border-ink-800/70 dark:bg-ink-950/80">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-5 sm:px-8">
        <Wordmark />
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/generator"
            className="rounded-[10px] bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800 active:translate-y-px dark:bg-ink-100 dark:text-ink-950 dark:hover:bg-white"
          >
            Build my signature
          </Link>
        </div>
      </nav>
    </header>
  );
}
