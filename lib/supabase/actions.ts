"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";
import { siteUrl } from "@/lib/env";

export async function login(input: {
  email: string;
  password: string;
  next?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { error: error.message };

  redirect(safeNext(input.next));
}

export async function signup(
  input: { email: string; password: string }
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const site = siteUrl();

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${site}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  return { success: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
