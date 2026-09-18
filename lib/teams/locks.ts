import type { SignatureData, SignatureStyle } from "@/lib/signature/types";

/**
 * Locked groups: the parts of a signature an admin can fix for the whole team.
 *
 * Admins lock groups rather than arbitrary field paths, because a group is a
 * sentence an admin can understand ("the logo", "the disclaimer") and a rule
 * the server can enforce in one place. The seven groups below cover everything
 * a company standard usually cares about; what is left over is exactly what
 * each person should be filling in about themselves.
 */
export type LockGroupId = "layout" | "brand" | "logo" | "banner" | "company" | "disclaimer" | "social";

export type LockGroup = {
  id: LockGroupId;
  label: string;
  description: string;
  /** Fields of SignatureData this group owns. */
  data: Array<keyof SignatureData>;
  /** Fields of SignatureStyle this group owns. */
  style: Array<keyof SignatureStyle>;
};

export const LOCK_GROUPS: LockGroup[] = [
  {
    id: "layout",
    label: "Layout",
    description: "The template and how it is arranged, so every signature has the same shape.",
    data: [],
    style: ["templateId", "density", "photoShape", "showDivider", "showLabels", "uppercaseName"],
  },
  {
    id: "brand",
    label: "Colours and fonts",
    description: "Accent, text and link colours, the typeface and its size.",
    data: [],
    style: [
      "font",
      "fontSize",
      "accent",
      "nameColor",
      "textColor",
      "mutedColor",
      "linkColor",
      "iconStyle",
      "iconSize",
      "iconAnimation",
    ],
  },
  {
    id: "logo",
    label: "Company logo",
    description: "The logo image, its size and where it links to.",
    data: ["logoUrl", "logoWidth", "logoLink"],
    style: [],
  },
  {
    id: "banner",
    label: "Banner",
    description: "The campaign banner under the signature, so a whole team can promote the same thing.",
    data: ["bannerUrl", "bannerLink", "bannerWidth"],
    style: [],
  },
  {
    id: "company",
    label: "Company details",
    description: "Company name, website, address and tagline.",
    data: ["company", "website", "addressLine1", "addressLine2", "tagline"],
    style: [],
  },
  {
    id: "disclaimer",
    label: "Disclaimer",
    description: "The legal or confidentiality line at the foot of the signature.",
    data: ["disclaimer", "greenFooter"],
    style: [],
  },
  {
    id: "social",
    label: "Social links",
    description: "The company's social profiles, the same on everyone's signature.",
    data: ["social"],
    style: [],
  },
];

export const LOCK_GROUP_BY_ID: Record<LockGroupId, LockGroup> = Object.fromEntries(
  LOCK_GROUPS.map((group) => [group.id, group]),
) as Record<LockGroupId, LockGroup>;

export function isLockGroupId(value: unknown): value is LockGroupId {
  return typeof value === "string" && value in LOCK_GROUP_BY_ID;
}

export function cleanLocked(value: unknown): LockGroupId[] {
  if (!Array.isArray(value)) return [];
  return LOCK_GROUPS.map((group) => group.id).filter((id) => value.includes(id));
}

/** Which fields a member may not edit, for disabling inputs in the editor. */
export function lockedFields(locked: LockGroupId[]): {
  data: Set<keyof SignatureData>;
  style: Set<keyof SignatureStyle>;
} {
  const data = new Set<keyof SignatureData>();
  const style = new Set<keyof SignatureStyle>();
  for (const id of locked) {
    for (const field of LOCK_GROUP_BY_ID[id].data) data.add(field);
    for (const field of LOCK_GROUP_BY_ID[id].style) style.add(field);
  }
  return { data, style };
}

/**
 * The authority on what a member's signature actually contains.
 *
 * Every render path runs this, so the stored member record does not matter:
 * an API call that writes a locked value is simply overwritten on the way out.
 * It also means changing the company template changes every member's signature
 * with no migration and no write to anyone's row.
 */
export function applyLocks<D extends SignatureData, S extends SignatureStyle>(
  member: { data: D; style: S },
  template: { data: SignatureData; style: SignatureStyle },
  locked: LockGroupId[],
): { data: D; style: S } {
  if (locked.length === 0) return member;

  const data = { ...member.data };
  const style = { ...member.style };
  for (const id of locked) {
    const group = LOCK_GROUP_BY_ID[id];
    for (const field of group.data) {
      (data as SignatureData)[field] = template.data[field] as never;
    }
    for (const field of group.style) {
      (style as SignatureStyle)[field] = template.style[field] as never;
    }
  }
  return { data, style };
}
