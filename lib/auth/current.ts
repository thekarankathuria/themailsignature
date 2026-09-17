import { cookies, headers } from "next/headers";
import { SESSION_COOKIE, createSession, readSession, revokeSession, type Session } from "./sessions";
import type { User } from "./users";

/**
 * The signed-in user for the current request. Reading works anywhere on the
 * server; starting or ending a session only works where Next allows cookies
 * to be written (server actions and route handlers).
 */
export async function currentSession(): Promise<{ session: Session; user: User } | null> {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function currentUser(): Promise<User | null> {
  return (await currentSession())?.user ?? null;
}

export async function startSession(userId: string): Promise<void> {
  const requestHeaders = await headers();
  const { token, expiresAt } = createSession(userId, requestHeaders.get("user-agent"));
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  revokeSession(store.get(SESSION_COOKIE)?.value);
  store.delete(SESSION_COOKIE);
}
