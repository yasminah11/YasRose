import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { IMG } from "@/lib/shop-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { forwardRef } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب — YasRose" },
      { name: "description", content: "أنشئي حسابك في دار YasRose لتجربة مخصصة." },
      { property: "og:title", content: "إنشاء حساب — YasRose" },
    ],
  }),
  component: Register,
});

function Register() {
  const { register: registerUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreed: false },
  });

  if (isLoggedIn) {
    navigate({ to: "/profile" });
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    const res = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    if (res.ok) {
      toast.success("مرحباً بك في YasRose! 🌸");
      navigate({ to: "/profile" });
    } else {
      toast.error(res.error ?? "حدث خطأ، حاولي مجدداً");
    }
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="grid lg:grid-cols-2 gap-16 min-h-[70vh]">
          <div className="flex items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4" noValidate>
              <div>
                <div className="eyebrow mb-3">حساب جديد</div>
                <h1 className="font-display text-4xl">انضم إلى الدار</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  تجربة مخصصة، مفضلة محفوظة، ودعوات حصرية.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="الاسم الأول"
                  placeholder="فاطمة"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Field
                  label="اسم العائلة"
                  placeholder="محمد"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>
              <Field
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Field
                label="الجوال"
                placeholder="01012345678"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Field
                label="كلمة المرور"
                type="password"
                placeholder="٦ أحرف على الأقل"
                error={errors.password?.message}
                {...register("password")}
              />
              <Field
                label="تأكيد كلمة المرور"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-rose-gold"
                  {...register("agreed")}
                />
                <span>
                  أوافق على{" "}
                  <Link to="/terms" className="text-foreground underline">
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link to="/privacy" className="text-foreground underline">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-destructive">{errors.agreed.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-luxe w-full disabled:opacity-60"
              >
                {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟{" "}
                <Link to="/login" className="text-foreground underline underline-offset-4">
                  سجلي الدخول
                </Link>
              </div>
            </form>
          </div>

          <div className="hidden lg:block relative rounded-[36px] overflow-hidden">
            <img src={IMG.b1} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
            <div className="absolute bottom-12 right-12 text-primary-foreground max-w-sm">
              <div className="eyebrow text-rose-gold mb-3">انضم إلينا</div>
              <div className="font-display text-4xl leading-tight">عضوية الدار — مزايا استثنائية</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const Field = forwardRef<
  HTMLInputElement,
  { label: string; type?: string; placeholder?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
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
