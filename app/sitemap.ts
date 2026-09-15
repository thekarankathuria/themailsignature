import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

const PAGES: Array<[path: string, priority: number]> = [
  ["", 1],
  ["/editor", 0.9],
  ["/templates", 0.8],
  ["/pricing", 0.8],
  ["/teams", 0.7],
  ["/industries", 0.7],
  ["/about", 0.5],
  ["/help", 0.5],
  ["/contact", 0.5],
  ["/legal/terms", 0.3],
  ["/legal/privacy", 0.3],
  ["/legal/cookies", 0.3],
  ["/legal/data-deletion", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({
    url: `${SITE}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
