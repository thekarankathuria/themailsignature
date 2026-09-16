import Link from "next/link";

const VARIANTS = {
  primary: "bg-blue-brand-600 text-white hover:bg-blue-brand-700",
  secondary: "border border-ink-300 bg-white text-navy-900 hover:border-navy-900",
  light: "bg-white text-navy-900 hover:bg-navy-50",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-brand-600 ${VARIANTS[variant]}`}
    >
      {children}
    </Link>
  );
}
