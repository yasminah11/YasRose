import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/shop-data";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type WishlistContextValue = {
  items: Product[];
  count: number;
  toggle: (product: Product) => void;
  isWishlisted: (slug: string) => boolean;
  clear: () => void;
};

// ─── Persistence ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "yasrose_wishlist";

function loadWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.slug === product.slug);
      if (exists) {
        toast.info(`تمت إزالة ${product.name} من المفضلة`);
        return prev.filter((p) => p.slug !== product.slug);
      }
      toast.success(`تمت إضافة ${product.name} إلى المفضلة ❤️`);
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => items.some((p) => p.slug === slug),
    [items],
  );

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggle, isWishlisted, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
