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
  pricing: [
    {
      q: "Can I switch plans later?",
      a: "Yes. Upgrade, downgrade or cancel from your billing settings at any time. A cancelled plan stays active until the end of the period you paid for.",
      claims: ["self-serve-billing"],
    },
    {
      q: "What happens to my signatures if I downgrade to Free?",
      a: "Nothing is deleted. The Free plan keeps one saved signature editable; any others stay in your account until you upgrade again or remove them.",
      claims: ["free-one-signature", "saved-signatures"],
    },
    {
      q: "How do Business seats work?",
      a: "You pay for each teammate who has a seat, with a minimum of three. Add seats when you invite more people and remove them when someone leaves.",
      claims: ["team-invites"],
    },
    {
      q: "What is the link on Free signatures?",
      a: "Signatures made on the Free plan end with a small \"Made with TheMailSignature\" link. Pro and Business signatures do not include it.",
      claims: ["free-footer-link", "no-footer-link"],
    },
    {
      q: "Which currency are prices in?",
      a: "Prices are shown in US dollars. Sales tax or VAT may be added at checkout depending on where you are.",
    },
  ],
  teams: [
    {
      q: "Can members change the company template?",
      a: "Members can fill in their own details. Anything an admin has locked, such as the logo, colours or disclaimer, stays as the admin set it.",
      claims: ["company-template"],
    },
    {
      q: "How are link clicks counted?",
      a: "Links in team signatures pass through a short redirect that records the click and sends the reader straight on. No tracking pixels are added, and visitor IP addresses are never stored in readable form.",
      claims: ["click-analytics", "no-tracking-pixels"],
    },
    {
      q: "What is the minimum team size?",
      a: "Business starts at three seats. You can add seats at any time as you invite more people.",
      claims: ["team-invites"],
    },
    {
      q: "Who can manage billing?",
      a: "The workspace owner manages the plan, seats and payment details, and can cancel at any time.",
      claims: ["roles", "self-serve-billing"],
    },
  ],
  help: [
    {
      q: "My images do not show for the people I email",
      a: "Your images are hosted for you, but some email clients block images until the recipient allows them. Ask a colleague to check whether their client shows a \"download images\" prompt.",
      claims: ["image-hosting"],
    },
    {
      q: "Outlook adds extra space or changes the layout",
      a: "Paste the signature with the Copy signature button rather than pasting HTML source. Signatures are built from tables so Outlook keeps their layout.",
      claims: ["renders-everywhere", "copy-export"],
    },
    {
      q: "My signature looks different on my phone",
      a: "Mobile mail apps often use their own signature setting. Set the signature inside the app as well, or turn off the app's default signature.",
      claims: ["install-guides"],
    },
    {
      q: "I see code instead of my design",
      a: "That happens when HTML source is pasted into a client that expects a rendered signature. Use Copy signature for Gmail, Outlook and Apple Mail, and keep HTML source for clients whose guide asks for it.",
      claims: ["copy-export"],
    },
    {
      q: "Can I use the same signature in several email clients?",
      a: "Yes. Copy it once and add it to each client using that client's guide above. Social icons and images are hosted, so they display the same everywhere.",
      claims: ["copy-export", "social-icons", "image-hosting"],
    },
    {
      q: "How do I update my signature later?",
      a: "Open your saved signature in the editor, make the change, and copy it into your email client again.",
      claims: ["saved-signatures"],
    },
  ],
};
