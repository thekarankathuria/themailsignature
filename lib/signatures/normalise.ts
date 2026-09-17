import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { FONT_STACKS } from "@/lib/signature/html";
import { SOCIALS } from "@/lib/signature/social";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle, SocialKey } from "@/lib/signature/types";

/**
 * Turns whatever the browser sent into a signature the renderer can trust.
 * Unknown keys are dropped, every value is checked against its type, and
 * anything invalid falls back to the default. The renderer escapes text as
 * well, so this is about shape and size rather than markup safety.
 */
const MAX_TEXT = 2000;
const HEX = /^#[0-9a-f]{3,8}$/i;

const TEXT_FIELDS = [
  "firstName", "lastName", "credentials", "pronouns", "jobTitle", "department",
  "company", "website", "addressLine1", "addressLine2", "email", "phone", "mobile",
  "meetingLabel", "meetingUrl", "logoUrl", "logoLink", "photoUrl", "bannerUrl",
  "bannerLink", "ctaText", "ctaUrl", "tagline", "sideText", "disclaimer",
] as const;

const NUMBER_FIELDS: Array<[keyof SignatureData, number, number]> = [
  ["logoWidth", 40, 600],
  ["photoSize", 40, 200],
  ["bannerWidth", 100, 600],
];

const SOCIAL_KEYS = new Set<string>(SOCIALS.map((s) => s.key));

function text(value: unknown, fallback: string): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT) : fallback;
}

function number(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function colour(value: unknown, fallback: string): string {
  return typeof value === "string" && HEX.test(value.trim()) ? value.trim() : fallback;
}

export function normaliseData(input: unknown): SignatureData {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const data = { ...DEFAULT_DATA } as SignatureData;

  for (const field of TEXT_FIELDS) data[field] = text(source[field], DEFAULT_DATA[field]);
  for (const [field, min, max] of NUMBER_FIELDS) {
    (data[field] as number) = number(source[field], DEFAULT_DATA[field] as number, min, max);
  }
  data.greenFooter = bool(source.greenFooter, false);

  const social: Partial<Record<SocialKey, string>> = {};
  const given = source.social;
  if (typeof given === "object" && given !== null) {
    for (const [key, value] of Object.entries(given as Record<string, unknown>)) {
      if (SOCIAL_KEYS.has(key) && typeof value === "string" && value.trim()) {
        social[key as SocialKey] = value.trim().slice(0, 300);
      }
    }
  }
  data.social = social;
  return data;
}

export function normaliseStyle(input: unknown): SignatureStyle {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const fonts = Object.keys(FONT_STACKS) as Array<keyof typeof FONT_STACKS>;
  const templateId = typeof source.templateId === "string" && TEMPLATE_BY_ID[source.templateId]
    ? source.templateId
    : DEFAULT_STYLE.templateId;

  return {
    templateId,
    font: oneOf(source.font, fonts, DEFAULT_STYLE.font),
    secondaryFont: oneOf(source.secondaryFont, fonts, DEFAULT_STYLE.secondaryFont),
    fontSize: number(source.fontSize, DEFAULT_STYLE.fontSize, 11, 18),
    accent: colour(source.accent, DEFAULT_STYLE.accent),
    nameColor: colour(source.nameColor, DEFAULT_STYLE.nameColor),
    textColor: colour(source.textColor, DEFAULT_STYLE.textColor),
    mutedColor: colour(source.mutedColor, DEFAULT_STYLE.mutedColor),
    linkColor: colour(source.linkColor, DEFAULT_STYLE.linkColor),
    statusColor: colour(source.statusColor, DEFAULT_STYLE.statusColor),
    iconStyle: oneOf(source.iconStyle, ["color", "circle", "dark", "light", "glyphDark", "glyphLight"] as const, DEFAULT_STYLE.iconStyle),
    iconSize: number(source.iconSize, DEFAULT_STYLE.iconSize, 16, 32),
    iconAnimation: oneOf(source.iconAnimation, ["none", "pulse", "bounce", "wiggle"] as const, "none"),
    statusDot: oneOf(source.statusDot, ["none", "static", "blink"] as const, "none"),
    contactIcons: oneOf(source.contactIcons, ["none", "ink", "muted", "light"] as const, DEFAULT_STYLE.contactIcons),
    density: oneOf(source.density, ["compact", "cozy", "roomy"] as const, DEFAULT_STYLE.density),
    photoShape: oneOf(source.photoShape, ["square", "rounded", "circle"] as const, DEFAULT_STYLE.photoShape),
    showDivider: bool(source.showDivider, DEFAULT_STYLE.showDivider),
    showLabels: bool(source.showLabels, DEFAULT_STYLE.showLabels),
    uppercaseName: bool(source.uppercaseName, DEFAULT_STYLE.uppercaseName),
  };
}

export function normaliseName(input: unknown, fallback = "My signature"): string {
  const name = typeof input === "string" ? input.trim().slice(0, 80) : "";
  return name || fallback;
}
