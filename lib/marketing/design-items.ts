import { renderSignature } from "@/lib/signature/render";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import { designSignature, type Design } from "./designs";
import { INDUSTRY_BY_SLUG } from "./industries";
import type { BrowserItem } from "./template-filter";

/** The card data for a design. */
export function toBrowserItem(design: Design): BrowserItem {
  return {
    id: design.id,
    industry: design.industry,
    industryName: INDUSTRY_BY_SLUG[design.industry]?.name ?? design.industry,
    layoutId: design.layoutId,
    name: design.name,
    tier: design.tier,
    animated: design.animated,
    tags: TEMPLATE_BY_ID[design.layoutId]?.tags ?? [],
  };
}

/** Preview HTML for a design, with root-relative asset URLs for our pages. */
export function designHtml(design: Design): string {
  const { data, style } = designSignature(design);
  return renderSignature(data, style, { assetBase: "" });
}
