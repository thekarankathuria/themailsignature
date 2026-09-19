import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Uploaded images are referenced from mail, not from pages, so there
          // is nothing for a crawler to do in there.
          "/u/",
          "/dev/",
          "/app/",
          // Counted links. A crawler following these would add to a team's
          // click counts, which are meant to count people.
          "/l/",
          // Invitation links carry a single-use token. Nothing should follow
          // one except the person it was sent to.
          "/invite/",
          "/checkout",
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
