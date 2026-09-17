/**
 * Registry of the designer layouts. `lib/signature/templates.ts` merges these
 * into RENDERERS and TEMPLATES alongside the classic eight.
 */
import type { TemplateMeta } from "../types";
import { corporate, corporateMeta } from "./corporate";
import { executive, executiveMeta } from "./executive";
import type { Renderer } from "./kit";
import { luxe, luxeMeta } from "./luxe";
import { studio, studioMeta } from "./studio";

export const DESIGNER_RENDERERS: Record<string, Renderer> = {
  luxe,
  corporate,
  studio,
  executive,
};

export const DESIGNER_TEMPLATES: TemplateMeta[] = [luxeMeta, corporateMeta, studioMeta, executiveMeta];
