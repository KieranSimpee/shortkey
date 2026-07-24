"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CHAT_STATUS_TONE,
  CHAT_WARNING,
  clearFamilyChatStorage,
  FAMILY_CHAT_STORAGE_KEY,
  type FamilyChatMessage,
  LEGACY_CHAT_ROOM_TO_ID,
  loadLegacyFamilyChat,
  RoomChatThread,
  uid,
} from "@/components/internal/FamilyChatPanel";
import {
  emptyCabinet,
  FamilyCabinet,
  type FamilyCabinetState,
  normalizeCabinet,
} from "@/components/internal/FamilyCabinet";
import { GorGorChatDrawer } from "@/components/internal/GorGorChatDrawer";
import {
  clearDoorbellStorage,
  DOORBELL_STORAGE_KEY,
  MemberDoorbellPanel,
  ROOM_TO_MEMBER,
  useDoorbell,
} from "@/components/internal/FamilyDoorbell";
import { LivingRoomSharedChat } from "@/components/internal/LivingRoomSharedChat";

/**
 * Family Table v0.8 — One Room Per Family Member (house architecture).
 * Persistence: browser localStorage key `shortkey-family-table-v08` only
 * (includes Living Room `cabinet` — Family Cabinet drawers).
 * Living Room Shared Chat P0: recipient pick only (no smart routing) via `/api/family-doorbell/*`
 * (localStorage `shortkey-family-doorbell-v092` = fallback/demo only; Redis key unchanged).
 * Migrates lightly once from v0.7 + Family Chat v0.1.
 * Doc: src/brand/sky/FAMILY_HOME_SHARED_CHAT_SIMPLE.md
 */

export const STORAGE_KEY = "shortkey-family-table-v08";
const LEGACY_TABLE_KEY = "shortkey-family-table-v07";

export type RoomId =
  | "living"
  | "kieran"
  | "gorgor"
  | "sky"
  | "senti"
  | "kura"
  | "agent-r";

export type WorkStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "WAITING FOR GOR GOR"
  | "GOR GOR REVIEWING"
  | "KIERAN REVIEW READY"
  | "APPROVED"
  | "BLOCKED";

type ListItem = {
  id: string;
  title: string;
  detail: string;
  status: WorkStatus;
  createdAt: string;
};

type LinkItem = {
  id: string;
  label: string;
  url: string;
  createdAt: string;
};

type NoteItem = {
  id: string;
  body: string;
  createdAt: string;
};

export type RoomState = {
  roleDescription: string;
  /** Living Room shared: announcements / priorities / standards (extra house DNA) */
  announcements: string;
  priorities: string;
  standards: string;
  currentTasks: ListItem[];
  memoryFile: { label: string; body: string };
  submittedWork: ListItem[];
  evidenceLinks: LinkItem[];
  gorGorNotes: NoteItem[];
  kieranReviewReady: ListItem[];
  chat: FamilyChatMessage[];
};

export type FamilyTableV08 = {
  version: "0.8";
  migratedFrom?: string[];
  rooms: Record<RoomId, RoomState>;
  /** Living Room Family Cabinet — materials + homework handoff (一人一格櫃桶) */
  cabinet: FamilyCabinetState;
};

type RoomMeta = {
  id: RoomId;
  name: string;
  short: string;
  owner: string;
  mood: "shared" | "personal";
  defaultRole: string;
  focus: string;
};

export const ROOMS: RoomMeta[] = [
  {
    id: "living",
    name: "Family Table / Living Room",
    short: "Living Room",
    owner: "Family (shared) · Simpee hosts",
    mood: "shared",
    defaultRole: "飯廳 — shared announcements, current priorities, approved standards. Everyone gathers here.",
    focus: "Shared house table · announcements · priorities · standards",
  },
  {
    id: "kieran",
    name: "Kieran Vision Room",
    short: "Kieran Vision",
    owner: "Kieran",
    mood: "personal",
    defaultRole: "Vision inbox, future projects, brand direction, emotional anchor notes.",
    focus: "Vision · future projects · brand direction · anchors",
  },
  {
    id: "gorgor",
    name: "Gor Gor Review Room",
    short: "Gor Gor Review",
    owner: "Simpee (Gor Gor)",
    mood: "personal",
    defaultRole: "Review gate, approval queue, memory notes, family coordination.",
    focus: "Review gate · approval · memory · coordination",
  },
  {
    id: "sky",
    name: "Sky Video Room",
    short: "Sky Video",
    owner: "Sky",
    mood: "personal",
    defaultRole: "Video standards, scripts, storyboard drafts, research intelligence.",
    focus: "Video · scripts · storyboards · research",
  },
  {
    id: "senti",
    name: "Senti Creative Room",
    short: "Senti Creative",
    owner: "Senti",
    mood: "personal",
    defaultRole: "Poster standards, visual assets, document drafts, creative submissions.",
    focus: "Posters · visuals · docs · creative submissions",
  },
  {
    id: "kura",
    name: "Kura Structure Room",
    short: "Kura Structure",
    owner: "Kura",
    mood: "personal",
    defaultRole: "Problem solving, logic maps, strategy structure, decision support.",
    focus: "Logic · strategy · structure · decisions",
  },
  {
    id: "agent-r",
    name: "Agent R Evidence Room",
    short: "Agent R Evidence",
    owner: "Agent R",
    mood: "personal",
    defaultRole: "Secretary tasks, evidence logs, blocked reports, admin execution proof.",
    focus: "Secretary · evidence · blocked · admin proof",
  },
];

const WORK_STATUSES: WorkStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "WAITING FOR GOR GOR",
  "GOR GOR REVIEWING",
  "KIERAN REVIEW READY",
  "APPROVED",
  "BLOCKED",
];

/** Living Room House Rule — warm home tone · shared announcement default */
const HOUSE_RULE_ANNOUNCEMENT = `Family House Rule · 返屋企先執房

返屋企，先執房。
每位Family member都有自己一間房。
房入面可以有靈感、有草稿、有未完成嘅作品。
但交俾Gor Gor之前，要先執好：
1. 文件放好
2. 版本寫清楚
3. 狀態標清楚
4. 證據補齊
5. 問題講出嚟
6. Draft同Approved分開

執房唔係壓力。執房係尊重自己嘅作品，也係保護整個Family。

House Rule:
執好房，先交功課。
有證據，先叫完成。
Gor Gor Review之後，先叫Approved。`;

function emptyRoom(meta: RoomMeta): RoomState {
  return {
    roleDescription: meta.defaultRole,
    announcements: meta.id === "living" ? HOUSE_RULE_ANNOUNCEMENT : "",
    priorities: "",
    standards: "",
    currentTasks: [],
    memoryFile: { label: "", body: "" },
    submittedWork: [],
    evidenceLinks: [],
    gorGorNotes: [],
    kieranReviewReady: [],
    chat: [],
  };
}

function defaultState(): FamilyTableV08 {
  const rooms = {} as Record<RoomId, RoomState>;
  for (const r of ROOMS) rooms[r.id] = emptyRoom(r);
  return { version: "0.8", rooms, cabinet: emptyCabinet() };
}

function item(title: string, detail = "", status: WorkStatus = "DRAFT"): ListItem {
  return {
    id: uid(),
    title,
    detail,
    status,
    createdAt: new Date().toISOString(),
  };
}

type LegacyV07 = {
  visions?: { title: string; note: string; priority: string; createdAt: string }[];
  vault?: { key: string; value: string; notes: string; createdAt: string }[];
  projects?: { name: string; domainHint: string; status: string; createdAt: string }[];
  tasks?: { title: string; detail: string; seat: string; status: string; createdAt: string }[];
  assets?: { filename: string; note: string; createdAt: string }[];
  reviews?: { title: string; summary: string; status: string; createdAt: string }[];
  memories?: { label: string; body: string; createdAt: string }[];
};

const SEAT_TO_ROOM: Record<string, RoomId> = {
  Simpee: "gorgor",
  Sky: "sky",
  Kura: "kura",
  "Agent R": "agent-r",
  Senti: "senti",
  Key: "living",
};

function mapReviewStatus(s: string): WorkStatus {
  if (s === "Approved") return "APPROVED";
  if (s === "Blocked") return "BLOCKED";
  if (s === "In Review") return "GOR GOR REVIEWING";
  return "WAITING FOR GOR GOR";
}

function migrateFromLegacy(): FamilyTableV08 {
  const next = defaultState();
  const migrated: string[] = [];

  try {
    const raw = localStorage.getItem(LEGACY_TABLE_KEY);
    if (raw) {
      const legacy = JSON.parse(raw) as LegacyV07;
      migrated.push(LEGACY_TABLE_KEY);

      for (const v of legacy.visions ?? []) {
        next.rooms.kieran.submittedWork.push({
          id: uid(),
          title: v.title,
          detail: [v.note, v.priority ? `Priority: ${v.priority}` : ""].filter(Boolean).join("\n"),
          status: "DRAFT",
          createdAt: v.createdAt || new Date().toISOString(),
        });
      }
      for (const p of legacy.projects ?? []) {
        next.rooms.kieran.currentTasks.push({
          id: uid(),
          title: p.name,
          detail: p.domainHint || "",
          status: "DRAFT",
          createdAt: p.createdAt || new Date().toISOString(),
        });
      }
      for (const row of legacy.vault ?? []) {
        next.rooms.living.standards += `${row.key}: ${row.value}${row.notes ? ` (${row.notes})` : ""}\n`;
      }
      for (const t of legacy.tasks ?? []) {
        const roomId = SEAT_TO_ROOM[t.seat] ?? "living";
        next.rooms[roomId].currentTasks.push({
          id: uid(),
          title: t.title,
          detail: t.detail || "",
          status: t.status === "Done" ? "APPROVED" : t.status === "In Progress" ? "SUBMITTED" : "DRAFT",
          createdAt: t.createdAt || new Date().toISOString(),
        });
      }
      for (const a of legacy.assets ?? []) {
        next.rooms.senti.submittedWork.push({
          id: uid(),
          title: a.filename,
          detail: a.note || "",
          status: "DRAFT",
          createdAt: a.createdAt || new Date().toISOString(),
        });
      }
      for (const r of legacy.reviews ?? []) {
        next.rooms.gorgor.kieranReviewReady.push({
          id: uid(),
          title: r.title,
          detail: r.summary || "",
          status: mapReviewStatus(r.status),
          createdAt: r.createdAt || new Date().toISOString(),
        });
      }
      for (const m of legacy.memories ?? []) {
        if (!next.rooms.gorgor.memoryFile.label) {
          next.rooms.gorgor.memoryFile = { label: m.label, body: m.body };
        } else {
          next.rooms.gorgor.gorGorNotes.push({
            id: uid(),
            body: `${m.label}: ${m.body}`,
            createdAt: m.createdAt || new Date().toISOString(),
          });
        }
      }
    }
  } catch {
    /* ignore corrupt v07 */
  }

  try {
    const chatMsgs = loadLegacyFamilyChat();
    if (chatMsgs.length > 0) {
      migrated.push(FAMILY_CHAT_STORAGE_KEY);
      for (const m of chatMsgs) {
        const roomId = (LEGACY_CHAT_ROOM_TO_ID[m.room] as RoomId) || "living";
        if (!next.rooms[roomId]) continue;
        next.rooms[roomId].chat.push({
          ...m,
          room: ROOMS.find((r) => r.id === roomId)?.name ?? m.room,
        });
      }
    }
  } catch {
    /* ignore */
  }

  if (migrated.length) next.migratedFrom = migrated;
  return next;
}

function loadState(): FamilyTableV08 {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FamilyTableV08>;
      const base = defaultState();
      if (parsed.rooms) {
        for (const r of ROOMS) {
          base.rooms[r.id] = { ...emptyRoom(r), ...parsed.rooms[r.id] };
        }
      }
      base.cabinet = normalizeCabinet(parsed.cabinet);
      base.migratedFrom = parsed.migratedFrom;
      return base;
    }
    const migrated = migrateFromLegacy();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return defaultState();
  }
}

function saveState(data: FamilyTableV08) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

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

function EmptyLine({ text }: { text: string }) {
  return <p className="py-4 text-center text-sm text-ink-subtle">{text}</p>;
}

/** Soft pearl/lavender House Rule card — Living Room only · no icons · typographic */
function LivingRoomHouseRuleCard() {
  return (
    <article
      aria-labelledby="living-house-rule-title"
      className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-white via-[#f7f4fc] to-[#efeaf8] px-5 py-5 shadow-[0_1px_0_rgba(140,130,252,0.08)] sm:px-6 sm:py-6"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
        飯廳 · Announcement
      </p>
      <h3
        id="living-house-rule-title"
        className="mt-1.5 font-display text-lg font-semibold tracking-tight text-ink sm:text-xl"
      >
        Family House Rule · 返屋企先執房
      </h3>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/90">
        <p>返屋企，先執房。</p>
        <p>每位Family member都有自己一間房。</p>
        <p>房入面可以有靈感、有草稿、有未完成嘅作品。</p>
        <p>但交俾Gor Gor之前，要先執好：</p>
        <ol className="list-decimal space-y-1.5 pl-5 text-ink/85">
          <li>文件放好</li>
          <li>版本寫清楚</li>
          <li>狀態標清楚</li>
          <li>證據補齊</li>
          <li>問題講出嚟</li>
          <li>Draft同Approved分開</li>
        </ol>
      </div>

      <p className="mt-5 border-l-2 border-brand/35 bg-brand/[0.04] py-3 pl-4 pr-3 font-display text-[15px] leading-relaxed text-ink/95 sm:text-base">
        執房唔係壓力。執房係尊重自己嘅作品，也係保護整個Family。
      </p>

      <div className="mt-5 border-t border-brand/15 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/70">
          House Rule
        </p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink/85">
          <li>執好房，先交功課。</li>
          <li>有證據，先叫完成。</li>
          <li>Gor Gor Review之後，先叫Approved。</li>
        </ul>
      </div>
    </article>
  );
}

function Panel({
  title,
  hint,
  children,
  accent,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border bg-white",
        accent ? "border-brand/25 shadow-[0_0_0_1px_rgba(140,130,252,0.06)]" : "border-ink/10",
      )}
    >
      <header className="border-b border-ink/5 bg-brand/[0.03] px-4 py-3 sm:px-5">
        <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
        {hint ? <p className="mt-0.5 text-[11px] text-ink-subtle">{hint}</p> : null}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: ListItem[];
  onChange: (next: ListItem[]) => void;
  placeholder: string;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<WorkStatus>("DRAFT");

  return (
    <div className="space-y-3">
      <form
        className="space-y-2 rounded-xl border border-dashed border-brand/20 bg-silk/40 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onChange([item(title.trim(), detail.trim(), status), ...items]);
          setTitle("");
          setDetail("");
          setStatus("DRAFT");
        }}
      >
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          required
        />
        <textarea
          className={cn(inputClass, "min-h-[56px] resize-y")}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detail (optional)"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            className={cn(inputClass, "max-w-[220px]")}
            value={status}
            onChange={(e) => setStatus(e.target.value as WorkStatus)}
          >
            {WORK_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className={btnPrimary}>
            Add
          </button>
        </div>
      </form>
      {items.length === 0 ? (
        <EmptyLine text="Nothing here yet." />
      ) : (
        <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
          {items.map((row) => (
            <li key={row.id} className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{row.title}</p>
                  <Badge tone={CHAT_STATUS_TONE[row.status]}>{row.status}</Badge>
                </div>
                {row.detail ? <p className="mt-1 text-sm text-ink-muted">{row.detail}</p> : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <select
                  className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink-muted"
                  value={row.status}
                  onChange={(e) =>
                    onChange(
                      items.map((x) =>
                        x.id === row.id ? { ...x, status: e.target.value as WorkStatus } : x,
                      ),
                    )
                  }
                >
                  {WORK_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => onChange(items.filter((x) => x.id !== row.id))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FamilyTableWorkbench() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<FamilyTableV08>(defaultState);
  const [roomId, setRoomId] = useState<RoomId>("living");
  const [savedFlash, setSavedFlash] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isFamilyPort, setIsFamilyPort] = useState(false);
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const doorbell = useDoorbell();

  useEffect(() => {
    setState(loadState());
    setIsFamilyPort(window.location.port === "3002");
    setReady(true);
  }, []);

  const persist = useCallback((next: FamilyTableV08) => {
    setState(next);
    saveState(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }, []);

  const patchRoom = useCallback(
    (id: RoomId, patch: Partial<RoomState>) => {
      persist({
        ...state,
        rooms: {
          ...state.rooms,
          [id]: { ...state.rooms[id], ...patch },
        },
      });
    },
    [persist, state],
  );

  const clearAll = () => {
    if (
      !window.confirm(
        "Clear Family Table v0.8 local data on this browser? (Also clears legacy chat + doorbell keys if present.)",
      )
    )
      return;
    const fresh = defaultState();
    persist(fresh);
    clearFamilyChatStorage();
    clearDoorbellStorage();
    doorbell.clearAll();
  };

  const meta = ROOMS.find((r) => r.id === roomId)!;
  const room = state.rooms[roomId];
  const doorbellMember = ROOM_TO_MEMBER[roomId];

  if (!ready || !doorbell.ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-ink-muted sm:px-8">
        Loading Family Table…
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-8">
      <div
        role="status"
        className="mb-4 rounded-xl border border-amber-700/25 bg-amber-50 px-4 py-3 text-center text-xs leading-relaxed text-amber-950 sm:text-sm"
      >
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-amber-900 sm:text-xs">
          INTERNAL STAGING ONLY · FAMILY HOME
        </span>
        <span className="mt-1 block text-amber-900/90">
          family.shortkey.world — our home · not shortkey.world public launch · Gor Gor Review pending
        </span>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/90 px-5 py-5 shadow-[0_1px_0_rgba(140,130,252,0.08)] sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
              family.shortkey.world — Family Home · Internal Staging · Family Table v0.8
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              One Room Per Family Member
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              House architecture — Living Room first (飯廳 + Family Cabinet), then each
              member&apos;s place. localStorage only · not Family Memory Portal yet.
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
            Internal staging · localStorage only
          </span>
          {" · "}
          Storage key <code className="font-mono text-[11px]">{STORAGE_KEY}</code>
          {" · "}
          doorbell <code className="font-mono text-[11px]">{DOORBELL_STORAGE_KEY}</code>
          {" "}
          (fallback) · Living Room Shared Chat · API{" "}
          <code className="font-mono text-[11px]">/api/family-doorbell</code>
          {state.migratedFrom?.length ? (
            <>
              {" "}
              · migrated once from{" "}
              {state.migratedFrom.map((k) => (
                <code key={k} className="mr-1 font-mono text-[11px]">
                  {k}
                </code>
              ))}
            </>
          ) : (
            <>
              {" "}
              · legacy keys{" "}
              <code className="font-mono text-[11px]">{LEGACY_TABLE_KEY}</code> ·{" "}
              <code className="font-mono text-[11px]">{FAMILY_CHAT_STORAGE_KEY}</code> (read once if
              present)
            </>
          )}{" "}
          · not shared DB · no private data · noindex · Gor Gor Review still required · Coming Soon
          untouched.
          {isFamilyPort ? (
            <span className="mt-1 block text-ink-muted">
              Family Table surface · port 3002 · beauty Coming Soon stays on{" "}
              <a
                href="http://localhost:3001/"
                className="underline decoration-brand/40 underline-offset-2 hover:text-brand"
              >
                :3001
              </a>
              .
            </span>
          ) : null}
          {savedFlash ? <span className="ml-2 font-semibold text-brand">Saved locally ✓</span> : null}
        </div>

        <p className="mt-3 text-[11px] text-ink-subtle">
          Family Vote AGREED 2026-07-23 (v0.7 writable) · v0.8 house rooms · Doc:{" "}
          <span className="font-mono">FAMILY_TABLE_v0_8.md</span>
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr]">
        {/* Family Rooms nav */}
        <nav
          aria-label="Family Rooms"
          className="h-fit rounded-2xl border border-ink/10 bg-white/95 p-3 shadow-[0_1px_0_rgba(140,130,252,0.06)] lg:sticky lg:top-4"
        >
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
            Family Rooms
          </p>
          <div className="flex flex-col gap-1.5">
            {ROOMS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomId(r.id)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition",
                  roomId === r.id
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-transparent bg-transparent text-ink-muted hover:border-brand/20 hover:bg-brand/[0.04] hover:text-ink",
                )}
              >
                <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {r.short}
                </span>
                <span className="mt-0.5 block text-[10px] opacity-80">{r.owner}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Active room */}
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-2xl border px-5 py-4 sm:px-6",
              meta.mood === "shared"
                ? "border-brand/30 bg-gradient-to-br from-brand/[0.08] via-white to-silk"
                : "border-ink/10 bg-white",
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              {meta.mood === "shared" ? "飯廳 · Shared living" : "Personal room"}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">{meta.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{meta.focus}</p>
          </div>

          {/* Living Room · Family House Rule (top announcement) */}
          {roomId === "living" ? <LivingRoomHouseRuleCard /> : null}

          {/* Living Room · Shared Chat (manual recipients · no complex router) */}
          {roomId === "living" ? (
            <LivingRoomSharedChat
              state={doorbell.state}
              connection={doorbell.connection}
              savedFlash={doorbell.savedFlash}
              errorFlash={doorbell.errorFlash}
              busy={doorbell.busy}
              onPost={doorbell.postCommand}
              onUpdateReceipt={doorbell.updateReceipt}
              onRefresh={doorbell.refresh}
            />
          ) : null}

          {/* Member rooms · doorbell ack panel */}
          {doorbellMember ? (
            <MemberDoorbellPanel
              member={doorbellMember}
              state={doorbell.state}
              connection={doorbell.connection}
              busy={doorbell.busy}
              errorFlash={doorbell.errorFlash}
              onUpdateReceipt={doorbell.updateReceipt}
            />
          ) : null}

          {/* Living Room · Family Cabinet (一人一格櫃桶) */}
          {roomId === "living" ? (
            <FamilyCabinet
              cabinet={state.cabinet}
              onChange={(cabinet) => persist({ ...state, cabinet })}
            />
          ) : null}

          {/* 1. Room owner */}
          <Panel title="1. Room owner" hint="Fixed seat for this room">
            <p className="font-display text-lg font-semibold text-ink">{meta.owner}</p>
            <p className="mt-1 text-xs text-ink-subtle">{meta.name}</p>
          </Panel>

          {/* 2. Role description */}
          <Panel title="2. Role description" hint="What this room is for">
            <textarea
              className={cn(inputClass, "min-h-[88px] resize-y")}
              value={room.roleDescription}
              onChange={(e) => patchRoom(roomId, { roleDescription: e.target.value })}
              placeholder="Role / purpose of this room"
            />
          </Panel>

          {/* Living Room shared fields */}
          {roomId === "living" ? (
            <Panel
              title="Living Room · shared house board"
              hint="Announcements · priorities · approved standards"
              accent
            >
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Shared announcements</label>
                  <textarea
                    className={cn(inputClass, "min-h-[72px] resize-y")}
                    value={room.announcements}
                    onChange={(e) => patchRoom("living", { announcements: e.target.value })}
                    placeholder="What the family should know right now"
                  />
                </div>
                <div>
                  <label className={labelClass}>Current priorities</label>
                  <textarea
                    className={cn(inputClass, "min-h-[72px] resize-y")}
                    value={room.priorities}
                    onChange={(e) => patchRoom("living", { priorities: e.target.value })}
                    placeholder="What matters this week"
                  />
                </div>
                <div>
                  <label className={labelClass}>Approved standards</label>
                  <textarea
                    className={cn(inputClass, "min-h-[72px] resize-y")}
                    value={room.standards}
                    onChange={(e) => patchRoom("living", { standards: e.target.value })}
                    placeholder="Locked standards · brand DNA notes"
                  />
                </div>
              </div>
            </Panel>
          ) : null}

          {/* 3. Current tasks */}
          <Panel title="3. Current tasks" hint="Work in motion for this room">
            <ListEditor
              items={room.currentTasks}
              onChange={(currentTasks) => patchRoom(roomId, { currentTasks })}
              placeholder="Task title"
            />
          </Panel>

          {/* 4. Memory file placeholder */}
          <Panel title="4. Memory file placeholder" hint="Light only — not private cloud memory">
            <div className="mb-3 rounded-xl border border-dashed border-brand/25 bg-brand/[0.03] px-3 py-2.5 text-[11px] text-ink-muted">
              Placeholder — short notes on this browser. Full private memory = 正式版 Family Memory
              Portal.
            </div>
            <div className="space-y-2">
              <input
                className={inputClass}
                value={room.memoryFile.label}
                onChange={(e) =>
                  patchRoom(roomId, {
                    memoryFile: { ...room.memoryFile, label: e.target.value },
                  })
                }
                placeholder="Memory file label"
              />
              <textarea
                className={cn(inputClass, "min-h-[72px] resize-y")}
                value={room.memoryFile.body}
                onChange={(e) =>
                  patchRoom(roomId, {
                    memoryFile: { ...room.memoryFile, body: e.target.value },
                  })
                }
                placeholder="Memory note body — do not store production secrets"
              />
            </div>
          </Panel>

          {/* 5. Submitted work */}
          <Panel title="5. Submitted work" hint="Handbacks into this room">
            <ListEditor
              items={room.submittedWork}
              onChange={(submittedWork) => patchRoom(roomId, { submittedWork })}
              placeholder="Submission title"
            />
          </Panel>

          {/* 6. Evidence links */}
          <Panel title="6. Evidence links" hint="URLs only — no private uploads">
            <form
              className="mb-3 space-y-2 rounded-xl border border-dashed border-brand/20 bg-silk/40 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!evidenceLabel.trim() || !evidenceUrl.trim()) return;
                patchRoom(roomId, {
                  evidenceLinks: [
                    {
                      id: uid(),
                      label: evidenceLabel.trim(),
                      url: evidenceUrl.trim(),
                      createdAt: new Date().toISOString(),
                    },
                    ...room.evidenceLinks,
                  ],
                });
                setEvidenceLabel("");
                setEvidenceUrl("");
              }}
            >
              <input
                className={inputClass}
                value={evidenceLabel}
                onChange={(e) => setEvidenceLabel(e.target.value)}
                placeholder="Label"
                required
              />
              <input
                className={inputClass}
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://…"
                required
              />
              <button type="submit" className={btnPrimary}>
                Add evidence link
              </button>
            </form>
            {room.evidenceLinks.length === 0 ? (
              <EmptyLine text="No evidence links yet." />
            ) : (
              <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
                {room.evidenceLinks.map((ev) => (
                  <li key={ev.id} className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5">
                    <div>
                      <p className="font-semibold text-ink">{ev.label}</p>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 break-all text-xs text-brand underline decoration-brand/30"
                      >
                        {ev.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() =>
                        patchRoom(roomId, {
                          evidenceLinks: room.evidenceLinks.filter((x) => x.id !== ev.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* 7. Gor Gor notes */}
          <Panel title="7. Gor Gor notes" hint="Coordination / gate notes from Simpee">
            <form
              className="mb-3 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!noteDraft.trim()) return;
                patchRoom(roomId, {
                  gorGorNotes: [
                    {
                      id: uid(),
                      body: noteDraft.trim(),
                      createdAt: new Date().toISOString(),
                    },
                    ...room.gorGorNotes,
                  ],
                });
                setNoteDraft("");
              }}
            >
              <textarea
                className={cn(inputClass, "min-h-[64px] resize-y")}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Gor Gor note for this room"
              />
              <button type="submit" className={btnPrimary}>
                Add Gor Gor note
              </button>
            </form>
            {room.gorGorNotes.length === 0 ? (
              <EmptyLine text="No Gor Gor notes yet." />
            ) : (
              <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
                {room.gorGorNotes.map((n) => (
                  <li key={n.id} className="flex flex-wrap items-start justify-between gap-2 px-3 py-2.5">
                    <div>
                      <p className="whitespace-pre-wrap text-sm text-ink-muted">{n.body}</p>
                      <p className="mt-1 text-[10px] text-ink-subtle">{n.createdAt}</p>
                    </div>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() =>
                        patchRoom(roomId, {
                          gorGorNotes: room.gorGorNotes.filter((x) => x.id !== n.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* 8. Kieran Review Ready */}
          <Panel
            title="8. Kieran Review Ready"
            hint="Items ready for founder review"
            accent
          >
            <ListEditor
              items={room.kieranReviewReady}
              onChange={(kieranReviewReady) => patchRoom(roomId, { kieranReviewReady })}
              placeholder="Review-ready item"
            />
          </Panel>

          {/* 9. Room chat thread */}
          <Panel title="9. Room chat thread" hint={CHAT_WARNING}>
            <div className="overflow-hidden rounded-xl border border-ink/10">
              <RoomChatThread
                roomLabel={meta.name}
                messages={room.chat}
                onChange={(chat) => patchRoom(roomId, { chat })}
                onPosted={
                  doorbellMember
                    ? () => doorbell.markReceivedOnReply(doorbellMember)
                    : undefined
                }
              />
            </div>
          </Panel>
        </div>
      </div>

      {/* Floating Gor Gor → Family Chat drawer (recipient pick · same button) */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-brand/30 bg-brand px-5 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_28px_rgba(140,130,252,0.35)] transition hover:bg-brand-dark sm:bottom-8 sm:right-8"
      >
        Gor Gor
      </button>

      <GorGorChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        initialRoom={roomId}
      />
    </div>
  );
}
