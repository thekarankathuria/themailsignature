"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/app/signatures", label: "Signatures" },
  { href: "/app/billing", label: "Plan and billing" },
  { href: "/app/settings", label: "Settings" },
];

/** `showTeam` comes from the server, which knows whether this person is on a team. */
export function WorkspaceNav({ showTeam = false }: { showTeam?: boolean }) {
  const pathname = usePathname();
  const links = showTeam ? [LINKS[0], { href: "/app/team", label: "Team" }, ...LINKS.slice(1)] : LINKS;
  return (
    <nav aria-label="Account" className="lg:w-56 lg:shrink-0">
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {links.map((link) => {
          const active = link.href === "/app/team" ? pathname.startsWith(link.href) : pathname === link.href;
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
