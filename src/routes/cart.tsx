import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Minus, Plus, X, Tag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة التسوق — YasRose" },
      { name: "description", content: "راجعي طلبك قبل إتمام الشراء." },
      { property: "og:title", content: "سلة التسوق — YasRose" },
      { property: "og:description", content: "راجعي طلبك." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, subtotal, updateQty, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const shipping = items.length > 0 ? 35 : 0;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    // Demo coupons — replace with real API call
    const coupons: Record<string, number> = {
      YASROSE10: Math.round(subtotal * 0.1),
      WELCOME20: Math.round(subtotal * 0.2),
    };
    if (coupons[coupon.toUpperCase()]) {
      setDiscount(coupons[coupon.toUpperCase()]);
      setCouponError("");
    } else {
      setCouponError("رمز الخصم غير صحيح");
      setDiscount(0);
    }
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="border-b border-border pb-10">
          <div className="eyebrow mb-3">سلتك</div>
          <h1 className="font-display text-5xl md:text-6xl">مراجعة الطلب</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <div className="font-display text-3xl mb-4">سلتك فارغة</div>
            <p className="text-muted-foreground mb-8">أضيفي تصاميم تعجبك من متجرنا.</p>
            <Link to="/shop" className="btn-luxe">
              استعرض المتجر
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 py-14">
            {/* Items */}
            <div className="space-y-8">
              {items.map((it) => {
                const price = it.product.price + (it.product.sizes[it.selectedSize]?.extra ?? 0);
                return (
                  <div key={it.product.slug} className="flex gap-6 pb-8 border-b border-border">
                    <div className="w-32 h-40 rounded-2xl overflow-hidden bg-cream shrink-0">
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="eyebrow mb-1">{it.product.category}</div>
                          <Link
                            to="/product/$slug"
                            params={{ slug: it.product.slug }}
                            className="font-display text-xl truncate block hover:text-rose-gold transition"
                          >
                            {it.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            {it.product.colors[it.selectedColor]?.name ?? "قياسي"} ·{" "}
                            {it.product.sizes[it.selectedSize]?.name ?? "قياسي"}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(it.product.slug)}
                          aria-label="حذف"
                          className="p-2 hover:bg-muted rounded-full transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-full">
                          <button
                            onClick={() => updateQty(it.product.slug, it.qty - 1)}
                            className="p-3"
                            aria-label="تقليل"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-8 text-center font-display text-sm">{it.qty}</div>
                          <button
                            onClick={() => updateQty(it.product.slug, it.qty + 1)}
                            className="p-3"
                            aria-label="زيادة"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-display text-lg">
                          {price * it.qty}{" "}
                          <span className="text-xs text-muted-foreground">
                            {it.product.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 self-start p-8 rounded-3xl bg-cream border border-border">
              <div className="font-display text-xl mb-6">ملخص الطلب</div>
              <div className="space-y-3 text-sm">
                <Row label="المجموع الفرعي" value={`${subtotal} ج.م`} />
                {discount > 0 && (
                  <Row label="الخصم" value={`- ${discount} ج.م`} className="text-emerald-600" />
                )}
                <Row label="التوصيل (بني سويف)" value={`${shipping} ج.م`} />

                {/* Coupon */}
                <div className="flex items-center gap-2 border border-border rounded-full px-4 py-3 bg-background">
                  <Tag className="w-4 h-4 text-rose-gold" />
                  <input
                    placeholder="رمز الخصم"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                    }}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={applyCoupon}
                    className="text-xs tracking-[0.15em] text-rose-gold shrink-0"
                  >
                    تطبيق
                  </button>
                </div>
                {couponError && <p className="text-xs text-destructive px-1">{couponError}</p>}
                {discount > 0 && <p className="text-xs text-emerald-600 px-1">✓ تم تطبيق الخصم</p>}

                <div className="hairline my-4" />
                <div className="flex items-center justify-between font-display text-xl pt-2">
                  <span>الإجمالي</span>
                  <span>{total} ج.م</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="btn-luxe w-full mt-8 flex items-center justify-center gap-2"
              >
                إتمام الطلب <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="block text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition"
              >
                متابعة التسوق
              </Link>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}

function Row({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={`text-foreground ${className}`}>{value}</span>
    </div>
  );
}
