"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { StickerGlyph } from "@/components/social/StickerGlyph";
import {
  DECORATE_TARGETS,
  STICKER_DNA_STATUS,
  STICKER_HARD_RULES,
  STICKER_PACKS,
  STICKER_REVIEW_STATUS,
  STICKER_STORAGE_KEY,
  MAX_STICKERS_PER_TARGET,
  emptyPlacementState,
  findSticker,
  type DecorateTargetId,
  type StickerPackId,
  type StickerPlacement,
  type StickerPlacementState,
} from "@/lib/social/stickerPacks";
import "./sticker-emoji-tray.css";

/**
 * StickerEmoji Tray — ShortKey visual language for Influencer Portal previews.
 * Built-in SVG packs only · localStorage placements · UNDER_REVIEW / GOR_GOR_REVIEW.
 * Same cultural line as Fan Sticker Wall — not random emoji chaos.
 */

function loadState(): StickerPlacementState {
  try {
    const raw = localStorage.getItem(STICKER_STORAGE_KEY);
    if (!raw) return emptyPlacementState();
    const parsed = JSON.parse(raw) as StickerPlacementState;
    if (!parsed || !Array.isArray(parsed.placements)) return emptyPlacementState();
    return {
      ...emptyPlacementState(),
      placements: parsed.placements.filter(
        (p) => p && typeof p.stickerId === "string" && typeof p.targetId === "string",
      ),
    };
  } catch {
    return emptyPlacementState();
  }
}

function saveState(state: StickerPlacementState) {
  try {
    localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function StickerEmojiTray() {
  const [packId, setPackId] = useState<StickerPackId>("shortkey-native");
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<StickerPlacement[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const state = loadState();
    setPlacements(state.placements);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({
      version: "0.1",
      status: STICKER_REVIEW_STATUS,
      dna: STICKER_DNA_STATUS,
      placements,
    });
  }, [placements, hydrated]);

  const activePack = STICKER_PACKS.find((p) => p.id === packId) ?? STICKER_PACKS[0];

  const placeOnTarget = (targetId: DecorateTargetId, e: MouseEvent<HTMLElement>) => {
    if (!selectedStickerId) {
      setHint("Pick a StickerEmoji from the tray first.");
      return;
    }
    const onTarget = placements.filter((p) => p.targetId === targetId);
    if (onTarget.length >= MAX_STICKERS_PER_TARGET) {
      setHint(`Max ${MAX_STICKERS_PER_TARGET} stickers per preview card.`);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    const next: StickerPlacement = {
      id: `pl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      stickerId: selectedStickerId,
      targetId,
      x,
      y,
      placedAt: new Date().toISOString(),
    };
    setPlacements((prev) => [...prev, next]);
    setHint(null);
  };

  const removePlacement = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setPlacements((prev) => prev.filter((p) => p.id !== id));
  };

  const clearTarget = (targetId: DecorateTargetId) => {
    setPlacements((prev) => prev.filter((p) => p.targetId !== targetId));
  };

  const clearAll = () => {
    setPlacements([]);
    setSelectedStickerId(null);
    setHint(null);
  };

  return (
    <section className="sk-sticker" aria-labelledby="sticker-emoji-tray">
      <div className="sk-sticker__head">
        <p className="sk-sticker__eyebrow">StickerEmoji · ShortKey visual language</p>
        <h2 id="sticker-emoji-tray" className="sk-sticker__title">
          StickerEmoji Tray
        </h2>
        <p className="sk-sticker__lede">
          Decorate preview cards with ShortKey-owned chips — same cultural line as Fan
          Sticker Wall, not random emoji chaos. Built-in packs only.
        </p>
        <div className="sk-sticker__status-row" aria-label="Review status">
          <span className="sk-sticker__badge">{STICKER_REVIEW_STATUS}</span>
          <span className="sk-sticker__badge sk-sticker__badge--dna">{STICKER_DNA_STATUS}</span>
        </div>
      </div>

      <details className="sk-sticker__rules">
        <summary>Hard rules (locked)</summary>
        <ul>
          {STICKER_HARD_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </details>

      {/* Pack tabs + tray */}
      <div className="sk-sticker__tray" role="region" aria-label="Sticker pack tray">
        <div className="sk-sticker__packs" role="tablist" aria-label="Sticker packs">
          {STICKER_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              role="tab"
              aria-selected={packId === pack.id}
              className={`sk-sticker__pack${packId === pack.id ? " is-active" : ""}`}
              onClick={() => setPackId(pack.id)}
            >
              <span className="sk-sticker__pack-name">{pack.name}</span>
              <span className="sk-sticker__pack-lane">{pack.lane}</span>
            </button>
          ))}
        </div>

        <p className="sk-sticker__howto">
          Select a chip → click a preview card to place · click a placed chip to remove
        </p>

        <div className="sk-sticker__chips" role="listbox" aria-label={`${activePack.name} stickers`}>
          {activePack.stickers.map((sticker) => {
            const selected = selectedStickerId === sticker.id;
            return (
              <button
                key={sticker.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`sk-sticker__chip sk-sticker__chip--${sticker.tint}${selected ? " is-selected" : ""}`}
                onClick={() =>
                  setSelectedStickerId((cur) => (cur === sticker.id ? null : sticker.id))
                }
                title={sticker.label}
              >
                <StickerGlyph kind={sticker.glyph} tint={sticker.tint} title={sticker.label} />
                <span className="sk-sticker__chip-label">{sticker.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sk-sticker__tray-actions">
          <button type="button" className="sk-sticker__ghost" onClick={clearAll}>
            Clear all placements
          </button>
          <p className="sk-sticker__storage">
            localStorage · {STICKER_STORAGE_KEY} · this device · staging
          </p>
        </div>
        {hint ? (
          <p className="sk-sticker__hint" role="status">
            {hint}
          </p>
        ) : null}
      </div>

      {/* Decorate targets */}
      <div className="sk-sticker__targets">
        <h3 className="sk-sticker__targets-title">Decorate targets</h3>
        <p className="sk-sticker__targets-lede">
          Preview cards only — not live profiles, campaigns, or shop publish.
        </p>
        <ul className="sk-sticker__target-grid">
          {DECORATE_TARGETS.map((target) => {
            const onCard = placements.filter((p) => p.targetId === target.id);
            return (
              <li key={target.id} className="sk-sticker__target-item">
                <div className="sk-sticker__target-meta">
                  <p className="sk-sticker__target-kicker">{target.kicker}</p>
                  <div className="sk-sticker__target-actions">
                    <span className="sk-sticker__mini-badge">{STICKER_REVIEW_STATUS}</span>
                    {onCard.length > 0 ? (
                      <button
                        type="button"
                        className="sk-sticker__ghost sk-sticker__ghost--sm"
                        onClick={() => clearTarget(target.id)}
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className={`sk-sticker__canvas${selectedStickerId ? " is-ready" : ""}`}
                  onClick={(e) => placeOnTarget(target.id, e)}
                  aria-label={`Place sticker on ${target.label}`}
                >
                  <span className="sk-sticker__canvas-label">{target.label}</span>
                  <span className="sk-sticker__canvas-blurb">{target.blurb}</span>
                  {onCard.map((pl) => {
                    const def = findSticker(pl.stickerId);
                    if (!def) return null;
                    return (
                      <span
                        key={pl.id}
                        className="sk-sticker__placed"
                        style={{ left: `${pl.x}%`, top: `${pl.y}%` }}
                        role="button"
                        tabIndex={0}
                        title={`${def.label} — click to remove`}
                        onClick={(e) => removePlacement(pl.id, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            removePlacement(pl.id, e as unknown as MouseEvent);
                          }
                        }}
                      >
                        <StickerGlyph kind={def.glyph} tint={def.tint} title={def.label} />
                      </span>
                    );
                  })}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sk-sticker__footer-note">
        P0 prototype · SVG/CSS chips · no creator uploads · no production claim · all
        decorated submissions stay {STICKER_REVIEW_STATUS} / {STICKER_DNA_STATUS}.
      </p>
    </section>
  );
}
