"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type TintVtoElement = HTMLElement & {
  open: () => Promise<void>;
  close?: () => Promise<void> | void;
  useWebcam?: () => Promise<MediaStream | null>;
  useImage?: (blob: Blob) => Promise<void> | void;
  usePhoto?: (blob: Blob) => Promise<void> | void;
  applyProduct?: (sku: string) => Promise<void> | void;
};

export type TintOpenOptions = {
  /** Optional merchant catalog SKU to apply after open */
  sku?: string;
  /**
   * Still photo to try on (e.g. hero model). When set, camera/webcam is NOT used —
   * TINT analyzes this image instead of starting a live scan.
   */
  imageUrl?: string;
  /** Prefer camera (default false when imageUrl is set) */
  preferCamera?: boolean;
};

type TintVtoApi = {
  ready: boolean;
  open: (options?: TintOpenOptions) => Promise<void>;
  merchantId: string;
};

const TintVtoContext = createContext<TintVtoApi | null>(null);

export function useTintVto() {
  return useContext(TintVtoContext);
}

const imageBlobCache = new Map<string, Promise<Blob>>();

function fetchImageBlob(url: string): Promise<Blob> {
  const abs =
    typeof window !== "undefined" && url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;
  const hit = imageBlobCache.get(abs);
  if (hit) return hit;
  const req = fetch(abs).then(async (r) => {
    if (!r.ok) throw new Error(`Failed to load try-on image (${r.status})`);
    return r.blob();
  });
  imageBlobCache.set(abs, req);
  return req;
}

function loadTintScript() {
  if (typeof document === "undefined") return Promise.resolve();
  if (customElements.get("tint-vto")) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>("script[data-tint-vto]");
  if (existing) {
    return new Promise<void>((resolve) => {
      if (customElements.get("tint-vto")) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      customElements.whenDefined("tint-vto").then(() => resolve()).catch(() => resolve());
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://tintvto.com/widget.js";
    script.dataset.tintVto = "1";
    script.onload = () => {
      customElements.whenDefined("tint-vto").then(() => resolve()).catch(() => resolve());
    };
    script.onerror = () => reject(new Error("Failed to load TINT widget"));
    document.head.appendChild(script);
  });
}

async function applyImageToWidget(el: TintVtoElement, blob: Blob) {
  if (typeof el.useImage === "function") {
    await el.useImage(blob);
    return;
  }
  if (typeof el.usePhoto === "function") {
    await el.usePhoto(blob);
  }
}

/**
 * Hosts Banuba TINT `<tint-vto>` once.
 * Hero try-on should call `open({ imageUrl })` so TINT uses the banner model — no camera scan.
 */
export function TintVtoProvider({
  merchantId,
  children,
}: {
  merchantId: string;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!merchantId) return;
    let cancelled = false;

    void loadTintScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [merchantId]);

  const getEl = useCallback(() => {
    return hostRef.current?.querySelector("tint-vto") as TintVtoElement | null;
  }, []);

  const open = useCallback(
    async (options?: TintOpenOptions) => {
      if (!merchantId) {
        console.warn("[TINT] Missing NEXT_PUBLIC_TINT_MERCHANT_ID");
        return;
      }
      await loadTintScript();
      const el = getEl();
      if (!el?.open) {
        console.warn("[TINT] Widget element not ready");
        return;
      }

      // Prefetch hero / model image before open so we can skip camera promptly
      let photo: Blob | null = null;
      if (options?.imageUrl) {
        try {
          photo = await fetchImageBlob(options.imageUrl);
        } catch (err) {
          console.warn("[TINT] Could not load model image", err);
        }
      }

      await el.open();

      const useCamera = Boolean(options?.preferCamera) && !photo;
      if (useCamera && typeof el.useWebcam === "function") {
        const stream = await el.useWebcam();
        if (!stream && photo) {
          await applyImageToWidget(el, photo);
        }
      } else if (photo) {
        // Banner model path — feed still photo, do not start a live scan
        await applyImageToWidget(el, photo);
      }

      if (options?.sku && typeof el.applyProduct === "function") {
        try {
          await el.applyProduct(options.sku);
        } catch {
          /* SKU may not exist in trial catalog yet */
        }
      }
    },
    [merchantId, getEl],
  );

  const api = useMemo<TintVtoApi>(
    () => ({ ready: ready && Boolean(merchantId), open, merchantId }),
    [ready, open, merchantId],
  );

  return (
    <TintVtoContext.Provider value={api}>
      {children}
      {merchantId ? (
        <div ref={hostRef} className="contents" aria-hidden>
          <tint-vto merchant-id={merchantId} />
        </div>
      ) : null}
    </TintVtoContext.Provider>
  );
}

export function TintTryOnButton({
  label = "Try on with TINT",
  className,
  size = "md",
  sku,
  imageUrl,
  preferCamera = false,
}: {
  label?: string;
  className?: string;
  size?: "sm" | "md";
  sku?: string;
  /** When set, TINT uses this photo instead of the camera */
  imageUrl?: string;
  preferCamera?: boolean;
}) {
  const tint = useTintVto();
  const [busy, setBusy] = useState(false);

  if (!tint?.merchantId) return null;

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void tint
          .open({ sku, imageUrl, preferCamera })
          .catch(() => undefined)
          .finally(() => setBusy(false));
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-ink font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand disabled:opacity-60",
        size === "sm" ? "px-3 py-2 text-[10px]" : "px-4 py-2.5 text-[11px]",
        className,
      )}
    >
      {busy ? "Applying TINT…" : label}
    </button>
  );
}
