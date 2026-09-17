"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth/actions";
import { AuthField, FormError, SubmitButton } from "./AuthField";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState<{ field: string; error: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    startTransition(async () => {
      const result = await loginAction({ email, password, next });
      if (result && !result.ok) setFailure(result);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormError message={failure?.error} />
      <AuthField label="Email" type="email" name="email" autoComplete="email" value={email} onChange={setEmail} />
      <AuthField
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        aside={
          <Link href="/forgot-password" className="text-sm font-medium text-blue-brand-600 hover:text-blue-brand-700">
            Forgot password?
          </Link>
        }
      />
      <SubmitButton pending={pending}>{pending ? "Logging in..." : "Log in"}</SubmitButton>
    </form>
  );
}
