import type { ClaimId } from "@/lib/marketing/claims";

/**
 * Plans and prices. The numbers are placeholders until the owner sets final
 * prices; `npm run check:launch` fails while PRICES_PROVISIONAL is true.
 * Phase 4 maps these plan ids to Stripe prices, so ids must not change.
 */
export const PRICES_PROVISIONAL = true;

export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Price per month, billed monthly (per seat when perSeat). */
  monthly: number;
  /** Price per year, billed yearly (per seat when perSeat). */
  annual: number;
  perSeat: boolean;
  minSeats: number;
  cta: { label: string; href: string };
  highlighted: boolean;
  features: ClaimId[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "One polished signature for yourself.",
    monthly: 0,
    annual: 0,
    perSeat: false,
    minSeats: 1,
    cta: { label: "Create my signature", href: "/editor" },
    highlighted: false,
    features: ["free-templates", "free-one-signature", "external-images", "renders-everywhere", "free-footer-link"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Every template and extra, without our link.",
    monthly: 5,
    annual: 48,
    perSeat: false,
    minSeats: 1,
    cta: { label: "Get Pro", href: "/signup?plan=pro" },
    highlighted: true,
    features: ["all-templates", "animated-elements", "pro-image-hosting", "unlimited-signatures", "no-footer-link", "pro-extras"],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Consistent signatures across your whole team.",
    monthly: 4,
    annual: 38,
    perSeat: true,
    minSeats: 3,
    cta: { label: "Start with Business", href: "/signup?plan=business" },
    highlighted: false,
    features: ["team-invites", "company-template", "brand-kit", "click-analytics", "roles"],
  },
];

export type Cell = boolean | string;

export interface ComparisonRow {
  label: string;
  claims: ClaimId[];
  free: Cell;
  pro: Cell;
  business: Cell;
}

export const COMPARISON: Array<{ category: string; rows: ComparisonRow[] }> = [
  {
    category: "Signatures",
    rows: [
      { label: "Layouts", claims: ["layouts-20", "free-templates", "all-templates"], free: "4 classic", pro: "All 20", business: "All 20" },
      { label: "Industry designs", claims: ["industry-designs"], free: "1 per industry", pro: "All 126", business: "All 126" },
      { label: "Saved signatures", claims: ["free-one-signature", "unlimited-signatures", "saved-signatures"], free: "1", pro: "Unlimited", business: "Unlimited" },
      { label: "Works in Outlook, Gmail and Apple Mail", claims: ["renders-everywhere"], free: true, pro: true, business: true },
      { label: "Fonts, colours and spacing", claims: ["styling"], free: true, pro: true, business: true },
      { label: "Social icons", claims: ["social-icons"], free: true, pro: true, business: true },
      { label: "Logo and headshot from your own links", claims: ["images", "external-images"], free: true, pro: true, business: true },
      { label: "Upload and host images with us", claims: ["pro-image-hosting", "image-hosting"], free: false, pro: true, business: true },
      { label: "Animated icons and status badges", claims: ["animated-elements"], free: false, pro: true, business: true },
      { label: "Banners, GIFs and buttons", claims: ["pro-extras", "buttons"], free: false, pro: true, business: true },
      { label: "TheMailSignature link removed", claims: ["free-footer-link", "no-footer-link"], free: false, pro: true, business: true },
    ],
  },
  {
    category: "Install and export",
    rows: [
      { label: "One-click copy and HTML download", claims: ["copy-export"], free: true, pro: true, business: true },
      { label: "Setup guides for 14 email clients", claims: ["install-guides"], free: true, pro: true, business: true },
      { label: "No tracking pixels", claims: ["no-tracking-pixels"], free: true, pro: true, business: true },
    ],
  },
  {
    category: "Teams",
    rows: [
      { label: "Invite teammates", claims: ["team-invites"], free: false, pro: false, business: true },
      { label: "Company template with locked fields", claims: ["company-template"], free: false, pro: false, business: true },
      { label: "Shared brand kit", claims: ["brand-kit"], free: false, pro: false, business: true },
      { label: "Link click counts", claims: ["click-analytics"], free: false, pro: false, business: true },
      { label: "Owner, admin and member roles", claims: ["roles"], free: false, pro: false, business: true },
    ],
  },
  {
    category: "Account",
    rows: [
      { label: "Manage billing yourself", claims: ["self-serve-billing"], free: "Not needed", pro: true, business: true },
      { label: "Delete your data yourself", claims: ["self-serve-deletion"], free: true, pro: true, business: true },
    ],
  },
];

/** "$5", "$4.50" — whole dollars stay whole. */
export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}
