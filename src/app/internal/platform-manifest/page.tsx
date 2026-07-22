import type { Metadata } from "next";
import manifestJson from "@/data/shortkey-platform-manifest.json";
import {
  PlatformManifestStudio,
  type PlatformManifest,
} from "@/components/internal/PlatformManifestStudio";

export const metadata: Metadata = {
  title: "Platform Manifest | Shortkey Studio (Internal)",
  description:
    "shortkey.studio internal control center — platform map, feature registry, and manifest export. Gor Gor Review required before push.",
  robots: { index: false, follow: false },
};

const manifest = manifestJson as PlatformManifest;

/**
 * Internal shortkey.studio — Platform Manifest.
 * NOT linked from public nav/footer. Blueprint: SHORTKEY_MASTER_BLUEPRINT_v1.md § Internal experience.
 */
export default function PlatformManifestPage() {
  return (
    <div className="min-h-screen bg-silk">
      <PlatformManifestStudio manifest={manifest} />
    </div>
  );
}
