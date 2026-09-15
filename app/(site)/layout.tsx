import "../globals.css";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
