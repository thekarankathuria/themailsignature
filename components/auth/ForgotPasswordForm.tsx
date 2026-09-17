"use client";

import { useState, useTransition } from "react";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { AuthField, FormError, SubmitButton } from "./AuthField";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [failure, setFailure] = useState<{ field: string; error: string } | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    startTransition(async () => {
      const result = await forgotPasswordAction({ email });
      if (result.ok) setSent(true);
      else setFailure(result);
    });
  }

  if (sent) {
    return (
      <p role="status" className="rounded-lg bg-navy-50 p-4 text-sm leading-relaxed text-navy-900">
        If an account exists for {email}, we have sent it a link to reset the password. The link works for one hour.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormError message={failure?.field === "form" ? failure.error : undefined} />
      <AuthField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        error={failure?.field === "email" ? failure.error : undefined}
      />
      <SubmitButton pending={pending}>{pending ? "Sending..." : "Send reset link"}</SubmitButton>
    </form>
  );
}
