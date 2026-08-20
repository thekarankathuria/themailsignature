import type { SocialKey } from "./types";

export interface SocialDef {
  key: SocialKey;
  label: string;
  /** simple-icons slug, used by scripts/gen-social-icons.mjs */
  slug: string;
  brand: string;
  placeholder: string;
  /** Prefix stripped from what the user pastes, for the compact input display. */
  prefix: string;
}

export const SOCIALS: SocialDef[] = [
  { key: "linkedin", label: "LinkedIn", slug: "linkedin", brand: "#0A66C2", prefix: "linkedin.com/in/", placeholder: "linkedin.com/in/yourname" },
  { key: "x", label: "X", slug: "x", brand: "#000000", prefix: "x.com/", placeholder: "x.com/yourhandle" },
  { key: "instagram", label: "Instagram", slug: "instagram", brand: "#E4405F", prefix: "instagram.com/", placeholder: "instagram.com/yourhandle" },
  { key: "facebook", label: "Facebook", slug: "facebook", brand: "#0866FF", prefix: "facebook.com/", placeholder: "facebook.com/yourpage" },
  { key: "youtube", label: "YouTube", slug: "youtube", brand: "#FF0000", prefix: "youtube.com/@", placeholder: "youtube.com/@yourchannel" },
  { key: "tiktok", label: "TikTok", slug: "tiktok", brand: "#000000", prefix: "tiktok.com/@", placeholder: "tiktok.com/@yourhandle" },
  { key: "github", label: "GitHub", slug: "github", brand: "#181717", prefix: "github.com/", placeholder: "github.com/yourname" },
  { key: "dribbble", label: "Dribbble", slug: "dribbble", brand: "#EA4C89", prefix: "dribbble.com/", placeholder: "dribbble.com/yourname" },
  { key: "behance", label: "Behance", slug: "behance", brand: "#1769FF", prefix: "behance.net/", placeholder: "behance.net/yourname" },
  { key: "medium", label: "Medium", slug: "medium", brand: "#000000", prefix: "medium.com/@", placeholder: "medium.com/@yourname" },
  { key: "threads", label: "Threads", slug: "threads", brand: "#000000", prefix: "threads.net/@", placeholder: "threads.net/@yourhandle" },
  { key: "pinterest", label: "Pinterest", slug: "pinterest", brand: "#BD081C", prefix: "pinterest.com/", placeholder: "pinterest.com/yourname" },
  { key: "whatsapp", label: "WhatsApp", slug: "whatsapp", brand: "#25D366", prefix: "wa.me/", placeholder: "wa.me/15558675309" },
  { key: "telegram", label: "Telegram", slug: "telegram", brand: "#26A5E4", prefix: "t.me/", placeholder: "t.me/yourhandle" },
  { key: "discord", label: "Discord", slug: "discord", brand: "#5865F2", prefix: "discord.gg/", placeholder: "discord.gg/yourserver" },
  { key: "slack", label: "Slack", slug: "slack", brand: "#4A154B", prefix: "", placeholder: "yourteam.slack.com" },
  { key: "twitch", label: "Twitch", slug: "twitch", brand: "#9146FF", prefix: "twitch.tv/", placeholder: "twitch.tv/yourchannel" },
  { key: "spotify", label: "Spotify", slug: "spotify", brand: "#1DB954", prefix: "", placeholder: "open.spotify.com/artist/..." },
  { key: "reddit", label: "Reddit", slug: "reddit", brand: "#FF4500", prefix: "reddit.com/u/", placeholder: "reddit.com/u/yourname" },
  { key: "snapchat", label: "Snapchat", slug: "snapchat", brand: "#FFFC00", prefix: "snapchat.com/add/", placeholder: "snapchat.com/add/yourname" },
  { key: "vimeo", label: "Vimeo", slug: "vimeo", brand: "#1AB7EA", prefix: "vimeo.com/", placeholder: "vimeo.com/yourname" },
  { key: "calendly", label: "Calendly", slug: "calendly", brand: "#006BFF", prefix: "calendly.com/", placeholder: "calendly.com/yourname" },
];

export const SOCIAL_BY_KEY: Record<string, SocialDef> = Object.fromEntries(
  SOCIALS.map((s) => [s.key, s]),
);

export const ICON_STYLE_LABELS: Record<string, string> = {
  color: "Brand color",
  circle: "Brand circle",
  dark: "Dark tile",
  light: "Light tile",
  glyphDark: "Minimal dark",
  glyphLight: "Minimal light",
};
