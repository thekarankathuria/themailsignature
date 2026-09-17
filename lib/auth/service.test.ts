// @vitest-environment node
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDb, db } from "@/lib/db";
import { listOutbox } from "@/lib/mail";
import { __resetRateLimitStore } from "@/lib/rate-limit";
import {
  authenticate,
  changePassword,
  completeReset,
  confirmEmail,
  register,
  removeAccount,
  requestReset,
} from "./service";
import { createSession, readSession } from "./sessions";
import { findUserByEmail } from "./users";

let outbox = "";
let uploads = "";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  outbox = mkdtempSync(join(tmpdir(), "tms-outbox-"));
  uploads = mkdtempSync(join(tmpdir(), "tms-uploads-"));
  vi.stubEnv("OUTBOX_DIR", outbox);
  vi.stubEnv("UPLOAD_DIR", uploads);
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themailsignature.test");
  __resetRateLimitStore();
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
  rmSync(outbox, { recursive: true, force: true });
  rmSync(uploads, { recursive: true, force: true });
});

const PASSWORD = "a sensible passphrase";
const tokenFrom = (subject: string) => {
  const mail = listOutbox().find((m) => m.subject === subject);
  return mail?.text.match(/token=([A-Za-z0-9_-]+)/)?.[1] ?? "";
};

describe("register", () => {
  it("creates the account and sends a verification email", async () => {
    const result = await register({ email: "Jane@Example.com", password: PASSWORD, ip: "1.1.1.1" });
    expect(result).toMatchObject({ ok: true });
    expect(findUserByEmail("jane@example.com")?.emailVerifiedAt).toBeNull();
    expect(tokenFrom("Confirm your email address")).not.toBe("");
  });

  it("validates input", async () => {
    expect(await register({ email: "nope", password: PASSWORD, ip: "1" })).toMatchObject({ ok: false, field: "email" });
    expect(await register({ email: "a@example.com", password: "short", ip: "1" })).toMatchObject({ ok: false, field: "password" });
  });

  it("does not reveal an existing account", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    const again = await register({ email: "jane@example.com", password: PASSWORD, ip: "2" });
    expect(again).toMatchObject({ ok: false, field: "email" });
    if (!again.ok) expect(again.error).toMatch(/log in/i);
  });

  it("rate limits signups per address", async () => {
    for (let i = 0; i < 5; i++) await register({ email: `u${i}@example.com`, password: PASSWORD, ip: "9.9.9.9" });
    expect(await register({ email: "u6@example.com", password: PASSWORD, ip: "9.9.9.9" })).toMatchObject({ ok: false, field: "form" });
  });
});

describe("confirmEmail", () => {
  it("verifies once and sends the welcome email", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    const token = tokenFrom("Confirm your email address");
    expect(await confirmEmail(token)).toBeTruthy();
    expect(findUserByEmail("jane@example.com")?.emailVerifiedAt).toBeTruthy();
    expect(listOutbox().some((m) => m.subject === "Welcome to TheMailSignature")).toBe(true);
    expect(await confirmEmail(token)).toBeNull();
  });
});

describe("authenticate", () => {
  it("accepts the right password and rejects the wrong one generically", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    expect(await authenticate({ email: "JANE@example.com", password: PASSWORD, ip: "1" })).toMatchObject({ ok: true });
    const wrong = await authenticate({ email: "jane@example.com", password: "wrong password", ip: "1" });
    const missing = await authenticate({ email: "ghost@example.com", password: PASSWORD, ip: "1" });
    expect(wrong).toEqual(missing);
  });

  it("locks out after repeated failures", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    for (let i = 0; i < 10; i++) await authenticate({ email: "jane@example.com", password: "wrong password", ip: "7" });
    const blocked = await authenticate({ email: "jane@example.com", password: PASSWORD, ip: "7" });
    expect(blocked).toMatchObject({ ok: false });
    if (!blocked.ok) expect(blocked.error).toMatch(/too many/i);
  });
});

describe("password reset", () => {
  it("always answers the same and only mails real accounts", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    await requestReset({ email: "ghost@example.com", ip: "1" });
    expect(listOutbox().filter((m) => m.subject === "Reset your password")).toHaveLength(0);
    await requestReset({ email: "jane@example.com", ip: "1" });
    expect(tokenFrom("Reset your password")).not.toBe("");
  });

  it("sets the new password and signs out everywhere", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    const user = findUserByEmail("jane@example.com")!;
    const { token: sessionToken } = createSession(user.id, null);
    await requestReset({ email: "jane@example.com", ip: "1" });
    const result = await completeReset({ token: tokenFrom("Reset your password"), password: "a brand new passphrase" });
    expect(result).toMatchObject({ ok: true });
    expect(readSession(sessionToken)).toBeNull();
    expect(await authenticate({ email: "jane@example.com", password: "a brand new passphrase", ip: "1" })).toMatchObject({ ok: true });
    expect(listOutbox().some((m) => m.subject === "Your password was changed")).toBe(true);
  });

  it("rejects bad tokens", async () => {
    expect(await completeReset({ token: "nope", password: "a brand new passphrase" })).toMatchObject({ ok: false });
  });
});

describe("changePassword", () => {
  it("requires the current password and keeps the current session", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    const user = findUserByEmail("jane@example.com")!;
    const keep = createSession(user.id, null);
    const other = createSession(user.id, null);
    const keepId = readSession(keep.token)!.session.id;
    expect(await changePassword({ userId: user.id, current: "wrong", next: "another passphrase", keepSessionId: keepId })).toMatchObject({ ok: false, field: "current" });
    expect(await changePassword({ userId: user.id, current: PASSWORD, next: "another passphrase", keepSessionId: keepId })).toMatchObject({ ok: true });
    expect(readSession(keep.token)).not.toBeNull();
    expect(readSession(other.token)).toBeNull();
  });
});

describe("removeAccount", () => {
  it("needs the password, deletes data and unshared uploads", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    await register({ email: "sam@example.com", password: PASSWORD, ip: "2" });
    const jane = findUserByEmail("jane@example.com")!;
    const sam = findUserByEmail("sam@example.com")!;
    const mine = "a".repeat(32) + ".png";
    const shared = "b".repeat(32) + ".png";
    for (const name of [mine, shared]) writeFileSync(join(uploads, name), "x");
    const now = new Date().toISOString();
    const insert = db().prepare("insert into uploads (user_id, name, created_at) values (?, ?, ?)");
    insert.run(jane.id, mine, now);
    insert.run(jane.id, shared, now);
    insert.run(sam.id, shared, now);

    expect(await removeAccount({ userId: jane.id, password: "wrong" })).toMatchObject({ ok: false });
    expect(await removeAccount({ userId: jane.id, password: PASSWORD })).toMatchObject({ ok: true });
    expect(findUserByEmail("jane@example.com")).toBeNull();
    expect(existsSync(join(uploads, mine))).toBe(false);
    expect(existsSync(join(uploads, shared))).toBe(true);
    expect(listOutbox().some((m) => m.subject === "Your account has been deleted")).toBe(true);
  });
});

describe("password reset retries", () => {
  it("keeps the link usable after a weak password", async () => {
    await register({ email: "jane@example.com", password: PASSWORD, ip: "1" });
    await requestReset({ email: "jane@example.com", ip: "1" });
    const token = tokenFrom("Reset your password");
    expect(await completeReset({ token, password: "short" })).toMatchObject({ ok: false, field: "password" });
    expect(await completeReset({ token, password: "a brand new passphrase" })).toMatchObject({ ok: true });
  });
});
