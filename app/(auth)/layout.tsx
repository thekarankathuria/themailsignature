import "../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm rounded-[14px] border border-ink-200 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
        {children}
      </div>
    </div>
  );
}
