"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

const NAV: Array<{ label: string; href: string }> = [
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "For teams", href: "/teams" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-ink-700 hover:text-navy-900 sm:inline">
            Log in
          </Link>
          <Link
            href="/editor"
            className="rounded-[10px] bg-blue-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700"
          >
            Create my signature
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-nav-mobile"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-ink-700 md:hidden"
          >
            <span aria-hidden className="block h-0.5 w-5 bg-current" />
            <span aria-hidden className="mt-1 block h-0.5 w-5 bg-current" />
            <span aria-hidden className="mt-1 block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </Container>
      {open ? (
        <nav id="site-nav-mobile" aria-label="Main" className="border-t border-ink-200 bg-white md:hidden">
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-ink-700"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="py-2.5 text-sm font-medium text-ink-700">
              Log in
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
