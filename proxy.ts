import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps signed-out visitors out of the account area. This only checks that a
 * session cookie is present; app/app/layout.tsx validates the session itself
 * against the database (the proxy runs before routing and should stay cheap).
 */
const SESSION_COOKIE = "tms_session";

export function proxy(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*"],
};
