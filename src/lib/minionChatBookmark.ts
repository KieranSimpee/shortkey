/**
 * Minion Chat Box — canonical bookmarks (INTERNAL only · not public product).
 *
 * Live inventory (2026-08-06):
 * - shortkey.beauty + shortkey.vercel.app → Vercel Beauty deploy (works)
 * - family.shortkey.world → Vercel Family Table (works)
 * - shortkey.world → Squarespace parking (NOT Vercel — do not bookmark /desk there yet)
 * - desk.shortkey.world → DNS not resolving (do not wait)
 *
 * Soft gate: SITE_ACCESS_PASSWORD or DESK_ACCESS_PASSWORD (+ K_MINION_API_KEY for chat).
 */

/** Founder Controller — Kieran + Key first (INTERNAL). Use www — apex redirects. */
export const FOUNDER_CONTROLLER_INTERNAL =
  "https://www.shortkey.beauty/control/controller.html";

/** Local Beauty :3005 */
export const MINION_CHAT_LOCAL = "http://localhost:3005/desk/#family";

/**
 * Phone / remote INTERNAL bookmark — path on the apex that already deploys.
 * Prefer this over desk.shortkey.world until that CNAME is live.
 */
export const MINION_CHAT_INTERNAL = "https://shortkey.beauty/desk/#family";

/** Vercel project fallback (same deploy as beauty). */
export const MINION_CHAT_VERCEL_FALLBACK =
  "https://shortkey.vercel.app/desk/#family";

/** One-shot install / how-to landing (PWA Add to Home Screen). */
export const MINION_APP_INSTALL = "https://shortkey.beauty/minion-app/";

export function isLocalHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

/**
 * Href for in-app links: same-origin /desk/#family on deployed hosts,
 * Beauty :3005 when developing locally (Family Table often runs on :3002).
 */
export function minionChatHrefForHost(hostname: string, origin?: string): string {
  if (isLocalHostname(hostname)) return MINION_CHAT_LOCAL;
  const base = (origin || "").replace(/\/$/, "");
  if (base) return `${base}/desk/#family`;
  return MINION_CHAT_INTERNAL;
}
