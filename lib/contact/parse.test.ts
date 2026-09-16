import { describe, expect, it } from "vitest";
import { parseContact } from "./parse";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "",
  topic: "General question",
  message: "Hello there",
  website: "",
};

describe("parseContact", () => {
  it("accepts a valid payload and trims it", () => {
    const result = parseContact({ ...valid, firstName: "  Ada " });
    expect(result).toEqual({
      kind: "ok",
      payload: {
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        company: "",
        topic: "General question",
        message: "Hello there",
      },
    });
  });

  it.each([
    ["firstName", { firstName: "" }],
    ["lastName", { lastName: " " }],
    ["email", { email: "not-an-email" }],
    ["topic", { topic: "Free money" }],
    ["message", { message: "" }],
    ["message", { message: "x".repeat(5001) }],
    ["company", { company: "x".repeat(201) }],
  ])("rejects a bad %s", (field, patch) => {
    const result = parseContact({ ...valid, ...patch });
    expect(result).toMatchObject({ kind: "error", field });
  });

  it("rejects a non-object body", () => {
    expect(parseContact(null)).toMatchObject({ kind: "error", field: "body" });
    expect(parseContact([valid])).toMatchObject({ kind: "error", field: "body" });
  });

  it("flags a filled honeypot as spam before validating anything else", () => {
    expect(parseContact({ website: "http://spam.example" })).toEqual({ kind: "spam" });
  });

  it("does not require a phone number or marketing opt-in", () => {
    expect(parseContact(valid).kind).toBe("ok");
  });
});
