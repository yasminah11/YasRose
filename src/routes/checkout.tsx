import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
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
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [shippingIdx, setShippingIdx] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [savedInfo, setSavedInfo] = useState<PersonalInfoData | null>(null);
  const [savedAddr, setSavedAddr] = useState<DeliveryAddressData | null>(null);

  const infoForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] ?? "",
      lastName: user?.name?.split(" ")[1] ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  const addrForm = useForm<DeliveryAddressData>({
    resolver: zodResolver(deliveryAddressSchema),
  });

  const payForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: "cod" },
  });

  const watchMethod = payForm.watch("method");

  if (items.length === 0 && !placing) {
    return (
      <Layout>
        <section className="container-luxe pt-4 text-center py-32">
          <div className="font-display text-3xl mb-4">سلتك فارغة</div>
          <Link to="/shop" className="btn-luxe">
            تصفحي المتجر
          </Link>
        </section>
      </Layout>
    );
  }

  const shipping = SHIPPING_OPTIONS[shippingIdx].price;
  const total = subtotal + shipping;

  const handleStep0 = infoForm.handleSubmit((data) => {
    setSavedInfo(data);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleStep1 = addrForm.handleSubmit((data) => {
    setSavedAddr(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      // Demo: proceed anyway
    }
    clearCart();
    toast.success("تم تأكيد طلبك بنجاح! 🌸");
    navigate({ to: "/order-success" });
  });

  return (
    <Layout>
      <section className="container-luxe pt-4 pb-16">
        {/* ── Header ── */}
        <div className="border-b border-border pb-6 mb-8">
          <div className="eyebrow mb-2">الخطوة الأخيرة</div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl">إتمام الطلب</h1>
        </div>

        {/* ── Step progress ── */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center text-xs font-display transition shrink-0 ${
                  i <= step
                    ? "bg-charcoal text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
              <span
                className={`mx-2 text-xs sm:text-sm whitespace-nowrap ${
                  i === step ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-6 sm:w-12 h-px bg-border mx-1 shrink-0" />}
            </div>
          ))}
        </div>

        {/* ── Mobile Order Summary (collapsible) ── */}
        <div className="lg:hidden mb-6 rounded-2xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-4 bg-cream text-sm font-display"
          >
            <span>ملخص الطلب</span>
            <div className="flex items-center gap-3">
              <span className="text-rose-gold">{total} ج.م</span>
              {summaryOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>
          {summaryOpen && (
            <div className="px-5 py-4 space-y-3 text-sm border-t border-border bg-background">
              {items.map((it) => {
                const price = it.product.price + (it.product.sizes[it.selectedSize]?.extra ?? 0);
                return (
                  <div
                    key={it.product.slug}
                    className="flex items-center justify-between text-muted-foreground"
                  >
                    <span className="truncate ml-3">
                      {it.product.name} × {it.qty}
                    </span>
                    <span className="text-foreground shrink-0">{price * it.qty} ج.م</span>
                  </div>
                );
              })}
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between text-muted-foreground">
                <span>التوصيل</span>
                <span className="text-foreground">{shipping} ج.م</span>
              </div>
              <div className="flex items-center justify-between font-display text-lg pt-2">
                <span>الإجمالي</span>
                <span>{total} ج.م</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-14 items-start">
          {/* Forms */}
          <div>
            {/* ── Step 0 — Personal Info ── */}
            {step === 0 && (
              <form onSubmit={handleStep0} noValidate>
                <Card title="بياناتك الشخصية">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="الاسم الأول"
                      error={infoForm.formState.errors.firstName?.message}
                      {...infoForm.register("firstName")}
                    />
                    <Field
                      label="اسم العائلة"
                      error={infoForm.formState.errors.lastName?.message}
                      {...infoForm.register("lastName")}
                    />
                    <Field
                      label="البريد الإلكتروني"
                      type="email"
                      error={infoForm.formState.errors.email?.message}
                      {...infoForm.register("email")}
                    />
                    <Field
                      label="رقم الجوال"
                      error={infoForm.formState.errors.phone?.message}
                      {...infoForm.register("phone")}
                    />
                  </div>
                </Card>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn-luxe w-full sm:w-auto">
                    التالي
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 1 — Delivery ── */}
            {step === 1 && (
              <form onSubmit={handleStep1} noValidate>
                <Card title="عنوان التوصيل">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="المدينة"
                      error={addrForm.formState.errors.city?.message}
                      {...addrForm.register("city")}
                    />
                    <Field
                      label="الحي"
                      error={addrForm.formState.errors.district?.message}
                      {...addrForm.register("district")}
                    />
                    <Field
                      label="الشارع"
                      error={addrForm.formState.errors.street?.message}
                      {...addrForm.register("street")}
                    />
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
                        className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl border border-border hover:border-rose-gold cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          name="ship"
                          checked={shippingIdx === i}
                          onChange={() => setShippingIdx(i)}
                          className="accent-rose-gold shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-sm sm:text-base leading-snug">
                            {opt.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                        </div>
                        <div className="font-display text-sm sm:text-base shrink-0">
                          {opt.price} ج.م
                        </div>
                      </label>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="btn-ghost-luxe flex-1 sm:flex-none"
                  >
                    السابق
                  </button>
                  <button type="submit" className="btn-luxe flex-1 sm:flex-none sm:mr-auto">
                    التالي
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 2 — Payment ── */}
            {step === 2 && (
              <form onSubmit={handleConfirm} noValidate>
                <Card title="طريقة الدفع">
                  <div className="space-y-3 mb-6">
                    {PAY_METHODS.map((m) => (
                      <label
                        key={m.id}
                        className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl border border-border hover:border-rose-gold cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          value={m.id}
                          className="accent-rose-gold shrink-0"
                          {...payForm.register("method")}
                        />
                        <div className="font-display text-sm sm:text-base">{m.label}</div>
                      </label>
                    ))}
                  </div>

                  {watchMethod === "card" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <Field
                        label="رقم البطاقة"
                        placeholder="0000 0000 0000 0000"
                        className="col-span-1 sm:col-span-2"
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

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-ghost-luxe flex-1 sm:flex-none"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={placing}
                    className="btn-luxe flex-1 sm:flex-none sm:mr-auto disabled:opacity-60"
                  >
                    {placing ? "جارٍ التأكيد..." : "تأكيد الطلب"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Desktop Order Summary ── */}
          <aside className="hidden lg:block lg:sticky lg:top-28 self-start p-8 rounded-3xl bg-cream border border-border">
            <div className="font-display text-xl mb-6">ملخص الطلب</div>
            <div className="space-y-3 text-sm">
              {items.map((it) => {
                const price = it.product.price + (it.product.sizes[it.selectedSize]?.extra ?? 0);
                return (
                  <div
                    key={it.product.slug}
                    className="flex items-center justify-between text-muted-foreground"
                  >
                    <span className="truncate ml-3">
                      {it.product.name} × {it.qty}
                    </span>
                    <span className="text-foreground shrink-0">{price * it.qty} ج.م</span>
                  </div>
                );
              })}
              <div className="h-px bg-border my-4" />
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
    <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-border bg-background mb-5">
      <div className="font-display text-lg sm:text-xl mb-5">{title}</div>
      {children}
    </div>
  );
}

const Field = forwardRef<
  HTMLInputElement,
  {
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
    className?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
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
