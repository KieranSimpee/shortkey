import { ShortcutChip } from "@/components/ui/KeyCap";
import { cn } from "@/lib/utils";

export function SectionShortcutBar({
  shortcut,
  label,
  dark = false,
}: {
  shortcut: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5 sm:mb-4">
      <ShortcutChip
        shortcut={shortcut}
        className={cn(
          dark && "border-brand-light/30 bg-white/10 text-brand-light",
        )}
      />
      <span className={cn("type-section-muted", dark && "text-white/50")}>
        {label.startsWith("//") ? label : `// ${label}`}
      </span>
    </div>
  );
}
