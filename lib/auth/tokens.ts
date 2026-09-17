import { createHash, randomBytes } from "node:crypto";
import { db, transaction } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";

/**
 * Single-use tokens for email verification and password reset. Only the
 * SHA-256 of a token is stored, so a copy of the database cannot be used to
 * verify or reset anyone's account.
 */
export type TokenKind = "verify" | "reset";

const LIFETIME_MS: Record<TokenKind, number> = {
  verify: 24 * 60 * 60 * 1000,
  reset: 60 * 60 * 1000,
};

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Issues a token, cancelling any unused token of the same kind. */
export function issueToken(userId: string, kind: TokenKind): string {
  const token = newToken();
  transaction(() => {
    db().prepare("delete from auth_tokens where user_id = ? and kind = ? and used_at is null").run(userId, kind);
    db()
      .prepare("insert into auth_tokens (id, user_id, kind, token_hash, expires_at) values (?, ?, ?, ?, ?)")
      .run(newId(), userId, kind, hashToken(token), new Date(Date.now() + LIFETIME_MS[kind]).toISOString());
  });
  return token;
}

/** The user id for a valid, unused token, without using it up. */
export function peekToken(token: string, kind: TokenKind): string | null {
  if (!token || token.length > 100) return null;
  const row = db()
    .prepare("select user_id, expires_at from auth_tokens where token_hash = ? and kind = ? and used_at is null")
    .get(hashToken(token), kind) as { user_id: string; expires_at: string } | undefined;
  return row && new Date(row.expires_at).getTime() > Date.now() ? row.user_id : null;
}

/** Marks a valid token used and returns its user id, or null. */
export function consumeToken(token: string, kind: TokenKind): string | null {
  if (!token || token.length > 100) return null;
  const row = db()
    .prepare("select id, user_id, expires_at from auth_tokens where token_hash = ? and kind = ? and used_at is null")
    .get(hashToken(token), kind) as { id: string; user_id: string; expires_at: string } | undefined;
  if (!row || new Date(row.expires_at).getTime() <= Date.now()) return null;
  db().prepare("update auth_tokens set used_at = ? where id = ?").run(nowIso(), row.id);
  return row.user_id;
}
