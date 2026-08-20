import Link from "next/link";

/**
 * The mark is the product: a signature rule under the name.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-0.5 text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50 ${className}`}
    >
      <span>Sendmark</span>
      <span
        aria-hidden
        className="mb-1 h-[3px] w-4 rounded-full bg-brand-600 transition-[width] group-hover:w-6"
      />
    </Link>
  );
}
