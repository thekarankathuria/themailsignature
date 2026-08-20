"use client";

import { Moon, Sun } from "@phosphor-icons/react";

/**
 * Reads and writes the theme straight from the document element. Both icons
 * are rendered and swapped by the `dark` class, so there is no client state to
 * hydrate and no flash of the wrong icon on load.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sendmark.theme", next ? "dark" : "light");
    } catch {
      // Private browsing; the choice just will not persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
    >
      <Moon size={17} aria-hidden className="dark:hidden" />
      <Sun size={17} aria-hidden className="hidden dark:block" />
    </button>
  );
}
