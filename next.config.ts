import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  serverExternalPackages: ["@mediapipe/tasks-vision"],
  async headers() {
    // Exact paths — avoid path-to-regexp repeat errors on Windows Next 15
    const logoFiles = [
      "/images/shortkey-logo-clear.png",
      "/images/shortkey-logo.png",
      "/images/shortkey-logo-locked.png",
    ];
    return logoFiles.map((source) => ({
      source,
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    }));
  },
};

export default nextConfig;
