import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { findBySlug, products, type Product } from "@/lib/shop-data";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Gift,
  Calendar,
  Minus,
  Plus,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProductImage } from "@/hooks/useProductImage";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }): { product: Product } => {
    const p = findBySlug(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "منتج غير متوفر" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — YasRose` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.name} — YasRose` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const total = (product.price + product.sizes[size].extra) * qty;

  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.slug);

  // Fetch live Unsplash image for the hero/gallery slot
  const liveImage = useProductImage(product.name, product.gallery[active]);

  const handleAddToCart = () => {
    addToCart(product, { selectedColor: color, selectedSize: size });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-2 mb-8">
          <Link to="/">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link to="/shop">المتجر</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-cream aspect-[4/5] group">
              <img
                src={liveImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {product.badge && (
                <span className="absolute top-6 right-6 bg-background/90 backdrop-blur px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnails — horizontal row on mobile, scrollable */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {product.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-cream border-2 transition ${
                    active === i
                      ? "border-rose-gold"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-6">
            <div className="eyebrow mb-3">{product.category}</div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.tagline}</p>

            <div className="flex items-center gap-4 mt-5 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-rose-gold text-rose-gold" : "text-border"}`}
                  />
                ))}
                <span className="mr-1">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">{product.reviews} تقييم</span>
            </div>

            <div className="flex items-baseline gap-3 mt-8">
              <div className="font-display text-4xl">
                {total} <span className="text-lg text-muted-foreground">{product.currency}</span>
              </div>
              {product.oldPrice && (
                <div className="text-lg text-muted-foreground line-through">
                  {product.oldPrice} {product.currency}
                </div>
              )}
            </div>

            <p className="mt-8 text-muted-foreground leading-loose">{product.description}</p>

            <div className="mt-8 p-5 rounded-2xl bg-blush/40 border border-blush">
              <div className="eyebrow mb-1">لغة الزهور</div>
              <div className="font-display text-lg">{product.meaning}</div>
            </div>

            <Section title="اللون">
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
                      color === i
                        ? "border-charcoal bg-charcoal text-primary-foreground"
                        : "border-border hover:border-charcoal"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/40"
                      style={{ background: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="حجم الباقة">
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setSize(i)}
                    className={`py-4 rounded-xl border text-center transition ${
                      size === i
                        ? "border-charcoal bg-cream"
                        : "border-border hover:border-charcoal"
                    }`}
                  >
                    <div className="font-display">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {s.extra > 0 ? `+ ${s.extra} ${product.currency}` : "شامل"}
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="خيارات الإهداء">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-rose-gold cursor-pointer transition">
                  <input type="checkbox" className="mt-1 accent-rose-gold" />
                  <div>
                    <div className="font-display">تغليف فاخر ذهبي</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      + 45 {product.currency}
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-rose-gold cursor-pointer transition">
                  <input type="checkbox" className="mt-1 accent-rose-gold" />
                  <div>
                    <div className="font-display">بطاقة إهداء مكتوبة يدوياً</div>
                    <div className="text-xs text-muted-foreground mt-1">مجاناً</div>
                  </div>
                </label>
              </div>
              <textarea
                placeholder="اكتبي رسالتك الشخصية هنا..."
                rows={3}
                className="mt-3 w-full p-4 rounded-xl border border-border outline-none focus:border-rose-gold bg-cream/50 text-sm resize-none"
              />
            </Section>

            <Section title="التوصيل">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
                  <Calendar className="w-4 h-4 text-rose-gold" />
                  <input type="date" className="bg-transparent flex-1 outline-none text-sm" />
                </div>
                <select className="p-4 rounded-xl border border-border bg-transparent outline-none text-sm">
                  <option>٩ ص - ١٢ ظ</option>
                  <option>١٢ ظ - ٣ ع</option>
                  <option>٣ ع - ٦ م</option>
                  <option>٦ م - ٩ م</option>
                </select>
              </div>
            </Section>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 text-center font-display">{qty}</div>
                <button onClick={() => setQty(qty + 1)} className="p-4">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`btn-luxe flex-1 transition-all duration-300 ${addedFeedback ? "bg-emerald-500 border-emerald-500" : ""}`}
              >
                {addedFeedback ? (
                  <>
                    <Zap className="w-4 h-4" /> أُضيف إلى السلة!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> أضف إلى السلة
                  </>
                )}
              </button>
              <button
                aria-label={wishlisted ? "إزالة من المفضلة" : "أضف للمفضلة"}
                onClick={() => toggle(product)}
                className={`p-4 rounded-full border transition ${
                  wishlisted
                    ? "bg-rose-gold border-rose-gold text-white"
                    : "border-border hover:border-rose-gold"
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-gold" /> توصيل في نفس اليوم
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-rose-gold" /> تغليف فاخر مجاني
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl">قد تعجبك أيضاً</h2>
            <Link to="/shop" className="btn-ghost-luxe">
              جميع التصاميم
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="eyebrow mb-4">{title}</div>
      {children}
    </div>
  );
}
