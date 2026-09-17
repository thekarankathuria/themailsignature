import Link from "next/link";
import { notFound } from "next/navigation";
import { readOutbox } from "@/lib/mail";

export const dynamic = "force-dynamic";

export default async function OutboxMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = readOutbox(id);
  if (!message) notFound();

  // Links in emails are plain URLs; list them so a developer can follow them
  // without the sandboxed frame allowing navigation.
  const links = [...new Set(message.text.match(/https?:\/\/\S+/g) ?? [])];

  return (
    <main className="mx-auto max-w-3xl">
      <Link href="/dev/outbox" className="text-sm font-semibold text-blue-brand-600">Back to outbox</Link>
      <h1 className="mt-3 text-2xl font-bold text-navy-900">{message.subject}</h1>
      <p className="mt-1 text-sm text-ink-600">To {message.to}, {new Date(message.sentAt).toLocaleString()}</p>
      {links.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {links.map((url) => (
            <li key={url}>
              <a href={url} className="break-all font-medium text-blue-brand-600 hover:text-blue-brand-700">{url}</a>
            </li>
          ))}
        </ul>
      )}
      <iframe
        title="Email preview"
        sandbox=""
        srcDoc={message.html}
        className="mt-6 h-[720px] w-full rounded-card border border-ink-200 bg-white"
      />
      <details className="mt-6 rounded-card border border-ink-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold">Plain text</summary>
        <pre className="mt-3 whitespace-pre-wrap text-sm text-ink-700">{message.text}</pre>
      </details>
    </main>
  );
}
