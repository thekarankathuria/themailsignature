// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeDb } from "@/lib/db";
import { hashPassword, passwordProblem, verifyPassword } from "./password";
import { consumeToken, issueToken } from "./tokens";
import { createSession, readSession, revokeAllSessions, revokeSession, SESSION_DAYS } from "./sessions";
import { createUser, deleteUser, findUserByEmail, markVerified, normaliseEmail, setPassword } from "./users";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => {
  closeDb();
  vi.useRealTimers();
});

describe("passwords", () => {
  it("hashes and verifies", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(hash).toMatch(/^scrypt\$/);
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("wrong horse battery", hash)).toBe(false);
    expect(await verifyPassword("anything", "garbage")).toBe(false);
  });

  it("salts every hash", async () => {
    expect(await hashPassword("same password here")).not.toBe(await hashPassword("same password here"));
  });

  it("explains weak passwords", () => {
    expect(passwordProblem("short", "a@b.co")).toMatch(/at least 10/);
    expect(passwordProblem("password123", "a@b.co")).toMatch(/common/);
    expect(passwordProblem("jane.doe.smith", "jane.doe.smith@example.com")).toMatch(/email/);
    expect(passwordProblem("x".repeat(201), "a@b.co")).toMatch(/200/);
    expect(passwordProblem("a sensible passphrase", "a@b.co")).toBeNull();
  });
});

describe("users", () => {
  it("normalises emails and finds users case-insensitively", async () => {
    expect(normaliseEmail("  Jane@Example.COM ")).toBe("jane@example.com");
    const user = await createUser("Jane@Example.com", "a sensible passphrase");
    expect(user.email).toBe("jane@example.com");
    expect(findUserByEmail("JANE@example.com")?.id).toBe(user.id);
  });

  it("refuses duplicate emails", async () => {
    await createUser("jane@example.com", "a sensible passphrase");
    await expect(createUser("JANE@example.com", "another passphrase")).rejects.toThrow(/already/);
  });

  it("marks verification and changes passwords", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    markVerified(user.id);
    expect(findUserByEmail("jane@example.com")?.emailVerifiedAt).toBeTruthy();
    await setPassword(user.id, "a different passphrase");
    const hash = findUserByEmail("jane@example.com")!.passwordHash;
    expect(await verifyPassword("a different passphrase", hash)).toBe(true);
  });
});

describe("tokens", () => {
  it("issues single-use tokens stored only as hashes", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const token = issueToken(user.id, "verify");
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(consumeToken(token, "reset")).toBeNull();
    expect(consumeToken(token, "verify")).toBe(user.id);
    expect(consumeToken(token, "verify")).toBeNull();
  });

  it("expires tokens", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const token = issueToken(user.id, "reset");
    vi.setSystemTime(Date.now() + 61 * 60 * 1000);
    expect(consumeToken(token, "reset")).toBeNull();
  });

  it("invalidates older tokens of the same kind", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const first = issueToken(user.id, "reset");
    const second = issueToken(user.id, "reset");
    expect(consumeToken(first, "reset")).toBeNull();
    expect(consumeToken(second, "reset")).toBe(user.id);
  });
});

describe("sessions", () => {
  it("creates, reads and revokes sessions", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const { token } = createSession(user.id, "vitest");
    expect(readSession(token)?.user.id).toBe(user.id);
    expect(readSession("not-a-token")).toBeNull();
    revokeSession(token);
    expect(readSession(token)).toBeNull();
  });

  it("expires sessions and revokes all of a user's sessions", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const a = createSession(user.id, null);
    const b = createSession(user.id, null);
    revokeAllSessions(user.id, readSession(a.token)!.session.id);
    expect(readSession(a.token)).not.toBeNull();
    expect(readSession(b.token)).toBeNull();
    vi.setSystemTime(Date.now() + (SESSION_DAYS + 1) * 24 * 60 * 60 * 1000);
    expect(readSession(a.token)).toBeNull();
  });

  it("disappears with the user", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    const { token } = createSession(user.id, null);
    deleteUser(user.id);
    expect(readSession(token)).toBeNull();
  });
});
