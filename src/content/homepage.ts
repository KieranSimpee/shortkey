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
    tagline: "YOUR STYLE. YOUR CTRL.",
    /** Visual-locked shortkey mark with black plate cleared */
    logoSrc: "/images/shortkey-logo-clear.png",
  },

  header: {
    welcome: "Welcome to the first AI Asian Beauty world",
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
    /** Same locked-cleared mark used in hero shortcut lockup */
    logoSrc: "/images/shortkey-logo-clear.png",
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
        badge: "SHORTKEY LAUNCH MONTH",
        headline: {
          before: "THE PLATFORM ",
          highlight1: "THAT CONNECTS",
          middle: " ",
          highlight2: "BRANDS TO CUSTOMERS",
          after: ".",
        },
        subheadline:
          "AI DISCOVERY. CREATOR SHOPS. SHORTCUT COMMERCE. WE CARE HOW THE MATCH IS MADE.",
        subheadlineExtra: "AMBITION · FEATURES · TRUST.",
        buttons: [
          { label: "OUR AMBITION →", href: "/about", variant: "highlight" },
          { label: "SEE FEATURES →", href: "/#commands", variant: "outline" },
          { label: "ENTER SHOP →", href: "/shop", variant: "outline" },
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
          "FOUNDING PARTNERS. CREATOR LIVE SHOPS. BOOK A 1-HOUR MEETING WITH OUR TEAM.",
        subheadlineExtra: "YOUR STYLE. YOUR CTRL.",
        buttons: [
          { label: "CREATOR SIGNUP →", href: "/signup/creator", variant: "highlight" },
          { label: "BRAND SIGNUP →", href: "/signup/brand", variant: "outline" },
          { label: "MEET CREATORS →", href: "/influencers", variant: "outline" },
        ],
      },
    ] satisfies HeroPosterSlide[],
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
          { id: "wing", shortcut: "CTRL + H", label: "Hydrate", href: "#commands" },
          { id: "contour", shortcut: "CTRL + G", label: "Glow", href: "#commands" },
          { id: "blend", shortcut: "CTRL + Z", label: "Undo", href: "#commands" },
          { id: "tint", shortcut: "DEL + D", label: "Delete Dullness", href: "#commands" },
        ],
      },
      {
        id: "skincare",
        label: "Skin Care",
        shortcuts: [
          { id: "sun", shortcut: "CTRL + S", label: "Sun Protect", href: "#commands" },
          { id: "cleanse", shortcut: "CTRL + C", label: "Cleanse", href: "#commands" },
          { id: "moisture", shortcut: "CTRL + M", label: "Moisture", href: "#commands" },
          { id: "essence", shortcut: "CTRL + E", label: "Essence", href: "#commands" },
          { id: "repair", shortcut: "CTRL + R", label: "Repair", href: "#commands" },
          { id: "ampoule", shortcut: "CTRL + A", label: "Ampoule", href: "#commands" },
        ],
      },
    ] satisfies BeautyOsCategory[],
    folders: [
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
    badge: "INFLUENCER LIVE",
    poweredBy: "CREATOR TRY-ON STUDIO",
    title: "Meet the influencers",
    subtitle:
      "Eight creators on the homepage — open Intro, Shop, Live, or Photo & Blog for each one.",
    cta: { label: "WATCH LIVE TRY-ONS →", href: "/influencers" },
    secondaryCta: { label: "TRY ON THE HERO →", href: "/try-on" },
    /** Per-influencer folder tabs (same style as Beauty OS) */
    hostTabs: [
      { id: "intro", shortcut: "CTRL + 1", label: "Intro" },
      { id: "shop", shortcut: "CTRL + 2", label: "Shop" },
      { id: "live", shortcut: "CTRL + 3", label: "Live" },
      { id: "photo", shortcut: "CTRL + 4", label: "Photo" },
    ] satisfies InfluencerHostTab[],
    hosts: [
      {
        id: "hanna",
        name: "Hanna Lee",
        handle: "@hannalee",
        region: "K-Beauty",
        image: lookImg("look-1"),
        status: "LIVE",
        viewers: "2.4K watching",
        activity: "Live stream · fan try-on",
        tagline: "Glass-skin looks with fans screenshotting shades in chat",
        bio: "Seoul-based glass-skin creator. Hosts weekly fan try-on rooms and shade-match chats.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
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
          { title: "Glass skin shade match", meta: "LIVE · 42m", href: "/influencers" },
          { title: "Fan try-on replay", meta: "Replay · 28m", href: "/influencers" },
        ],
        photos: [lookImg("look-1"), productImg("SK-M003"), productImg("SK-M001"), productImg("SK-M013")],
        blogPosts: [
          { title: "How fans screenshot my glass look", excerpt: "Drop your shade in chat and I?�ll pin matches.", href: "/influencers" },
          { title: "Laneige + Rom&nd live kit", excerpt: "The two products I always open with on stream.", href: "/influencers" },
        ],
      },
      {
        id: "soojin",
        name: "Soojin Park",
        handle: "@soojin.beauty",
        region: "K-Beauty",
        image: lookImg("look-2"),
        status: "LIVE",
        viewers: "1.8K watching",
        activity: "Live stream · lip & cheek match",
        tagline: "Host + fans try the same tint —drop a screenshot for your match",
        bio: "Lip & cheek specialist. Builds matched looks with fans in real time.",
        shopHref: "/shop",
        shopLabel: "Influencer shop →",
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
          { title: "Lip & cheek twin look", meta: "LIVE · 31m", href: "/influencers" },
          { title: "Tint match Q&A", meta: "Clip · 12m", href: "/influencers" },
        ],
        photos: [lookImg("look-2"), productImg("SK-M015"), productImg("SK-M002"), productImg("SK-M011")],
        blogPosts: [
          { title: "Screenshot your twin tint", excerpt: "Tag me with the same cheek + lip combo.", href: "/influencers" },
          { title: "Soft peach flush guide", excerpt: "Placement tips from tonight?�s live.", href: "/influencers" },
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

  brands: {
    title: "JOIN AS A FOUNDING BRAND",
    tag: "FOUNDING BRAND PROGRAMME —10 SLOTS ONLY",
    description:
      "Be one of 10 brands that shape the future of beauty commerce. One entry fee. Zero hidden charges. 5% commission locked for life.",
    slotsLabel: "10 slots available —closes August 13, 2026",
    foundingFee: "USD 5,000",
    commissionNote: "5% commission. That's it. We do not increase your retail price.",
    cta: { label: "JOIN AS FOUNDING BRAND →", href: "/brands" },
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
    poweredBy: "Powered by SIMPLEX-ITY",
  },
} as const;

export type SiteContent = typeof siteContent;
