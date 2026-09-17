// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSession } from "@/lib/auth/sessions";
import { createUser } from "@/lib/auth/users";
import { grantPlan } from "@/lib/billing/local";
import { closeDb } from "@/lib/db";
import { __resetRateLimitStore } from "@/lib/rate-limit";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { normaliseData, normaliseStyle } from "./normalise";
import { SignatureLimitError, createSignature, getSignature, listSignatures } from "./store";
import * as collection from "@/app/api/signatures/route";
import * as single from "@/app/api/signatures/[id]/route";
import * as exporter from "@/app/api/signatures/[id]/export/route";
import * as duplicate from "@/app/api/signatures/[id]/duplicate/route";

const SITE = "http://localhost:3000";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
  __resetRateLimitStore();
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
});

async function account(plan: "free" | "pro" = "free") {
  const user = await createUser(`${Math.random().toString(36).slice(2)}@example.com`, "a sensible passphrase");
  if (plan !== "free") grantPlan(user.id, plan, "month");
  const { token } = createSession(user.id, null);
  return { user, cookie: `tms_session=${token}` };
}

function req(path: string, init: { method?: string; cookie?: string; body?: unknown; origin?: string | null } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (init.cookie) headers.cookie = init.cookie;
  if (init.origin !== null) headers.origin = init.origin ?? SITE;
  return new Request(`${SITE}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("normalise", () => {
  it("keeps known fields, fills defaults and drops junk", () => {
    const data = normaliseData({ firstName: "  Kim ", evil: "<script>", logoWidth: "999", social: { linkedin: "x", bogus: "y" }, greenFooter: "yes" });
    expect(data.firstName).toBe("Kim");
    expect(data).not.toHaveProperty("evil");
    expect(data.logoWidth).toBe(DEFAULT_DATA.logoWidth);
    expect(data.social).toEqual({ linkedin: "x" });
    expect(data.greenFooter).toBe(false);
    expect(normaliseData("nope")).toEqual({ ...DEFAULT_DATA, social: {} });
  });

  it("rejects unknown enum values and clamps numbers", () => {
    const style = normaliseStyle({ templateId: "nope", iconAnimation: "explode", fontSize: 400, accent: "red; x" });
    expect(style.templateId).toBe(DEFAULT_STYLE.templateId);
    expect(style.iconAnimation).toBe("none");
    expect(style.fontSize).toBe(18);
    expect(style.accent).toBe(DEFAULT_STYLE.accent);
  });

  it("caps long strings", () => {
    expect(normaliseData({ disclaimer: "x".repeat(5000) }).disclaimer.length).toBeLessThanOrEqual(2000);
  });
});

describe("store", () => {
  it("limits free accounts to one signature", async () => {
    const { user } = await account("free");
    createSignature(user.id, { data: DEFAULT_DATA, style: DEFAULT_STYLE });
    expect(() => createSignature(user.id, { data: DEFAULT_DATA, style: DEFAULT_STYLE })).toThrow(SignatureLimitError);
  });

  it("lets paid accounts save many and scopes reads to the owner", async () => {
    const pro = await account("pro");
    const other = await account("pro");
    const a = createSignature(pro.user.id, { data: DEFAULT_DATA, style: DEFAULT_STYLE });
    createSignature(pro.user.id, { data: DEFAULT_DATA, style: DEFAULT_STYLE });
    expect(listSignatures(pro.user.id)).toHaveLength(2);
    expect(getSignature(other.user.id, a.id)).toBeNull();
  });
});

describe("API", () => {
  it("requires a session", async () => {
    const res = await collection.POST(req("/api/signatures", { method: "POST", body: {} }));
    expect(res.status).toBe(401);
  });

  it("rejects cross-site writes", async () => {
    const { cookie } = await account();
    const res = await collection.POST(req("/api/signatures", { method: "POST", cookie, body: {}, origin: "https://evil.example" }));
    expect(res.status).toBe(403);
    const missing = await collection.POST(req("/api/signatures", { method: "POST", cookie, body: {}, origin: null }));
    expect(missing.status).toBe(403);
  });

  it("creates, reads, updates and deletes", async () => {
    const { cookie } = await account("pro");
    const created = await collection.POST(
      req("/api/signatures", { method: "POST", cookie, body: { name: "Work", data: { firstName: "Kim" }, style: { templateId: "luxe" } } }),
    );
    expect(created.status).toBe(201);
    const { signature } = await created.json();
    expect(signature).toMatchObject({ name: "Work", data: { firstName: "Kim" }, style: { templateId: "luxe" } });

    const read = await single.GET(req(`/api/signatures/${signature.id}`, { cookie }), params(signature.id));
    expect(read.status).toBe(200);

    const patched = await single.PATCH(
      req(`/api/signatures/${signature.id}`, { method: "PATCH", cookie, body: { name: "Renamed", data: { firstName: "Lee" } } }),
      params(signature.id),
    );
    expect((await patched.json()).signature).toMatchObject({ name: "Renamed", data: { firstName: "Lee" } });

    const copy = await duplicate.POST(req(`/api/signatures/${signature.id}/duplicate`, { method: "POST", cookie }), params(signature.id));
    expect(copy.status).toBe(201);
    expect((await copy.json()).signature.name).toBe("Renamed (copy)");

    const removed = await single.DELETE(req(`/api/signatures/${signature.id}`, { method: "DELETE", cookie }), params(signature.id));
    expect(removed.status).toBe(204);
    const gone = await single.GET(req(`/api/signatures/${signature.id}`, { cookie }), params(signature.id));
    expect(gone.status).toBe(404);
  });

  it("hides other people's signatures", async () => {
    const owner = await account("pro");
    const stranger = await account("pro");
    const created = await collection.POST(req("/api/signatures", { method: "POST", cookie: owner.cookie, body: {} }));
    const { signature } = await created.json();
    const res = await single.GET(req(`/api/signatures/${signature.id}`, { cookie: stranger.cookie }), params(signature.id));
    expect(res.status).toBe(404);
  });

  it("returns 402 with the limit code when a free account saves a second signature", async () => {
    const { cookie } = await account("free");
    await collection.POST(req("/api/signatures", { method: "POST", cookie, body: {} }));
    const res = await collection.POST(req("/api/signatures", { method: "POST", cookie, body: {} }));
    expect(res.status).toBe(402);
    expect(await res.json()).toMatchObject({ code: "limit" });
  });

  it("exports free signatures with the footer and blocks Pro features on Free", async () => {
    const { cookie } = await account("free");
    const created = await collection.POST(
      req("/api/signatures", { method: "POST", cookie, body: { data: { social: { linkedin: "linkedin.com/in/kim" } }, style: { templateId: "meridian" } } }),
    );
    const { signature } = await created.json();
    const ok = await exporter.GET(req(`/api/signatures/${signature.id}/export`, { cookie }), params(signature.id));
    expect(ok.status).toBe(200);
    const body = await ok.json();
    expect(body.html).toContain("Made with TheMailSignature");
    expect(body.html).toContain(`${SITE}/i/social/`);
    expect(body.document).toContain("<!doctype html>");
    expect(body.text.length).toBeGreaterThan(10);

    await single.PATCH(
      req(`/api/signatures/${signature.id}`, { method: "PATCH", cookie, body: { style: { templateId: "luxe" } } }),
      params(signature.id),
    );
    const blocked = await exporter.GET(req(`/api/signatures/${signature.id}/export`, { cookie }), params(signature.id));
    expect(blocked.status).toBe(402);
    expect(await blocked.json()).toMatchObject({ code: "upgrade", features: [{ id: "layout" }] });
  });

  it("exports Pro signatures without the footer", async () => {
    const { cookie } = await account("pro");
    const created = await collection.POST(req("/api/signatures", { method: "POST", cookie, body: { style: { templateId: "luxe" } } }));
    const { signature } = await created.json();
    const res = await exporter.GET(req(`/api/signatures/${signature.id}/export`, { cookie }), params(signature.id));
    expect(res.status).toBe(200);
    expect((await res.json()).html).not.toContain("Made with TheMailSignature");
  });
});
