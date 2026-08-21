import Link from "next/link";
import Image from "next/image";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 text-[19px] font-bold tracking-tight text-ink-900 dark:text-ink-50 ${className}`}
    >
      <div className="relative h-7 w-7 overflow-hidden rounded-lg bg-taskgo-600 flex items-center justify-center text-white shadow-sm shadow-taskgo-600/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="font-semibold tracking-tight text-xl text-ink-900 dark:text-white flex items-center">
        Task<span className="text-taskgo-600 font-extrabold">Go</span>
        <span className="text-ink-400 dark:text-ink-500 font-normal text-sm tracking-wide ml-1.5 border-l border-ink-200 dark:border-ink-800 pl-1.5 hidden sm:inline">Signatures</span>
      </span>
    </Link>
  );
}
