import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "المفضلة — YasRose" },
      {
        name: "description",
        content: "قائمة التوليفات المفضلة لديك، محفوظة لتعودي إليها متى تشائين.",
      },
      { property: "og:title", content: "المفضلة — YasRose" },
      { property: "og:description", content: "توليفاتك المحفوظة." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { items, count } = useWishlist();

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="flex items-end justify-between border-b border-border pb-10 flex-wrap gap-6">
          <div>
            <div className="eyebrow mb-3">المفضلة</div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight flex items-center gap-4">
              <Heart className="w-10 h-10 text-rose-gold fill-rose-gold/30" />
              محفوظاتك
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">{count} تصميم محفوظ</div>
        </div>

        {count === 0 ? (
          <div className="text-center py-32">
            <Heart className="w-16 h-16 mx-auto text-border mb-6" />
            <div className="font-display text-3xl mb-3">قائمتك فارغة حتى الآن</div>
            <p className="text-muted-foreground mb-8">اضغطي على القلب في أي منتج لحفظه هنا.</p>
            <Link to="/shop" className="btn-luxe">
              استعرض المتجر
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 mt-14">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>

            <div className="mt-24 p-12 rounded-3xl bg-cream text-center">
              <div className="font-display text-2xl">تبحثين عن المزيد؟</div>
              <p className="mt-3 text-muted-foreground">
                اكتشف مجموعتنا الكاملة من التصاميم المُنسقة يدوياً.
              </p>
              <Link to="/shop" className="btn-luxe mt-8">
                تصفحي المتجر
              </Link>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
