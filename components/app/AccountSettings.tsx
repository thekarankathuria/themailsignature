"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { changePasswordAction, deleteAccountAction, resendVerificationAction } from "@/lib/auth/actions";
import { AuthField, FormError } from "@/components/auth/AuthField";
import type { PlanId } from "@/lib/billing/plans";

/** Email confirmation, password change and account deletion. */
export function AccountSettings({
  email,
  verified,
  plan,
  memberSince,
}: {
  email: string;
  verified: boolean;
  plan: PlanId;
  memberSince: string;
}) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [passwordDone, setPasswordDone] = useState(false);
  const [passwordFailure, setPasswordFailure] = useState<{ field: string; error: string } | null>(null);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deleteFailure, setDeleteFailure] = useState<{ field: string; error: string } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Account</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-600">Email</dt>
          <dd className="text-navy-900">{email}</dd>
          <dt className="text-ink-600">Email confirmed</dt>
          <dd className="text-navy-900">
            {verified ? (
              "Yes"
            ) : sent ? (
              <span role="status">Confirmation email sent. Check your inbox.</span>
            ) : (
              <>
                Not yet.{" "}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await resendVerificationAction();
                      if (result.ok) setSent(true);
                      else setVerifyError(result.error);
                    })
                  }
                  className="font-semibold text-blue-brand-600 hover:text-blue-brand-700"
                >
                  Send the link again
                </button>
                {verifyError && <span className="ml-2 text-red-700">{verifyError}</span>}
              </>
            )}
          </dd>
          <dt className="text-ink-600">Plan</dt>
          <dd className="text-navy-900">
            {plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Business"}{" "}
            <Link href="/app/billing" className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">
              Manage
            </Link>
          </dd>
          <dt className="text-ink-600">Member since</dt>
          <dd className="text-navy-900">{new Date(memberSince).toLocaleDateString()}</dd>
        </dl>
      </section>

      <section className="rounded-card border border-ink-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Change password</h2>
        {passwordDone ? (
          <p role="status" className="mt-4 rounded-lg bg-navy-50 px-4 py-3 text-sm text-navy-900">
            Password changed. Other devices were signed out.
          </p>
        ) : (
          <form
            className="mt-4 flex max-w-sm flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setPasswordFailure(null);
              startTransition(async () => {
                const result = await changePasswordAction({ current, next });
                if (result.ok) {
                  setPasswordDone(true);
                  setCurrent("");
                  setNext("");
                } else setPasswordFailure(result);
              });
            }}
          >
            <FormError message={passwordFailure?.field === "form" ? passwordFailure.error : undefined} />
            <AuthField
              label="Current password"
              type="password"
              name="current"
              autoComplete="current-password"
              value={current}
              onChange={setCurrent}
              error={passwordFailure?.field === "current" ? passwordFailure.error : undefined}
            />
            <AuthField
              label="New password"
              type="password"
              name="next"
              autoComplete="new-password"
              value={next}
              onChange={setNext}
              hint="At least 10 characters."
              error={passwordFailure?.field === "next" ? passwordFailure.error : undefined}
            />
            <button
              type="submit"
              disabled={pending}
              className="self-start rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              Change password
            </button>
          </form>
        )}
      </section>

      <section className="rounded-card border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-navy-900">Delete account</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-600">
          This deletes your account, your saved signatures and the images you uploaded, and cancels any plan. Images in
          emails you already sent will stop displaying. It cannot be undone.
        </p>
        <form
          className="mt-4 flex max-w-sm flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setDeleteFailure(null);
            startTransition(async () => {
              const result = await deleteAccountAction({ password });
              if (result && !result.ok) setDeleteFailure(result);
            });
          }}
        >
          <FormError message={deleteFailure?.field === "form" ? deleteFailure.error : undefined} />
          <AuthField
            label="Type your email to confirm"
            name="confirmEmail"
            value={confirmEmail}
            onChange={setConfirmEmail}
            hint={`Type ${email}`}
          />
          <AuthField
            label="Password"
            type="password"
            name="deletePassword"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={deleteFailure?.field === "password" ? deleteFailure.error : undefined}
          />
          <button
            type="submit"
            disabled={pending || confirmEmail.trim().toLowerCase() !== email.toLowerCase()}
            className="self-start rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            Delete my account
          </button>
        </form>
      </section>
    </div>
  );
}
