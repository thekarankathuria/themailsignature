/**
 * Search metadata for TheMailSignature's 21 `/industries/<slug>` pages.
 *
 * The slugs match the previous site's `/solution/<slug>` URLs, which now
 * redirect here (see `next.config.ts`), so existing search results keep landing
 * on the right industry.
 *
 * House rules for anything added here:
 *   - `title` is used as an ABSOLUTE title (no `| TheMailSignature` suffix), so it must stay
 *     under 60 characters on its own and lead with the industry, then the head term.
 *   - `description` must be under 155 characters and unique across the set.
 * `npm run build` does not enforce either.
 */
export type IndustrySeo = { title: string; description: string };

export const industrySeo: Record<string, IndustrySeo> = {
  accountants: {
    title: "Accountants Email Signature Generator",
    description:
      "Build a compliant, professional signature for your accounting practice in minutes. Add credentials, disclaimers and booking links — free to start.",
  },
  ceos: {
    title: "CEO Email Signature Generator",
    description:
      "Design an executive email signature that carries authority in every thread. Add your headshot, company links and a call to action in minutes.",
  },
  consultants: {
    title: "Consultant Email Signature Generator",
    description:
      "Turn every client email into a pitch. Create a consultant signature with your services, calendar link and credentials — no design skills needed.",
  },
  "customer-support": {
    title: "Customer Support Email Signature Generator",
    description:
      "Give every agent a clear, consistent support signature with ticket links, hours and escalation contacts. Roll it out across the whole team.",
  },
  "education-schools-universities": {
    title: "Education Email Signature Generator",
    description:
      "Create unified signatures for teachers, faculty and admin staff. Keep department branding consistent and office hours easy to find.",
  },
  entrepreneurs: {
    title: "Entrepreneur Email Signature Generator",
    description:
      "Look established from day one. Build a founder signature with your logo, socials and a booking link, then copy it straight into Gmail.",
  },
  "finance-banking": {
    title: "Finance & Banking Email Signature Generator",
    description:
      "Professional, disclosure-ready signatures for advisers, bankers and corporate finance teams. Consistent branding across every client email.",
  },
  freelancers: {
    title: "Freelancer Email Signature Generator",
    description:
      "Win more work from your inbox. Build a freelance signature with your portfolio, rates page and socials — free, and ready in a few minutes.",
  },
  healthcare: {
    title: "Healthcare Email Signature Generator",
    description:
      "Clear, trustworthy signatures for doctors, nurses and clinic staff. Show credentials, clinic hours and appointment links in every message.",
  },
  "hr-admin": {
    title: "HR & Admin Email Signature Generator",
    description:
      "Standardise signatures across HR and admin so every policy, offer and onboarding email looks the same. Manage the whole team from one place.",
  },
  "it-operations": {
    title: "IT & Operations Email Signature Generator",
    description:
      "Secure, uniform signatures for IT and operations teams. Surface service-desk links and on-call contacts so nobody has to hunt for them.",
  },
  lawyers: {
    title: "Lawyer Email Signature Generator",
    description:
      "Build a law-firm signature with your bar admissions, office details and confidentiality notice. Consistent across every fee earner.",
  },
  marketers: {
    title: "Marketer Email Signature Generator",
    description:
      "Turn your signature into ad space. Add campaign banners, UTM-tagged links and click tracking, then measure what every email earns you.",
  },
  "marketing-creative-agencies": {
    title: "Marketing Agency Email Signature Generator",
    description:
      "On-brand signatures for every account manager, designer and strategist. Showcase the work and keep client-facing email unmistakably yours.",
  },
  "marketing-teams": {
    title: "Marketing Team Email Signature Generator",
    description:
      "Roll one branded signature out across the marketing team, swap campaign banners in seconds and track the clicks each rollout brings in.",
  },
  "personal-assistants": {
    title: "Personal Assistant Email Signature Generator",
    description:
      "Signatures that make it obvious who you support and how to reach them. Add scheduling links and delegated contacts in a couple of minutes.",
  },
  "real-estate-firms": {
    title: "Real Estate Firm Email Signature Generator",
    description:
      "One signature standard for every agent in the brokerage. Add licence numbers, listings links and office branding, then deploy firm-wide.",
  },
  realtor: {
    title: "Realtor Email Signature Generator",
    description:
      "Make every email build trust and drive property enquiries. Add your licence number, listings link and headshot in a few minutes, free.",
  },
  "sales-teams": {
    title: "Sales Team Email Signature Generator",
    description:
      "Book more meetings from email. Give every rep a signature with a calendar link, demo CTA and click tracking — consistent across the team.",
  },
  students: {
    title: "Student Email Signature Generator",
    description:
      "Stand out to professors and recruiters with a tidy student signature: course, university, LinkedIn and portfolio. Free, no account needed.",
  },
  teachers: {
    title: "Teacher Email Signature Generator",
    description:
      "A clear signature for parent and student email: your class, room, office hours and school branding. Free, and ready in a few minutes.",
  },
};

export function getIndustrySeo(slug: string): IndustrySeo | undefined {
  return industrySeo[slug];
}
