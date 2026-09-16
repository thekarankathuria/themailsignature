"use client";

import { useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact/parse";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const FIELDS = ["firstName", "lastName", "email", "company", "topic", "message", "website"] as const;

const inputClass =
  "mt-1 block w-full rounded-lg border border-ink-300 bg-white px-3 py-2.5 text-navy-900 focus:border-blue-brand-600 focus:outline-none focus:ring-2 focus:ring-blue-brand-600/20 aria-[invalid=true]:border-red-600";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldError, setFieldError] = useState<{ field: string; message: string } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(FIELDS.map((f) => [f, String(form.get(f) ?? "")]));
    setStatus({ kind: "sending" });
    setFieldError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; field?: string };
      if (result.ok) {
        setStatus({ kind: "sent" });
        return;
      }
      if (result.field && result.field !== "body") {
        setFieldError({ field: result.field, message: result.error ?? "Check this field." });
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "failed", message: result.error ?? "We could not send that message. Please try again." });
    } catch {
      setStatus({ kind: "failed", message: "We could not send that message. Check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <p role="status" className="rounded-card border border-ink-200 bg-navy-50 p-6 text-navy-900">
        Message sent. We will reply to the email address you gave us.
      </p>
    );
  }

  const errorFor = (field: string) =>
    fieldError?.field === field ? (
      <p id={`${field}-error`} className="mt-1 text-sm text-red-700">{fieldError.message}</p>
    ) : null;
  const invalid = (field: string) => ({
    "aria-invalid": fieldError?.field === field ? true : undefined,
    "aria-describedby": fieldError?.field === field ? `${field}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium text-navy-900">First name</label>
          <input id="firstName" name="firstName" autoComplete="given-name" required className={inputClass} {...invalid("firstName")} />
          {errorFor("firstName")}
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-navy-900">Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" required className={inputClass} {...invalid("lastName")} />
          {errorFor("lastName")}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy-900">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} {...invalid("email")} />
        {errorFor("email")}
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-navy-900">Company <span className="text-ink-500">(optional)</span></label>
        <input id="company" name="company" autoComplete="organization" className={inputClass} {...invalid("company")} />
        {errorFor("company")}
      </div>
      <div>
        <label htmlFor="topic" className="text-sm font-medium text-navy-900">Topic</label>
        <select id="topic" name="topic" required defaultValue="" className={inputClass} {...invalid("topic")}>
          <option value="" disabled>Choose a topic</option>
          {CONTACT_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        {errorFor("topic")}
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy-900">Message</label>
        <textarea id="message" name="message" rows={6} maxLength={5000} required className={inputClass} {...invalid("message")} />
        {errorFor("message")}
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "failed" && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{status.message}</p>
      )}
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-lg bg-blue-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-brand-700 disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
