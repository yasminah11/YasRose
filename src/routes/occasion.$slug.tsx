import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { occasions } from "@/lib/shop-data";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ShoppingBag, Sparkles, Heart, X } from "lucide-react";

export const Route = createFileRoute("/occasion/$slug")({
  head: ({ params }) => {
    const occ = occasions.find((o) => o.slug === params.slug);
    return {
      meta: [
        { title: `${occ?.name ?? "المناسبة"} — YasRose` },
        { name: "description", content: `باقات زهور مختارة خصيصاً لمناسبة ${occ?.name ?? ""}` },
      ],
    };
  },
  component: OccasionDetail,
});

// ─── Flower data per occasion ─────────────────────────────────────────────────
const OCCASION_FLOWERS: Record<string, { query: string; arabicName: string; meaning: string }[]> = {
  love: [
    {
      query: "red rose bouquet romantic",
      arabicName: "الورد الأحمر",
      meaning: "رمز الحب والشغف العميق",
    },
    {
      query: "pink peony flowers romantic",
      arabicName: "الفاوانيا",
      meaning: "حب رقيق ونعومة الروح",
    },
    { query: "red tulip bouquet love", arabicName: "التوليب الأحمر", meaning: "اعتراف صادق بالحب" },
    {
      query: "red carnation bouquet passion",
      arabicName: "القرنفل الأحمر",
      meaning: "الشغف والإعجاب القوي",
    },
    {
      query: "garden rose pink bouquet",
      arabicName: "الورد الجوري",
      meaning: "جمال لا يضاهى وتقدير عميق",
    },
    { query: "red anemone flower bouquet", arabicName: "الشقيق", meaning: "لحظة مؤثرة لا تُنسى" },
  ],
  wedding: [
    {
      query: "white rose wedding bouquet",
      arabicName: "الورد الأبيض",
      meaning: "النقاء والبداية الجديدة",
    },
    {
      query: "white peony wedding bouquet",
      arabicName: "الفاوانيا البيضاء",
      meaning: "الازدهار والسعادة الزوجية",
    },
    {
      query: "white lily wedding flowers",
      arabicName: "الزنبق الأبيض",
      meaning: "الطهارة والأناقة الأبدية",
    },
    { query: "white orchid elegant", arabicName: "الأوركيد", meaning: "الأناقة الراقية والخلود" },
    {
      query: "white ranunculus flower",
      arabicName: "الرانونكيولس",
      meaning: "البهجة والجمال المتجدد",
    },
    {
      query: "eucalyptus white flowers bridal",
      arabicName: "الأوكالبتوس",
      meaning: "التناغم والهدوء الرومانسي",
    },
  ],
  anniversary: [
    {
      query: "red rose anniversary bouquet",
      arabicName: "الورد الأحمر",
      meaning: "حب لا يزداد إلا عمقاً",
    },
    {
      query: "deep purple rose bouquet",
      arabicName: "الورد البنفسجي",
      meaning: "ذكريات راسخة في القلب",
    },
    {
      query: "pink garden rose anniversary",
      arabicName: "الورد الجوري",
      meaning: "عطاء دائم وتجدد مستمر",
    },
    {
      query: "red tulip anniversary flowers",
      arabicName: "التوليب",
      meaning: "تجديد العهد والوفاء",
    },
    { query: "wine red dahlia bouquet", arabicName: "الداليا", meaning: "قوة الرابطة بين القلبين" },
    {
      query: "deep pink lily bouquet",
      arabicName: "الزنبق الوردي",
      meaning: "الحب المتصاعد عبر السنين",
    },
  ],
  newborn: [
    {
      query: "soft pink flowers baby shower",
      arabicName: "الورد الوردي الفاتح",
      meaning: "ابتسامة أول لقاء",
    },
    { query: "white baby breath flowers", arabicName: "نفس الطفل", meaning: "البراءة والطهارة" },
    {
      query: "light blue flowers newborn",
      arabicName: "الزهور الزرقاء الفاتحة",
      meaning: "الهدوء والسلام",
    },
    { query: "pale yellow daisy bouquet", arabicName: "الأقحوان", meaning: "فرحة الولادة والضوء" },
    {
      query: "soft peach roses delicate",
      arabicName: "الورد الخوخي",
      meaning: "دفء الأحضان الأولى",
    },
    {
      query: "lavender flowers soft bouquet",
      arabicName: "اللافندر",
      meaning: "حماية وهدوء لروح جديدة",
    },
  ],
  corporate: [
    {
      query: "white orchid office elegant",
      arabicName: "الأوركيد الأبيض",
      meaning: "احترافية وأناقة ثابتة",
    },
    {
      query: "green succulent arrangement",
      arabicName: "النباتات الخضراء",
      meaning: "نمو مستدام وحيوية",
    },
    { query: "white lily office flowers", arabicName: "الزنبق", meaning: "وضوح الرؤية والثقة" },
    {
      query: "elegant white flowers corporate",
      arabicName: "الزهور البيضاء",
      meaning: "بساطة راقية تليق بالأعمال",
    },
    { query: "purple iris flowers office", arabicName: "السوسن", meaning: "الحكمة والثقة المهنية" },
    {
      query: "green hydrangea arrangement",
      arabicName: "الهيدرانجيا",
      meaning: "الوفرة والنجاح المتواصل",
    },
  ],
  sympathy: [
    {
      query: "white lily sympathy flowers",
      arabicName: "الزنبق الأبيض",
      meaning: "الرحمة ونقاء الروح",
    },
    {
      query: "white rose gentle sympathy",
      arabicName: "الورد الأبيض",
      meaning: "السلام والطمأنينة",
    },
    { query: "purple lavender sympathy", arabicName: "اللافندر", meaning: "الهدوء ومواساة القلب" },
    {
      query: "pale blue flowers soothing",
      arabicName: "الزهور الزرقاء",
      meaning: "الدعم الهادئ في الصعاب",
    },
    {
      query: "white chrysanthemum flowers",
      arabicName: "الأقحوان الأبيض",
      meaning: "الوفاء والذكرى الخالدة",
    },
    {
      query: "soft white flowers gentle",
      arabicName: "الزهور البيضاء",
      meaning: "احترام هادئ وعطف صادق",
    },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────
type FlowerCard = {
  id: string;
  arabicName: string;
  meaning: string;
  imageUrl: string | null;
  loading: boolean;
  photographer?: string;
};

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY ?? "";

async function fetchUnsplashImage(
  query: string,
): Promise<{ url: string; photographer: string } | null> {
  if (!UNSPLASH_KEY) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait&client_id=${UNSPLASH_KEY}`,
      { headers: { "Accept-Version": "v1" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.results?.[0];
    return photo ? { url: photo.urls.regular, photographer: photo.user.name } : null;
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
function OccasionDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const occasion = occasions.find((o) => o.slug === slug);
  const flowersConfig = OCCASION_FLOWERS[slug] ?? OCCASION_FLOWERS.love;

  const [flowers, setFlowers] = useState<FlowerCard[]>(
    flowersConfig.map((f, i) => ({
      id: `${slug}-${i}`,
      arabicName: f.arabicName,
      meaning: f.meaning,
      imageUrl: null,
      loading: true,
    })),
  );
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const headerRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition =
      "opacity .9s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1)";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }),
    );
  }, []);

  // Fetch images from Unsplash
  useEffect(() => {
    flowersConfig.forEach(async (f, i) => {
      const result = await fetchUnsplashImage(f.query);
      setFlowers((prev) =>
        prev.map((card, idx) =>
          idx === i
            ? {
                ...card,
                imageUrl: result?.url ?? null,
                photographer: result?.photographer,
                loading: false,
              }
            : card,
        ),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!occasion) {
    return (
      <Layout>
        <div className="container-luxe py-40 text-center">
          <div className="font-display text-3xl mb-4">لم يتم العثور على المناسبة</div>
          <Link to="/occasions" className="btn-luxe">
            عودة للمناسبات
          </Link>
        </div>
      </Layout>
    );
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Layout>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[55vh] overflow-hidden flex items-end">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={occasion.image}
            alt={occasion.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/30 to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/occasions" })}
          className="absolute top-24 right-6 md:right-12 flex items-center gap-2 text-white/80 hover:text-white transition text-sm border border-white/20 rounded-full px-4 py-2 backdrop-blur-sm hover:border-white/40 z-10"
        >
          <ArrowRight className="w-4 h-4" />
          المناسبات
        </button>

        {/* Header content */}
        <div ref={headerRef} className="relative container-luxe pb-16 pt-32 z-10">
          <div className="eyebrow text-rose-gold mb-4">باقات مختارة</div>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-tight">
            {occasion.name}
          </h1>
          <p className="mt-4 text-white/70 text-lg max-w-lg leading-loose">
            {occasion.desc} — اكتشف أجمل الزهور المناسبة لهذه اللحظة الخاصة
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            <span className="text-xs tracking-[0.25em] text-white/60">
              صور من Unsplash · اختيار بالذكاء الاصطناعي
            </span>
          </div>
        </div>
      </section>

      {/* ─── Flowers Grid ─── */}
      <section className="container-luxe py-20">
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div>
            <div className="eyebrow mb-3">الزهور المقترحة</div>
            <h2 className="font-display text-3xl md:text-4xl">زهور تليق بـ&nbsp;{occasion.name}</h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-lg">
              كل زهرة تحمل معناها الخاص — نسّق منها باقتك المثالية مع فريق أتلييه YasRose.
            </p>
          </div>
          <Link to="/shop" className="btn-luxe shrink-0">
            <ShoppingBag className="w-4 h-4" /> تسوق الآن
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-7">
          {flowers.map((flower, i) => (
            <FlowerCardItem
              key={flower.id}
              flower={flower}
              index={i}
              isWishlisted={wishlist.has(flower.id)}
              onWishlist={() => toggleWishlist(flower.id)}
            />
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-20 relative overflow-hidden rounded-[36px] bg-charcoal text-primary-foreground px-8 py-14 md:p-16">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-gold/20 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-blush/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="eyebrow text-rose-gold mb-3">احجزي باقتك الآن</div>
              <h3 className="font-display text-3xl md:text-4xl">
                نُنسّق لك الباقة المثالية لـ{occasion.name}
              </h3>
              <p className="mt-3 text-primary-foreground/70 text-sm max-w-md">
                فريقنا في الأتلييه جاهز لتصميم باقة مخصصة تحمل روح هذه المناسبة.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link to="/shop" className="btn-luxe !bg-rose-gold !text-white whitespace-nowrap">
                <ShoppingBag className="w-4 h-4" /> تسوقي المجموعة
              </Link>
              <Link
                to="/design"
                className="btn-ghost-luxe !border-white/30 !text-white hover:!bg-white/10 whitespace-nowrap text-center"
              >
                صممي باقتك
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// ─── FlowerCardItem ───────────────────────────────────────────────────────────
function FlowerCardItem({
  flower,
  index,
  isWishlisted,
  onWishlist,
}: {
  flower: FlowerCard;
  index: number;
  isWishlisted: boolean;
  onWishlist: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: `opacity .65s ease ${index * 80}ms, transform .65s ease ${index * 80}ms`,
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-cream shadow-soft/20">
        {flower.loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-rose-gold/30 border-t-rose-gold animate-spin" />
          </div>
        ) : flower.imageUrl ? (
          <img
            src={flower.imageUrl}
            alt={flower.arabicName}
            className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-blush/40 gap-3">
            <div className="text-5xl opacity-50">🌸</div>
            <div className="text-xs text-muted-foreground">{flower.arabicName}</div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent opacity-80" />

        {/* Wishlist button */}
        <button
          onClick={onWishlist}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full grid place-items-center transition-all duration-300 shadow-soft z-10 ${
            isWishlisted
              ? "bg-rose-gold text-white scale-110"
              : "bg-white/20 backdrop-blur text-white hover:bg-rose-gold hover:scale-110"
          }`}
          aria-label={isWishlisted ? "إزالة من المفضلة" : "أضف للمفضلة"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Photographer credit */}
        {flower.photographer && (
          <div className="absolute top-3 right-3 text-[9px] text-white/50 bg-black/20 backdrop-blur rounded-full px-2 py-0.5">
            © {flower.photographer}
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div className="font-display text-xl text-white">{flower.arabicName}</div>
          <div className="text-xs text-white/70 mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {flower.meaning}
          </div>
          <Link
            to="/shop"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-rose-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> اطلبها الآن
          </Link>
        </div>
      </div>

      {/* Below card */}
      <div className="mt-4 px-1">
        <div className="font-display text-base">{flower.arabicName}</div>
        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{flower.meaning}</div>
      </div>
    </div>
  );
}
