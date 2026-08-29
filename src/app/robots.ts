import type { MetadataRoute } from "next";

/**
 * Keep internal staging / control surfaces out of search indexes.
 * Pages under /internal also set robots: noindex in metadata.
 * /desk = Founder Desk + Minion Chat Box (INTERNAL only · soft PIN).
 * Magazine/showcase = on-domain but PRIVATE (soft staging cookie).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/internal/",
          "/control/",
          "/control-center/",
          "/design",
          "/homepage-design",
          "/homepage-design/",
          "/influencer-picks-design",
          "/influencer-picks-design/",
          "/one-page-design",
          "/one-page-design/",
          "/discovery-page-design",
          "/discovery-page-design/",
          "/final-platform-design",
          "/final-platform-design/",
          "/magazine-issue01-design",
          "/magazine-issue01-design/",
          "/merged-glass-skin-design",
          "/merged-glass-skin-design/",
          "/makeup-page-design",
          "/makeup-page-design/",
          "/runway-issue01-v2-design",
          "/runway-issue01-v2-design/",
          "/design-reference-1",
          "/design-reference-1/",
          "/design-reference-2",
          "/design-reference-2/",
          "/platform-frame-v7",
          "/platform-frame-v7/",
          "/presentation-reference",
          "/presentation-reference/",
          "/domain-review",
          "/domain-review/",
          "/studio-v2-reference",
          "/studio-v2-reference/",
          "/brand-dna-reference",
          "/brand-dna-reference/",
          "/prototype-p1-reference",
          "/prototype-p1-reference/",
          "/brand-onboarding-form",
          "/brand-onboarding-form/",
          "/tint-platform",
          "/tint-platform/",
          "/social",
          "/desk",
          "/desk/",
          "/showcase",
          "/showcase/",
          "/magazine-demo",
          "/magazine-demo/",
          "/four-hour",
          "/four-hour/",
        ],
      },
    ],
  };
}
