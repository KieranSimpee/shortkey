import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = {
  title: "AI Try-On | Shortkey",
  description: "Virtual try-on studio — mock landing pointing to the homepage hero studio.",
};

export default function TryOnPage() {
  return (
    <MockPageShell
      shortcut="CTRL + T"
      badge="TRY ON"
      title="AI virtual try-on"
      description="Dedicated landing for try-on. For now the live studio still runs on the homepage hero."
      ctas={[
        { label: "Open hero studio →", href: "/#try-on" },
        { label: "Shop shades →", href: "/shop", variant: "outline" },
      ]}
    >
      <MockNote>
        Mock page — next step can mount HeroTryOnStudio here as a full-page experience.
      </MockNote>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MockBlock
          title="Lips"
          body="Apply tint from Beauty OS lip SKUs. Feathered landmark mask on the homepage model."
        />
        <MockBlock
          title="Cheeks"
          body="Soft blush mapping with radial falloff. Pair with influencer shop shades."
        />
        <MockBlock
          title="Eyes"
          body="Lid color overlay from liner / shadow picks. Screenshot look CTA from creator lives."
        />
      </div>
    </MockPageShell>
  );
}
