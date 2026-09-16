/**
 * Business details used by the legal pages, the contact page and structured
 * data. The legal entity has not been formed yet, so the unknown values are
 * explicit placeholders; `npm run check:launch` fails until each is replaced,
 * and the legal pages show a "draft" notice while any remains.
 */
export const PLACEHOLDER_PREFIX = "[PLACEHOLDER";

export const COMPANY = {
  name: "TheMailSignature",
  legalName: "[PLACEHOLDER: legal entity name]",
  jurisdiction: "[PLACEHOLDER: governing jurisdiction]",
  address: "[PLACEHOLDER: registered business address]",
  supportEmail: "[PLACEHOLDER: support email address]",
  privacyEmail: "[PLACEHOLDER: privacy contact email address]",
  responseTime: "[PLACEHOLDER: typical reply time, e.g. two business days]",
};

export function hasPlaceholders(): boolean {
  return Object.values(COMPANY).some((v) => v.startsWith(PLACEHOLDER_PREFIX));
}
