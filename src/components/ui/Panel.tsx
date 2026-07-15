import { KeyCap } from "@/components/ui/KeyCap";
import { cn } from "@/lib/utils";
import type { SignupLevel } from "@/content/brandConfirmation";

export function PanelCard({
  children,
  className,
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        highlight
          ? "panel-card-highlight"
          : "panel-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PanelCardInner({
  children,
  className,
  error = false,
}: {
  children: React.ReactNode;
  className?: string;
  error?: boolean;
}) {
  return (
    <div className={cn(error ? "panel-card-inner-error" : "panel-card-inner", className)}>
      {children}
    </div>
  );
}

export function SectionLabel({
  children,
  className,
  spacing = "mb-4",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: string;
  light?: boolean;
}) {
  const text = typeof children === "string" && !children.startsWith("//") ? `// ${children}` : children;

  return (
    <p
      className={cn(
        "type-section-muted",
        light ? "text-brand/70" : "text-brand-light/70",
        spacing,
        className,
      )}
    >
      {text}
    </p>
  );
}

export function PanelMetaStrip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("panel-meta-strip", className)}>{children}</div>;
}

export function PanelStatBox({
  label,
  value,
  mono = false,
  light = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  light?: boolean;
}) {
  return (
    <div className="panel-stat-box">
      <p className="panel-field-label">{label}</p>
      <p
        className={cn(
          "mt-1 text-sm",
          light ? "price-value" : "font-medium text-white",
          mono && !light && "font-mono text-brand-light",
          mono && light && "font-mono text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function PanelFieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="panel-field-label mb-1.5 block">{children}</span>;
}

export function PanelInput({
  className,
  error = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn("panel-input", error && "panel-input-error", className)}
      {...props}
    />
  );
}

export function PanelAlert({
  children,
  variant = "warning",
  className,
}: {
  children: React.ReactNode;
  variant?: "warning" | "info" | "brand";
  className?: string;
}) {
  const variantClass =
    variant === "info"
      ? "panel-alert-info"
      : variant === "brand"
        ? "panel-alert-brand"
        : "panel-alert-warning";

  return <div className={cn(variantClass, className)}>{children}</div>;
}

export function PanelRow({
  label,
  value,
  borderTop = false,
  light = false,
}: {
  label: string;
  value: React.ReactNode;
  borderTop?: boolean;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b pb-3 text-sm last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
        light ? "panel-row-divider border-brand/10" : "border-white/10",
        borderTop && (light ? "border-t border-brand/10 pt-3" : "border-t border-white/10 pt-3"),
      )}
    >
      <span className={light ? "text-ink-muted" : "text-white/50"}>{label}</span>
      <span className={cn("sm:text-right", light ? "price-value" : "font-medium text-white")}>{value}</span>
    </div>
  );
}

function WindowChrome({ light = false }: { light?: boolean }) {
  return (
    <div className="absolute left-3 top-3 flex gap-1.5" aria-hidden>
      <span className={cn("h-2 w-2 rounded-full", light ? "bg-brand/25" : "bg-white/15")} />
      <span className={cn("h-2 w-2 rounded-full", light ? "bg-brand/25" : "bg-white/15")} />
      <span className={cn("h-2 w-2 rounded-full", light ? "bg-brand/25" : "bg-white/15")} />
    </div>
  );
}

export function SignupTierCard({
  option,
  selected,
  light = false,
}: {
  option: SignupLevel;
  selected: boolean;
  light?: boolean;
}) {
  return (
    <li
      className={cn(
        "panel-tier-card",
        light ? "p-4" : "relative overflow-hidden pt-9",
        selected ? "panel-tier-card-selected" : "panel-tier-card-default",
      )}
    >
      {!light ? <WindowChrome light={light} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {!light ? (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <KeyCap size="sm" className="uppercase tracking-wide text-brand-dark">
                {option.shortcutKey}
              </KeyCap>
              {selected ? (
                <span className="rounded-full border border-brand-light/30 bg-brand-light/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-light">
                  Selected
                </span>
              ) : null}
            </div>
          ) : (
            selected ? (
              <p className="mb-2 text-xs text-ink-muted">Selected plan</p>
            ) : null
          )}
          <p className={cn(light ? "text-sm font-medium text-ink" : "text-lg font-semibold text-white")}>
            {option.name}
          </p>
          <p className={cn("mt-1 text-sm", light ? "text-ink-muted" : "text-white/55")}>
            {option.feeLabel}
          </p>
          {option.campaignNote ? (
            <p className={cn("mt-2 text-xs leading-relaxed", light ? "text-ink-muted" : "text-brand-light/90")}>
              {option.campaignNote}
            </p>
          ) : null}
        </div>
        <p className={cn(light ? "price-value" : "text-2xl font-black tracking-tight text-brand-light")}>
          {option.fee}
        </p>
      </div>
    </li>
  );
}
