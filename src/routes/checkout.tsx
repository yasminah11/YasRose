import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { CheckCircle2 } from "lucide-react";
import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  deliveryAddressSchema,
  paymentSchema,
  type PersonalInfoData,
  type DeliveryAddressData,
  type PaymentData,
} from "@/lib/schemas";
import { useCart } from "@/contexts/CartContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب — YasRose" },
      { name: "description", content: "اختر طريقة التوصيل والدفع بأمان." },
    ],
  }),
  component: Checkout,
});

const STEPS = ["المعلومات", "التوصيل", "الدفع"];

const SHIPPING_OPTIONS = [
  { label: "توصيل استثنائي — نفس اليوم", desc: "خلال 4 ساعات", price: 45 },
  { label: "توصيل قياسي", desc: "خلال 24 ساعة", price: 35 },
  { label: "توصيل بتوقيت محدد", desc: "اختر الموعد", price: 60 },
];

const PAY_METHODS = [
  { id: "card", label: "بطاقة ائتمانية" },
  { id: "applepay", label: "Apple Pay" },
  { id: "mada", label: "مدى" },
  { id: "cod", label: "الدفع عند الاستلام" },
] as const;

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { isLoading: authLoading } = useRequireAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [shippingIdx, setShippingIdx] = useState(1);
  const [placing, setPlacing] = useState(false);

  // Saved data from previous steps
  const [savedInfo, setSavedInfo] = useState<PersonalInfoData | null>(null);
  const [savedAddr, setSavedAddr] = useState<DeliveryAddressData | null>(null);

  // Step 0 form
  const infoForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.name.split(" ")[0] ?? "",
      lastName: user?.name.split(" ")[1] ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  // Step 1 form
  const addrForm = useForm<DeliveryAddressData>({
    resolver: zodResolver(deliveryAddressSchema),
  });

  // Step 2 form
  const payForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: "cod" },
  });

  const watchMethod = payForm.watch("method");

  if (authLoading) {
    return (
      <Layout>
        <div className="container-luxe py-32 text-center">
          <div className="font-display text-2xl text-muted-foreground">جارٍ التحميل...</div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0 && !placing) {
    return (
      <Layout>
        <section className="container-luxe pt-4 text-center py-32">
          <div className="font-display text-3xl mb-4">سلتك فارغة</div>
          <Link to="/shop" className="btn-luxe">تصفحي المتجر</Link>
        </section>
      </Layout>
    );
  }

  const shipping = SHIPPING_OPTIONS[shippingIdx].price;
  const total = subtotal + shipping;

  const handleStep0 = infoForm.handleSubmit((data) => {
    setSavedInfo(data);
    setStep(1);
  });

  const handleStep1 = addrForm.handleSubmit((data) => {
    setSavedAddr(data);
    setStep(2);
  });

  const handleConfirm = payForm.handleSubmit(async (payData) => {
    if (!savedInfo || !savedAddr) return;
    setPlacing(true);
    try {
      await ordersApi.create({
        items: items.map((it) => ({
          productSlug: it.product.slug,
          qty: it.qty,
          selectedColor: it.selectedColor,
          selectedSize: it.selectedSize,
        })),
        shipping: { ...savedInfo, ...savedAddr },
        shippingOption: shippingIdx,
        paymentMethod: payData.method,
      });
    } catch {
      // Mock: proceed anyway for demo
    }
    clearCart();
    toast.success("تم تأكيد طلبك بنجاح! 🌸");
    navigate({ to: "/order-success" });
  });

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="border-b border-border pb-10">
          <div className="eyebrow mb-3">الخطوة الأخيرة</div>
          <h1 className="font-display text-5xl md:text-6xl">إتمام الطلب</h1>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-6 mt-10 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`w-9 h-9 rounded-full grid place-items-center text-xs font-display transition ${
                  i <= step
                    ? "bg-charcoal text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
              <div className={`text-sm ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="w-16 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-14">
          <div className="space-y-8">
            {/* ── Step 0 — Personal Info ────────────────── */}
            {step === 0 && (
              <form onSubmit={handleStep0} noValidate>
                <Card title="بياناتك الشخصية">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="الاسم الأول" error={infoForm.formState.errors.firstName?.message} {...infoForm.register("firstName")} />
                    <Field label="اسم العائلة" error={infoForm.formState.errors.lastName?.message} {...infoForm.register("lastName")} />
                    <Field label="البريد الإلكتروني" type="email" error={infoForm.formState.errors.email?.message} {...infoForm.register("email")} />
                    <Field label="رقم الجوال" error={infoForm.formState.errors.phone?.message} {...infoForm.register("phone")} />
                  </div>
                </Card>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn-luxe">التالي</button>
                </div>
              </form>
            )}

            {/* ── Step 1 — Delivery ─────────────────────── */}
            {step === 1 && (
              <form onSubmit={handleStep1} noValidate>
                <Card title="عنوان التوصيل">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="المدينة" error={addrForm.formState.errors.city?.message} {...addrForm.register("city")} />
                    <Field label="الحي" error={addrForm.formState.errors.district?.message} {...addrForm.register("district")} />
                    <Field label="الشارع" error={addrForm.formState.errors.street?.message} {...addrForm.register("street")} />
                    <Field label="رقم المبنى (اختياري)" {...addrForm.register("building")} />
                  </div>
                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground">ملاحظات للمندوب (اختياري)</span>
                    <textarea
                      rows={2}
                      className="mt-1.5 w-full p-4 rounded-xl border border-border bg-transparent outline-none focus:border-rose-gold text-sm resize-none"
                      {...addrForm.register("note")}
                    />
                  </div>
                </Card>

                <Card title="طريقة التوصيل">
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((opt, i) => (
                      <label
                        key={opt.label}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-rose-gold cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          name="ship"
                          checked={shippingIdx === i}
                          onChange={() => setShippingIdx(i)}
                          className="accent-rose-gold"
                        />
                        <div className="flex-1">
                          <div className="font-display">{opt.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                        </div>
                        <div className="font-display">{opt.price} ج.م</div>
                      </label>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(0)} className="btn-ghost-luxe">السابق</button>
                  <button type="submit" className="btn-luxe">التالي</button>
                </div>
              </form>
            )}

            {/* ── Step 2 — Payment ──────────────────────── */}
            {step === 2 && (
              <form onSubmit={handleConfirm} noValidate>
                <Card title="طريقة الدفع">
                  <div className="space-y-3 mb-6">
                    {PAY_METHODS.map((m) => (
                      <label
                        key={m.id}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-rose-gold cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          value={m.id}
                          className="accent-rose-gold"
                          {...payForm.register("method")}
                        />
                        <div className="font-display">{m.label}</div>
                      </label>
                    ))}
                  </div>

                  {watchMethod === "card" && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <Field
                        label="رقم البطاقة"
                        placeholder="0000 0000 0000 0000"
                        className="sm:col-span-2"
                        error={payForm.formState.errors.cardNumber?.message}
                        {...payForm.register("cardNumber")}
                      />
                      <Field
                        label="تاريخ الانتهاء"
                        placeholder="MM/YY"
                        error={payForm.formState.errors.cardExpiry?.message}
                        {...payForm.register("cardExpiry")}
                      />
                      <Field
                        label="CVV"
                        placeholder="123"
                        error={payForm.formState.errors.cardCvv?.message}
                        {...payForm.register("cardCvv")}
                      />
                    </div>
                  )}
                </Card>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost-luxe">السابق</button>
                  <button type="submit" disabled={placing} className="btn-luxe disabled:opacity-60">
                    {placing ? "جارٍ التأكيد..." : "تأكيد الطلب"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-28 self-start p-8 rounded-3xl bg-cream border border-border">
            <div className="font-display text-xl mb-6">ملخص الطلب</div>
            <div className="space-y-3 text-sm">
              {items.map((it) => {
                const price = it.product.price + (it.product.sizes[it.selectedSize]?.extra ?? 0);
                return (
                  <div key={it.product.slug} className="flex items-center justify-between text-muted-foreground">
                    <span className="truncate ml-3">{it.product.name} × {it.qty}</span>
                    <span className="text-foreground shrink-0">{price * it.qty} ج.م</span>
                  </div>
                );
              })}
              <div className="hairline my-4" />
              <div className="flex items-center justify-between text-muted-foreground">
                <span>التوصيل</span>
                <span className="text-foreground">{shipping} ج.م</span>
              </div>
              <div className="flex items-center justify-between font-display text-xl pt-4">
                <span>الإجمالي</span>
                <span>{total} ج.م</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-8 rounded-3xl border border-border bg-background mb-6">
      <div className="font-display text-xl mb-6">{title}</div>
      {children}
    </div>
  );
}

const Field = forwardRef<
  HTMLInputElement,
  { label: string; type?: string; placeholder?: string; error?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, type = "text", placeholder, error, className = "", ...rest }, ref) => (
  <label className={`block ${className}`}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      aria-invalid={!!error}
      className={`mt-1.5 w-full h-12 px-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm ${
        error ? "border-destructive" : "border-border"
      }`}
      {...rest}
    />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </label>
));
Field.displayName = "Field";
