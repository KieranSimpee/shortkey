import type { NextConfig } from "next";

/** Isolate caches when family/studio/social/maya/beauty run in parallel locally. */
const surface = process.env.SHORTKEY_SURFACE?.trim();
const distDir =
  surface === "family" ||
  surface === "studio" ||
  surface === "social" ||
  surface === "maya"
    ? `.next-${surface}`
    : ".next-beauty";

const nextConfig: NextConfig = {
  distDir,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  serverExternalPackages: ["@mediapipe/tasks-vision"],
  async rewrites() {
    // Static HTML at clean URLs (public/ folders)
    return [
      { source: "/desk", destination: "/desk/index.html" },
      { source: "/desk/", destination: "/desk/index.html" },
      { source: "/app", destination: "/app/index.html" },
      { source: "/app/", destination: "/app/index.html" },
      // Magazine flip + Lovart galleries — trailing-slash safe for Next
      { source: "/magazine-demo", destination: "/magazine-demo/index.html" },
      { source: "/magazine-demo/", destination: "/magazine-demo/index.html" },
      { source: "/shortkey-assets", destination: "/shortkey-assets/index.html" },
      { source: "/shortkey-assets/", destination: "/shortkey-assets/index.html" },
    ];
  },
  async redirects() {
    // Legacy / invented paths — production monochrome
    return [
      {
        source: "/shortkey-app.html",
        destination: "/desk/",
        permanent: false,
      },
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
    const logoHeaders = logoFiles.map((source) => ({
      source,
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    }));
    // Founder Desk + Minion Chat — INTERNAL only (not public product)
    const deskHeaders = {
      source: "/desk/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    };
    return [...logoHeaders, deskHeaders];
  },
};

export default nextConfig;
