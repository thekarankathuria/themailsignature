"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { logoutAction } from "@/lib/auth/actions";
import type { PlanId } from "@/lib/billing/plans";

const PLAN_LABEL: Record<PlanId, string> = { free: "Free plan", pro: "Pro", business: "Business" };

export function AccountMenu({ email, plan, verified }: { email: string; plan: PlanId; verified: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-ink-300"
      >
        <span className="hidden max-w-40 truncate sm:inline">{email}</span>
        <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-900">{PLAN_LABEL[plan]}</span>
        <CaretDown size={14} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-20 w-64 rounded-card border border-ink-200 bg-white p-2 shadow-lg">
          <p className="truncate px-3 py-2 text-sm text-ink-600 sm:hidden">{email}</p>
          {!verified && (
            <p className="mx-1 mb-1 rounded-lg bg-navy-50 px-3 py-2 text-xs leading-relaxed text-navy-900">
              Confirm your email from Settings to secure your account.
            </p>
          )}
          <Link role="menuitem" href="/app/settings" className="block rounded-lg px-3 py-2 text-sm text-navy-900 hover:bg-ink-50">
            Settings
          </Link>
          <Link role="menuitem" href="/help" className="block rounded-lg px-3 py-2 text-sm text-navy-900 hover:bg-ink-50">
            Help
          </Link>
          <form action={logoutAction}>
            <button role="menuitem" type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-navy-900 hover:bg-ink-50">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
