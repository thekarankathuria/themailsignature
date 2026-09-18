import { db } from "@/lib/db";
import { nowIso } from "@/lib/db/ids";
import { FONT_STACKS } from "@/lib/signature/html";
import type { FontKey } from "@/lib/signature/types";

/**
 * The shared brand kit: approved colours, fonts, the company logo and the
 * current banner.
 *
 * This is a convenience, not a control. It puts the right values one click
 * away in every member's editor; the company template is what actually stops
 * anyone from changing them.
 */
export type BrandKit = {
  colors: string[];
  fonts: FontKey[];
  logoUrl: string | null;
  bannerUrl: string | null;
  updatedAt: string | null;
};

export const EMPTY_KIT: BrandKit = { colors: [], fonts: [], logoUrl: null, bannerUrl: null, updatedAt: null };

const HEX = /^#[0-9a-f]{6}$/i;
const MAX_COLORS = 8;

export function isBrandColor(value: string): boolean {
  return HEX.test(value.trim());
}

function cleanColors(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  for (const value of values) {
    if (typeof value !== "string") continue;
    const colour = value.trim().toLowerCase();
    if (HEX.test(colour)) seen.add(colour);
    if (seen.size >= MAX_COLORS) break;
  }
  return [...seen];
}

function cleanFonts(values: unknown): FontKey[] {
  if (!Array.isArray(values)) return [];
  const keys = new Set<FontKey>();
  for (const value of values) {
    if (typeof value === "string" && value in FONT_STACKS) keys.add(value as FontKey);
  }
  return [...keys];
}

/** An image address the signature engine would accept, or null. */
function cleanImage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (!url) return null;
  if (url.length > 2000) return null;
  return /^https?:\/\//i.test(url) || url.startsWith("/u/") ? url : null;
}

type Row = {
  colors: string;
  fonts: string;
  logo_url: string | null;
  banner_url: string | null;
  updated_at: string;
};

export function readBrandKit(orgId: string): BrandKit {
  const row = db().prepare("select * from brand_kits where org_id = ?").get(orgId) as Row | undefined;
  if (!row) return EMPTY_KIT;
  return {
    colors: cleanColors(safeParse(row.colors)),
    fonts: cleanFonts(safeParse(row.fonts)),
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    updatedAt: row.updated_at,
  };
}

export function writeBrandKit(orgId: string, kit: Partial<BrandKit>): BrandKit {
  const current = readBrandKit(orgId);
  const next: BrandKit = {
    colors: kit.colors === undefined ? current.colors : cleanColors(kit.colors),
    fonts: kit.fonts === undefined ? current.fonts : cleanFonts(kit.fonts),
    logoUrl: kit.logoUrl === undefined ? current.logoUrl : cleanImage(kit.logoUrl),
    bannerUrl: kit.bannerUrl === undefined ? current.bannerUrl : cleanImage(kit.bannerUrl),
    updatedAt: nowIso(),
  };

  db()
    .prepare(
      `insert into brand_kits (org_id, colors, fonts, logo_url, banner_url, updated_at)
       values (?, ?, ?, ?, ?, ?)
       on conflict(org_id) do update set
         colors = excluded.colors, fonts = excluded.fonts, logo_url = excluded.logo_url,
         banner_url = excluded.banner_url, updated_at = excluded.updated_at`,
    )
    .run(orgId, JSON.stringify(next.colors), JSON.stringify(next.fonts), next.logoUrl, next.bannerUrl, next.updatedAt);

  return next;
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
