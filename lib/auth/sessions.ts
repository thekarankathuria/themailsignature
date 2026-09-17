import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { hashToken, newToken } from "./tokens";
import { findUserById, type User } from "./users";

/**
 * Server-side sessions. The browser holds a random token; the database holds
 * only its hash. Sessions slide: any use more than a day after the last one
 * pushes the expiry out again.
 */
export const SESSION_COOKIE = "tms_session";
export const SESSION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type Session = { id: string; userId: string; expiresAt: string };

type Row = { id: string; user_id: string; expires_at: string; last_seen_at: string };

export function createSession(userId: string, userAgent: string | null): { token: string; expiresAt: Date } {
  const token = newToken();
  const now = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS);
  db()
    .prepare(
      "insert into sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at, user_agent) values (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(newId(), userId, hashToken(token), expiresAt.toISOString(), now, now, userAgent?.slice(0, 300) ?? null);
  return { token, expiresAt };
}

export function readSession(token: string | undefined): { session: Session; user: User } | null {
  if (!token || token.length > 100) return null;
  const row = db()
    .prepare("select id, user_id, expires_at, last_seen_at from sessions where token_hash = ?")
    .get(hashToken(token)) as Row | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db().prepare("delete from sessions where id = ?").run(row.id);
    return null;
  }
  const user = findUserById(row.user_id);
  if (!user) return null;

  let expiresAt = row.expires_at;
  if (Date.now() - new Date(row.last_seen_at).getTime() > DAY_MS) {
    expiresAt = new Date(Date.now() + SESSION_DAYS * DAY_MS).toISOString();
    db().prepare("update sessions set last_seen_at = ?, expires_at = ? where id = ?").run(nowIso(), expiresAt, row.id);
  }
  return { session: { id: row.id, userId: row.user_id, expiresAt }, user };
}

export function revokeSession(token: string | undefined): void {
  if (!token) return;
  db().prepare("delete from sessions where token_hash = ?").run(hashToken(token));
}

/** Signs a user out everywhere, optionally keeping the current session. */
export function revokeAllSessions(userId: string, exceptSessionId?: string): void {
  if (exceptSessionId) {
    db().prepare("delete from sessions where user_id = ? and id != ?").run(userId, exceptSessionId);
  } else {
    db().prepare("delete from sessions where user_id = ?").run(userId);
  }
}
