"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { uid } from "@/components/internal/FamilyChatPanel";

/**
 * Family Cabinet (一人一格櫃桶) — Living Room shared materials + homework handoff.
 * Nested under `shortkey-family-table-v08`.cabinet (localStorage only · link index only).
 */

export const CABINET_WARNING =
  "Internal staging only · localStorage only · link index only · no sensitive file upload yet.";

export type CabinetDrawerId =
  | "kieran-vision"
  | "gorgor-review"
  | "sky-video"
  | "senti-creative"
  | "kura-structure"
  | "agent-r-evidence";

export const CABINET_STATUSES = [
  "KIERAN DROPPED",
  "ASSIGNED TO ROOM",
  "IN PROGRESS",
  "SUBMITTED IN CABINET",
  "WAITING FOR GOR GOR",
  "GOR GOR REVIEWING",
  "KIERAN REVIEW READY",
  "APPROVED",
  "ARCHIVED",
  "DO NOT USE",
  "BLOCKED",
] as const;

export type CabinetStatus = (typeof CABINET_STATUSES)[number];

export const GOR_GOR_REVIEW_STATES = [
  "NONE",
  "WAITING",
  "REVIEWING",
  "APPROVED",
  "BLOCKED",
  "NOT REQUIRED",
] as const;

export type GorGorReviewState = (typeof GOR_GOR_REVIEW_STATES)[number];

export const CABINET_ACTORS = [
  "Kieran",
  "Simpee/Gor Gor",
  "Sky",
  "Senti",
  "Kura",
  "Agent R",
  "Key",
] as const;

export type CabinetActor = (typeof CABINET_ACTORS)[number];

/** Statuses that require Gor Gor or Kieran — Senti organise ≠ approve */
const GATE_STATUSES: CabinetStatus[] = [
  "WAITING FOR GOR GOR",
  "GOR GOR REVIEWING",
  "KIERAN REVIEW READY",
  "APPROVED",
];

export function canSetCabinetStatus(actor: CabinetActor, status: CabinetStatus): boolean {
  if (!GATE_STATUSES.includes(status)) return true;
  return actor === "Kieran" || actor === "Simpee/Gor Gor";
}

export type CabinetItem = {
  id: string;
  item_title: string;
  file_or_reference_link: string;
  item_type: string;
  placed_by: string;
  assigned_to: string;
  related_room: string;
  status: CabinetStatus;
  version_date: string;
  sensitivity_level: string;
  usage_note: string;
  evidence_link: string;
  gor_gor_review_state: GorGorReviewState;
  createdAt: string;
  updatedAt: string;
};

export type DrawerMeta = {
  id: CabinetDrawerId;
  name: string;
  owner: string;
  focus: string;
  relatedRoom: string;
};

export const CABINET_DRAWERS: DrawerMeta[] = [
  {
    id: "kieran-vision",
    name: "Kieran Vision Drawer",
    owner: "Kieran",
    focus: "Vision notes · future projects · brand direction · personal instructions",
    relatedRoom: "Kieran Vision Room",
  },
  {
    id: "gorgor-review",
    name: "Gor Gor Review Drawer",
    owner: "Simpee (Gor Gor)",
    focus: "Waiting review · approval notes · memory refs · review decisions",
    relatedRoom: "Gor Gor Review Room",
  },
  {
    id: "sky-video",
    name: "Sky Video Drawer",
    owner: "Sky",
    focus: "Clips · scripts · storyboards · video standards · intro refs",
    relatedRoom: "Sky Video Room",
  },
  {
    id: "senti-creative",
    name: "Senti Creative Drawer",
    owner: "Senti",
    focus: "Posters · decks · visual assets · document drafts · creative standards",
    relatedRoom: "Senti Creative Room",
  },
  {
    id: "kura-structure",
    name: "Kura Structure Drawer",
    owner: "Kura",
    focus: "Logic maps · frameworks · problem-solving · decision structures",
    relatedRoom: "Kura Structure Room",
  },
  {
    id: "agent-r-evidence",
    name: "Agent R Evidence Drawer",
    owner: "Agent R",
    focus: "Admin tasks · proof of completion · blocked reports · email/setup evidence",
    relatedRoom: "Agent R Evidence Room",
  },
];

export type FamilyCabinetState = {
  drawers: Record<CabinetDrawerId, CabinetItem[]>;
};

export function emptyCabinet(): FamilyCabinetState {
  const drawers = {} as Record<CabinetDrawerId, CabinetItem[]>;
  for (const d of CABINET_DRAWERS) drawers[d.id] = [];
  return { drawers };
}

export function normalizeCabinet(raw?: Partial<FamilyCabinetState> | null): FamilyCabinetState {
  const base = emptyCabinet();
  if (!raw?.drawers) return base;
  for (const d of CABINET_DRAWERS) {
    const list = raw.drawers[d.id];
    base.drawers[d.id] = Array.isArray(list) ? list : [];
  }
  return base;
}

const CABINET_STATUS_TONE: Record<CabinetStatus, string> = {
  "KIERAN DROPPED": "border-violet-400/35 bg-violet-400/10 text-violet-900",
  "ASSIGNED TO ROOM": "border-brand/30 bg-brand/5 text-brand-dark",
  "IN PROGRESS": "border-sky-400/40 bg-sky-400/10 text-sky-900",
  "SUBMITTED IN CABINET": "border-brand/35 bg-brand/10 text-brand",
  "WAITING FOR GOR GOR": "border-amber-400/40 bg-amber-400/10 text-amber-800",
  "GOR GOR REVIEWING": "border-brand/40 bg-brand/10 text-brand",
  "KIERAN REVIEW READY": "border-violet-400/40 bg-violet-400/10 text-violet-900",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
  ARCHIVED: "border-ink/15 bg-ink/5 text-ink-muted",
  "DO NOT USE": "border-rose-400/40 bg-rose-400/10 text-rose-800",
  BLOCKED: "border-rose-400/40 bg-rose-400/10 text-rose-800",
};

const SENSITIVITY_LEVELS = ["Public-safe", "Internal", "Family-only", "Do not share"] as const;

const ITEM_TYPES = [
  "Vision note",
  "Reference link",
  "Script",
  "Storyboard",
  "Poster / visual",
  "Deck / document",
  "Logic map",
  "Evidence / proof",
  "Standard",
  "Other",
] as const;

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/40";
const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle";
const btnPrimary =
  "rounded-full bg-brand px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:opacity-40";
const btnGhost =
  "rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted transition hover:border-brand/30 hover:text-ink";

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

function blankItem(defaults?: Partial<CabinetItem>): CabinetItem {
  const now = new Date().toISOString();
  return {
    id: uid(),
    item_title: "",
    file_or_reference_link: "",
    item_type: "Reference link",
    placed_by: "Kieran",
    assigned_to: "",
    related_room: "",
    status: "KIERAN DROPPED",
    version_date: now.slice(0, 10),
    sensitivity_level: "Internal",
    usage_note: "",
    evidence_link: "",
    gor_gor_review_state: "NONE",
    createdAt: now,
    updatedAt: now,
    ...defaults,
  };
}

/** Soft pearl/lavender Family Cabinet Rule — Living Room · typographic · no cartoon icons */
function FamilyCabinetRuleCard() {
  return (
    <article
      aria-labelledby="family-cabinet-rule-title"
      className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-white via-[#f7f4fc] to-[#efeaf8] px-5 py-5 shadow-[0_1px_0_rgba(140,130,252,0.08)] sm:px-6 sm:py-6"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
        櫃桶 · Shared cabinet
      </p>
      <h3
        id="family-cabinet-rule-title"
        className="mt-1.5 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
      >
        Family Cabinet Rule
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink/90">
        <li>Kieran may place materials into the drawer of the member who can use them.</li>
        <li>Each family member must return completed homework to their own drawer.</li>
        <li>
          Senti may help organise creative/document drawers, but nothing becomes Approved or
          Production-ready without Gor Gor Review.
        </li>
      </ul>
      <p className="mt-5 border-l-2 border-brand/35 bg-brand/[0.04] py-3 pl-4 pr-3 text-[13px] leading-relaxed text-ink/85">
        房間 = identity + work space · 櫃桶 = materials + homework handoff · 客廳 = shared family
        coordination.
      </p>
    </article>
  );
}

type ItemFormProps = {
  initial: CabinetItem;
  actor: CabinetActor;
  drawer: DrawerMeta;
  submitLabel: string;
  onSubmit: (item: CabinetItem) => void;
  onCancel?: () => void;
};

function ItemForm({ initial, actor, drawer, submitLabel, onSubmit, onCancel }: ItemFormProps) {
  const [draft, setDraft] = useState<CabinetItem>(initial);
  const gateBlocked = !canSetCabinetStatus(actor, draft.status);

  const setField = <K extends keyof CabinetItem>(key: K, value: CabinetItem[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      className="space-y-3 rounded-xl border border-dashed border-brand/25 bg-silk/50 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.item_title.trim()) return;
        if (!canSetCabinetStatus(actor, draft.status)) return;
        onSubmit({
          ...draft,
          item_title: draft.item_title.trim(),
          file_or_reference_link: draft.file_or_reference_link.trim(),
          related_room: draft.related_room.trim() || drawer.relatedRoom,
          assigned_to: draft.assigned_to.trim() || drawer.owner,
          updatedAt: new Date().toISOString(),
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Item title</label>
          <input
            className={inputClass}
            value={draft.item_title}
            onChange={(e) => setField("item_title", e.target.value)}
            placeholder="What is in this drawer slot"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>File or reference link</label>
          <input
            className={inputClass}
            value={draft.file_or_reference_link}
            onChange={(e) => setField("file_or_reference_link", e.target.value)}
            placeholder="https://… or path / note ref (link index only)"
          />
        </div>
        <div>
          <label className={labelClass}>Item type</label>
          <select
            className={inputClass}
            value={draft.item_type}
            onChange={(e) => setField("item_type", e.target.value)}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Sensitivity</label>
          <select
            className={inputClass}
            value={draft.sensitivity_level}
            onChange={(e) => setField("sensitivity_level", e.target.value)}
          >
            {SENSITIVITY_LEVELS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Placed by</label>
          <select
            className={inputClass}
            value={draft.placed_by}
            onChange={(e) => setField("placed_by", e.target.value)}
          >
            {CABINET_ACTORS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Assigned to</label>
          <input
            className={inputClass}
            value={draft.assigned_to}
            onChange={(e) => setField("assigned_to", e.target.value)}
            placeholder={drawer.owner}
          />
        </div>
        <div>
          <label className={labelClass}>Related room</label>
          <input
            className={inputClass}
            value={draft.related_room}
            onChange={(e) => setField("related_room", e.target.value)}
            placeholder={drawer.relatedRoom}
          />
        </div>
        <div>
          <label className={labelClass}>Version date</label>
          <input
            className={inputClass}
            type="date"
            value={draft.version_date}
            onChange={(e) => setField("version_date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={draft.status}
            onChange={(e) => setField("status", e.target.value as CabinetStatus)}
          >
            {CABINET_STATUSES.map((s) => (
              <option key={s} disabled={!canSetCabinetStatus(actor, s)}>
                {s}
                {!canSetCabinetStatus(actor, s) ? " · Gor Gor / Kieran only" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Gor Gor review state</label>
          <select
            className={inputClass}
            value={draft.gor_gor_review_state}
            onChange={(e) => setField("gor_gor_review_state", e.target.value as GorGorReviewState)}
            disabled={actor !== "Kieran" && actor !== "Simpee/Gor Gor"}
          >
            {GOR_GOR_REVIEW_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Usage note</label>
          <textarea
            className={cn(inputClass, "min-h-[56px] resize-y")}
            value={draft.usage_note}
            onChange={(e) => setField("usage_note", e.target.value)}
            placeholder="How to use this material · handoff note"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Evidence link</label>
          <input
            className={inputClass}
            value={draft.evidence_link}
            onChange={(e) => setField("evidence_link", e.target.value)}
            placeholder="https://… proof link (optional)"
          />
        </div>
      </div>

      {gateBlocked ? (
        <p className="rounded-lg border border-amber-400/30 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
          Acting as <strong>{actor}</strong> cannot set gate status{" "}
          <strong>{draft.status}</strong>. Switch Acting as to Kieran or Simpee/Gor Gor — Senti
          organise ≠ approve.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={btnPrimary} disabled={gateBlocked}>
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className={btnGhost} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

type FamilyCabinetProps = {
  cabinet: FamilyCabinetState;
  onChange: (next: FamilyCabinetState) => void;
};

export function FamilyCabinet({ cabinet, onChange }: FamilyCabinetProps) {
  const [openDrawerId, setOpenDrawerId] = useState<CabinetDrawerId | null>(null);
  const [statusFilter, setStatusFilter] = useState<CabinetStatus | "ALL">("ALL");
  const [actor, setActor] = useState<CabinetActor>("Kieran");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const openMeta = CABINET_DRAWERS.find((d) => d.id === openDrawerId) ?? null;
  const items = openDrawerId ? cabinet.drawers[openDrawerId] : [];

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return items;
    return items.filter((i) => i.status === statusFilter);
  }, [items, statusFilter]);

  const patchDrawer = (id: CabinetDrawerId, nextItems: CabinetItem[]) => {
    onChange({
      drawers: {
        ...cabinet.drawers,
        [id]: nextItems,
      },
    });
  };

  const counts = useMemo(() => {
    const map = {} as Record<CabinetDrawerId, number>;
    for (const d of CABINET_DRAWERS) map[d.id] = cabinet.drawers[d.id]?.length ?? 0;
    return map;
  }, [cabinet]);

  return (
    <section className="space-y-4" aria-labelledby="family-cabinet-heading">
      <div className="rounded-2xl border border-brand/25 bg-gradient-to-br from-white via-[#faf8ff] to-[#f0ebf8] px-5 py-5 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
          一人一格櫃桶 · Living Room
        </p>
        <h3 id="family-cabinet-heading" className="mt-1 font-display text-xl font-bold text-ink">
          Family Cabinet
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Shared drawers for materials and homework handoff — not a replacement for personal rooms.
        </p>
        <p
          role="status"
          className="mt-3 rounded-xl border border-amber-700/20 bg-amber-50/90 px-3 py-2 text-[11px] leading-relaxed text-amber-950"
        >
          {CABINET_WARNING}
        </p>
      </div>

      <FamilyCabinetRuleCard />

      {/* Acting as — gate for approve transitions */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3">
        <div className="min-w-[180px] flex-1">
          <label className={labelClass}>Acting as (status changes)</label>
          <select
            className={inputClass}
            value={actor}
            onChange={(e) => setActor(e.target.value as CabinetActor)}
          >
            {CABINET_ACTORS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <p className="pb-2 text-[11px] text-ink-subtle">
          Gate statuses (Waiting / Reviewing / Review Ready / Approved) = Kieran or Gor Gor only.
          Senti may organise — cannot approve.
        </p>
      </div>

      {openDrawerId && openMeta ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-brand/20 bg-white px-4 py-4 sm:px-5">
            <div>
              <button type="button" className={btnGhost} onClick={() => {
                setOpenDrawerId(null);
                setAdding(false);
                setEditingId(null);
                setStatusFilter("ALL");
              }}>
                ← All drawers
              </button>
              <h4 className="mt-3 font-display text-lg font-semibold text-ink">{openMeta.name}</h4>
              <p className="mt-0.5 text-sm text-ink-muted">{openMeta.focus}</p>
              <p className="mt-1 text-[11px] text-ink-subtle">
                Owner: {openMeta.owner} · Related room: {openMeta.relatedRoom}
              </p>
            </div>
            <div className="min-w-[160px]">
              <label className={labelClass}>Filter by status</label>
              <select
                className={inputClass}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value === "ALL" ? "ALL" : (e.target.value as CabinetStatus))
                }
              >
                <option value="ALL">All statuses</option>
                {CABINET_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!adding && !editingId ? (
            <button
              type="button"
              className={btnPrimary}
              onClick={() => {
                setAdding(true);
                setEditingId(null);
              }}
            >
              Add item to drawer
            </button>
          ) : null}

          {adding ? (
            <ItemForm
              key="add"
              initial={blankItem({
                placed_by: actor,
                assigned_to: openMeta.owner,
                related_room: openMeta.relatedRoom,
              })}
              actor={actor}
              drawer={openMeta}
              submitLabel="Place in drawer"
              onCancel={() => setAdding(false)}
              onSubmit={(item) => {
                patchDrawer(openDrawerId, [item, ...cabinet.drawers[openDrawerId]]);
                setAdding(false);
              }}
            />
          ) : null}

          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-subtle">
              {items.length === 0 ? "This drawer is empty." : "No items match this status filter."}
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((row) => (
                <li
                  key={row.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_1px_0_rgba(140,130,252,0.05)]"
                >
                  {editingId === row.id ? (
                    <div className="p-4">
                      <ItemForm
                        key={row.id}
                        initial={row}
                        actor={actor}
                        drawer={openMeta}
                        submitLabel="Save item"
                        onCancel={() => setEditingId(null)}
                        onSubmit={(item) => {
                          patchDrawer(
                            openDrawerId,
                            cabinet.drawers[openDrawerId].map((x) => (x.id === row.id ? item : x)),
                          );
                          setEditingId(null);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-4 sm:px-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-base font-semibold text-ink">
                              {row.item_title}
                            </p>
                            <Badge tone={CABINET_STATUS_TONE[row.status]}>{row.status}</Badge>
                          </div>
                          <p className="mt-1 text-[11px] text-ink-subtle">
                            {row.item_type} · {row.sensitivity_level} · v{row.version_date}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            Placed by {row.placed_by} · Assigned to {row.assigned_to || "—"} ·{" "}
                            {row.related_room || openMeta.relatedRoom}
                          </p>
                          {row.usage_note ? (
                            <p className="mt-2 text-sm text-ink/85">{row.usage_note}</p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            {row.file_or_reference_link ? (
                              <a
                                href={
                                  row.file_or_reference_link.startsWith("http")
                                    ? row.file_or_reference_link
                                    : undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "break-all text-brand",
                                  row.file_or_reference_link.startsWith("http")
                                    ? "underline decoration-brand/30"
                                    : "cursor-default no-underline",
                                )}
                                onClick={(e) => {
                                  if (!row.file_or_reference_link.startsWith("http")) e.preventDefault();
                                }}
                              >
                                Ref: {row.file_or_reference_link}
                              </a>
                            ) : null}
                            {row.evidence_link ? (
                              <a
                                href={
                                  row.evidence_link.startsWith("http") ? row.evidence_link : undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-brand underline decoration-brand/30"
                                onClick={(e) => {
                                  if (!row.evidence_link.startsWith("http")) e.preventDefault();
                                }}
                              >
                                Evidence: {row.evidence_link}
                              </a>
                            ) : null}
                          </div>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-ink-subtle">
                            Gor Gor review: {row.gor_gor_review_state}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() => {
                              setEditingId(row.id);
                              setAdding(false);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={btnGhost}
                            onClick={() =>
                              patchDrawer(
                                openDrawerId,
                                cabinet.drawers[openDrawerId].filter((x) => x.id !== row.id),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {CABINET_DRAWERS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setOpenDrawerId(d.id)}
              className="rounded-2xl border border-brand/15 bg-gradient-to-br from-white to-[#f6f3fb] px-4 py-4 text-left transition hover:border-brand/35 hover:shadow-[0_2px_12px_rgba(140,130,252,0.1)] sm:px-5 sm:py-5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold text-ink">{d.name}</p>
                <Badge>{counts[d.id]}</Badge>
              </div>
              <p className="mt-1 text-[11px] text-ink-subtle">{d.owner}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{d.focus}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand/70">
                Open drawer →
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
