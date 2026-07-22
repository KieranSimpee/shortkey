import { commandImg, lookImg, productImg } from "@/lib/images";

export type NavItem = {
  shortcut?: string;
  label: string;
  href: string;
};

export type HeroButton = {
  label: string;
  href: string;
  variant: "primary" | "outline" | "highlight";
};

export type HeroPosterId = "skin-analysis" | "try-on" | "launch" | "partners";

/** One rotational hero poster — copy + 3 CTAs */
export type HeroPosterSlide = {
  id: HeroPosterId;
  controlLabel: string;
  badge: string;
  headline: {
    before: string;
    highlight1: string;
    middle: string;
    highlight2: string;
    after: string;
  };
  subheadline: string;
  subheadlineExtra?: string;
  buttons: [HeroButton, HeroButton, HeroButton];
};

/** @deprecated use HeroPosterSlide — kept for CMS field hints */
export type HeroPosterControl = {
  id: HeroPosterId;
  label: string;
  variant: "primary" | "outline" | "highlight";
};

export type CommandCard = {
  shortcut: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export type InfluencerLiveBrand = {
  name: string;
  logo: string;
};

export type InfluencerShopProduct = {
  sku: string;
  name: string;
  image: string;
  href: string;
};

export type InfluencerHostTabId = "intro" | "shop" | "live" | "photo";

export type InfluencerHostTab = {
  id: InfluencerHostTabId;
  shortcut: string;
  label: string;
};

export type InfluencerLiveClip = {
  title: string;
  meta: string;
  href: string;
};

/** Short app-made samples — enough to promote a brand (15–45s) */
export type InfluencerShortClip = {
  id: string;
  title: string;
  /** e.g. "22s" */
  duration: string;
  brandName: string;
  productName: string;
  productSku: string;
  productHref: string;
  /** Poster / cover frame */
  poster: string;
  /**
   * Drop file under public/videos/creators/{hostId}/
   * Leave empty until sample is exported from your app.
   */
  videoSrc?: string;
};

export type InfluencerBlogPost = {
  title: string;
  excerpt: string;
  href: string;
};

export type InfluencerLiveHost = {
  id: string;
  name: string;
  handle: string;
  region: string;
  image: string;
  status: "LIVE" | "UP NEXT" | "REPLAY";
  viewers: string;
  activity: string;
  tagline: string;
  bio: string;
  shopHref: string;
  shopLabel: string;
  brands: InfluencerLiveBrand[];
  shopProducts: InfluencerShopProduct[];
  liveClips: InfluencerLiveClip[];
  photos: string[];
  blogPosts: InfluencerBlogPost[];
  /** Launch set: show on homepage / design as on-platform creators */
  onPlatform?: boolean;
  /** Short brand-promo samples (app exports OK — not long videos) */
  shortClips?: InfluencerShortClip[];
};

export type BrandFeature = {
  label: string;
  shortcut: string;
  icon: "tryon" | "influencer" | "video" | "community" | "analytics" | "store" | "payments" | "ai";
};

export type BrandStat = {
  value: string;
  label: string;
};

export type BrandPartnerBenefit = {
  shortcut: string;
  title: string;
  description: string;
};

export type BrandPartnerSignup = {
  title: string;
  description: string;
  formTitle?: string;
  formSubtitle?: string;
  companyLabel: string;
  companyPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  benefitsHeading: string;
  trustBadges?: string[];
  termsNote?: string;
};

export type BrandAimCard = {
  shortcut: string;
  label: string;
  title: string;
  description: string;
};

export type BrandPriceLine = {
  label: string;
  value: string;
};

export type BrandPricing = {
  label: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  breakdown: BrandPriceLine[];
  commissionBanner: string;
  commissionSubtext: string;
};

export type BeautyOsShortcut = {
  id: string;
  shortcut: string;
  label: string;
  href: string;
};

export type FolderProduct = {
  sku: string;
  name: string;
  type: string;
  image: string;
  href: string;
};

export type BeautyOsFolder = {
  id: string;
  title: string;
  description: string;
  products: FolderProduct[];
};

export type BeautyOsCategory = {
  id: "makeup" | "skincare";
  label: string;
  shortcuts: BeautyOsShortcut[];
};

export type FooterLinkGroup = {
  title: string;
  links: { label: string; href: string }[];
};

export const siteContent = {
  brand: {
    name: "shortkey",
    tagline: "Your Style. Your CTRL.",
    positioning: "The AI Beauty Operating System for Asian Beauty.",
    /** Brand Guidelines V2026 — production monochrome */
    logoSrc: "/logo/shortkey-primary.png",
  },

  header: {
    /** Shown with CTRL keycap — horizontal Beauty OS mark (not vertical) */
    categoryLabel: "Beauty",
    searchPlaceholder: "Search",
    nav: [
      { label: "KBeauty", href: "/kbeauty" },
      { label: "JBeauty", href: "/jbeauty" },
      { label: "CBeauty", href: "/cbeauty" },
    ] satisfies NavItem[],
    cartCount: 2,
    cta: { label: "AI BEAUTY LAB +", href: "/influencers" },
  },

  hero: {
    badge: "NEW ERA OF BEAUTY",
    headline: {
      before: "THE FIRST ",
      highlight1: "AI-POWERED",
      middle: " ASIAN BEAUTY ",
      highlight2: "PLATFORM",
      after: ".",
    },
    subheadline: "TRY. LEARN. SHOP. DISCOVER BEAUTY THROUGH SHORTCUTS.",
    subheadlineExtra: "BEAUTY. YOUR CTRL.",
    /** Brand Guidelines V2026 — on-dark monochrome */
    logoSrc: "/logo/shortkey-primary-on-dark.png",
    /** Active hero poster — rotation starts here */
    defaultPoster: "skin-analysis" as const,
    /** Auto-rotate interval (ms) — high-end pace */
    rotateMs: 7500,
    posters: [
      {
        id: "skin-analysis",
        controlLabel: "AI Skin",
        badge: "AI SKIN ANALYSIS",
        headline: {
          before: "SEE YOUR ",
          highlight1: "SKIN",
          middle: " — THEN ",
          highlight2: "SHOP THE MATCH",
          after: ".",
        },
        subheadline: "LANDMARK READS. ROUTINE SUGGESTIONS. K / J / C BEAUTY THAT FITS YOU.",
        subheadlineExtra: "ANALYSIS → ROUTINE → CART.",
        buttons: [
          { label: "START ANALYSIS →", href: "#skin-analysis", variant: "highlight" },
          { label: "SHOP SKIN →", href: "/shop", variant: "outline" },
          { label: "TRY ON NEXT →", href: "#try-on", variant: "outline" },
        ],
      },
      {
        id: "try-on",
        controlLabel: "Try-On",
        badge: "VIRTUAL TRY-ON",
        headline: {
          before: "TRY IT ON ",
          highlight1: "YOUR FACE",
          middle: " — ",
          highlight2: "BEFORE YOU BUY",
          after: ".",
        },
        subheadline: "REAL-TIME TINT. REAL SHADE. NO FILTER SOFTENING.",
        subheadlineExtra: "LIP · CHEEK · EYE — YOUR CTRL.",
        buttons: [
          { label: "OPEN TRY-ON →", href: "#try-on", variant: "highlight" },
          { label: "SHOP MAKEUP →", href: "/shop", variant: "outline" },
          { label: "MEET CREATORS →", href: "/influencers", variant: "outline" },
        ],
      },
      {
        id: "launch",
        controlLabel: "Launch",
        badge: "AUGUST LAUNCH MONTH",
        headline: {
          before: "AI SKIN + TRY-ON ",
          highlight1: "NO PLATFORM",
          middle: " ",
          highlight2: "MATCHES THIS",
          after: ".",
        },
        subheadline:
          "LANDMARK SKIN READS. LIVE TRY-ON. CREATOR SHOPS. K / J / C BEAUTY — ONE ASIAN BEAUTY OS.",
        subheadlineExtra: "PRE-REGISTER · LOCK YOUR FEE TIER.",
        buttons: [
          { label: "START ANALYSIS →", href: "#skin-analysis", variant: "highlight" },
          { label: "CREATOR MEETING →", href: "/signup/creator", variant: "outline" },
          { label: "BRAND MEETING →", href: "/signup/brand", variant: "outline" },
        ],
      },
      {
        id: "partners",
        controlLabel: "Partners",
        badge: "BRANDS & INFLUENCERS",
        headline: {
          before: "BUILD WITH ",
          highlight1: "SHORTKEY",
          middle: " — ",
          highlight2: "CREATORS & BRANDS",
          after: ".",
        },
        subheadline:
          "BOOK A 1-HOUR MEETING. BUILD YOUR CTRL STOREFRONT. JOIN BEFORE AUGUST RATES STEP UP.",
        subheadlineExtra: "YOUR STYLE. YOUR CTRL.",
        buttons: [
          { label: "CREATOR SIGNUP →", href: "/signup/creator", variant: "highlight" },
          { label: "BRAND SIGNUP →", href: "/signup/brand", variant: "outline" },
          { label: "WHO WE ARE →", href: "/about", variant: "outline" },
        ],
      },
    ] satisfies HeroPosterSlide[],
    /** Launch-month platform fee windows (shown under hero CTAs) */
    launchFees: {
      label: "SIGN UP PLAN · PLATFORM FEE",
      /** Homepage hero — S+ turns around → +5 (full ladder on signup pages) */
      heroTeaser: {
        line: "S+ → +5",
        whisper: "Pre-register · Aug steps up",
        brandLine: "AI Asian beauty · your CTRL",
        /** Seal face copy */
        sealFront: "S+",
        sealBack: "+5",
      },
      tiers: [
        {
          id: "pre",
          window: "Jul 20 – Jul 31",
          rate: "5%",
          note: "Pre-register",
          emphasis: true,
        },
        {
          id: "early",
          window: "Aug 1 – Aug 14",
          rate: "8%",
          note: "Launch early",
          emphasis: false,
        },
        {
          id: "standard",
          window: "Aug 15+",
          rate: "12%",
          note: "Standard",
          emphasis: false,
        },
      ],
      footnote:
        "Rate locks at signup. Creators → CTRL Twin. Brands → founding partner + Twin campaigns. Full terms on each signup page.",
    },
    /** Poster images for launch / partners rotations */
    launchImage: "/images/hero-premium.png",
    partnersImage: "/images/hero-editorial.png",
    visualImage: "/images/home-purple-atmosphere.png",
    backgroundImage: "/images/home-purple-atmosphere.png",
    atmosphereImage: "/images/home-purple-atmosphere.png",
    editorialImage: "/images/hero-editorial.png",
    /** Locked original rematted —collar kept, lilac plate cleared */
    modelHeadImage: "/images/hero-model-cutout-clear.png",
    /** AI Try-On poster model —lilac plate cleared like skin-analysis cutout */
    tryOnModelImage: "/images/hero-tryon-model-clear.png",
    tryOnStudio: {
      title: "Virtual try-on",
      hideLabel: "Hide",
      cartLabel: "Apply tint",
      categories: [
        {
          id: "lip",
          label: "Lip",
          brand: "Laneige",
          name: "Glass Lip Tint",
          price: "$18",
          image: productImg("SK-M003"),
          defaultShadeId: "lip-coral",
          shades: [
            { id: "lip-coral", name: "Coral", color: "#E87A6E" },
            { id: "lip-pink", name: "Pink", color: "#E88A9A" },
            { id: "lip-red", name: "Red", color: "#D4454A" },
            { id: "lip-nude", name: "Nude", color: "#D4A89A" },
          ],
        },
        {
          id: "blush",
          label: "Cheek",
          brand: "Rom&nd",
          name: "Cheek Soft Blush",
          price: "$14",
          image: productImg("SK-M008"),
          defaultShadeId: "blush-peach",
          shades: [
            { id: "blush-peach", name: "Peach", color: "#F0A090" },
            { id: "blush-pink", name: "Pink", color: "#E89AAA" },
            { id: "blush-coral", name: "Coral", color: "#E87868" },
            { id: "blush-mauve", name: "Mauve", color: "#C87A8E" },
          ],
        },
        {
          id: "eyeshadow",
          label: "Eye",
          brand: "3CE",
          name: "Soft Eye Palette",
          price: "$32",
          image: productImg("SK-M015"),
          defaultShadeId: "eye-taupe",
          shades: [
            { id: "eye-taupe", name: "Taupe", color: "#A67C6D" },
            { id: "eye-rose", name: "Rose", color: "#C48A90" },
            { id: "eye-bronze", name: "Bronze", color: "#9A6B4F" },
            { id: "eye-plum", name: "Plum", color: "#8B5A6E" },
          ],
        },
      ],
    },
    brandProducts: [
      {
        brand: "Laneige",
        name: "Lip Sleeping Mask",
        image: productImg("SK-M003"),
      },
      {
        brand: "9 Wishes",
        name: "Vanilla Cream Serum",
        image: productImg("SK-M008"),
      },
      {
        brand: "Anua",
        name: "Heartleaf Ampoule",
        image: productImg("SK-M011"),
      },
      {
        brand: "TIRTIR",
        name: "Mask Fit Cushion",
        image: productImg("SK-M015"),
      },
    ],
    pileProducts: [
      { brand: "", name: "Glass Lip Gloss", image: productImg("SK-M001") },
      { brand: "", name: "Velvet Lip Plump", image: productImg("SK-M002") },
      { brand: "", name: "Rose Oil Tint", image: productImg("SK-M004") },
      { brand: "", name: "Wing Liner", image: productImg("SK-M005") },
      { brand: "", name: "Soft Contour", image: productImg("SK-M007") },
      { brand: "", name: "Blend Brush", image: productImg("SK-M009") },
      { brand: "", name: "Cheek Tint", image: productImg("SK-M010") },
      { brand: "", name: "Dew Finish", image: productImg("SK-M012") },
      { brand: "", name: "Matte Set", image: productImg("SK-M013") },
      { brand: "", name: "Glow Primer", image: productImg("SK-M014") },
      { brand: "", name: "Soft Focus", image: productImg("SK-M016") },
      { brand: "", name: "Lash Lift", image: productImg("SK-M017") },
    ],
    sealLabel: "AI BEAUTY S+ POWERED",
    statsCard: {
      title: "SKIN RADIANCE",
      value: "+87%*",
      glowLevel: 4,
      bullets: ["EVENS TONE", "BOOSTS RADIANCE", "VISIBLY BRIGHTER"],
    },
    skincareRoutine: {
      title: "SUGGESTED ROUTINE",
      subtitle: "Matched to your skin analysis · K / J / C picks",
      steps: [
        {
          step: "01",
          role: "Toner",
          brand: "Round Lab",
          region: "K-Beauty",
          name: "Dokdo Toner",
          image: productImg("SK-M008"),
          href: "/shop",
        },
        {
          step: "02",
          role: "Serum",
          brand: "Melano CC",
          region: "J-Beauty",
          name: "Vitamin C Essence",
          image: productImg("SK-M011"),
          href: "/shop",
        },
        {
          step: "03",
          role: "Cream",
          brand: "Winona",
          region: "C-Beauty",
          name: "Barrier Repair Cream",
          image: productImg("SK-M003"),
          href: "/shop",
        },
      ],
    },
    glowBadge: "SHORTCUT TO YOUR GLOW",
    productLabel: "ASIAN BEAUTY EDIT",
  },

  beautyOs: {
    label: "BEAUTY OPERATING SYSTEM",
    categories: [
      {
        id: "makeup",
        label: "Makeup",
        shortcuts: [
          { id: "pout", shortcut: "CTRL + B", label: "Brighten", href: "#commands" },
          { id: "premakeup", shortcut: "CTRL + ALT + P", label: "Pre-Makeup", href: "#commands" },
          { id: "contour", shortcut: "CTRL + G", label: "Glow", href: "#commands" },
          { id: "blend", shortcut: "CTRL + Z", label: "Undo", href: "#commands" },
          { id: "tint", shortcut: "DEL + D", label: "Delete Dullness", href: "#commands" },
        ],
      },
      {
        id: "skincare",
        label: "Skin Care",
        shortcuts: [
          { id: "moisture", shortcut: "CTRL + H", label: "Hydration", href: "#commands" },
          { id: "sun", shortcut: "CTRL + S", label: "Sun Protect", href: "#commands" },
          { id: "cleanse", shortcut: "CTRL + C", label: "Cleanse", href: "#commands" },
          { id: "essence", shortcut: "CTRL + E", label: "Essence", href: "#commands" },
          { id: "repair", shortcut: "CTRL + R", label: "Repair", href: "#commands" },
          { id: "ampoule", shortcut: "CTRL + A", label: "Ampoule", href: "#commands" },
        ],
      },
    ] satisfies BeautyOsCategory[],
    folders: [
      {
        id: "premakeup",
        title: "Pre-Makeup",
        description: "Prep → Base → Crease → Powder — build your face in shortcut steps.",
        products: [
          { sku: "SK-M012", name: "Blur Primer Base", type: "Prep", image: productImg("SK-M012"), href: "/shop/SK-M012" },
          { sku: "SK-M010", name: "Skin Fit Cushion", type: "Base", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M007", name: "Soft Sculpt Palette", type: "Crease / Sculpt", image: productImg("SK-M007"), href: "/shop/SK-M007" },
          { sku: "SK-M016", name: "Cloud Setting Powder", type: "Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
          { sku: "SK-M011", name: "Seamless Concealer", type: "Base", image: productImg("SK-M011"), href: "/shop/SK-M011" },
          { sku: "SK-M017", name: "Dew Fix Mist", type: "Finish", image: productImg("SK-M017"), href: "/shop/SK-M017" },
        ],
      },
      {
        id: "pout",
        title: "Pout",
        description: "Gloss, plump, and lip finish —virtual try-on for every pout.",
        products: [
          { sku: "SK-M001", name: "Glass Lip Gloss", type: "High-Shine Gloss", image: productImg("SK-M001"), href: "/shop/SK-M001" },
          { sku: "SK-M002", name: "Velvet Lip Plump", type: "Plumping Balm", image: productImg("SK-M002"), href: "/shop/SK-M002" },
          { sku: "SK-M003", name: "Rose Oil Lip Tint", type: "Tinted Lip Oil", image: productImg("SK-M003"), href: "/shop/SK-M003" },
          { sku: "SK-M013", name: "Cherry Lip Cheek Tint", type: "Multi-Use Tint", image: productImg("SK-M013"), href: "/shop/SK-M013" },
          { sku: "SK-M014", name: "Berry Water Tint", type: "Sheer Lip Tint", image: productImg("SK-M014"), href: "/shop/SK-M014" },
          { sku: "SK-M015", name: "Peach Flush Stick", type: "Cream Blush Tint", image: productImg("SK-M015"), href: "/shop/SK-M015" },
        ],
      },
      {
        id: "wing",
        title: "Wing",
        description: "Wing templates and liner precision —map your eye look before you draw.",
        products: [
          { sku: "SK-M004", name: "Precision Felt Liner", type: "Liquid Eyeliner", image: productImg("SK-M004"), href: "/shop/SK-M004" },
          { sku: "SK-M005", name: "Cat Eye Stamp Pen", type: "Wing Template", image: productImg("SK-M005"), href: "/shop/SK-M005" },
          { sku: "SK-M006", name: "Smudge-Proof Gel Liner", type: "Waterproof Liner", image: productImg("SK-M006"), href: "/shop/SK-M006" },
          { sku: "SK-M016", name: "Cloud Setting Powder", type: "Translucent Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
          { sku: "SK-M009", name: "Champagne Highlight", type: "Liquid Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M017", name: "Dew Fix Mist", type: "Setting Spray", image: productImg("SK-M017"), href: "/shop/SK-M017" },
        ],
      },
      {
        id: "contour",
        title: "Contour",
        description: "Sculpt, highlight, and define —see placement on your face in real time.",
        products: [
          { sku: "SK-M007", name: "Soft Sculpt Palette", type: "Contour Kit", image: productImg("SK-M007"), href: "/shop/SK-M007" },
          { sku: "SK-M008", name: "Cream Contour Stick", type: "Face Sculpt", image: productImg("SK-M008"), href: "/shop/SK-M008" },
          { sku: "SK-M009", name: "Champagne Highlight", type: "Liquid Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M010", name: "Skin Fit Cushion", type: "Foundation Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M011", name: "Seamless Concealer", type: "Full Cover Concealer", image: productImg("SK-M011"), href: "/shop/SK-M011" },
          { sku: "SK-M012", name: "Blur Primer Base", type: "Pore-Blur Primer", image: productImg("SK-M012"), href: "/shop/SK-M012" },
        ],
      },
      {
        id: "blend",
        title: "Blend",
        description: "Second-skin base and concealer —shade match and blend preview.",
        products: [
          { sku: "SK-M010", name: "Skin Fit Cushion", type: "Foundation Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M011", name: "Seamless Concealer", type: "Full Cover Concealer", image: productImg("SK-M011"), href: "/shop/SK-M011" },
          { sku: "SK-M012", name: "Blur Primer Base", type: "Pore-Blur Primer", image: productImg("SK-M012"), href: "/shop/SK-M012" },
          { sku: "SK-M007", name: "Soft Sculpt Palette", type: "Contour Kit", image: productImg("SK-M007"), href: "/shop/SK-M007" },
          { sku: "SK-M016", name: "Cloud Setting Powder", type: "Translucent Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
          { sku: "SK-M018", name: "Soft Focus Filter Balm", type: "Blurring Finish", image: productImg("SK-M018"), href: "/shop/SK-M018" },
        ],
      },
      {
        id: "tint",
        title: "Tint",
        description: "Lip and cheek tint in one swipe —multi-use color try-on.",
        products: [
          { sku: "SK-M013", name: "Cherry Lip Cheek Tint", type: "Multi-Use Tint", image: productImg("SK-M013"), href: "/shop/SK-M013" },
          { sku: "SK-M014", name: "Berry Water Tint", type: "Sheer Lip Tint", image: productImg("SK-M014"), href: "/shop/SK-M014" },
          { sku: "SK-M015", name: "Peach Flush Stick", type: "Cream Blush Tint", image: productImg("SK-M015"), href: "/shop/SK-M015" },
          { sku: "SK-M001", name: "Glass Lip Gloss", type: "High-Shine Gloss", image: productImg("SK-M001"), href: "/shop/SK-M001" },
          { sku: "SK-M002", name: "Velvet Lip Plump", type: "Plumping Balm", image: productImg("SK-M002"), href: "/shop/SK-M002" },
          { sku: "SK-M003", name: "Rose Oil Lip Tint", type: "Tinted Lip Oil", image: productImg("SK-M003"), href: "/shop/SK-M003" },
        ],
      },
      {
        id: "finish",
        title: "Finish",
        description: "Lock your look —compare matte, dewy, and soft-focus finishes.",
        products: [
          { sku: "SK-M016", name: "Cloud Setting Powder", type: "Translucent Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
          { sku: "SK-M017", name: "Dew Fix Mist", type: "Setting Spray", image: productImg("SK-M017"), href: "/shop/SK-M017" },
          { sku: "SK-M018", name: "Soft Focus Filter Balm", type: "Blurring Finish", image: productImg("SK-M018"), href: "/shop/SK-M018" },
          { sku: "SK-M012", name: "Blur Primer Base", type: "Pore-Blur Primer", image: productImg("SK-M012"), href: "/shop/SK-M012" },
          { sku: "SK-M009", name: "Champagne Highlight", type: "Liquid Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M010", name: "Skin Fit Cushion", type: "Foundation Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
        ],
      },
      {
        id: "sun",
        title: "Sun Protect",
        description: "Daily SPF and UV shields —shade-friendly formulas for every skin tone.",
        products: [
          { sku: "SK-Z001", name: "Daily Soft SPF", type: "Lightweight Sunscreen", image: productImg("SK-Z001"), href: "/shop/SK-Z001" },
          { sku: "SK-Z002", name: "Tone-Up Sun Fluid", type: "UV Tone Protector", image: productImg("SK-Z002"), href: "/shop/SK-Z002" },
          { sku: "SK-B001", name: "Bright Barrier Cream", type: "SPF Moisturizer", image: productImg("SK-B001"), href: "/shop/SK-B001" },
          { sku: "SK-H001", name: "Hydra Sun Gel", type: "Watery SPF", image: productImg("SK-H001"), href: "/shop/SK-H001" },
          { sku: "SK-G001", name: "Glow Guard Mist", type: "Setting SPF Mist", image: productImg("SK-G001"), href: "/shop/SK-G001" },
          { sku: "SK-D001", name: "Defense Day Cream", type: "Anti-Pollution SPF", image: productImg("SK-D001"), href: "/shop/SK-D001" },
        ],
      },
      {
        id: "cleanse",
        title: "Cleanse",
        description: "Gentle double-cleanse essentials —melt makeup without stripping the barrier.",
        products: [
          { sku: "SK-D001", name: "Soft Foam Cleanser", type: "Daily Gel Cleanser", image: productImg("SK-D001"), href: "/shop/SK-D001" },
          { sku: "SK-D002", name: "Oil Melt Balm", type: "Cleansing Balm", image: productImg("SK-D002"), href: "/shop/SK-D002" },
          { sku: "SK-D003", name: "Micellar Clear Water", type: "Micellar Water", image: productImg("SK-D003"), href: "/shop/SK-D003" },
          { sku: "SK-H001", name: "Hydra Clean Foam", type: "Moisturizing Cleanser", image: productImg("SK-H001"), href: "/shop/SK-H001" },
          { sku: "SK-B001", name: "Bright Wash", type: "Vitamin C Cleanse", image: productImg("SK-B001"), href: "/shop/SK-B001" },
          { sku: "SK-G001", name: "Glow Renew Wash", type: "Enzyme Cleanser", image: productImg("SK-G001"), href: "/shop/SK-G001" },
        ],
      },
      {
        id: "moisture",
        title: "Moisture",
        description: "Barrier-boosting hydration —lock in water for plump, calm skin.",
        products: [
          { sku: "SK-H001", name: "Hydro Glow Cream", type: "Daily Moisturizer", image: productImg("SK-H001"), href: "/shop/SK-H001" },
          { sku: "SK-H002", name: "Water Bank Gel", type: "Gel Cream", image: productImg("SK-H002"), href: "/shop/SK-H002" },
          { sku: "SK-H003", name: "Ceramide Lock Balm", type: "Barrier Balm", image: productImg("SK-H003"), href: "/shop/SK-H003" },
          { sku: "SK-B002", name: "Dew Boost Lotion", type: "Hydrating Lotion", image: productImg("SK-B002"), href: "/shop/SK-B002" },
          { sku: "SK-G002", name: "Glass Skin Cream", type: "Illuminating Moisturizer", image: productImg("SK-G002"), href: "/shop/SK-G002" },
          { sku: "SK-Z001", name: "Day Shield Mist", type: "Hydrating Mist", image: productImg("SK-Z001"), href: "/shop/SK-Z001" },
        ],
      },
      {
        id: "essence",
        title: "Essence",
        description: "First-layer treatment essences —prep skin for actives and makeup.",
        products: [
          { sku: "SK-B001", name: "Bright First Essence", type: "Treatment Essence", image: productImg("SK-B001"), href: "/shop/SK-B001" },
          { sku: "SK-B002", name: "Glow Prep Toner", type: "Essence Toner", image: productImg("SK-B002"), href: "/shop/SK-B002" },
          { sku: "SK-B003", name: "Layering Softener", type: "Skin Softener", image: productImg("SK-B003"), href: "/shop/SK-B003" },
          { sku: "SK-H002", name: "Water Capsule Essence", type: "Hydra Essence", image: productImg("SK-H002"), href: "/shop/SK-H002" },
          { sku: "SK-G001", name: "Radiance Boost Essence", type: "Glow Essence", image: productImg("SK-G001"), href: "/shop/SK-G001" },
          { sku: "SK-D002", name: "Clear Path Essence", type: "Clarifying Essence", image: productImg("SK-D002"), href: "/shop/SK-D002" },
        ],
      },
      {
        id: "repair",
        title: "Repair",
        description: "Overnight recovery —soothe, rebuild, and reset stressed skin.",
        products: [
          { sku: "SK-D001", name: "Barrier Reset Cream", type: "Repair Cream", image: productImg("SK-D001"), href: "/shop/SK-D001" },
          { sku: "SK-D002", name: "Calm Night Mask", type: "Sleeping Mask", image: productImg("SK-D002"), href: "/shop/SK-D002" },
          { sku: "SK-D003", name: "Recovery Spot Gel", type: "Targeted Repair", image: productImg("SK-D003"), href: "/shop/SK-D003" },
          { sku: "SK-H003", name: "Night Hydro Pack", type: "Overnight Moisturizer", image: productImg("SK-H003"), href: "/shop/SK-H003" },
          { sku: "SK-B003", name: "Renew Soft Cream", type: "Renewal Cream", image: productImg("SK-B003"), href: "/shop/SK-B003" },
          { sku: "SK-Z002", name: "After-Sun Soother", type: "Cooling Gel", image: productImg("SK-Z002"), href: "/shop/SK-Z002" },
        ],
      },
      {
        id: "ampoule",
        title: "Ampoule",
        description: "Concentrated actives —brightening, firming, and targeted skin boosts.",
        products: [
          { sku: "SK-G001", name: "Glow Shot Ampoule", type: "Vitamin Ampoule", image: productImg("SK-G001"), href: "/shop/SK-G001" },
          { sku: "SK-G002", name: "Pearl Firm Ampoule", type: "Firming Ampoule", image: productImg("SK-G002"), href: "/shop/SK-G002" },
          { sku: "SK-G003", name: "Glass Drop Concentrate", type: "Radiance Ampoule", image: productImg("SK-G003"), href: "/shop/SK-G003" },
          { sku: "SK-B002", name: "Bright Pulse Serum", type: "Brightening Serum", image: productImg("SK-B002"), href: "/shop/SK-B002" },
          { sku: "SK-H002", name: "Hydro Capsule Ampoule", type: "Hydra Ampoule", image: productImg("SK-H002"), href: "/shop/SK-H002" },
          { sku: "SK-D003", name: "Clear Focus Ampoule", type: "Clarifying Ampoule", image: productImg("SK-D003"), href: "/shop/SK-D003" },
        ],
      },
    ] satisfies BeautyOsFolder[],
  },

  commands: {
    titleLeft: "CHOOSE YOUR COMMAND",
    cards: [
      {
        shortcut: "CTRL + T",
        title: "TRY ON",
        description: "AI virtual try-on & shade match",
        image: commandImg("cmd-tryon"),
        href: "/try-on",
      },
      {
        shortcut: "CTRL + M",
        title: "MAKEOVER",
        description: "Korean & Asian makeup tutorial gateway",
        image: commandImg("cmd-makeover"),
        href: "/makeover",
      },
      {
        shortcut: "CTRL + L",
        title: "LOOKS",
        description: "Curated editorial beauty looks",
        image: commandImg("cmd-looks"),
        href: "/influencers",
      },
      {
        shortcut: "CTRL + V",
        title: "VIDEOS",
        description: "Tutorial & trend video library",
        image: commandImg("cmd-videos"),
        href: "/videos",
      },
      {
        shortcut: "CTRL + S",
        title: "SHOP",
        description: "Shop Asian beauty essentials",
        image: commandImg("cmd-shop"),
        href: "/shop",
      },
      {
        shortcut: "CTRL + B",
        title: "BRANDS",
        description: "Discover partner beauty brands",
        image: commandImg("cmd-brands"),
        href: "/brands",
      },
    ] satisfies CommandCard[],
  },

  aiLab: {
    badge: "INFLUENCER HUB",
    poweredBy: "CREATOR TRY-ON STUDIO",
    title: "Meet the influencers",
    subtitle:
      "Each creator storefront — Shop, Brand partners, Live, and Video review. Your style. Your CTRL.",
    cta: { label: "WATCH LIVE TRY-ONS →", href: "/influencers" },
    secondaryCta: { label: "JOIN AS CREATOR →", href: "/signup/creator" },
    /** Per-influencer folder tabs (same style as Beauty OS) */
    hostTabs: [
      { id: "intro", shortcut: "CTRL + 1", label: "Brand" },
      { id: "shop", shortcut: "CTRL + 2", label: "Shop" },
      { id: "live", shortcut: "CTRL + 3", label: "Live" },
      { id: "photo", shortcut: "CTRL + 4", label: "Video" },
    ] satisfies InfluencerHostTab[],
    hosts: [
      {
        id: "hanna",
        name: "Hanna Lee",
        handle: "@hannalee",
        region: "K-Beauty",
        image: lookImg("look-1"),
        status: "REPLAY",
        viewers: "Brand promo samples",
        activity: "Short clips · brand try-on",
        tagline: "Bloom-skin looks that sell the shade — short clips, clear brand CTA",
        bio: "On-platform creator. Short app samples promote partner brands with try-on + shop link. Long livestreams optional later.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        onPlatform: true,
        brands: [
          { name: "Laneige", logo: productImg("SK-M003") },
          { name: "Rom&nd", logo: productImg("SK-M008") },
        ],
        shopProducts: [
          { sku: "SK-M003", name: "Rose Oil Lip Tint", image: productImg("SK-M003"), href: "/shop/SK-M003" },
          { sku: "SK-M008", name: "Cream Contour Stick", image: productImg("SK-M008"), href: "/shop/SK-M008" },
          { sku: "SK-M001", name: "Glass Lip Gloss", image: productImg("SK-M001"), href: "/shop/SK-M001" },
          { sku: "SK-M013", name: "Cherry Lip Cheek Tint", image: productImg("SK-M013"), href: "/shop/SK-M013" },
        ],
        liveClips: [
          { title: "Rose oil tint — brand swipe", meta: "15s · brand promo", href: "/influencers/hanna" },
          { title: "Rom&nd contour — before/after", meta: "28s · brand promo", href: "/influencers/hanna" },
        ],
        shortClips: [
          {
            id: "hanna-laneige-tint",
            title: "Rose oil tint on camera",
            duration: "18s",
            brandName: "Laneige",
            productName: "Rose Oil Lip Tint",
            productSku: "SK-M003",
            productHref: "/shop/SK-M003",
            poster: productImg("SK-M003"),
            videoSrc: "/videos/creators/hanna/laneige-rose-oil-tint.mp4",
          },
          {
            id: "hanna-romand-contour",
            title: "Cream contour soft sculpt",
            duration: "25s",
            brandName: "Rom&nd",
            productName: "Cream Contour Stick",
            productSku: "SK-M008",
            productHref: "/shop/SK-M008",
            poster: productImg("SK-M008"),
            videoSrc: "/videos/creators/hanna/romand-cream-contour.mp4",
          },
        ],
        photos: [lookImg("look-1"), productImg("SK-M003"), productImg("SK-M001"), productImg("SK-M013")],
        blogPosts: [
          { title: "How short clips sell a tint", excerpt: "Show shade · name brand · tap shop. Under 30s.", href: "/influencers/hanna" },
          { title: "Laneige + Rom&nd kit", excerpt: "Two SKUs I always open brand promos with.", href: "/influencers/hanna" },
        ],
      },
      {
        id: "soojin",
        name: "Soojin Park",
        handle: "@soojin.beauty",
        region: "K-Beauty",
        image: lookImg("look-2"),
        status: "REPLAY",
        viewers: "Brand promo samples",
        activity: "Short clips · lip & cheek",
        tagline: "Lip + cheek twin looks — short enough for brands, clear enough to convert",
        bio: "On-platform creator. App-length samples promote 3CE & Anua with product + cart path. Brands get proof without long shoots.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        onPlatform: true,
        brands: [
          { name: "3CE", logo: productImg("SK-M015") },
          { name: "Anua", logo: productImg("SK-M011") },
        ],
        shopProducts: [
          { sku: "SK-M015", name: "Peach Flush Stick", image: productImg("SK-M015"), href: "/shop/SK-M015" },
          { sku: "SK-M011", name: "Seamless Concealer", image: productImg("SK-M011"), href: "/shop/SK-M011" },
          { sku: "SK-M002", name: "Velvet Lip Plump", image: productImg("SK-M002"), href: "/shop/SK-M002" },
          { sku: "SK-M010", name: "Skin Fit Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
        ],
        liveClips: [
          { title: "Peach flush — brand swipe", meta: "20s · brand promo", href: "/influencers/soojin" },
          { title: "Concealer cover demo", meta: "32s · brand promo", href: "/influencers/soojin" },
        ],
        shortClips: [
          {
            id: "soojin-3ce-flush",
            title: "Peach flush stick — cheek map",
            duration: "20s",
            brandName: "3CE",
            productName: "Peach Flush Stick",
            productSku: "SK-M015",
            productHref: "/shop/SK-M015",
            poster: productImg("SK-M015"),
            videoSrc: "/videos/creators/soojin/3ce-peach-flush.mp4",
          },
          {
            id: "soojin-anua-conceal",
            title: "Seamless conceal — under-eye",
            duration: "30s",
            brandName: "Anua",
            productName: "Seamless Concealer",
            productSku: "SK-M011",
            productHref: "/shop/SK-M011",
            poster: productImg("SK-M011"),
            videoSrc: "/videos/creators/soojin/anua-seamless-concealer.mp4",
          },
        ],
        photos: [lookImg("look-2"), productImg("SK-M015"), productImg("SK-M002"), productImg("SK-M011")],
        blogPosts: [
          { title: "Screenshot your twin tint", excerpt: "Same cheek + lip — brand name on screen.", href: "/influencers/soojin" },
          { title: "Soft peach flush guide", excerpt: "20-second brand promo formula.", href: "/influencers/soojin" },
        ],
      },
      {
        id: "chel",
        name: "Chelsea Ng",
        handle: "@imyour.chel",
        region: "C-Beauty",
        image: lookImg("look-3"),
        status: "UP NEXT",
        viewers: "Starts in 12m",
        activity: "Coming up live · fan screenshot room",
        tagline: "Clean-girl demo —fans join try-on and save a photo look",
        bio: "Clean-girl makeup for humid climates. Fans join her pre-live screenshot room.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "TIRTIR", logo: productImg("SK-M010") },
          { name: "COSRX", logo: productImg("SK-M016") },
        ],
        shopProducts: [
          { sku: "SK-M010", name: "Skin Fit Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M012", name: "Blur Primer Base", image: productImg("SK-M012"), href: "/shop/SK-M012" },
          { sku: "SK-M016", name: "Cloud Setting Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
          { sku: "SK-M017", name: "Dew Fix Mist", image: productImg("SK-M017"), href: "/shop/SK-M017" },
        ],
        liveClips: [
          { title: "Clean girl countdown", meta: "UP NEXT · 12m", href: "/influencers" },
          { title: "Humidity-proof base", meta: "Clip · 18m", href: "/influencers" },
        ],
        photos: [lookImg("look-3"), productImg("SK-M010"), productImg("SK-M016"), productImg("SK-M017")],
        blogPosts: [
          { title: "Join the screenshot room", excerpt: "Save your look before we go live.", href: "/influencers" },
          { title: "Soft-focus base stack", excerpt: "Primer → cushion → mist in under 5 minutes.", href: "/influencers" },
        ],
      },
      {
        id: "lily",
        name: "Lily Chen",
        handle: "@lily.dailylook",
        region: "J-Beauty",
        image: lookImg("look-4"),
        status: "REPLAY",
        viewers: "9.1K replayed",
        activity: "Replay · try-on with fans",
        tagline: "Idol makeup stream —rewatch, try on, screenshot your favourite",
        bio: "Idol-inspired eye looks with soft finishes. Replays stay open for fan try-ons.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "Canmake", logo: productImg("SK-M001") },
          { name: "Clé de Peau", logo: productImg("SK-M009") },
        ],
        shopProducts: [
          { sku: "SK-M001", name: "Glass Lip Gloss", image: productImg("SK-M001"), href: "/shop/SK-M001" },
          { sku: "SK-M009", name: "Champagne Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M004", name: "Precision Felt Liner", image: productImg("SK-M004"), href: "/shop/SK-M004" },
          { sku: "SK-M005", name: "Cat Eye Stamp Pen", image: productImg("SK-M005"), href: "/shop/SK-M005" },
        ],
        liveClips: [
          { title: "Idol eye replay", meta: "Replay · 54m", href: "/influencers" },
          { title: "Wing stamp demo", meta: "Clip · 9m", href: "/influencers" },
        ],
        photos: [lookImg("look-4"), productImg("SK-M004"), productImg("SK-M005"), productImg("SK-M009")],
        blogPosts: [
          { title: "Rewatch + try the wing", excerpt: "Pause the replay and mirror the stamp angle.", href: "/influencers" },
          { title: "Soft idol finish notes", excerpt: "Highlight + gloss pairing from last night.", href: "/influencers" },
        ],
      },
      {
        id: "mina",
        name: "Mina Goto",
        handle: "@mina.glow",
        region: "J-Beauty",
        image: lookImg("look-1"),
        status: "LIVE",
        viewers: "3.1K watching",
        activity: "Live stream · dew finish",
        tagline: "Dewy skin tutorials with fan chat shade polls",
        bio: "Tokyo glow editor. Runs live shade polls and fan photo replies mid-stream.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "Canmake", logo: productImg("SK-M014") },
          { name: "Rom&nd", logo: productImg("SK-M002") },
        ],
        shopProducts: [
          { sku: "SK-M014", name: "Berry Water Tint", image: productImg("SK-M014"), href: "/shop/SK-M014" },
          { sku: "SK-M002", name: "Velvet Lip Plump", image: productImg("SK-M002"), href: "/shop/SK-M002" },
          { sku: "SK-M017", name: "Dew Fix Mist", image: productImg("SK-M017"), href: "/shop/SK-M017" },
          { sku: "SK-M018", name: "Soft Focus Filter Balm", image: productImg("SK-M018"), href: "/shop/SK-M018" },
        ],
        liveClips: [
          { title: "Dew vote live", meta: "LIVE · 22m", href: "/influencers" },
          { title: "Mist layering tips", meta: "Clip · 7m", href: "/influencers" },
        ],
        photos: [lookImg("look-1"), productImg("SK-M014"), productImg("SK-M017"), productImg("SK-M018")],
        blogPosts: [
          { title: "Vote your dew level", excerpt: "Fans pick soft / medium / glass in chat.", href: "/influencers" },
          { title: "After-live glow notes", excerpt: "What sold out from tonight?�s kit.", href: "/influencers" },
        ],
      },
      {
        id: "yuna",
        name: "Yuna Kim",
        handle: "@yuna.softmatte",
        region: "K-Beauty",
        image: lookImg("look-2"),
        status: "UP NEXT",
        viewers: "Starts in 40m",
        activity: "Coming up · soft matte base class",
        tagline: "Soft-matte bases with fan before/after uploads",
        bio: "Soft-matte educator. Fans upload before/afters to her photo board each week.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "3CE", logo: productImg("SK-M007") },
          { name: "TIRTIR", logo: productImg("SK-M010") },
        ],
        shopProducts: [
          { sku: "SK-M007", name: "Soft Sculpt Palette", image: productImg("SK-M007"), href: "/shop/SK-M007" },
          { sku: "SK-M010", name: "Skin Fit Cushion", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M011", name: "Seamless Concealer", image: productImg("SK-M011"), href: "/shop/SK-M011" },
          { sku: "SK-M016", name: "Cloud Setting Powder", image: productImg("SK-M016"), href: "/shop/SK-M016" },
        ],
        liveClips: [
          { title: "Soft matte class", meta: "UP NEXT · 40m", href: "/influencers" },
          { title: "Powder placement", meta: "Clip · 11m", href: "/influencers" },
        ],
        photos: [lookImg("look-2"), productImg("SK-M007"), productImg("SK-M010"), productImg("SK-M016")],
        blogPosts: [
          { title: "Upload your before/after", excerpt: "I feature three fan looks every Friday.", href: "/influencers" },
          { title: "Matte without flatness", excerpt: "Concealer + powder order that keeps glow.", href: "/influencers" },
        ],
      },
      {
        id: "aira",
        name: "Aira Wang",
        handle: "@aira.redcarpet",
        region: "C-Beauty",
        image: lookImg("look-3"),
        status: "LIVE",
        viewers: "5.0K watching",
        activity: "Live stream · event makeup",
        tagline: "Red-carpet reds with fans testing lipstick together",
        bio: "Event glam creator. Fans swap lipstick swatches live and vote the night?�s red.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "Laneige", logo: productImg("SK-M003") },
          { name: "9 Wishes", logo: productImg("SK-M012") },
        ],
        shopProducts: [
          { sku: "SK-M003", name: "Rose Oil Lip Tint", image: productImg("SK-M003"), href: "/shop/SK-M003" },
          { sku: "SK-M013", name: "Cherry Lip Cheek Tint", image: productImg("SK-M013"), href: "/shop/SK-M013" },
          { sku: "SK-M009", name: "Champagne Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M012", name: "Blur Primer Base", image: productImg("SK-M012"), href: "/shop/SK-M012" },
        ],
        liveClips: [
          { title: "Red vote stream", meta: "LIVE · 1h 05m", href: "/influencers" },
          { title: "Highlight for camera", meta: "Clip · 15m", href: "/influencers" },
        ],
        photos: [lookImg("look-3"), productImg("SK-M003"), productImg("SK-M013"), productImg("SK-M009")],
        blogPosts: [
          { title: "Swatch with me in chat", excerpt: "Post your red —I?�ll rate camera flash readiness.", href: "/influencers" },
          { title: "Night-out primer stack", excerpt: "What stays under humid venue lights.", href: "/influencers" },
        ],
      },
      {
        id: "rina",
        name: "Rina Sato",
        handle: "@rina.aegyosal",
        region: "J-Beauty",
        image: lookImg("look-4"),
        status: "REPLAY",
        viewers: "6.4K replayed",
        activity: "Replay · aegyo-sal workshop",
        tagline: "Aegyo-sal workshop —fans post photo homework",
        bio: "Under-eye highlight coach. Homework board for fan photos after every class.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
        brands: [
          { name: "Canmake", logo: productImg("SK-M006") },
          { name: "Clé de Peau", logo: productImg("SK-M009") },
        ],
        shopProducts: [
          { sku: "SK-M006", name: "Smudge-Proof Gel Liner", image: productImg("SK-M006"), href: "/shop/SK-M006" },
          { sku: "SK-M009", name: "Champagne Highlight", image: productImg("SK-M009"), href: "/shop/SK-M009" },
          { sku: "SK-M005", name: "Cat Eye Stamp Pen", image: productImg("SK-M005"), href: "/shop/SK-M005" },
          { sku: "SK-M015", name: "Peach Flush Stick", image: productImg("SK-M015"), href: "/shop/SK-M015" },
        ],
        liveClips: [
          { title: "Aegyo-sal workshop", meta: "Replay · 48m", href: "/influencers" },
          { title: "Homework review", meta: "Clip · 16m", href: "/influencers" },
        ],
        photos: [lookImg("look-4"), productImg("SK-M009"), productImg("SK-M006"), productImg("SK-M015")],
        blogPosts: [
          { title: "Post your homework photo", excerpt: "I reply with placement notes for every upload.", href: "/influencers" },
          { title: "Soft under-eye map", excerpt: "Three dots that read well on camera.", href: "/influencers" },
        ],
      },
    ] satisfies InfluencerLiveHost[],
  },

  /** Homepage collection rails — product variety without dumping the full catalog */
  homeCollections: {
    eyebrow: "COLLECTIONS",
    title: "SHOP BY SHORTCUT SET",
    subtitle: "Routines, looks, and seasonal edits — K / J / C beauty curated for you.",
    items: [
      {
        id: "best-routines",
        shortcut: "CTRL + R",
        title: "Best routines",
        description: "Toner → serum → cream matched paths",
        href: "/shop",
        image: productImg("SK-H001"),
        countLabel: "12 products",
      },
      {
        id: "makeup",
        shortcut: "CTRL + B",
        title: "Makeup collection",
        description: "Lip, cheek, eye — try-on ready",
        href: "/shop",
        image: productImg("SK-M001"),
        countLabel: "18 products",
      },
      {
        id: "seasonal-skincare",
        shortcut: "CTRL + H",
        title: "Seasonal skincare",
        description: "Barrier + glow for the season",
        href: "/shop",
        image: productImg("SK-B001"),
        countLabel: "14 products",
      },
      {
        id: "summer-spf",
        shortcut: "CTRL + S",
        title: "Summer vibe + SPF",
        description: "Dewy makeup with sun protection",
        href: "/shop",
        image: productImg("SK-Z001"),
        countLabel: "10 products",
      },
    ],
    markets: {
      label: "MARKETS",
      items: [
        { label: "KBeauty", href: "/kbeauty" },
        { label: "JBeauty", href: "/jbeauty" },
        { label: "CBeauty", href: "/cbeauty" },
      ],
    },
    brandsStrip: {
      label: "BRANDS ON SHORTKEY",
      names: ["Laneige", "Rom&nd", "3CE", "Anua", "TIRTIR", "COSRX", "Canmake", "Winona"],
      href: "/brands",
    },
  },

  /**
   * Homepage trio: Makeup+Try-On · Skin+Analysis · Creator video jobs.
   * Top of page carries signup fee plan (see hero.launchFees).
   */
  homeCategoryLanes: {
    eyebrow: "THREE WAYS IN",
    title: "MAKEUP · SKIN · CTRL TWIN",
    subtitle:
      "Shop AI lanes — or join as a creator. CTRL Twin is teased here; full rates stay in your signup meeting.",
    lanes: [
      {
        id: "makeup-tryon",
        shortcut: "CTRL + T",
        category: "Makeup",
        title: "Makeup + AI try-on",
        description:
          "Lip, cheek, eye — try the shade on your face before you buy. Real tint. No filter soften.",
        aiLabel: "AI TRY-ON",
        aiHref: "/try-on",
        aiCta: "Open try-on →",
        shopHref: "/shop",
        shopCta: "Shop makeup →",
        products: [
          { sku: "SK-M001", name: "Glass Lip Gloss", type: "Gloss", image: productImg("SK-M001"), href: "/shop/SK-M001" },
          { sku: "SK-M003", name: "Rose Oil Lip Tint", type: "Tint", image: productImg("SK-M003"), href: "/shop/SK-M003" },
          { sku: "SK-M008", name: "Cream Contour Stick", type: "Sculpt", image: productImg("SK-M008"), href: "/shop/SK-M008" },
          { sku: "SK-M015", name: "Peach Flush Stick", type: "Cheek", image: productImg("SK-M015"), href: "/shop/SK-M015" },
          { sku: "SK-M010", name: "Skin Fit Cushion", type: "Base", image: productImg("SK-M010"), href: "/shop/SK-M010" },
          { sku: "SK-M013", name: "Cherry Lip Cheek Tint", type: "Multi", image: productImg("SK-M013"), href: "/shop/SK-M013" },
        ],
      },
      {
        id: "skin-analysis",
        shortcut: "CTRL + A",
        category: "Skincare",
        title: "Skincare + AI skin analysis",
        description:
          "Landmark skin read → matched K / J / C routine. Shop the steps that fit your skin.",
        aiLabel: "AI SKIN ANALYSIS",
        aiHref: "#skin-analysis",
        aiCta: "Start analysis →",
        shopHref: "/shop",
        shopCta: "Shop skincare →",
        products: [
          { sku: "SK-H001", name: "Hydro Glow Cream", type: "Moisture", image: productImg("SK-H001"), href: "/shop/SK-H001" },
          { sku: "SK-B001", name: "Bright First Essence", type: "Essence", image: productImg("SK-B001"), href: "/shop/SK-B001" },
          { sku: "SK-Z001", name: "Daily Soft SPF", type: "Sun", image: productImg("SK-Z001"), href: "/shop/SK-Z001" },
          { sku: "SK-D001", name: "Barrier Reset Cream", type: "Repair", image: productImg("SK-D001"), href: "/shop/SK-D001" },
          { sku: "SK-G001", name: "Glow Shot Ampoule", type: "Ampoule", image: productImg("SK-G001"), href: "/shop/SK-G001" },
          { sku: "SK-H002", name: "Water Bank Gel", type: "Hydra", image: productImg("SK-H002"), href: "/shop/SK-H002" },
        ],
      },
      {
        id: "creator-jobs",
        shortcut: "CTRL + TWIN",
        category: "Creators",
        title: "CTRL Twin · do less, earn more",
        description:
          "License your look once. Your approved AI twin try-ons, answers shade questions, and sells — while you film less and keep the upside. Full rates in creator signup.",
        aiLabel: "CTRL TWIN",
        aiHref: "/signup/creator",
        aiCta: "Creator meeting →",
        shopHref: "/influencers",
        shopCta: "See creator shops →",
        products: [],
        /** Homepage teaser only — full offer math lives on /signup/creator */
        videoOffers: {
          jobOffer: {
            label: "Brand jobs + twin",
            range: "Paid campaigns",
            qty: "human + twin",
            note: "Brand briefs. You approve. Twin scales the booth.",
          },
          platformOffer: {
            label: "Earn while offline",
            range: "Rev-share + offers",
            qty: "your CTRL shop",
            note: "Details & rate windows unlocked in your creator meeting.",
          },
        },
      },
    ],
  },

  /**
   * Competitive “Why Shortkey?” — catch market attention before big retail affiliates.
   * Layout inspired by K-beauty affiliate banners (product stage + join copy).
   */
  homeWhy: {
    eyebrow: "WHY SHORTKEY",
    titleBefore: "Why ",
    titleHighlight: "SHORTKEY",
    titleAfter: "?",
    body: "Catch market attention before them. Join the Shortkey creator & brand program — become a trend leader, offer followers trustworthy AI-matched Asian beauty, and earn through your unique CTRL shop link with try-on built in.",
    points: [
      "First AI Asian beauty OS — skin analysis + live try-on in one flow",
      "Your CTRL storefront — Shop · Brand · Live · Video under your shortcut",
      "Lock platform fee early — 5% pre-register before August steps up",
    ],
    ctaCreator: { label: "JOIN AS CREATOR →", href: "/signup/creator" },
    ctaBrand: { label: "JOIN AS BRAND →", href: "/signup/brand" },
    stageLabel: "shortkey",
    products: [
      { sku: "SK-M001", name: "Glass Lip Gloss", image: productImg("SK-M001") },
      { sku: "SK-H001", name: "Hydro Glow Cream", image: productImg("SK-H001") },
      { sku: "SK-Z001", name: "Daily Soft SPF", image: productImg("SK-Z001") },
      { sku: "SK-M003", name: "Rose Oil Lip Tint", image: productImg("SK-M003") },
      { sku: "SK-B001", name: "Bright First Essence", image: productImg("SK-B001") },
      { sku: "SK-M010", name: "Skin Fit Cushion", image: productImg("SK-M010") },
    ],
  },

  /** Bestsellers · gift card · subscription — commerce row after collections */
  homeCommerce: {
    bestsellers: {
      eyebrow: "CTRL + HOT",
      title: "Best sellers",
      subtitle: "What Asian beauty lovers are adding to cart right now.",
      href: "/shop",
      cta: "Shop best sellers →",
      products: [
        {
          sku: "SK-M001",
          name: "Glass Lip Gloss",
          type: "High-Shine Gloss",
          price: "$18",
          image: productImg("SK-M001"),
          href: "/shop/SK-M001",
          badge: "No.1",
        },
        {
          sku: "SK-H001",
          name: "Hydro Glow Cream",
          type: "Daily Moisturizer",
          price: "$28",
          image: productImg("SK-H001"),
          href: "/shop/SK-H001",
          badge: "Top 3",
        },
        {
          sku: "SK-Z001",
          name: "Daily Soft SPF",
          type: "Lightweight Sunscreen",
          price: "$22",
          image: productImg("SK-Z001"),
          href: "/shop/SK-Z001",
          badge: "SPF pick",
        },
        {
          sku: "SK-M003",
          name: "Rose Oil Lip Tint",
          type: "Tinted Lip Oil",
          price: "$16",
          image: productImg("SK-M003"),
          href: "/shop/SK-M003",
          badge: "Try-on fav",
        },
      ],
    },
    giftCard: {
      eyebrow: "CTRL + GIFT",
      title: "Best gift card",
      subtitle:
        "Send Shortkey credit for K / J / C beauty — perfect for birthdays, thank-yous, and creator shoutouts.",
      amounts: ["$25", "$50", "$100", "$200"],
      href: "/shop",
      cta: "Send a gift card →",
      image: productImg("SK-M009"),
      note: "Digital delivery · redeemable on Shortkey shop & creator picks",
    },
    subscription: {
      eyebrow: "CTRL + SUB",
      title: "Beauty subscription",
      subtitle:
        "Monthly curated Asian beauty — skincare or makeup boxes matched to your skin analysis.",
      plans: [
        {
          id: "glow",
          name: "Glow Edit",
          cadence: "Monthly",
          price: "$39/mo",
          perks: ["3–4 skincare minis", "Routine card", "Free shade tips"],
        },
        {
          id: "look",
          name: "Look Edit",
          cadence: "Monthly",
          price: "$49/mo",
          perks: ["Makeup try-on picks", "Creator tip sheet", "Member early access"],
        },
        {
          id: "vip",
          name: "VIP CTRL",
          cadence: "Quarterly+",
          price: "$99/mo",
          perks: ["Full-size hero SKU", "Live try-on seat", "5% member fee lock*"],
        },
      ],
      href: "/shop",
      cta: "See subscription plans →",
      footnote: "*VIP CTRL member rate subject to launch-window signup rules.",
    },
  },

  /** Who we are + join echo + community content */
  homeCommunity: {
    eyebrow: "SHORTKEY WORLD",
    title: "LEARN · SHARE · JOIN",
    subtitle: "Tutorials, creator inspiration, gratitude practice, and Asia market trends.",
    joinEcho: {
      title: "Join the platform",
      description: "Same doors as the hero — book a 1-hour meeting.",
      buttons: [
        { label: "WHO WE ARE →", href: "/about", variant: "outline" as const },
        { label: "JOIN AS CREATOR →", href: "/signup/creator", variant: "highlight" as const },
        { label: "JOIN AS BRAND →", href: "/signup/brand", variant: "outline" as const },
      ],
    },
    stories: [
      {
        id: "tutorials",
        shortcut: "CTRL + M",
        title: "Makeup tutorials",
        description: "Step-by-step Asian makeup sharing with products in each step.",
        href: "/makeover",
        image: commandImg("cmd-makeover"),
      },
      {
        id: "inspiration",
        shortcut: "CTRL + L",
        title: "Influencer inspiration",
        description: "Looks and stories from creators across K / J / C markets.",
        href: "/influencers",
        image: lookImg("look-1"),
      },
      {
        id: "gratitude",
        shortcut: "CTRL + G",
        title: "The Gratitude Mind",
        description: "Beauty rituals rooted in self-care and intentional gratitude.",
        href: "/blog",
        image: lookImg("look-2"),
      },
      {
        id: "asia-trends",
        shortcut: "CTRL + A",
        title: "Asia market trends",
        description: "Reposts and edits on what’s moving in Asian beauty right now.",
        href: "/blog",
        image: lookImg("look-3"),
      },
    ],
  },

  brands: {
    title: "JOIN AS A FOUNDING BRAND",
    tag: "FOUNDING BRAND PROGRAMME —10 SLOTS ONLY",
    description:
      "Be one of 10 brands that shape the future of beauty commerce. One entry fee. Zero hidden charges. 5% commission locked for life.",
    slotsLabel: "10 slots available —closes August 13, 2026",
    foundingFee: "USD 5,000",
    commissionNote: "5% commission. That's it. We do not increase your retail price.",
    cta: { label: "JOIN AS FOUNDING BRAND →", href: "/signup/brand" },
    aim: {
      label: "THE AIM",
      title: "Why brands choose Shortkey.",
      description:
        "We built the infrastructure for Asian beauty brands to reach the right audience —with AI, influencers, and the lowest commission on the market.",
      cards: [
        {
          shortcut: "CTRL + R",
          label: "REACH",
          title: "Verified Influencer Network",
          description:
            "Access a curated pool of AI-certified K, J, and C-beauty influencers. Every creator is verified for reliability, reach, and content quality before joining.",
        },
        {
          shortcut: "CTRL + T",
          label: "TECH",
          title: "AI Try-On Technology",
          description:
            "Powered by TINT. Shoppers try your products virtually before buying —reducing returns, increasing conversions, and building brand trust at scale.",
        },
        {
          shortcut: "CTRL + G",
          label: "GROW",
          title: "Collective Ad Fund",
          description:
            "Your USD 2,500 joins a shared advertising pool. More brands = more budget = more reach for everyone.",
        },
      ] satisfies BrandAimCard[],
    },
    pricing: {
      label: "// THE INVESTMENT",
      titleLine1: "Simple pricing.",
      titleAccent: "Maximum return.",
      description:
        "One entry fee. Zero hidden charges. The lowest commission rate in the industry —locked for life.",
      breakdown: [
        { label: "TINT AI Technology Setup", value: "USD 2,500" },
        { label: "Collective Ad Fund", value: "USD 2,500" },
        { label: "Shortkey commission", value: "5% only ✓" },
        { label: "Rate locked forever", value: "✓ FOUNDING" },
        { label: "Platform access", value: "Lifetime" },
      ] satisfies BrandPriceLine[],
      commissionBanner: "5% Commission. That's it.",
      commissionSubtext:
        "We do not increase your retail price. Your margin stays yours. Our fee stays minimal.",
    } satisfies BrandPricing,
    featuresHeading: "POWER PARTNERS & TECH STACK",
    features: [
      { label: "TINT —Virtual Try-On (Power Partner)", shortcut: "CTRL + T", icon: "tryon" },
      { label: "Shopify —Brand, Sales & Streaming Commerce", shortcut: "CTRL + P", icon: "store" },
      { label: "Airwallex or PayPal —Marketing Payments", shortcut: "CTRL + $", icon: "payments" },
      { label: "VYBD —AI Backbone", shortcut: "CTRL + Y", icon: "ai" },
    ] satisfies BrandFeature[],
    stats: [
      { value: "1.2M+", label: "Beauty Lovers" },
      { value: "5K+", label: "Influencers" },
      { value: "350+", label: "Brands" },
      { value: "5%", label: "Commission —Locked" },
    ] satisfies BrandStat[],
    partnerBenefits: [
      {
        shortcut: "inf",
        title: "Joint Influencer Makeover Campaign",
        description:
          "Brands 1–10 receive a co-produced influencer-led campaign using TINT virtual try-on. Real content. Real reach. Funded by the collective ad pool.",
      },
      {
        shortcut: "pin",
        title: "Hero Banner Placement",
        description:
          "Featured prominently on the Shortkey homepage from launch day. First impression for every visitor that lands on the platform.",
      },
      {
        shortcut: "lock",
        title: "Rate Locked Forever",
        description:
          "USD 5,000 entry and 5% commission is your rate for life. Future brands pay more. Your founding status is permanent and non-transferable.",
      },
      {
        shortcut: "ai",
        title: "TINT AI Integration Priority",
        description:
          "Your products are first in the AI try-on queue. Virtual skin analysis and product matching configured before the platform opens to the public.",
      },
      {
        shortcut: "rpt",
        title: "Monthly Brand Report",
        description:
          "Dedicated performance dashboard. GMV, influencer reliability scores, audience demographics, and ROI —all in one clean monthly report.",
      },
      {
        shortcut: "go",
        title: "August 14 Launch Priority",
        description:
          "Go live on Day 1. Your brand is featured in the official launch announcement across all Shortkey channels and partner media.",
      },
    ] satisfies BrandPartnerBenefit[],
    signup: {
      title: "Secure your slot. Shape the platform.",
      description:
        "Complete your registration and payment below. Your founding brand status is confirmed immediately upon payment.",
      formTitle: "Brand Registration",
      formSubtitle: "Fill in your brand details. Payment is processed securely via Stripe.",
      companyLabel: "Brand name",
      companyPlaceholder: "e.g. Nacific, COSRX",
      emailLabel: "Business email",
      emailPlaceholder: "you@yourbrand.com",
      submitLabel: "Pay USD 5,000 —Secure Your Founding Slot",
      successTitle: "You're on the founding list",
      successMessage: "Welcome aboard —your partner metrics and founding benefits are below.",
      benefitsHeading: "Founding brand benefits",
      trustBadges: [
        "Instant confirmation",
        "Rate locked on payment",
        "Founding status permanent",
      ],
      termsNote:
        "By registering, you agree to the Shortkey Brand Partner Terms & Conditions and confirm you will submit an official email signature during onboarding.",
    } satisfies BrandPartnerSignup,
  },

  footer: {
    newsletter: {
      title: "JOIN THE SHORTCUT LIST",
      description:
        "Get exclusive beauty drops, AI try-on tips, and influencer looks delivered to your inbox.",
      placeholder: "Enter your email",
      button: "SUBSCRIBE →",
    },
    linkGroups: [
      {
        title: "SHORTCUTS",
        links: [
          { label: "Try On", href: "/try-on" },
          {
            label: "Makeover",
            href: "/makeover",
          },
          { label: "Looks", href: "/influencers" },
          { label: "Videos", href: "/videos" },
          { label: "Shop", href: "/shop" },
          { label: "Brands", href: "/brands" },
        ],
      },
      {
        title: "COMPANY",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "SUPPORT",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Shipping", href: "/shipping" },
          { label: "Returns", href: "/returns" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "LEGAL",
        links: [
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
          { label: "Cookies", href: "/cookies" },
        ],
      },
    ] satisfies FooterLinkGroup[],
    social: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Pinterest", href: "#" },
    ],
    copyright: "© 2026 Shortkey. All rights reserved.",
    domains: "shortkey.beauty · shortkey.wtf",
    poweredBy: "Powered by our AI family",
  },
} as const;

export type SiteContent = typeof siteContent;
