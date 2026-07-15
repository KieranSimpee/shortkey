import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve /public images directly — local assets only; avoids optimizer timeouts in dev.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  serverExternalPackages: ["@mediapipe/tasks-vision"],
};

export default nextConfig;
