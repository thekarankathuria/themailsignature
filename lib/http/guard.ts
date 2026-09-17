import { NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/auth/sessions";
import type { User } from "@/lib/auth/users";
import { siteUrl } from "@/lib/env";

/**
 * Session and same-origin checks for JSON routes.
 *
 * The session token is read from the request's own Cookie header rather than
 * next/headers, so route handlers stay callable from tests. Writes must carry
 * an Origin we recognise: the session cookie is SameSite=Lax, which already
 * blocks cross-site form posts, and this closes the gap for anything else.
 */
export type Guarded = { user: User; sessionId: string };

function cookieValue(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin === siteUrl() || origin === new URL(request.url).origin;
}

export function jsonError(status: number, error: string, extra: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ error, ...extra }, { status });
}

/** The signed-in user, or a response to return instead. */
export function requireUser(request: Request): Guarded | NextResponse {
  if (request.method !== "GET" && !sameOrigin(request)) {
    return jsonError(403, "This request did not come from TheMailSignature.");
  }
  const session = readSession(cookieValue(request, SESSION_COOKIE));
  if (!session) return jsonError(401, "Log in to continue.");
  return { user: session.user, sessionId: session.session.id };
}

export function isResponse(value: Guarded | NextResponse): value is NextResponse {
  return value instanceof Response;
}

/** Parsed JSON body, or an empty object when there is nothing useful. */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
