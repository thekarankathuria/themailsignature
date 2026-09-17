import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { hashPassword } from "./password";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  emailVerifiedAt: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  email: string;
  password_hash: string;
  email_verified_at: string | null;
  created_at: string;
};

const toUser = (row: Row): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  emailVerifiedAt: row.email_verified_at,
  createdAt: row.created_at,
});

export class EmailTakenError extends Error {
  constructor() {
    super("An account already exists for that email.");
  }
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createUser(email: string, password: string): Promise<User> {
  const address = normaliseEmail(email);
  if (findUserByEmail(address)) throw new EmailTakenError();
  const hash = await hashPassword(password);
  const now = nowIso();
  const id = newId();
  try {
    db()
      .prepare("insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)")
      .run(id, address, hash, now, now);
  } catch {
    // Two signups for the same address raced past the check above.
    throw new EmailTakenError();
  }
  return findUserById(id)!;
}

export function findUserByEmail(email: string): User | null {
  const row = db().prepare("select * from users where email = ?").get(normaliseEmail(email)) as Row | undefined;
  return row ? toUser(row) : null;
}

export function findUserById(id: string): User | null {
  const row = db().prepare("select * from users where id = ?").get(id) as Row | undefined;
  return row ? toUser(row) : null;
}

export async function setPassword(userId: string, password: string): Promise<void> {
  const hash = await hashPassword(password);
  db().prepare("update users set password_hash = ?, updated_at = ? where id = ?").run(hash, nowIso(), userId);
}

export function markVerified(userId: string): void {
  db()
    .prepare("update users set email_verified_at = coalesce(email_verified_at, ?), updated_at = ? where id = ?")
    .run(nowIso(), nowIso(), userId);
}

/** Deletes the user; sessions, tokens, signatures and subscriptions cascade. */
export function deleteUser(userId: string): void {
  db().prepare("delete from users where id = ?").run(userId);
}
