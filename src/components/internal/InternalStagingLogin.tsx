"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Soft shared-password unlock for internal staging.
 * Sets cookie via /api/internal/staging-auth — not production auth.
 */
export function InternalStagingLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = sanitizeNext(searchParams.get("next"));

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/internal/staging-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error ?? "Unlock failed.");
        setBusy(false);
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-ink/10 bg-white/95 px-6 py-8 shadow-[0_1px_0_rgba(140,130,252,0.08)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
          shortkey.studio · Internal staging
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Unlock Family Table
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Soft shared-secret gate for internal staging only — not public launch, not 正式版 login.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Staging password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-ink/15 bg-silk/40 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand/40"
              required
            />
          </label>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-full bg-brand px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Unlocking…" : "Unlock"}
          </button>
        </form>

        <p className="mt-5 text-[11px] leading-relaxed text-ink-subtle">
          Set <code className="font-mono">FAMILY_TABLE_STAGING_PASSWORD</code> (or{" "}
          <code className="font-mono">INTERNAL_STAGING_SECRET</code>) in Vercel /{" "}
          <code className="font-mono">.env.local</code>. Localhost family:dev bypasses this gate.
        </p>
      </div>
    </div>
  );
}

function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/internal/family-table";
  }
  if (!raw.startsWith("/internal")) {
    return "/internal/family-table";
  }
  return raw;
}
