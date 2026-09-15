import Link from "next/link";

/**
 * TheMailSignature wordmark for the builder chrome.
 *
 * A square mark holding three stacked mail rules, then two lines of
 * letter-spaced uppercase, built from Tailwind tokens so it can follow the
 * generator's light/dark toggle.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="TheMailSignature home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-8 w-8 flex-col items-center justify-center gap-[3px] rounded-[3px] bg-ink-950 dark:bg-white"
      >
        <span className="block h-[2.6px] w-[18px] rounded-full bg-white dark:bg-ink-950" />
        <span className="block h-[2.6px] w-[18px] rounded-full bg-white dark:bg-ink-950" />
        <span className="block h-[2.6px] w-[12px] self-start ml-[7px] rounded-full bg-white dark:bg-ink-950" />
      </span>
      <span className="flex flex-col gap-[3px] leading-none text-ink-950 dark:text-white">
        <span className="text-base font-semibold tracking-[0.18em]">MAIL</span>
        <span className="text-[9px] font-medium tracking-[0.26em]">SIGNATURE</span>
      </span>
    </Link>
  );
}
