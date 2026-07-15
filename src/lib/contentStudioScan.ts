import { cmsZones, getZoneById } from "@/content/zones";

export type ScannedElement = {
  id: string;
  label: string;
  description: string;
  kind: "zone" | "card" | "div";
  tag: string;
  className: string;
};

const CARD_SELECTORS = [
  "[data-cms-zone]",
  ".panel-card",
  ".panel-card-highlight",
  ".panel-card-inner",
  ".panel-meta-strip",
  ".panel-stat-box",
  ".section-panel",
  ".folder-panel",
].join(",");

const STUDIO_ATTR = "data-studio-scan-id";
const HIGHLIGHT_CLASS = "content-studio-scan-highlight";
const SELECTED_CLASS = "content-studio-scan-selected";

function isStudioUiElement(element: Element) {
  return Boolean(element.closest("[data-content-studio-ui]"));
}

function filterOutermostMatches(elements: Element[]) {
  return elements.filter((element) => {
    if (isStudioUiElement(element)) return false;

    let parent = element.parentElement;
    while (parent) {
      if (elements.includes(parent)) return false;
      if (parent.matches(CARD_SELECTORS)) return false;
      parent = parent.parentElement;
    }

    return true;
  });
}

function truncate(text: string, max = 72) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}

function classNameOf(element: Element) {
  const value = element.getAttribute("class") ?? "";
  return typeof value === "string" ? value : String(value);
}

function deriveLabel(element: Element) {
  const zoneId = element.getAttribute("data-cms-zone");
  if (zoneId) {
    return getZoneById(zoneId)?.label ?? zoneId;
  }

  const heading = element.querySelector(
    "h1, h2, h3, h4, .type-section-muted, .panel-field-label",
  );
  if (heading?.textContent?.trim()) {
    return truncate(heading.textContent, 48);
  }

  const classLabel = classNameOf(element)
    .split(/\s+/)
    .find((token) => token.startsWith("panel-") || token.includes("card"));

  if (classLabel) {
    return classLabel.replace(/-/g, " ");
  }

  return `${element.tagName.toLowerCase()} block`;
}

function deriveDescription(element: Element) {
  const zoneId = element.getAttribute("data-cms-zone");
  if (zoneId) {
    return getZoneById(zoneId)?.description ?? "Defined Content Studio zone";
  }

  const preview = truncate(element.textContent ?? "", 96);
  const classes = classNameOf(element)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");

  return classes ? `${preview} · ${classes}` : preview;
}

function deriveKind(element: Element): ScannedElement["kind"] {
  if (element.hasAttribute("data-cms-zone")) return "zone";
  const className = classNameOf(element);
  if (className.includes("card") || className.includes("panel-")) {
    return "card";
  }
  return "div";
}

function buildScanId(element: Element, index: number) {
  const zoneId = element.getAttribute("data-cms-zone");
  if (zoneId) return zoneId;

  const signature =
    classNameOf(element)
      .split(/\s+/)
      .find((token) => token.startsWith("panel-") || token.includes("card")) ??
    element.tagName.toLowerCase();

  return `scan:${signature}:${index}`;
}

export function scanPageElements(): ScannedElement[] {
  if (typeof document === "undefined") return [];

  const matches = filterOutermostMatches(Array.from(document.querySelectorAll(CARD_SELECTORS)));

  return matches.map((element, index) => {
    const id = buildScanId(element, index);

    return {
      id,
      label: deriveLabel(element),
      description: deriveDescription(element),
      kind: deriveKind(element),
      tag: element.tagName.toLowerCase(),
      className: classNameOf(element),
    };
  });
}

export function markScannedElements(elements: ScannedElement[]) {
  clearScannedMarks();

  const matches = filterOutermostMatches(Array.from(document.querySelectorAll(CARD_SELECTORS)));
  const idByElement = new Map<Element, string>();

  matches.forEach((element, index) => {
    idByElement.set(element, buildScanId(element, index));
  });

  elements.forEach((item) => {
    const match = matches.find((element) => idByElement.get(element) === item.id);
    if (!match) return;
    match.setAttribute(STUDIO_ATTR, item.id);
  });
}

export function clearScannedMarks() {
  if (typeof document === "undefined") return;

  document.querySelectorAll(`[${STUDIO_ATTR}]`).forEach((element) => {
    element.removeAttribute(STUDIO_ATTR);
    element.classList.remove(HIGHLIGHT_CLASS, SELECTED_CLASS);
  });
}

export function applyScanHighlights({
  active,
  selectedId,
  annotatedIds,
}: {
  active: boolean;
  selectedId: string | null;
  annotatedIds: Set<string>;
}) {
  if (typeof document === "undefined") return;

  document.querySelectorAll(`[${STUDIO_ATTR}]`).forEach((element) => {
    const id = element.getAttribute(STUDIO_ATTR);
    element.classList.toggle(HIGHLIGHT_CLASS, active);
    element.classList.toggle(SELECTED_CLASS, active && id === selectedId);

    if (active && id && annotatedIds.has(id)) {
      element.classList.add("content-studio-scan-flagged");
    } else {
      element.classList.remove("content-studio-scan-flagged");
    }
  });
}

export function scrollToScannedElement(id: string) {
  const element = document.querySelector(`[${STUDIO_ATTR}="${id}"]`);
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function getDefinedZonesOnPage() {
  if (typeof document === "undefined") return [];

  return cmsZones.filter((zone) => document.querySelector(`[data-cms-zone="${zone.id}"]`));
}

export { STUDIO_ATTR, HIGHLIGHT_CLASS, SELECTED_CLASS };
