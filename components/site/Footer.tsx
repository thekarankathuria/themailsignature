import Link from "next/link";
import { CLIENTS } from "@/lib/signature/clients";
import { TEMPLATES } from "@/lib/signature/templates";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-600 dark:text-ink-400">
            A free email signature generator that produces markup mail clients
            can actually render.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-ink-900 dark:text-ink-100">
            Templates
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {TEMPLATES.slice(0, 6).map((t) => (
              <li key={t.id}>
                <Link
                  href="/generator"
                  className="text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-ink-900 dark:text-ink-100">
            Mail apps
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {CLIENTS.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href="/generator"
                  className="text-sm text-ink-600 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-200 dark:border-ink-800">
        <p className="mx-auto max-w-[1200px] px-5 py-5 text-xs text-ink-500 sm:px-8 dark:text-ink-400">
          Sendmark. Brand names and logos referenced here belong to their owners.
        </p>
      </div>
    </footer>
  );
}
