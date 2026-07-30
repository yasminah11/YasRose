import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { IMG } from "@/lib/shop-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — YasRose" },
      { name: "description", content: "ادخلي إلى حسابك لمتابعة طلباتك والمفضلة." },
      { property: "og:title", content: "تسجيل الدخول — YasRose" },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (isLoggedIn) {
    navigate({ to: "/profile" });
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    const res = await login(data.email, data.password);
    if (res.ok) {
      toast.success("مرحباً بعودتك!");
      navigate({ to: "/profile" });
    } else {
      toast.error(res.error ?? "حدث خطأ، حاولي مجدداً");
    }
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="grid lg:grid-cols-2 gap-16 min-h-[70vh]">
          <div className="hidden lg:block relative rounded-[36px] overflow-hidden">
            <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <div className="absolute bottom-12 right-12 text-primary-foreground max-w-sm">
              <div className="eyebrow text-rose-gold mb-3">أهلاً بعودتك</div>
              <div className="font-display text-4xl leading-tight">لحظاتك الفاخرة بانتظارك</div>
            </div>
          </div>

          <div className="flex items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5" noValidate>
              <div>
                <div className="eyebrow mb-3">تسجيل الدخول</div>
                <h1 className="font-display text-4xl">مرحباً بعودتك</h1>
                <p className="text-muted-foreground mt-2 text-sm">ادخلي بياناتك للمتابعة.</p>
              </div>

              <Field
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Field
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-rose-gold" /> تذكريني
                </label>
                <Link to="/forgot-password" className="text-rose-gold hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-luxe w-full disabled:opacity-60">
                {isSubmitting ? "جارٍ الدخول..." : "دخول"}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link to="/register" className="text-foreground underline underline-offset-4">
                  أنشئي حساباً
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { forwardRef } from "react";

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
