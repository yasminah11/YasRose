import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Product } from "@/lib/shop-data";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
export type CartItem = {
  product: Product;
  qty: number;
  selectedColor: number;
  selectedSize: number;
  giftCard?: boolean;
  luxuryWrap?: boolean;
  note?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (product: Product, opts?: Partial<Omit<CartItem, "product" | "qty">>) => void;
  removeFromCart: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  isInCart: (slug: string) => boolean;
};

// ─── Persistence key ──────────────────────────────────────────────────────────
const STORAGE_KEY = "yasrose_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_) {
    /* ignore localStorage errors */
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce(
    (s, i) => s + (i.product.price + (i.product.sizes[i.selectedSize]?.extra ?? 0)) * i.qty,
    0,
  );

  const addToCart = useCallback(
    (product: Product, opts: Partial<Omit<CartItem, "product" | "qty">> = {}) => {
      setItems((prev) => {
        const existing = prev.find((it) => it.product.slug === product.slug);
        if (existing) {
          toast.success(`تمت إضافة ${product.name} إلى السلة`);
          return prev.map((it) =>
            it.product.slug === product.slug ? { ...it, qty: it.qty + 1 } : it,
          );
        }
        toast.success(`تمت إضافة ${product.name} إلى السلة`);
        return [
          ...prev,
          {
            product,
            qty: 1,
            selectedColor: 0,
            selectedSize: 0,
            ...opts,
          },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback((slug: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.product.slug === slug);
      if (item) toast.info(`تمت إزالة ${item.product.name} من السلة`);
      return prev.filter((it) => it.product.slug !== slug);
    });
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((it) => it.product.slug !== slug));
    } else {
      setItems((prev) => prev.map((it) => (it.product.slug === slug ? { ...it, qty } : it)));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const isInCart = useCallback(
    (slug: string) => items.some((it) => it.product.slug === slug),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, addToCart, removeFromCart, updateQty, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
