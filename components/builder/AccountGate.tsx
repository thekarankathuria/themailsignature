"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { authHref } from "./editor-session";

/**
 * Shown when a signed-out visitor tries to copy, download or install their
 * signature. Their work is already in this browser, so the dialog only has to
 * make that clear and hand them to signup or login.
 */
export function AccountGate({ search, onClose }: { search: string; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-gate-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-[14px] bg-white p-6 shadow-xl outline-none sm:p-8 dark:bg-ink-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-100"
        >
          <X size={18} aria-hidden />
        </button>
        <h2 id="account-gate-title" className="text-xl font-bold text-navy-900 dark:text-ink-50">
          Save your signature to copy it
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          Create a free account and we will bring you straight back here with everything you have entered. Your
          signature is then saved to your account, so you can edit it any time.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={authHref("signup", search)}
            className="rounded-lg bg-blue-brand-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700"
          >
            Create free account
          </a>
          <a
            href={authHref("login", search)}
            className="rounded-lg border border-ink-300 px-4 py-3 text-center text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 dark:border-ink-700 dark:text-ink-100"
          >
            I already have an account
          </a>
        </div>
        <p className="mt-4 text-center text-xs text-ink-500 dark:text-ink-400">
          Free forever. No card needed.
        </p>
      </div>
    </div>
  );
}
