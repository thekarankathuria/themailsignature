import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Uploaded images are referenced from mail, not from pages, so there is
      // nothing for a crawler to do in there.
      { userAgent: "*", allow: "/", disallow: ["/api/", "/u/"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
