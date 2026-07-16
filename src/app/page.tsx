import { ComingSoonPage } from "@/components/ComingSoonPage";
import { HeroSection } from "@/components/sections/HeroSection";
import { CommandsSection } from "@/components/sections/CommandsSection";
import { ContentSplitSection } from "@/components/sections/ContentSplitSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { BeautyOsProvider } from "@/components/beauty-os/BeautyOsProvider";
import { COMING_SOON } from "@/lib/comingSoon";

export default function HomePage() {
  if (COMING_SOON) {
    return <ComingSoonPage />;
  }

  return (
    <BeautyOsProvider defaultId="pout">
      <HeroSection />
      <CommandsSection />
      <ContentSplitSection />
      <BrandsSection />
    </BeautyOsProvider>
  );
}
