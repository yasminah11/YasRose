import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag, Star, Zap } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/shop-data";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProductImage } from "@/hooks/useProductImage";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // Fetch live Unsplash image if key is set, else use local fallback
  const imageSrc = useProductImage(product.name, product.image);

  const liked = isWishlisted(product.slug);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAddedToCart(true);
    setAnnouncement(`تمت إضافة ${product.name} إلى السلة`);
    setTimeout(() => { setAddedToCart(false); setAnnouncement(""); }, 1800);
  };

  return (
    <article className="group" aria-label={`منتج: ${product.name}`}>
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block focus-visible:outline-2 focus-visible:outline-rose-gold focus-visible:outline-offset-2 rounded-2xl">
        <div className="relative overflow-hidden rounded-2xl bg-cream aspect-[4/5] shadow-soft/30">
          <img
            src={imageSrc}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            width={400}
            height={500}
            decoding="async"
            className="w-full h-full object-cover"
            style={{ "--tw-scale-x": "1.07", "--tw-scale-y": "1.07" } as React.CSSProperties}
          />

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.badge && (
              <span className="bg-charcoal text-primary-foreground px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-full shadow-soft">
                {product.badge}
              </span>
            )}
            {product.isNew && (
              <span className="bg-rose-gold text-white px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-full shadow-soft">
                جديد
              </span>
            )}
            {product.oldPrice && !product.badge && (
              <span className="bg-emerald-500 text-white px-3 py-1 text-[10px] tracking-[0.2em] uppercase rounded-full shadow-soft">
                خصم
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
            <button
              aria-label={liked ? "إزالة من المفضلة" : "أضف للمفضلة"}
              onClick={(e) => { e.preventDefault(); toggle(product); }}
              className={`w-9 h-9 grid place-items-center rounded-full transition shadow-soft ${
                liked ? "bg-rose-gold text-white" : "glass hover:bg-rose-gold hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
            </button>
            <IconBtn label="عرض سريع"><Eye className="w-4 h-4" /></IconBtn>
          </div>

          {/* Add to cart */}
          <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75">
            <button
              onClick={handleCart}
              className={`w-full rounded-full py-3 flex items-center justify-center gap-2 text-xs tracking-[0.15em] transition-all duration-300 shadow-soft ${
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : "glass text-charcoal hover:bg-charcoal hover:text-primary-foreground"
              }`}
            >
              {addedToCart ? (
                <><Zap className="w-4 h-4" /> أُضيف إلى السلة!</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> أضف إلى السلة</>
              )}
            </button>
          </div>

          {/* Express delivery badge */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-0 transition">
            {/* hidden — handled by cart btn */}
          </div>
        </div>
      </Link>

      <div className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="font-display text-lg tracking-tight hover:text-rose-gold transition leading-snug"
          >
            {product.name}
          </Link>
          <div className="flex flex-col items-end shrink-0 gap-0.5">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {product.oldPrice} {product.currency}
              </span>
            )}
            <span className="font-display text-base">
              {product.price} <span className="text-xs text-muted-foreground">{product.currency}</span>
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-1 leading-snug">{product.tagline}</p>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-rose-gold text-rose-gold" : "text-border"}`} />
            ))}
          </div>
          <span className="font-medium text-foreground/70">{product.rating}</span>
          <span>·</span>
          <span>{product.reviews} تقييم</span>
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {product.colors.map((c) => (
              <div
                key={c.name}
                title={c.name}
                className="w-4 h-4 rounded-full border border-border/60 shadow-sm transition hover:scale-110 cursor-pointer"
                style={{ background: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-muted-foreground ms-1">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={(e) => e.preventDefault()}
      className="w-9 h-9 grid place-items-center rounded-full glass hover:bg-charcoal hover:text-primary-foreground transition shadow-soft"
    >
      {children}
    </button>
  );
}
