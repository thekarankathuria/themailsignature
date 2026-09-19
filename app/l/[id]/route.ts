import { NextResponse } from "next/server";
import { isAutomated, recordClick, targetFor } from "@/lib/teams/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /l/:id - follow a link from a team signature and count the click.
 *
 * This is the only route that redirects to a stored address, so the address is
 * validated again here rather than trusted from the row. Nothing about the
 * person following the link is recorded: the count is per link, per day.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const target = targetFor(id);
  if (!target) {
    // A link that no longer exists should not strand somebody mid-email.
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  // robots.txt disallows /l/; this covers whatever ignores it.
  const headers = request.headers;
  const automated = isAutomated({
    method: request.method,
    userAgent: headers.get("user-agent") ?? "",
    headers: {
      "sec-purpose": headers.get("sec-purpose"),
      purpose: headers.get("purpose"),
      "x-purpose": headers.get("x-purpose"),
      "x-moz": headers.get("x-moz"),
    },
  });

  if (!automated) recordClick(id);

  return NextResponse.redirect(target, 302);
}

export async function HEAD(request: Request, context: { params: Promise<{ id: string }> }) {
  return GET(request, context);
}
