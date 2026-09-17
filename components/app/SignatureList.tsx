"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export type SignatureRow = {
  id: string;
  name: string;
  updatedAt: string;
  html: string;
  proFeatures: string[];
};

/**
 * The saved signatures list: open, rename, duplicate or delete. Each action
 * calls the API and refreshes the server-rendered list.
 */
export function SignatureList({ signatures, canAddMore }: { signatures: SignatureRow[]; canAddMore: boolean }) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function call(path: string, init: RequestInit) {
    setError("");
    const response = await fetch(path, init);
    if (!response.ok && response.status !== 204) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "That did not work. Try again.");
      return false;
    }
    startTransition(() => router.refresh());
    return true;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
          {error}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {signatures.map((signature) => (
          <li key={signature.id} className="flex flex-col overflow-hidden rounded-card border border-ink-200 bg-white">
            {/* The engine escapes every field (scripts/check-render.ts), so the
                owner's own saved markup is safe to inject here. */}
            <div className="h-[150px] overflow-hidden border-b border-ink-100 px-4 pt-4">
              <div
                inert
                aria-hidden="true"
                className="w-[600px] origin-top-left scale-[0.52] [&_img]:max-w-none"
                dangerouslySetInnerHTML={{ __html: signature.html }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              {renaming === signature.id ? (
                <form
                  className="flex gap-2"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (await call(`/api/signatures/${signature.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name }),
                    })) {
                      setRenaming(null);
                    }
                  }}
                >
                  <input
                    autoFocus
                    aria-label="Signature name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-ink-300 px-2.5 py-1.5 text-sm"
                  />
                  <button type="submit" className="rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white">
                    Save
                  </button>
                  <button type="button" onClick={() => setRenaming(null)} className="text-sm text-ink-600">
                    Cancel
                  </button>
                </form>
              ) : (
                <div>
                  <h2 className="font-semibold text-navy-900">{signature.name}</h2>
                  <p className="mt-0.5 text-xs text-ink-600">
                    Edited {new Date(signature.updatedAt).toLocaleDateString()}
                    {signature.proFeatures.length > 0 && ` · Uses Pro: ${signature.proFeatures.join(", ")}`}
                  </p>
                </div>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <Link href={`/editor?id=${signature.id}`} className="font-semibold text-blue-brand-600 hover:text-blue-brand-700">
                  Open
                </Link>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setRenaming(signature.id);
                    setName(signature.name);
                  }}
                  className="text-ink-600 hover:text-navy-900"
                >
                  Rename
                </button>
                {canAddMore && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => call(`/api/signatures/${signature.id}/duplicate`, { method: "POST" })}
                    className="text-ink-600 hover:text-navy-900"
                  >
                    Duplicate
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (confirm(`Delete "${signature.name}"? This cannot be undone.`)) {
                      call(`/api/signatures/${signature.id}`, { method: "DELETE" });
                    }
                  }}
                  className="ml-auto text-ink-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
