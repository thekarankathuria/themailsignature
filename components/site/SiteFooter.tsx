import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Signature editor", href: "/editor" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "For teams", href: "/teams" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help", href: "/help" },
      { label: "Signatures by industry", href: "/industries" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Delete your data", href: "/legal/data-deletion" },
    ],
  },
];

/**
 * Social links are deliberately absent until the accounts exist. An `href="#"`
 * placeholder is a broken promise to the reader and was one of the defects
 * inherited from the cloned site.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-200 bg-navy-900 text-navy-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" height={26} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
            Email signatures that render correctly in Gmail, Outlook and Apple Mail.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-100 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-t border-navy-700 py-6">
        <p className="text-xs text-navy-300">
          © {new Date().getFullYear()} TheMailSignature. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
