// @vitest-environment node
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listOutbox, readOutbox, sendMail } from "./index";
import * as templates from "./templates";

let dir = "";

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "tms-outbox-"));
  vi.stubEnv("OUTBOX_DIR", dir);
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themailsignature.test");
});
afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(dir, { recursive: true, force: true });
});

describe("outbox transport", () => {
  it("stores messages and lists them newest first", async () => {
    const first = await sendMail({ to: "a@example.com", subject: "First", html: "<p>1</p>", text: "1" });
    await new Promise((r) => setTimeout(r, 5));
    await sendMail({ to: "b@example.com", subject: "Second", html: "<p>2</p>", text: "2" });
    expect(first).toMatchObject({ ok: true, transport: "outbox" });
    const list = listOutbox();
    expect(list.map((m) => m.subject)).toEqual(["Second", "First"]);
    expect(readOutbox(list[1].id)).toMatchObject({ to: "a@example.com", html: "<p>1</p>", text: "1" });
  });

  it("refuses path tricks when reading", () => {
    expect(readOutbox("../../package")).toBeNull();
  });
});

describe("templates", () => {
  const all = [
    templates.verifyEmail("https://themailsignature.test/auth/verify?token=abc"),
    templates.welcome(),
    templates.resetPassword("https://themailsignature.test/reset-password?token=abc"),
    templates.passwordChanged(),
    templates.accountDeleted(),
    templates.subscriptionStarted({ plan: "Pro", interval: "month", amount: "$5", periodEnd: "October 17, 2026" }),
    templates.subscriptionCanceled({ plan: "Pro", periodEnd: "October 17, 2026" }),
  ];

  it("have a subject, table-based html and plain text", () => {
    for (const mail of all) {
      expect(mail.subject.length).toBeGreaterThan(5);
      expect(mail.html).toContain('role="presentation"');
      expect(mail.html).not.toMatch(/<style|class=/);
      expect(mail.text.length).toBeGreaterThan(20);
      expect(mail.text).not.toMatch(/<[a-z]/i);
      expect(mail.html).not.toMatch(/[–—]/);
    }
  });

  it("put action links in both parts", () => {
    const mail = templates.resetPassword("https://themailsignature.test/reset-password?token=abc");
    expect(mail.html).toContain("https://themailsignature.test/reset-password?token=abc");
    expect(mail.text).toContain("https://themailsignature.test/reset-password?token=abc");
  });

  it("escape interpolated values", () => {
    const mail = templates.subscriptionStarted({ plan: "<b>Pro</b>", interval: "month", amount: "$5", periodEnd: "soon" });
    expect(mail.html).not.toContain("<b>Pro</b>");
    expect(mail.html).toContain("&lt;b&gt;Pro&lt;/b&gt;");
  });
});
