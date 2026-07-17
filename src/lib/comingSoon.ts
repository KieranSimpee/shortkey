/**
 * Coming soon gate — public/production visitors only.
 *
 * - Local `npm run dev` → full site (so you can keep building)
 * - Production (Vercel) → Coming soon
 *
 * When ready to launch, set `COMING_SOON=false` in Vercel env
 * (or change this file) and redeploy.
 */
export const COMING_SOON =
  process.env.COMING_SOON === "true" ||
  (process.env.NODE_ENV === "production" && process.env.COMING_SOON !== "false");
