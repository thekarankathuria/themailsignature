import type { ClaimId } from "./claims";

export type Faq = { q: string; a: string; claims?: ClaimId[] };

/** FAQ sets by page. Each page's task fills its own list. */
export const FAQS: Record<"home" | "pricing" | "teams" | "help", Faq[]> = {
  home: [],
  pricing: [],
  teams: [],
  help: [],
};
