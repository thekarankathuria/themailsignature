import { randomBytes } from "node:crypto";

/** Opaque 128-bit identifier, 32 hex characters. */
export function newId(): string {
  return randomBytes(16).toString("hex");
}

export function nowIso(): string {
  return new Date().toISOString();
}
