"use client";

import { useMemo, useState } from "react";
import {
  cmsZones,
  zoneStatusLabels,
  zoneStatusColors,
  getZoneById,
  type ZoneStatus,
} from "@/content/zones";
import { useContentStudio } from "@/components/cms/ContentStudioProvider";
import { cn } from "@/lib/utils";

export function ContentStudioPanel() {
  const {
    isOpen,
    isTargetMode,
    selectedZoneId,
    annotations,
    scannedElements,
    setOpen,
    setTargetMode,
    selectZone,
    updateAnnotation,
    rescanPage,
    flaggedCount,
  } = useContentStudio();

  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const pageItems = useMemo(() => {
    if (scannedElements.length > 0) {
      return scannedElements.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        contentPath: getZoneById(item.id)?.contentPath ?? `Auto-scan · ${item.tag}.${item.kind}`,
        fields: getZoneById(item.id)?.fields ?? [item.className.split(" ").slice(0, 3).join(" ")],
        kind: item.kind,
      }));
    }

    return cmsZones.map((zone) => ({
      id: zone.id,
      label: zone.label,
      description: zone.description,
      contentPath: zone.contentPath,
      fields: zone.fields,
      kind: "zone" as const,
    }));
  }, [scannedElements]);

  const selected = selectedZoneId
    ? pageItems.find((item) => item.id === selectedZoneId) ?? null
    : null;
  const selectedAnnotation = selectedZoneId
    ? annotations[selectedZoneId] ?? { status: "none" as ZoneStatus, notes: "", updatedAt: "" }
    : null;

  const visibleItems = useMemo(() => {
    if (filter === "flagged") {
      return pageItems.filter((item) => {
        const status = annotations[item.id]?.status ?? "none";
        return status !== "none" && status !== "approved";
      });
    }
    return pageItems;
  }, [filter, annotations, pageItems]);

  const exportNotes = () => {
    const payload = pageItems.map((item) => ({
      id: item.id,
      label: item.label,
      kind: item.kind,
      contentPath: item.contentPath,
      ...annotations[item.id],
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shortkey-content-review-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyZoneBrief = () => {
    if (!selected || !selectedAnnotation) return;
    const text = [
      `Zone: ${selected.label} (${selected.id})`,
      `Status: ${zoneStatusLabels[selectedAnnotation.status]}`,
      `Content: ${selected.contentPath}`,
      selected.fields.length ? `Fields: ${selected.fields.join(", ")}` : "",
      selectedAnnotation.notes ? `Notes: ${selectedAnnotation.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <button
        type="button"
        data-content-studio-ui
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-float transition-all",
          isOpen ? "bg-ink text-white" : "bg-brand text-white hover:bg-brand-dark",
        )}
      >
        <StudioIcon />
        Content Studio
        {flaggedCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px]">
            {flaggedCount}
          </span>
        )}
      </button>

      <div
        data-content-studio-ui
        className={cn(
          "fixed inset-y-0 right-0 z-[99] flex w-full max-w-md flex-col border-l border-white/20 bg-[#faf9f7]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Content Studio</h2>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              Auto-scan divs & cards · target areas & flag changes
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-ink-muted hover:bg-ink/5"
            aria-label="Close panel"
          >
            ✕
          </button>
        </header>

        <div className="border-b border-ink/10 px-5 py-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
              Page scan
            </p>
            <button
              type="button"
              onClick={rescanPage}
              className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand hover:bg-brand/10"
            >
              Rescan
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-muted">
            {scannedElements.length > 0
              ? `${scannedElements.length} div/card blocks detected on this page`
              : "Open panel to auto-scan existing div and card blocks"}
          </p>
        </div>

        <div className="border-b border-ink/10 px-5 py-3">
          <button
            type="button"
            onClick={() => setTargetMode(!isTargetMode)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors",
              isTargetMode ? "bg-brand text-white" : "bg-white/60 text-ink hover:bg-white",
            )}
          >
            <span>
              <span className="block font-semibold">Target mode</span>
              <span className={cn("text-[11px]", isTargetMode ? "text-white/80" : "text-ink-muted")}>
                Click any highlighted div or card on the page
              </span>
            </span>
            <span
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                isTargetMode ? "bg-white/30" : "bg-ink/15",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                  isTargetMode ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </span>
          </button>
        </div>

        <div className="flex gap-2 border-b border-ink/10 px-5 py-3">
          {(["all", "flagged"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider",
                filter === f ? "bg-brand/15 text-brand" : "text-ink-muted hover:text-ink",
              )}
            >
              {f === "all" ? `All (${pageItems.length})` : `Flagged (${flaggedCount})`}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ul className="flex-1 overflow-y-auto px-3 py-2">
            {visibleItems.map((item) => {
              const ann = annotations[item.id];
              const status = ann?.status ?? "none";
              const isActive = selectedZoneId === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectZone(item.id)}
                    className={cn(
                      "mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      isActive ? "bg-brand/10" : "hover:bg-white/60",
                    )}
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-ink/10"
                      style={{
                        backgroundColor:
                          status !== "none" ? zoneStatusColors[status] : "transparent",
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="block text-sm font-medium text-ink">{item.label}</span>
                        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ink-muted">
                          {item.kind}
                        </span>
                      </span>
                      <span className="block truncate text-[11px] text-ink-muted">
                        {item.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected && selectedAnnotation && (
            <div className="border-t border-ink/10 bg-white/50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand">
                {selected.label}
              </h3>
              <p className="mt-1 text-[11px] text-ink-muted">{selected.description}</p>
              <p className="mt-2 rounded-lg bg-ink/5 px-2.5 py-1.5 font-mono text-[10px] text-ink-muted">
                {selected.contentPath}
              </p>

              <label className="mt-4 block text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Change status
              </label>
              <select
                value={selectedAnnotation.status}
                onChange={(e) =>
                  updateAnnotation(selected.id, {
                    status: e.target.value as ZoneStatus,
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand/40"
              >
                {(Object.keys(zoneStatusLabels) as ZoneStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {zoneStatusLabels[s]}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-[11px] font-medium uppercase tracking-wider text-ink-muted">
                Notes / change request
              </label>
              <textarea
                value={selectedAnnotation.notes}
                onChange={(e) => updateAnnotation(selected.id, { notes: e.target.value })}
                placeholder="Describe what should change in this area…"
                rows={4}
                className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-brand/40"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <ActionButton onClick={copyZoneBrief}>Copy brief</ActionButton>
                <ActionButton onClick={exportNotes}>Export all</ActionButton>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-[11px] font-medium text-ink-muted">
                  Editable fields
                </summary>
                <ul className="mt-2 space-y-1">
                  {selected.fields.map((field) => (
                    <li key={field} className="font-mono text-[10px] text-ink-muted">
                      {field}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
      </div>

      {isTargetMode && isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-ink/5"
          onClick={() => setTargetMode(false)}
          aria-hidden
        />
      )}
    </>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-ink hover:border-brand/30 hover:text-brand"
    >
      {children}
    </button>
  );
}

function StudioIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
