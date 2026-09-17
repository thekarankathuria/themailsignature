"use client";

import { useState, useTransition } from "react";
import { resetPasswordAction } from "@/lib/auth/actions";
import { AuthField, FormError, SubmitButton } from "./AuthField";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState<{ field: string; error: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFailure(null);
    startTransition(async () => {
      const result = await resetPasswordAction({ token, password });
      if (result && !result.ok) setFailure(result);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FormError message={failure?.field === "form" ? failure.error : undefined} />
      <AuthField
        label="New password"
        type="password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        hint="At least 10 characters. Other devices will be signed out."
        error={failure?.field === "password" ? failure.error : undefined}
      />
      <SubmitButton pending={pending}>{pending ? "Saving..." : "Save new password"}</SubmitButton>
    </form>
  );
}
