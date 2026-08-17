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
  // ── الورد الجوري ──────────────────────────────────────────────
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
    slug: "velvet-noir",
    name: "فيلفيت نوار",
    tagline: "ورد جوري بدرجات البرغندي الداكن",
    price: 550,
    currency: "ج.م",
    image: IMG.b2,
    gallery: [IMG.b2, IMG.flatlay, IMG.hero],
    rating: 4.8,
    reviews: 134,
    colors: [
      { name: "بورغندي", hex: "#4A0E1A" },
      { name: "أحمر داكن", hex: "#6B1020" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 150 },
      { name: "فاخر", extra: 300 },
    ],
    meaning: "الغرام الذي لا يُنسى",
    description:
      "باقة استثنائية من ورد البورغندي العميق، تُعبّر عن مشاعر لا تُقاس بالكلمات، مغلفة بعلبة مخملية سوداء بتوقيع ذهبي.",
    category: "الورد الجوري",
    occasion: ["الحب", "الذكرى السنوية"],
    isNew: true,
  },
  {
    slug: "rose-peche",
    name: "روز بيش",
    tagline: "ورد جوري بدرجات الخوخي الناعم",
    price: 360,
    currency: "ج.م",
    image: IMG.hero,
    gallery: [IMG.hero, IMG.b3, IMG.flatlay],
    rating: 4.7,
    reviews: 89,
    colors: [
      { name: "خوخي", hex: "#F5CBB4" },
      { name: "وردي فاتح", hex: "#F9D5D3" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 110 },
    ],
    meaning: "الحنان والرعاية الصادقة",
    description:
      "تنسيقة دافئة من الورد الخوخي الطري، تُهدى للأم والصديقة العزيزة في كل مناسبة تستحق الاحتفال.",
    category: "الورد الجوري",
    occasion: ["عيد الأم", "الصداقة", "المناسبات"],
  },

  // ── الأبيض والعاجي ────────────────────────────────────────────
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
    category: "الأبيض والعاجي",
    occasion: ["الأعراس", "المنزل", "المكتب"],
    isNew: true,
  },
  {
    slug: "blanc-eternel",
    name: "بلان إيترنيل",
    tagline: "باقة بيضاء فاخرة للمناسبات الرسمية",
    price: 440,
    currency: "ج.م",
    image: IMG.b1,
    gallery: [IMG.b1, IMG.flatlay, IMG.atelier],
    rating: 4.9,
    reviews: 67,
    colors: [
      { name: "أبيض ناصع", hex: "#FFFFFF" },
      { name: "أخضر فاتح", hex: "#D4E8C2" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 140 },
    ],
    meaning: "الأناقة الأبدية",
    description:
      "تنسيقة رسمية بامتياز من الورد الأبيض الكبير وأوراق الليمون الخضراء، تُناسب حفلات التخرج والمناسبات الراقية.",
    category: "الأبيض والعاجي",
    occasion: ["التخرج", "الإهداء الرسمي", "الأعراس"],
    badge: "توقيع الدار",
  },
  {
    slug: "neige-douce",
    name: "نيج دوس",
    tagline: "ورد أبيض صغير بطابع ريفي",
    price: 290,
    currency: "ج.م",
    image: IMG.b1,
    gallery: [IMG.b1, IMG.b3, IMG.flatlay],
    rating: 4.6,
    reviews: 54,
    colors: [{ name: "أبيض", hex: "#FFFFFF" }],
    sizes: [{ name: "قياسي", extra: 0 }],
    meaning: "البراءة والبساطة",
    description:
      "باقة صغيرة دافئة من ورد الكوزموس الأبيض وأزهار الكاميل، مثالية للهدية اليومية أو لتزيين طاولة المنزل.",
    category: "الأبيض والعاجي",
    occasion: ["المنزل", "الصداقة", "المواساة"],
  },

  // ── التنسيقات الطبيعية ────────────────────────────────────────
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
    slug: "jungle-bloom",
    name: "جنجل بلوم",
    tagline: "تنسيقة برية بأوراق استوائية",
    price: 410,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.atelier, IMG.flatlay],
    rating: 4.8,
    reviews: 71,
    colors: [
      { name: "أخضر غامق", hex: "#2D5A27" },
      { name: "برتقالي", hex: "#E8855A" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 120 },
    ],
    meaning: "الحيوية والطاقة الإيجابية",
    description:
      "تنسيقة مستوحاة من الغابات الاستوائية، تجمع أوراق الموز والسعفات الخضراء مع زهور البرتقالي الزاهية في إناء فخاري.",
    category: "التنسيقات الطبيعية",
    occasion: ["افتتاح الأعمال", "المنزل", "المكتب"],
  },
  {
    slug: "prairie-wild",
    name: "برايري وايلد",
    tagline: "زهور برية متنوعة بأسلوب بوهيمي",
    price: 275,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.flatlay, IMG.b1],
    rating: 4.6,
    reviews: 43,
    colors: [
      { name: "لافندر", hex: "#C5B4E3" },
      { name: "أصفر", hex: "#F5E17A" },
      { name: "وردي", hex: "#F5C6D0" },
    ],
    sizes: [{ name: "قياسي", extra: 0 }],
    meaning: "الحرية والبهجة الطبيعية",
    description:
      "مزيج ملون من زهور الحقل البرية — الخزامى والبابونج وعباد الشمس الصغير — مُقدَّمة في ورق كرافت بتصميم غير رسمي مرح.",
    category: "التنسيقات الطبيعية",
    occasion: ["الصداقة", "المنزل", "أعياد الميلاد"],
    isNew: true,
  },

  // ── الأوركيد ──────────────────────────────────────────────────
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
    slug: "orchid-violet",
    name: "أوركيد بانفسج",
    tagline: "أوركيدة بنفسجية نادرة في وعاء فخاري",
    price: 310,
    currency: "ج.م",
    image: IMG.b4,
    gallery: [IMG.b4, IMG.atelier, IMG.flatlay],
    rating: 4.8,
    reviews: 48,
    colors: [
      { name: "بنفسجي", hex: "#7B5EA7" },
      { name: "أبيض وبنفسجي", hex: "#C5B4E3" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "مزدوج", extra: 200 },
    ],
    meaning: "التميز والإبداع",
    description:
      "أوركيدة فالينوبسيس بنفسجية اللون في وعاء سيراميك بلون الطين، تُناسب المهندسين والمبدعين ومحبي الاختلاف.",
    category: "الأوركيد",
    occasion: ["المنزل", "الإهداء الرسمي", "المكتب"],
    isNew: true,
  },
  {
    slug: "orchid-cascade",
    name: "أوركيد كاسكيد",
    tagline: "أوركيد متدلٍّ ثلاثي الأفرع",
    price: 480,
    currency: "ج.م",
    image: IMG.b4,
    gallery: [IMG.b4, IMG.flatlay, IMG.b1],
    rating: 5.0,
    reviews: 31,
    colors: [
      { name: "أبيض وبنفسجي", hex: "#C5B4E3" },
      { name: "وردي فاتح", hex: "#F9D5D3" },
    ],
    sizes: [{ name: "ثلاثي", extra: 0 }],
    meaning: "الفخامة والاستدامة",
    description:
      "تحفة من ثلاثة أفرع من الأوركيد المتدلي في وعاء فخاري طويل، تستمر في الازدهار لأشهر طويلة.",
    category: "الأوركيد",
    occasion: ["افتتاح الأعمال", "الإهداء الرسمي", "المنزل"],
    badge: "توقيع الدار",
    bestSeller: true,
  },

  // ── الفاوانيا ─────────────────────────────────────────────────
  {
    slug: "pivoine-ballet",
    name: "بيفوان باليه",
    tagline: "فاوانيا وردية في تنسيقة رومانسية",
    price: 520,
    currency: "ج.م",
    image: IMG.hero,
    gallery: [IMG.hero, IMG.flatlay, IMG.b2],
    rating: 4.9,
    reviews: 112,
    colors: [
      { name: "وردي فاتح", hex: "#F5C6D0" },
      { name: "وردي فوشيا", hex: "#D4547A" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 180 },
    ],
    meaning: "الرومانسية والجمال الأنثوي",
    description:
      "باقة الفاوانيا الوردية الكبيرة في أكثر صورها رومانسية، مُفضَّلة لدى العرائس ومحبي الزهور ذات الرائحة العطرية الزاكية.",
    category: "الفاوانيا",
    occasion: ["الأعراس", "الحب", "عيد الأم"],
    badge: "الأكثر مبيعاً",
    bestSeller: true,
  },
  {
    slug: "pivoine-blanche",
    name: "بيفوان بلانش",
    tagline: "فاوانيا بيضاء لحفلات الزفاف",
    price: 580,
    currency: "ج.م",
    image: IMG.b1,
    gallery: [IMG.b1, IMG.flatlay, IMG.atelier],
    rating: 4.9,
    reviews: 77,
    colors: [
      { name: "أبيض ناصع", hex: "#FFFFFF" },
      { name: "كريمي", hex: "#F3E7D8" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 200 },
      { name: "فاخر", extra: 420 },
    ],
    meaning: "العفاف وبهجة البدايات",
    description:
      "تنسيقة زفافية بامتياز من فاوانيا بيضاء مكتملة الزهور مع أوراق الأوكالبتوس الفضية والشريط الحريري الطويل.",
    category: "الفاوانيا",
    occasion: ["الأعراس", "الإهداء الرسمي"],
  },

  // ── العلب المميزة ─────────────────────────────────────────────
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
  {
    slug: "luxury-black-box",
    name: "بلاك إيديشن",
    tagline: "علبة سوداء فاخرة بورد أحمر",
    price: 750,
    currency: "ج.م",
    image: IMG.flatlay,
    gallery: [IMG.flatlay, IMG.b2, IMG.atelier],
    rating: 5.0,
    reviews: 53,
    colors: [
      { name: "أحمر كلاسيكي", hex: "#C1121F" },
      { name: "أبيض وأسود", hex: "#2B2B2B" },
    ],
    sizes: [
      { name: "12 وردة", extra: 0 },
      { name: "24 وردة", extra: 250 },
      { name: "36 وردة", extra: 550 },
    ],
    meaning: "الفخامة والهيبة",
    description:
      "علبة مخملية سوداء اللون تحتضن أجمل ورد أحمر عالي الجودة، مع ورقة بطاقة شخصية مكتوبة بالخط العربي. هدية مثالية للمديرين وكبار الشخصيات.",
    category: "العلب المميزة",
    occasion: ["الإهداء الرسمي", "الذكرى السنوية", "الحب"],
    badge: "إصدار محدود",
    isNew: true,
  },
  {
    slug: "hat-box-rose",
    name: "هات بوكس",
    tagline: "علبة قبعة مليئة بالورد",
    price: 480,
    currency: "ج.م",
    image: IMG.flatlay,
    gallery: [IMG.flatlay, IMG.b1, IMG.hero],
    rating: 4.8,
    reviews: 65,
    colors: [
      { name: "وردي فاتح", hex: "#F5C6D0" },
      { name: "خمري", hex: "#7A2E3B" },
      { name: "أبيض", hex: "#FFFFFF" },
    ],
    sizes: [
      { name: "صغير (16 وردة)", extra: 0 },
      { name: "كبير (30 وردة)", extra: 220 },
    ],
    meaning: "المفاجأة والبهجة",
    description:
      "علبة قبعة دائرية فاخرة مُبطَّنة بالساتان الحريري، مليئة بورود مختارة تُرتَّب يدوياً في شكل دائري متناسق.",
    category: "العلب المميزة",
    occasion: ["عيد الأم", "أعياد الميلاد", "الحب"],
    bestSeller: true,
  },

  // ── التولبي واللافندر ─────────────────────────────────────────
  {
    slug: "tulipe-pastel",
    name: "تيوليب باستيل",
    tagline: "توليب هولندي بدرجات الباستيل",
    price: 320,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.flatlay, IMG.b1],
    rating: 4.7,
    reviews: 81,
    colors: [
      { name: "أصفر فاتح", hex: "#FFF4C2" },
      { name: "وردي فاتح", hex: "#F9D5D3" },
      { name: "أرجواني فاتح", hex: "#E8DCFF" },
    ],
    sizes: [
      { name: "قياسي (15 زهرة)", extra: 0 },
      { name: "كبير (30 زهرة)", extra: 130 },
    ],
    meaning: "الفرح والتفاؤل",
    description:
      "باقة توليب هولندية الأصل بألوان الربيع الهادئة، تُضفي على المكان بهجةً وإشراقاً لا يُضاهى.",
    category: "التولبي واللافندر",
    occasion: ["المنزل", "أعياد الميلاد", "الصداقة"],
    isNew: true,
  },
  {
    slug: "lavender-fields",
    name: "لافندر فيلدز",
    tagline: "خزامى بروفانسية أصيلة",
    price: 245,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.flatlay, IMG.atelier],
    rating: 4.8,
    reviews: 59,
    colors: [{ name: "بنفسجي فاتح", hex: "#C5B4E3" }],
    sizes: [{ name: "قياسي", extra: 0 }],
    meaning: "الهدوء والسكينة",
    description:
      "أعواد الخزامى البروفانسية الأصيلة ذات العطر الساحر، مُقدَّمة في غلاف كتاني محبوك بشريط بنفسجي، هدية مثالية لمحبي الطبيعة.",
    category: "التولبي واللافندر",
    occasion: ["المنزل", "المواساة", "الصداقة"],
  },
  {
    slug: "tulipe-rouge",
    name: "تيوليب روج",
    tagline: "توليب أحمر حيّ للتعبير عن الحب",
    price: 355,
    currency: "ج.م",
    image: IMG.b3,
    gallery: [IMG.b3, IMG.b2, IMG.flatlay],
    rating: 4.7,
    reviews: 47,
    colors: [
      { name: "أحمر", hex: "#C1121F" },
      { name: "أسود وأحمر", hex: "#8B0000" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير", extra: 120 },
    ],
    meaning: "الحب المتأجج",
    description:
      "توليب أحمر هولندي حيّ يُعبَّأ طازجاً في يوم التسليم، رمز للحب الصادق والمشاعر الجياشة في كل الثقافات.",
    category: "التولبي واللافندر",
    occasion: ["الحب", "الذكرى السنوية", "عيد الأم"],
    badge: "خصم 10٪",
    oldPrice: 395,
  },

  // ── المواليد والأطفال ─────────────────────────────────────────
  {
    slug: "baby-blush",
    name: "بيبي بلاش",
    tagline: "باقة وردية ناعمة للمواليد",
    price: 290,
    currency: "ج.م",
    image: IMG.hero,
    gallery: [IMG.hero, IMG.b1, IMG.flatlay],
    rating: 4.9,
    reviews: 92,
    colors: [
      { name: "وردي بيبي", hex: "#FFD6D6" },
      { name: "أبيض", hex: "#FFFFFF" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير مع هدية", extra: 150 },
    ],
    meaning: "البراءة والبداية الجديدة",
    description:
      "باقة ناعمة بالكامل باللون الوردي الفاتح، مصممة خصيصاً للاحتفاء بقدوم المواليد البنات، ملفوفة بحرير وردي وشريط أبيض.",
    category: "المواليد والأطفال",
    occasion: ["المواليد", "المناسبات"],
    isNew: true,
  },
  {
    slug: "baby-blue",
    name: "بيبي بلو",
    tagline: "باقة زرقاء هادئة للمواليد الذكور",
    price: 290,
    currency: "ج.م",
    image: IMG.b1,
    gallery: [IMG.b1, IMG.flatlay, IMG.atelier],
    rating: 4.9,
    reviews: 74,
    colors: [
      { name: "أزرق سماوي", hex: "#AED9E0" },
      { name: "أبيض", hex: "#FFFFFF" },
    ],
    sizes: [
      { name: "قياسي", extra: 0 },
      { name: "كبير مع هدية", extra: 150 },
    ],
    meaning: "الأمل والمستقبل المشرق",
    description:
      "تنسيقة هادئة بالأزرق السماوي والأبيض، مُختارة بعناية للاحتفاء بالمواليد الذكور، تأتي مع بالونة زرقاء وبطاقة تهنئة.",
    category: "المواليد والأطفال",
    occasion: ["المواليد", "المناسبات"],
  },
];

export const categories = [
  { slug: "roses", name: "الورد الجوري", count: 42, image: IMG.b2 },
  { slug: "peonies", name: "الفاوانيا", count: 18, image: IMG.hero },
  { slug: "orchids", name: "الأوركيد", count: 12, image: IMG.b4 },
  { slug: "arrangements", name: "التنسيقات الطبيعية", count: 27, image: IMG.b3 },
  { slug: "boxes", name: "علب الهدايا", count: 15, image: IMG.flatlay },
  { slug: "white", name: "الأبيض والعاجي", count: 21, image: IMG.b1 },
  { slug: "tulips", name: "التولبي واللافندر", count: 10, image: IMG.b3 },
  { slug: "newborn", name: "المواليد والأطفال", count: 8, image: IMG.hero },
];

export const occasions = [
  { slug: "love", name: "الحب والرومانسية", desc: "لحظات تُروى بالورد", image: IMG.hero },
  { slug: "wedding", name: "الأعراس", desc: "تفاصيل تليق بالعمر", image: IMG.b1 },
  { slug: "anniversary", name: "الذكرى السنوية", desc: "احتفاء بالسنوات", image: IMG.b2 },
  { slug: "newborn", name: "المواليد", desc: "استقبال هادئ", image: IMG.hero },
  { slug: "corporate", name: "الأعمال والمكاتب", desc: "أناقة ثابتة", image: IMG.b3 },
  { slug: "sympathy", name: "المواساة", desc: "برفق وذوق", image: IMG.flatlay },
  { slug: "mothers-day", name: "عيد الأم", desc: "تقدير لا يُعبَّر عنه", image: IMG.hero },
  { slug: "graduation", name: "التخرج", desc: "نجاح يستحق الاحتفال", image: IMG.b1 },
];

export const findBySlug = (slug: string) => products.find((p) => p.slug === slug);
