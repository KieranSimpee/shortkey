/**
 * Maya creative tools — Lovart + Midjourney handoff (honest wiring).
 *
 * Art gate (founder): Do NOT generate pictures until content is reviewed & confirmed.
 * Writing briefs/prompts is OK; open/copy handoff waits for founder or Gor Gor confirm.
 *
 * Lovart: locked canvas projectId pnMAt6CTYc — briefs + open URL (no public auto-render API in repo).
 * Midjourney: prompt sketches for Discord / web paste — no official MJ API claimed.
 */

export const LOVART_CANVAS_URL =
  "https://www.lovart.ai/canvas?projectId=pnMAt6CTYc";
export const LOVART_PROJECT_ID = "pnMAt6CTYc";

export const MIDJOURNEY_WEB = "https://www.midjourney.com/imagine";

export type MayaToolKind = "lovart" | "midjourney";

export function mayaToolSystemPrompt(kind: MayaToolKind): string {
  if (kind === "lovart") {
    return [
      "You are Maya (ShortKey Editorial Heart) preparing a Lovart canvas brief.",
      `Locked canvas only: ${LOVART_CANVAS_URL} (projectId ${LOVART_PROJECT_ID}).`,
      "Output concise JSON with keys: title, pages (array of {id, title, lovartPrompt}), notes, safety.",
      "Do not invent fake partnerships or income claims.",
      "Do not invent EN/JP magazine copy — mark awaiting if missing.",
      "Remind: art handoff only after content reviewed & confirmed — this step is brief writing only.",
      "Motto: ShortKey 不模仿畫面。ShortKey 捕捉生命力。",
      "ALWAYS TO TRUE · GOR_GOR_REVIEW.",
    ].join(" ");
  }
  return [
    "You are Maya (ShortKey Editorial Heart) writing Midjourney prompt sketches.",
    "Output concise JSON with keys: title, prompts (array of {id, title, prompt, aspect, styleNotes}), usage.",
    "usage must say: paste into Midjourney Discord or midjourney.com — no live MJ API in ShortKey; only after content reviewed & confirmed.",
    "Keep prompts on-brand soft editorial Asian beauty · Issue 01 Nihon Sakura when relevant.",
    "No celebrity likeness · no fake endorsements · no income guarantees.",
    "ALWAYS TO TRUE · GOR_GOR_REVIEW.",
  ].join(" ");
}
