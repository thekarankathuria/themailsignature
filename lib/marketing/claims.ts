/**
 * Every product capability the marketing site mentions, with the phase of the
 * production plan that delivers it. Copy cites these ids; `npm test` checks the
 * ids exist and are all cited, and `npm run check:launch` refuses to pass while
 * any cited claim belongs to a phase that has not shipped.
 *
 * When a phase ships, raise SHIPPED_THROUGH_PHASE. When a feature is cut,
 * delete its claim and let the checks point at every sentence that cited it.
 */
export const SHIPPED_THROUGH_PHASE = 3;

export const CLAIMS = {
  // Shipped: the editor and render engine that already exist.
  "layouts-20": { label: "20 signature layouts, from classic to designer", shipsIn: 1 },
  "industry-designs": { label: "6 designs for each of 21 industries", shipsIn: 1 },
  "external-images": { label: "Use images from your own links", shipsIn: 1 },
  "renders-everywhere": { label: "Table-based HTML that holds up in Outlook, Gmail and Apple Mail", shipsIn: 1 },
  "social-icons": { label: "Icons for 22 social networks", shipsIn: 1 },
  "images": { label: "Logo, headshot and banner images", shipsIn: 1 },
  "buttons": { label: "Call-to-action and meeting buttons", shipsIn: 1 },
  "install-guides": { label: "Step-by-step setup for 14 email clients", shipsIn: 1 },
  "copy-export": { label: "One-click copy, HTML download and a plain-text version", shipsIn: 1 },
  "no-tracking-pixels": { label: "No tracking pixels in your signature", shipsIn: 1 },
  "image-hosting": { label: "Image hosting that keeps sent signatures intact", shipsIn: 1 },
  "styling": { label: "Fonts, colours, spacing and icon styles", shipsIn: 1 },
  // Phase 3 — accounts and editor.
  "no-signup-to-start": { label: "Build and copy a signature without an account", shipsIn: 3 },
  "saved-signatures": { label: "Save signatures to your account and edit them later", shipsIn: 3 },
  "self-serve-deletion": { label: "Delete your account and data from settings", shipsIn: 3 },
  // Phase 4 — billing.
  "free-templates": { label: "4 classic templates plus the free design for your industry", shipsIn: 4 },
  "free-one-signature": { label: "1 saved signature on the Free plan", shipsIn: 4 },
  "free-footer-link": { label: "A small \"Made with TheMailSignature\" link on Free signatures", shipsIn: 4 },
  "all-templates": { label: "Every layout and every industry design", shipsIn: 4 },
  "animated-elements": { label: "Animated social icons and status badges", shipsIn: 4 },
  "pro-image-hosting": { label: "Upload images and animations and we host them for you", shipsIn: 4 },
  "unlimited-signatures": { label: "Unlimited saved signatures", shipsIn: 4 },
  "no-footer-link": { label: "No TheMailSignature link", shipsIn: 4 },
  "pro-extras": { label: "Banners, animated GIFs, call-to-action and meeting buttons", shipsIn: 4 },
  "self-serve-billing": { label: "Change plan, update payment and cancel yourself", shipsIn: 4 },
  // Phase 5 — Business.
  "team-invites": { label: "Invite teammates and manage seats", shipsIn: 5 },
  "company-template": { label: "A company signature template with admin-locked fields", shipsIn: 5 },
  "brand-kit": { label: "A shared brand kit: colours, fonts, logo and banner", shipsIn: 5 },
  "click-analytics": { label: "Click counts for signature links and banners", shipsIn: 5 },
  "roles": { label: "Owner, admin and member roles", shipsIn: 5 },
} as const satisfies Record<string, { label: string; shipsIn: 1 | 2 | 3 | 4 | 5 }>;

export type ClaimId = keyof typeof CLAIMS;

export function isShipped(id: ClaimId): boolean {
  return CLAIMS[id].shipsIn <= SHIPPED_THROUGH_PHASE;
}
