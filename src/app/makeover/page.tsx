import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";

export const metadata = {
  title: "Makeover | Shortkey",
  description: "Korean and Asian makeup tutorial gateway.",
};

export default function MakeoverPage() {
  return (
    <MockPageShell
      shortcut="CTRL + M"
      badge="MAKEOVER"
      title="Korean & Asian makeup makeovers"
      description="Gateway to full-face tutorials on social — YouTube search plus Shortkey video library."
      ctas={[
        {
          label: "Open YouTube tutorials →",
          href: "https://www.youtube.com/results?search_query=korean+asian+makeup+tutorial",
        },
        { label: "Videos library →", href: "/videos", variant: "outline" },
        { label: "Try on →", href: "/try-on", variant: "outline" },
      ]}
    >
      <MockNote>
        Review choice: keep CTA external-only, or embed curated playlists later.
      </MockNote>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MockBlock
          title="Suggested playlists (mock)"
          body="Glass skin · Soft matte · Idol eye · Clean girl humidity · Gradient lip."
        />
        <MockBlock
          title="Creators to follow (mock)"
          body="Dear Peachie · Hyojin Cho / Risabae style lanes · Shortkey live hosts."
        />
      </div>
    </MockPageShell>
  );
}