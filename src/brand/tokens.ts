/**
 * SHORTKEY V3.0 Lilac Edition — design tokens
 *
 * Single source-of-truth mirror of `tailwind.config.ts`. Do not hand-edit
 * values here without updating `tailwind.config.ts` (and vice versa) — the
 * two must always match. See `SHORTKEY_BRAND_DNA.md` for the narrative
 * version of these tokens and links to the locked brand docs.
 */

export const colors = {
  silk: {
    DEFAULT: "#F7F5FF",
    light: "#FFFFFF",
    dark: "#EDEAFF",
  },
  brand: {
    DEFAULT: "#8C82FC",
    light: "#B9B3FF",
    dark: "#6F66E0",
    muted: "#F7F5FF",
    flare: "#EDEAFF",
    silver: "#E8E6F2",
  },
  ink: {
    DEFAULT: "#242424",
    muted: "#5A5A5A",
    subtle: "#8A8A8A",
  },
  surface: {
    dark: "#161226",
  },
} as const;

export const fontFamily = {
  sans: ["var(--font-inter)", "system-ui", "sans-serif"],
  display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
  mono: ["var(--font-space-grotesk)", "ui-monospace", "monospace"],
} as const;

export const letterSpacing = {
  widest: "0.2em",
} as const;

export const boxShadow = {
  soft: "0 8px 24px rgba(140, 130, 252, 0.12)",
  card: "0 10px 30px rgba(140, 130, 252, 0.12)",
  float: "0 12px 36px rgba(140, 130, 252, 0.14)",
} as const;

export const borderRadius = {
  card: "24px",
} as const;

export const brandDnaTokens = {
  colors,
  fontFamily,
  letterSpacing,
  boxShadow,
  borderRadius,
} as const;

export type BrandDnaTokens = typeof brandDnaTokens;

export default brandDnaTokens;
