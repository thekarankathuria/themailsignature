// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb, db } from "@/lib/db";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { createSignature, updateSignature } from "@/lib/signatures/store";
import { applyLocks, cleanLocked, LOCK_GROUPS, lockedFields, type LockGroupId } from "./locks";
import { createOrg } from "./store";
import { readTemplate, withCompanyTemplate, writeTemplate } from "./template";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
});
afterEach(() => closeDb());

const company = {
  data: {
    ...DEFAULT_DATA,
    firstName: "Company",
    company: "Northbeam Studio",
    website: "northbeam.studio",
    logoUrl: "https://northbeam.example/logo.png",
    disclaimer: "This email is confidential.",
    social: { linkedin: "linkedin.com/company/northbeam" },
  },
  style: { ...DEFAULT_STYLE, accent: "#0b1f52", templateId: "luxe", font: "georgia" as const },
};

const member = {
  data: {
    ...DEFAULT_DATA,
    firstName: "Amara",
    lastName: "Okonkwo",
    jobTitle: "Head of Client Strategy",
    company: "Whatever I typed",
    logoUrl: "https://elsewhere.example/my-own-logo.png",
    disclaimer: "",
    social: { linkedin: "linkedin.com/in/amara" },
  },
  style: { ...DEFAULT_STYLE, accent: "#ff0000", templateId: "meridian", font: "courier" as const },
};

describe("lock groups", () => {
  it("covers each field once, so no two groups fight over one value", () => {
    const seen = new Set<string>();
    for (const group of LOCK_GROUPS) {
      for (const field of [...group.data, ...group.style]) {
        const key = `${group.data.includes(field as never) ? "data" : "style"}.${String(field)}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it("leaves the personal fields unlocked, because that is what members fill in", () => {
    const { data } = lockedFields(LOCK_GROUPS.map((group) => group.id));
    for (const personal of ["firstName", "lastName", "jobTitle", "email", "phone", "mobile", "photoUrl"] as const) {
      expect(data.has(personal)).toBe(false);
    }
  });

  it("keeps only known group ids, in a fixed order", () => {
    expect(cleanLocked(["social", "nonsense", "logo"])).toEqual(["logo", "social"]);
    expect(cleanLocked("logo")).toEqual([]);
    expect(cleanLocked(null)).toEqual([]);
  });
});

describe("applyLocks", () => {
  it("replaces exactly the locked group and nothing else", () => {
    const merged = applyLocks(member, company, ["logo"]);

    expect(merged.data.logoUrl).toBe(company.data.logoUrl);
    // Everything outside the group is still the member's own.
    expect(merged.data.firstName).toBe("Amara");
    expect(merged.data.company).toBe("Whatever I typed");
    expect(merged.style.accent).toBe("#ff0000");
    expect(merged.data.social).toEqual({ linkedin: "linkedin.com/in/amara" });
  });

  it("locks the groups an admin picked, together", () => {
    const merged = applyLocks(member, company, ["brand", "company", "disclaimer", "social"]);

    expect(merged.style.accent).toBe("#0b1f52");
    expect(merged.style.font).toBe("georgia");
    expect(merged.data.company).toBe("Northbeam Studio");
    expect(merged.data.website).toBe("northbeam.studio");
    expect(merged.data.disclaimer).toBe("This email is confidential.");
    expect(merged.data.social).toEqual({ linkedin: "linkedin.com/company/northbeam" });
    // The layout was not locked, so the member keeps their own.
    expect(merged.style.templateId).toBe("meridian");
    expect(merged.data.jobTitle).toBe("Head of Client Strategy");
  });

  it("changes nothing when no group is locked", () => {
    expect(applyLocks(member, company, [])).toBe(member);
  });

  it("does not modify the member's own record", () => {
    const original = structuredClone(member);
    applyLocks(member, company, LOCK_GROUPS.map((group) => group.id));
    expect(member).toEqual(original);
  });
});

describe("a member's signature through the company template", () => {
  async function team(locked: LockGroupId[]) {
    const owner = await createUser("owner@example.com", "a sensible passphrase");
    const mate = await createUser("mate@example.com", "a sensible passphrase");
    const org = createOrg({ name: "Northbeam", ownerId: owner.id });
    writeTemplate(org.id, { ...company, locked });

    const saved = createSignature(mate.id, { name: "Mine", data: member.data, style: member.style });
    db().prepare("update signatures set org_template_id = ? where id = ?").run(org.id, saved.id);
    return { org, mate, signatureId: saved.id };
  }

  it("uses the company's value for a locked group", async () => {
    const { org } = await team(["logo", "disclaimer"]);
    const merged = withCompanyTemplate({ ...member, orgTemplateId: org.id });

    expect(merged.data.logoUrl).toBe(company.data.logoUrl);
    expect(merged.data.disclaimer).toBe("This email is confidential.");
    expect(merged.locked).toEqual(["logo", "disclaimer"]);
  });

  it("cannot be defeated by writing the locked value directly", async () => {
    const { org, mate, signatureId } = await team(["logo"]);

    // The member writes their own logo straight to the API's store.
    updateSignature(mate.id, signatureId, {
      data: { ...member.data, logoUrl: "https://elsewhere.example/sneaky.png" },
    });

    const row = db().prepare("select data, style, org_template_id from signatures where id = ?").get(signatureId) as {
      data: string;
      style: string;
      org_template_id: string;
    };
    expect(JSON.parse(row.data).logoUrl).toBe("https://elsewhere.example/sneaky.png");

    // What actually gets rendered is still the company's logo.
    const merged = withCompanyTemplate({
      data: JSON.parse(row.data),
      style: JSON.parse(row.style),
      orgTemplateId: row.org_template_id,
    });
    expect(merged.data.logoUrl).toBe(company.data.logoUrl);
    expect(org.id).toBe(row.org_template_id);
  });

  it("follows a change to the template with no write to the member's row", async () => {
    const { org, signatureId } = await team(["logo"]);
    const before = db().prepare("select updated_at from signatures where id = ?").get(signatureId) as {
      updated_at: string;
    };

    const current = readTemplate(org.id)!;
    writeTemplate(org.id, {
      ...current,
      data: { ...current.data, logoUrl: "https://northbeam.example/logo-2027.png" },
    });

    const merged = withCompanyTemplate({ ...member, orgTemplateId: org.id });
    expect(merged.data.logoUrl).toBe("https://northbeam.example/logo-2027.png");

    const after = db().prepare("select updated_at from signatures where id = ?").get(signatureId) as {
      updated_at: string;
    };
    expect(after.updated_at).toBe(before.updated_at);
  });

  it("leaves a signature that follows no template alone", () => {
    const merged = withCompanyTemplate({ ...member, orgTemplateId: null });
    expect(merged.data).toEqual(member.data);
    expect(merged.locked).toEqual([]);
  });
});
