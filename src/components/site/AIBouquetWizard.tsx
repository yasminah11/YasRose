import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  ShoppingBag,
  RefreshCw,
  Share2,
  Bookmark,
  Check,
  Star,
  Pencil,
  ImageOff,
} from "lucide-react";
import { products, IMG } from "@/lib/shop-data";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Answers = {
  recipient: string;
  occasion: string;
  budget: number;
  flowers: string[];
  colors: string[];
  style: string;
  delivery: string;
};

type FlowerData = {
  name: string;
  arabicName: string;
  meaning: string;
  occasions: string[];
  care: string;
  colors: string[];
  image: string;
  source: "unsplash" | "perenual" | "local";
};

type AIRec = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
  reviews: number;
  match: number;
  reason: string;
  flowerData?: FlowerData;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const RECIPIENTS = [
  { key: "girlfriend", label: "الحبيبة", emoji: "❤️" },
  { key: "wife", label: "الزوجة", emoji: "💍" },
  { key: "mother", label: "الأم", emoji: "👩" },
  { key: "father", label: "الأب", emoji: "👨" },
  { key: "friend", label: "صديق", emoji: "😊" },
  { key: "teacher", label: "معلم", emoji: "🍎" },
  { key: "family", label: "العائلة", emoji: "👨‍👩‍👧" },
  { key: "colleague", label: "زميل عمل", emoji: "💼" },
];

const OCCASIONS = [
  "عيد ميلاد",
  "ذكرى سنوية",
  "زفاف",
  "تخرج",
  "عيد الحب",
  "عيد الأم",
  "عيد الأب",
  "تهنئة",
  "سلامات",
  "شكر",
  "بدون مناسبة",
];

const FLOWERS = [
  "ورد جوري",
  "توليب",
  "زنبق",
  "فاوانيا",
  "أوركيد",
  "عباد الشمس",
  "هيدرانجيا",
  "قرنفل",
];

const COLORS = [
  { key: "red", label: "أحمر", hex: "#B03A48" },
  { key: "pink", label: "وردي", hex: "#F5C6D0" },
  { key: "white", label: "أبيض", hex: "#F7F3EE" },
  { key: "purple", label: "بنفسجي", hex: "#7B5EA7" },
  { key: "yellow", label: "أصفر", hex: "#E8C36A" },
  { key: "orange", label: "برتقالي", hex: "#E29A6B" },
  { key: "blue", label: "أزرق", hex: "#7BA6C7" },
  { key: "mixed", label: "متنوع", hex: "linear-gradient(135deg,#F5C6D0,#E8C36A,#7BA6C7)" },
];

const STYLES = ["فاخر", "بسيط", "أنيق", "كلاسيكي", "عصري", "رومانسي", "لطيف", "حديقة برية"];
const DELIVERY = ["اليوم", "غداً", "اختر التاريخ"];

const STEP_TITLES = [
  "لمن تُهدي الزهور؟",
  "ما المناسبة؟",
  "ما ميزانيتك؟",
  "الزهور المفضلة",
  "الألوان المفضلة",
  "الأسلوب المفضل",
  "موعد التوصيل",
];

const initial: Answers = {
  recipient: "",
  occasion: "",
  budget: 495,
  flowers: [],
  colors: [],
  style: "",
  delivery: "",
};

// Flower name mapping for API queries (Arabic → English)
const FLOWER_EN: Record<string, string> = {
  "ورد جوري": "rose",
  توليب: "tulip",
  زنبق: "lily",
  فاوانيا: "peony",
  أوركيد: "orchid",
  "عباد الشمس": "sunflower",
  هيدرانجيا: "hydrangea",
  قرنفل: "carnation",
};

// ─────────────────────────────────────────────────────────────────────────────
// API Services
// ─────────────────────────────────────────────────────────────────────────────

// Unsplash — high-quality flower images (free, 50 req/hr)
// Replace YOUR_UNSPLASH_KEY with your actual key from unsplash.com/developers
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY ?? "YOUR_UNSPLASH_KEY";

async function fetchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_KEY || UNSPLASH_KEY === "YOUR_UNSPLASH_KEY") return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " flower bouquet")}&per_page=1&orientation=portrait&client_id=${UNSPLASH_KEY}`,
      { headers: { "Accept-Version": "v1" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

// Perenual — plant info: care, meaning, care guide (free tier: 100 req/day)
// Replace YOUR_PERENUAL_KEY with your actual key from perenual.com
const PERENUAL_KEY = import.meta.env.VITE_PERENUAL_KEY ?? "YOUR_PERENUAL_KEY";

async function fetchPerenualData(flowerName: string): Promise<Partial<FlowerData> | null> {
  if (!PERENUAL_KEY || PERENUAL_KEY === "YOUR_PERENUAL_KEY") return null;
  try {
    const res = await fetch(
      `https://perenual.com/api/species-list?key=${PERENUAL_KEY}&q=${encodeURIComponent(flowerName)}&page=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const plant = data?.data?.[0];
    if (!plant) return null;
    return {
      name: plant.common_name ?? flowerName,
      care:
        [
          plant.watering ? `ري: ${plant.watering}` : null,
          plant.sunlight?.[0] ? `ضوء: ${plant.sunlight[0]}` : null,
        ]
          .filter(Boolean)
          .join(" · ") || "يُنصح بالري المعتدل وضوء غير مباشر",
      colors: plant.flower?.color ?? [],
      image: plant.default_image?.regular_url ?? null,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Anthropic Claude AI — Real recommendation engine
// ─────────────────────────────────────────────────────────────────────────────
async function getAIRecommendations(
  answers: Answers,
  shopProducts: typeof products,
): Promise<AIRec[]> {
  const productSummary = shopProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    currency: p.currency,
    colors: p.colors.map((c) => c.name),
    occasions: p.occasion,
    meaning: p.meaning,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
    category: p.category,
  }));

  const prompt = `أنت مستشار زهور خبير لمتجر "زهرة بلومز" الفاخر. عميل يحتاج توصية باقة زهور.

بيانات العميل:
- المُهدى إليه: ${answers.recipient}
- المناسبة: ${answers.occasion}
- الميزانية: ${answers.budget} ج.م
- الزهور المفضلة: ${answers.flowers.join("، ") || "غير محدد"}
- الألوان المفضلة: ${answers.colors.join("، ") || "غير محدد"}
- الأسلوب: ${answers.style || "غير محدد"}
- موعد التوصيل: ${answers.delivery}

منتجات المتجر المتاحة:
${JSON.stringify(productSummary, null, 2)}

قدّم توصيات بـ 4 منتجات من القائمة أعلاه فقط (استخدم الـ slug الفعلي).
ترتّبها من الأنسب للأقل.

أجب بـ JSON فقط بالشكل التالي (بدون أي نص آخر):
{
  "recommendations": [
    {
      "slug": "...",
      "match": 97,
      "reason": "جملة واحدة باللغة العربية تشرح لماذا هذه الباقة مثالية لهذا الشخص وهذه المناسبة"
    }
  ]
}`;

  // Try Anthropic API first (works without additional key)
  // Falls back to Groq if VITE_GROQ_KEY is set, then to local scoring
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system:
          "أنت مساعد متجر زهور. أجب دائماً بـ JSON فقط بدون أي نص إضافي أو markdown backticks.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) throw new Error(`Anthropic error: ${anthropicRes.status}`);
    const anthropicData = await anthropicRes.json();
    const text = anthropicData.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return parsed.recommendations.map(
      (r: { slug?: string; name?: string; reason?: string; match?: number }) => {
        const product = shopProducts.find((p) => p.slug === r.slug) ?? shopProducts[0];
        return {
          slug: product.slug,
          name: product.name,
          tagline: product.tagline,
          price: product.price,
          currency: product.currency,
          image: product.image,
          rating: product.rating,
          reviews: product.reviews,
          match: r.match ?? 95,
          reason: r.reason ?? "توصية مخصصة لأسلوبك",
        };
      },
    );
  } catch {
    // Groq fallback if key is set
    const groqKey = import.meta.env.VITE_GROQ_KEY ?? "";
    if (groqKey && !groqKey.startsWith("gsk_xxx")) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1000,
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content:
                  "أنت مساعد متجر زهور. أجب دائماً بـ JSON فقط بدون أي نص إضافي أو backticks.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });
        if (!res.ok) throw new Error(`Groq: ${res.status}`);
        const data = await res.json();
        const gtext = data.choices?.[0]?.message?.content ?? "";
        const gparsed = JSON.parse(gtext.replace(/```json|```/g, "").trim());
        return gparsed.recommendations.map(
          (r: { slug?: string; name?: string; reason?: string; match?: number }) => {
            const product = shopProducts.find((p) => p.slug === r.slug) ?? shopProducts[0];
            return {
              slug: product.slug,
              name: product.name,
              tagline: product.tagline,
              price: product.price,
              currency: product.currency,
              image: product.image,
              rating: product.rating,
              reviews: product.reviews,
              match: r.match ?? 95,
              reason: r.reason ?? "توصية مخصصة",
            };
          },
        );
      } catch {
        /* fall to local scoring */
      }
    }
    // Local smart scoring fallback — runs when all APIs unavailable
    {
      // Smart local fallback — scores products without AI
      const occasionMap: Record<string, string[]> = {
        "عيد ميلاد": ["birthday", "celebration", "festive"],
        "ذكرى سنوية": ["anniversary", "love", "romantic"],
        زفاف: ["wedding", "bridal", "ceremony"],
        تخرج: ["graduation", "achievement", "success"],
        "عيد الحب": ["love", "romantic", "valentine"],
        "عيد الأم": ["mother", "appreciation", "gentle"],
        تهنئة: ["celebration", "happy", "joyful"],
        شكر: ["gratitude", "appreciation", "warm"],
      };
      const styleBonus: Record<string, string[]> = {
        فاخر: ["luxury", "premium", "signature"],
        رومانسي: ["romantic", "love", "passion"],
        بسيط: ["simple", "minimal", "classic"],
        أنيق: ["elegant", "chic", "refined"],
      };
      const colorMap: Record<string, string[]> = {
        أحمر: ["red", "crimson", "scarlet"],
        وردي: ["pink", "blush", "rose"],
        أبيض: ["white", "ivory", "cream"],
        بنفسجي: ["purple", "lavender", "violet"],
      };

      const occasionKeywords = occasionMap[answers.occasion] ?? [];
      const styleKeywords = styleBonus[answers.style] ?? [];
      const colorKeywords = answers.colors.flatMap((c) => colorMap[c] ?? [c]);

      return shopProducts
        .map((p) => {
          let score = 60;
          const searchStr =
            `${p.name} ${p.tagline} ${p.meaning} ${p.occasion?.join(" ")}`.toLowerCase();

          // Occasion match
          if (p.occasion?.some((o: string) => answers.occasion.includes(o))) score += 18;
          if (occasionKeywords.some((k) => searchStr.includes(k))) score += 8;

          // Budget match — penalize if over budget
          if (p.price <= answers.budget) score += 12;
          else if (p.price <= answers.budget * 1.2) score += 4;
          else score -= 10;

          // Flower preference
          if (
            answers.flowers.some((f) => {
              const en = FLOWER_EN[f] ?? f;
              return searchStr.includes(en) || searchStr.includes(f);
            })
          )
            score += 10;

          // Color match
          if (
            colorKeywords.some((c) =>
              p.colors?.some(
                (pc: { name?: string; hex?: string }) =>
                  pc.name?.toLowerCase().includes(c) || pc.hex?.toLowerCase().includes(c),
              ),
            )
          )
            score += 8;

          // Style match
          if (styleKeywords.some((k) => searchStr.includes(k))) score += 6;

          // Rating boost
          score += (p.rating - 4) * 4;

          // Build contextual reason
          const reasonParts = [];
          if (p.occasion?.some((o: string) => answers.occasion.includes(o)))
            reasonParts.push(`مثالية لـ${answers.occasion}`);
          if (p.price <= answers.budget) reasonParts.push(`ضمن ميزانيتك`);
          if (answers.style && styleKeywords.some((k) => searchStr.includes(k)))
            reasonParts.push(`تعكس الأسلوب ${answers.style}`);
          reasonParts.push(`مناسبة لـ${answers.recipient}`);

          return {
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            price: p.price,
            currency: p.currency,
            image: p.image,
            rating: p.rating,
            reviews: p.reviews,
            match: Math.min(Math.round(score), 98),
            reason: reasonParts.join(" · "),
          };
        })
        .sort((a, b) => b.match - a.match)
        .slice(0, 4);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Local flower knowledge base (shows when API keys are not configured)
// ─────────────────────────────────────────────────────────────────────────────
const FLOWER_LOCAL: Record<string, { meaning: string; care: string; occasions: string[] }> = {
  "ورد جوري": {
    meaning: "رمز الحب والجمال والعاطفة الصادقة",
    care: "ري كل يومين · ضوء غير مباشر · قطع السيقان قطراً",
    occasions: ["عيد الحب", "ذكرى سنوية", "زفاف"],
  },
  توليب: {
    meaning: "إعلان الحب المثالي والكمال",
    care: "ري معتدل · بارد · بعيد عن الشمس المباشرة",
    occasions: ["عيد الحب", "عيد الأم", "تهنئة"],
  },
  زنبق: {
    meaning: "النقاء والتجديد والأناقة",
    care: "تربة رطبة · ضوء كافٍ · إزالة المتبرة",
    occasions: ["زفاف", "ذكرى سنوية", "عيد الأم"],
  },
  فاوانيا: {
    meaning: "الازدهار والحظ والثراء",
    care: "ري منتظم · ضوء جزئي · لا تزحم في الإناء",
    occasions: ["زفاف", "ذكرى سنوية", "تهنئة"],
  },
  أوركيد: {
    meaning: "الفخامة والغموض والجمال النادر",
    care: "ري مرة أسبوعياً · ضوء غير مباشر · لا تتراكم المياه",
    occasions: ["ذكرى سنوية", "تهنئة", "بدون مناسبة"],
  },
  "عباد الشمس": {
    meaning: "البهجة والتفاؤل والإخلاص",
    care: "ري يومي · ضوء شمس كامل · تربة خصبة",
    occasions: ["تهنئة", "تخرج", "عيد ميلاد"],
  },
  هيدرانجيا: {
    meaning: "الامتنان والوفرة وعمق المشاعر",
    care: "ري وفير · ظل جزئي · رطوبة مرتفعة",
    occasions: ["زفاف", "عيد الأم", "شكر"],
  },
  قرنفل: {
    meaning: "الحب العميق والاحترام والإعجاب",
    care: "ري خفيف · ضوء معتدل · هواء نظيف",
    occasions: ["عيد الأم", "شكر", "تهنئة"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Fetch flower enrichment data (Unsplash image + Perenual info)
// ─────────────────────────────────────────────────────────────────────────────
async function enrichWithFlowerData(flowers: string[]): Promise<FlowerData[]> {
  const primary = flowers[0];
  if (!primary) return [];

  const enName = FLOWER_EN[primary] ?? "rose";
  const local = FLOWER_LOCAL[primary];

  const [img, info] = await Promise.all([fetchUnsplashImage(enName), fetchPerenualData(enName)]);

  return [
    {
      name: enName,
      arabicName: primary,
      meaning: local?.meaning ?? "رمز الجمال والتعبير العاطفي الصادق",
      occasions: local?.occasions ?? ["المناسبات", "الإهداء"],
      care: info?.care ?? local?.care ?? "ري معتدل · ضوء غير مباشر · بعيد عن الحرارة",
      colors: info?.colors ?? [],
      image: img ?? info?.image ?? IMG.hero,
      source: img ? "unsplash" : info?.image ? "perenual" : "local",
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export function AIBouquetWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [phase, setPhase] = useState<"wizard" | "loading" | "results">("wizard");
  const [recs, setRecs] = useState<AIRec[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("نحلل تفضيلاتك...");
  const [flowerData, setFlowerData] = useState<FlowerData[]>([]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const LOAD_MSGS = [
    "نحلل تفضيلاتك...",
    "نفهم أسلوبك...",
    "نبحث في مجموعة الزهور...",
    "الذكاء الاصطناعي يختار لك...",
    "نجلب صور الزهور...",
    "نُحضّر توصياتك الشخصية...",
  ];

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!answers.recipient;
      case 1:
        return !!answers.occasion;
      case 2:
        return answers.budget > 0;
      case 3:
        return answers.flowers.length > 0;
      case 4:
        return answers.colors.length > 0;
      case 5:
        return !!answers.style;
      case 6:
        return !!answers.delivery;
      default:
        return false;
    }
  }, [step, answers]);

  const reset = () => {
    setAnswers(initial);
    setStep(0);
    setPhase("wizard");
    setRecs([]);
    setFlowerData([]);
  };

  const generate = async () => {
    setPhase("loading");
    setLoading(true);

    // Rotate loading messages
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOAD_MSGS.length;
      setLoadMsg(LOAD_MSGS[i]);
    }, 900);

    try {
      // Run AI + flower enrichment in parallel
      const [aiRecs, flData] = await Promise.all([
        getAIRecommendations(answers, products),
        enrichWithFlowerData(answers.flowers),
      ]);

      // Attach flowerData to first rec
      const enriched = aiRecs.map((r, idx) => ({
        ...r,
        flowerData: idx === 0 ? flData[0] : undefined,
      }));

      setRecs(enriched);
      setFlowerData(flData);
    } catch {
      // Should not happen due to fallback, but just in case
      setRecs(
        products.slice(0, 4).map((p, i) => ({
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          price: p.price,
          currency: p.currency,
          image: p.image,
          rating: p.rating,
          reviews: p.reviews,
          match: 95 - i * 4,
          reason: "توصية مناسبة لمناسبتك",
        })),
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
      setPhase("results");
    }
  };

  if (!open) return null;

  const node = (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-charcoal/40 backdrop-blur-md animate-reveal"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative flex-1 flex flex-col bg-cream m-2 sm:m-6 rounded-[28px] overflow-hidden shadow-luxe">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border/60 bg-background/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-rose-gold grid place-items-center">
              <Sparkles className="w-4 h-4 text-charcoal" />
            </span>
            <div>
              <div className="eyebrow text-rose-gold">YasRose AI · مساعد التوصيات</div>
              <div className="font-display text-lg">ذكاء اصطناعي حقيقي لتوصيتك</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="w-10 h-10 grid place-items-center rounded-full hover:bg-blush/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {phase === "wizard" && (
            <WizardBody
              step={step}
              setStep={setStep}
              answers={answers}
              setAnswers={setAnswers}
              canNext={canNext}
              onGenerate={generate}
            />
          )}
          {phase === "loading" && <LoadingBody msg={loadMsg} />}
          {phase === "results" && (
            <ResultsBody
              recs={recs}
              flowerData={flowerData}
              onEdit={() => setPhase("wizard")}
              onRegen={generate}
              onReset={reset}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

// ─────────────────────────────────────────────────────────────────────────────
// Wizard Steps
// ─────────────────────────────────────────────────────────────────────────────
function WizardBody({
  step,
  setStep,
  answers,
  setAnswers,
  canNext,
  onGenerate,
}: {
  step: number;
  setStep: (n: number) => void;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  canNext: boolean;
  onGenerate: () => void;
}) {
  const isLast = step === STEP_TITLES.length - 1;
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
      <StepBar step={step} total={STEP_TITLES.length} />
      <div className="mt-8 text-center">
        <div className="eyebrow mb-3">
          الخطوة {step + 1} من {STEP_TITLES.length}
        </div>
        <h2 className="font-display text-3xl md:text-4xl">{STEP_TITLES[step]}</h2>
      </div>

      <div key={step} className="mt-10 animate-reveal">
        {step === 0 && (
          <Grid cols="grid-cols-2 md:grid-cols-4">
            {RECIPIENTS.map((r) => (
              <OptionCard
                key={r.key}
                active={answers.recipient === r.label}
                onClick={() => setAnswers({ ...answers, recipient: r.label })}
              >
                <div className="text-3xl">{r.emoji}</div>
                <div className="mt-2 font-display">{r.label}</div>
              </OptionCard>
            ))}
          </Grid>
        )}
        {step === 1 && (
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((o) => (
              <Chip
                key={o}
                active={answers.occasion === o}
                onClick={() => setAnswers({ ...answers, occasion: o })}
              >
                {o}
              </Chip>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="max-w-lg mx-auto text-center">
            <div className="font-display text-5xl">
              {answers.budget} <span className="text-lg text-muted-foreground">ج.م</span>
            </div>
            <input
              type="range"
              min={20}
              max={3000}
              step={10}
              value={answers.budget}
              onChange={(e) => setAnswers({ ...answers, budget: Number(e.target.value) })}
              className="w-full mt-8 accent-rose-gold"
              aria-label="الميزانية"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>20 ج.م</span>
              <span>3000 ج.م</span>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-wrap justify-center gap-3">
            {FLOWERS.map((f) => (
              <Chip
                key={f}
                active={answers.flowers.includes(f)}
                onClick={() =>
                  setAnswers({
                    ...answers,
                    flowers: answers.flowers.includes(f)
                      ? answers.flowers.filter((x) => x !== f)
                      : [...answers.flowers, f],
                  })
                }
              >
                {f}
              </Chip>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-wrap justify-center gap-5">
            {COLORS.map((c) => {
              const active = answers.colors.includes(c.label);
              return (
                <button
                  key={c.key}
                  onClick={() =>
                    setAnswers({
                      ...answers,
                      colors: active
                        ? answers.colors.filter((x) => x !== c.label)
                        : [...answers.colors, c.label],
                    })
                  }
                  className="flex flex-col items-center gap-2 group"
                  aria-pressed={active}
                >
                  <span
                    className={`w-16 h-16 rounded-full border-2 transition-all shadow-soft ${active ? "border-rose-gold scale-110" : "border-transparent group-hover:scale-105"}`}
                    style={{ background: c.hex }}
                  />
                  <span className="text-sm">{c.label}</span>
                </button>
              );
            })}
          </div>
        )}
        {step === 5 && (
          <Grid cols="grid-cols-2 md:grid-cols-4">
            {STYLES.map((s) => (
              <OptionCard
                key={s}
                active={answers.style === s}
                onClick={() => setAnswers({ ...answers, style: s })}
              >
                <div className="font-display text-lg">{s}</div>
              </OptionCard>
            ))}
          </Grid>
        )}
        {step === 6 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {DELIVERY.map((d) => (
              <OptionCard
                key={d}
                active={answers.delivery === d}
                onClick={() => setAnswers({ ...answers, delivery: d })}
              >
                <div className="font-display text-lg">{d}</div>
              </OptionCard>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn-ghost-luxe disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowRight className="w-4 h-4" /> السابق
        </button>
        {isLast ? (
          <button
            onClick={onGenerate}
            disabled={!canNext}
            className="btn-luxe disabled:opacity-40 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4" /> أنشئ توصياتي بالذكاء الاصطناعي
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className="btn-luxe disabled:opacity-40 disabled:pointer-events-none"
          >
            التالي <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-rose-gold" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function Grid({ cols, children }: { cols: string; children: React.ReactNode }) {
  return <div className={`grid gap-4 ${cols}`}>{children}</div>;
}

function OptionCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-center min-h-[120px] ${
        active
          ? "border-rose-gold bg-background shadow-soft -translate-y-0.5"
          : "border-border bg-background/60 hover:bg-background hover:-translate-y-0.5"
      }`}
    >
      {active && (
        <span className="absolute top-3 left-3 w-6 h-6 rounded-full bg-rose-gold text-white grid place-items-center">
          <Check className="w-3.5 h-3.5" />
        </span>
      )}
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-5 py-2.5 rounded-full text-sm transition-all border ${
        active
          ? "bg-charcoal text-primary-foreground border-charcoal"
          : "bg-background border-border hover:border-rose-gold"
      }`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading
// ─────────────────────────────────────────────────────────────────────────────
function LoadingBody({ msg }: { msg: string }) {
  return (
    <div className="min-h-full grid place-items-center py-24 px-6">
      <div className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-rose-gold/30" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-gold animate-spin"
            style={{ animationDuration: "1.4s" }}
          />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blush to-rose-gold/40 animate-pulse" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-charcoal" />
        </div>
        <div className="eyebrow mb-3">YasRose AI</div>
        <div key={msg} className="font-display text-2xl animate-reveal">
          {msg}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          الذكاء الاصطناعي يحلل تفضيلاتك ويجلب بيانات الزهور...
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────────────────────────────────────
function ResultsBody({
  recs,
  flowerData,
  onEdit,
  onRegen,
  onReset,
}: {
  recs: AIRec[];
  flowerData: FlowerData[];
  onEdit: () => void;
  onRegen: () => void;
  onReset: () => void;
}) {
  const primaryFlower = flowerData[0];

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
      <div className="text-center mb-10">
        <div className="eyebrow mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-gold" /> توصيات YasRose AI
        </div>
        <h2 className="font-display text-3xl md:text-4xl">اخترنا لك أجمل ما يليق باللحظة</h2>
        <p className="text-muted-foreground mt-3">
          توصيات مُولَّدة بالذكاء الاصطناعي — مبنية على أسلوبك ومناسبتك وميزانيتك
        </p>
      </div>

      {/* Flower Info Card (from Unsplash/Perenual) */}
      {primaryFlower && (
        <div className="mb-8 p-5 rounded-2xl border border-rose-gold/20 bg-blush/20 grid md:grid-cols-[auto_1fr] gap-5 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
            {primaryFlower.image ? (
              <img
                src={primaryFlower.image}
                alt={primaryFlower.arabicName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-muted-foreground/40">
                <ImageOff className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <div className="eyebrow text-rose-gold mb-1">
              معلومات الزهرة ·{" "}
              {primaryFlower.source === "unsplash"
                ? "صورة Unsplash"
                : primaryFlower.source === "perenual"
                  ? "بيانات Perenual"
                  : "مصدر محلي"}
            </div>
            <div className="font-display text-lg">{primaryFlower.arabicName}</div>
            <div className="text-xs text-muted-foreground mt-1">{primaryFlower.care}</div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {recs.map((r) => (
          <article
            key={r.slug}
            className="group relative rounded-3xl overflow-hidden bg-background border border-border/60 hover:shadow-luxe transition-all"
          >
            <div className="grid grid-cols-[1.1fr_1fr]">
              <div className="relative aspect-square overflow-hidden bg-cream">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 glass rounded-full px-3 py-1.5 text-[11px] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-gold" /> {r.match}٪ تطابق
                </span>
              </div>
              <div className="p-5 flex flex-col">
                <div className="font-display text-xl">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{r.tagline}</div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Star className="w-3.5 h-3.5 fill-rose-gold text-rose-gold" /> {r.rating} ·{" "}
                  {r.reviews}
                </div>
                <div className="font-display text-lg mt-3">
                  {r.price} <span className="text-xs text-muted-foreground">{r.currency}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border/60 pt-3">
                  <span className="text-rose-gold">YasRose AI: </span>
                  {r.reason}
                </p>
                <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
                  <button className="btn-luxe !py-2 !text-xs">
                    <ShoppingBag className="w-3.5 h-3.5" /> أضف للسلة
                  </button>
                  <button className="rounded-full py-2 text-xs border border-border hover:border-rose-gold transition">
                    تفاصيل
                  </button>
                  <button className="rounded-full py-2 text-xs border border-border hover:border-rose-gold transition flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> المفضلة
                  </button>
                  <button className="rounded-full py-2 text-xs border border-border hover:border-rose-gold transition">
                    قارن
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onEdit} className="btn-ghost-luxe">
          <Pencil className="w-4 h-4" /> عدّل إجاباتك
        </button>
        <button onClick={onRegen} className="btn-luxe">
          {" "}
          <RefreshCw className="w-4 h-4" /> أنشئ توصيات جديدة
        </button>
        <button onClick={onReset} className="btn-ghost-luxe">
          <Sparkles className="w-4 h-4" /> ابدأ من جديد
        </button>
        <button className="btn-ghost-luxe">
          <Bookmark className="w-4 h-4" /> احفظ
        </button>
        <button className="btn-ghost-luxe">
          <Share2 className="w-4 h-4" /> شارك
        </button>
      </div>
    </div>
  );
}

export const AI_WIZARD_HERO = IMG.hero;
