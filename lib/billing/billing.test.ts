// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb } from "@/lib/db";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { FREE_TEMPLATE_IDS, TEMPLATES } from "@/lib/signature/templates";
import { canExport, freeVersion, nearestFreeLayout, proFeatures, withFreeFooter } from "./entitlements";
import { cancelAtPeriodEnd, grantPlan, resumePlan } from "./local";
import { planFor, subscriptionFor } from "./plans";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => {
  closeDb();
  vi.useRealTimers();
});

const plain = { ...DEFAULT_DATA, bannerUrl: "", ctaText: "", ctaUrl: "", meetingUrl: "", logoUrl: "", photoUrl: "" };

describe("proFeatures", () => {
  it("finds nothing in a plain free signature", () => {
    expect(proFeatures(plain, DEFAULT_STYLE)).toEqual([]);
  });

  it("flags each Pro option", () => {
    const ids = (data: typeof plain, style: typeof DEFAULT_STYLE) => proFeatures(data, style).map((f) => f.id);
    expect(ids(plain, { ...DEFAULT_STYLE, templateId: "luxe" })).toEqual(["layout"]);
    expect(ids(plain, { ...DEFAULT_STYLE, iconAnimation: "pulse" })).toEqual(["animation"]);
    expect(ids(plain, { ...DEFAULT_STYLE, statusDot: "blink" })).toEqual(["status"]);
    expect(ids({ ...plain, bannerUrl: "https://x.example/b.png" }, DEFAULT_STYLE)).toEqual(["banner"]);
    expect(ids({ ...plain, ctaText: "Book", ctaUrl: "x.example" }, DEFAULT_STYLE)).toEqual(["buttons"]);
    expect(ids({ ...plain, meetingUrl: "cal.example/me" }, DEFAULT_STYLE)).toEqual(["buttons"]);
    expect(ids({ ...plain, logoUrl: "https://themailsignature.com/u/" + "a".repeat(32) + ".png" }, DEFAULT_STYLE)).toEqual(["hosted"]);
    expect(ids({ ...plain, photoUrl: "https://elsewhere.example/me.gif" }, DEFAULT_STYLE)).toEqual(["gif"]);
  });

  it("does not count external still images", () => {
    expect(proFeatures({ ...plain, logoUrl: "https://elsewhere.example/logo.png" }, DEFAULT_STYLE)).toEqual([]);
  });
});

describe("freeVersion", () => {
  it("removes every Pro feature and keeps the details", () => {
    const data = { ...plain, firstName: "Kim", bannerUrl: "https://x.example/b.png", ctaText: "Go", ctaUrl: "x.example" };
    const style = { ...DEFAULT_STYLE, templateId: "executive", iconAnimation: "wiggle" as const, statusDot: "static" as const };
    const free = freeVersion(data, style);
    expect(proFeatures(free.data, free.style)).toEqual([]);
    expect(free.data.firstName).toBe("Kim");
    expect(FREE_TEMPLATE_IDS).toContain(free.style.templateId);
  });

  it("maps every Pro layout to a free one", () => {
    for (const t of TEMPLATES) expect(FREE_TEMPLATE_IDS).toContain(nearestFreeLayout(t.id));
  });
});

describe("export rules", () => {
  it("lets free plans export only free signatures", () => {
    expect(canExport("free", [])).toBe(true);
    expect(canExport("free", proFeatures(plain, { ...DEFAULT_STYLE, templateId: "luxe" }))).toBe(false);
    expect(canExport("pro", proFeatures(plain, { ...DEFAULT_STYLE, templateId: "luxe" }))).toBe(true);
  });

  it("adds the footer link for free exports", () => {
    const html = withFreeFooter("<div>sig</div>", DEFAULT_STYLE, "https://themailsignature.com");
    expect(html).toContain("Made with TheMailSignature");
    expect(html).toContain('href="https://themailsignature.com/?ref=signature"');
    expect(html.startsWith("<div>sig</div>")).toBe(true);
  });
});

describe("plans", () => {
  it("defaults to free", async () => {
    const user = await createUser("jane@example.com", "a sensible passphrase");
    expect(planFor(user.id)).toBe("free");
    expect(subscriptionFor(user.id)).toBeNull();
  });

  it("grants, cancels at period end, resumes and expires", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const user = await createUser("jane@example.com", "a sensible passphrase");
    grantPlan(user.id, "pro", "month");
    expect(planFor(user.id)).toBe("pro");
    cancelAtPeriodEnd(user.id);
    expect(subscriptionFor(user.id)?.cancelAtPeriodEnd).toBe(true);
    expect(planFor(user.id)).toBe("pro");
    resumePlan(user.id);
    expect(subscriptionFor(user.id)?.cancelAtPeriodEnd).toBe(false);
    cancelAtPeriodEnd(user.id);
    vi.setSystemTime(Date.now() + 40 * 24 * 60 * 60 * 1000);
    expect(planFor(user.id)).toBe("free");
  });

  it("keeps an uncancelled plan past its period (renewal is the provider's job)", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const user = await createUser("jane@example.com", "a sensible passphrase");
    grantPlan(user.id, "business", "year", 3);
    vi.setSystemTime(Date.now() + 400 * 24 * 60 * 60 * 1000);
    expect(planFor(user.id)).toBe("business");
    expect(subscriptionFor(user.id)?.seats).toBe(3);
  });
});
