import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * Deliberately NOT included: Content-Security-Policy. The marketing site is a
 * CSS-verbatim Webflow clone that relies on inline styles and third-party
 * embeds (Loom, b-cdn video), so a strict policy would break layout and media
 * rather than protect anything. Adding one means first inventorying those
 * origins and running it `Content-Security-Policy-Report-Only` for a while.
 * Shipping a CSP that has to be disabled at the first bug report is worse than
 * shipping none, so it is a tracked follow-up, not a one-line addition.
 */
const securityHeaders = [
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
};

export default nextConfig;
