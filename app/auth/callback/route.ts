import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";

/**
 * Behind a load balancer/proxy, `request.url`'s origin can be the internal
 * host and/or http://, which sends a freshly-authenticated user somewhere
 * the just-set cookies aren't visible. Prefer the configured site URL, then
 * the forwarded headers, and only fall back to the request's own origin.
 */
function resolveOrigin(request: Request, requestOrigin: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  return requestOrigin;
}

export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  const origin = resolveOrigin(request, requestOrigin);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? undefined;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext(next)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
