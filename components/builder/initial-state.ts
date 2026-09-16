import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";

export interface BuilderState {
  data: SignatureData;
  style: SignatureStyle;
}

/** Applies a template chosen on the marketing site, e.g. /editor?template=slate. */
export function withTemplate(saved: BuilderState, templateId: string | undefined): BuilderState {
  const template = templateId ? TEMPLATE_BY_ID[templateId] : undefined;
  if (!template) return saved;
  return {
    data: saved.data,
    style: { ...saved.style, ...(template.styleHints ?? {}), templateId: template.id },
  };
}
