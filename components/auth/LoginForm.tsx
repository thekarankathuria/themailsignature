"use client";

import { useState, useTransition } from "react";
import { TextInput, Button } from "@/components/ui";
import { login } from "@/lib/supabase/actions";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login({ email, password, next });
      if (result?.error) setError(result.error);
    });
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
        placeholder="********"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
