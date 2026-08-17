import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { IMG } from "@/lib/shop-data";
import { useEffect, useRef, useState } from "react";
import { Leaf, Heart, Star, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — YasRose" },
      { name: "description", content: "قصة YasRose، دار زهور فاخرة وُلدت من عشق التفاصيل." },
      { property: "og:title", content: "من نحن — YasRose" },
      { property: "og:description", content: "دار زهور فاخرة في بني سويف." },
    ],
  }),
  component: About,
});

// Floating petal animation component
function FloatingPetals() {
  const petals = ["🌸", "🌹", "🌷", "✿", "❀", "🌺", "🌼", "✾"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {petals.map((petal, i) => (
        <div
          key={i}
          className="absolute text-rose-gold/20 select-none"
          style={{
            left: `${10 + i * 11}%`,
            top: "-20px",
            fontSize: `${14 + (i % 3) * 6}px`,
            animation: `float-petal ${3.5 + i * 0.4}s ease-in-out ${i * 0.6}s infinite`,
          }}
        >
          {petal}
        </div>
      ))}
    </div>
  );
}

// Counter animation hook
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function AnimatedStat({
  prefix = "",
  suffix = "",
  number,
  label,
  icon,
  delay = 0,
}: {
  prefix?: string;
  suffix?: string;
  number: number | null;
  label: string;
  icon: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(number ?? 0, 1600, visible && number !== null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative bg-background border border-border/50 rounded-3xl p-6 hover:border-rose-gold/40 hover:shadow-soft transition-all duration-500 overflow-hidden"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms, border-color .3s, box-shadow .3s`,
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-rose-gold/5 group-hover:bg-rose-gold/10 transition-colors duration-500"
        aria-hidden
      />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-display text-3xl text-shimmer">
        {prefix}
        {number !== null ? count : "—"}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{label}</div>
    </div>
  );
}

function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered entrance animations
    const els = [heroRef.current, imgRef.current, textRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform =
        i === 0 ? "translateY(40px)" : i === 1 ? "translateX(-30px)" : "translateX(30px)";
      el.style.transition = `opacity 1s cubic-bezier(.2,.8,.2,1) ${i * 200}ms, transform 1s cubic-bezier(.2,.8,.2,1) ${i * 200}ms`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translate(0,0)";
        }),
      );
    });
  }, []);

  return (
    <Layout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-cream min-h-[60vh] flex items-center">
        <FloatingPetals />
        <div
          className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, oklch(0.96 0.028 10 / 0.4) 0%, transparent 65%)",
            transform: "translate(20%, -30%)",
          }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, oklch(0.88 0.04 50 / 0.08) 0%, transparent 70%)",
            transform: "translate(-15%, 20%)",
          }}
          aria-hidden
        />
        <div className="container-luxe pt-36 pb-24 w-full">
          <div ref={heroRef} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-rose-gold" />
              <div className="eyebrow">قصتنا</div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.92] tracking-tight">
              وُلدت YasRose
              <span
                className="block italic font-light mt-2 text-rose-gold/90"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                من عشق التفاصيل الصغيرة
              </span>
            </h1>
            <p className="mt-8 text-muted-foreground leading-loose text-lg max-w-xl">
              منذ عام ٢٠١٨، نُنسّق الجمال يدوياً في قلب بني سويف.
            </p>
            {/* animated line */}
            <div className="mt-10 flex items-center gap-4">
              <div
                className="h-px bg-gradient-to-r from-rose-gold to-transparent w-24"
                style={{ animation: "grow-width 1.5s ease-out 0.8s both" }}
              />
              <Sparkles className="w-4 h-4 text-rose-gold/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Inline style for petal animation */}
      <style>{`
        @keyframes float-petal {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes grow-width {
          from { width: 0; opacity: 0; }
          to   { width: 96px; opacity: 1; }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ─── Story Section ─── */}
      <section className="container-luxe py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div ref={imgRef} className="relative">
            <div className="aspect-[3/4] rounded-[36px] overflow-hidden shadow-luxe">
              <img src={IMG.atelier} alt="أتلييه YasRose" className="w-full h-full object-cover" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 card-glass rounded-3xl p-6 shadow-soft border border-border/40">
              <div className="text-[10px] tracking-[0.2em] uppercase text-rose-gold mb-2">
                تأسس عام
              </div>
              <div className="font-display text-4xl text-shimmer">٢٠١٨</div>
              <div className="text-xs text-muted-foreground mt-1">بني سويف · مصر</div>
            </div>
            {/* Second decorative badge */}
            <div className="absolute -top-4 -left-4 card-glass rounded-2xl px-4 py-3 shadow-soft border border-border/40 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-gold/20 grid place-items-center">
                  <Star className="w-4 h-4 text-rose-gold fill-rose-gold" />
                </div>
                <div>
                  <div className="font-display text-sm">٤.٩ / ٥</div>
                  <div className="text-[10px] text-muted-foreground">+٢٤٠٠ تقييم</div>
                </div>
              </div>
            </div>
          </div>

          <div ref={textRef} className="space-y-8">
            <p className="text-muted-foreground leading-loose text-lg">
              في عام ٢٠١٨، افتُتحت أبواب أتلييه YasRose في قلب بني سويف، بهدف واحد: تقديم زهور فاخرة
              بتنسيق يليق باللحظات الاستثنائية.
            </p>
            <p className="text-muted-foreground leading-loose text-lg">
              كل باقة تخرج من الأتلييه هي عمل فني صغير — تُصمم يدوياً على يد مصممين درسوا الفن
              الفلورالي في باريس وأمستردام، باستخدام زهور طازجة نستوردها ثلاث مرات أسبوعياً.
            </p>
            <p className="text-muted-foreground leading-loose text-lg">
              نحن لا نُنسق زهوراً فحسب — نُنسّق طقوس الاحتفاء بمن نحبهم.
            </p>

            {/* Values */}
            <div className="mt-10 space-y-5">
              {[
                {
                  icon: Heart,
                  title: "الحرفية أولاً",
                  desc: "كل باقة تُصمم يدوياً في بني سويف، بلمسة مصممي الدار الذين يُتقنون ما يصنعون.",
                },
                {
                  icon: Leaf,
                  title: "الاستدامة",
                  desc: "شراكات مع مزارع أوروبية معتمدة، وتغليف قابل لإعادة التدوير.",
                },
                {
                  icon: Star,
                  title: "اللمسة الاستثنائية",
                  desc: "بطاقة إهداء مكتوبة بخط اليد مع كل طلب — لأن التفاصيل هي ما يُحفر في الذاكرة.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-5 p-5 rounded-2xl border border-border/50 hover:border-rose-gold/30 transition-colors duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blush grid place-items-center shrink-0 group-hover:bg-rose-gold/20 transition">
                    <Icon className="w-5 h-5 text-rose-gold" />
                  </div>
                  <div>
                    <div className="font-display text-base mb-1">{title}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Numbers ─── */}
      <section className="bg-charcoal text-primary-foreground py-24">
        <div className="container-luxe">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-center">
            <div>
              <div className="eyebrow text-rose-gold mb-4">أرقام تحكي</div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                كل رقم خلفه
                <span
                  className="block italic font-light mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  حكاية إنسانية
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { n: "+١٢٠٠٠", l: "طلب مُوصل" },
                { n: "+٤٠", l: "تصميم حصري" },
                { n: "٩٨٪", l: "رضا العملاء" },
                { n: "٧ سنوات", l: "من الحرفية" },
              ].map(({ n, l }) => (
                <div
                  key={l}
                  className="border border-white/10 rounded-2xl p-6 hover:border-rose-gold/40 transition"
                >
                  <div className="font-display text-3xl md:text-4xl text-shimmer">{n}</div>
                  <div className="text-xs text-primary-foreground/50 mt-2 tracking-[0.12em] uppercase">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Team / Atelier ─── */}
      <section className="py-24">
        <div className="container-luxe">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">خلف الكواليس</div>
            <h2 className="font-display text-4xl md:text-5xl">فريق يصنع الجمال كل يوم</h2>
            <p className="mt-5 text-muted-foreground leading-loose max-w-xl mx-auto">
              كل صباح من الساعة السادسة، يبدأ فريقنا باختيار أجمل الزهور يدوياً لضمان طزاجتها
              وأناقتها.
            </p>
          </div>

          {/* Big atelier image */}
          <div className="relative rounded-[40px] overflow-hidden aspect-[21/9]">
            <img
              src={IMG.atelier}
              alt="فريق أتلييه YasRose"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-10 right-10 text-primary-foreground">
              <div className="font-display text-3xl md:text-5xl">أتلييه بني سويف</div>
              <div className="text-sm text-primary-foreground/70 mt-2 tracking-[0.2em]">
                مصر · منذ ٢٠١٨
              </div>
            </div>
          </div>

          {/* Animated team stats */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatedStat number={8} label="مصمم متخصص في فن الزهور" icon="🌸" delay={0} />
            <AnimatedStat
              number={6}
              suffix=" ص"
              label="بداية يومنا — كل يوم بلا استثناء"
              icon="⏰"
              delay={100}
            />
            <AnimatedStat
              number={1200}
              prefix="+"
              suffix=""
              label="باقة تُنسّق بعناية كل شهر"
              icon="💐"
              delay={200}
            />
            <AnimatedStat
              number={3}
              suffix="× أسبوعياً"
              label="استيراد زهور طازجة من أوروبا"
              icon="✈️"
              delay={300}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
