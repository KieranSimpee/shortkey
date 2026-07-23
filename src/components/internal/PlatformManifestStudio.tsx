"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ManifestPlatform = {
  name: string;
  domain: string;
  role: string;
  purpose: string;
  launchPhase: string;
  publicStatus: string;
  features: string[];
  heroCopy: string;
  ctaCopy: string;
  reviewStatus: string;
  version: string;
  lastUpdated: string;
};

export type PlatformManifest = {
  version: string;
  lastUpdated: string;
  reviewStatus: string;
  reviewWorkflow: string[];
  approvalGate: {
    approver: string;
    status: string;
    note: string;
  };
  platforms: ManifestPlatform[];
};

type Tab = "map" | "features" | "preview";

const TAB_LABEL: Record<Tab, string> = {
  map: "Platform Map",
  features: "Feature Registry",
  preview: "Manifest Preview",
};

const PHASE_TONE: Record<string, string> = {
  P0: "border-brand/40 bg-brand/10 text-brand",
  P1: "border-brand/25 bg-brand/5 text-brand-dark",
  "P2+": "border-ink/10 bg-ink/5 text-ink-subtle",
};

const STATUS_TONE: Record<string, string> = {
  "Coming Soon": "border-brand/40 bg-brand/10 text-brand",
  "Internal Only": "border-ink/20 bg-ink/5 text-ink",
  Planned: "border-brand/20 bg-brand/5 text-brand-dark",
  Hidden: "border-ink/10 bg-ink/5 text-ink-subtle",
};

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function PlatformManifestStudio({ manifest }: { manifest: PlatformManifest }) {
  const [tab, setTab] = useState<Tab>("map");
  const [query, setQuery] = useState("");

  const filteredPlatforms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manifest.platforms;
    return manifest.platforms.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q),
    );
  }, [manifest.platforms, query]);

  const featureRegistry = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const platform of manifest.platforms) {
      for (const feature of platform.features) {
        const list = map.get(feature) ?? [];
        list.push(platform.domain);
        map.set(feature, list);
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [manifest.platforms]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {/* Header + review gate */}
      <div className="rounded-2xl border border-ink/10 bg-white px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              shortkey.studio — Internal Control Center
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              Platform Manifest
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Single source of truth for all 12 ShortKey platforms · v{manifest.version} · updated{" "}
              {manifest.lastUpdated}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/internal/family-table"
              className="rounded-full border border-brand/30 bg-brand/5 px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-brand transition hover:border-brand hover:bg-brand/10"
            >
              Family Table v0.7 →
            </Link>
            <button
              type="button"
              onClick={() => downloadJson("shortkey-platform-manifest.json", manifest)}
              className="rounded-full bg-brand px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-dark"
            >
              Export JSON ↓
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <span className="font-semibold uppercase tracking-[0.1em]">Internal — Gor Gor Review required before push.</span>{" "}
          Approver: {manifest.approvalGate.approver} · Status:{" "}
          <span className="font-semibold">{manifest.approvalGate.status}</span> · No automatic
          publishing.
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] transition",
              tab === t
                ? "border-brand bg-brand text-white"
                : "border-ink/10 bg-white text-ink-muted hover:border-brand/30 hover:text-ink",
            )}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {/* Platform Map */}
      {tab === "map" ? (
        <div className="mt-5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, domain, or role…"
            className="mb-4 w-full max-w-sm rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40"
          />
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-ink/[0.03] text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-subtle">
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3">Public Status</th>
                  <th className="px-4 py-3">Review</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlatforms.map((p) => (
                  <tr key={p.domain} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">{p.domain}</td>
                    <td className="px-4 py-3 text-ink-muted">{p.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                          PHASE_TONE[p.launchPhase] ?? "border-ink/10 bg-ink/5 text-ink-subtle",
                        )}
                      >
                        {p.launchPhase}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                          STATUS_TONE[p.publicStatus] ?? "border-ink/10 bg-ink/5 text-ink-subtle",
                        )}
                      >
                        {p.publicStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{p.reviewStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Feature Registry */}
      {tab === "features" ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {featureRegistry.map(([feature, domains]) => (
            <div key={feature} className="rounded-xl border border-ink/10 bg-white p-4">
              <p className="text-sm font-semibold text-ink">{feature}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-ink-subtle">
                {domains.length} platform{domains.length === 1 ? "" : "s"}
              </p>
              <p className="mt-2 text-[12px] text-ink-muted">{domains.join(" · ")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Manifest Preview */}
      {tab === "preview" ? (
        <div className="mt-5 space-y-4">
          {manifest.platforms.map((p) => (
            <div key={p.domain} className="rounded-xl border border-ink/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {p.name} <span className="font-mono text-ink-subtle">({p.domain})</span>
                </p>
                <span className="text-[11px] uppercase tracking-[0.08em] text-ink-subtle">
                  v{p.version} · {p.lastUpdated}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">{p.purpose}</p>
              <div className="mt-2 grid gap-1 text-[12px] text-ink-subtle sm:grid-cols-2">
                <p>
                  Hero copy: <span className="text-ink-muted">{p.heroCopy}</span>
                </p>
                <p>
                  CTA copy: <span className="text-ink-muted">{p.ctaCopy}</span>
                </p>
              </div>
            </div>
          ))}

          <details className="rounded-xl border border-ink/10 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-ink">
              Raw JSON
            </summary>
            <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-ink/[0.04] p-3 text-[11px] text-ink-muted">
              {JSON.stringify(manifest, null, 2)}
            </pre>
          </details>
        </div>
      ) : null}
    </div>
  );
}
