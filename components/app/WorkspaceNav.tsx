"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/app/signatures", label: "Signatures" },
  { href: "/app/billing", label: "Plan and billing" },
  { href: "/app/settings", label: "Settings" },
];

export function WorkspaceNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="lg:w-56 lg:shrink-0">
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-white text-navy-900 shadow-sm" : "text-ink-600 hover:bg-white/60 hover:text-navy-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
