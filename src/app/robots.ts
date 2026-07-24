import type { MetadataRoute } from "next";

/**
 * Keep internal staging / control surfaces out of search indexes.
 * Pages under /internal also set robots: noindex in metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/internal/", "/control/", "/design", "/social"],
      },
    ],
  };
}
