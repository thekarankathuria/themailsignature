import { Container } from "@/components/site/Container";
import { hasPlaceholders } from "@/lib/marketing/company";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-navy-900">{title}</h1>
        <p className="mt-3 text-sm text-ink-500">Last updated {updated}</p>
        {hasPlaceholders() && (
          <p role="note" className="mt-6 rounded-lg border-l-4 border-blue-brand-600 bg-navy-50 p-4 text-sm text-navy-900">
            Draft pending legal review. Bracketed items will be completed before launch.
          </p>
        )}
        <div className="mt-10 space-y-5 leading-relaxed text-ink-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-blue-brand-600">
          {children}
        </div>
      </article>
    </Container>
  );
}
