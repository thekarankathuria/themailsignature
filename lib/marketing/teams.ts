import type { Feature } from "@/components/marketing/FeatureGrid";
import type { Step } from "@/components/marketing/Steps";
import type { ClaimId } from "./claims";

type Link = { label: string; href: string };

export const TEAMS: {
  hero: { title: string; lede: string; claims: ClaimId[] };
  problems: { title: string; items: Array<{ title: string; body: string }> };
  capabilities: { title: string; lede: string; items: Feature[] };
  rollout: { title: string; items: Array<Step & { claims?: ClaimId[] }> };
  cta: { title: string; body: string; cta: Link };
} = {
  hero: {
    title: "One signature standard for your whole team",
    lede:
      "Set up a company template once, invite your team, and every signature stays on brand. Each person adds their own details; the parts you lock stay exactly as you set them.",
    claims: ["company-template", "team-invites"],
  },
  problems: {
    title: "Why team signatures drift",
    items: [
      {
        title: "Everyone builds their own",
        body: "Left alone, each person picks their own fonts, logo file and layout, and the company looks different in every inbox.",
      },
      {
        title: "Details go stale",
        body: "Old logos, retired taglines and last year's phone numbers linger in signatures long after they changed.",
      },
      {
        title: "Nobody knows what works",
        body: "Signature banners and links go out in every email, yet most teams have no idea whether anyone clicks them.",
      },
    ],
  },
  capabilities: {
    title: "What Business adds",
    lede: "Everything in Pro for every seat, plus controls for the people who look after the brand.",
    items: [
      {
        title: "Company template with locked fields",
        body: "Choose the layout, logo, colours and disclaimer once. Admins can lock any of them so members only fill in their own name, role and contact details.",
        icon: "Lock",
        claims: ["company-template"],
      },
      {
        title: "Shared brand kit",
        body: "Keep approved colours, fonts, the company logo and the current banner in one place, ready for every signature.",
        icon: "Swatches",
        claims: ["brand-kit"],
      },
      {
        title: "Invites, seats and roles",
        body: "Invite teammates by email, add or remove seats as the team changes, and decide who is an owner, admin or member.",
        icon: "Users",
        claims: ["team-invites", "roles"],
      },
      {
        title: "Click counts without tracking pixels",
        body: "See how often signature links and banners are clicked. Clicks are counted when someone follows a link; no tracking pixels are added to your emails.",
        icon: "ChartBar",
        claims: ["click-analytics", "no-tracking-pixels"],
      },
    ],
  },
  rollout: {
    title: "Rolling it out",
    items: [
      {
        title: "Set up your brand",
        body: "Add your logo, colours and fonts to the brand kit, then build the company template and lock what should not change.",
        claims: ["brand-kit", "company-template"],
      },
      {
        title: "Invite your team",
        body: "Send invitations by email. Each invitation uses a seat, and you can add more seats whenever you need them.",
        claims: ["team-invites"],
      },
      {
        title: "Everyone installs theirs",
        body: "Members fill in their own details and follow the setup steps for their email client. Changes to the company template apply to every member's signature.",
        claims: ["company-template", "install-guides"],
      },
    ],
  },
  cta: {
    title: "Give your team matching signatures",
    body: "Start with the Business plan and have your company template ready today.",
    cta: { label: "Start with Business", href: "/signup?plan=business" },
  },
};
