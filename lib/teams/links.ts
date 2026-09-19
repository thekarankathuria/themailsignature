import { db } from "@/lib/db";
import { newId, nowIso } from "@/lib/db/ids";
import { siteUrl } from "@/lib/env";

/**
 * Click counts without a tracking pixel.
 *
 * Outbound links in a team's signature are swapped for /l/<id>, a row that
 * holds the real address. Following one redirects and adds to a daily count.
 * Nothing goes into the email but an ordinary link, and a click record is a
 * link, a day and a number: no address, no user agent, no recipient.
 */
export type TrackedLink = {
  id: string;
  kind: string;
  label: string | null;
  url: string;
};

export type LinkClicks = TrackedLink & { clicks: number; signatureId: string };

/** Only ordinary web links are counted; mailto: and tel: are left alone. */
function trackable(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** The id for this exact link on this signature, creating it on first sight. */
function linkId(orgId: string, signatureId: string, kind: string, url: string, label: string | null): string {
  const existing = db()
    .prepare("select id from tracked_links where signature_id = ? and kind = ? and url = ?")
    .get(signatureId, kind, url) as { id: string } | undefined;
  if (existing) return existing.id;

  const id = newId();
  db()
    .prepare(
      `insert into tracked_links (id, org_id, signature_id, kind, label, url, created_at)
       values (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, orgId, signatureId, kind, label, url, nowIso());
  return id;
}

/**
 * Rewrites the href of every outbound link in rendered signature HTML.
 *
 * It works on the finished markup rather than the data, so a link a template
 * adds is counted the same as one the person typed. The engine has already
 * escaped these values; the addresses are stored unescaped for the redirect.
 */
export function trackLinks(html: string, { orgId, signatureId }: { orgId: string; signatureId: string }): string {
  const base = siteUrl();
  return html.replace(/href="([^"]*)"/gi, (whole, raw: string) => {
    const url = decodeEntities(raw);
    if (!trackable(url)) return whole;
    if (url.startsWith(`${base}/l/`)) return whole;
    const kind = kindFor(url);
    const id = linkId(orgId, signatureId, kind, url, null);
    return `href="${base}/l/${id}"`;
  });
}

function kindFor(url: string): string {
  if (/linkedin\.com|twitter\.com|x\.com|facebook\.com|instagram\.com|youtube\.com/i.test(url)) return "social";
  if (/calendly|cal\.com|hubspot|savvycal/i.test(url)) return "meeting";
  return "link";
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * The address a tracked link points at, or null.
 *
 * This is the only place the site redirects to a stored address, so the scheme
 * is checked again here rather than trusted from the row.
 */
export function targetFor(id: string): string | null {
  if (!/^[0-9a-f]{32}$/.test(id)) return null;
  const row = db().prepare("select url from tracked_links where id = ?").get(id) as { url: string } | undefined;
  if (!row || !trackable(row.url)) return null;
  return row.url;
}

/** Anything that says it is a robot is taken at its word. */
const BOT = /bot|crawler|spider|crawling|preview|facebookexternalhit|slackbot|whatsapp|telegram|discord|curl|wget|python-requests|headless/i;

/**
 * Whether a request for a link is something other than a person clicking.
 *
 * Browsers and mail clients fetch links ahead of a click to preview them, and
 * crawlers follow them wholesale. Counting those would quietly inflate every
 * number on the analytics page.
 */
export function isAutomated({
  method,
  userAgent,
  headers,
}: {
  method: string;
  userAgent: string;
  headers: Record<string, string | null | undefined>;
}): boolean {
  if (method === "HEAD") return true;
  if (BOT.test(userAgent)) return true;
  return (
    Boolean(headers["sec-purpose"]?.includes("prefetch")) ||
    headers.purpose === "prefetch" ||
    headers["x-purpose"] === "preview" ||
    headers["x-moz"] === "prefetch"
  );
}

export function recordClick(id: string, when = new Date()): void {
  const day = when.toISOString().slice(0, 10);
  db()
    .prepare(
      `insert into link_clicks (link_id, day, clicks) values (?, ?, 1)
       on conflict(link_id, day) do update set clicks = clicks + 1`,
    )
    .run(id, day);
}

/** Clicks per link over the last `days`, newest signatures first. */
export function clicksFor(orgId: string, days = 30): Array<LinkClicks & { email: string; signatureName: string }> {
  const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return db()
    .prepare(
      `select l.id, l.kind, l.label, l.url, l.signature_id, s.name as signature_name, u.email,
              coalesce((select sum(clicks) from link_clicks c where c.link_id = l.id and c.day >= ?), 0) as clicks
         from tracked_links l
         join signatures s on s.id = l.signature_id
         join users u on u.id = s.user_id
        where l.org_id = ?
        order by clicks desc, l.created_at`,
    )
    .all(since, orgId)
    .map((row) => {
      const r = row as {
        id: string;
        kind: string;
        label: string | null;
        url: string;
        signature_id: string;
        signature_name: string;
        email: string;
        clicks: number;
      };
      return {
        id: r.id,
        kind: r.kind,
        label: r.label,
        url: r.url,
        signatureId: r.signature_id,
        signatureName: r.signature_name,
        email: r.email,
        clicks: Number(r.clicks),
      };
    });
}

export function totalClicks(orgId: string, days = 30): number {
  return clicksFor(orgId, days).reduce((sum, link) => sum + link.clicks, 0);
}
