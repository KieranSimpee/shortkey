/**
 * Signup capture creatives — two crops each:
 * - heroSrc: landscape 16:9 for homepage hero (no baked headlines)
 * - src: vertical 3:4 for strip / ads (Google-hot filenames)
 *
 * Brand (Shortkey logo) lives in UI overlay — not inside the photo.
 */
export type SignupPoster = {
  id: string;
  googleHotSearch: string;
  relatedSearches: string[];
  /** Vertical poster — strip / social */
  src: string;
  /** Landscape banner — hero only */
  heroSrc: string;
  /**
   * Keep face/product on the right so left copy never covers it
   * when object-cover crops (default: right center).
   */
  heroObjectPosition?: string;
  alt: string;
  audience: "shopper" | "creator" | "brand" | "both";
  ctaHref: string;
  ctaLabel: string;
  headline: string;
  subline: string;
};

export const signupPosterSeries = {
  label: "SIGN UP CAPTURE · GOOGLE HOT K-BEAUTY",
  note: "Hero uses landscape banners. Vertical posters stay in the strip. Brand logo overlays in UI.",
  posters: [
    {
      id: "bloom-skin",
      googleHotSearch: "bloom skin",
      relatedSearches: [
        "bloom skin vs glass skin",
        "kbeauty bloom skin routine",
        "barrier repair glow",
        "ai skin analysis kbeauty",
      ],
      src: "/images/posters/signup/google-bloom-skin-ai-try-on-shortkey.png",
      heroSrc: "/images/posters/hero/hero-bloom-skin.png",
      heroObjectPosition: "78% center",
      alt: "Shortkey bloom skin AI try-on — K-beauty soft luminous glow",
      audience: "both",
      ctaHref: "/signup/creator",
      ctaLabel: "Creator meeting →",
      headline: "BLOOM SKIN · YOUR CTRL",
      subline: "AI try-on + skin match. Lock your signup plan.",
    },
    {
      id: "cushion-tint",
      googleHotSearch: "kbeauty skincare",
      relatedSearches: [
        "korean skincare routine",
        "barrier repair essence",
        "bloom skin ampoule",
        "ai skin match kbeauty",
      ],
      src: "/images/posters/signup/google-cushion-foundation-lip-tint-virtual-try-on.png",
      /** Landscape: skincare on RIGHT, open left for brand copy (was makeup-left overlap) */
      heroSrc: "/images/posters/hero/hero-cushion-tint.png",
      heroObjectPosition: "82% center",
      alt: "Shortkey K-beauty skincare on right — open left for signup copy",
      audience: "shopper",
      ctaHref: "/signup/brand",
      ctaLabel: "Brand meeting →",
      headline: "SKINCARE · MATCH · SHOP",
      subline: "Barrier glow on the right. Your CTRL signup on the left.",
    },
    {
      id: "skin-analysis",
      googleHotSearch: "ai skin analysis",
      relatedSearches: [
        "korean skin analysis",
        "barrier repair skincare",
        "kbeauty essence routine",
        "glass skin to bloom skin",
      ],
      src: "/images/posters/signup/google-ai-skin-analysis-barrier-repair-kbeauty.png",
      heroSrc: "/images/posters/hero/hero-skin-analysis.png",
      heroObjectPosition: "75% center",
      alt: "Shortkey AI skin analysis barrier repair K-beauty",
      audience: "shopper",
      ctaHref: "/signup/creator",
      ctaLabel: "Join Shortkey →",
      headline: "SEE YOUR SKIN · SHOP THE MATCH",
      subline: "Landmark analysis → K / J / C routine.",
    },
    {
      id: "founding-signup",
      googleHotSearch: "kbeauty brand partnership",
      relatedSearches: [
        "influencer beauty partnership",
        "ctrl twin creator",
        "founding brand beauty platform",
        "asian beauty marketplace signup",
      ],
      src: "/images/posters/signup/google-founding-brand-creator-signup-ctrl-twin.png",
      /** Landscape: skincare on RIGHT, open left for copy (replaces old left-product + baked text) */
      heroSrc: "/images/posters/hero/hero-founding-brand.png",
      heroObjectPosition: "80% center",
      alt: "Shortkey founding brand — skincare on right, open left for signup copy",
      audience: "both",
      ctaHref: "/signup/brand",
      ctaLabel: "Brand or creator →",
      headline: "FOUNDING BRAND · CTRL TWIN",
      subline: "Teaser only — full terms in your meeting.",
    },
  ] satisfies SignupPoster[],
};
