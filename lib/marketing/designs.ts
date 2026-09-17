import { FREE_TEMPLATE_IDS, TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type {
  FontKey,
  IconAnimation,
  SignatureData,
  SignatureStyle,
  StatusDot,
} from "@/lib/signature/types";
import { sampleSignature } from "./samples";

/**
 * Curated designs: a layout plus one industry's palette, type and side text.
 * Every industry has six, the first of which is free and uses a free layout.
 * `npm test` checks the counts, the free rule and every colour's contrast.
 */
export type Design = {
  id: string;
  industry: string;
  layoutId: string;
  name: string;
  tier: "free" | "pro";
  animated: boolean;
  style: Partial<SignatureStyle>;
  data: Partial<SignatureData>;
};

type Look = {
  accent: string;
  name: string;
  text: string;
  muted: string;
  body: FontKey;
  display: FontKey;
  sideText: string;
  tagline: string;
  /** Six layout ids; the first must be a free layout. */
  layouts: string[];
  animate: { layoutId: string; iconAnimation?: IconAnimation; statusDot?: StatusDot };
};

const INK = { name: "#1B1F24", text: "#3A4048", muted: "#5F6570" };

const LOOKS: Record<string, Look> = {
  accountants: {
    accent: "#1F4E79", ...INK, body: "arial", display: "georgia",
    sideText: "Clarity\nAccuracy\nTrust", tagline: "Numbers you can plan around",
    layouts: ["minimal", "luxe", "corporate", "nordic", "ultra", "monogram"],
    animate: { layoutId: "corporate", iconAnimation: "pulse" },
  },
  ceos: {
    accent: "#2B3A55", name: "#14171C", text: "#383E47", muted: "#5F6570", body: "helvetica", display: "palatino",
    sideText: "Vision\nPeople\nMomentum", tagline: "Building what comes next",
    layouts: ["portrait", "executive", "bold", "luxe", "personal", "corporate"],
    animate: { layoutId: "executive", iconAnimation: "pulse" },
  },
  consultants: {
    accent: "#0E6B78", ...INK, body: "arial", display: "georgia",
    sideText: "Strategy\nInsight\nResults", tagline: "Clear thinking for hard problems",
    layouts: ["meridian", "corporate", "ultra", "editorial", "startup", "executive"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "customer-support": {
    accent: "#1D63A8", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Here to help\nEvery day", tagline: "Real people, quick answers",
    layouts: ["stack", "startup", "colorblock", "ultra", "monogram", "nordic"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "education-schools-universities": {
    accent: "#6B2E7A", ...INK, body: "arial", display: "garamond",
    sideText: "Learn\nDiscover\nBelong", tagline: "Where curiosity grows",
    layouts: ["stack", "editorial", "nordic", "monogram", "corporate", "colorblock"],
    animate: { layoutId: "colorblock", iconAnimation: "bounce" },
  },
  entrepreneurs: {
    accent: "#0F7B5F", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Build\nShip\nGrow", tagline: "Made with care, shipped with purpose",
    layouts: ["portrait", "startup", "bold", "personal", "colorblock", "studio"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "finance-banking": {
    accent: "#14443F", name: "#14181C", text: "#394048", muted: "#5F6570", body: "arial", display: "palatino",
    sideText: "Stability\nPrudence\nGrowth", tagline: "Banking built on relationships",
    layouts: ["minimal", "executive", "corporate", "luxe", "monogram", "ultra"],
    animate: { layoutId: "corporate", iconAnimation: "pulse" },
  },
  freelancers: {
    accent: "#B03059", ...INK, body: "trebuchet", display: "georgia",
    sideText: "Words\nIdeas\nImpact", tagline: "Copy that sounds like you",
    layouts: ["portrait", "personal", "studio", "startup", "nordic", "bold"],
    animate: { layoutId: "studio", iconAnimation: "wiggle" },
  },
  healthcare: {
    accent: "#0F6E62", ...INK, body: "arial", display: "helvetica",
    sideText: "Care\nListen\nHeal", tagline: "Care that starts with listening",
    layouts: ["stack", "nordic", "corporate", "ultra", "monogram", "startup"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "hr-admin": {
    accent: "#3F6B8A", ...INK, body: "trebuchet", display: "trebuchet",
    sideText: "People\nCulture\nGrowth", tagline: "Great teams start here",
    layouts: ["meridian", "nordic", "startup", "corporate", "colorblock", "editorial"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "it-operations": {
    accent: "#2C58C9", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Secure\nStable\nSupported", tagline: "Keeping everyone online",
    layouts: ["minimal", "startup", "ultra", "monogram", "colorblock", "bold"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  lawyers: {
    accent: "#7A2E2E", name: "#15171A", text: "#383C42", muted: "#5F6570", body: "arial", display: "garamond",
    sideText: "Counsel\nIntegrity\nResolve", tagline: "Advice you can act on",
    layouts: ["minimal", "executive", "luxe", "editorial", "corporate", "monogram"],
    animate: { layoutId: "luxe", iconAnimation: "pulse" },
  },
  marketers: {
    accent: "#B8235A", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Stories\nAudiences\nGrowth", tagline: "Campaigns people remember",
    layouts: ["meridian", "colorblock", "bold", "studio", "startup", "personal"],
    animate: { layoutId: "colorblock", iconAnimation: "bounce" },
  },
  "marketing-creative-agencies": {
    accent: "#B8432F", ...INK, body: "helvetica", display: "georgia",
    sideText: "Good ideas\ntravel further\nBrand\nDesign", tagline: "Brands with a point of view",
    layouts: ["portrait", "studio", "bold", "editorial", "personal", "colorblock"],
    animate: { layoutId: "studio", iconAnimation: "wiggle" },
  },
  "marketing-teams": {
    accent: "#0050B8", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Launch\nLearn\nRepeat", tagline: "Now launching: the spring collection",
    layouts: ["meridian", "colorblock", "startup", "bold", "studio", "nordic"],
    animate: { layoutId: "bold", iconAnimation: "bounce" },
  },
  "personal-assistants": {
    accent: "#5E4A8C", ...INK, body: "arial", display: "georgia",
    sideText: "Organised\nPrepared\nOn time", tagline: "Keeping the week on track",
    layouts: ["stack", "ultra", "nordic", "luxe", "corporate", "startup"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  "real-estate-firms": {
    accent: "#1F5C4A", ...INK, body: "arial", display: "palatino",
    sideText: "Homes\nNeighbourhoods\nFutures", tagline: "Local expertise since day one",
    layouts: ["meridian", "corporate", "colorblock", "executive", "monogram", "nordic"],
    animate: { layoutId: "colorblock", iconAnimation: "pulse" },
  },
  realtor: {
    accent: "#9C4A1A", ...INK, body: "helvetica", display: "georgia",
    sideText: "Find\nLove\nMove in", tagline: "Helping you find your place",
    layouts: ["portrait", "personal", "luxe", "startup", "bold", "colorblock"],
    animate: { layoutId: "personal", iconAnimation: "bounce" },
  },
  "sales-teams": {
    accent: "#0B63B5", ...INK, body: "helvetica", display: "helvetica",
    sideText: "Listen\nSolve\nDeliver", tagline: "Let's find the right fit",
    layouts: ["meridian", "startup", "bold", "colorblock", "corporate", "executive"],
    animate: { layoutId: "startup", statusDot: "blink" },
  },
  students: {
    accent: "#1C7C54", ...INK, body: "trebuchet", display: "trebuchet",
    sideText: "Curious\nBuilding\nLearning", tagline: "Open to internships",
    layouts: ["stack", "ultra", "nordic", "startup", "personal", "studio"],
    animate: { layoutId: "studio", iconAnimation: "bounce" },
  },
  teachers: {
    accent: "#A14A12", ...INK, body: "arial", display: "georgia",
    sideText: "Teach\nInspire\nGrow", tagline: "Every learner, every day",
    layouts: ["meridian", "nordic", "studio", "editorial", "colorblock", "ultra"],
    animate: { layoutId: "colorblock", iconAnimation: "wiggle" },
  },
};

function build(industry: string, look: Look, layoutId: string, index: number): Design {
  const template = TEMPLATE_BY_ID[layoutId];
  if (!template) throw new Error(`Unknown layout ${layoutId} for ${industry}`);
  const free = index === 0;
  if (free && !FREE_TEMPLATE_IDS.includes(layoutId)) {
    throw new Error(`${industry}: the free design must use a free layout, not ${layoutId}`);
  }
  const extra = !free && look.animate.layoutId === layoutId ? look.animate : null;
  const style: Partial<SignatureStyle> = {
    ...(template.styleHints ?? {}),
    accent: look.accent,
    linkColor: look.accent,
    nameColor: look.name,
    textColor: look.text,
    mutedColor: look.muted,
    font: look.body,
    secondaryFont: look.display,
    ...(extra?.iconAnimation ? { iconAnimation: extra.iconAnimation } : {}),
    ...(extra?.statusDot ? { statusDot: extra.statusDot } : {}),
  };
  return {
    id: `${industry}-${layoutId}`,
    industry,
    layoutId,
    name: template.name,
    tier: free ? "free" : "pro",
    animated: Boolean(extra?.iconAnimation && extra.iconAnimation !== "none") || extra?.statusDot === "blink",
    style,
    data: { sideText: look.sideText, tagline: look.tagline },
  };
}

export function designsFor(industry: string): Design[] {
  const look = LOOKS[industry];
  if (!look) return [];
  return look.layouts.map((layoutId, i) => build(industry, look, layoutId, i));
}

export const ALL_DESIGNS: Design[] = Object.keys(LOOKS).flatMap(designsFor);

export const DESIGN_BY_ID: Record<string, Design> = Object.fromEntries(
  ALL_DESIGNS.map((design) => [design.id, design]),
);

/** A complete signature for a design, using the industry's sample person. */
export function designSignature(design: Design): { data: SignatureData; style: SignatureStyle } {
  const base = sampleSignature(design.industry, design.layoutId);
  return {
    data: { ...base.data, ...design.data },
    style: { ...base.style, ...design.style },
  };
}
