"use client";

import { useCallback, useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { POWERED_BY_AI_FAMILY } from "@/content/aiFamilyCredit";
import { PORTAL_LANES, laneCopy, type PortalLane, type PortalStory } from "@/lib/portal/types";

type View = "entrance" | "cards" | "story";
type LoadState = "idle" | "loading" | "ready" | "error";

function storyImageSrc(url: string): string {
  if (url.startsWith("/")) return url;
  if (url.startsWith("https://")) return url;
  return "/logo/shortkey-primary.png";
}

export function MobilePortal() {
  const [view, setView] = useState<View>("entrance");
  const [lane, setLane] = useState<PortalLane | null>(null);
  const [stories, setStories] = useState<PortalStory[]>([]);
  const [source, setSource] = useState<"airtable" | "seed" | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const openLane = useCallback(async (nextLane: PortalLane) => {
    setLane(nextLane);
    setView("story");
    setLoadState("loading");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/portal/stories?lane=${nextLane}`, {
        cache: "no-store",
      });
      const body = (await res.json()) as {
        ok?: boolean;
        source?: "airtable" | "seed";
        stories?: PortalStory[];
        error?: string;
      };
      if (!res.ok || !body.ok || !body.stories) {
        throw new Error(body.error || "Stories could not load.");
      }
      setStories(body.stories);
      setSource(body.source ?? "seed");
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setErrorMessage(error instanceof Error ? error.message : "Stories could not load.");
      setStories([]);
    }
  }, []);

  useEffect(() => {
    if (view !== "story") {
      setLoadState("idle");
    }
  }, [view]);

  return (
    <div className="portal-shell portal-rice-paper relative flex min-h-dvh flex-col text-ink">
      {view === "entrance" ? (
        <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
          <Logo href={false} size="hero" className="mx-auto object-center" />
          <p className="mt-8 max-w-xs text-center font-display text-lg font-semibold leading-snug tracking-tight text-ink">
            ShortKey 不模仿畫面。
            <br />
            ShortKey 捕捉生命力。
          </p>
          <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-ink-muted">
            Open on a phone. Thirty seconds. The soul, not a store.
          </p>
          <button
            type="button"
            onClick={() => setView("cards")}
            className="mt-10 min-h-14 w-full max-w-xs rounded-full bg-brand px-6 text-base font-semibold text-white shadow-float transition active:scale-[0.98]"
          >
            體驗 ShortKey 生命力
          </button>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
            Feel ShortKey&apos;s life force
          </p>
          <p className="mt-10 text-center text-[10px] text-ink-muted/70">{POWERED_BY_AI_FAMILY}</p>
        </section>
      ) : null}

      {view === "cards" ? (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setView("entrance")}
            className="self-start text-sm text-ink-muted"
          >
            ← Entrance
          </button>
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Choose a door</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Three cards. No App Store. GitHub deploy updates this page.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {PORTAL_LANES.map((item) => {
              const copy = laneCopy(item);
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => {
                      void openLane(item);
                    }}
                    className="w-full rounded-card bg-silk-light/80 p-5 text-left shadow-card ring-1 ring-brand/15 backdrop-blur-sm transition active:scale-[0.99]"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
                      {copy.zh}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">{copy.en}</p>
                    <p className="mt-2 text-sm text-ink-muted">{copy.hint}</p>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-auto pt-10 text-center text-[10px] text-ink-muted/70">
            {POWERED_BY_AI_FAMILY}
          </p>
        </section>
      ) : null}

      {view === "story" && lane ? (
        <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => {
              setView("cards");
              setLane(null);
              setStories([]);
              setSource(null);
            }}
            className="self-start text-sm text-ink-muted"
          >
            ← Doors
          </button>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
            {laneCopy(lane).zh}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
            {laneCopy(lane).en}
          </h1>
          {source ? (
            <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
              {source === "airtable" ? "Live from Airtable" : "DNA seed · Airtable not connected"}
            </p>
          ) : null}

          {loadState === "loading" ? (
            <p className="mt-10 text-sm text-ink-muted">Loading stories…</p>
          ) : null}

          {loadState === "error" ? (
            <p className="mt-10 text-sm text-ink-muted">{errorMessage}</p>
          ) : null}

          {loadState === "ready" && stories.length === 0 ? (
            <p className="mt-10 text-sm text-ink-muted">
              This lane is empty. Add rows in Airtable when the base is ready.
            </p>
          ) : null}

          {loadState === "ready" ? (
            <ul className="mt-8 flex flex-col gap-6">
              {stories.map((story) => (
                <li
                  key={story.id}
                  className="overflow-hidden rounded-card bg-silk-light/90 shadow-card ring-1 ring-brand/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={storyImageSrc(story.imageUrl)}
                    alt=""
                    className="mx-auto h-20 w-auto object-contain p-4"
                  />
                  <div className="px-5 pb-5">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-ink-subtle">
                      {story.brandName}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold leading-snug">
                      {story.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{story.story}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-auto pt-10 text-center text-[10px] text-ink-muted/70">
            {POWERED_BY_AI_FAMILY}
          </p>
        </section>
      ) : null}
    </div>
  );
}
