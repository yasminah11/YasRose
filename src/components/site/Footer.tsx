import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Twitter,
  Facebook,
  ArrowLeft,
  MapPin,
  PhoneCall,
  Mail,
  Leaf,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormData } from "@/lib/schemas";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container-luxe py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blush to-rose-gold grid place-items-center text-charcoal font-display text-lg shadow-soft"
                aria-hidden="true"
              >
                ف
              </span>
              <div>
                <div className="font-display text-xl tracking-tight">YasRose</div>
                <div className="text-[9px] tracking-[0.3em] text-primary-foreground/40 uppercase">
                  Est. 2018
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-loose max-w-xs">
              دار تنسيق زهور فاخرة في بني سويف، تُصمم لحظاتك بلمسة يدوية استثنائية.
            </p>

            <div className="mt-6 space-y-2.5">
              {[
                {
                  icon: MapPin,
                  text: "بني سويف، مصر",
                  href: "https://maps.google.com/?q=Beni+Suef+Egypt",
                },
                { icon: PhoneCall, text: "+20 82 234 5678", href: "tel:+20822345678" },
                { icon: Mail, text: "hello@yasrose.eg", href: "mailto:hello@yasrose.eg" },
              ].map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-2 text-sm text-primary-foreground/55 hover:text-rose-gold transition"
                >
                  <Icon className="w-3.5 h-3.5 text-rose-gold shrink-0" aria-hidden />
                  {text}
                </a>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              {[
                {
                  Icon: Instagram,
                  label: "Instagram",
                  href: "https://instagram.com/yasrose.flowers",
                },
                { Icon: Twitter, label: "Twitter", href: "https://twitter.com/yasrose" },
                { Icon: Facebook, label: "Facebook", href: "https://facebook.com/yasrose" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 grid place-items-center rounded-full border border-white/15 hover:bg-rose-gold hover:border-rose-gold transition-all duration-300"
                >
                  <Icon className="w-4 h-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="التسوق"
            links={[
              ["المتجر", "/shop"],
              ["التصنيفات", "/categories"],
              ["المناسبات", "/occasions"],
              ["صمّم باقتك", "/design"],
            ]}
          />
          <FooterCol
            title="مساعدة"
            links={[
              ["تواصل معنا", "/contact"],
              ["تتبع الطلب", "/track"],
              ["الأسئلة الشائعة", "/faq"],
              ["من نحن", "/about"],
            ]}
          />
          <NewsletterFooter />
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-primary-foreground/45">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-emerald-400" aria-hidden />© {new Date().getFullYear()}{" "}
            YasRose · صُنع بحب في بني سويف 🌸
          </div>
          <nav aria-label="روابط قانونية" className="flex gap-4">
            <Link to="/privacy" className="hover:text-rose-gold transition">
              الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-rose-gold transition">
              الشروط
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function NewsletterFooter() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      await contactApi.subscribe(data.email);
    } catch {
      // Proceed silently
    }
    setSent(true);
    toast.success("تم الاشتراك في النشرة الحصرية ✓");
  };

  return (
    <div>
      <div className="eyebrow text-rose-gold mb-3">النشرة الحصرية</div>
      <p className="text-sm text-primary-foreground/55 mb-5 leading-relaxed">
        عروض موسمية وأخبار الأتلييه، مباشرة إليك.
      </p>
      {sent ? (
        <div className="text-sm text-rose-gold" role="status">
          ✓ شكراً! سنرسل لك أجمل الأخبار.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="اشتراك النشرة البريدية">
          <div
            className={`flex items-center gap-2 border rounded-full px-4 py-2.5 focus-within:border-rose-gold transition ${
              errors.email ? "border-red-400" : "border-white/20"
            }`}
          >
            <label htmlFor="footer-email" className="sr-only">
              البريد الإلكتروني
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="بريدك الإلكتروني"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-primary-foreground/35 min-w-0"
              {...register("email")}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="اشتراك"
              className="shrink-0 p-1 hover:text-rose-gold transition disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
            </button>
          </div>
          {errors.email && (
            <p role="alert" className="text-xs text-red-400 mt-1 px-2">
              {errors.email.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <div className="eyebrow text-rose-gold mb-4">{title}</div>
      <ul className="space-y-3">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link
              to={to}
              className="text-sm text-primary-foreground/60 hover:text-rose-gold transition-colors flex items-center gap-1 group"
            >
              <span
                className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-rose-gold"
                aria-hidden="true"
              >
                ←
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
