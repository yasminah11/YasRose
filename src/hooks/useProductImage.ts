import { useState, useEffect } from "react";
import { FLOWER_EN_MAP } from "@/lib/flowerApi";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY ?? "";

// Simple in-memory cache so we don't refetch the same flower on every render
const imageCache = new Map<string, string>();

/**
 * Given a product name + local fallback image,
 * returns the best image URL available:
 *   1. Unsplash live photo (if VITE_UNSPLASH_KEY is set)
 *   2. Local static asset (fallback)
 *
 * Usage:
 *   const src = useProductImage(product.name, product.image);
 */
export function useProductImage(productName: string, fallback: string): string {
  const [src, setSrc] = useState<string>(fallback);

  useEffect(() => {
    // No key → keep local image, nothing to do
    if (!UNSPLASH_KEY || UNSPLASH_KEY === "your_unsplash_access_key_here") {
      setSrc(fallback);
      return;
    }

    // Derive English search term from Arabic name
    const arabicWord = Object.keys(FLOWER_EN_MAP).find((ar) => productName.includes(ar));
    const query = arabicWord
      ? `${FLOWER_EN_MAP[arabicWord]} flower bouquet`
      : `${productName} flower bouquet`;

    // Use cache if already fetched
    if (imageCache.has(query)) {
      setSrc(imageCache.get(query)!);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos` +
            `?query=${encodeURIComponent(query)}` +
            `&per_page=1&orientation=portrait` +
            `&client_id=${UNSPLASH_KEY}`,
          { headers: { "Accept-Version": "v1" } },
        );
        if (!res.ok) return;
        const data = await res.json();
        const url: string | undefined = data?.results?.[0]?.urls?.regular;
        if (url && !cancelled) {
          imageCache.set(query, url);
          setSrc(url);
        }
      } catch {
        // silently fall back to local image
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productName, fallback]);

  return src;
}
