import type { ClaimId } from "./claims";

export type Faq = { q: string; a: string; claims?: ClaimId[] };

/** FAQ sets by page. Each page's task fills its own list. */
export const FAQS: Record<"home" | "pricing" | "teams" | "help", Faq[]> = {
  home: [
    {
      q: "Is TheMailSignature free?",
      a: "Yes. The Free plan gives you 4 templates and one saved signature at no cost. Pro and Business add every template, unlimited signatures and team features.",
      claims: ["free-four-templates", "free-one-signature"],
    },
    {
      q: "Which email clients does it work with?",
      a: "Signatures work in Gmail, Outlook (Windows, Mac and web), Apple Mail and other common clients. The help pages have step-by-step setup for 14 email clients.",
      claims: ["renders-everywhere", "install-guides"],
    },
    {
      q: "Do I need an account?",
      a: "Not to build and copy a signature. Create a free account when you want to save a signature and come back to edit it later.",
      claims: ["no-signup-to-start", "saved-signatures"],
    },
    {
      q: "Will my images stop showing later?",
      a: "No. Images you upload are stored at addresses that never change, so emails you have already sent keep displaying them.",
      claims: ["image-hosting"],
    },
    {
      q: "Do you track the people I email?",
      a: "No. We never add tracking pixels to your signature, so opening your email tells us nothing about your recipients.",
      claims: ["no-tracking-pixels"],
    },
    {
      q: "Can my whole team use it?",
      a: "Yes. The Business plan lets you invite teammates, share one company template and keep everyone's signature on brand.",
      claims: ["team-invites", "company-template"],
    },
  ],
  pricing: [],
  teams: [],
  help: [],
};
