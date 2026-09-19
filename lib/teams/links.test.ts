// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUser } from "@/lib/auth/users";
import { closeDb, db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { createSignature } from "@/lib/signatures/store";
import { clicksFor, recordClick, targetFor, totalClicks, trackLinks } from "./links";
import { createOrg } from "./store";

beforeEach(() => {
  process.env.DATABASE_PATH = ":memory:";
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themailsignature.test");
});
afterEach(() => {
  closeDb();
  vi.unstubAllEnvs();
});

async function team() {
  const owner = await createUser("owner@example.com", "a sensible passphrase");
  const org = createOrg({ name: "Northbeam", ownerId: owner.id });
  const signature = createSignature(owner.id, {
    name: "Mine",
    data: { ...DEFAULT_DATA, firstName: "Amara" },
    style: DEFAULT_STYLE,
  });
  return { org, owner, signature };
}

describe("rewriting links", () => {
  it("sends web links through the site and leaves the rest alone", async () => {
    const { org, signature } = await team();
    const html = [
      '<a href="https://northbeam.studio">Website</a>',
      '<a href="http://linkedin.com/in/amara">LinkedIn</a>',
      '<a href="mailto:amara@northbeam.studio">Email</a>',
      '<a href="tel:+13128471928">Phone</a>',
    ].join("");

    const tracked = trackLinks(html, { orgId: org.id, signatureId: signature.id });

    expect(tracked).toContain('href="mailto:amara@northbeam.studio"');
    expect(tracked).toContain('href="tel:+13128471928"');
    expect(tracked).not.toContain("northbeam.studio\">Website");
    const ids = [...tracked.matchAll(/\/l\/([0-9a-f]{32})/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(targetFor(ids[0])).toBe("https://northbeam.studio");
    expect(targetFor(ids[1])).toBe("http://linkedin.com/in/amara");
  });

  it("gives the same link the same id, so its history survives a re-export", async () => {
    const { org, signature } = await team();
    const html = '<a href="https://northbeam.studio">Website</a>';
    const first = trackLinks(html, { orgId: org.id, signatureId: signature.id });
    const second = trackLinks(html, { orgId: org.id, signatureId: signature.id });

    expect(first).toBe(second);
    expect(db().prepare("select count(*) as n from tracked_links").get()).toEqual({ n: 1 });
  });

  it("does not rewrite a link it already rewrote", async () => {
    const { org, signature } = await team();
    const once = trackLinks('<a href="https://northbeam.studio">Website</a>', {
      orgId: org.id,
      signatureId: signature.id,
    });
    const twice = trackLinks(once, { orgId: org.id, signatureId: signature.id });
    expect(twice).toBe(once);
    expect(db().prepare("select count(*) as n from tracked_links").get()).toEqual({ n: 1 });
  });

  it("keeps ampersands in a query string intact", async () => {
    const { org, signature } = await team();
    const tracked = trackLinks('<a href="https://northbeam.studio/x?a=1&amp;b=2">Go</a>', {
      orgId: org.id,
      signatureId: signature.id,
    });
    const id = tracked.match(/\/l\/([0-9a-f]{32})/)![1];
    expect(targetFor(id)).toBe("https://northbeam.studio/x?a=1&b=2");
  });

  it("records who each link belongs to", async () => {
    const { org, signature } = await team();
    trackLinks('<a href="https://linkedin.com/in/amara">In</a><a href="https://cal.com/amara">Book</a>', {
      orgId: org.id,
      signatureId: signature.id,
    });
    const kinds = (db().prepare("select kind from tracked_links order by kind").all() as Array<{ kind: string }>).map(
      (row) => row.kind,
    );
    expect(kinds).toEqual(["meeting", "social"]);
  });
});

describe("the redirect target", () => {
  it("refuses an id that is not one of ours", () => {
    expect(targetFor("../../etc/passwd")).toBeNull();
    expect(targetFor("")).toBeNull();
    expect(targetFor("a".repeat(32))).toBeNull();
  });

  it("refuses a row whose address is not a web address", async () => {
    const { org, signature } = await team();
    const id = newId();
    db()
      .prepare(
        `insert into tracked_links (id, org_id, signature_id, kind, label, url, created_at)
         values (?, ?, ?, 'link', null, ?, ?)`,
      )
      .run(id, org.id, signature.id, "javascript:alert(1)", nowIso());

    // Even written straight to the table, it cannot become an open redirect.
    expect(targetFor(id)).toBeNull();
  });
});

describe("counting", () => {
  it("adds up by day and reports who the link belongs to", async () => {
    const { org, signature, owner } = await team();
    const tracked = trackLinks('<a href="https://northbeam.studio">Website</a>', {
      orgId: org.id,
      signatureId: signature.id,
    });
    const id = tracked.match(/\/l\/([0-9a-f]{32})/)![1];

    recordClick(id);
    recordClick(id);
    recordClick(id, new Date(Date.now() - 864e5));

    const rows = clicksFor(org.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ clicks: 3, url: "https://northbeam.studio", email: owner.email });
    expect(db().prepare("select count(*) as n from link_clicks").get()).toEqual({ n: 2 });
    expect(totalClicks(org.id)).toBe(3);
  });

  it("leaves out clicks older than the window", async () => {
    const { org, signature } = await team();
    const tracked = trackLinks('<a href="https://northbeam.studio">Website</a>', {
      orgId: org.id,
      signatureId: signature.id,
    });
    const id = tracked.match(/\/l\/([0-9a-f]{32})/)![1];

    recordClick(id, new Date(Date.now() - 40 * 864e5));
    expect(totalClicks(org.id, 30)).toBe(0);
    expect(totalClicks(org.id, 60)).toBe(1);
  });

  it("counts nothing for a team with no links", async () => {
    const { org } = await team();
    expect(clicksFor(org.id)).toEqual([]);
  });
});

describe("what counts as a click", () => {
  it("knows a robot from a person", async () => {
    const { isAutomated } = await import("./links");
    const person =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

    expect(isAutomated({ method: "GET", userAgent: person, headers: {} })).toBe(false);
    expect(isAutomated({ method: "HEAD", userAgent: person, headers: {} })).toBe(true);
    for (const agent of [
      "Googlebot/2.1 (+http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; bingbot/2.0)",
      "facebookexternalhit/1.1",
      "Slackbot-LinkExpanding 1.0",
      "curl/8.4.0",
      "GPTBot/1.0",
    ]) {
      expect(isAutomated({ method: "GET", userAgent: agent, headers: {} })).toBe(true);
    }
    expect(isAutomated({ method: "GET", userAgent: person, headers: { "sec-purpose": "prefetch;prerender" } })).toBe(true);
    expect(isAutomated({ method: "GET", userAgent: person, headers: { purpose: "prefetch" } })).toBe(true);
  });
});
