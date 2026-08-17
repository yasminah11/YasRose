import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { CheckCircle2, Package, Phone } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [{ title: "تم تأكيد طلبك — YasRose" }, { name: "robots", content: "noindex" }],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  // Generate a random order ID for display
  const orderId = `FN-${Math.floor(2800 + Math.random() * 200)}`;

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-blush grid place-items-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-rose-gold" />
          </div>

          <div className="eyebrow mb-4">تم بنجاح</div>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">طلبك في أيدٍ أمينة</h1>
          <p className="mt-6 text-muted-foreground leading-loose max-w-md mx-auto">
            استلمنا طلبك وبدأ فريق الأتلييه في تنسيق باقتك يدوياً. ستصلك رسالة تأكيد قريباً.
          </p>

          {/* Order ID */}
          <div className="mt-10 inline-block px-8 py-4 rounded-2xl bg-cream border border-border">
            <div className="text-xs text-muted-foreground mb-1">رقم الطلب</div>
            <div className="font-display text-3xl text-rose-gold">{orderId}</div>
          </div>

          {/* Steps */}
          <div className="mt-14 grid sm:grid-cols-3 gap-6 text-right">
            {[
              { icon: CheckCircle2, title: "تم الاستلام", desc: "وصل طلبك إلى فريق الدار" },
              { icon: Package, title: "قيد التنسيق", desc: "يتم تجهيز باقتك يدوياً الآن" },
              { icon: Phone, title: "سنتصل بك", desc: "تأكيد الموعد قبل التوصيل" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-cream border border-border">
                <div className="w-10 h-10 rounded-full bg-blush grid place-items-center mb-4">
                  <Icon className="w-5 h-5 text-rose-gold" />
                </div>
                <div className="font-display text-lg mb-1">{title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/track" className="btn-luxe">
              تتبع طلبك
            </Link>
            <Link to="/shop" className="btn-ghost-luxe">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
