"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import defaultPosition from "@/content/heroLogoPosition.json";

type Pos = {
  locked: boolean;
  xPercent: number;
  yPercent: number;
  /** Narrow viewports — same top-seam Y as desktop (hero is always side-by-side) */
  yPercentMobile?: number;
  scale: number;
};

type Props = {
  heroRef: React.RefObject<HTMLElement | null>;
};

const STORAGE_KEY = "shortkey-hero-logo-draft";
const MOBILE_MQ = "(max-width: 767px)";

/**
 * Brand bridge — lilac logo at top-middle of dual-hero vertical seam (no welcome line).
 * Overlaps both Creator | Brand banners. No glow/shadow. `/?editLogo=1` → drag → Lock.
 */
export function HeroLogoPlacer({ heroRef }: Props) {
  const search = useSearchParams();
  const editMode = search.get("editLogo") === "1";

  const [pos, setPos] = useState<Pos>(defaultPosition as Pos);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const posRef = useRef(pos);
  posRef.current = pos;

  const dragStart = useRef<{
    pointerX: number;
    pointerY: number;
    xPercent: number;
    yPercent: number;
  } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Load saved position once (don't overwrite while dragging)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const draft =
          editMode && typeof window !== "undefined"
            ? window.sessionStorage.getItem(STORAGE_KEY)
            : null;
        if (draft) {
          const parsed = JSON.parse(draft) as Pos;
          if (!cancelled) {
            setPos(parsed);
            setReady(true);
            return;
          }
        }
        const res = await fetch("/api/brand/hero-logo-position");
        const j = (await res.json()) as { ok?: boolean; position?: Pos };
        if (!cancelled && j.ok && j.position) setPos(j.position);
      } catch {
        /* keep default */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editMode]);

  // Persist draft while editing so drop doesn't "snap back"
  useEffect(() => {
    if (!editMode || !ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch {
      /* ignore */
    }
  }, [pos, editMode, ready]);

  const activeY =
    isMobile && typeof pos.yPercentMobile === "number"
      ? pos.yPercentMobile
      : pos.yPercent;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!editMode || !heroRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      xPercent: posRef.current.xPercent,
      yPercent: isMobile
        ? (posRef.current.yPercentMobile ?? posRef.current.yPercent)
        : posRef.current.yPercent,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !dragStart.current || !heroRef.current) return;
    e.preventDefault();
    const box = heroRef.current.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    const dx = ((e.clientX - dragStart.current.pointerX) / box.width) * 100;
    const dy = ((e.clientY - dragStart.current.pointerY) / box.height) * 100;
    const nextY = clamp(dragStart.current.yPercent + dy, 0, 100);
    setPos((p) => ({
      ...p,
      locked: false,
      xPercent: clamp(dragStart.current!.xPercent + dx, 0, 100),
      ...(isMobile ? { yPercentMobile: nextY } : { yPercent: nextY }),
    }));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    e.preventDefault();
    dragStart.current = null;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    setStatus("Dropped — click Lock to save");
  }

  async function lockPosition() {
    const payload = {
      ...posRef.current,
      locked: true,
      yPercentMobile: posRef.current.yPercentMobile ?? 50,
    };
    setStatus("Saving…");
    try {
      const res = await fetch("/api/brand/hero-logo-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = (await res.json()) as {
        ok?: boolean;
        position?: Pos;
        error?: string;
      };
      if (!j.ok || !j.position) throw new Error(j.error || "save failed");
      setPos(j.position);
      sessionStorage.removeItem(STORAGE_KEY);
      setStatus("Locked ✓ saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Lock failed");
    }
  }

  function unlockForEdit() {
    setPos((p) => ({ ...p, locked: false }));
    setStatus("Unlocked — drag to place, then Lock");
  }

  const mark = (
    <div
      className={cn(
        "relative",
        editMode && "rounded-full ring-2 ring-brand/80 ring-offset-2 ring-offset-transparent",
      )}
    >
      <Logo
        href={false}
        size="bridge"
        surface="dark"
        className="pointer-events-none max-h-[min(11vh,88px)] w-auto select-none object-contain object-center"
      />
    </div>
  );

  const lockup = editMode ? (
    mark
  ) : (
    <Link href="/" className="pointer-events-auto block" aria-label="shortkey home">
      {mark}
    </Link>
  );

  return (
    <>
      <div
        role={editMode ? "button" : undefined}
        tabIndex={editMode ? 0 : undefined}
        aria-label={editMode ? "Drag to place brand bridge" : "shortkey logo"}
        className={cn(
          "absolute z-[50]",
          editMode ? "cursor-grab touch-none" : "pointer-events-none",
          dragging && "cursor-grabbing z-[60]",
        )}
        style={{
          left: `${pos.xPercent}%`,
          top: `${activeY}%`,
          transform: `translate(-50%, -50%) scale(${pos.scale})`,
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {lockup}
      </div>

      {editMode ? (
        <div
          className="absolute bottom-3 right-3 z-[40] w-[240px] rounded-xl border border-brand/30 bg-white/95 p-3 text-[11px] text-ink shadow-lg backdrop-blur sm:bottom-6 sm:right-6"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
            Brand bridge · lock
          </p>
          <p className="mt-1 text-ink-muted">
            Drag lockup on seam → Lock
            {isMobile ? " (mobile Y)" : " (desktop Y)"}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-[10px] text-ink-subtle">
            <span>X {pos.xPercent.toFixed(1)}%</span>
            <span>
              Y{" "}
              {(isMobile ? (pos.yPercentMobile ?? pos.yPercent) : pos.yPercent).toFixed(1)}%
            </span>
            <span>×{pos.scale.toFixed(2)}</span>
          </div>
          <label className="mt-2 flex items-center gap-2 text-ink-muted">
            Scale
            <input
              type="range"
              min={0.6}
              max={1.5}
              step={0.05}
              value={pos.scale}
              onChange={(e) =>
                setPos((p) => ({
                  ...p,
                  locked: false,
                  scale: Number(e.target.value),
                }))
              }
              className="flex-1"
            />
          </label>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={unlockForEdit}
              className="flex-1 rounded-full border border-brand/30 px-2 py-1.5 font-semibold uppercase tracking-[0.1em] text-brand"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={() => void lockPosition()}
              className="flex-1 rounded-full bg-brand px-2 py-1.5 font-semibold uppercase tracking-[0.1em] text-white"
            >
              Lock
            </button>
          </div>
          {status ? (
            <p className="mt-2 text-[10px] font-medium text-brand">{status}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
