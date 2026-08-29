import type { NextConfig } from "next";

/** Isolate caches when family/studio/social/maya/beauty run in parallel locally.
 *  Vercel production must keep default `.next` (custom distDir breaks that deploy). */
const surface = process.env.SHORTKEY_SURFACE?.trim();
const distDir = process.env.VERCEL
  ? ".next"
  : surface === "family" ||
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
      {
        source: "/studio-review/discovery-demo",
        destination: "/studio-review/discovery-demo/index.html",
      },
      {
        source: "/studio-review/discovery-demo/",
        destination: "/studio-review/discovery-demo/index.html",
      },
      // Permanent short link — bookmark /discovery (public/discovery/index.html)
      { source: "/discovery", destination: "/discovery/index.html" },
      { source: "/discovery/", destination: "/discovery/index.html" },
      {
        source: "/platform-magazine-dna",
        destination: "/platform-magazine-dna/index.html",
      },
      {
        source: "/platform-magazine-dna/",
        destination: "/platform-magazine-dna/index.html",
      },
      {
        source: "/platform-magazine-dna/v1",
        destination: "/platform-magazine-dna/v1/index.html",
      },
      {
        source: "/platform-magazine-dna/v1/",
        destination: "/platform-magazine-dna/v1/index.html",
      },
      {
        source: "/platform-magazine-dna/templates-v1",
        destination: "/platform-magazine-dna/templates-v1/index.html",
      },
      {
        source: "/platform-magazine-dna/templates-v1/",
        destination: "/platform-magazine-dna/templates-v1/index.html",
      },
      {
        source: "/platform-magazine-dna/page-turn-benchmark",
        destination: "/platform-magazine-dna/page-turn-benchmark/index.html",
      },
      {
        source: "/platform-magazine-dna/page-turn-benchmark/",
        destination: "/platform-magazine-dna/page-turn-benchmark/index.html",
      },

      // Agent roster + AOS dashboard — trailing-slash safe for Next
      { source: "/agent-roster", destination: "/agent-roster/index.html" },
      { source: "/agent-roster/", destination: "/agent-roster/index.html" },
      { source: "/aos-dashboard", destination: "/aos-dashboard/index.html" },
      { source: "/aos-dashboard/", destination: "/aos-dashboard/index.html" },
      { source: "/homepage-design", destination: "/homepage-design/index.html" },
      { source: "/homepage-design/", destination: "/homepage-design/index.html" },
      { source: "/influencer-picks-design", destination: "/influencer-picks-design/index.html" },
      { source: "/influencer-picks-design/", destination: "/influencer-picks-design/index.html" },
      { source: "/one-page-design", destination: "/one-page-design/index.html" },
      { source: "/one-page-design/", destination: "/one-page-design/index.html" },
      { source: "/discovery-page-design", destination: "/discovery-page-design/index.html" },
      { source: "/discovery-page-design/", destination: "/discovery-page-design/index.html" },
      { source: "/final-platform-design", destination: "/final-platform-design/index.html" },
      { source: "/final-platform-design/", destination: "/final-platform-design/index.html" },
      { source: "/magazine-issue01-design", destination: "/magazine-issue01-design/index.html" },
      { source: "/magazine-issue01-design/", destination: "/magazine-issue01-design/index.html" },
      { source: "/merged-glass-skin-design", destination: "/merged-glass-skin-design/index.html" },
      { source: "/merged-glass-skin-design/", destination: "/merged-glass-skin-design/index.html" },
      { source: "/makeup-page-design", destination: "/makeup-page-design/index.html" },
      { source: "/makeup-page-design/", destination: "/makeup-page-design/index.html" },
      { source: "/runway-issue01-v2-design", destination: "/runway-issue01-v2-design/index.html" },
      { source: "/runway-issue01-v2-design/", destination: "/runway-issue01-v2-design/index.html" },
      { source: "/design-reference-1", destination: "/design-reference-1/index.html" },
      { source: "/design-reference-1/", destination: "/design-reference-1/index.html" },
      { source: "/design-reference-1/hi-fi-3-pages", destination: "/design-reference-1/hi-fi-3-pages/index.html" },
      { source: "/design-reference-1/hi-fi-3-pages/", destination: "/design-reference-1/hi-fi-3-pages/index.html" },
      { source: "/design-reference-1/hover-video", destination: "/design-reference-1/hover-video/index.html" },
      { source: "/design-reference-1/hover-video/", destination: "/design-reference-1/hover-video/index.html" },
      { source: "/design-reference-1/wireframe-12", destination: "/design-reference-1/wireframe-12/index.html" },
      { source: "/design-reference-1/wireframe-12/", destination: "/design-reference-1/wireframe-12/index.html" },
      { source: "/design-reference-1/review-center", destination: "/design-reference-1/review-center/index.html" },
      { source: "/design-reference-1/review-center/", destination: "/design-reference-1/review-center/index.html" },
      { source: "/platform-frame-v7", destination: "/platform-frame-v7/index.html" },
      { source: "/platform-frame-v7/", destination: "/platform-frame-v7/index.html" },
      { source: "/platform-frame-v7/v1", destination: "/platform-frame-v7/v1/index.html" },
      { source: "/platform-frame-v7/v1/", destination: "/platform-frame-v7/v1/index.html" },
      { source: "/design-reference-2", destination: "/design-reference-2/index.html" },
      { source: "/design-reference-2/", destination: "/design-reference-2/index.html" },
      { source: "/design-reference-2/v1", destination: "/design-reference-2/v1/index.html" },
      { source: "/design-reference-2/v1/", destination: "/design-reference-2/v1/index.html" },
      { source: "/presentation-reference", destination: "/presentation-reference/index.html" },
      { source: "/presentation-reference/", destination: "/presentation-reference/index.html" },
      { source: "/presentation-reference/v1", destination: "/presentation-reference/v1/index.html" },
      { source: "/presentation-reference/v1/", destination: "/presentation-reference/v1/index.html" },
      { source: "/domain-review", destination: "/domain-review/index.html" },
      { source: "/domain-review/", destination: "/domain-review/index.html" },
      { source: "/domain-review/execution-guide", destination: "/domain-review/execution-guide/index.html" },
      { source: "/domain-review/execution-guide/", destination: "/domain-review/execution-guide/index.html" },
      { source: "/studio-v2-reference", destination: "/studio-v2-reference/index.html" },
      { source: "/studio-v2-reference/", destination: "/studio-v2-reference/index.html" },
      { source: "/studio-v2-reference/v1", destination: "/studio-v2-reference/v1/index.html" },
      { source: "/studio-v2-reference/v1/", destination: "/studio-v2-reference/v1/index.html" },
      { source: "/brand-dna-reference", destination: "/brand-dna-reference/index.html" },
      { source: "/brand-dna-reference/", destination: "/brand-dna-reference/index.html" },
      { source: "/brand-dna-reference/v1", destination: "/brand-dna-reference/v1/index.html" },
      { source: "/brand-dna-reference/v1/", destination: "/brand-dna-reference/v1/index.html" },
      { source: "/prototype-p1-reference", destination: "/prototype-p1-reference/index.html" },
      { source: "/prototype-p1-reference/", destination: "/prototype-p1-reference/index.html" },
      { source: "/prototype-p1-reference/v1", destination: "/prototype-p1-reference/v1/index.html" },
      { source: "/prototype-p1-reference/v1/", destination: "/prototype-p1-reference/v1/index.html" },
      { source: "/brand-onboarding-form", destination: "/brand-onboarding-form/index.html" },
      { source: "/brand-onboarding-form/", destination: "/brand-onboarding-form/index.html" },
      { source: "/brand-onboarding-form/v1", destination: "/brand-onboarding-form/v1/index.html" },
      { source: "/brand-onboarding-form/v1/", destination: "/brand-onboarding-form/v1/index.html" },
      { source: "/tint-platform", destination: "/tint-platform/index.html" },
      { source: "/tint-platform/", destination: "/tint-platform/index.html" },
      { source: "/control/controller", destination: "/control/controller.html" },
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
