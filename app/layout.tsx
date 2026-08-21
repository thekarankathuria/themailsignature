import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mailsignature.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Mail Signature — AI email signature generator",
    template: "%s | Mail Signature",
  },
  description:
    "AI-powered email signature maker that helps you create, customize and deploy professional signatures that boost replies and drive traffic.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Urbanist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
