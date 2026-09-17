import type { Feature } from "@/components/marketing/FeatureGrid";
import type { Step } from "@/components/marketing/Steps";
import type { ClaimId } from "./claims";

type Link = { label: string; href: string };

export const HOME: {
  hero: { eyebrow: string; title: string; lede: string; primary: Link; secondary: Link; claims: ClaimId[] };
  steps: { title: string; lede: string; items: Array<Step & { claims: ClaimId[] }> };
  features: { title: string; lede: string; items: Feature[] };
  templates: { title: string; lede: string; designIds: string[] };
  pricing: { title: string; lede: string };
  faq: { title: string };
  cta: { title: string; body: string; cta: Link };
} = {
  hero: {
    eyebrow: "Email signature generator",
    title: "A signature that looks right in every inbox",
    lede:
      "Build a professional email signature that holds up in Outlook, Gmail and Apple Mail. Start without an account, then copy it into your email client in a couple of minutes.",
    primary: { label: "Create your signature", href: "/editor" },
    secondary: { label: "Browse templates", href: "/templates" },
    claims: ["renders-everywhere", "no-signup-to-start"],
  },
  steps: {
    title: "Three steps from blank to done",
    lede: "No design tools and no HTML. The editor shows your signature as you type.",
    items: [
      {
        title: "Add your details",
        body: "Enter your name, role, contact details and social profiles, then pick fonts, colours and spacing that match your brand.",
        image: {
          src: "/product/editor-details.png",
          alt: "The editor's details panel, with fields for name, role, phone, email and social profiles.",
          width: 1208,
          height: 1010,
        },
        claims: ["styling", "social-icons"],
      },
      {
        title: "Choose a layout",
        body: "Start from a design made for your industry, or switch between 20 layouts. Your details carry over as you compare.",
        image: {
          src: "/product/editor-templates.png",
          alt: "The template picker, showing four layouts previewed with the same details, two of them marked Pro.",
          width: 1208,
          height: 1010,
        },
        claims: ["layouts-20", "industry-designs"],
      },
      {
        title: "Copy it into your email",
        body: "Copy the finished signature with one click and follow the setup steps for your email client, from Gmail to Outlook.",
        image: {
          src: "/product/editor-install.png",
          alt: "The copy panel, with a mail client picker, copy buttons and numbered setup steps for Gmail.",
          width: 1208,
          height: 1010,
        },
        claims: ["copy-export", "install-guides"],
      },
    ],
  },
  features: {
    title: "Built for the inboxes people actually use",
    lede: "Most signature problems come from HTML that one mail client understands and another does not. This one is built for all of them.",
    items: [
      {
        title: "Holds up in Outlook",
        body: "Signatures are built from HTML tables with inline styles, the format Outlook for Windows renders reliably, and they look the same in Gmail and Apple Mail.",
        icon: "Envelope",
        claims: ["renders-everywhere"],
      },
      {
        title: "Logo, headshot and banner",
        body: "Add your company logo, a photo of yourself or a campaign banner, sized and shaped the way you want.",
        icon: "Image",
        claims: ["images"],
      },
      {
        title: "Images that stay put",
        body: "Uploaded images are hosted at permanent addresses, so signatures in emails you sent months ago still display them.",
        icon: "ShieldCheck",
        claims: ["image-hosting"],
      },
      {
        title: "Social icons in six styles",
        body: "Link to LinkedIn, X, Instagram and 19 other networks with icons that match your colours.",
        icon: "ShareNetwork",
        claims: ["social-icons"],
      },
      {
        title: "Buttons that get clicks",
        body: "Add a call-to-action or a meeting link as a proper button, so people can book time with you straight from your email.",
        icon: "Cursor",
        claims: ["buttons"],
      },
      {
        title: "Private by design",
        body: "No tracking pixels are added to your signature, and you can save your signatures to your account to edit them later.",
        icon: "Lock",
        claims: ["no-tracking-pixels", "saved-signatures"],
      },
    ],
  },
  templates: {
    title: "Start from a layout that already works",
    lede: "Six designs for every industry, rendered by the same engine that builds your signature.",
    designIds: ["lawyers-executive", "entrepreneurs-startup", "marketing-creative-agencies-studio", "real-estate-firms-colorblock"],
  },
  pricing: {
    title: "Free for one signature, simple when you need more",
    lede: "Upgrade for every template and extra, or give your whole team matching signatures.",
  },
  faq: { title: "Questions, answered" },
  cta: {
    title: "Make your signature now",
    body: "It takes a few minutes, and it works in the email client you already use.",
    cta: { label: "Create your signature", href: "/editor" },
  },
};
