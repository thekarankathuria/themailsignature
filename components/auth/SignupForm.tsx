"use client";

import { useState, useTransition } from "react";
import { TextInput, Button } from "@/components/ui";
import { signup } from "@/lib/supabase/actions";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signup({ email, password });
      if (result && "error" in result) setError(result.error);
      else setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <p className="text-sm text-ink-700 dark:text-ink-300">
        Check {email} for a confirmation link to finish creating your
        account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
      />
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
