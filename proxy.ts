import { NextResponse, type NextRequest } from "next/server";

/**
 * Two jobs, both of which have to happen before routing.
 *
 * 1. Keep signed-out visitors out of the account area. This only checks that a
 *    session cookie is present; app/app/layout.tsx validates the session
 *    itself against the database, so this stays cheap.
 * 2. Give every response a Content-Security-Policy carrying a fresh nonce.
 *    Next streams its hydration data in inline <script> tags, so a policy of
 *    `script-src 'self'` would block the site the moment it was enforced. The
 *    nonce is passed on as a request header, which Next puts on its own script
 *    tags, and `strict-dynamic` covers the chunks those scripts then load.
 */
const SESSION_COOKIE = "tms_session";

/** Set CSP_ENFORCE=1 once the reports have been quiet for a few releases. */
const ENFORCED = process.env.CSP_ENFORCE === "1";

function policy(nonce: string): string {
  const directives = [
    "default-src 'self'",
    // 'strict-dynamic' lets a nonced script load the chunks it needs, so the
    // list of allowed origins does not have to track the build output.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    // Signature HTML is inline-styled because that is the only thing every
    // mail client understands, and the previews render that same markup.
    "style-src 'self' 'unsafe-inline'",
    // data: covers an uploaded image previewed before it is saved.
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-src 'none'",
  ];
  // Browsers ignore this in a report-only policy and log an error saying so,
  // which would be noise in every visitor's console.
  if (ENFORCED) directives.push("upgrade-insecure-requests");
  if (process.env.CSP_REPORT_URI) directives.push(`report-uri ${process.env.CSP_REPORT_URI}`);
  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = policy(nonce);

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);

  const signedOut = !request.cookies.get(SESSION_COOKIE)?.value;
  const response =
    signedOut && request.nextUrl.pathname.startsWith("/app/")
      ? NextResponse.redirect(loginUrl(request))
      : NextResponse.next({ request: { headers } });

  response.headers.set(ENFORCED ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only", csp);
  return response;
}

function loginUrl(request: NextRequest): URL {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return url;
}

export const config = {
  // Everything except the static files, which are served straight from disk
  // and carry their own headers from next.config.ts.
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|brand/|i/|samples/|product/|u/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
