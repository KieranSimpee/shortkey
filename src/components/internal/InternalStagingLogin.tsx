"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Soft shared-password unlock for internal staging.
 * Sets cookie via /api/internal/staging-auth — not production auth.
 */
export function InternalStagingLogin() {
  const searchParams = useSearchParams();
  const nextPath = sanitizeNext(searchParams.get("next"));

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/internal/staging-auth", { method: "GET" });
        const data = (await res.json().catch(() => null)) as { configured?: boolean } | null;
        if (!cancelled) setConfigured(Boolean(data?.configured));
      } catch {
        if (!cancelled) setConfigured(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      const data = (await res.json().catch(() => null)) as
        | { error?: string; configured?: boolean }
        | null;
      if (!res.ok) {
        if (res.status === 503 || data?.configured === false) {
          setConfigured(false);
        }
        setError(data?.error ?? "Unlock failed.");
        setBusy(false);
        return;
      }
      // Hard navigation so the new httpOnly cookie is on the next document request.
      window.location.assign(nextPath);
    } catch {
      setError("Network error — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-ink/10 bg-white/95 px-6 py-8 shadow-[0_1px_0_rgba(140,130,252,0.08)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
          ShortKey · Internal staging
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
          Unlock staging
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Soft shared-secret gate for Family Table, Studio, and private magazine/showcase —
          not public launch, not 正式版 login.
        </p>

        {configured === false ? (
          <div
            className="mt-5 rounded-xl border border-amber-700/25 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
            role="status"
          >
            <p className="font-semibold">Vercel env missing — unlock cannot work yet</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[13px]">
              <li>
                Open Vercel → project <strong>shortkey</strong> → Settings → Environment
                Variables
              </li>
              <li>
                Add <code className="font-mono text-xs">FAMILY_TABLE_STAGING_PASSWORD</code>{" "}
                = your unlock password (Production + Preview)
              </li>
              <li>Redeploy Production (env changes need a new deploy)</li>
              <li>Return here and unlock again</li>
            </ol>
            <p className="mt-2 text-[12px] text-amber-900/80">
              Entering the password only on this form does not create the server secret.
            </p>
          </div>
        ) : null}

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
              disabled={configured === false}
            />
          </label>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || !password || configured === false}
            className="w-full rounded-full bg-brand px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Unlocking…" : configured === false ? "Blocked until Vercel env is set" : "Unlock"}
          </button>
        </form>

        <p className="mt-5 text-[11px] leading-relaxed text-ink-subtle">
          Server secret: <code className="font-mono">FAMILY_TABLE_STAGING_PASSWORD</code> (or{" "}
          <code className="font-mono">INTERNAL_STAGING_SECRET</code>) in Vercel /{" "}
          <code className="font-mono">.env.local</code>. Cookie:{" "}
          <code className="font-mono">sk_internal_staging</code>. Localhost family:dev bypasses
          this gate.
        </p>
      </div>
    </div>
  );
}

function isAllowedStagingNext(path: string): boolean {
  if (path.startsWith("/internal")) return true;
  if (path === "/showcase" || path.startsWith("/showcase/")) return true;
  if (path === "/magazine-demo" || path.startsWith("/magazine-demo/")) return true;
  if (
    path === "/control-center/magazine-demo" ||
    path.startsWith("/control-center/magazine-demo/")
  ) {
    return true;
  }
  return false;
}

function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/showcase/magazine";
  }
  // Strip hash/query for allow-check; preserve full path+search for redirect.
  const pathOnly = raw.split("?")[0] ?? raw;
  if (!isAllowedStagingNext(pathOnly)) {
    return "/showcase/magazine";
  }
  return raw;
}
