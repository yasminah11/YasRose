import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Truck, Leaf, HandHeart, Star, Instagram, Wand2, Flower2, Quote, Clock, MapPin, PhoneCall, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { AIBouquetWizard } from "@/components/site/AIBouquetWizard";
import { products, categories, occasions, IMG } from "@/lib/shop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YasRose — زهور فاخرة تُصمم لحظاتك" },
      { name: "description", content: "دار زهور فاخرة في بني سويف. باقات مُنسقة يدوياً، علب هدايا حصرية، وتوصيل في نفس اليوم." },
      { property: "og:title", content: "YasRose — دار الزهور الفاخرة" },
      { property: "og:description", content: "زهور فاخرة، تنسيق يدوي، تجربة استثنائية." },
    ],
  }),
  component: Home,
});

function Home() {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <Layout transparentNav>
      <Hero />
      <FeaturedCollection />
      <AIRecommendationCTA onOpen={() => setAiOpen(true)} />
      <ByOccasion />
      <ByFlowerType />
      <BestSellers />
      <BuildYourOwnCTA />
      <LuxuryCollections />
      <WhyChoose />
      <Atelier />
      <Reviews />
      <InstagramGallery />
      <DeliveryBanner />
      <Newsletter />
      <AIBouquetWizard open={aiOpen} onClose={() => setAiOpen(false)} />
    </Layout>
  );
}

function AIRecommendationCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="py-24">
      <div className="container-luxe">
        <div className="reveal relative overflow-hidden rounded-[40px] bg-charcoal text-primary-foreground px-8 py-16 md:p-20">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-rose-gold/25 blur-3xl" aria-hidden />
          <div className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full bg-blush/15 blur-3xl" aria-hidden />
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] items-center gap-12">
            <div>
              <div className="eyebrow text-rose-gold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> YasRose AI · مساعد التوصيات
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
                محتار في اختيار
                <span className="block italic font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  الباقة المثالية؟
                </span>
              </h2>
              <p className="mt-6 text-primary-foreground/70 leading-loose max-w-lg">
                دع YasRose AI يرشح لك أجمل الباقات بناءً على المناسبة، الأسلوب، والألوان التي تفضلها.
                تجربة شخصية في أقل من دقيقة.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button onClick={onOpen} className="btn-luxe !bg-rose-gold !text-white hover:!bg-rose-gold/90">
                  <Sparkles className="w-4 h-4" /> جرّب توصية الذكاء الاصطناعي
                </button>
                <div className="text-xs tracking-[0.2em] text-primary-foreground/60">مجاناً · بدون تسجيل</div>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-xs text-primary-foreground/60">
                {["٧ أسئلة ذكية", "توصيات فورية", "مطابقة دقيقة", "احفظ وشارك"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-gold" /> {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="glass rounded-3xl p-6 bg-white/5 border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-full bg-rose-gold grid place-items-center">
                    <Sparkles className="w-4 h-4 text-charcoal" />
                  </span>
                  <div>
                    <div className="text-sm">YasRose AI</div>
                    <div className="text-[10px] text-primary-foreground/50">متصل الآن</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-2xl bg-white/10 rounded-tr-sm">لمن تُهدي الزهور اليوم؟</div>
                  <div className="p-3 rounded-2xl bg-rose-gold/90 text-white rounded-tl-sm w-fit ms-auto">لأمي، بمناسبة عيد الأم 🌸</div>
                  <div className="p-3 rounded-2xl bg-white/10 rounded-tr-sm">اختيار جميل. أقترح باقة فاوانيا وردية بأسلوب رومانسي...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuildYourOwnCTA() {
  return (
    <section className="py-24">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-[40px] bg-blush/60 px-8 py-16 md:p-20">
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: `url(${IMG.flatlay})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px)" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-blush/50" aria-hidden />
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="eyebrow mb-4 flex items-center gap-2">
                <Flower2 className="w-4 h-4" /> استوديو التنسيق
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
                صمّم باقتك
                <span className="block italic font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  كما تحلم بها
                </span>
              </h2>
              <p className="mt-6 text-charcoal/70 leading-loose max-w-md">
                اختر الزهور، الألوان، التغليف، والإضافات. شاهد باقتك تتشكل أمامك مباشرة، بلمسة صانع محترف.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/design" className="btn-luxe">
                  <Wand2 className="w-4 h-4" /> ابدأ تصميم باقتك
                </Link>
                <div className="text-xs tracking-[0.2em] text-charcoal/60">معاينة مباشرة · تجربة تفاعلية</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[IMG.hero, IMG.b2, IMG.b4, IMG.b1, IMG.b3, IMG.flatlay].map((src, i) => (
                <div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1200ms]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CORMORANT = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 } as const;

function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(28px)";
      child.style.transition = `opacity 1s cubic-bezier(.2,.8,.2,1) ${i * 160}ms, transform 1s cubic-bezier(.2,.8,.2,1) ${i * 160}ms`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      children.forEach(child => {
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      });
    }));
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden" aria-label="الصفحة الرئيسية">
      {/* Full-bleed background image */}
      <img
        src={IMG.hero}
        alt="باقة ورود فاخرة"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Layered gradient overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,22,18,0.78) 0%, rgba(30,22,18,0.35) 45%, rgba(30,22,18,0.08) 100%)" }} aria-hidden />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(30,22,18,0.35) 0%, transparent 55%)" }} aria-hidden />

      {/* Content — bottom aligned */}
      <div className="absolute inset-x-0 bottom-0 container-luxe pb-16 md:pb-20">
        <div ref={contentRef} className="max-w-2xl">

          {/* Label line */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-rose-gold/70" />
            <span className="text-[10px] tracking-[0.35em] text-white/50 uppercase">YasRose · Beni Suef · 2026</span>
          </div>

          {/* Headline */}
          <h1 style={{ ...CORMORANT, lineHeight: 1, letterSpacing: "-0.01em" }}>
            <span className="block text-white text-[clamp(2.8rem,7vw,6rem)]">
              زهور تُروى
            </span>
            <span
              className="block text-[clamp(2.8rem,7vw,6rem)]"
              style={{ ...CORMORANT, color: "var(--rose-gold)", opacity: 0.9, fontStyle: "italic" }}
            >
              بها الحكايات
            </span>
          </h1>

          {/* Sub */}
          <p className="mt-5 text-white/55 leading-relaxed max-w-sm" style={{ ...CORMORANT, fontSize: "clamp(1rem,2vw,1.2rem)" }}>
            كل باقة تُنسّق يدوياً في أتلييه بني سويف — من الحديقة إلى بابك في نفس اليوم
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2.5 bg-white text-charcoal text-sm px-6 py-3 rounded-full transition-all duration-300 hover:bg-rose-gold hover:text-white"
              style={{ fontFamily: "'Alexandria', sans-serif" }}
            >
              اكتشف المجموعة
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/occasions"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/40 px-6 py-3 rounded-full backdrop-blur-sm"
              style={{ fontFamily: "'Alexandria', sans-serif" }}
            >
              تسوّق حسب المناسبة
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-8 flex-wrap">
            {[
              { n: "+٣٢٠٠", l: "عميل" },
              { n: "٩٨٪",   l: "رضا التوصيل" },
              { n: "+٤٠",   l: "تصميم" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ ...CORMORANT, fontSize: "1.6rem", color: "white", lineHeight: 1 }}>{n}</div>
                <div className="text-[11px] text-white/40 mt-0.5" style={{ fontFamily: "'Alexandria', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" aria-hidden>
        <div className="w-px h-10 bg-white/20" style={{ animation: "grow-line 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

function Marquee() {
  const row1 = [
    { text: "توصيل في نفس اليوم", icon: "🚚" },
    { text: "تنسيق يدوي",          icon: "✍️" },
    { text: "زهور أوروبية طازجة",  icon: "🌿" },
    { text: "تغليف فاخر",          icon: "🎁" },
    { text: "بطاقة إهداء مخصصة",  icon: "💌" },
    { text: "دفع آمن",             icon: "🔒" },
  ];
  const row2 = [
    { text: "مجموعة ربيع ٢٠٢٦",  icon: "🌸" },
    { text: "أتلييه بني سويف",       icon: "📍" },
    { text: "ضمان الجودة",        icon: "✨" },
    { text: "هولندا وإكوادور",    icon: "🌷" },
    { text: "خدمة عملاء ٢٤/٧",   icon: "💬" },
    { text: "تجربة استثنائية",    icon: "👑" },
  ];
  return (
    <div className="border-y border-border/60 overflow-hidden bg-background py-0">
      <div className="py-3.5 border-b border-border/40">
        <div className="flex gap-14 animate-marquee whitespace-nowrap">
          {[...row1, ...row1, ...row1].map((t, i) => (
            <span key={i} className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground flex items-center gap-14">
              <span className="text-sm">{t.icon}</span> {t.text}
              <span className="w-1 h-1 rounded-full bg-rose-gold inline-block" />
            </span>
          ))}
        </div>
      </div>
      <div className="py-3.5 bg-blush/15">
        <div className="flex gap-14 animate-marquee-rev whitespace-nowrap">
          {[...row2, ...row2, ...row2].map((t, i) => (
            <span key={i} className="text-[11px] tracking-[0.28em] uppercase text-rose-gold/70 flex items-center gap-14">
              <span className="text-sm">{t.icon}</span> {t.text}
              <span className="w-1 h-1 rounded-full bg-charcoal/30 inline-block" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCollection() {
  const filters = ["الكل", "الورد الجوري", "الفاوانيا", "الأوركيد", "علب الهدايا"];
  const [active, setActive] = useState("الكل");
  const filtered = active === "الكل"
    ? products.slice(0, 3)
    : products.filter(p => p.category === active).slice(0, 3);
  const display = filtered.length > 0 ? filtered : products.slice(0, 3);

  return (
    <section className="py-32 container-luxe">
      <div className="reveal flex items-end justify-between gap-8 mb-10 flex-wrap">
        <div>
          <div className="eyebrow mb-4">مجموعة مختارة</div>
          <h2 className="font-display text-4xl md:text-5xl max-w-xl leading-tight">
            توليفات ربيع محدودة، تُروى بلمسة يد الأتلييه
          </h2>
        </div>
        <Link to="/shop" className="btn-ghost-luxe shrink-0">عرض المجموعة كاملة</Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-12">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`text-sm px-5 py-2 rounded-full border transition-all duration-300 ${
              active === f
                ? "bg-charcoal text-primary-foreground border-charcoal"
                : "border-border/60 text-muted-foreground hover:border-charcoal hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}

function ByOccasion() {
  return (
    <section className="py-32 bg-blush/30">
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow mb-4">تسوّق حسب المناسبة</div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">لكل لحظة زهرتها</h2>
          <p className="mt-5 text-muted-foreground leading-loose">من الأعراس إلى المكاتب، تجد عندنا الباقة التي تعبّر عنك بالضبط.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.slice(0, 6).map((o, i) => (
            <Link
              key={o.slug}
              to="/occasion/$slug"
              params={{ slug: o.slug }}
              className={`group relative overflow-hidden rounded-3xl ${
                i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/5]"
              }`}
            >
              <img
                src={o.image}
                alt={o.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-108"
                style={{ "--tw-scale-x": "1.08", "--tw-scale-y": "1.08" } as React.CSSProperties}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-7 text-primary-foreground">
                <span className="absolute top-5 right-5 font-display text-[11px] tracking-[0.3em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="font-display text-2xl md:text-3xl">{o.name}</div>
                  <div className="text-sm opacity-0 group-hover:opacity-80 mt-2 transition-opacity duration-400 leading-relaxed max-w-xs">
                    {o.desc}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
                    اكتشف المجموعة <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ByFlowerType() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section className="py-32 container-luxe">
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
        <div>
          <div className="eyebrow mb-4">حسب نوع الزهرة</div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            ست عائلات من الزهور، اختر لغتك
          </h2>
          <p className="mt-6 text-muted-foreground leading-loose">
            كل عائلة تحمل معناها الخاص وطقسها الفريد. من نعومة الفاوانيا إلى شموخ الأوركيد.
          </p>

          <div className="mt-10 h-16 transition-all">
            {hovered && (() => {
              const cat = categories.find(c => c.slug === hovered);
              return cat ? (
                <div className="animate-fade-in-up">
                  <div className="font-display text-xl text-rose-gold">{cat.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{cat.count} تصميم متاح في هذه الفئة</div>
                </div>
              ) : null;
            })()}
          </div>

          <Link to="/categories" className="btn-ghost-luxe mt-8 inline-flex">
            استعراض جميع التصنيفات <ArrowLeft className="w-4 h-4 ms-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/categories"
              className="group"
              onMouseEnter={() => setHovered(c.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream shadow-soft/20 card-hover">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-112"
                  style={{ "--tw-scale-x": "1.12", "--tw-scale-y": "1.12" } as React.CSSProperties}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-3 right-3 left-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <div className="text-[11px] tracking-[0.2em] uppercase">{c.count} قطعة</div>
                </div>
                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-rose-gold/90 grid place-items-center opacity-0 group-hover:opacity-100 transition scale-75 group-hover:scale-100">
                  <ArrowLeft className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="mt-3.5 flex items-baseline justify-between gap-2">
                <div className="font-display text-base group-hover:text-rose-gold transition">{c.name}</div>
                <div className="text-xs text-muted-foreground shrink-0">{c.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="py-32 bg-cream">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-8 mb-14 flex-wrap">
          <div>
            <div className="eyebrow mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              الأكثر حباً
            </div>
            <h2 className="font-display text-4xl md:text-5xl">اختيارات عملائنا هذا الموسم</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
              تُباع بسرعة 🔥
            </span>
            <Link to="/shop" className="btn-ghost-luxe">جميع المنتجات</Link>
          </div>
        </div>
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(1, 5).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LuxuryCollections() {
  return (
    <section className="py-32 container-luxe">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-[36px] aspect-[4/5] group">
          <img src={IMG.flatlay} alt="مجموعة العلب الفاخرة" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 text-primary-foreground">
            <div className="eyebrow text-rose-gold mb-3">مجموعة العلب</div>
            <h3 className="font-display text-4xl leading-tight">علبة توقيع الدار</h3>
            <p className="mt-3 text-sm opacity-80 max-w-xs">وردة طويلة من أرقى المزارع، في علبة مصنوعة يدوياً.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm tracking-[0.2em]">
              اكتشف <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[36px] aspect-[4/5] group">
          <img src={IMG.b4} alt="مجموعة الأوركيد" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 text-primary-foreground">
            <div className="eyebrow text-rose-gold mb-3">مجموعة الأوركيد</div>
            <h3 className="font-display text-4xl leading-tight">لحظة تأمل نادرة</h3>
            <p className="mt-3 text-sm opacity-80 max-w-xs">أوركيد فالينوبسيس مختار بعناية، لمساحات مميزة.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm tracking-[0.2em]">
              اكتشف <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    { icon: Leaf,        title: "زهور طازجة يومياً",   desc: "نستورد أفضل الأنواع من هولندا وإكوادور، ونستلمها كل صباح.",     stat: "٩٨٪", statLabel: "معدل رضا العملاء" },
    { icon: HandHeart,   title: "تنسيق يدوي",           desc: "كل باقة تُصمم يدوياً في أتلييه بني سويف على يد مصممين محترفين.", stat: "+٨",   statLabel: "مصمم متخصص" },
    { icon: Truck,       title: "توصيل في نفس اليوم",   desc: "خدمة توصيل فاخرة تصل باقتك في الوقت المحدد بالضبط.",          stat: "٣ س",  statLabel: "متوسط وقت التوصيل" },
    { icon: Sparkles,    title: "لمسة استثنائية",        desc: "بطاقة إهداء مكتوبة يدوياً وتغليف فاخر مع كل طلب.",            stat: "١٠٠٪", statLabel: "تغليف مخصص يدوي" },
  ];
  return (
    <section className="py-32 bg-charcoal text-primary-foreground overflow-hidden">
      <div className="container-luxe">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start mb-20">
          <div>
            <div className="eyebrow text-rose-gold mb-4">لماذا YasRose</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              التفاصيل التي تُميّز اللحظة
            </h2>
          </div>
          <p className="text-primary-foreground/70 leading-loose text-lg self-end">
            في YasRose، لا نصمم باقات فحسب — بل نصمم لحظات. من اختيار الزهرة إلى ربطة الشريط،
            كل تفصيل يُدرس بعناية ليكون تجربة استثنائية تليق بمن تُحب.
          </p>
        </div>
        <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <div key={it.title} className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-rose-gold/40 rounded-3xl p-8 transition-all duration-500 card-hover overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden />

              <div className="w-12 h-12 rounded-2xl bg-rose-gold/15 grid place-items-center mb-8 group-hover:bg-rose-gold/25 transition">
                <it.icon className="w-5 h-5 text-rose-gold" />
              </div>
              <h3 className="font-display text-xl mb-3">{it.title}</h3>
              <p className="text-sm text-primary-foreground/60 leading-loose">{it.desc}</p>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="font-display text-2xl text-shimmer">{it.stat}</div>
                <div className="text-[11px] text-primary-foreground/50 mt-0.5">{it.statLabel}</div>
              </div>

              <div className="absolute bottom-6 left-8 text-[60px] font-display text-white/4 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "لمى العتيبي", text: "أجمل باقة استلمتها في حياتي. التغليف بحد ذاته تحفة، والزهور طازجة كأنها للتو من الحديقة.", city: "بني سويف", product: "لوميير روز", avatar: "ل" },
    { name: "نور الحربي", text: "YasRose أصبح خياري الأول لكل مناسبة. التفاصيل، الذوق، والالتزام بالوقت شيء استثنائي.", city: "القاهرة", product: "روز أتلييه • علبة", avatar: "ن" },
    { name: "دانة الشمري", text: "طلبت علبة توقيع الدار هدية، ودموع الفرح قالت كل شيء. شكراً على اللمسة الراقية.", city: "أسيوط", product: "فالينوبسيس سولو", avatar: "د" },
    { name: "ريم القحطاني", text: "تجربة كاملة من أول لحظة للطلب حتى وصول الباقة. التغليف فاخر جداً وكأنه هدية من محل راقٍ في باريس.", city: "بني سويف", product: "إيفوار جاردن", avatar: "ر" },
    { name: "هند الزهراني", text: "أرسلت لأمي باقة في عيد الأم وكانت المفاجأة مذهلة. رائحة الزهور ملأت البيت كله. شكراً YasRose.", city: "الإسكندرية", product: "لوميير روز", avatar: "ه" },
  ];

  const [idx, setIdx] = useState(0);
  const next = () => setIdx((p) => (p + 1) % reviews.length);
  const prev = () => setIdx((p) => (p - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, []);

  const visible = [
    reviews[idx],
    reviews[(idx + 1) % reviews.length],
    reviews[(idx + 2) % reviews.length],
  ];

  return (
    <section className="py-32 overflow-hidden">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-8 mb-16 flex-wrap">
          <div>
            <div className="eyebrow mb-4">شهادات عملائنا</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">لحظاتٌ حكتها الزهور</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 me-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-rose-gold text-rose-gold" />)}
              </div>
              <span className="text-sm font-display">٤.٩</span>
              <span className="text-xs text-muted-foreground">من ٢٤٠٠+ تقييم</span>
            </div>
            <button onClick={prev} aria-label="السابق" className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold hover:text-rose-gold transition">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={next} aria-label="التالي" className="w-10 h-10 grid place-items-center rounded-full border border-border hover:border-rose-gold hover:text-rose-gold transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {visible.map((r, i) => (
            <figure
              key={`${r.name}-${idx}-${i}`}
              className={`p-8 rounded-3xl border card-hover transition-all duration-500 ${
                i === 0
                  ? "bg-charcoal text-primary-foreground border-charcoal"
                  : "bg-cream border-border/40"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-rose-gold text-rose-gold" />
                  ))}
                </div>
                <Quote className={`w-8 h-8 opacity-20 ${i === 0 ? "text-rose-gold" : "text-charcoal"}`} />
              </div>
              <blockquote className="font-display text-lg leading-relaxed">{r.text}</blockquote>
              <div className={`text-xs mt-3 ${i === 0 ? "text-rose-gold/80" : "text-rose-gold"}`}>
                {r.product}
              </div>
              <figcaption className={`mt-8 pt-6 border-t flex items-center gap-3 ${i === 0 ? "border-white/10" : "border-border/60"}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-rose-gold/60 grid place-items-center font-display text-charcoal shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <div className={`font-medium text-sm ${i === 0 ? "text-primary-foreground" : ""}`}>{r.name}</div>
                  <div className={`text-xs flex items-center gap-1 mt-0.5 ${i === 0 ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                    <MapPin className="w-3 h-3" /> {r.city}
                  </div>
                </div>
                <div className={`ms-auto text-[10px] tracking-[0.2em] uppercase ${i === 0 ? "text-rose-gold" : "text-rose-gold/70"}`}>
                  موثقة
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`تقييم ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-rose-gold" : "w-1.5 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramGallery() {
  const imgs = [
    { src: IMG.hero,    likes: "٢.٤ ألف", label: "لوميير روز" },
    { src: IMG.b1,      likes: "١.٨ ألف", label: "إيفوار جاردن" },
    { src: IMG.b2,      likes: "٣.١ ألف", label: "روج أتلييه" },
    { src: IMG.b3,      likes: "٩٨٧",     label: "فيردي أوكاليبت" },
    { src: IMG.b4,      likes: "١.٢ ألف", label: "فالينوبسيس" },
    { src: IMG.flatlay, likes: "٢.٧ ألف", label: "علبة توقيع الدار" },
  ];
  return (
    <section className="py-24 bg-charcoal text-primary-foreground">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <div className="eyebrow text-rose-gold mb-3 flex items-center gap-2">
              <Instagram className="w-4 h-4" /> @yasrose.ksa
            </div>
            <h2 className="font-display text-3xl md:text-4xl">من أتلييه الدار</h2>
            <p className="mt-2 text-primary-foreground/50 text-sm">لحظات حقيقية من ورشة التنسيق</p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-sm border border-white/20 rounded-full px-5 py-2.5 hover:bg-rose-gold hover:border-rose-gold transition"
          >
            <Instagram className="w-4 h-4" /> تابع على إنستغرام
          </a>
        </div>

        {/* Horizontal scrolling strip */}
        <div className="overflow-hidden">
          <div className="flex gap-3 animate-marquee-slow whitespace-nowrap" style={{ width: "max-content" }}>
            {[...imgs, ...imgs, ...imgs].map((item, i) => (
              <a
                key={i}
                href="#"
                className="group relative overflow-hidden rounded-2xl shrink-0"
                style={{ width: "200px", height: "200px" }}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-3">
                  <div className="text-xs font-display translate-y-2 group-hover:translate-y-0 transition-transform duration-300 whitespace-normal">{item.label}</div>
                  <div className="flex items-center gap-1 text-[10px] text-primary-foreground/70 mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    <Star className="w-2.5 h-2.5 fill-rose-gold text-rose-gold" /> {item.likes}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-6 h-6 grid place-items-center rounded-full bg-white/20 backdrop-blur">
                    <Instagram className="w-3 h-3 text-white" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Atelier() {
  return (
    <section className="py-32">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-[40px] bg-cream border border-border/40">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
            {/* Image side */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden rounded-tr-[40px] rounded-br-[40px] lg:rounded-tr-none lg:rounded-br-none rounded-tl-[40px] rounded-bl-[40px]">
              <img src={IMG.atelier} alt="أتلييه YasRose" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-cream/60 via-transparent to-transparent hidden lg:block" aria-hidden />
              <div className="absolute bottom-6 left-6 card-glass rounded-2xl px-5 py-4 shadow-soft">
                <div className="text-[10px] tracking-[0.2em] uppercase text-rose-gold mb-1">تأسس عام</div>
                <div className="font-display text-3xl">٢٠١٨</div>
                <div className="text-xs text-muted-foreground mt-1">بني سويف، مصر</div>
              </div>
            </div>

            {/* Text side */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <div className="eyebrow mb-4">أتلييه الدار</div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">
                حيث تولد كل زهرة
                <span className="block italic font-light mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  باقةً استثنائية
                </span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-loose max-w-lg">
                في قلب بني سويف، يعمل فريق مصممين محترفين كل يوم منذ الفجر على انتقاء أجمل الزهور واحدةً واحدة،
                لتُولد كل باقة من أنامل تُحب ما تصنع.
              </p>

              {/* Scrolling mini images strip */}
              <div className="mt-8 overflow-hidden rounded-2xl">
                <div className="flex gap-2 animate-marquee-inline" style={{ width: "max-content" }}>
                  {[IMG.hero, IMG.b1, IMG.b2, IMG.b3, IMG.b4, IMG.flatlay, IMG.atelier, IMG.hero, IMG.b1, IMG.b2, IMG.b3, IMG.b4, IMG.flatlay].map((src, i) => (
                    <div key={i} className="shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-5">
                {[
                  { n: "٨", label: "مصممون متخصصون" },
                  { n: "٦ صباحاً", label: "بداية يومنا كل يوم" },
                  { n: "+١٢٠٠", label: "باقة تُنسَّق شهرياً" },
                  { n: "٣ ساعات", label: "متوسط وقت التوصيل" },
                ].map((s) => (
                  <div key={s.label} className="border border-border/60 rounded-2xl p-4">
                    <div className="font-display text-2xl text-shimmer">{s.n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <Link to="/about" className="mt-10 btn-ghost-luxe self-start">
                اعرف قصتنا <ArrowLeft className="w-4 h-4 ms-1 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryBanner() {
  const features = [
    { icon: Clock,       title: "توصيل في ٣ ساعات",      desc: "نضمن وصول طلبك خلال ٣ ساعات داخل بني سويف بعد تأكيد الطلب." },
    { icon: MapPin,      title: "التغطية الجغرافية",       desc: "نُوصّل للقاهرة، المنصورة، ومناطق أخرى — اطّلع على الخريطة." },
    { icon: PhoneCall,   title: "تأكيد مباشر",             desc: "سيتصل بك فريق الدار لتأكيد الموعد المثالي قبل المغادرة." },
    { icon: Sparkles,    title: "تغليف احترافي",           desc: "كل طلب يصل في صندوق YasRose المُعبّأ يدوياً بعطر الدار." },
  ];
  return (
    <section className="py-24 bg-blush/30">
      <div className="container-luxe">
        <div className="text-center mb-14">
          <div className="eyebrow mb-4 flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" /> خدمة التوصيل الفاخرة
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">نصل إليك كما تستحق</h2>
        </div>
        <div className="stagger-children grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="group bg-background border border-border/60 rounded-3xl p-8 card-hover">
              <div className="w-12 h-12 rounded-2xl bg-blush grid place-items-center mb-6 group-hover:bg-rose-gold/20 transition">
                <f.icon className="w-5 h-5 text-rose-gold" />
              </div>
              <div className="font-display text-lg mb-3">{f.title}</div>
              <p className="text-sm text-muted-foreground leading-loose">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); }
  };
  return (
    <section className="py-24">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-[40px] bg-charcoal text-primary-foreground px-8 py-20 md:p-24">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${IMG.flatlay})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-rose-gold/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full bg-blush/10 blur-3xl" aria-hidden />

          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <div className="eyebrow text-rose-gold mb-4">قائمة الدار الخاصة</div>
              <h2 className="font-display text-3xl md:text-5xl leading-tight">
                كن أول من يعرف
                <span className="block italic font-light mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  عن المجموعات الجديدة
                </span>
              </h2>
              <p className="mt-6 text-primary-foreground/70 leading-loose max-w-md">
                دعوات خاصة، عروض حصرية، ودعوات لحفلات الإطلاق الموسمية في الأتلييه.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["لا رسائل مزعجة", "إلغاء في أي وقت", "محتوى حصري"].map((t) => (
                  <span key={t} className="text-xs border border-white/20 rounded-full px-3 py-1 text-primary-foreground/70">{t}</span>
                ))}
              </div>
            </div>

            <div>
              {sent ? (
                <div className="card-glass rounded-3xl p-10 text-center">
                  <div className="text-4xl mb-4">🌸</div>
                  <div className="font-display text-2xl text-charcoal mb-2">شكراً لانضمامك!</div>
                  <div className="text-sm text-muted-foreground">سنرسل لك أجمل الأخبار والمفاجآت.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-glass rounded-3xl p-8 space-y-4">
                  <div className="font-display text-charcoal text-xl mb-2">اشترك الآن</div>
                  <input
                    type="text"
                    placeholder="اسمك"
                    className="w-full h-13 px-5 py-3.5 rounded-2xl bg-white/60 border border-border outline-none focus:border-rose-gold transition text-charcoal placeholder:text-muted-foreground text-sm"
                  />
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full h-13 px-5 py-3.5 rounded-2xl bg-white/60 border border-border outline-none focus:border-rose-gold transition text-charcoal placeholder:text-muted-foreground text-sm"
                  />
                  <button type="submit" className="w-full btn-luxe">
                    <Sparkles className="w-4 h-4" /> انضم إلى قائمة الدار
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
