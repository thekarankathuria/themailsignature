import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * The Content-Security-Policy is REPORT-ONLY on purpose. It is a real policy
 * written against what the app actually loads, but a policy that breaks the
 * editor is worse than no policy, so it reports for a while before it
 * enforces. Switching it on means changing one key name, once the reports at
 * `CSP_REPORT_URI` have been quiet through a few releases.
 *
 * Two allowances are not negotiable and are worth stating:
 *   - `style-src 'unsafe-inline'`: signature HTML is inline-styled by design,
 *     because that is the only thing every mail client understands, and the
 *     previews render that same markup on the page.
 *   - `img-src data:`: the editor previews an uploaded image before it is
 *     saved, straight from the file the visitor picked.
 * `script-src` allows no inline script, which is the part that matters.
 */
const cspDirectives = [
  "default-src 'self'",
  // Next injects its own inline bootstrap in development only; production
  // ships external chunks, so this stays tight.
  process.env.NODE_ENV === "production"
    ? "script-src 'self'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
];

const securityHeaders = [
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      ...cspDirectives,
      ...(process.env.CSP_REPORT_URI ? [`report-uri ${process.env.CSP_REPORT_URI}`] : []),
    ].join("; "),
  },
  // Stop the browser second-guessing declared content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin cross-site, the full path same-site; never leak query
  // strings (which can carry a `next=` path) to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here is meant to be framed; blocks clickjacking of the generator.
  { key: "X-Frame-Options", value: "DENY" },
  // Decline hardware APIs the app never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Ignored by browsers over plain http, so it is inert on localhost and
  // active the moment the site is served over TLS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Ship only the files the server needs, so the container stays small and
  // node_modules does not travel with it. See the Dockerfile.
  output: "standalone",

  // Don't advertise the framework version.
  poweredByHeader: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Uploaded signature images are immutable: the filename is a hash of
        // the bytes, so a given URL can never point at different content.
        source: "/u/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Every URL the previous site exposed is indexed somewhere; each one moves
  // permanently to its new home. scripts/check-redirects.ts guards this list.
  async redirects() {
    return [
      { source: "/generator", destination: "/editor", permanent: true },
      { source: "/solution/:slug", destination: "/industries/:slug", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacypolicy", destination: "/legal/privacy", permanent: true },
      { source: "/terms-of-use", destination: "/legal/terms", permanent: true },
      { source: "/cookies-policy", destination: "/legal/cookies", permanent: true },
      { source: "/user-data-deletion", destination: "/legal/data-deletion", permanent: true },
      { source: "/browse-1000-industries", destination: "/industries", permanent: true },
      { source: "/support", destination: "/help", permanent: true },
      { source: "/tutorials", destination: "/help", permanent: true },
    ];
  },
};

export default nextConfig;
