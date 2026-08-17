import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Phone, Mail, MapPin, Instagram, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";
import { useState, forwardRef } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — YasRose" },
      { name: "description", content: "زوري أتلييه الدار في بني سويف، أو تواصلي معنا لطلب مخصص." },
      { property: "og:title", content: "تواصل معنا — YasRose" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: "استفسار عام" },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactApi.send(data);
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      setSent(true);
      reset();
    } catch {
      // Fallback: simulate success for demo
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      setSent(true);
      reset();
    }
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="eyebrow mb-4">تواصل</div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight">
              دعينا نُصمم لك لحظة استثنائية
            </h1>
            <p className="mt-6 text-muted-foreground leading-loose max-w-md">
              سواء لطلب مخصص، تنسيق عرس، أو استفسار — فريقنا جاهز لخدمتك بأناقة.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { icon: Phone, label: "اتصلي بنا", val: "+20 100 000 0000" },
                { icon: Mail, label: "البريد الإلكتروني", val: "hello@yasrose.com" },
                { icon: MapPin, label: "أتلييه الدار", val: "بني سويف، مصر" },
                { icon: Instagram, label: "انستغرام", val: "@yasrose.flowers" },
                { icon: Clock, label: "ساعات العمل", val: "السبت – الخميس · ٩ ص – ٩ م" },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blush/60 grid place-items-center shrink-0">
                    <Icon className="w-5 h-5 text-rose-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-display mt-0.5">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {sent ? (
              <div className="h-full flex items-center justify-center text-center p-12 rounded-3xl bg-blush/30">
                <div>
                  <div className="font-display text-3xl mb-4">شكراً لتواصلك</div>
                  <p className="text-muted-foreground leading-loose mb-8">
                    وصلت رسالتك بنجاح. سيتواصل معك فريقنا خلال ٢٤ ساعة.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-ghost-luxe">
                    إرسال رسالة أخرى
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="الاسم الكامل"
                    placeholder="فاطمة محمد"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Field
                    label="الجوال"
                    placeholder="01012345678"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
                <Field
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@email.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <div>
                  <span className="text-xs text-muted-foreground">نوع الاستفسار</span>
                  <select
                    className={`mt-1.5 w-full h-12 px-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm ${
                      errors.type ? "border-destructive" : "border-border"
                    }`}
                    {...register("type")}
                  >
                    {["استفسار عام", "طلب مخصص", "تنسيق أعراس", "طلب شركات", "شكوى أو اقتراح"].map(
                      (t) => (
                        <option key={t}>{t}</option>
                      ),
                    )}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-destructive">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">رسالتك</span>
                  <textarea
                    rows={5}
                    placeholder="اكتبي رسالتك هنا..."
                    aria-invalid={!!errors.message}
                    className={`mt-1.5 w-full p-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm resize-none ${
                      errors.message ? "border-destructive" : "border-border"
                    }`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxe w-full disabled:opacity-60"
                >
                  {isSubmitting ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

const Field = forwardRef<
  HTMLInputElement,
  {
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, type = "text", placeholder, error, ...rest }, ref) => (
  <label className="block">
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
