import { renderSignature } from "@/lib/signature/render";
import { sampleSignature } from "@/lib/marketing/samples";

/**
 * A signature rendered by the real engine. Injecting the HTML is safe: the
 * input is our own sample data and the engine escapes every field
 * (scripts/check-render.ts). An empty assetBase keeps icon URLs root-relative,
 * which is correct on our own pages.
 */
export function SignaturePreview({
  personKey,
  templateId,
  className = "",
}: {
  personKey: string;
  templateId: string;
  className?: string;
}) {
  const { data, style } = sampleSignature(personKey, templateId);
  const html = renderSignature(data, style, { assetBase: "" });
  return (
    <div
      className={`overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
