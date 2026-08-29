"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MAKEUP_TRYON_DEFAULT_ID,
  MAKEUP_TRYON_SLOTS,
  getMakeupTryOnById,
  makeupTryOnBySlot,
  type MakeupTryOnItem,
  type MakeupTryOnSlot,
} from "@/content/makeupTryOnDemo";

type Props = {
  /** Prefill from ?sku= */
  initialSku?: string;
  className?: string;
};

function FaceSim({ item }: { item: MakeupTryOnItem }) {
  const o = item.overlay;
  return (
    <div
      className="relative mx-auto h-44 w-full max-w-sm overflow-hidden rounded-xl border border-brand/25"
      style={{
        background: o.base
          ? `radial-gradient(circle at 50% 42%, ${o.base} 0%, #f0d8d4 35%, #e8c4bd 55%, transparent 70%), linear-gradient(180deg, #efe6d8, #e5dccb)`
          : "radial-gradient(circle at 50% 42%, #f0d8d4 0%, #e8c4bd 38%, transparent 62%), linear-gradient(180deg, #efe6d8, #e5dccb)",
      }}
      aria-hidden
    >
      {o.eye ? (
        <>
          <span
            className="absolute left-[28%] top-[38%] h-2 w-8 rounded-full opacity-90 blur-[1px]"
            style={{ background: o.eye }}
          />
          <span
            className="absolute right-[28%] top-[38%] h-2 w-8 rounded-full opacity-90 blur-[1px]"
            style={{ background: o.eye }}
          />
        </>
      ) : null}
      {o.cheek ? (
        <>
          <span
            className="absolute left-[26%] top-[48%] h-5 w-8 rounded-full blur-[2px]"
            style={{ background: o.cheek }}
          />
          <span
            className="absolute right-[26%] top-[48%] h-5 w-8 rounded-full blur-[2px]"
            style={{ background: o.cheek }}
          />
        </>
      ) : null}
      {o.lip ? (
        <span
          className="absolute bottom-[26%] left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-[40%]"
          style={{ background: o.lip }}
        />
      ) : null}
    </div>
  );
}

export function MakeupTryOnSimulator({ initialSku, className }: Props) {
  const fromSku = initialSku
    ? makeupTryOnBySlot("lip")
        .concat(makeupTryOnBySlot("blush"), makeupTryOnBySlot("eye"), makeupTryOnBySlot("base"))
        .find((p) => p.sku.toUpperCase() === initialSku.toUpperCase())
    : undefined;

  const [slot, setSlot] = useState<MakeupTryOnSlot>(fromSku?.slot ?? "lip");
  const [selectedId, setSelectedId] = useState(fromSku?.id ?? MAKEUP_TRYON_DEFAULT_ID);

  const items = useMemo(() => makeupTryOnBySlot(slot), [slot]);
  const selected = getMakeupTryOnById(selectedId) ?? items[0] ?? getMakeupTryOnById(MAKEUP_TRYON_DEFAULT_ID)!;

  const pick = (item: MakeupTryOnItem) => {
    setSelectedId(item.id);
    setSlot(item.slot);
  };

  return (
    <section
      className={cn(
        "rounded-2xl border border-brand/25 bg-white/50 p-5 sm:p-6",
        className,
      )}
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
        SIMULATOR · NOT LIVE BANUBA / TINT
      </p>
      <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-ink">Makeup try-on</h2>
      <p className="mt-1 max-w-xl text-sm text-ink-muted">
        Select lipstick, blush, eye, or base. Overlay is local CSS on a face placeholder — correlated to
        catalog makeup, not a live AR session.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {MAKEUP_TRYON_SLOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSlot(s.id);
              const first = makeupTryOnBySlot(s.id)[0];
              if (first) setSelectedId(first.id);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition",
              slot === s.id
                ? "border-brand bg-brand/10 text-brand"
                : "border-ink/15 text-ink-muted hover:border-ink/30",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <FaceSim item={selected} />
          <div className="mt-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink">{selected.name}</p>
            <p className="mt-0.5 font-mono text-[10px] text-ink-subtle">
              {selected.shadeName} · {selected.sku}
              {selected.editorial ? " · editorial placeholder" : ""}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((item) => {
            const active = item.id === selected.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => pick(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-brand/50 bg-brand/8"
                      : "border-white/60 bg-white/40 hover:border-brand/25",
                  )}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-ink/10"
                    style={{ background: item.color }}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-ink">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] text-ink-subtle">
                      {item.type} · {item.shadeName}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/shop/${selected.sku}`}
          className="inline-block rounded-full bg-ink px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-ink/90"
        >
          View product →
        </Link>
        <Link
          href="/magazine-demo/#/try-on"
          className="inline-block rounded-full border border-ink/20 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted transition hover:border-brand/40"
        >
          Magazine demo try-on
        </Link>
      </div>
    </section>
  );
}
