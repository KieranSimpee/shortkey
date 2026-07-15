"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { scanPageElements, markScannedElements } from "@/lib/contentStudioScan";
import { cmsZones, type ZoneStatus } from "@/content/zones";
import type { ScannedElement } from "@/lib/contentStudioScan";

export type ZoneAnnotation = {
  status: ZoneStatus;
  notes: string;
  updatedAt: string;
};

type ContentStudioContextValue = {
  isOpen: boolean;
  isTargetMode: boolean;
  selectedZoneId: string | null;
  annotations: Record<string, ZoneAnnotation>;
  scannedElements: ScannedElement[];
  setOpen: (open: boolean) => void;
  setTargetMode: (on: boolean) => void;
  selectZone: (id: string | null) => void;
  updateAnnotation: (id: string, patch: Partial<ZoneAnnotation>) => void;
  setScannedElements: (elements: ScannedElement[]) => void;
  rescanPage: () => void;
  flaggedCount: number;
};

const STORAGE_KEY = "shortkey-content-studio";

const ContentStudioContext = createContext<ContentStudioContextValue | null>(null);

function loadAnnotations(): Record<string, ZoneAnnotation> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ZoneAnnotation>) : {};
  } catch {
    return {};
  }
}

function saveAnnotations(data: Record<string, ZoneAnnotation>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ContentStudioProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [isTargetMode, setTargetMode] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Record<string, ZoneAnnotation>>({});
  const [scannedElements, setScannedElements] = useState<ScannedElement[]>([]);

  useEffect(() => {
    setAnnotations(loadAnnotations());
  }, []);

  const selectZone = useCallback((id: string | null) => {
    setSelectedZoneId(id);
    if (id) setOpen(true);
  }, []);

  const updateAnnotation = useCallback((id: string, patch: Partial<ZoneAnnotation>) => {
    setAnnotations((prev) => {
      const current = prev[id] ?? {
        status: "none" as ZoneStatus,
        notes: "",
        updatedAt: new Date().toISOString(),
      };
      const next = {
        ...prev,
        [id]: {
          ...current,
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      };
      saveAnnotations(next);
      return next;
    });
  }, []);

  const flaggedCount = useMemo(
    () =>
      Object.values(annotations).filter(
        (a) => a.status !== "none" && a.status !== "approved",
      ).length,
    [annotations],
  );

  const rescanPage = useCallback(() => {
    const results = scanPageElements();
    setScannedElements(results);
    markScannedElements(results);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      isTargetMode,
      selectedZoneId,
      annotations,
      scannedElements,
      setOpen,
      setTargetMode,
      selectZone,
      updateAnnotation,
      setScannedElements,
      rescanPage,
      flaggedCount,
    }),
    [
      isOpen,
      isTargetMode,
      selectedZoneId,
      annotations,
      scannedElements,
      selectZone,
      updateAnnotation,
      rescanPage,
      flaggedCount,
    ],
  );

  return (
    <ContentStudioContext.Provider value={value}>
      {children}
    </ContentStudioContext.Provider>
  );
}

export function useContentStudio() {
  const ctx = useContext(ContentStudioContext);
  if (!ctx) {
    throw new Error("useContentStudio must be used within ContentStudioProvider");
  }
  return ctx;
}

export function useContentStudioSafe() {
  return useContext(ContentStudioContext);
}

export { cmsZones };
