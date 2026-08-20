import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sendmark.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Sendmark - free email signature generator",
    template: "%s | Sendmark",
  },
  description:
    "Build a professional HTML email signature in under a minute. Eight tested templates, free image hosting, and install steps for Gmail, Outlook, Apple Mail and more. No account needed.",
  keywords: [
    "email signature generator",
    "free email signature",
    "html email signature",
    "outlook signature",
    "gmail signature",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    title: "Sendmark - free email signature generator",
    description:
      "Build a professional HTML email signature in under a minute. No account needed.",
  },
  robots: { index: true, follow: true },
};

/** Applies the stored theme before paint so the page never flashes. */
const themeScript = `(function(){try{var t=localStorage.getItem("sendmark.theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
