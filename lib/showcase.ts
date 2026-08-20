import { DEFAULT_DATA, DEFAULT_STYLE } from "@/lib/signature/defaults";
import type { SignatureData, SignatureStyle } from "@/lib/signature/types";

export interface Showcase {
  id: string;
  label: string;
  data: SignatureData;
  style: SignatureStyle;
}

/** Sample signatures used across the marketing pages. Real renderer output. */
export const SHOWCASE: Showcase[] = [
  {
    id: "meridian",
    label: "Meridian",
    data: {
      ...DEFAULT_DATA,
      social: { linkedin: "linkedin.com/in/amaraokonkwo", x: "x.com/amaraokonkwo" },
    },
    style: { ...DEFAULT_STYLE, templateId: "meridian" },
  },
  {
    id: "ledger",
    label: "Ledger",
    data: {
      ...DEFAULT_DATA,
      firstName: "Tobias",
      lastName: "Lindqvist",
      jobTitle: "Principal Architect",
      company: "Halvard & Reed",
      website: "halvardreed.com",
      email: "tobias@halvardreed.com",
      phone: "+44 20 7946 0338",
      mobile: "",
      addressLine1: "18 Rivington Street",
      addressLine2: "London EC2A 3DZ",
      social: { linkedin: "linkedin.com/in/tlindqvist", behance: "behance.net/tlindqvist" },
    },
    style: {
      ...DEFAULT_STYLE,
      templateId: "ledger",
      accent: "#1E2126",
      linkColor: "#1E2126",
      font: "georgia",
      iconStyle: "glyphDark",
      uppercaseName: true,
    },
  },
  {
    id: "portrait",
    label: "Portrait",
    data: {
      ...DEFAULT_DATA,
      firstName: "Priya",
      lastName: "Raghunathan",
      jobTitle: "Managing Broker",
      company: "Cedarline Property",
      website: "cedarline.co",
      email: "priya@cedarline.co",
      phone: "+1 (604) 218-7740",
      mobile: "+1 (604) 933-2216",
      addressLine1: "1140 Homer Street",
      addressLine2: "Vancouver, BC V6B 2X6",
      meetingUrl: "cal.com/priya/viewing",
      meetingLabel: "Book a viewing",
      social: { linkedin: "linkedin.com/in/praghunathan", instagram: "instagram.com/cedarline" },
    },
    style: {
      ...DEFAULT_STYLE,
      templateId: "portrait",
      accent: "#B03059",
      linkColor: "#B03059",
      iconStyle: "circle",
      density: "compact",
    },
  },
  {
    id: "slate",
    label: "Slate",
    data: {
      ...DEFAULT_DATA,
      firstName: "Marcus",
      lastName: "Adeyemi",
      jobTitle: "Founder",
      company: "Field Notes Coffee",
      website: "fieldnotes.coffee",
      email: "marcus@fieldnotes.coffee",
      phone: "+1 (503) 471-9024",
      mobile: "",
      addressLine1: "820 SE Belmont St",
      addressLine2: "Portland, OR 97214",
      social: { instagram: "instagram.com/fieldnotescoffee", tiktok: "tiktok.com/@fieldnotes" },
    },
    style: {
      ...DEFAULT_STYLE,
      templateId: "slate",
      accent: "#B26A05",
      iconStyle: "glyphLight",
      density: "compact",
    },
  },
];

export const HERO_SHOWCASE = SHOWCASE[0];
