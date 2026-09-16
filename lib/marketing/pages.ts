import type { Metadata } from "next";

/** One entry per static marketing route. Titles are absolute (no suffix). */
export const PAGE_META = {
  home: {
    path: "/",
    title: "Free Email Signature Generator | TheMailSignature",
    description:
      "Build an email signature that looks right in Gmail, Outlook and Apple Mail. Pick a template, add your details and copy it in minutes.",
  },
  templates: {
    path: "/templates",
    title: "Email Signature Templates | TheMailSignature",
    description:
      "Eight email signature templates built from Outlook-safe HTML tables. Preview each one with real details, then open it in the editor.",
  },
  pricing: {
    path: "/pricing",
    title: "Pricing | TheMailSignature",
    description:
      "Compare the Free, Pro and Business plans for TheMailSignature, from one personal signature to company-wide signatures for your team.",
  },
  teams: {
    path: "/teams",
    title: "Email Signatures for Teams | TheMailSignature",
    description:
      "Give every employee a consistent, on-brand email signature. Lock company fields, share a brand kit and see which signature links get clicks.",
  },
  industries: {
    path: "/industries",
    title: "Email Signature Examples by Industry | TheMailSignature",
    description:
      "Email signature advice and live examples for 21 professions, from lawyers and realtors to teachers, healthcare staff and sales teams.",
  },
  help: {
    path: "/help",
    title: "Help: Add Your Email Signature | TheMailSignature",
    description:
      "Step-by-step instructions for adding your signature to Gmail, Outlook, Apple Mail, Thunderbird and more, plus fixes for common problems.",
  },
  about: {
    path: "/about",
    title: "About TheMailSignature",
    description:
      "Why TheMailSignature exists: email signatures that survive every mail client, built without tracking pixels or design shortcuts.",
  },
  contact: {
    path: "/contact",
    title: "Contact Us | TheMailSignature",
    description:
      "Questions about your signature, billing or the Business plan? Send the TheMailSignature team a message and we will get back to you.",
  },
  terms: {
    path: "/legal/terms",
    title: "Terms of Use | TheMailSignature",
    description:
      "The terms that apply when you use TheMailSignature to create, save and install email signatures, including plans and acceptable use.",
  },
  privacy: {
    path: "/legal/privacy",
    title: "Privacy Policy | TheMailSignature",
    description:
      "What personal data TheMailSignature collects, why we collect it, who processes it for us, and the choices and rights you have over it.",
  },
  cookies: {
    path: "/legal/cookies",
    title: "Cookie Policy | TheMailSignature",
    description:
      "The cookies and browser storage TheMailSignature uses to keep you signed in and remember your signature draft, and how to control them.",
  },
  dataDeletion: {
    path: "/legal/data-deletion",
    title: "Delete Your Data | TheMailSignature",
    description:
      "How to delete your TheMailSignature account, saved signatures and uploaded images, what happens to them, and how long removal takes.",
  },
} satisfies Record<string, { path: string; title: string; description: string }>;

export type PageKey = keyof typeof PAGE_META;

export function pageMetadata(key: PageKey): Metadata {
  const { path, title, description } = PAGE_META[key];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}
