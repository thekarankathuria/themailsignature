"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signupAction } from "@/lib/auth/actions";
import { AuthField, FormError, SubmitButton } from "./AuthField";

export function SignupForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState<{ field: string; error: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    startTransition(async () => {
      const result = await signupAction({ email, password, next });
      if (result && !result.ok) setFailure(result);
    });
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
      <AuthField
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        hint="At least 10 characters."
        error={failure?.field === "password" ? failure.error : undefined}
      />
      <SubmitButton pending={pending}>{pending ? "Creating account..." : "Create free account"}</SubmitButton>
      <p className="text-center text-xs leading-relaxed text-ink-600">
        By creating an account you agree to the{" "}
        <Link href="/legal/terms" className="underline hover:text-navy-900">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline hover:text-navy-900">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
