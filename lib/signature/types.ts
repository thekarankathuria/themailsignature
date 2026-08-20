/**
 * Core data model for a signature.
 *
 * Everything a template can draw lives in `SignatureData`; everything about how
 * it is drawn lives in `SignatureStyle`. Templates are pure functions of the
 * two, which is what lets templates be data rather than components.
 */

export type SocialKey =
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "github"
  | "dribbble"
  | "behance"
  | "pinterest"
  | "threads"
  | "whatsapp"
  | "telegram"
  | "discord"
  | "twitch"
  | "spotify"
  | "medium"
  | "reddit"
  | "snapchat"
  | "vimeo"
  | "calendly"
  | "slack";

export interface SignatureData {
  // Identity
  firstName: string;
  lastName: string;
  credentials: string;
  pronouns: string;
  jobTitle: string;
  department: string;

  // Company
  company: string;
  website: string;
  addressLine1: string;
  addressLine2: string;

  // Contact
  email: string;
  phone: string;
  mobile: string;

  // Scheduling
  meetingLabel: string;
  meetingUrl: string;

  // Graphics
  logoUrl: string;
  logoWidth: number;
  logoLink: string;
  photoUrl: string;
  photoSize: number;
  bannerUrl: string;
  bannerLink: string;
  bannerWidth: number;

  // Call to action
  ctaText: string;
  ctaUrl: string;

  // Extras
  tagline: string;
  disclaimer: string;
  greenFooter: boolean;

  social: Partial<Record<SocialKey, string>>;
}

export type FontKey =
  | "arial"
  | "helvetica"
  | "verdana"
  | "tahoma"
  | "trebuchet"
  | "georgia"
  | "times"
  | "garamond"
  | "palatino"
  | "courier"
  | "system";

export type IconStyle =
  | "color"
  | "circle"
  | "dark"
  | "light"
  | "glyphDark"
  | "glyphLight";

export type Density = "compact" | "cozy" | "roomy";
export type PhotoShape = "square" | "rounded" | "circle";

export interface SignatureStyle {
  templateId: string;
  font: FontKey;
  fontSize: number;
  accent: string;
  nameColor: string;
  textColor: string;
  mutedColor: string;
  linkColor: string;
  iconStyle: IconStyle;
  iconSize: number;
  density: Density;
  photoShape: PhotoShape;
  showDivider: boolean;
  showLabels: boolean;
  uppercaseName: boolean;
}

export interface RenderContext {
  /** Absolute origin that hosted assets (social icons) are served from. */
  assetBase: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  blurb: string;
  /** Fields the template ignores, so the builder can grey them out. */
  omits?: Array<"photo" | "logo" | "banner">;
  /** Sensible style overrides applied when the template is selected. */
  styleHints?: Partial<SignatureStyle>;
}
