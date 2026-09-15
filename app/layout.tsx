import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://themailsignature.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "TheMailSignature — free email signature generator",
    template: "%s | TheMailSignature",
  },
  description:
    "Create a professional email signature that renders correctly in Gmail, Outlook and Apple Mail.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
