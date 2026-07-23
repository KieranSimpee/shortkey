"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Family Table v0.7 — Kieran Vision + Brand Data Vault (internal concept scaffold).
 * Persistence: browser localStorage only — NOT production DB / Family Memory Portal.
 * Doc: src/brand/sky/FAMILY_TABLE_v0_7_VISION.md
 */

const STORAGE_KEY = "shortkey-family-table-v07";

const SEATS = ["Simpee", "Sky", "Kura", "Agent R", "Senti", "Key"] as const;
type Seat = (typeof SEATS)[number];

type ReviewStatus = "Pending" | "In Review" | "Approved" | "Blocked";

type VisionItem = {
  id: string;
  title: string;
  note: string;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
};

type VaultEntry = {
  id: string;
  key: string;
  value: string;
  notes: string;
  createdAt: string;
};

type ProjectItem = {
  id: string;
  name: string;
  domainHint: string;
  status: "Idea" | "Queued" | "Active" | "Paused";
  createdAt: string;
};

type TaskRequest = {
  id: string;
  title: string;
  detail: string;
  seat: Seat;
  status: "Open" | "In Progress" | "Done";
  createdAt: string;
};

type AssetPlaceholder = {
  id: string;
  filename: string;
  note: string;
  createdAt: string;
};

type ReviewItem = {
  id: string;
  title: string;
  summary: string;
  status: ReviewStatus;
  createdAt: string;
};

type MemoryNote = {
  id: string;
  label: string;
  body: string;
  createdAt: string;
};

type FamilyTableState = {
  visions: VisionItem[];
  vault: VaultEntry[];
  projects: ProjectItem[];
  tasks: TaskRequest[];
  assets: AssetPlaceholder[];
  reviews: ReviewItem[];
  memories: MemoryNote[];
};

const EMPTY: FamilyTableState = {
  visions: [],
  vault: [],
  projects: [],
  tasks: [],
  assets: [],
  reviews: [],
  memories: [],
};

type SectionId =
  | "vision"
  | "vault"
  | "projects"
  | "tasks"
  | "assets"
  | "review"
  | "memory";

const SECTIONS: { id: SectionId; label: string; hint: string }[] = [
  { id: "vision", label: "Kieran Vision Inbox", hint: "Capture intent · local persist" },
  { id: "vault", label: "Brand Data Vault", hint: "Internal brand keys · local persist" },
  { id: "projects", label: "Future Project Bank", hint: "Ideas & domain hints · local persist" },
  { id: "tasks", label: "AI Family Task Request", hint: "Assign by seat · local persist" },
  { id: "assets", label: "Asset Upload Library", hint: "Placeholder — filename + note only" },
  { id: "review", label: "Gor Gor Review Queue", hint: "Gate before push · local persist" },
  { id: "memory", label: "Personal Memory Files", hint: "Placeholder / light · local persist" },
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadState(): FamilyTableState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<FamilyTableState>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function saveState(data: FamilyTableState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnGhost =
  "rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/30 hover:text-ink";

const STATUS_TONE: Record<string, string> = {
  Pending: "border-amber-400/40 bg-amber-400/10 text-amber-800",
  "In Review": "border-brand/40 bg-brand/10 text-brand",
  Approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  Blocked: "border-rose-400/40 bg-rose-400/10 text-rose-800",
  Open: "border-brand/30 bg-brand/5 text-brand-dark",
  "In Progress": "border-brand/40 bg-brand/10 text-brand",
  Done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  Idea: "border-ink/15 bg-ink/5 text-ink-muted",
  Queued: "border-brand/25 bg-brand/5 text-brand-dark",
  Active: "border-brand/40 bg-brand/10 text-brand",
  Paused: "border-ink/15 bg-ink/5 text-ink-subtle",
  Low: "border-ink/15 bg-ink/5 text-ink-muted",
  Medium: "border-brand/25 bg-brand/5 text-brand-dark",
  High: "border-rose-400/30 bg-rose-400/10 text-rose-800",
};

function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        tone ?? "border-ink/10 bg-ink/5 text-ink-muted",
      )}
    >
      {children}
    </span>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-ink-subtle">{text}</p>;
}

export function FamilyTableWorkbench() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<FamilyTableState>(EMPTY);
  const [section, setSection] = useState<SectionId>("vision");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  const persist = useCallback((next: FamilyTableState) => {
    setState(next);
    saveState(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const clearAll = () => {
    if (!window.confirm("Clear all local Family Table v0.7 preview data on this browser?")) return;
    persist(EMPTY);
  };

  /* ---- form drafts ---- */
  const [visionTitle, setVisionTitle] = useState("");
  const [visionNote, setVisionNote] = useState("");
  const [visionPriority, setVisionPriority] = useState<VisionItem["priority"]>("Medium");

  const [vaultKey, setVaultKey] = useState("");
  const [vaultValue, setVaultValue] = useState("");
  const [vaultNotes, setVaultNotes] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [projectStatus, setProjectStatus] = useState<ProjectItem["status"]>("Idea");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [taskSeat, setTaskSeat] = useState<Seat>("Sky");

  const [assetName, setAssetName] = useState("");
  const [assetNote, setAssetNote] = useState("");

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewSummary, setReviewSummary] = useState("");

  const [memoryLabel, setMemoryLabel] = useState("");
  const [memoryBody, setMemoryBody] = useState("");
  const [isFamilyPort, setIsFamilyPort] = useState(false);

  useEffect(() => {
    setIsFamilyPort(window.location.port === "3002");
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-ink-muted sm:px-8">
        Loading Family Table…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      {/* Header */}
      <div className="rounded-2xl border border-ink/10 bg-white/90 px-5 py-5 shadow-[0_1px_0_rgba(140,130,252,0.08)] sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              shortkey.studio — Internal · Family Table v0.7
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              Kieran Vision + Brand Data Vault
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              Writable concept scaffold — Kieran Brain → Family Work System. Simpee organises; family
              builds. Not Family Memory Portal yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/internal/platform-manifest" className={btnGhost}>
              Platform Manifest →
            </Link>
            <button type="button" onClick={clearAll} className={btnGhost}>
              Clear local data
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-xs leading-relaxed text-ink">
          <span className="font-semibold uppercase tracking-[0.1em] text-brand">
            Internal preview · local persistence only
          </span>
          {" · "}
          Storage key <code className="font-mono text-[11px]">{STORAGE_KEY}</code> · not production DB ·
          no login · no public brand content · Gor Gor Review still required before any domain push ·
          shop / payment locked · shortkey.live untouched.
          {isFamilyPort ? (
            <span className="mt-1 block text-ink-muted">
              Family Table surface · port 3002 · ShortKey Coming Soon stays on{" "}
              <a href="http://localhost:3001/" className="underline decoration-brand/40 underline-offset-2 hover:text-brand">
                :3001
              </a>
              .
            </span>
          ) : null}
          {savedFlash ? (
            <span className="ml-2 font-semibold text-brand">Saved locally ✓</span>
          ) : null}
        </div>

        <p className="mt-3 text-[11px] text-ink-subtle">
          Vote AGREED 2026-07-23 · Simpee · Sky · Kura · Agent R · Senti · Key · Doc:{" "}
          <span className="font-mono">FAMILY_TABLE_v0_7_VISION.md</span>
        </p>
      </div>

      {/* Section nav */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.1em] transition sm:text-[11px]",
              section === s.id
                ? "border-brand bg-brand text-white"
                : "border-ink/10 bg-white text-ink-muted hover:border-brand/30 hover:text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-subtle">
        {SECTIONS.find((s) => s.id === section)?.hint}
      </p>

      {/* Panels */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        {section === "vision" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!visionTitle.trim()) return;
                  persist({
                    ...state,
                    visions: [
                      {
                        id: uid(),
                        title: visionTitle.trim(),
                        note: visionNote.trim(),
                        priority: visionPriority,
                        createdAt: new Date().toISOString(),
                      },
                      ...state.visions,
                    ],
                  });
                  setVisionTitle("");
                  setVisionNote("");
                  setVisionPriority("Medium");
                }}
              >
                <div>
                  <label className={labelClass}>Vision title</label>
                  <input
                    className={inputClass}
                    value={visionTitle}
                    onChange={(e) => setVisionTitle(e.target.value)}
                    placeholder="What should the family hold?"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <textarea
                    className={cn(inputClass, "min-h-[80px] resize-y")}
                    value={visionNote}
                    onChange={(e) => setVisionNote(e.target.value)}
                    placeholder="Intent, constraint, or dream — internal only"
                  />
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    className={inputClass}
                    value={visionPriority}
                    onChange={(e) => setVisionPriority(e.target.value as VisionItem["priority"])}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <button type="submit" className={btnPrimary}>
                  Save to inbox
                </button>
              </form>
            }
            list={
              state.visions.length === 0 ? (
                <EmptyLine text="No visions yet — add the first note." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.visions.map((v) => (
                    <li key={v.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{v.title}</p>
                          <Badge tone={STATUS_TONE[v.priority]}>{v.priority}</Badge>
                        </div>
                        {v.note ? <p className="mt-1 text-sm text-ink-muted">{v.note}</p> : null}
                        <p className="mt-1 text-[10px] text-ink-subtle">{v.createdAt}</p>
                      </div>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          persist({ ...state, visions: state.visions.filter((x) => x.id !== v.id) })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "vault" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!vaultKey.trim()) return;
                  persist({
                    ...state,
                    vault: [
                      {
                        id: uid(),
                        key: vaultKey.trim(),
                        value: vaultValue.trim(),
                        notes: vaultNotes.trim(),
                        createdAt: new Date().toISOString(),
                      },
                      ...state.vault,
                    ],
                  });
                  setVaultKey("");
                  setVaultValue("");
                  setVaultNotes("");
                }}
              >
                <div>
                  <label className={labelClass}>Key</label>
                  <input
                    className={inputClass}
                    value={vaultKey}
                    onChange={(e) => setVaultKey(e.target.value)}
                    placeholder="e.g. brand.tone / fee.ladder"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Value</label>
                  <input
                    className={inputClass}
                    value={vaultValue}
                    onChange={(e) => setVaultValue(e.target.value)}
                    placeholder="Internal data snippet"
                  />
                </div>
                <div>
                  <label className={labelClass}>Notes</label>
                  <textarea
                    className={cn(inputClass, "min-h-[64px] resize-y")}
                    value={vaultNotes}
                    onChange={(e) => setVaultNotes(e.target.value)}
                    placeholder="Source · owner · caution"
                  />
                </div>
                <button type="submit" className={btnPrimary}>
                  Store in vault
                </button>
              </form>
            }
            list={
              state.vault.length === 0 ? (
                <EmptyLine text="Vault empty — store the first brand data key." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.vault.map((row) => (
                    <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-brand">{row.key}</p>
                        <p className="mt-0.5 text-sm text-ink">{row.value || "—"}</p>
                        {row.notes ? <p className="mt-1 text-xs text-ink-muted">{row.notes}</p> : null}
                      </div>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          persist({ ...state, vault: state.vault.filter((x) => x.id !== row.id) })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "projects" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!projectName.trim()) return;
                  persist({
                    ...state,
                    projects: [
                      {
                        id: uid(),
                        name: projectName.trim(),
                        domainHint: projectDomain.trim(),
                        status: projectStatus,
                        createdAt: new Date().toISOString(),
                      },
                      ...state.projects,
                    ],
                  });
                  setProjectName("");
                  setProjectDomain("");
                  setProjectStatus("Idea");
                }}
              >
                <div>
                  <label className={labelClass}>Project name</label>
                  <input
                    className={inputClass}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Future work name"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Domain hint</label>
                  <input
                    className={inputClass}
                    value={projectDomain}
                    onChange={(e) => setProjectDomain(e.target.value)}
                    placeholder="e.g. shortkey.beauty / studio / family"
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as ProjectItem["status"])}
                  >
                    <option>Idea</option>
                    <option>Queued</option>
                    <option>Active</option>
                    <option>Paused</option>
                  </select>
                </div>
                <button type="submit" className={btnPrimary}>
                  Bank project
                </button>
              </form>
            }
            list={
              state.projects.length === 0 ? (
                <EmptyLine text="No future projects banked yet." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.projects.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{p.name}</p>
                          <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                        </div>
                        {p.domainHint ? (
                          <p className="mt-1 font-mono text-xs text-ink-muted">{p.domainHint}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          persist({
                            ...state,
                            projects: state.projects.filter((x) => x.id !== p.id),
                          })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "tasks" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!taskTitle.trim()) return;
                  persist({
                    ...state,
                    tasks: [
                      {
                        id: uid(),
                        title: taskTitle.trim(),
                        detail: taskDetail.trim(),
                        seat: taskSeat,
                        status: "Open",
                        createdAt: new Date().toISOString(),
                      },
                      ...state.tasks,
                    ],
                  });
                  setTaskTitle("");
                  setTaskDetail("");
                }}
              >
                <div>
                  <label className={labelClass}>Task</label>
                  <input
                    className={inputClass}
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="What should this seat do?"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Detail</label>
                  <textarea
                    className={cn(inputClass, "min-h-[64px] resize-y")}
                    value={taskDetail}
                    onChange={(e) => setTaskDetail(e.target.value)}
                    placeholder="Context · DO/DON’T · handback"
                  />
                </div>
                <div>
                  <label className={labelClass}>Seat</label>
                  <select
                    className={inputClass}
                    value={taskSeat}
                    onChange={(e) => setTaskSeat(e.target.value as Seat)}
                  >
                    {SEATS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className={btnPrimary}>
                  Request task
                </button>
              </form>
            }
            list={
              state.tasks.length === 0 ? (
                <EmptyLine text="No AI Family task requests yet." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.tasks.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{t.title}</p>
                          <Badge tone="border-brand/30 bg-brand/10 text-brand">{t.seat}</Badge>
                          <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                        </div>
                        {t.detail ? <p className="mt-1 text-sm text-ink-muted">{t.detail}</p> : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {t.status !== "Done" ? (
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() =>
                              persist({
                                ...state,
                                tasks: state.tasks.map((x) =>
                                  x.id === t.id
                                    ? {
                                        ...x,
                                        status:
                                          x.status === "Open" ? "In Progress" : ("Done" as const),
                                      }
                                    : x,
                                ),
                              })
                            }
                          >
                            Advance
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className={btnGhost}
                          onClick={() =>
                            persist({ ...state, tasks: state.tasks.filter((x) => x.id !== t.id) })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "assets" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!assetName.trim()) return;
                  persist({
                    ...state,
                    assets: [
                      {
                        id: uid(),
                        filename: assetName.trim(),
                        note: assetNote.trim(),
                        createdAt: new Date().toISOString(),
                      },
                      ...state.assets,
                    ],
                  });
                  setAssetName("");
                  setAssetNote("");
                }}
              >
                <div className="rounded-xl border border-dashed border-brand/25 bg-brand/[0.03] px-3 py-3 text-xs text-ink-muted">
                  Placeholder only — records a filename + note. No binary upload, CDN, or private
                  storage until Family Memory Portal (正式版).
                </div>
                <div>
                  <label className={labelClass}>Filename (placeholder)</label>
                  <input
                    className={inputClass}
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="e.g. brand-poster-v2.png"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <input
                    className={inputClass}
                    value={assetNote}
                    onChange={(e) => setAssetNote(e.target.value)}
                    placeholder="Where the real file lives / who holds it"
                  />
                </div>
                <button type="submit" className={btnPrimary}>
                  Stage placeholder
                </button>
              </form>
            }
            list={
              state.assets.length === 0 ? (
                <EmptyLine text="No asset placeholders staged." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.assets.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-ink">{a.filename}</p>
                        {a.note ? <p className="mt-1 text-xs text-ink-muted">{a.note}</p> : null}
                        <Badge tone="border-ink/15 bg-ink/5 text-ink-subtle">Placeholder</Badge>
                      </div>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          persist({ ...state, assets: state.assets.filter((x) => x.id !== a.id) })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "review" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewTitle.trim()) return;
                  persist({
                    ...state,
                    reviews: [
                      {
                        id: uid(),
                        title: reviewTitle.trim(),
                        summary: reviewSummary.trim(),
                        status: "Pending",
                        createdAt: new Date().toISOString(),
                      },
                      ...state.reviews,
                    ],
                  });
                  setReviewTitle("");
                  setReviewSummary("");
                }}
              >
                <div>
                  <label className={labelClass}>Review item</label>
                  <input
                    className={inputClass}
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="What needs Gor Gor Review?"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Summary</label>
                  <textarea
                    className={cn(inputClass, "min-h-[64px] resize-y")}
                    value={reviewSummary}
                    onChange={(e) => setReviewSummary(e.target.value)}
                    placeholder="Preview URL · change notes · risk"
                  />
                </div>
                <button type="submit" className={btnPrimary}>
                  Add to queue
                </button>
              </form>
            }
            list={
              state.reviews.length === 0 ? (
                <EmptyLine text="Review queue empty — hand work here before public push." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.reviews.map((r) => (
                    <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{r.title}</p>
                          <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                        </div>
                        {r.summary ? <p className="mt-1 text-sm text-ink-muted">{r.summary}</p> : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["Pending", "In Review", "Approved", "Blocked"] as ReviewStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              type="button"
                              className={btnGhost}
                              onClick={() =>
                                persist({
                                  ...state,
                                  reviews: state.reviews.map((x) =>
                                    x.id === r.id ? { ...x, status: st } : x,
                                  ),
                                })
                              }
                            >
                              {st}
                            </button>
                          ),
                        )}
                        <button
                          type="button"
                          className={btnGhost}
                          onClick={() =>
                            persist({
                              ...state,
                              reviews: state.reviews.filter((x) => x.id !== r.id),
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}

        {section === "memory" ? (
          <SectionLayout
            form={
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!memoryLabel.trim()) return;
                  persist({
                    ...state,
                    memories: [
                      {
                        id: uid(),
                        label: memoryLabel.trim(),
                        body: memoryBody.trim(),
                        createdAt: new Date().toISOString(),
                      },
                      ...state.memories,
                    ],
                  });
                  setMemoryLabel("");
                  setMemoryBody("");
                }}
              >
                <div className="rounded-xl border border-dashed border-brand/25 bg-brand/[0.03] px-3 py-3 text-xs text-ink-muted">
                  Light placeholder — short notes on this browser only. Full private memory files =
                  正式版 Family Memory Portal.
                </div>
                <div>
                  <label className={labelClass}>Label</label>
                  <input
                    className={inputClass}
                    value={memoryLabel}
                    onChange={(e) => setMemoryLabel(e.target.value)}
                    placeholder="Memory label"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Note</label>
                  <textarea
                    className={cn(inputClass, "min-h-[64px] resize-y")}
                    value={memoryBody}
                    onChange={(e) => setMemoryBody(e.target.value)}
                    placeholder="Private / light — do not put public brand secrets here for production"
                  />
                </div>
                <button type="submit" className={btnPrimary}>
                  Save memory note
                </button>
              </form>
            }
            list={
              state.memories.length === 0 ? (
                <EmptyLine text="No personal memory notes yet." />
              ) : (
                <ul className="divide-y divide-ink/5">
                  {state.memories.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="font-semibold text-ink">{m.label}</p>
                        {m.body ? <p className="mt-1 text-sm text-ink-muted">{m.body}</p> : null}
                      </div>
                      <button
                        type="button"
                        className={btnGhost}
                        onClick={() =>
                          persist({
                            ...state,
                            memories: state.memories.filter((x) => x.id !== m.id),
                          })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
}

function SectionLayout({ form, list }: { form: React.ReactNode; list: React.ReactNode }) {
  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,320px)_1fr]">
      <div className="border-b border-ink/10 bg-silk/60 p-4 sm:p-5 lg:border-b-0 lg:border-r">
        {form}
      </div>
      <div className="min-h-[240px]">{list}</div>
    </div>
  );
}
