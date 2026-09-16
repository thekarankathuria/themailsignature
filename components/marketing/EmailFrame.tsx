/** A mail-client window that sets a signature in context. Decorative chrome is aria-hidden. */
export function EmailFrame({ subject, children }: { subject: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-card border border-ink-200 bg-white text-left shadow-xl shadow-navy-900/10">
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-ink-200 bg-ink-50 px-4 py-3">
        <span className="size-3 rounded-full bg-ink-300" />
        <span className="size-3 rounded-full bg-ink-300" />
        <span className="size-3 rounded-full bg-ink-300" />
      </div>
      <div className="space-y-1 border-b border-ink-100 px-5 py-3 text-sm text-ink-600">
        <p><span className="text-ink-400">Subject:</span> {subject}</p>
      </div>
      <div className="px-5 py-5">
        <div aria-hidden="true" className="space-y-2">
          <div className="h-2.5 w-3/4 rounded bg-ink-100" />
          <div className="h-2.5 w-full rounded bg-ink-100" />
          <div className="h-2.5 w-2/3 rounded bg-ink-100" />
        </div>
        <div className="mt-6 border-t border-ink-100 pt-5">{children}</div>
      </div>
    </figure>
  );
}
