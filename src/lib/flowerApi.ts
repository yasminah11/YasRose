/**
 * ═══════════════════════════════════════════════════════════════════
 *  ZOHRA BLOOMS — Flower API Integration
 *  دمج مصادر بيانات الزهور
 * ═══════════════════════════════════════════════════════════════════
 *
 *  الحل الأمثل: دمج ثلاث مصادر مجانية
 *
 *  1. UNSPLASH  — صور عالية الجودة (50 req/hr مجاناً)
 *     → unsplash.com/developers
 *     → VITE_UNSPLASH_KEY=your_key
 *
 *  2. PERENUAL  — بيانات النباتات: عناية، ألوان، وصف (100 req/day مجاناً)
 *     → perenual.com
 *     → VITE_PERENUAL_KEY=your_key
 *
 *  3. ANTHROPIC CLAUDE AI — توصيات ذكية حقيقية
 *     → anthropic.com
 *     → VITE_ANTHROPIC_KEY غير مطلوب هنا (يُحقن تلقائياً)
 *
 *  لماذا هذا الدمج؟
 *  ✅ Unsplash: أفضل صور مجانية تجارية بدون watermark
 *  ✅ Perenual: أغنى API نباتي مجاني (عناية، ألوان، مواسم)
 *  ✅ Claude AI: ذكاء اصطناعي حقيقي للتوصيات الشخصية
 *
 *  مقارنة الخيارات:
 *  ┌────────────┬──────────┬──────────┬────────────┬──────────┐
 *  │   API      │ صور HQ  │ معلومات  │ معاني      │ مجاني؟   │
 *  ├────────────┼──────────┼──────────┼────────────┼──────────┤
 *  │ Unsplash   │  ✅✅✅  │    ❌    │    ❌      │ ✅ 50/h  │
 *  │ Pexels     │  ✅✅    │    ❌    │    ❌      │ ✅ 200/h │
 *  │ Perenual   │  ✅      │  ✅✅✅  │    ✅      │ ✅ 100/d │
 *  │ Trefle     │  ❌      │  ✅✅    │    ❌      │ ✅ 1k/d  │
 *  │ Wikipedia  │  ✅      │  ✅✅    │    ✅✅    │ ✅ ∞     │
 *  │ Pixabay    │  ✅✅    │    ❌    │    ❌      │ ✅ 5k/h  │
 *  └────────────┴──────────┴──────────┴────────────┴──────────┘
 *
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── Config ────────────────────────────────────────────────────────
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY ?? "";
const PERENUAL_KEY = import.meta.env.VITE_PERENUAL_KEY ?? "";

// Arabic → English flower name mapping
export const FLOWER_EN_MAP: Record<string, string> = {
  "ورد جوري": "rose",
  توليب: "tulip",
  زنبق: "lily",
  فاوانيا: "peony",
  أوركيد: "orchid",
  "عباد الشمس": "sunflower",
  هيدرانجيا: "hydrangea",
  قرنفل: "carnation",
  لافندر: "lavender",
  ياسمين: "jasmine",
  بنفسج: "violet",
};

// ─── Unsplash Types ────────────────────────────────────────────────
export type UnsplashPhoto = {
  id: string;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  alt_description: string | null;
  user: { name: string; username: string };
  links: { download_location: string };
};

/**
 * جلب صورة زهرة واحدة من Unsplash بجودة عالية
 * fetch a high-quality flower image from Unsplash
 */
export async function fetchFlowerImage(
  arabicName: string,
  options: {
    orientation?: "portrait" | "landscape" | "squarish";
    size?: "small" | "regular" | "full";
  } = {},
): Promise<UnsplashPhoto | null> {
  if (!UNSPLASH_KEY || UNSPLASH_KEY === "YOUR_UNSPLASH_KEY") return null;

  const englishName = FLOWER_EN_MAP[arabicName] ?? arabicName;
  const query = `${englishName} flower bouquet`;
  const { orientation = "portrait" } = options;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?` +
        `query=${encodeURIComponent(query)}&` +
        `per_page=1&orientation=${orientation}&` +
        `client_id=${UNSPLASH_KEY}`,
      { headers: { "Accept-Version": "v1" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.results?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * جلب عدة صور زهور من Unsplash
 * fetch multiple flower images (for gallery)
 */
export async function fetchFlowerGallery(arabicName: string, count = 6): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_KEY || UNSPLASH_KEY === "YOUR_UNSPLASH_KEY") return [];

  const englishName = FLOWER_EN_MAP[arabicName] ?? arabicName;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?` +
        `query=${encodeURIComponent(englishName + " flower")}&` +
        `per_page=${count}&client_id=${UNSPLASH_KEY}`,
      { headers: { "Accept-Version": "v1" } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.results ?? [];
  } catch {
    return [];
  }
}

// ─── Perenual Types ────────────────────────────────────────────────
export type PerenualSpecies = {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  watering: string;
  sunlight: string[];
  cycle: string;
  default_image?: {
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  };
  flower?: {
    color: string[];
    bloom_season: string;
  };
};

export type PlantInfo = {
  commonName: string;
  scientificName: string;
  watering: string;
  sunlight: string;
  cycle: string;
  flowerColors: string[];
  bloomSeason: string;
  imageUrl: string | null;
  careGuide: string; // human-readable Arabic summary
};

/**
 * جلب بيانات نبتة من Perenual (عناية، ألوان، معلومات)
 * fetch plant care data from Perenual
 */
export async function fetchPlantInfo(arabicName: string): Promise<PlantInfo | null> {
  if (!PERENUAL_KEY || PERENUAL_KEY === "YOUR_PERENUAL_KEY") return null;

  const englishName = FLOWER_EN_MAP[arabicName] ?? arabicName;

  try {
    const res = await fetch(
      `https://perenual.com/api/species-list?key=${PERENUAL_KEY}&q=${encodeURIComponent(englishName)}&page=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const plant: PerenualSpecies | undefined = data?.data?.[0];
    if (!plant) return null;

    // Build Arabic care guide
    const wateringAr: Record<string, string> = {
      frequent: "ري متكرر يومياً",
      average: "ري معتدل كل 2-3 أيام",
      minimum: "ري خفيف مرة أسبوعياً",
      none: "لا يحتاج ري",
    };
    const sunlightAr: Record<string, string> = {
      full_sun: "ضوء شمس كامل",
      part_shade: "ضوء جزئي",
      full_shade: "ظل كامل",
      "sun-part_shade": "شمس وظل متقطع",
    };

    const waterText = wateringAr[plant.watering?.toLowerCase() ?? ""] ?? "ري معتدل";
    const sunText = plant.sunlight?.[0]
      ? (sunlightAr[plant.sunlight[0]] ?? plant.sunlight[0])
      : "ضوء غير مباشر";

    return {
      commonName: plant.common_name,
      scientificName: plant.scientific_name?.[0] ?? "",
      watering: plant.watering ?? "average",
      sunlight: plant.sunlight?.[0] ?? "",
      cycle: plant.cycle ?? "",
      flowerColors: plant.flower?.color ?? [],
      bloomSeason: plant.flower?.bloom_season ?? "",
      imageUrl: plant.default_image?.regular_url ?? null,
      careGuide: `${waterText} · ${sunText}${plant.flower?.bloom_season ? ` · موسم التزهير: ${plant.flower.bloom_season}` : ""}`,
    };
  } catch {
    return null;
  }
}

// ─── Combined Flower Data ──────────────────────────────────────────
export type EnrichedFlower = {
  arabicName: string;
  englishName: string;
  image: string | null;
  photographer?: string;
  plantInfo: PlantInfo | null;
  source: "unsplash+perenual" | "unsplash" | "perenual" | "none";
};

/**
 * جلب كل بيانات الزهرة من جميع المصادر معاً
 * fetch all enriched flower data from all sources
 */
export async function fetchEnrichedFlower(arabicName: string): Promise<EnrichedFlower> {
  const [photo, info] = await Promise.all([
    fetchFlowerImage(arabicName),
    fetchPlantInfo(arabicName),
  ]);

  const imageUrl = photo?.urls?.regular ?? info?.imageUrl ?? null;
  const source =
    photo && info ? "unsplash+perenual" : photo ? "unsplash" : info ? "perenual" : "none";

  return {
    arabicName,
    englishName: FLOWER_EN_MAP[arabicName] ?? arabicName,
    image: imageUrl,
    photographer: photo?.user?.name,
    plantInfo: info,
    source,
  };
}

/**
 * جلب بيانات مجموعة زهور
 * fetch enriched data for multiple flowers
 */
export async function fetchFlowersData(arabicNames: string[]): Promise<EnrichedFlower[]> {
  return Promise.all(arabicNames.map(fetchEnrichedFlower));
}
