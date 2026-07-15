import { HeroSection } from "@/components/sections/HeroSection";
import { CommandsSection } from "@/components/sections/CommandsSection";
import { ContentSplitSection } from "@/components/sections/ContentSplitSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { BeautyOsProvider } from "@/components/beauty-os/BeautyOsProvider";

export default function HomePage() {
  return (
    <BeautyOsProvider defaultId="pout">
      <HeroSection />
      <CommandsSection />
      <ContentSplitSection />
      <BrandsSection />
    </BeautyOsProvider>
  );
}
