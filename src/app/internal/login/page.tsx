import { Suspense } from "react";
import type { Metadata } from "next";
import { InternalStagingLogin } from "@/components/internal/InternalStagingLogin";

export const metadata: Metadata = {
  title: "Internal Staging Unlock | shortkey.studio",
  description: "Shared-secret unlock for ShortKey internal staging. Not public launch.",
  robots: { index: false, follow: false },
};

export default function InternalLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-silk via-silk to-silk-dark/40 text-ink">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-ink-muted">
            Loading unlock…
          </div>
        }
      >
        <InternalStagingLogin />
      </Suspense>
    </div>
  );
}
