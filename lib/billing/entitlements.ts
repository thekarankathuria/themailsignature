import { FONT_STACKS, esc } from "@/lib/signature/html";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import type { PlanId } from "./plans";

/**
 * What a plan allows. The editor uses this to show which Pro options a
 * signature uses; the server uses the same functions to decide what may be
 * exported, so the two can never disagree.
 */
export type ProFeatureId = "layout" | "animation" | "status" | "banner" | "buttons" | "hosted" | "gif";

export type ProFeature = { id: ProFeatureId; label: string };

const LABELS: Record<ProFeatureId, string> = {
  layout: "designer layout",
  animation: "animated icons",
  status: "status dot",
  banner: "banner",
  buttons: "call-to-action or meeting button",
  hosted: "images hosted by us",
  gif: "animated GIF image",
};

const HOSTED = /\/u\/[0-9a-f]{32}\.(png|jpg|gif)(\?.*)?$/i;
const GIF = /\.gif(\?.*)?$/i;

export function proFeatures(data: SignatureData, style: SignatureStyle): ProFeature[] {
  const ids: ProFeatureId[] = [];
  if (TEMPLATE_BY_ID[style.templateId]?.tier === "pro") ids.push("layout");
  if (style.iconAnimation !== "none") ids.push("animation");
  if (style.statusDot !== "none") ids.push("status");
  if (data.bannerUrl.trim()) ids.push("banner");
  if ((data.ctaText.trim() && data.ctaUrl.trim()) || data.meetingUrl.trim()) ids.push("buttons");
  const images = [data.logoUrl, data.photoUrl, data.bannerUrl].map((u) => u.trim()).filter(Boolean);
  if (images.some((u) => HOSTED.test(u))) ids.push("hosted");
  if (images.some((u) => GIF.test(u))) ids.push("gif");
  return ids.map((id) => ({ id, label: LABELS[id] }));
}

export function canExport(plan: PlanId, features: ProFeature[]): boolean {
  return plan !== "free" || features.length === 0;
}

export function canUpload(plan: PlanId): boolean {
  return plan !== "free";
}

/** The closest free layout for each Pro layout. */
const NEAREST_FREE: Record<string, string> = {
  ledger: "meridian",
  slate: "meridian",
  broadcast: "stack",
  split: "meridian",
  luxe: "portrait",
  corporate: "meridian",
  studio: "portrait",
  executive: "meridian",
  nordic: "stack",
  bold: "meridian",
  startup: "portrait",
  editorial: "meridian",
  personal: "portrait",
  ultra: "minimal",
  monogram: "meridian",
  colorblock: "meridian",
};

export function nearestFreeLayout(templateId: string): string {
  if (TEMPLATE_BY_ID[templateId]?.tier === "free") return templateId;
  return NEAREST_FREE[templateId] ?? "meridian";
}

/** The same signature with every Pro option switched off. */
export function freeVersion(data: SignatureData, style: SignatureStyle): { data: SignatureData; style: SignatureStyle } {
  const templateId = nearestFreeLayout(style.templateId);
  const keepImage = (url: string) => (HOSTED.test(url.trim()) || GIF.test(url.trim()) ? "" : url);
  return {
    data: {
      ...data,
      bannerUrl: "",
      bannerLink: "",
      ctaText: "",
      ctaUrl: "",
      meetingUrl: "",
      logoUrl: keepImage(data.logoUrl),
      photoUrl: keepImage(data.photoUrl),
    },
    style: {
      ...style,
      ...(TEMPLATE_BY_ID[templateId]?.styleHints ?? {}),
      templateId,
      iconAnimation: "none",
      statusDot: "none",
    },
  };
}

export const FREE_FOOTER_TEXT = "Made with TheMailSignature";

/** Appends the Free plan's small credit link under the signature. */
export function withFreeFooter(html: string, style: SignatureStyle, site: string): string {
  const href = `${site.replace(/\/$/, "")}/?ref=signature`;
  return (
    html +
    `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;margin-top:12px;"><tr>` +
    `<td style="font-family:${FONT_STACKS[style.font]};font-size:11px;line-height:16px;color:#8A9099;">` +
    `<a href="${esc(href)}" style="color:#8A9099;text-decoration:none;"><span style="color:#8A9099;text-decoration:none;">${FREE_FOOTER_TEXT}</span></a>` +
    `</td></tr></table>`
  );
}
