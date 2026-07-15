"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { siteContent } from "@/content/homepage";
import { cn } from "@/lib/utils";
import {
  compositeTryOnLayers,
  prepareTryOnSession,
  type FaceAnatomy,
  type TryOnColors,
} from "@/lib/tryOnEngine";

type CategoryId = "lip" | "blush" | "eyeshadow";
type ColorKey = "lip" | "cheek" | "eye";
type ShadeMap = Record<CategoryId, string | null>;

type Studio = typeof siteContent.hero.tryOnStudio;
type Category = Studio["categories"][number];

type ModelState = {
  lipColor: string | null;
  cheekColor: string | null;
  eyeColor: string | null;
  shadeIds: ShadeMap;
};

type Snapshot = {
  state: ModelState;
  previewUrl: string | null;
};

const EMPTY_SHADES: ShadeMap = {
  lip: null,
  blush: null,
  eyeshadow: null,
};

function categoryToColorKey(id: CategoryId): ColorKey {
  if (id === "blush") return "cheek";
  if (id === "eyeshadow") return "eye";
  return "lip";
}

function shadeHex(category: Category, shadeId: string) {
  return (
    category.shades.find((s) => s.id === shadeId)?.color ??
    category.shades[0]?.color ??
    "#E07A8A"
  );
}

function stateToColors(state: ModelState): TryOnColors {
  return {
    lip: state.lipColor,
    cheek: state.cheekColor,
    eye: state.eyeColor,
  };
}

function sleep(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
}

/**
 * Homepage virtual try-on:
 * - MediaPipe landmarks → lips / cheeks / eyelids
 * - Feathered masks → no hard spots
 * - Overlay compositing → base homepage asset stays untouched
 */
export function useHeroTryOnState() {
  const studio = siteContent.hero.tryOnStudio;
  const modelImage = siteContent.hero.tryOnModelImage;

  const [modelState, setModelState] = useState<ModelState>({
    lipColor: null,
    cheekColor: null,
    eyeColor: null,
    shadeIds: EMPTY_SHADES,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [building, setBuilding] = useState(false);
  const [landmarkSource, setLandmarkSource] = useState<"mediapipe" | "fallback" | null>(
    null,
  );

  /** Immutable base — never overwritten by makeup layers */
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const cleanUrlRef = useRef<string | null>(null);
  const anatomyRef = useRef<FaceAnatomy | null>(null);
  const stateRef = useRef(modelState);
  const previewRef = useRef(previewUrl);
  const historyRef = useRef<Snapshot[]>([]);
  const buildAbort = useRef(false);
  const renderGen = useRef(0);

  useEffect(() => {
    stateRef.current = modelState;
  }, [modelState]);
  useEffect(() => {
    previewRef.current = previewUrl;
  }, [previewUrl]);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    let cancelled = false;
    setStatus("Mapping facial landmarks…");
    void (async () => {
      try {
        const session = await prepareTryOnSession(modelImage);
        if (cancelled) return;
        baseRef.current = session.base;
        cleanUrlRef.current = session.cleanPreviewUrl;
        anatomyRef.current = session.anatomy;
        setLandmarkSource(session.anatomy.source);
        setPreviewUrl(session.cleanPreviewUrl);
        setReady(true);
        setStatus(
          session.anatomy.source === "mediapipe"
            ? "Landmarks mapped · pick a tint"
            : "Anatomy map ready · pick a tint",
        );
        window.setTimeout(() => setStatus(null), 1800);
      } catch (err) {
        console.warn("[try-on] session init failed", err);
        if (!cancelled) {
          setReady(false);
          setStatus("Could not prepare model");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [modelImage]);

  /** Always composite from immutable base — never mutate it */
  const renderOverlay = useCallback(async (state: ModelState) => {
    const base = baseRef.current;
    const anatomy = anatomyRef.current;
    if (!base || !anatomy) return null;

    const colors = stateToColors(state);
    const hasTint = Boolean(colors.lip || colors.cheek || colors.eye);
    const gen = ++renderGen.current;

    if (!hasTint) {
      const clean = cleanUrlRef.current;
      if (gen === renderGen.current && clean) setPreviewUrl(clean);
      return clean;
    }

    const url = compositeTryOnLayers(base, anatomy, colors);
    if (gen !== renderGen.current) return null;
    setPreviewUrl(url);
    return url;
  }, []);

  const pushHistory = useCallback(() => {
    const snap: Snapshot = {
      state: {
        ...stateRef.current,
        shadeIds: { ...stateRef.current.shadeIds },
      },
      previewUrl: previewRef.current,
    };
    const next = [...historyRef.current, snap].slice(-40);
    historyRef.current = next;
    setHistory(next);
  }, []);

  const applyColor = useCallback(
    async (area: CategoryId, shadeId: string) => {
      if (!ready || building) return;
      const cat = studio.categories.find((c) => c.id === area);
      if (!cat) return;
      const hex = shadeHex(cat, shadeId);
      const key = categoryToColorKey(area);

      pushHistory();
      const next: ModelState = {
        ...stateRef.current,
        shadeIds: { ...stateRef.current.shadeIds, [area]: shadeId },
        lipColor: key === "lip" ? hex : stateRef.current.lipColor,
        cheekColor: key === "cheek" ? hex : stateRef.current.cheekColor,
        eyeColor: key === "eye" ? hex : stateRef.current.eyeColor,
      };
      setModelState(next);
      setBusy(true);
      setStatus("Applying tint mask…");
      const url = await renderOverlay(next);
      setBusy(false);
      if (url) {
        const name = cat.shades.find((s) => s.id === shadeId)?.name ?? "Tint";
        setStatus(`${name} on landmark mask`);
        window.setTimeout(() => setStatus(null), 1200);
      }
    },
    [ready, building, studio.categories, pushHistory, renderOverlay],
  );

  const undoChange = useCallback(() => {
    if (building) return;
    const h = historyRef.current;
    if (h.length === 0) return;
    const prev = h[h.length - 1];
    const rest = h.slice(0, -1);
    historyRef.current = rest;
    setHistory(rest);
    setModelState(prev.state);
    setPreviewUrl(prev.previewUrl ?? cleanUrlRef.current);
    setStatus("Undone · base intact");
    window.setTimeout(() => setStatus(null), 1200);
  }, [building]);

  const resetLooks = useCallback(() => {
    if (building) return;
    pushHistory();
    const clean: ModelState = {
      lipColor: null,
      cheekColor: null,
      eyeColor: null,
      shadeIds: EMPTY_SHADES,
    };
    setModelState(clean);
    setPreviewUrl(cleanUrlRef.current);
    setStatus("Reset · base model restored");
    window.setTimeout(() => setStatus(null), 1400);
  }, [building, pushHistory]);

  const buildAllLooks = useCallback(async () => {
    if (!ready) return;
    if (building) {
      buildAbort.current = true;
      return;
    }
    pushHistory();
    buildAbort.current = false;
    setBuilding(true);

    const lipCat = studio.categories.find((c) => c.id === "lip")!;
    const cheekCat = studio.categories.find((c) => c.id === "blush")!;
    const eyeCat = studio.categories.find((c) => c.id === "eyeshadow")!;
    const total =
      lipCat.shades.length * cheekCat.shades.length * eyeCat.shades.length;

    let i = 0;
    let last = stateRef.current;

    try {
      for (const lip of lipCat.shades) {
        for (const cheek of cheekCat.shades) {
          for (const eye of eyeCat.shades) {
            if (buildAbort.current) break;
            i += 1;
            last = {
              lipColor: lip.color,
              cheekColor: cheek.color,
              eyeColor: eye.color,
              shadeIds: {
                lip: lip.id,
                blush: cheek.id,
                eyeshadow: eye.id,
              },
            };
            setModelState(last);
            setStatus(`Look ${i}/${total}`);
            await renderOverlay(last);
            await sleep(160);
          }
          if (buildAbort.current) break;
        }
        if (buildAbort.current) break;
      }
      setModelState(last);
      setStatus(
        buildAbort.current
          ? `Stopped · ${i}/${total}`
          : `${total} looks · base asset unchanged`,
      );
      window.setTimeout(() => setStatus(null), 2200);
    } finally {
      setBuilding(false);
      buildAbort.current = false;
    }
  }, [ready, building, pushHistory, studio.categories, renderOverlay]);

  const colors = useMemo(
    () => ({
      lip: modelState.lipColor ?? "#E07A8A",
      blush: modelState.cheekColor ?? "#F0A090",
      eyeshadow: modelState.eyeColor ?? "#A67C6D",
    }),
    [modelState],
  );

  return {
    studio,
    shadeIds: modelState.shadeIds,
    colors,
    applyColor,
    tryShade: applyColor,
    undoChange,
    resetLooks,
    buildAllLooks,
    status,
    busy,
    generating: busy || building,
    building,
    ready,
    canUndo: history.length > 0,
    previewUrl,
    modelImage,
    landmarkSource,
  };
}

export type HeroTryOnState = ReturnType<typeof useHeroTryOnState>;

export function HeroTryOnModelCutout({
  src,
  tryOn,
}: {
  src: string;
  tryOn: HeroTryOnState;
}) {
  const displaySrc = tryOn.previewUrl ?? src;

  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-10 top-0 flex min-h-0 items-end justify-center overflow-visible sm:-bottom-12">
      <div className="absolute left-1/2 top-[6%] h-[34%] w-[64%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(214,198,245,0.18)_45%,transparent_70%)] blur-3xl" />
      <div className="relative z-[1] flex h-full w-full min-h-0 items-end justify-center pb-2">
        <div className="relative inline-block h-[106%] max-w-none origin-bottom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt=""
            width={1024}
            height={1536}
            className="hero-model-blend h-full w-auto max-w-none"
          />
          <span className="pointer-events-none absolute bottom-[12%] left-1/2 z-[2] w-[min(90%,15rem)] -translate-x-1/2 rounded-full border border-white/50 bg-white/85 px-3 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-ink shadow-sm backdrop-blur-md">
            {tryOn.status ??
              (tryOn.ready
                ? tryOn.landmarkSource === "mediapipe"
                  ? "Landmark masks · overlay only"
                  : "Anatomy masks · overlay only"
                : "Mapping landmarks…")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroTryOnPanel({ tryOn }: { tryOn: HeroTryOnState }) {
  const { studio, shadeIds } = tryOn;

  return (
    <div className="flex w-[min(100%,17.5rem)] flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-[0_12px_40px_rgba(80,60,120,0.12)] backdrop-blur-[10px]">
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
            {studio.title}
          </p>
          <p className="mt-1 text-[8px] font-medium leading-snug text-ink-muted">
            Landmark masks · feathered blend · base asset never overwritten
          </p>
        </div>

        <ul className="flex flex-col gap-0 border-t border-white/30">
          {studio.categories.map((cat) => {
            const id = cat.id as CategoryId;
            const shadeId = shadeIds[id];

            return (
              <li key={cat.id} className="border-b border-white/25 px-2.5 py-2.5 last:border-b-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white/60">
                    <Image src={cat.image} alt="" fill className="object-cover" sizes="32px" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">
                    {cat.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5" role="listbox" aria-label={`${cat.label} colors`}>
                  {cat.shades.map((s) => {
                    const selected = s.id === shadeId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        title={s.name}
                        disabled={!tryOn.ready || (tryOn.busy && !tryOn.building)}
                        onClick={() => void tryOn.applyColor(id, s.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-lg p-1 transition",
                          selected ? "bg-brand/15 ring-1 ring-brand/40" : "hover:bg-white/40",
                          !tryOn.ready && "opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "h-7 w-7 rounded-full border-2 shadow-sm",
                            selected ? "border-brand" : "border-white/80",
                          )}
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="max-w-[3.2rem] truncate text-[7px] font-semibold uppercase tracking-[0.06em] text-ink">
                          {s.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-2 border-t border-white/30 p-2.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => tryOn.undoChange()}
              disabled={!tryOn.canUndo || tryOn.building}
              className="flex flex-1 items-center justify-center rounded-full border border-ink/20 bg-white/70 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-white disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => tryOn.resetLooks()}
              disabled={!tryOn.ready || tryOn.building}
              className="flex flex-1 items-center justify-center rounded-full border border-ink/20 bg-white/70 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-white disabled:opacity-40"
            >
              Reset
            </button>
          </div>
          <button
            type="button"
            onClick={() => void tryOn.buildAllLooks()}
            disabled={!tryOn.ready}
            className="flex w-full items-center justify-center rounded-full bg-ink px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand disabled:opacity-60"
          >
            {tryOn.building ? "Stop" : "Build all looks"}
          </button>
          <p className="text-[8px] font-medium text-ink-muted">
            {tryOn.status ??
              (tryOn.ready
                ? "Overlays only · homepage asset stays intact"
                : "Detecting facial landmarks…")}
          </p>
        </div>
      </div>
    </div>
  );
}
