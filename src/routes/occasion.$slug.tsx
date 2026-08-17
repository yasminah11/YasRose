import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { occasions, products, type Product } from "@/lib/shop-data";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ShoppingBag, Heart, Star, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProductImage } from "@/hooks/useProductImage";

export const Route = createFileRoute("/occasion/$slug")({
  head: ({ params }) => {
    const occ = occasions.find((o) => o.slug === params.slug);
    return {
      meta: [
        { title: `${occ?.name ?? "المناسبة"} — YasRose` },
        { name: "description", content: `باقات زهور مختارة لمناسبة ${occ?.name ?? ""}` },
      ],
    };
  },
  component: OccasionDetail,
});

// Map slug → keywords to filter products
const OCCASION_MAP: Record<string, string[]> = {
  love: ["الحب", "الاعتذار"],
  wedding: ["الأعراس"],
  anniversary: ["الذكرى السنوية"],
  newborn: ["المواليد", "عيد الأم"],
  corporate: ["المكتب", "الإهداء الرسمي", "افتتاح الأعمال"],
  sympathy: ["المواساة", "المناسبات"],
};

function getOccasionProducts(slug: string): Product[] {
  const keywords = OCCASION_MAP[slug] ?? [];
  const filtered = products.filter((p) => p.occasion.some((o) => keywords.includes(o)));
  // If no match, return all products
  return filtered.length > 0 ? filtered : products;
}

// ── Product Card with live image + cart + wishlist ────────────────────────────
function OccasionProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart, isInCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.slug);
  const inCart = isInCart(product.slug);
  const [added, setAdded] = useState(false);
  const liveImage = useProductImage(product.name, product.image);

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      ref={ref}
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .6s ease ${index * 70}ms, transform .6s ease ${index * 70}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream mb-4">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img
            src={liveImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        </Link>

        {/* Wishlist */}
        <button
          onClick={() => toggle(product)}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full grid place-items-center transition-all duration-300 z-10 ${
            wishlisted
              ? "bg-rose-gold text-white shadow-soft"
              : "bg-white/80 backdrop-blur text-charcoal/60 hover:bg-rose-gold hover:text-white shadow-soft"
          }`}
          aria-label={wishlisted ? "إزالة من المفضلة" : "أضف للمفضلة"}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Badge */}
        {(product.badge || product.isNew) && (
          <div className="absolute top-3 right-3 bg-rose-gold text-white text-[10px] tracking-wider px-2.5 py-1 rounded-full">
            {product.badge ?? "جديد"}
          </div>
        )}

        {/* Quick add — shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              added || inCart
                ? "bg-green-600 text-white"
                : "bg-white text-charcoal hover:bg-rose-gold hover:text-white"
            }`}
          >
            {added || inCart ? (
              <>
                <Check className="w-4 h-4" /> أُضيف للسلة
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> أضف للسلة
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block group/link">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-medium leading-snug group-hover/link:text-rose-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-rose-gold text-rose-gold" />
            <span className="text-[11px] text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{product.tagline}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-charcoal">
            {product.price} {product.currency}
          </span>
          {product.oldPrice && (
            <span className="text-xs line-through text-muted-foreground">
              {product.oldPrice} {product.currency}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function OccasionDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const occasion = occasions.find((o) => o.slug === slug);
  const occasionProducts = getOccasionProducts(slug);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition =
      "opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1)";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }),
    );
  }, []);

  if (!occasion) {
    return (
      <Layout>
        <div className="container-luxe py-40 text-center">
          <div className="font-display text-3xl mb-4">لم يُعثر على هذه المناسبة</div>
          <Link to="/occasions" className="btn-luxe">
            العودة للمناسبات
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* ─── Hero ─── */}
      <section className="relative h-[52vh] min-h-[360px] overflow-hidden">
        <img
          src={occasion.image}
          alt={occasion.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10" />

        {/* Back */}
        <button
          onClick={() => navigate({ to: "/occasions" })}
          className="absolute top-24 right-6 md:right-12 z-10 flex items-center gap-2 text-white/75 hover:text-white text-xs border border-white/20 hover:border-white/40 rounded-full px-3.5 py-1.5 backdrop-blur-sm transition-all"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          المناسبات
        </button>

        <div ref={headerRef} className="absolute inset-x-0 bottom-0 container-luxe pb-12 z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
            <span className="text-[11px] tracking-[0.25em] text-white/50">باقات مختارة</span>
          </div>
          <h1
            className="text-4xl md:text-5xl text-white"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            {occasion.name}
          </h1>
          <p
            className="mt-2 text-white/60 text-sm max-w-md leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            {occasion.desc}
          </p>
        </div>
      </section>

      {/* ─── Breadcrumb ─── */}
      <div className="container-luxe pt-6 pb-2">
        <nav className="text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link to="/occasions" className="hover:text-foreground transition-colors">
            المناسبات
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground">{occasion.name}</span>
        </nav>
      </div>

      {/* ─── Products ─── */}
      <section className="container-luxe py-10 pb-24">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <h2
              className="text-2xl md:text-3xl text-charcoal"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              {occasionProducts.length} باقة مناسبة لـ{occasion.name}
            </h2>
            <p
              className="mt-1.5 text-muted-foreground text-sm leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              اضغط على أي باقة لمعرفة التفاصيل أو أضفها مباشرة للسلة
            </p>
          </div>
          <Link to="/shop" className="btn-luxe text-sm">
            <ShoppingBag className="w-4 h-4" /> كل الباقات
          </Link>
        </div>

        {occasionProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-muted-foreground">لا توجد باقات لهذه المناسبة حالياً</p>
            <Link to="/shop" className="btn-luxe mt-6">
              تصفّح المتجر
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {occasionProducts.map((p, i) => (
              <OccasionProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 rounded-3xl bg-cream px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p
              className="text-2xl text-charcoal mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              باقة مخصصة لـ{occasion.name}؟
            </p>
            <p className="text-sm text-muted-foreground">فريق الأتلييه يصمم لك باقتك من الصفر</p>
          </div>
          <Link to="/design" className="btn-luxe shrink-0">
            صمم باقتك
          </Link>
        </div>
      </section>
    </Layout>
  );
}
