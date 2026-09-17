import "../globals.css";
import { notFound } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

/** Development tools. Nothing under /dev exists in production. */
export default function DevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.NODE_ENV === "production") notFound();
  return <div className="min-h-screen bg-ink-50 px-5 py-10 text-ink-900 sm:px-10">{children}</div>;
}
