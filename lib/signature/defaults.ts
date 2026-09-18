import type { SignatureData, SignatureStyle } from "./types";

export const ACCENT_PRESETS = [
  { name: "Emerald", value: "#0F7B5F" },
  { name: "Ink", value: "#1E2126" },
  { name: "Cobalt", value: "#1F5FD0" },
  { name: "Vermillion", value: "#C6432B" },
  { name: "Amber", value: "#B26A05" },
  { name: "Plum", value: "#6B2E7A" },
  { name: "Teal", value: "#0E6B78" },
  { name: "Rose", value: "#B03059" },
];

export const DEFAULT_STYLE: SignatureStyle = {
  templateId: "meridian",
  font: "arial",
  fontSize: 14,
  accent: "#0F7B5F",
  nameColor: "#1A1D21",
  textColor: "#33383F",
  mutedColor: "#767C86",
  linkColor: "#0F7B5F",
  iconStyle: "dark",
  iconSize: 22,
  density: "cozy",
  photoShape: "circle",
  showDivider: true,
  showLabels: true,
  uppercaseName: false,
  iconAnimation: "none",
  statusDot: "none",
  statusColor: "#22A55B",
  contactIcons: "none",
  secondaryFont: "arial",
};

export const DEFAULT_DATA: SignatureData = {
  firstName: "Amara",
  lastName: "Okonkwo",
  credentials: "",
  pronouns: "",
  jobTitle: "Head of Client Strategy",
  department: "",

  company: "Northbeam Studio",
  website: "northbeam.studio",
  addressLine1: "412 W Superior St, Suite 300",
  addressLine2: "Chicago, IL 60654",

  email: "amara@northbeam.studio",
  phone: "+1 (312) 847-1928",
  mobile: "+1 (312) 604-7715",

  meetingLabel: "Book a 20-minute call",
  meetingUrl: "",

  logoUrl: "",
  logoWidth: 132,
  logoLink: "",
  photoUrl: "",
  photoSize: 92,
  bannerUrl: "",
  bannerLink: "",
  bannerWidth: 440,

  ctaText: "",
  ctaUrl: "",

  tagline: "",
  sideText: "",
  disclaimer: "",
  greenFooter: false,

  social: {
    linkedin: "linkedin.com/in/amaraokonkwo",
    x: "x.com/amaraokonkwo",
  },
};

/** Blank slate, for the "start from scratch" action. */
export const EMPTY_DATA: SignatureData = {
  ...DEFAULT_DATA,
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  email: "",
  phone: "",
  mobile: "",
  meetingUrl: "",
  social: {},
};

export const STORAGE_KEY = "tms.signature.v1";
