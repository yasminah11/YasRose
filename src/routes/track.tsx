import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Check, Package, Truck, Sparkles, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { ordersApi } from "@/lib/api";
import { z } from "zod";

// ─── Route with orderId search param ──────────────────────────────
const trackSearchSchema = z.object({
  orderId: z.string().optional(),
});

export const Route = createFileRoute("/track")({
  validateSearch: trackSearchSchema,
  head: () => ({
    meta: [
      { title: "تتبع الطلب — YasRose" },
      { name: "description", content: "تابعي رحلة طلبك من الأتلييه إلى بابك." },
      { property: "og:title", content: "تتبع الطلب — YasRose" },
    ],
  }),
  component: Track,
});

// ─── Type-safe order step ──────────────────────────────────────────
type OrderStep = {
  icon: typeof Check;
  title: string;
  time: string;
  done: boolean;
  active?: boolean;
};

// Demo steps for display (replace data with API response)
const buildSteps = (status: string): OrderStep[] => [
  { icon: Check, title: "تم استلام الطلب", time: "الأربعاء ١٠:٢٤ ص", done: true },
  { icon: Sparkles, title: "قيد التنسيق في الأتلييه", time: "الأربعاء ١١:١٠ ص", done: true },
  {
    icon: Package,
    title: "جاهز للتوصيل",
    time: "الأربعاء ١٢:٤٥ م",
    done: status !== "pending",
    active: status === "ready",
  },
  {
    icon: Truck,
    title: "في الطريق إليك",
    time: "متوقع ٢:٠٠ م",
    done: status === "delivered" || status === "on_way",
    active: status === "on_way",
  },
  {
    icon: MapPin,
    title: "تم التوصيل",
    time: status === "delivered" ? "تم" : "قريباً",
    done: status === "delivered",
  },
];

function Track() {
  const { orderId: urlOrderId } = Route.useSearch();
  const navigate = useNavigate({ from: "/track" });

  const [inputId, setInputId] = useState(urlOrderId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<{ id: string; status: string } | null>(
    urlOrderId ? { id: urlOrderId, status: "ready" } : null,
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = inputId.trim();
    if (!id) {
      setError("أدخلي رقم الطلب");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await ordersApi.getById(id);
      setOrderData({
        id: (data as { id: string; status: string }).id,
        status: (data as { id: string; status: string }).status,
      });
      navigate({ search: { orderId: id } });
    } catch {
      // Mock fallback for demo
      setOrderData({ id, status: "ready" });
      navigate({ search: { orderId: id } });
    } finally {
      setLoading(false);
    }
  };

  const steps = orderData ? buildSteps(orderData.status) : [];

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-3xl mx-auto text-center border-b border-border pb-10">
          <div className="eyebrow mb-3">
            {orderData ? `طلبك رقم #${orderData.id}` : "تتبع الطلب"}
          </div>
          <h1 className="font-display text-5xl md:text-6xl">
            {orderData ? "في طريقه إليك" : "أين طلبك؟"}
          </h1>
          {orderData && (
            <p className="mt-4 text-muted-foreground">التوصيل المتوقع اليوم بين ٢:٠٠ و ٣:٠٠ م</p>
          )}
        </div>

        {/* Search form */}
        <div className="max-w-lg mx-auto mt-10">
          <form onSubmit={handleSearch} className="flex gap-3" noValidate>
            <label className="flex-1">
              <span className="sr-only">رقم الطلب</span>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="مثال: FN-2841"
                aria-label="رقم الطلب"
                aria-describedby={error ? "track-error" : undefined}
                className={`w-full h-12 px-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm ${
                  error ? "border-destructive" : "border-border"
                }`}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-luxe flex items-center gap-2 disabled:opacity-60"
              aria-label="بحث"
            >
              <Search className="w-4 h-4" aria-hidden />
              {loading ? "..." : "بحث"}
            </button>
          </form>
          {error && (
            <p id="track-error" role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        {/* Tracking steps */}
        {orderData && (
          <div className="max-w-3xl mx-auto py-16">
            <div className="relative">
              <div className="absolute right-6 top-6 bottom-6 w-px bg-border" aria-hidden />
              <ol className="space-y-8">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-6 relative">
                    <div
                      className={`w-12 h-12 rounded-full grid place-items-center shrink-0 relative z-10 ${
                        s.done
                          ? s.active
                            ? "bg-rose-gold text-white shadow-luxe animate-pulse"
                            : "bg-charcoal text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                      aria-label={s.done ? "مكتمل" : "لم يكتمل بعد"}
                    >
                      <s.icon className="w-5 h-5" aria-hidden />
                    </div>
                    <div className="pt-2 flex-1 pb-4">
                      <div className={`font-display text-lg ${!s.done && "text-muted-foreground"}`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{s.time}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-blush/40">
              <div className="eyebrow mb-2">تحديث مباشر</div>
              <div className="font-display text-lg">
                مندوب التوصيل: أحمد · بدأ التوصيل قبل ١٢ دقيقة
              </div>
              <a
                href="tel:+201000000000"
                className="btn-luxe mt-4 inline-flex"
                aria-label="اتصال بمندوب التوصيل"
              >
                اتصلي بالمندوب
              </a>
            </div>

            <div className="mt-8 text-center">
              <Link to="/shop" className="btn-ghost-luxe">
                متابعة التسوق
              </Link>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
