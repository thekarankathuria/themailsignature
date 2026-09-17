import { rmSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/env";
import { sendMail } from "@/lib/mail";
import * as templates from "@/lib/mail/templates";
import { rateLimit } from "@/lib/rate-limit";
import { safeUploadName, uploadDir } from "@/lib/storage/upload-dir";
import { passwordProblem, verifyPassword } from "./password";
import { revokeAllSessions } from "./sessions";
import { consumeToken, issueToken, peekToken } from "./tokens";
import {
  EmailTakenError,
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  markVerified,
  normaliseEmail,
  setPassword,
  type User,
} from "./users";

/**
 * Account operations with no knowledge of cookies or redirects, so they can be
 * tested directly. Server actions wrap them.
 */
export type Failure = { ok: false; field: string; error: string };
export type Result<T = object> = ({ ok: true } & T) | Failure;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MINUTE = 60 * 1000;
const fail = (field: string, error: string): Failure => ({ ok: false, field, error });
const tooMany = (seconds: number) =>
  fail("form", `Too many attempts. Try again in ${Math.ceil(seconds / 60)} minute${seconds > 60 ? "s" : ""}.`);

// A real hash of a throwaway password, verified against when an email is
// unknown so both paths take about the same time.
const DECOY_HASH =
  "scrypt$32768$8$1$ZGVjb3lzYWx0ZGVjb3lzYQ$0Q3B9m6oE7x7r1vH2f7lSbmv2lWm0cNc8X3uB8tq3n8";

async function sendVerification(user: User): Promise<void> {
  const token = issueToken(user.id, "verify");
  const mail = templates.verifyEmail(`${siteUrl()}/auth/verify?token=${token}`);
  await sendMail({ to: user.email, ...mail });
}

export async function register(input: { email: string; password: string; ip: string }): Promise<Result<{ user: User }>> {
  const email = normaliseEmail(input.email);
  if (!EMAIL.test(email) || email.length > 254) return fail("email", "Enter a valid email address.");
  const problem = passwordProblem(input.password, email);
  if (problem) return fail("password", problem);

  const limit = rateLimit(`signup:${input.ip}`, { limit: 5, windowMs: 60 * MINUTE });
  if (!limit.ok) return tooMany(limit.retryAfterSeconds);

  try {
    const user = await createUser(email, input.password);
    await sendVerification(user);
    return { ok: true, user };
  } catch (error) {
    if (error instanceof EmailTakenError) {
      return fail("email", "An account already uses this email. Log in instead, or reset your password.");
    }
    throw error;
  }
}

export async function authenticate(input: { email: string; password: string; ip: string }): Promise<Result<{ user: User }>> {
  const email = normaliseEmail(input.email);
  const limit = rateLimit(`login:${input.ip}:${email}`, { limit: 10, windowMs: 10 * MINUTE });
  if (!limit.ok) return tooMany(limit.retryAfterSeconds);

  const user = findUserByEmail(email);
  const valid = await verifyPassword(input.password, user?.passwordHash ?? DECOY_HASH);
  if (!user || !valid) return fail("form", "That email and password don't match.");
  return { ok: true, user };
}

export async function confirmEmail(token: string): Promise<User | null> {
  const userId = consumeToken(token, "verify");
  if (!userId) return null;
  const user = findUserById(userId);
  if (!user) return null;
  const firstTime = !user.emailVerifiedAt;
  markVerified(userId);
  if (firstTime) await sendMail({ to: user.email, ...templates.welcome() });
  return findUserById(userId);
}

export async function resendVerification(userId: string): Promise<Result> {
  const user = findUserById(userId);
  if (!user) return fail("form", "Your session has ended. Log in again.");
  if (user.emailVerifiedAt) return { ok: true };
  const limit = rateLimit(`verify:${userId}`, { limit: 3, windowMs: 60 * MINUTE });
  if (!limit.ok) return tooMany(limit.retryAfterSeconds);
  await sendVerification(user);
  return { ok: true };
}

/** Always succeeds from the caller's point of view. */
export async function requestReset(input: { email: string; ip: string }): Promise<Result> {
  const email = normaliseEmail(input.email);
  if (!EMAIL.test(email)) return fail("email", "Enter a valid email address.");
  const limit = rateLimit(`reset:${input.ip}`, { limit: 5, windowMs: 60 * MINUTE });
  if (!limit.ok) return tooMany(limit.retryAfterSeconds);
  const user = findUserByEmail(email);
  if (user) {
    const token = issueToken(user.id, "reset");
    await sendMail({ to: user.email, ...templates.resetPassword(`${siteUrl()}/reset-password?token=${token}`) });
  }
  return { ok: true };
}

export async function completeReset(input: { token: string; password: string }): Promise<Result<{ user: User }>> {
  const expired = fail("form", "That reset link has expired or was already used. Request a new one.");
  const pending = peekToken(input.token, "reset");
  const candidate = pending ? findUserById(pending) : null;
  if (!candidate) return expired;
  // Check the password before spending the link, so a weak choice can be retried.
  const problem = passwordProblem(input.password, candidate.email);
  if (problem) return fail("password", problem);
  const userId = consumeToken(input.token, "reset");
  const user = userId === candidate.id ? candidate : null;
  if (!user) return expired;
  await setPassword(user.id, input.password);
  markVerified(user.id);
  revokeAllSessions(user.id);
  await sendMail({ to: user.email, ...templates.passwordChanged() });
  return { ok: true, user };
}

export async function changePassword(input: {
  userId: string;
  current: string;
  next: string;
  keepSessionId: string;
}): Promise<Result> {
  const user = findUserById(input.userId);
  if (!user) return fail("form", "Your session has ended. Log in again.");
  if (!(await verifyPassword(input.current, user.passwordHash))) return fail("current", "Your current password is incorrect.");
  const problem = passwordProblem(input.next, user.email);
  if (problem) return fail("next", problem);
  await setPassword(user.id, input.next);
  revokeAllSessions(user.id, input.keepSessionId);
  await sendMail({ to: user.email, ...templates.passwordChanged() });
  return { ok: true };
}

export async function removeAccount(input: { userId: string; password: string }): Promise<Result> {
  const user = findUserById(input.userId);
  if (!user) return fail("form", "Your session has ended. Log in again.");
  if (!(await verifyPassword(input.password, user.passwordHash))) return fail("password", "That password is incorrect.");

  // Uploads are content-addressed, so another account may use the same file.
  const orphans = db()
    .prepare(
      "select name from uploads where user_id = ? and name not in (select name from uploads where user_id != ?)",
    )
    .all(user.id, user.id) as Array<{ name: string }>;

  deleteUser(user.id);
  for (const { name } of orphans) {
    const safe = safeUploadName(name);
    if (safe) rmSync(join(uploadDir(), safe), { force: true });
  }
  await sendMail({ to: user.email, ...templates.accountDeleted() });
  return { ok: true };
}
