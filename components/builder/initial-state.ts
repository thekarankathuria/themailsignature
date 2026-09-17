import { DESIGN_BY_ID } from "@/lib/marketing/designs";
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

/**
 * Applies a curated design (e.g. /editor?design=lawyers-luxe): its layout and
 * styling, plus its side text and tagline where the draft has none. The
 * user's own name and contact details are never replaced.
 */
export function withDesign(saved: BuilderState, designId: string | undefined): BuilderState {
  const design = designId ? DESIGN_BY_ID[designId] : undefined;
  if (!design) return saved;
  return {
    data: {
      ...saved.data,
      sideText: saved.data.sideText.trim() ? saved.data.sideText : design.data.sideText ?? "",
      tagline: saved.data.tagline.trim() ? saved.data.tagline : design.data.tagline ?? "",
    },
    style: { ...saved.style, ...design.style, templateId: design.layoutId },
  };
}
