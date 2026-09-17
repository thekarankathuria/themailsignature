import { randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Password hashing with scrypt. The stored format carries its own parameters
 * (`scrypt$N$r$p$salt$hash`), so the cost can be raised later without
 * invalidating existing hashes.
 */
const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
const MAX_MEMORY = 64 * 1024 * 1024;

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scryptCallback(password, salt, keylen, options, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, { N, r: R, p: P, maxmem: MAX_MEMORY });
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltText, keyText] = parts;
  const expected = Buffer.from(keyText, "base64url");
  if (!expected.length) return false;
  try {
    const actual = await scrypt(password.normalize("NFKC"), Buffer.from(saltText, "base64url"), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: MAX_MEMORY,
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** A short list of the passwords attackers try first. */
const COMMON = new Set([
  "password", "password1", "password12", "password123", "password1234", "1234567890",
  "12345678910", "qwertyuiop", "qwerty1234", "qwerty12345", "iloveyou12", "letmein123",
  "welcome123", "admin12345", "passw0rd12", "abc1234567", "1q2w3e4r5t", "football12",
  "baseball12", "sunshine12", "princess12", "whatever12", "trustno1234", "changeme123",
]);

/** Why a password is unacceptable, or null when it is fine. */
export function passwordProblem(password: string, email: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "Use no more than 200 characters.";
  const lower = password.toLowerCase();
  if (COMMON.has(lower)) return "That password is too common. Choose something less predictable.";
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (local.length >= 4 && lower.includes(local)) return "Don't use your email address in your password.";
  return null;
}
