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
          "/social",
          "/desk",
          "/desk/",
          "/showcase",
          "/showcase/",
          "/magazine-demo",
          "/magazine-demo/",
        ],
      },
    ],
  };
}
