import type { MetadataRoute } from "next";
import { solutionSlugs } from "@/lib/ces/solutions";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mailsignature.com";

/** Marketing routes, highest intent first. */
const PAGES: Array<[path: string, priority: number]> = [
  ["", 1],
  ["/generator", 0.9],
  ["/demo", 0.8],
  ["/browse-1000-industries", 0.8],
  ["/about", 0.7],
  ["/support", 0.6],
  ["/tutorials", 0.6],
  ["/contact-us", 0.6],
  ["/terms-of-use", 0.3],
  ["/privacypolicy", 0.3],
  ["/cookies-policy", 0.3],
  ["/user-data-deletion", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map(([path, priority]) => ({
      url: `${SITE}${path}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...solutionSlugs.map((slug) => ({
      url: `${SITE}/solution/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
