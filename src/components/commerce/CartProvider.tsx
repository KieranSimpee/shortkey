"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/commerce/types";
import { getUnitPriceUsd } from "@/lib/commerce/pricing";
import { getGatewayIdsForSku } from "@/lib/commerce/sku-map";

const STORAGE_KEY = "shortkey-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (input: {
    sku: string;
    name: string;
    image: string;
    quantity?: number;
  }) => void;
  setQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

    return {
      lines,
      itemCount,
      subtotal,
      addItem({ sku, name, image, quantity = 1 }) {
        const map = getGatewayIdsForSku(sku);
        setLines((prev) => {
          const existing = prev.find((line) => line.sku === sku);
          if (existing) {
            return prev.map((line) =>
              line.sku === sku
                ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
                : line,
            );
          }
          return [
            ...prev,
            {
              sku,
              name,
              image,
              quantity: Math.min(99, quantity),
              unitPrice: getUnitPriceUsd(sku),
              currency: "USD",
              shopifyVariantId: map.shopifyVariantId,
              stripePriceId: map.stripePriceId,
            },
          ];
        });
      },
      setQuantity(sku, quantity) {
        setLines((prev) =>
          prev
            .map((line) =>
              line.sku === sku ? { ...line, quantity: Math.max(0, Math.min(99, quantity)) } : line,
            )
            .filter((line) => line.quantity > 0),
        );
      },
      removeItem(sku) {
        setLines((prev) => prev.filter((line) => line.sku !== sku));
      },
      clear() {
        setLines([]);
      },
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
