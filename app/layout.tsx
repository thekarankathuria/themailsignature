import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

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
  openGraph: {
    siteName: "TheMailSignature",
    type: "website",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "TheMailSignature" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
