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
  async redirects() {
    // Legacy / invented paths → production monochrome
    return [
      {
        source: "/images/shortkey-logo-clear.png",
        destination: "/logo/shortkey-primary.png",
        permanent: false,
      },
      {
        source: "/brand/LOGO-001.svg",
        destination: "/logo/shortkey-primary.png",
        permanent: false,
      },
      {
        source: "/brand/LOGO-001.png",
        destination: "/logo/shortkey-primary.png",
        permanent: false,
      },
      {
        source: "/logo/shortkey-primary-dark.svg",
        destination: "/logo/shortkey-primary-on-dark.png",
        permanent: false,
      },
      {
        source: "/logo/shortkey-primary-light.svg",
        destination: "/logo/shortkey-primary.png",
        permanent: false,
      },
    ];
  },
  async headers() {
    const logoFiles = [
      "/logo/shortkey-primary.png",
      "/logo/shortkey-primary-on-dark.png",
      "/logo/shortkey-icon.png",
      "/logo/shortkey-favicon-32.png",
      "/logo/shortkey-favicon-64.png",
      "/logo/shortkey-favicon-128.png",
      "/logo/shortkey-favicon-256.png",
      "/logo/shortkey-favicon-512.png",
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
