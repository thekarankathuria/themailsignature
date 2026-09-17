/**
 * Registry of the designer layouts. `lib/signature/templates.ts` merges these
 * into RENDERERS and TEMPLATES alongside the classic eight.
 */
import type { TemplateMeta } from "../types";
import { bold, boldMeta } from "./bold";
import { colorblock, colorblockMeta } from "./colorblock";
import { corporate, corporateMeta } from "./corporate";
import { editorial, editorialMeta } from "./editorial";
import { executive, executiveMeta } from "./executive";
import type { Renderer } from "./kit";
import { luxe, luxeMeta } from "./luxe";
import { monogram, monogramMeta } from "./monogram";
import { nordic, nordicMeta } from "./nordic";
import { personal, personalMeta } from "./personal";
import { startup, startupMeta } from "./startup";
import { studio, studioMeta } from "./studio";
import { ultra, ultraMeta } from "./ultra";

export const DESIGNER_RENDERERS: Record<string, Renderer> = {
  luxe,
  corporate,
  studio,
  executive,
  nordic,
  bold,
  startup,
  editorial,
  personal,
  ultra,
  monogram,
  colorblock,
};

export const DESIGNER_TEMPLATES: TemplateMeta[] = [
  luxeMeta,
  corporateMeta,
  studioMeta,
  executiveMeta,
  nordicMeta,
  boldMeta,
  startupMeta,
  editorialMeta,
  personalMeta,
  ultraMeta,
  monogramMeta,
  colorblockMeta,
];
