import { notFound } from "next/navigation";
import { MockBlock, MockNote, MockPageShell } from "@/components/mock/MockPageShell";
import { mockStubPages } from "@/content/mockPages";

export function StubPage({ path }: { path: string }) {
  const stub = mockStubPages.find((p) => p.path === path);
  if (!stub) notFound();

  return (
    <MockPageShell
      shortcut={stub.shortcut}
      badge={stub.badge}
      title={stub.title}
      description={stub.description}
      ctas={stub.ctas}
    >
      <MockNote>Stub mock for review — replace with final copy/design when ready.</MockNote>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {stub.sections.map((section) => (
          <MockBlock key={section.title} title={section.title} body={section.body} />
        ))}
      </div>
    </MockPageShell>
  );
}
