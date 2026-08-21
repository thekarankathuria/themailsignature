/**
 * JSON-LD builders for the marketing site.
 *
 * Every page that wants structured data imports from here and renders the result inside a
 * single `<script type="application/ld+json">`, so the entity ids (`@id`) stay stable and
 * cross-referenceable across routes: one Organization, one WebSite, one SoftwareApplication.
 *
 * Deliberately absent: `Product`, `Review` and `AggregateRating`. There are no verifiable
 * first-party reviews behind the star glyphs in the hero, and shipping rating markup that no
 * real review corpus backs is a structured-data manual action waiting to happen.
 */

/** Same default as `app/layout.tsx`'s `metadataBase`, so canonical and JSON-LD agree. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sendmark.app";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_APP_ID = `${SITE_URL}/#software-application`;

const BRAND = "Mail Signature";

/** A JSON-LD node: an untyped bag of values, which is all `JSON.stringify` needs. */
export type JsonLdNode = Record<string, unknown>;

export function organizationSchema(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: BRAND,
    url: `${SITE_URL}/`,
    description:
      "Mail Signature builds an AI email signature generator that helps teams design, brand and deploy professional signatures across every email client.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact-us`,
      availableLanguage: ["en"],
    },
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BRAND,
    url: `${SITE_URL}/`,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * The generator itself. `offers` describes the free tier only — the paid tiers live behind
 * the app domain and their prices are not published on this site, so quoting one here would
 * be inventing a number.
 */
export function softwareApplicationSchema(): JsonLdNode {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_APP_ID,
    name: BRAND,
    url: `${SITE_URL}/generator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Free email signature generator: fill in your details, pick a template and copy a signature that works in Gmail, Outlook and Apple Mail.",
    featureList: [
      "Drag-and-drop email signature editor",
      "Mobile responsive signature templates",
      "Social links and call-to-action banners",
      "Branded colours and fonts",
      "Works with any email client or CRM",
    ],
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/generator`,
      category: "Free",
    },
  };
}

export type FaqEntry = { question: string; answer: string };

/**
 * Plain-text mirror of the four accordions in `components/ces/CesFaq.tsx`, in source order.
 *
 * The component's answers are rich JSX (a Loom embed, `<strong>` runs), which cannot go into
 * JSON-LD verbatim, so the markup is flattened here. The wording is the component's own — if
 * `CesFaq.tsx` copy changes, change it here too or the markup stops matching the page.
 */
export const HOME_FAQ: FaqEntry[] = [
  {
    question: "📩 Does this effect email deliverability?",
    answer:
      "Not at all! Mail Signature's unique technology is designed to keep your email deliverability intact. By serving your email signature's animation from our secure servers, we avoid adding heavy elements to your emails. This reduces the chance of your email being marked as spam or being blocked by email service providers. With Mail Signature, you can feel confident that your emails will reach their destination with your animated signature intact.",
  },
  {
    question: "🖥 Does this work Gmail and Outlook?",
    answer:
      "Certainly! Mail Signature is engineered to work with ALL CRMs and Email Clients, ensuring a seamless and universal user experience. Our advanced technology allows for optimal display and animation of email signatures across all platforms. Just follow our simple installation instructions, and your email signature will be ready to impress, regardless of your chosen CRM or email client!",
  },
  {
    question: "🖥 Does this work with other emails and CRMS",
    answer:
      "YES Mail Signature is engineered to work with ALL CRMs and Email Clients, ensuring a seamless and universal user experience.",
  },
  {
    question: "💰 Is there a Free Trial on Paid Plan?",
    answer:
      "Yes, Mail Signature provides a 7-day risk-free trial on all paid accounts.",
  },
];

export function faqPageSchema(entries: FaqEntry[] = HOME_FAQ): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/** The homepage graph: Organization, WebSite, SoftwareApplication and the FAQ, in one node. */
export function homePageGraph(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      softwareApplicationSchema(),
      faqPageSchema(),
    ],
  };
}

/** `JSON.stringify` with the two characters that can break out of a `<script>` escaped. */
export function jsonLd(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
