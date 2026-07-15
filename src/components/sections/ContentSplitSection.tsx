import { AiLabSection } from "@/components/sections/AiLabSection";
import { CmsZone } from "@/components/cms/CmsZone";

export function ContentSplitSection() {
  return (
    <section id="tbeauty" className="pb-4 pt-0 lg:pb-6">
      <div className="px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CmsZone id="ai-lab">
            <AiLabSection embedded />
          </CmsZone>
        </div>
      </div>
    </section>
  );
}
