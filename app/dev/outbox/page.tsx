import Link from "next/link";
import { listOutbox } from "@/lib/mail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Outbox (development)" };

export default function OutboxPage() {
  const messages = listOutbox();
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-900">Outbox</h1>
      <p className="mt-1 text-sm text-ink-600">
        Emails the app would have sent. Set RESEND_API_KEY to deliver them for real.
      </p>
      {messages.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-ink-300 p-8 text-center text-ink-600">No emails yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-ink-200 rounded-card border border-ink-200 bg-white">
          {messages.map((m) => (
            <li key={m.id}>
              <Link href={`/dev/outbox/${m.id}`} className="flex flex-col gap-0.5 px-5 py-4 hover:bg-ink-50 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-navy-900">{m.subject}</span>
                <span className="text-sm text-ink-600">
                  {m.to} <span aria-hidden="true">|</span> {new Date(m.sentAt).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
