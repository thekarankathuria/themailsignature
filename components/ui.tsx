"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useId, useState } from "react";

/*
 * Radius scale used across the app, applied consistently:
 *   cards and panels  14px  (rounded-[14px])
 *   inputs, buttons   10px  (rounded-[10px])
 *   chips, segments    8px  (rounded-lg)
 */

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const inputBase =
  "w-full rounded-[10px] border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 " +
  "transition-colors hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100 " +
  "dark:placeholder:text-ink-400 dark:hover:border-ink-700";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium text-ink-600 dark:text-ink-300"
      >
        {label}
      </label>
      {children(id)}
      {hint ? (
        <p className="text-xs leading-snug text-ink-500 dark:text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      {(id) => (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      )}
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputBase, "resize-y leading-relaxed")}
        />
      )}
    </Field>
  );
}

export function Select<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={cx(inputBase, "appearance-none pr-8")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%236c737f' stroke-width='1.6'><path d='M4 6l4 4 4-4'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  presets?: Array<{ name: string; value: string }>;
}) {
  return (
    <Field label={label}>
      {(id) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border border-ink-200 dark:border-ink-800">
              <input
                aria-label={`${label} swatch`}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] cursor-pointer border-0 bg-transparent p-0"
              />
            </span>
            <input
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className={cx(inputBase, "font-mono text-xs uppercase")}
            />
          </div>
          {presets ? (
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  title={p.name}
                  aria-label={p.name}
                  onClick={() => onChange(p.value)}
                  className={cx(
                    "h-6 w-6 rounded-lg border transition-transform hover:scale-110",
                    value.toLowerCase() === p.value.toLowerCase()
                      ? "border-ink-900 dark:border-white"
                      : "border-ink-200 dark:border-ink-800",
                  )}
                  style={{ backgroundColor: p.value }}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Field>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm text-ink-800 dark:text-ink-200">
          {label}
        </label>
        {hint ? (
          <span className="text-xs text-ink-500 dark:text-ink-400">{hint}</span>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand-600" : "bg-ink-300 dark:bg-ink-700",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left]",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-xs font-medium text-ink-600 dark:text-ink-300">
          {label}
        </span>
      ) : null}
      <div
        role="group"
        aria-label={label}
        className="inline-flex rounded-lg border border-ink-200 bg-white p-0.5 dark:border-ink-800 dark:bg-ink-900"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cx(
              "flex-1 whitespace-nowrap rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors",
              value === o.value
                ? "bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-950"
                : "text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Panel({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="overflow-hidden rounded-[14px] border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-ink-900 dark:text-ink-100">
              {title}
            </span>
            {summary ? (
              <span className="text-xs text-ink-500 dark:text-ink-400">{summary}</span>
            ) : null}
          </span>
          <CaretDown
            size={16}
            weight="bold"
            aria-hidden
            className={cx(
              "shrink-0 text-ink-500 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </h2>
      {open ? (
        <div
          id={id}
          className="border-t border-ink-200 px-4 py-4 dark:border-ink-800"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-700 active:translate-y-px disabled:bg-brand-600/50",
    secondary:
      "border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50 active:translate-y-px " +
      "dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800",
    ghost:
      "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100",
  };
  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors disabled:cursor-not-allowed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variants[variant],
        className,
      )}
    />
  );
}
