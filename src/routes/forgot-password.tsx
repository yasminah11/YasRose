import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "استعادة كلمة المرور — YasRose" }, { name: "robots", content: "noindex" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authApi.forgotPassword(data.email);
    } catch {
      // Mock: succeed silently even if backend unreachable
    }
    setSentEmail(data.email);
    setSent(true);
    toast.success("تم إرسال رابط الاستعادة");
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-md mx-auto py-24">
          <div className="w-14 h-14 rounded-full bg-blush grid place-items-center mb-8">
            <Mail className="w-6 h-6 text-rose-gold" />
          </div>

          {sent ? (
            <div className="text-center">
              <div className="eyebrow mb-3">تم الإرسال</div>
              <h1 className="font-display text-4xl mb-4">تفقدي بريدك</h1>
              <p className="text-muted-foreground leading-loose">
                أرسلنا رابط إعادة تعيين كلمة المرور إلى <strong>{sentEmail}</strong>. إذا لم يصلك
                البريد، تفقدي مجلد الرسائل غير المرغوب فيها.
              </p>
              <Link to="/login" className="btn-ghost-luxe mt-8 inline-block">
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <div className="eyebrow mb-3">استعادة الحساب</div>
              <h1 className="font-display text-4xl mb-3">نسيتِ كلمة المرور؟</h1>
              <p className="text-muted-foreground mb-8 leading-loose">
                أدخلي بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <label className="block">
                  <span className="text-xs text-muted-foreground">البريد الإلكتروني</span>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    aria-invalid={!!errors.email}
                    className={`mt-1.5 w-full h-12 px-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxe w-full disabled:opacity-60"
                >
                  {isSubmitting ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
                </button>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
