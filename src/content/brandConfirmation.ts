import { siteContent } from "@/content/homepage";
import { productImg } from "@/lib/images";

export type SignupLevel = {
  id: string;
  name: string;
  fee: string;
  feeLabel: string;
  shortcutKey: string;
  campaignNote?: string;
};

export type ConfirmationSku = {
  sku: string;
  name: string;
  type: string;
  image: string;
  onlineRetailUsd: number;
};

export type InvoiceLine = {
  label: string;
  value: string;
};

export type PlatformLink = {
  channel: string;
  routesTo: string;
  note: string;
};

export const brandConfirmationContent = {
  shortcut: "CTRL + B",
  sectionLabel: "FOUNDING BRAND CONFIRMATION",
  tag: "REGISTRATION CONFIRMED",
  headline: "Thank you — your founding brand registration is confirmed.",
  subtext:
    "Complete the steps below to activate your partnership. Our associates will follow up with you for research after submission.",

  sections: {
    partnership: {
      title: "Partnership level",
    },
    benefits: {
      title: "Benefits & terms",
      subtitle: "Your selected partnership includes the following.",
    },
    skus: {
      title: "Product upload — first catalogue",
      subtitle:
        "We encourage brands to upload more than 10 SKUs where possible. While 300 pcs per new SKU is the minimum requirement, a broader catalogue improves discovery, influencer matching, and platform exposure.",
      skuTargetNote:
        "Recommended: 10+ SKUs for launch. Minimum: 300 pcs per new item · 500 pcs standard inventory.",
      costLabel: "Your cost (USD)",
      retailLabel: "Your retail price (USD)",
      quickSearchLabel: "Quick search — online retail",
      quickSearchNote: "We check public online pricing. Your retail cannot exceed this benchmark.",
      retailBlocked:
        "Retail price is higher than online retail — entry blocked. Lower your price to match or beat market rate.",
      fulfillmentReminders: [
        "All orders must be sent within 7 days.",
        "If multiple brands are involved, we will use a DHL auto-arranged pick-up on the 5th day, shared between vendors.",
        "Delays will result in a penalty and reduced platform exposure.",
        "Inventory of 500 pcs is required to fulfil our reputation — new items may be accepted at 300 pcs.",
        "Brand accounts must submit a DHL account as part of onboarding.",
      ],
    },
    vendor: {
      title: "Vendor information",
      subtitle: "Set up your vendor profile before payment. All fields help us prepare onboarding and associate research.",
      fields: {
        address: "Business address",
        contactEmail: "Contact email",
        product: "Product range",
        targetMarket: "Target market",
        currentMarket: "Current market",
        supportNeeds: "Gaps or support needed",
        yearRevenue: "Annual revenue (USD)",
        strength: "Brand strength",
        identity: "Brand identity",
      },
      placeholders: {
        address: "Registered business address",
        contactEmail: "you@yourbrand.com",
        product: "Core categories and hero SKUs",
        targetMarket: "e.g. US, Southeast Asia, Gen Z beauty",
        currentMarket: "Where you sell today",
        supportNeeds: "What is missing or where you want platform support",
        yearRevenue: "e.g. USD 500,000",
        strength: "e.g. formulation, community, K-beauty heritage",
        identity: "How your brand should be positioned on Shortkey",
      },
      followUpNote:
        "After submission, Shortkey associates will follow up with you for research and onboarding coordination.",
    },
    payment: {
      title: "Payment",
      subtitle: "Choose your payment route once vendor information is complete.",
      privacyNotice:
        "No confidential banking credentials are shown on the platform. Payment is handled securely via the provider you select.",
      dueLabel: "Standard payment term",
      dueValue: "45 days",
      amountLabel: "Partnership fee",
      referenceLabel: "Confirmation reference",
    },
    operations: {
      title: "Fulfillment & platform operations",
      points: [
        "DHL: submit your DHL account during onboarding. We use your collective account structure to achieve the best rate. The platform may pay other vendor costs upfront where required for launch coordination.",
        "Influencer and platform calculations are cross-checked across TINT, Shopify, and influencer reporting before go-live.",
        "Standard payment term is 45 days unless otherwise agreed in writing.",
      ],
    },
    productUpload: {
      title: "Product upload format",
      subtitle: "Use the TINT onboarding guide and CSV template for your first upload.",
      points: [
        "Download and follow the TINT onboarding guide sent to your registered email.",
        "Prepare product data in CSV format using the Shortkey template.",
        "Include imagery, SKU codes, pricing, and try-on assets as specified in the guide.",
      ],
    },
    invoice: {
      title: "Invoice payment",
      subtitle:
        "For security, payment and banking details are never shown on the platform. Your invoice will be sent to your registered business email.",
      privacyNotice:
        "No confidential account, banking, or payment credentials are published on Shortkey. Sensitive onboarding is handled via secure email only.",
    },
    nextStep: {
      title: "After payment",
      message:
        "Once vendor information and payment are complete, your onboarding pack — TINT guide, CSV template, and email signature requirements — will be sent to your registered business email within 24–48 hours.",
    },
    platformLinks: {
      title: "Platform routing",
      subtitle: "Your brand account connects through Shortkey to the providers below.",
    },
    legal: {
      title: "Email signature & legal terms",
      subtitle: "Required before your brand account goes live.",
      emailSignatureTitle: "Official email signature",
      emailSignatureBody:
        "Submit your brand’s official email signature for all Shortkey partner correspondence. Include authorised signatory name, job title, brand name, business email, and contact number. Use your registered business domain only. Reply to your onboarding email with your signature block — do not post it on the platform.",
      termsTitle: "Brand partner terms",
    },
  },

  platformLinks: [
    {
      channel: "Brand",
      routesTo: "Shopify",
      note: "Brand profile, catalogue, and storefront",
    },
    {
      channel: "Marketing",
      routesTo: "Airwallex or PayPal",
      note: "Campaign spend and collective ad fund payments",
    },
    {
      channel: "Sales",
      routesTo: "Shopify",
      note: "Standard checkout and order fulfilment",
    },
    {
      channel: "Streaming sales",
      routesTo: "Shopify",
      note: "Live commerce and stream checkout",
    },
  ] satisfies PlatformLink[],

  legalTerms: [
    "By completing registration and payment, you agree to the Shortkey Brand Partner Terms & Conditions and accept that your founding or partner tier fees, commission rate, and fulfilment obligations apply as selected.",
    "You confirm that all products listed are authentic, accurately described, compliant with applicable laws, and that pricing submitted does not exceed verified online retail benchmarks.",
    "You agree to fulfil orders within the stated timeframe, maintain required inventory levels, submit a valid DHL account, and accept shared pick-up arrangements where multiple brands are involved.",
    "You grant Shortkey a non-exclusive licence to use your product images, descriptions, and brand assets solely for platform listing, marketing, and AI try-on features.",
    "Confidential information — including unpublished rates, partner terms, and internal platform data — must not be disclosed without Shortkey’s written consent.",
    "Shortkey may suspend or terminate your account for pricing violations, fulfilment delays, misrepresentation, or breach of these terms. Founding status is non-transferable.",
    "To the fullest extent permitted by law, Shortkey’s liability is limited to fees paid by you in the twelve months preceding any claim. The platform is provided on an as-is basis.",
    "These terms are governed by the laws of Singapore. Disputes are subject to the exclusive jurisdiction of the courts of Singapore.",
  ],

  defaultLevelId: "founding",
  defaultSkuCodes: ["SK-M001", "SK-M002", "SK-M003"],

  invoice: {
    referenceLabel: "Confirmation reference",
    amountLabel: "Amount due",
    dueLabel: "Payment term",
    dueValue: "45 days standard",
    lines: [
      { label: "Payment method", value: "Bank transfer (invoice)" },
      { label: "Invoice delivery", value: "Registered business email — not shown here" },
    ] satisfies InvoiceLine[],
  },

  paymentLinks: {
    paypal: {
      label: "Pay via PayPal",
      href: "https://www.paypal.com/",
      note: "Marketing and collective ad fund payments",
    },
    commerce: {
      label: "Pay founding fee via Stripe Checkout",
      href: "/brands",
      note: "Brand, sales, and streaming commerce setup",
    },
  },

  ctas: {
    home: { label: "Back to homepage", href: "/" },
    support: { label: "Contact support", href: "mailto:brands@shortkey.beauty" },
  },

  confirmationMeta: {
    referencePrefix: "SK-FB-",
    registeredLabel: "Registered",
  },
} as const;

const signupLevels: Record<string, SignupLevel> = {
  founding: {
    id: "founding",
    name: "Founding Brand",
    fee: "USD 5,000",
    feeLabel: "One-time founding fee — 5% commission locked for life",
    shortcutKey: "ctrl",
    campaignNote:
      "You may be selected for a platform-led influencer campaign. Selection and announcements will be made in the first week of August.",
  },
  partner: {
    id: "partner",
    name: "Brand Partner",
    fee: "USD 2,500",
    feeLabel: "One-time entry fee — 20% handling",
    shortcutKey: "alt",
  },
};

export const signupLevelOptions = Object.values(signupLevels);

/** Demo online retail benchmarks for quick-search validation (replace with live API). */
const onlineRetailBenchmarks: Record<string, number> = {
  "SK-M001": 18.0,
  "SK-M002": 22.0,
  "SK-M003": 26.0,
  "SK-M004": 19.0,
  "SK-M005": 24.0,
};

function onlineRetailForSku(sku: string) {
  return onlineRetailBenchmarks[sku] ?? 20.0;
}

function findProductBySku(sku: string) {
  for (const folder of siteContent.beautyOs.folders) {
    const product = folder.products.find((entry) => entry.sku === sku);
    if (product) return product;
  }
  return null;
}

export function resolveSignupLevel(levelParam?: string): SignupLevel {
  if (levelParam && signupLevels[levelParam]) {
    return signupLevels[levelParam];
  }
  return signupLevels[brandConfirmationContent.defaultLevelId];
}

export function resolveConfirmationSkus(skusParam?: string): ConfirmationSku[] {
  const codes = skusParam
    ? skusParam.split(",").map((code) => code.trim()).filter(Boolean)
    : [...brandConfirmationContent.defaultSkuCodes];

  return codes.map((sku) => {
    const product = findProductBySku(sku);
    if (product) {
      return {
        sku: product.sku,
        name: product.name,
        type: product.type,
        image: product.image,
        onlineRetailUsd: onlineRetailForSku(product.sku),
      };
    }

    return {
      sku,
      name: sku,
      type: "Product",
      image: productImg(sku),
      onlineRetailUsd: onlineRetailForSku(sku),
    };
  });
}

export function buildConfirmationReference(seed?: string) {
  const suffix = seed ?? "DEMO";
  return `${brandConfirmationContent.confirmationMeta.referencePrefix}${suffix}`;
}
