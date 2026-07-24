"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createStudioSeed } from "@/lib/studio/seed";
import {
  STUDIO_ACTORS,
  STUDIO_LOCAL_STORAGE_KEY,
  STUDIO_PAGES,
  STUDIO_STATUSES,
  type BrandDNA,
  type StudioActor,
  type StudioApprovalLog,
  type StudioEntityType,
  type StudioPageId,
  type StudioState,
  type StudioStatus,
  type StudioStoreMeta,
  isStudioPageId,
} from "@/lib/studio/types";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";

/**
 * ShortKey Studio v0.1 — internal control center shell.
 * Prefer GET/POST /api/studio/state (file store in dev); localStorage fallback.
 * No production publish · no Vercel deploy buttons.
 */

const HONESTY_LS =
  "Browser localStorage fallback (`shortkey-studio-v01`) · this device only · not shared across browsers unless file API is up.";

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readLocal(): StudioState | null {
  try {
    const raw = localStorage.getItem(STUDIO_LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudioState;
  } catch {
    return null;
  }
}

function writeLocal(state: StudioState) {
  localStorage.setItem(STUDIO_LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function pageFromHash(): StudioPageId {
  if (typeof window === "undefined") return "dashboard";
  const h = window.location.hash.replace(/^#/, "");
  return isStudioPageId(h) ? h : "dashboard";
}

function statusTone(status: StudioStatus): string {
  switch (status) {
    case "APPROVED":
      return "bg-brand/15 text-brand-dark border-brand/25";
    case "IN_REVIEW":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "GOR_GOR_REVIEW":
      return "bg-violet-50 text-violet-800 border-violet-200";
    case "KIERAN_REVIEW_READY":
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "SCHEDULED":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "ARCHIVED":
    case "DO_NOT_USE":
      return "bg-ink/5 text-ink-subtle border-ink/10";
    case "ROLLBACK_READY":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-white text-ink-muted border-brand/15";
  }
}

function StatusPill({ status }: { status: StudioStatus }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide ${statusTone(status)}`}
    >
      {status}
    </span>
  );
}

export function StudioShell() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState<StudioPageId>("dashboard");
  const [state, setState] = useState<StudioState>(() => createStudioSeed());
  const [meta, setMeta] = useState<StudioStoreMeta | null>(null);
  const [storageLabel, setStorageLabel] = useState("Loading…");
  const [actor, setActor] = useState<StudioActor>("Kieran");
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [dangerOpen, setDangerOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState("");

  const persist = useCallback(
    async (next: StudioState, opts?: { silent?: boolean }) => {
      setState(next);
      writeLocal(next);
      setBusy(true);
      try {
        const res = await fetch("/api/studio/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: next }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            state: StudioState;
            meta: StudioStoreMeta;
          };
          setState(data.state);
          writeLocal(data.state);
          setMeta(data.meta);
          setStorageLabel(data.meta.honesty);
          if (!opts?.silent) {
            setFlash("Saved to Studio store");
          }
        } else {
          setStorageLabel(HONESTY_LS);
          setMeta(null);
          if (!opts?.silent) setFlash("Saved to localStorage only (API unavailable)");
        }
      } catch {
        setStorageLabel(HONESTY_LS);
        setMeta(null);
        if (!opts?.silent) setFlash("Saved to localStorage only (API unavailable)");
      } finally {
        setBusy(false);
        window.setTimeout(() => setFlash(null), 2200);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPage(pageFromHash());
      try {
        const res = await fetch("/api/studio/state", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as {
            state: StudioState;
            meta: StudioStoreMeta;
          };
          if (!cancelled) {
            setState(data.state);
            writeLocal(data.state);
            setMeta(data.meta);
            setStorageLabel(data.meta.honesty);
            setReady(true);
            return;
          }
        }
      } catch {
        /* fall through */
      }
      if (!cancelled) {
        const local = readLocal() ?? createStudioSeed();
        setState(local);
        writeLocal(local);
        setStorageLabel(HONESTY_LS);
        setReady(true);
      }
    })();

    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const go = (id: StudioPageId) => {
    setPage(id);
    window.location.hash = id;
  };

  const logApproval = (
    prev: StudioState,
    entry: Omit<StudioApprovalLog, "id" | "when" | "who"> & { who?: StudioActor },
  ): StudioApprovalLog => ({
    id: newId("log"),
    when: new Date().toISOString(),
    who: entry.who ?? actor,
    entityType: entry.entityType,
    entityId: entry.entityId,
    entityLabel: entry.entityLabel,
    fromStatus: entry.fromStatus,
    toStatus: entry.toStatus,
    note: entry.note,
  });

  const changeEntityStatus = (
    entityType: StudioEntityType,
    entityId: string,
    toStatus: StudioStatus,
    note: string,
  ) => {
    if (entityType === "rollbackRef") {
      setFlash("Rollback refs are read-only");
      window.setTimeout(() => setFlash(null), 2200);
      return;
    }
    const next: StudioState = structuredClone(state);
    let fromStatus: StudioStatus = "DRAFT";
    let entityLabel = entityId;

    const apply = <T extends { id: string; status: StudioStatus; updatedAt?: string; name?: string; title?: string; label?: string; hostname?: string }>(
      list: T[],
    ): T[] =>
      list.map((item) => {
        if (item.id !== entityId) return item;
        fromStatus = item.status;
        entityLabel =
          item.name || item.title || item.label || item.hostname || item.id;
        return {
          ...item,
          status: toStatus,
          ...(item.updatedAt !== undefined
            ? { updatedAt: new Date().toISOString() }
            : {}),
        };
      });

    if (entityType === "brandDna") {
      fromStatus = next.brandDna.status;
      entityLabel = next.brandDna.label;
      next.brandDna = {
        ...next.brandDna,
        status: toStatus,
        updatedAt: new Date().toISOString(),
      };
    } else if (entityType === "asset") next.assets = apply(next.assets);
    else if (entityType === "campaign") next.campaigns = apply(next.campaigns);
    else if (entityType === "domain") next.domains = apply(next.domains);
    else if (entityType === "country") next.countries = apply(next.countries);
    else if (entityType === "deploymentPlan")
      next.deploymentPlans = apply(next.deploymentPlans);

    next.approvalLogs = [
      logApproval(next, {
        entityType,
        entityId,
        entityLabel,
        fromStatus,
        toStatus,
        note: note.trim() || `Status → ${toStatus}`,
      }),
      ...next.approvalLogs,
    ].slice(0, 200);

    void persist(next);
  };

  const takeSnapshot = () => {
    const createdAt = new Date().toISOString();
    const { versionSnapshots: _drop, ...payload } = state;
    const snap = {
      id: newId("snap"),
      label: `Studio state ${createdAt}`,
      createdAt,
      createdBy: actor,
      note: noteDraft.trim() || "Manual snapshot of current Studio state",
      state: { ...payload, version: "0.1" as const },
    };
    const next: StudioState = {
      ...state,
      versionSnapshots: [snap, ...state.versionSnapshots].slice(0, 50),
      approvalLogs: [
        logApproval(state, {
          entityType: "versionSnapshot",
          entityId: snap.id,
          entityLabel: snap.label,
          fromStatus: "DRAFT",
          toStatus: "APPROVED",
          note: snap.note,
        }),
        ...state.approvalLogs,
      ].slice(0, 200),
    };
    setNoteDraft("");
    void persist(next);
    setFlash("Version snapshot recorded");
  };

  const resetToSeed = () => {
    if (resetConfirm !== "RESET") {
      setFlash('Type RESET to confirm');
      window.setTimeout(() => setFlash(null), 2200);
      return;
    }
    void persist(createStudioSeed());
    setResetConfirm("");
    setDangerOpen(false);
    setFlash("Studio reset to seed");
  };

  const counts = useMemo(
    () => ({
      domains: state.domains.length,
      countries: state.countries.length,
      assets: state.assets.length,
      campaigns: state.campaigns.length,
      plans: state.deploymentPlans.length,
      rollbacks: state.rollbackRefs.length,
      snapshots: state.versionSnapshots.length,
      logs: state.approvalLogs.length,
    }),
    [state],
  );

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-silk to-silk-dark/50 text-ink-muted">
        Loading ShortKey Studio…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-silk to-silk-dark/40 text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(185,179,255,0.22), transparent 55%), radial-gradient(ellipse 55% 35% at 0% 40%, rgba(237,234,255,0.5), transparent 50%)",
        }}
      />

      <div className="relative border-b border-brand/15 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-semibold tracking-tight text-ink">
              Internal Control Center — No Production Publish
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-dark">
              INTERNAL STAGING ONLY · Studio v0.1 · not production ready
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <label className="flex items-center gap-2 text-[11px] text-ink-muted">
              Acting as
              <select
                value={actor}
                onChange={(e) => setActor(e.target.value as StudioActor)}
                className="rounded-md border border-brand/20 bg-white px-2 py-1 font-medium text-ink"
              >
                {STUDIO_ACTORS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            {busy ? (
              <span className="font-mono text-[10px] text-ink-subtle">Saving…</span>
            ) : null}
            {flash ? (
              <span className="rounded-md bg-brand/10 px-2 py-1 text-[10px] text-brand-dark">
                {flash}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:py-8">
        <aside className="shrink-0 lg:w-56">
          <div className="rounded-2xl border border-brand/15 bg-white/80 p-4 shadow-[0_8px_24px_rgba(140,130,252,0.06)] backdrop-blur-sm">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              ShortKey Studio
            </p>
            <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
              Control Center
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-subtle">
              Source of truth · domains are future consumers
            </p>
            <nav className="mt-5 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Studio pages">
              {STUDIO_PAGES.map((p) => {
                const active = page === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => go(p.id)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-[12px] font-medium transition ${
                      active
                        ? "bg-brand/15 text-brand-dark"
                        : "text-ink-muted hover:bg-silk hover:text-ink"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </nav>
            <p className="mt-4 border-t border-brand/10 pt-3 text-[10px] leading-relaxed text-ink-subtle">
              {storageLabel}
              {meta ? (
                <>
                  {" "}
                  · mode <code className="font-mono">{meta.mode}</code>
                  {meta.shared ? " · shared:true" : " · shared:false"}
                </>
              ) : null}
            </p>
            <div className="mt-3 border-t border-rose-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setDangerOpen((o) => !o);
                  setResetConfirm("");
                }}
                className="text-[10px] font-medium uppercase tracking-[0.14em] text-rose-700/80 underline-offset-2 hover:underline"
              >
                {dangerOpen ? "Hide danger zone" : "Danger zone"}
              </button>
              {dangerOpen ? (
                <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/80 p-3">
                  <p className="text-[10px] leading-relaxed text-rose-900/80">
                    Reset Studio to seed defaults. Clears local edits and overwrites the file store if API is up. Type{" "}
                    <code className="font-mono font-semibold">RESET</code> to enable.
                  </p>
                  <input
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    placeholder="Type RESET"
                    className="mt-2 w-full rounded-md border border-rose-200 bg-white px-2 py-1.5 font-mono text-[11px] text-ink"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={resetToSeed}
                    disabled={resetConfirm !== "RESET"}
                    className="mt-2 w-full rounded-md border border-rose-300 bg-white px-2 py-1.5 text-[11px] font-medium text-rose-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reset to seed
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {page === "dashboard" ? (
            <DashboardPage state={state} counts={counts} onGo={go} />
          ) : null}
          {page === "brand-dna" ? (
            <BrandDnaPage
              dna={state.brandDna}
              actor={actor}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onStatus={(s, note) =>
                changeEntityStatus("brandDna", state.brandDna.id, s, note)
              }
            />
          ) : null}
          {page === "assets" ? (
            <RegistryPage
              title="Asset Library"
              subtitle="Metadata only — no binary upload / CDN in v0.1."
              rows={state.assets.map((a) => ({
                id: a.id,
                title: a.name,
                meta: `${a.kind} · domains: ${a.domainIds.length}`,
                status: a.status,
                notes: a.notes,
              }))}
              onStatus={(id, s, note) => changeEntityStatus("asset", id, s, note)}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
            />
          ) : null}
          {page === "campaigns" ? (
            <RegistryPage
              title="Campaign Manager"
              subtitle="Campaign registry + approval status. No scheduler automation."
              rows={state.campaigns.map((c) => ({
                id: c.id,
                title: c.name,
                meta: `domains ${c.domainIds.length} · countries ${c.countryIds.length} · assets ${c.assetIds.length}`,
                status: c.status,
                notes: c.notes,
              }))}
              onStatus={(id, s, note) => changeEntityStatus("campaign", id, s, note)}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
            />
          ) : null}
          {page === "domains" ? (
            <DomainsPage
              state={state}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onDomainStatus={(id, s, note) =>
                changeEntityStatus("domain", id, s, note)
              }
              onCountryStatus={(id, s, note) =>
                changeEntityStatus("country", id, s, note)
              }
            />
          ) : null}
          {page === "deployments" ? (
            <DeploymentsPage
              state={state}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onPlanStatus={(id, s, note) =>
                changeEntityStatus("deploymentPlan", id, s, note)
              }
            />
          ) : null}
          {page === "versions" ? (
            <VersionsPage
              state={state}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onSnapshot={takeSnapshot}
            />
          ) : null}
          {page === "preview" ? <PreviewPage state={state} /> : null}
        </main>
      </div>

      <footer className="relative border-t border-brand/10 py-8 text-center">
        <p className="text-xs text-ink-subtle">{POWERED_BY_AI_FAMILY}</p>
        <p className="mt-2 text-[10px] text-ink-subtle">
          Studio v0.1 · data structure + dashboard + preview + status + version history only
        </p>
      </footer>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand/15 bg-white/85 p-5 shadow-[0_8px_24px_rgba(140,130,252,0.06)] backdrop-blur-sm sm:p-7">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function StatusControls({
  current,
  onChange,
  noteDraft,
  setNoteDraft,
}: {
  current: StudioStatus;
  onChange: (s: StudioStatus, note: string) => void;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
}) {
  const [pick, setPick] = useState<StudioStatus>(current);
  useEffect(() => setPick(current), [current]);
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1 text-[11px] text-ink-muted">
        Note (approval log)
        <input
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="Optional note for log"
          className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-ink-muted">
        Status
        <select
          value={pick}
          onChange={(e) => setPick(e.target.value as StudioStatus)}
          className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-ink"
        >
          {STUDIO_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => onChange(pick, noteDraft)}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        Update status
      </button>
    </div>
  );
}

function DashboardPage({
  state,
  counts,
  onGo,
}: {
  state: StudioState;
  counts: Record<string, number>;
  onGo: (id: StudioPageId) => void;
}) {
  const reviewReady = [
    ...state.campaigns.filter(
      (c) =>
        c.status === "IN_REVIEW" ||
        c.status === "GOR_GOR_REVIEW" ||
        c.status === "KIERAN_REVIEW_READY" ||
        c.status === "APPROVED",
    ),
    ...state.domains.filter((d) => d.status === "APPROVED"),
  ];
  return (
    <Panel
      title="Studio Dashboard"
      subtitle="Internal source of truth. Domains consume later — Studio does not publish to production."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Domains", counts.domains, "domains"],
          ["Countries", counts.countries, "domains"],
          ["Assets", counts.assets, "assets"],
          ["Campaigns", counts.campaigns, "campaigns"],
          ["Deploy plans", counts.plans, "deployments"],
          ["Rollback refs", counts.rollbacks, "deployments"],
          ["Snapshots", counts.snapshots, "versions"],
          ["Approval logs", counts.logs, "versions"],
        ].map(([label, n, target]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => onGo(target as StudioPageId)}
            className="rounded-xl border border-brand/15 bg-silk/60 px-4 py-4 text-left transition hover:border-brand/30"
          >
            <span className="block font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
              {label}
            </span>
            <span className="mt-1 block font-display text-2xl font-semibold text-ink">
              {n}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">Brand DNA pulse</h2>
        <p className="mt-1 text-sm text-ink-muted">{state.brandDna.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusPill status={state.brandDna.status} />
          <button
            type="button"
            onClick={() => onGo("brand-dna")}
            className="text-[12px] text-brand-dark underline-offset-2 hover:underline"
          >
            Open Brand DNA Center
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">
          Ready for review (preview)
        </h2>
        <ul className="mt-3 space-y-2">
          {reviewReady.slice(0, 6).map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand/10 bg-white px-3 py-2 text-sm"
            >
              <span>
                {"name" in item ? item.name : "hostname" in item ? item.hostname : item.id}
              </span>
              <StatusPill status={item.status} />
            </li>
          ))}
          {reviewReady.length === 0 ? (
            <li className="text-sm text-ink-subtle">No IN_REVIEW / APPROVED items yet.</li>
          ) : null}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink">
          Recent approval log
        </h2>
        <ul className="mt-3 divide-y divide-brand/10 rounded-xl border border-brand/10 bg-white">
          {state.approvalLogs.slice(0, 5).map((log) => (
            <li key={log.id} className="px-4 py-3 text-[12px] leading-relaxed">
              <span className="font-medium text-ink">{log.who}</span>
              <span className="text-ink-subtle"> · {new Date(log.when).toLocaleString()}</span>
              <br />
              {log.entityLabel}: {log.fromStatus} → {log.toStatus}
              {log.note ? <span className="text-ink-muted"> — {log.note}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function BrandDnaPage({
  dna,
  actor,
  noteDraft,
  setNoteDraft,
  onStatus,
}: {
  dna: BrandDNA;
  actor: StudioActor;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onStatus: (s: StudioStatus, note: string) => void;
}) {
  return (
    <Panel
      title="Brand DNA Center"
      subtitle="Expanded from Studio P0 DNA Control Room. One DNA. Many doors."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill status={dna.status} />
        <span className="text-[11px] text-ink-subtle">
          Updated {new Date(dna.updatedAt).toLocaleString()} · actor {actor}
        </span>
      </div>
      <StatusControls
        current={dna.status}
        onChange={onStatus}
        noteDraft={noteDraft}
        setNoteDraft={setNoteDraft}
      />

      <h2 className="mt-8 font-display text-lg font-semibold text-ink">{dna.tagline}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {dna.points.map((point, i) => (
          <li
            key={point}
            className="rounded-xl border border-brand/15 bg-silk/50 px-4 py-3"
          >
            <span className="mb-1 block font-mono text-[10px] text-ink-subtle">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-sm font-semibold text-ink">{point}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-base font-semibold text-ink">
        Approved copy blocks
      </h2>
      <div className="mt-4 space-y-3">
        {dna.copyBlocks.map((b) => (
          <article
            key={b.label}
            className="rounded-xl border border-brand/15 bg-white px-4 py-4"
          >
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              {b.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink">{b.text}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-10 font-display text-base font-semibold text-ink">Build order</h2>
      <ol className="mt-4 space-y-2">
        {dna.buildOrder.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-xl border border-brand/15 bg-white px-4 py-3 text-sm"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/10 bg-silk font-mono text-[11px]">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function RegistryPage({
  title,
  subtitle,
  rows,
  onStatus,
  noteDraft,
  setNoteDraft,
}: {
  title: string;
  subtitle: string;
  rows: {
    id: string;
    title: string;
    meta: string;
    status: StudioStatus;
    notes: string;
  }[];
  onStatus: (id: string, s: StudioStatus, note: string) => void;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
}) {
  const [activeId, setActiveId] = useState(rows[0]?.id ?? "");
  const active = rows.find((r) => r.id === activeId) ?? rows[0];
  return (
    <Panel title={title} subtitle={subtitle}>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className={`rounded-xl border px-4 py-4 ${
              active?.id === row.id
                ? "border-brand/40 bg-brand/5"
                : "border-brand/15 bg-white"
            }`}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => setActiveId(row.id)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  {row.title}
                </span>
                <StatusPill status={row.status} />
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-subtle">{row.meta}</p>
              {row.notes ? (
                <p className="mt-2 text-[12px] text-ink-muted">{row.notes}</p>
              ) : null}
            </button>
            {active?.id === row.id ? (
              <StatusControls
                current={row.status}
                onChange={(s, note) => onStatus(row.id, s, note)}
                noteDraft={noteDraft}
                setNoteDraft={setNoteDraft}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function DomainsPage({
  state,
  noteDraft,
  setNoteDraft,
  onDomainStatus,
  onCountryStatus,
}: {
  state: StudioState;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onDomainStatus: (id: string, s: StudioStatus, note: string) => void;
  onCountryStatus: (id: string, s: StudioStatus, note: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Panel
        title="Domain Manager"
        subtitle="Domain Registry — seed from Studio P0 map. Records + status only."
      >
        <ul className="divide-y divide-brand/10 overflow-hidden rounded-xl border border-brand/15 bg-white">
          {state.domains.map((d) => (
            <li key={d.id} className="px-4 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[13px] font-medium text-ink">
                    {d.hostname}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{d.purpose}</p>
                  {d.notes ? (
                    <p className="mt-1 text-[11px] text-ink-subtle">{d.notes}</p>
                  ) : null}
                </div>
                <StatusPill status={d.status} />
              </div>
              <StatusControls
                current={d.status}
                onChange={(s, note) => onDomainStatus(d.id, s, note)}
                noteDraft={noteDraft}
                setNoteDraft={setNoteDraft}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Country Registry"
        subtitle="Placeholders: JP / KR / TW-HK (繁) / Global."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {state.countries.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-brand/15 bg-white px-4 py-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {c.label}
                  </p>
                  <p className="font-mono text-[11px] text-ink-subtle">
                    {c.code} · {c.localeHint}
                  </p>
                </div>
                <StatusPill status={c.status} />
              </div>
              <StatusControls
                current={c.status}
                onChange={(s, note) => onCountryStatus(c.id, s, note)}
                noteDraft={noteDraft}
                setNoteDraft={setNoteDraft}
              />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function DeploymentsPage({
  state,
  noteDraft,
  setNoteDraft,
  onPlanStatus,
}: {
  state: StudioState;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onPlanStatus: (id: string, s: StudioStatus, note: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Panel
        title="Deployment Plans"
        subtitle="Records only. No Vercel / production deploy actions in Studio v0.1."
      >
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          There is no “Deploy to production” button. Changing status updates the registry + approval log only.
        </p>
        <ul className="space-y-3">
          {state.deploymentPlans.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-brand/15 bg-white px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  {p.title}
                </span>
                <StatusPill status={p.status} />
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-subtle">
                domains {p.domainIds.length} · campaigns {p.campaignIds.length}
                {p.scheduledFor
                  ? ` · scheduled ${new Date(p.scheduledFor).toLocaleDateString()}`
                  : ""}
              </p>
              {p.notes ? (
                <p className="mt-2 text-[12px] text-ink-muted">{p.notes}</p>
              ) : null}
              <StatusControls
                current={p.status}
                onChange={(s, note) => onPlanStatus(p.id, s, note)}
                noteDraft={noteDraft}
                setNoteDraft={setNoteDraft}
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Rollback references"
        subtitle="View only — no edit / create / delete in v0.1. Reference records only; no automated rollback."
      >
        <p className="mb-3 rounded-lg border border-brand/15 bg-silk/50 px-3 py-2 text-[11px] text-ink-muted">
          Read-only. Status mutations are disabled for rollback refs.
        </p>
        <ul className="space-y-3">
          {state.rollbackRefs.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-brand/15 bg-white px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  {r.title}
                </span>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-subtle">
                snapshot {r.snapshotId ?? "—"} · domains {r.domainIds.length}
              </p>
              {r.notes ? (
                <p className="mt-2 text-[12px] text-ink-muted">{r.notes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function VersionsPage({
  state,
  noteDraft,
  setNoteDraft,
  onSnapshot,
}: {
  state: StudioState;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onSnapshot: () => void;
}) {
  return (
    <Panel
      title="Version History"
      subtitle="Snapshot current Studio state into StudioVersionSnapshot records."
    >
      <div className="rounded-xl border border-brand/15 bg-silk/40 p-4">
        <label className="flex flex-col gap-1 text-[11px] text-ink-muted">
          Snapshot note
          <input
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="What changed?"
            className="rounded-md border border-brand/20 bg-white px-3 py-2 text-sm text-ink"
          />
        </label>
        <button
          type="button"
          onClick={onSnapshot}
          className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Create Snapshot
        </button>
      </div>

      <h2 className="mt-8 font-display text-base font-semibold text-ink">
        Snapshots
      </h2>
      <ul className="mt-3 space-y-2">
        {state.versionSnapshots.length === 0 ? (
          <li className="text-sm text-ink-subtle">No snapshots yet.</li>
        ) : (
          state.versionSnapshots.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-brand/15 bg-white px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-ink">{s.label}</span>
                <span className="font-mono text-[10px] text-ink-subtle">
                  {s.createdBy} · {new Date(s.createdAt).toLocaleString()}
                </span>
              </div>
              {s.note ? (
                <p className="mt-1 text-[12px] text-ink-muted">{s.note}</p>
              ) : null}
              <p className="mt-1 font-mono text-[10px] text-ink-subtle">
                payload: {s.state.domains.length} domains · {s.state.campaigns.length}{" "}
                campaigns · {s.state.assets.length} assets
              </p>
            </li>
          ))
        )}
      </ul>

      <h2 className="mt-8 font-display text-base font-semibold text-ink">
        Approval log
      </h2>
      <ul className="mt-3 divide-y divide-brand/10 rounded-xl border border-brand/10 bg-white">
        {state.approvalLogs.map((log) => (
          <li key={log.id} className="px-4 py-3 text-[12px] leading-relaxed">
            <span className="font-medium">{log.who}</span>
            <span className="text-ink-subtle">
              {" "}
              · {new Date(log.when).toLocaleString()}
            </span>
            <br />
            <span className="text-ink">
              [{log.entityType}] {log.entityLabel}: {log.fromStatus} → {log.toStatus}
            </span>
            {log.note ? (
              <span className="text-ink-muted"> — {log.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PreviewPage({ state }: { state: StudioState }) {
  const approvedDomains = state.domains.filter(
    (d) => d.status === "APPROVED" || d.status === "IN_REVIEW",
  );
  const reviewCampaigns = state.campaigns.filter(
    (c) =>
      c.status === "IN_REVIEW" ||
      c.status === "GOR_GOR_REVIEW" ||
      c.status === "KIERAN_REVIEW_READY" ||
      c.status === "APPROVED" ||
      c.status === "SCHEDULED",
  );
  return (
    <Panel
      title="Preview Mode"
      subtitle="Cards summarizing DNA + domains + campaigns ready for review. Not a public publish preview."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-brand/20 bg-gradient-to-br from-white to-silk p-5">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Brand DNA
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            {state.brandDna.tagline}
          </h2>
          <div className="mt-3">
            <StatusPill status={state.brandDna.status} />
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
            {state.brandDna.points.slice(0, 4).map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-brand/20 bg-white p-5">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Domains for review
          </p>
          <ul className="mt-4 space-y-2">
            {approvedDomains.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="font-mono text-[12px]">{d.hostname}</span>
                <StatusPill status={d.status} />
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-brand/20 bg-white p-5 lg:col-span-2">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Campaigns ready for review
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {reviewCampaigns.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-brand/10 bg-silk/50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-ink">
                    {c.name}
                  </span>
                  <StatusPill status={c.status} />
                </div>
                <p className="mt-1 font-mono text-[10px] text-ink-subtle">
                  {c.domainIds.length} domains · {c.countryIds.length} countries ·{" "}
                  {c.assetIds.length} assets
                </p>
              </div>
            ))}
            {reviewCampaigns.length === 0 ? (
              <p className="text-sm text-ink-subtle">No campaigns in review ladder yet.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-brand/15 bg-white p-5 lg:col-span-2">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            Countries
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.countries.map((c) => (
              <span
                key={c.id}
                className="rounded-lg border border-brand/15 bg-silk/60 px-3 py-1.5 text-[12px]"
              >
                {c.code} · {c.label}
              </span>
            ))}
          </div>
        </article>
      </div>
    </Panel>
  );
}
