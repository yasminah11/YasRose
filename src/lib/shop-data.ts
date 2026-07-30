import hero from "@/assets/hero-bouquet.jpg";
import b1 from "@/assets/bouquet-1.jpg";
import b2 from "@/assets/bouquet-2.jpg";
import b3 from "@/assets/bouquet-3.jpg";
import b4 from "@/assets/bouquet-4.jpg";
import flatlay from "@/assets/ambient-flatlay.jpg";
import atelier from "@/assets/atelier.jpg";

export const IMG = { hero, b1, b2, b3, b4, flatlay, atelier };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  currency: string;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  sizes: { name: string; extra: number }[];
  meaning: string;
  description: string;
  category: string;
  occasion: string[];
  badge?: string;
  bestSeller?: boolean;
  isNew?: boolean;
};

export const products: Product[] = [
  {
    slug: "lumiere-rose",
    name: "لوميير روز",
    tagline: "باقة الورد الجوري الفرنسي",
    price: 495,
    oldPrice: 590,
    currency: "ج.م",
    image: IMG.hero,
    gallery: [IMG.hero, IMG.b2, IMG.flatlay],
    rating: 4.9,
    reviews: 218,
    colors: [
      { name: "وردي فاتح", hex: "#F5C6D0" },
      { name: "كريمي", hex: "#F3E7D8" },
      { name: "خمري", hex: "#7A2E3B" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 120 },
      { name: "فاخر", extra: 260 },
    ],
    meaning: "رمز الحب الصافي والامتنان العميق",
    description:
      "تنسيقة استثنائية من الورد الجوري الفرنسي المقطوف يدوياً في ساعات الفجر الأولى، مغلفة بورق فرنسي مطفأ ومربوطة بشريط حرير ذي لمسة ذهبية هادئة.",
    category: "الورد الفرنسي",
    occasion: ["الحب", "المناسبات", "الاعتذار"],
    badge: "الأكثر مبيعاً",
    bestSeller: true,
  },
  {
    slug: "ivoire-jardin",
    name: "إيفوار جاردن",
    tagline: "باقة الورد الأبيض والعاجي",
    price: 380,
    currency: "ج.م",
    image: IMG.b1,
    gallery: [IMG.b1, IMG.flatlay, IMG.hero],
    rating: 4.8,
    reviews: 142,
    colors: [
      { name: "عاجي", hex: "#F3E7D8" },
      { name: "أبيض", hex: "#FFFFFF" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 100 },
    ],
    meaning: "النقاء والبدايات الجديدة",
    description:
      "توليفة راقية من الورد العاجي والأبيض في مزهرية سيراميك بلون النود، تنساب من خلالها أوراق يانعة تمنح المكان هدوءاً استثنائياً.",
    category: "الورد الأبيض",
    occasion: ["الأعراس", "المنزل", "المكتب"],
    isNew: true,
  },
  {
    slug: "rouge-atelier",
    name: "روج أتلييه",
    tagline: "توليفة الورد الجوري الكلاسيكي",
    price: 425,
    oldPrice: 495,
    currency: "ج.م",
    image: IMG.b2,
    gallery: [IMG.b2, IMG.hero, IMG.flatlay],
    rating: 4.9,
    reviews: 176,
    colors: [
      { name: "خمري", hex: "#7A2E3B" },
      { name: "وردي غامق", hex: "#C87086" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 130 },
    ],
    meaning: "الشغف والحب العميق",
    description:
      "تصميم فني يجمع بين درجات الوردي والخمري في تراكيب متقنة، مغلفة بورق كرافت وردي ناعم ومربوطة بشريط حريري بلون الشفق.",
    category: "الورد الجوري",
    occasion: ["الذكرى السنوية", "الحب", "عيد الأم"],
    badge: "خصم 12٪",
  },
  {
    slug: "verde-eucalypt",
    name: "فيردي أوكاليبت",
    tagline: "أوراق الأوكالبتوس والورد الخوخي",
    price: 340,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.flatlay, IMG.hero],
    rating: 4.7,
    reviews: 96,
    colors: [
      { name: "خوخي", hex: "#F5CBB4" },
      { name: "سيج", hex: "#A8B5A2" },
    ],
    sizes: [{ name: "قياسي", extra: 0 }],
    meaning: "التوازن والصفاء الذهني",
    description:
      "تنسيقة طبيعية تستحضر هدوء الحدائق البرية، تجمع بين الورد الخوخي وأوراق الأوكالبتوس الفضية في مزهرية سيراميك سوداء مطفأة.",
    category: "التنسيقات الطبيعية",
    occasion: ["المنزل", "افتتاح الأعمال", "المكتب"],
    isNew: true,
  },
  {
    slug: "phalaenopsis-solo",
    name: "فالينوبسيس سولو",
    tagline: "أوركيدة بيضاء في مزهرية زجاجية",
    price: 260,
    currency: "ج.م",
    image: IMG.b4,
    gallery: [IMG.b4, IMG.flatlay],
    rating: 4.9,
    reviews: 64,
    colors: [{ name: "أبيض", hex: "#FFFFFF" }],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "مزدوج", extra: 190 },
    ],
    meaning: "الأناقة الخالدة والاحترام",
    description:
      "قطعة نحتية من الأوركيد الأبيض تنساب من مزهرية زجاجية شفافة، لتخلق لحظة تأملية تليق بالمساحات الفاخرة.",
    category: "الأوركيد",
    occasion: ["المكتب", "الإهداء الرسمي", "المنزل"],
  },
  {
    slug: "rose-atelier-boite",
    name: "روز أتلييه • علبة",
    tagline: "علبة الورد الطويل بلمسة روز جولد",
    price: 620,
    currency: "ج.م",
    image: IMG.flatlay,
    gallery: [IMG.flatlay, IMG.hero, IMG.b2],
    rating: 5.0,
    reviews: 88,
    colors: [
      { name: "وردي مغبّر", hex: "#E5B7BF" },
      { name: "كريمي", hex: "#F3E7D8" },
    ],
    sizes: [
      { name: "24 وردة", extra: 0 },
      { name: "50 وردة", extra: 350 },
    ],
    meaning: "التقدير الاستثنائي",
    description:
      "علبة توقيع الدار المصنوعة يدوياً بورق مخملي وشريط حرير، تضم وروداً مختارة بعناية من أرقى المزارع الأوروبية.",
    category: "العلب المميزة",
    occasion: ["الذكرى السنوية", "الإهداء الرسمي", "الحب"],
    badge: "توقيع الدار",
    bestSeller: true,
  },
];

export const categories = [
  { slug: "roses", name: "الورد الجوري", count: 42, image: IMG.b2 },
  { slug: "peonies", name: "الفاوانيا", count: 18, image: IMG.hero },
  { slug: "orchids", name: "الأوركيد", count: 12, image: IMG.b4 },
  { slug: "arrangements", name: "التنسيقات الفاخرة", count: 27, image: IMG.b3 },
  { slug: "boxes", name: "علب الهدايا", count: 15, image: IMG.flatlay },
  { slug: "white", name: "الأبيض والعاجي", count: 21, image: IMG.b1 },
];

export const occasions = [
  { slug: "love", name: "الحب والرومانسية", desc: "لحظات تُروى بالورد", image: IMG.hero },
  { slug: "wedding", name: "الأعراس", desc: "تفاصيل تليق بالعمر", image: IMG.b1 },
  { slug: "anniversary", name: "الذكرى السنوية", desc: "احتفاء بالسنوات", image: IMG.b2 },
  { slug: "newborn", name: "المواليد", desc: "استقبال هادئ", image: IMG.b4 },
  { slug: "corporate", name: "الأعمال والمكاتب", desc: "أناقة ثابتة", image: IMG.b3 },
  { slug: "sympathy", name: "المواساة", desc: "برفق وذوق", image: IMG.flatlay },
];

export const findBySlug = (slug: string) => products.find((p) => p.slug === slug);
