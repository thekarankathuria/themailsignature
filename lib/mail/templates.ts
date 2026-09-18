import { siteUrl } from "@/lib/env";
import { renderEmail } from "./layout";

/** Account and billing emails. Each returns subject, HTML and plain text. */

export function verifyEmail(url: string) {
  return renderEmail({
    subject: "Confirm your email address",
    preheader: "One click to confirm your TheMailSignature account.",
    heading: "Confirm your email",
    blocks: [
      { kind: "p", text: "Thanks for signing up. Confirm your email address so we can reach you about your account and signatures." },
      { kind: "button", label: "Confirm email", url },
      { kind: "small", text: "This link works for 24 hours. If you didn't create an account, you can ignore this email." },
    ],
  });
}

export function welcome() {
  const site = siteUrl();
  return renderEmail({
    subject: "Welcome to TheMailSignature",
    preheader: "Your signatures are saved to your account.",
    heading: "Your account is ready",
    blocks: [
      { kind: "p", text: "Every signature you make is now saved to your account, so you can come back and edit it at any time." },
      { kind: "button", label: "Open my signatures", url: `${site}/app/signatures` },
      { kind: "small", text: `Need a hand adding it to your email client? Step-by-step guides are at ${site}/help.` },
    ],
  });
}

export function resetPassword(url: string) {
  return renderEmail({
    subject: "Reset your password",
    preheader: "Choose a new password for TheMailSignature.",
    heading: "Reset your password",
    blocks: [
      { kind: "p", text: "Someone asked to reset the password for this account. If that was you, choose a new password below." },
      { kind: "button", label: "Choose a new password", url },
      { kind: "small", text: "This link works for one hour and can be used once. If you didn't ask for this, you can ignore this email; your password stays the same." },
    ],
  });
}

export function passwordChanged() {
  const site = siteUrl();
  return renderEmail({
    subject: "Your password was changed",
    preheader: "The password for your TheMailSignature account was changed.",
    heading: "Your password was changed",
    blocks: [
      { kind: "p", text: "The password for your account was just changed, and other devices were signed out." },
      { kind: "small", text: `If this wasn't you, reset your password now at ${site}/forgot-password and contact us.` },
    ],
  });
}

export function accountDeleted() {
  return renderEmail({
    subject: "Your account has been deleted",
    preheader: "Your TheMailSignature account and saved signatures were deleted.",
    heading: "Your account has been deleted",
    blocks: [
      { kind: "p", text: "Your account, saved signatures and uploaded images have been deleted, and any subscription was cancelled." },
      { kind: "small", text: "Images in emails you already sent will no longer display. You're welcome back any time." },
    ],
  });
}

export function subscriptionStarted(input: { plan: string; interval: "month" | "year"; amount: string; periodEnd: string }) {
  return renderEmail({
    subject: `Your ${input.plan} plan is active`,
    preheader: `Thanks for upgrading to ${input.plan}.`,
    heading: `Welcome to ${input.plan}`,
    blocks: [
      { kind: "p", text: "Thanks for upgrading. Every layout, design and Pro option is now available in the editor." },
      {
        kind: "rows",
        rows: [
          ["Plan", input.plan],
          ["Billing", input.interval === "year" ? "Yearly" : "Monthly"],
          ["Amount", input.amount],
          ["Renews on", input.periodEnd],
        ],
      },
      { kind: "button", label: "Manage billing", url: `${siteUrl()}/app/billing` },
    ],
  });
}

export function subscriptionCanceled(input: { plan: string; periodEnd: string }) {
  return renderEmail({
    subject: `Your ${input.plan} plan will end on ${input.periodEnd}`,
    preheader: "Your subscription was cancelled.",
    heading: "Subscription cancelled",
    blocks: [
      { kind: "p", text: `You keep ${input.plan} features until ${input.periodEnd}. After that your account moves to the Free plan and your signatures stay saved.` },
      { kind: "button", label: "Keep my plan", url: `${siteUrl()}/app/billing` },
    ],
  });
}

export function teamInvite({
  orgName,
  invitedBy,
  role,
  url,
}: {
  orgName: string;
  invitedBy: string | null;
  role: "admin" | "member";
  url: string;
}) {
  const who = invitedBy ? `${invitedBy} invited you` : "You have been invited";
  return renderEmail({
    subject: `Join ${orgName} on TheMailSignature`,
    preheader: `${who} to join ${orgName}.`,
    heading: `Join ${orgName}`,
    blocks: [
      { kind: "p", text: `${who} to join ${orgName} on TheMailSignature as ${role === "admin" ? "an admin" : "a member"}.` },
      { kind: "p", text: "Your team has a company signature template. You fill in your own name, role and contact details, and the parts your admins locked stay as they set them." },
      { kind: "button", label: "Join the team", url },
      { kind: "small", text: "This invitation works for seven days and can be used once. If you were not expecting it, you can ignore this email." },
    ],
  });
}

export function joinedTeam(orgName: string) {
  const site = siteUrl();
  return renderEmail({
    subject: `You joined ${orgName}`,
    preheader: `Your signature now follows the ${orgName} template.`,
    heading: `Welcome to ${orgName}`,
    blocks: [
      { kind: "p", text: `You are on the ${orgName} team. Add your own details and your signature is ready to install.` },
      { kind: "button", label: "Make my signature", url: `${site}/editor` },
      { kind: "small", text: `Setup steps for every email client are at ${site}/help.` },
    ],
  });
}
