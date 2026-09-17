import { planFor } from "@/lib/billing/plans";
import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import { normaliseData, normaliseName, normaliseStyle } from "./normalise";

/** Signatures saved to an account. */
export type SavedSignature = {
  id: string;
  userId: string;
  name: string;
  data: SignatureData;
  style: SignatureStyle;
  designId: string | null;
  createdAt: string;
  updatedAt: string;
};

type Row = {
  id: string;
  user_id: string;
  name: string;
  data: string;
  style: string;
  design_id: string | null;
  created_at: string;
  updated_at: string;
};

/** How many signatures a plan may keep. */
export const FREE_SIGNATURE_LIMIT = 1;

export class SignatureLimitError extends Error {
  constructor() {
    super("The Free plan keeps one saved signature.");
  }
}

function toSignature(row: Row): SavedSignature {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    data: normaliseData(JSON.parse(row.data)),
    style: normaliseStyle(JSON.parse(row.style)),
    designId: row.design_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function countSignatures(userId: string): number {
  const row = db().prepare("select count(*) as n from signatures where user_id = ?").get(userId) as { n: number };
  return row.n;
}

export function listSignatures(userId: string): SavedSignature[] {
  const rows = db()
    .prepare("select * from signatures where user_id = ? order by updated_at desc")
    .all(userId) as Row[];
  return rows.map(toSignature);
}

export function getSignature(userId: string, id: string): SavedSignature | null {
  const row = db().prepare("select * from signatures where id = ? and user_id = ?").get(id, userId) as Row | undefined;
  return row ? toSignature(row) : null;
}

export function createSignature(
  userId: string,
  input: { name?: unknown; data: unknown; style: unknown; designId?: unknown },
): SavedSignature {
  if (planFor(userId) === "free" && countSignatures(userId) >= FREE_SIGNATURE_LIMIT) {
    throw new SignatureLimitError();
  }
  const now = nowIso();
  const id = newId();
  const data = normaliseData(input.data);
  const style = normaliseStyle(input.style);
  const name = normaliseName(input.name, [data.firstName, data.lastName].filter(Boolean).join(" ") || "My signature");
  const designId = typeof input.designId === "string" ? input.designId.slice(0, 80) : null;

  db()
    .prepare(
      "insert into signatures (id, user_id, name, data, style, design_id, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(id, userId, name, JSON.stringify(data), JSON.stringify(style), designId, now, now);
  return getSignature(userId, id)!;
}

export function updateSignature(
  userId: string,
  id: string,
  patch: { name?: unknown; data?: unknown; style?: unknown; designId?: unknown },
): SavedSignature | null {
  const existing = getSignature(userId, id);
  if (!existing) return null;
  const name = patch.name === undefined ? existing.name : normaliseName(patch.name, existing.name);
  const data = patch.data === undefined ? existing.data : normaliseData(patch.data);
  const style = patch.style === undefined ? existing.style : normaliseStyle(patch.style);
  const designId =
    patch.designId === undefined ? existing.designId : typeof patch.designId === "string" ? patch.designId.slice(0, 80) : null;

  db()
    .prepare("update signatures set name = ?, data = ?, style = ?, design_id = ?, updated_at = ? where id = ? and user_id = ?")
    .run(name, JSON.stringify(data), JSON.stringify(style), designId, nowIso(), id, userId);
  return getSignature(userId, id);
}

export function deleteSignature(userId: string, id: string): boolean {
  const result = db().prepare("delete from signatures where id = ? and user_id = ?").run(id, userId);
  return Number(result.changes) > 0;
}

export function duplicateSignature(userId: string, id: string): SavedSignature | null {
  const existing = getSignature(userId, id);
  if (!existing) return null;
  return createSignature(userId, {
    name: `${existing.name} (copy)`.slice(0, 80),
    data: existing.data,
    style: existing.style,
    designId: existing.designId,
  });
}
