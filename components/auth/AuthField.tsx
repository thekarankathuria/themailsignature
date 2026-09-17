"use client";

import { useId } from "react";

/** Label above, input, then hint or error below, wired for screen readers. */
export function AuthField({
  label,
  type = "text",
  name,
  value,
  onChange,
  autoComplete,
  error,
  hint,
  aside,
}: {
  label: string;
  type?: "text" | "email" | "password";
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
  hint?: string;
  aside?: React.ReactNode;
}) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-navy-900">
          {label}
        </label>
        {aside}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-[15px] text-navy-900 placeholder:text-ink-500 focus:border-blue-brand-600 focus:outline-none focus:ring-2 focus:ring-blue-brand-600/20 aria-[invalid=true]:border-red-600"
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
      {message}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-blue-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700 active:scale-[0.99] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
