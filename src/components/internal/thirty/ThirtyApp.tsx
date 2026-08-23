"use client";

import { useCallback, useEffect, useState } from "react";

const LS_KEY = "shortkey-30-app-v1";

type Door = "sky" | "maya" | "sk" | "may" | "30";
type ButtonId = 1 | 2 | 3;

type Persist = {
  door: Door;
  lastButton: ButtonId | null;
  pause: string;
  kieranYes: boolean;
  pending: string[];
};

const EMPTY: Persist = {
  door: "30",
  lastButton: null,
  pause: "",
  kieranYes: false,
  pending: [],
};

const BUTTONS: { id: ButtonId; label: string; outcome: string; positions: string }[] = [
  { id: 1, label: "Issue One", outcome: "Show first 刊 — only if it exists", positions: "素材 → 編輯 → 排版 → Deliver" },
  { id: 2, label: "Next Issue", outcome: "Show next direction — roadmap / draft only", positions: "Idea → Roadmap → Draft" },
  { id: 3, label: "Archive", outcome: "Show past outcomes only", positions: "Metadata → Database → Display" },
];

function read(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Persist) };
  } catch {
    return EMPTY;
  }
}

export function ThirtyApp() {
  const [state, setState] = useState<Persist>(EMPTY);
  const [ready, setReady] = useState(false);
  const [portOk, setPortOk] = useState(true);

  useEffect(() => {
    setState(read());
    setPortOk(window.location.port === "3003");
    setReady(true);
  }, []);

  const save = useCallback((next: Persist) => {
    setState(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }, []);

  const go = (door: Door) => save({ ...state, door });

  const press = (id: ButtonId) => {
    save({
      ...state,
      lastButton: id,
      pause: "未做過 · spine 未有呢一期 · Pause with reason",
      kieranYes: false,
    });
  };

  const deliver = () => {
    if (!state.kieranYes || state.lastButton == null) return;
    const label = BUTTONS.find((b) => b.id === state.lastButton)?.label ?? String(state.lastButton);
    save({
      ...state,
      pending: [
        `${new Date().toLocaleString("en-HK", { timeZone: "Asia/Hong_Kong" })} · ${label} · held (empty room · not published)`,
        ...state.pending,
      ].slice(0, 12),
      kieranYes: false,
    });
  };

  if (!ready) {
    return <p className="p-8 text-sm text-ink-subtle">Opening 30…</p>;
  }

  return (
    <div className="min-h-dvh bg-[#F7F5FF] text-ink">
      <header className="border-b border-brand/15 bg-white/80 px-5 py-4 backdrop-blur-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">Chi · founder app</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">Maya → May · Sky → SK · 30 → Chi</h1>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-subtle">
          People stay. Three desks. Last door is saved on this PC.
          This PC · :3003 only · not Coming Soon · not :3000.
        </p>
        {!portOk ? (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            Open on Studio: http://127.0.0.1:3003/internal/30
          </p>
        ) : null}
      </header>

      <nav className="sticky top-0 z-10 grid grid-cols-5 gap-1 border-b border-brand/10 bg-[#F7F5FF]/95 p-2 backdrop-blur-sm" aria-label="30 doors">
        {(
          [
            ["sky", "Sky", "person"],
            ["maya", "Maya", "person"],
            ["sk", "SK", "Sky desk"],
            ["may", "May", "Maya desk"],
            ["30", "Chi", "you train"],
          ] as const
        ).map(([id, label, hint]) => {
          const on = state.door === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className={`rounded-xl px-2 py-3 text-center transition ${
                on ? "bg-ink text-white shadow-sm" : "bg-white text-ink hover:bg-brand/10"
              }`}
            >
              <span className="block font-display text-lg font-semibold">{label}</span>
              <span className={`block text-[10px] ${on ? "text-white/70" : "text-ink-subtle"}`}>{hint}</span>
            </button>
          );
        })}
      </nav>

      <main className="mx-auto max-w-3xl px-5 py-8">
        {state.door === "sky" ? (
          <DoorCard title="Sky" tag="PERSON · not SK">
            <p>永遠的家. Research. Write 刊 voice. Name does not change.</p>
            <p className="mt-2 font-mono text-[13px]">In Cursor: Ask Sky:</p>
            <p className="mt-1 text-ink-subtle">Home folder: C:\Users\Kieran\.ms-ad — do not start ShortKey on :3000.</p>
          </DoorCard>
        ) : null}

        {state.door === "maya" ? (
          <DoorCard title="Maya" tag="PERSON · not May">
            <p>One job: editorial. Lab :3008.</p>
            <p className="mt-2 font-mono text-[13px]">In Cursor: Ask Maya:</p>
            <a className="mt-4 inline-block rounded-xl bg-ink px-4 py-2 text-sm text-white" href="http://127.0.0.1:3008/internal/maya">
              Open Maya Lab :3008
            </a>
          </DoorCard>
        ) : null}

        {state.door === "sk" ? (
          <DoorCard title="SK" tag="Sky 加碼 · not Sky">
            <p>倒帶房 / Sky server files. Same Sky ability. Not a second AI.</p>
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-[13px] text-amber-950">
              Pause: server.py + pending.html not in either home. Do not invent. Bring files or say 唔等檔.
            </p>
          </DoorCard>
        ) : null}

        {state.door === "may" ? (
          <DoorCard title="May" tag="HELPS MAYA · not Maya">
            <p>Helper desk for editorial. Maya still writes the 刊.</p>
            <a className="mt-4 inline-block rounded-xl bg-ink px-4 py-2 text-sm text-white" href="http://127.0.0.1:3008/internal/maya">
              Open May → Maya Lab
            </a>
            <a className="mt-3 ml-2 inline-block rounded-xl border border-ink/15 px-4 py-2 text-sm" href="http://127.0.0.1:3003/internal/studio#maya">
              Studio Maya tab
            </a>
          </DoorCard>
        ) : null}

        {state.door === "30" ? (
          <section>
            <DoorCard title="Chi" tag="YOU TRAIN · old name 30">
              <p>Three outcomes. Empty room = pause. You last-yes before Deliver. Nothing publishes from an empty row.</p>
            </DoorCard>
            <div className="mt-4 grid gap-3">
              {BUTTONS.map((b) => {
                const on = state.lastButton === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => press(b.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      on ? "border-ink bg-ink text-white" : "border-brand/15 bg-white hover:border-brand/40"
                    }`}
                  >
                    <span className="font-display text-lg font-semibold">
                      {b.id} · {b.label}
                    </span>
                    <span className={`mt-1 block text-[13px] ${on ? "text-white/80" : "text-ink-subtle"}`}>{b.outcome}</span>
                    <span className={`mt-1 block font-mono text-[11px] ${on ? "text-white/60" : "text-ink-muted"}`}>
                      {b.positions}
                    </span>
                  </button>
                );
              })}
            </div>
            {state.lastButton ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[13px] text-amber-950">
                <p className="font-semibold">Pause with reason</p>
                <p className="mt-1">{state.pause}</p>
                <label className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.kieranYes}
                    onChange={(e) => save({ ...state, kieranYes: e.target.checked })}
                  />
                  Kieran yes — hold in Pending (do not publish)
                </label>
                <button
                  type="button"
                  disabled={!state.kieranYes}
                  onClick={deliver}
                  className="mt-3 rounded-xl bg-ink px-4 py-2 text-sm text-white disabled:opacity-40"
                >
                  Hold in Pending
                </button>
              </div>
            ) : null}
            <div className="mt-6">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand">Pending · this PC</h2>
              {state.pending.length === 0 ? (
                <p className="mt-2 text-[13px] text-ink-subtle">Empty. Nothing to drop — list lives in localStorage ({LS_KEY}).</p>
              ) : (
                <ul className="mt-2 space-y-2 text-[13px]">
                  {state.pending.map((row) => (
                    <li key={row} className="rounded-xl border border-brand/10 bg-white px-3 py-2">
                      {row}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-brand/10 px-5 py-4 text-[11px] text-ink-subtle">
        Now in <strong className="text-ink">{state.door}</strong>
        {" · "}
        Maya → May · Sky → SK · 30 → Chi
        {" · "}
        <a className="underline" href="/internal/studio">
          Studio
        </a>
      </footer>
    </div>
  );
}

function DoorCard({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-brand/15 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(140,130,252,0.06)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">{tag}</p>
      <h2 className="mt-1 font-display text-3xl font-semibold">{title}</h2>
      <div className="mt-3 text-[14px] leading-relaxed">{children}</div>
    </article>
  );
}
