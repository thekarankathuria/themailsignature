import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import { TEMPLATE_BY_ID } from "@/lib/signature/templates";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";
import people from "./sample-people.json";

export type SamplePerson = {
  key: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  domain: string;
  phone: string;
  city: string;
  accent: string;
  cta?: { text: string };
};

export const SAMPLE_PEOPLE: Record<string, SamplePerson> = Object.fromEntries(
  (people as SamplePerson[]).map((p) => [p.key, p]),
);

export const TEMPLATE_SAMPLES: Record<string, string> = Object.fromEntries(
  Object.keys(TEMPLATE_BY_ID).map((id) => [id, `tpl-${id}`]),
);

/**
 * A complete signature for a fictional person. Links point at the person's
 * `.example` domain or a network's home page, never at a real individual.
 */
export function sampleSignature(
  personKey: string,
  templateId: string,
): { data: SignatureData; style: SignatureStyle } {
  const person = SAMPLE_PEOPLE[personKey];
  const template = TEMPLATE_BY_ID[templateId];
  if (!person) throw new Error(`Unknown sample person: ${personKey}`);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const site = `https://${person.domain}`;
  const data: SignatureData = {
    ...DEFAULT_DATA,
    firstName: person.firstName,
    lastName: person.lastName,
    jobTitle: person.jobTitle,
    company: person.company,
    website: person.domain,
    email: `${person.firstName.toLowerCase()}@${person.domain}`,
    phone: person.phone,
    mobile: "",
    addressLine1: person.city,
    addressLine2: "",
    logoUrl: `/samples/${person.key}-logo.png`,
    logoLink: site,
    photoUrl: `/samples/${person.key}-avatar.png`,
    bannerUrl: templateId === "broadcast" ? "/samples/banner.png" : "",
    // Unlinked: the engine gives banners empty alt text, so a linked banner
    // would be an unnamed link (see the Phase 3 follow-up in the progress notes).
    bannerLink: "",
    ctaText: person.cta?.text ?? "",
    ctaUrl: person.cta ? site : "",
    meetingUrl: "",
    social: { linkedin: "https://www.linkedin.com/", x: "https://x.com/" },
  };
  const style: SignatureStyle = {
    ...DEFAULT_STYLE,
    ...(template.styleHints ?? {}),
    templateId,
    accent: person.accent,
    linkColor: person.accent,
    // The engine's default grey is 4.2:1 on white; samples on our own pages
    // must meet WCAG AA, so they use a slightly darker one.
    mutedColor: "#5F6570",
  };
  return { data, style };
}
