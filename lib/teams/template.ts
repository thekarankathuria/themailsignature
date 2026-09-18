import { db } from "@/lib/db";
import { nowIso } from "@/lib/db/ids";
import { normaliseData, normaliseName, normaliseStyle } from "@/lib/signatures/normalise";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import { applyLocks, cleanLocked, type LockGroupId } from "./locks";

/**
 * The company template: one per organization, plus the list of groups members
 * may not change.
 */
export type CompanyTemplate = {
  name: string;
  data: SignatureData;
  style: SignatureStyle;
  locked: LockGroupId[];
  updatedAt: string | null;
};

type Row = { name: string; data: string; style: string; locked: string; updated_at: string };

export function readTemplate(orgId: string): CompanyTemplate | null {
  const row = db().prepare("select * from org_templates where org_id = ?").get(orgId) as Row | undefined;
  if (!row) return null;
  return {
    name: row.name,
    data: normaliseData(safeParse(row.data)),
    style: normaliseStyle(safeParse(row.style)),
    locked: cleanLocked(safeParse(row.locked)),
    updatedAt: row.updated_at,
  };
}

/** The template, or a blank one, so callers never branch on "not set up yet". */
export function templateOrBlank(orgId: string): CompanyTemplate {
  return (
    readTemplate(orgId) ?? {
      name: "Company template",
      data: DEFAULT_DATA,
      style: DEFAULT_STYLE,
      locked: [],
      updatedAt: null,
    }
  );
}

export function writeTemplate(
  orgId: string,
  input: { name?: string; data: unknown; style: unknown; locked: unknown },
): CompanyTemplate {
  const data = normaliseData(input.data);
  const style = normaliseStyle(input.style);
  const locked = cleanLocked(input.locked);
  const name = normaliseName(input.name, "Company template");
  const updatedAt = nowIso();

  db()
    .prepare(
      `insert into org_templates (org_id, name, data, style, locked, updated_at)
       values (?, ?, ?, ?, ?, ?)
       on conflict(org_id) do update set
         name = excluded.name, data = excluded.data, style = excluded.style,
         locked = excluded.locked, updated_at = excluded.updated_at`,
    )
    .run(orgId, name, JSON.stringify(data), JSON.stringify(style), JSON.stringify(locked), updatedAt);

  return { name, data, style, locked, updatedAt };
}

/**
 * A member's signature as it is actually sent: their own values, with every
 * locked group replaced by the company's. Signatures that follow no template
 * come back untouched.
 */
export function withCompanyTemplate(
  signature: { data: SignatureData; style: SignatureStyle; orgTemplateId: string | null },
): { data: SignatureData; style: SignatureStyle; locked: LockGroupId[] } {
  if (!signature.orgTemplateId) return { data: signature.data, style: signature.style, locked: [] };
  const template = readTemplate(signature.orgTemplateId);
  if (!template) return { data: signature.data, style: signature.style, locked: [] };
  const merged = applyLocks(signature, template, template.locked);
  return { ...merged, locked: template.locked };
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

/**
 * Points every member's signatures at the company template.
 *
 * Only the pointer is written. The locked values themselves are merged when a
 * signature is rendered, so an admin's edit reaches everyone without touching
 * a single member's row.
 */
export function linkMemberSignatures(orgId: string): void {
  db()
    .prepare(
      `update signatures set org_template_id = ?
        where org_template_id is null
          and user_id in (select user_id from memberships where org_id = ?)`,
    )
    .run(orgId, orgId);
}
