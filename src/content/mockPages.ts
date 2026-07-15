export type MockStub = {
  path: string;
  title: string;
  badge: string;
  shortcut: string;
  description: string;
  sections: { title: string; body: string }[];
  ctas?: { label: string; href: string; variant?: "primary" | "outline" }[];
};

export const mockStubPages: MockStub[] = [
  {
    path: "/about",
    title: "About Shortkey",
    badge: "COMPANY",
    shortcut: "CTRL + A",
    description:
      "The first AI-powered Asian beauty platform — try, learn, shop, and discover through shortcuts.",
    sections: [
      {
        title: "Mission",
        body: "Connect K / J / C beauty brands, influencers, and fans with AI try-on and lowest-friction shopping.",
      },
      {
        title: "What we build",
        body: "Beauty OS discovery, influencer live commerce, virtual try-on (TINT), and founding brand partnerships.",
      },
    ],
    ctas: [
      { label: "Meet influencers →", href: "/influencers" },
      { label: "For brands →", href: "/brands", variant: "outline" },
    ],
  },
  {
    path: "/careers",
    title: "Careers",
    badge: "COMPANY",
    shortcut: "CTRL + C",
    description: "Join the team shaping AI Asian beauty commerce.",
    sections: [
      {
        title: "Open roles (mock)",
        body: "Product Designer · Frontend Engineer · Creator Partnerships Lead · Brand Success Manager.",
      },
      {
        title: "How to apply",
        body: "Email careers@shortkey.beauty with portfolio + role title. This page is a placeholder for review.",
      },
    ],
    ctas: [{ label: "Contact →", href: "/contact", variant: "outline" }],
  },
  {
    path: "/press",
    title: "Press",
    badge: "COMPANY",
    shortcut: "CTRL + P",
    description: "Brand assets and story for media.",
    sections: [
      {
        title: "Boilerplate",
        body: "Shortkey is the AI Asian beauty operating system for try-on, influencer live, and founding brand growth.",
      },
      {
        title: "Assets (mock)",
        body: "Logo pack, founder headshots, and product screenshots will live here.",
      },
    ],
    ctas: [{ label: "Contact press →", href: "/contact" }],
  },
  {
    path: "/blog",
    title: "Blog",
    badge: "EDITORIAL",
    shortcut: "CTRL + B",
    description: "Looks, lives, and K / J / C beauty notes.",
    sections: [
      {
        title: "Featured (mock)",
        body: "Glass-skin chat notes · Soft-matte bases · Idol eye workshops — wire CMS later.",
      },
    ],
    ctas: [
      { label: "Influencers →", href: "/influencers", variant: "outline" },
      { label: "Videos →", href: "/videos" },
    ],
  },
  {
    path: "/help",
    title: "Help Center",
    badge: "SUPPORT",
    shortcut: "CTRL + ?",
    description: "Answers for try-on, orders, and creator shops.",
    sections: [
      {
        title: "Popular questions",
        body: "How try-on works · Where lives appear · How influencer shop checkout works · Founding brand onboarding.",
      },
    ],
    ctas: [
      { label: "Contact support →", href: "/contact" },
      { label: "Returns →", href: "/returns", variant: "outline" },
    ],
  },
  {
    path: "/shipping",
    title: "Shipping",
    badge: "SUPPORT",
    shortcut: "CTRL + S",
    description: "Regions, estimates, and tracking (mock policy).",
    sections: [
      {
        title: "Coverage",
        body: "SG / MY / HK / TW / KR / JP / US — ETA 3–10 business days depending on carrier. Mock copy for review.",
      },
    ],
    ctas: [{ label: "Help center →", href: "/help", variant: "outline" }],
  },
  {
    path: "/returns",
    title: "Returns",
    badge: "SUPPORT",
    shortcut: "CTRL + R",
    description: "Simple returns window for unopened beauty items.",
    sections: [
      {
        title: "Policy (mock)",
        body: "14-day return on unopened sealed items. Hygiene-sealed lip/eye products are final sale unless faulty.",
      },
    ],
    ctas: [{ label: "Contact →", href: "/contact" }],
  },
  {
    path: "/contact",
    title: "Contact",
    badge: "SUPPORT",
    shortcut: "CTRL + M",
    description: "Talk to Shortkey — fans, creators, and brands.",
    sections: [
      {
        title: "Channels (mock)",
        body: "Fans: help@shortkey.beauty · Creators: creators@shortkey.beauty · Brands: brands@shortkey.beauty",
      },
      {
        title: "Form placeholder",
        body: "Name · Email · Topic · Message. Wire to backend later — this is a review mock.",
      },
    ],
    ctas: [
      { label: "For brands →", href: "/brands" },
      { label: "Help →", href: "/help", variant: "outline" },
    ],
  },
  {
    path: "/terms",
    title: "Terms of Service",
    badge: "LEGAL",
    shortcut: "CTRL + T",
    description: "Placeholder terms for platform use. Replace with counsel-approved copy.",
    sections: [
      {
        title: "Summary",
        body: "Mock terms covering account use, influencer content, brand partnerships, and limitations of liability.",
      },
    ],
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    badge: "LEGAL",
    shortcut: "CTRL + V",
    description: "How Shortkey handles personal and try-on data (mock).",
    sections: [
      {
        title: "Summary",
        body: "We collect account, order, and session data to run try-on and commerce. Camera frames are processed for try-on and not sold.",
      },
    ],
  },
  {
    path: "/cookies",
    title: "Cookie Policy",
    badge: "LEGAL",
    shortcut: "CTRL + K",
    description: "Cookies and similar tech used on Shortkey (mock).",
    sections: [
      {
        title: "Summary",
        body: "Essential cookies for auth/cart · Analytics for product improvement · Preference cookies for region/locale.",
      },
    ],
  },
];

export const mockRegionPages = [
  {
    path: "/kbeauty",
    id: "kbeauty",
    title: "K-Beauty",
    region: "K-Beauty",
    description:
      "Korean beauty discovery — glass skin, soft matte, and live shade matching.",
  },
  {
    path: "/jbeauty",
    id: "jbeauty",
    title: "J-Beauty",
    region: "J-Beauty",
    description:
      "Japanese beauty discovery — dew finishes, idol eyes, and soft texture play.",
  },
  {
    path: "/cbeauty",
    id: "cbeauty",
    title: "C-Beauty",
    region: "C-Beauty",
    description:
      "Chinese beauty discovery — clean girl bases, red-carpet reds, and humidity-proof stacks.",
  },
] as const;

/** Central index for /mockups review */
export const allMockRoutes = [
  { href: "/try-on", label: "Try On" },
  { href: "/shop", label: "Shop" },
  { href: "/shop/SK-M003", label: "Product PDP (sample)" },
  { href: "/checkout", label: "Checkout (Stripe / Shopify)" },
  { href: "/videos", label: "Videos" },
  { href: "/makeover", label: "Makeover" },
  { href: "/influencers", label: "Influencers" },
  { href: "/influencers/hanna", label: "Influencer profile (Hanna)" },
  { href: "/kbeauty", label: "K-Beauty" },
  { href: "/jbeauty", label: "J-Beauty" },
  { href: "/cbeauty", label: "C-Beauty" },
  { href: "/brands", label: "Brands landing + Stripe fee" },
  ...mockStubPages.map((p) => ({ href: p.path, label: p.title })),
] as const;
