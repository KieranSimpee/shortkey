"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  applyScanHighlights,
  clearScannedMarks,
  markScannedElements,
  scanPageElements,
  scrollToScannedElement,
  STUDIO_ATTR,
} from "@/lib/contentStudioScan";
import { useContentStudio } from "@/components/cms/ContentStudioProvider";

export function ContentStudioAutoScan() {
  const pathname = usePathname();
  const {
    isOpen,
    isTargetMode,
    selectedZoneId,
    annotations,
    scannedElements,
    setScannedElements,
    selectZone,
  } = useContentStudio();

  const runScan = useCallback(() => {
    const results = scanPageElements();
    setScannedElements(results);
    markScannedElements(results);
    return results;
  }, [setScannedElements]);

  useEffect(() => {
    if (!isOpen) {
      clearScannedMarks();
      return;
    }

    const timer = window.setTimeout(() => {
      runScan();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isOpen, pathname, runScan]);

  useEffect(() => {
    if (!isOpen) return;

    const rescan = () => runScan();
    window.addEventListener("resize", rescan);
    return () => window.removeEventListener("resize", rescan);
  }, [isOpen, runScan]);

  useEffect(() => {
    if (!selectedZoneId) return;
    scrollToScannedElement(selectedZoneId);
  }, [selectedZoneId]);

  useEffect(() => {
    const annotatedIds = new Set(
      Object.entries(annotations)
        .filter(([, value]) => value.status !== "none")
        .map(([id]) => id),
    );

    applyScanHighlights({
      active: isOpen || isTargetMode,
      selectedId: selectedZoneId,
      annotatedIds,
    });
  }, [annotations, isOpen, isTargetMode, scannedElements, selectedZoneId]);

  useEffect(() => {
    if (!isTargetMode) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const scanned = target?.closest(`[${STUDIO_ATTR}]`);
      if (!scanned) return;

      event.preventDefault();
      event.stopPropagation();

      const id = scanned.getAttribute(STUDIO_ATTR);
      if (id) selectZone(id);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isTargetMode, selectZone]);

  useEffect(() => () => clearScannedMarks(), []);

  return null;
}
