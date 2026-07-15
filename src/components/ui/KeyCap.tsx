import { cn } from "@/lib/utils";

type KeyCapProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
};

/** 3D keyboard key — core Shortkey brand DNA element */
export function KeyCap({ children, className, size = "md" }: KeyCapProps) {
  return (
    <span
      className={cn(
        "keycap inline-flex items-center justify-center rounded-md border border-white/90 bg-gradient-to-b from-white to-[#ece9f4] font-medium lowercase text-brand shadow-[0_2px_0_rgba(155,122,227,0.2),0_4px_12px_rgba(155,122,227,0.1)]",
        size === "sm" ? "px-2 py-0.5 text-[9px] sm:text-[10px]" : "px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

type ShortcutChipProps = {
  shortcut: string;
  className?: string;
};

/** Inline shortcut label e.g. CTRL + B */
export function ShortcutChip({ shortcut, className }: ShortcutChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-brand sm:text-[10px]",
        className,
      )}
    >
      {shortcut}
    </span>
  );
}
