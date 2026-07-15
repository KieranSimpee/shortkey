"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/content/homepage";
import { useBeautyOs } from "@/components/beauty-os/BeautyOsProvider";
import { ShortcutChip } from "@/components/ui/KeyCap";

/**
 * Product strip under Beauty OS tabs — same max width as the tablist.
 * Shows 5–6 SKUs; auto-fits across breakpoints.
 */
export function BeautyOsProductRow() {
  const { beautyOs } = siteContent;
  const { activeId } = useBeautyOs();

  const shortcuts = beautyOs.categories.flatMap((category) => category.shortcuts);
  const activeFolder =
    beautyOs.folders.find((f) => f.id === activeId) ?? beautyOs.folders[0];
  const activeTab = shortcuts.find((s) => s.id === activeId) ?? shortcuts[0];

  const products = activeFolder.products.slice(0, 6);

  return (
    <div
      role="tabpanel"
      aria-label={`${activeFolder.title} products`}
      className="mt-2 w-full"
    >
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2 px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/80 sm:text-[11px]">
          {activeTab.shortcut} · {activeFolder.title}
        </p>
        <p className="max-w-md text-[11px] leading-snug text-ink-muted sm:text-xs">
          {activeFolder.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-2.5 lg:grid-cols-6 lg:gap-3">
        {products.map((product) => (
          <Link
            key={product.sku}
            href={product.href}
            className="group min-w-0 overflow-hidden rounded-xl border border-white/50 bg-white/35 transition-shadow hover:shadow-soft"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 18vw, 160px"
              />
            </div>
            <div className="border-t border-white/40 px-1.5 py-1.5 sm:px-2">
              <div className="mb-0.5 flex items-center justify-between gap-1">
                <p className="truncate font-mono text-[8px] uppercase tracking-wider text-brand/70 sm:text-[9px]">
                  {product.sku}
                </p>
                <ShortcutChip shortcut={activeTab.shortcut} className="hidden text-[7px] sm:inline-flex" />
              </div>
              <h3 className="type-nav-label truncate text-[9px] text-ink sm:text-[10px]">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
