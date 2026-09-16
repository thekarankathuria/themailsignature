import type { ContactIconTone, SignatureStyle, StatusDot } from "./types";

/** Status dot colours we pre-render. The editor offers only these. */
export const STATUS_COLORS = ["#22A55B", "#0050B8", "#E0A100", "#D93A3A", "#7A4CD9", "#12A3A8"] as const;

export type ContactKind = "phone" | "mobile" | "email" | "web" | "address" | "meeting";

const trim = (base: string) => base.replace(/\/$/, "");

export function socialIconPath(base: string, style: SignatureStyle, slug: string): string {
  const root = trim(base);
  return style.iconAnimation === "none"
    ? `${root}/i/social/${style.iconStyle}/${slug}.png`
    : `${root}/i/social-anim/${style.iconAnimation}/${style.iconStyle}/${slug}.gif`;
}

export function contactIconPath(
  base: string,
  tone: Exclude<ContactIconTone, "none">,
  kind: ContactKind,
): string {
  return `${trim(base)}/i/contact/${tone}/${kind}.png`;
}

export function statusDotPath(base: string, mode: Exclude<StatusDot, "none">, color: string): string {
  const known = (STATUS_COLORS as readonly string[]).find((c) => c.toLowerCase() === color.toLowerCase());
  const hex = (known ?? STATUS_COLORS[0]).slice(1).toLowerCase();
  return `${trim(base)}/i/status/${mode}-${hex}.gif`;
}
