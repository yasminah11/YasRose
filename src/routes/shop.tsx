import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { products as localProducts } from "@/lib/shop-data";
import { productsApi } from "@/lib/api";
import {
  SlidersHorizontal,
  Grid2X2,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { ShopGridSkeleton } from "@/components/ui/Skeletons";
import { z } from "zod";
import type { Product } from "@/lib/shop-data";

const shopSearchSchema = z.object({
  q: z.string().optional(),
  page: z.number().optional().default(1),
});

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
  head: () => ({
    meta: [
      { title: "المتجر — YasRose" },
      {
        name: "description",
        content: "استعرض مجموعتنا الكاملة من الباقات الفاخرة والعلب الحصرية.",
      },
      { property: "og:title", content: "المتجر — YasRose" },
      { property: "og:description", content: "باقات فاخرة، تنسيق يدوي." },
    ],
  }),
  component: Shop,
});

const PAGE_SIZE = 12;

const PRICE_RANGES = [
  { label: "أقل من ٣٠٠", min: 0, max: 299 },
  { label: "٣٠٠ - ٥٠٠", min: 300, max: 500 },
  { label: "٥٠٠ - ٨٠٠", min: 501, max: 800 },
  { label: "+ ٨٠٠", min: 801, max: Infinity },
];

const CATEGORIES = [...new Set(localProducts.map((p) => p.category))];
const OCCASIONS = [...new Set(localProducts.flatMap((p) => p.occasion))];
const STATUS_OPTS = ["الأكثر مبيعاً", "وصل حديثاً"];

type SortKey = "newest" | "price-asc" | "price-desc" | "bestseller";

// Merge API products with local products, avoiding duplicates
function mergeProducts(local: Product[], apiRaw: unknown[]): Product[] {
  const localSlugs = new Set(local.map((p) => p.slug));
  const apiProducts: Product[] = apiRaw
    .filter((item: unknown) => {
      const p = item as { slug?: string };
      return p.slug && !localSlugs.has(p.slug);
    })
    .map((item: unknown) => {
      const p = item as Record<string, unknown>;
      return {
        slug: String(p.slug ?? ""),
        name: String(p.name ?? ""),
        tagline: String(p.tagline ?? p.description ?? ""),
        price: Number(p.price ?? 0),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
        currency: String(p.currency ?? "ج.م"),
        image: String(p.image ?? p.imageUrl ?? ""),
        gallery: Array.isArray(p.gallery) ? p.gallery.map(String) : [],
        rating: Number(p.rating ?? 4.8),
        reviews: Number(p.reviews ?? 0),
        colors: Array.isArray(p.colors) ? (p.colors as Product["colors"]) : [],
        sizes: Array.isArray(p.sizes)
          ? (p.sizes as Product["sizes"])
          : [{ name: "قياسي", extra: 0 }],
        meaning: String(p.meaning ?? ""),
        description: String(p.description ?? ""),
        category: String(p.category ?? ""),
        occasion: Array.isArray(p.occasion) ? p.occasion.map(String) : [],
        badge: p.badge ? String(p.badge) : undefined,
        bestSeller: Boolean(p.bestSeller),
        isNew: Boolean(p.isNew),
      } as Product;
    });
  return [...local, ...apiProducts];
}

function Shop() {
  const { q, page: currentPage } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const [dense, setDense] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [prices, setPrices] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  // API state
  const [apiProducts, setApiProducts] = useState<unknown[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [apiTotal, setApiTotal] = useState<number | null>(null);

  const [localQ, setLocalQ] = useState(q ?? "");
  useEffect(() => {
    setLocalQ(q ?? "");
  }, [q]);

  // Fetch products from API
  const fetchFromApi = useCallback(async () => {
    setApiLoading(true);
    setApiError(false);
    try {
      const result = await productsApi.list({ limit: 50 });
      const items = Array.isArray(result?.products) ? result.products : [];
      setApiProducts(items);
      setApiTotal(result?.total ?? null);
    } catch {
      setApiError(true);
      setApiProducts([]);
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  // All products merged
  const allProducts = useMemo(() => mergeProducts(localProducts, apiProducts), [apiProducts]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const activeCount =
    prices.length + cats.length + occasions.length + statuses.length + (localQ ? 1 : 0);

  const clearAll = () => {
    setPrices([]);
    setCats([]);
    setOccasions([]);
    setStatuses([]);
    navigate({ search: { q: undefined, page: 1 } });
  };

  const allFiltered = useMemo(() => {
    let list = [...allProducts];

    if (localQ.trim()) {
      const qLower = localQ.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.tagline.toLowerCase().includes(qLower) ||
          p.category.toLowerCase().includes(qLower) ||
          p.occasion.some((o) => o.includes(qLower)),
      );
    }
    if (prices.length) {
      list = list.filter((p) =>
        prices.some((label) => {
          const range = PRICE_RANGES.find((r) => r.label === label);
          return range && p.price >= range.min && p.price <= range.max;
        }),
      );
    }
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (occasions.length) list = list.filter((p) => p.occasion.some((o) => occasions.includes(o)));
    if (statuses.length) {
      list = list.filter(
        (p) =>
          (statuses.includes("الأكثر مبيعاً") && p.bestSeller) ||
          (statuses.includes("وصل حديثاً") && p.isNew),
      );
    }

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "bestseller":
        return list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      default:
        return list;
    }
  }, [allProducts, localQ, prices, cats, occasions, statuses, sort]);

  const totalPages = Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(currentPage ?? 1, 1), totalPages);
  const paginated = allFiltered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goPage = (p: number) =>
    navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, page: p }),
      resetScroll: true,
    });

  useEffect(() => {
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, page: 1 }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, cats, occasions, statuses, sort, localQ]);

  return (
    <Layout>
      <section className="container-luxe pt-8">
        <div className="flex items-end justify-between flex-wrap gap-6 pb-12 border-b border-border">
          <div>
            <div className="eyebrow mb-3">المجموعة</div>
            <h1 className="font-display text-5xl md:text-6xl leading-tight">جميع التصاميم</h1>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <p className="text-muted-foreground max-w-md">
                {allFiltered.length} تصميم
                {activeCount > 0 && <span className="text-rose-gold"> (بعد الفلترة)</span>} مُنسّق
                يدوياً
                {apiTotal !== null && apiProducts.length > 0 && (
                  <span className="text-muted-foreground/60"> · {apiTotal} متاح في المخزون</span>
                )}
              </p>
              {/* API status indicator */}
              {apiLoading && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  جارٍ تحميل المزيد...
                </span>
              )}
              {apiError && (
                <button
                  onClick={fetchFromApi}
                  className="flex items-center gap-1.5 text-xs text-rose-gold border border-rose-gold/30 rounded-full px-3 py-1 hover:bg-rose-gold/5 transition"
                >
                  <RefreshCw className="w-3 h-3" /> إعادة تحميل
                </button>
              )}
              {!apiLoading && !apiError && apiProducts.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 border border-emerald-200 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  مُحدَّث من المتجر
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">ترتيب:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border-b border-border py-1 outline-none focus:border-rose-gold"
            >
              <option value="newest">الأحدث</option>
              <option value="price-desc">السعر: من الأعلى</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="bestseller">الأكثر مبيعاً</option>
            </select>
            <div className="mx-3 h-4 w-px bg-border" />
            <button
              onClick={() => setDense(false)}
              aria-label="عرض واسع"
              aria-pressed={!dense}
              className={`p-2 rounded-full transition ${!dense ? "bg-muted" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden />
            </button>
            <button
              onClick={() => setDense(true)}
              aria-label="عرض كثيف"
              aria-pressed={dense}
              className={`p-2 rounded-full transition ${dense ? "bg-muted" : ""}`}
            >
              <Grid2X2 className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between py-4 border-b border-border mb-2">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-sm border border-border rounded-full px-4 py-2 hover:border-rose-gold transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            تصفية
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-gold text-white text-[10px] grid place-items-center">
                {activeCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">ترتيب:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent border-b border-border py-1 outline-none focus:border-rose-gold text-sm"
            >
              <option value="newest">الأحدث</option>
              <option value="price-desc">الأعلى سعراً</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="bestseller">الأكثر مبيعاً</option>
            </select>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <div className="relative mr-auto w-[85vw] max-w-sm h-full bg-background overflow-y-auto shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background z-10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="font-display text-lg">التصفية</span>
                  {activeCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-gold text-white text-[10px] grid place-items-center">
                      {activeCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-6 flex-1">
                <div>
                  <div className="font-display text-sm mb-3">بحث</div>
                  <input
                    type="search"
                    value={localQ}
                    placeholder="اسم الباقة أو المناسبة..."
                    onChange={(e) => {
                      setLocalQ(e.target.value);
                      navigate({
                        search: (prev: Record<string, unknown>) => ({
                          ...prev,
                          q: e.target.value || undefined,
                        }),
                      });
                    }}
                    className="w-full h-10 px-4 rounded-xl border border-border bg-transparent outline-none focus:border-rose-gold transition text-sm"
                  />
                </div>
                <FilterGroup
                  title="السعر"
                  opts={PRICE_RANGES.map((r) => r.label)}
                  selected={prices}
                  onToggle={(v) => toggle(prices, setPrices, v)}
                />
                <FilterGroup
                  title="نوع الزهرة"
                  opts={CATEGORIES}
                  selected={cats}
                  onToggle={(v) => toggle(cats, setCats, v)}
                />
                <FilterGroup
                  title="المناسبة"
                  opts={OCCASIONS}
                  selected={occasions}
                  onToggle={(v) => toggle(occasions, setOccasions, v)}
                />
                <FilterGroup
                  title="الحالة"
                  opts={STATUS_OPTS}
                  selected={statuses}
                  onToggle={(v) => toggle(statuses, setStatuses, v)}
                />
              </div>
              <div className="p-5 border-t border-border flex gap-3 sticky bottom-0 bg-background">
                {activeCount > 0 && (
                  <button
                    onClick={() => {
                      clearAll();
                      setFilterOpen(false);
                    }}
                    className="flex-1 rounded-full border border-border py-3 text-sm hover:border-rose-gold transition"
                  >
                    مسح الكل
                  </button>
                )}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 rounded-full bg-charcoal text-primary-foreground py-3 text-sm"
                >
                  عرض النتائج ({allFiltered.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-12 py-12">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:block lg:sticky lg:top-28 self-start space-y-8"
            aria-label="الفلاتر"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4" aria-hidden />
                <span className="eyebrow">تصفية</span>
              </div>
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-rose-gold flex items-center gap-1 hover:opacity-70 transition"
                >
                  <X className="w-3 h-3" aria-hidden /> مسح الكل ({activeCount})
                </button>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <div className="font-display text-sm mb-3">بحث</div>
              <input
                type="search"
                value={localQ}
                placeholder="اسم الباقة أو المناسبة..."
                aria-label="بحث في المتجر"
                onChange={(e) => {
                  setLocalQ(e.target.value);
                  navigate({
                    search: (prev: Record<string, unknown>) => ({
                      ...prev,
                      q: e.target.value || undefined,
                    }),
                  });
                }}
                className="w-full h-10 px-4 rounded-xl border border-border bg-transparent outline-none focus:border-rose-gold transition text-sm"
              />
            </div>

            <FilterGroup
              title="السعر"
              opts={PRICE_RANGES.map((r) => r.label)}
              selected={prices}
              onToggle={(v) => toggle(prices, setPrices, v)}
            />
            <FilterGroup
              title="نوع الزهرة"
              opts={CATEGORIES}
              selected={cats}
              onToggle={(v) => toggle(cats, setCats, v)}
            />
            <FilterGroup
              title="المناسبة"
              opts={OCCASIONS}
              selected={occasions}
              onToggle={(v) => toggle(occasions, setOccasions, v)}
            />
            <FilterGroup
              title="الحالة"
              opts={STATUS_OPTS}
              selected={statuses}
              onToggle={(v) => toggle(statuses, setStatuses, v)}
            />
          </aside>

          {/* Products */}
          <div>
            {apiLoading && paginated.length === 0 ? (
              <ShopGridSkeleton />
            ) : paginated.length === 0 ? (
              <div className="text-center py-32">
                <div className="font-display text-2xl mb-3">لا توجد نتائج</div>
                <p className="text-muted-foreground mb-6">
                  جرب تعديل الفلاتر للحصول على نتائج أوسع.
                </p>
                <button onClick={clearAll} className="btn-ghost-luxe">
                  مسح الفلاتر
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-x-8 gap-y-14 ${
                    dense ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {paginated.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="flex items-center justify-center gap-2 mt-16"
                    aria-label="صفحات المتجر"
                  >
                    <button
                      onClick={() => goPage(safePage - 1)}
                      disabled={safePage === 1}
                      aria-label="الصفحة السابقة"
                      className="w-10 h-10 rounded-full border border-border grid place-items-center hover:border-rose-gold transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => goPage(n)}
                        aria-label={`صفحة ${n}`}
                        aria-current={n === safePage ? "page" : undefined}
                        className={`w-10 h-10 rounded-full text-sm font-display transition ${
                          n === safePage
                            ? "bg-charcoal text-primary-foreground"
                            : "border border-border hover:border-rose-gold"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => goPage(safePage + 1)}
                      disabled={safePage === totalPages}
                      aria-label="الصفحة التالية"
                      className="w-10 h-10 rounded-full border border-border grid place-items-center hover:border-rose-gold transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden />
                    </button>
                  </nav>
                )}

                <p className="text-center text-xs text-muted-foreground mt-4">
                  صفحة {safePage} من {totalPages} · {allFiltered.length} منتج
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FilterGroup({
  title,
  opts,
  selected,
  onToggle,
}: {
  title: string;
  opts: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="font-display text-sm mb-4">{title}</legend>
      <div className="space-y-2.5">
        {opts.map((o) => (
          <label
            key={o}
            className="flex items-center gap-3 text-sm cursor-pointer transition hover:text-foreground"
          >
            <input
              type="checkbox"
              checked={selected.includes(o)}
              onChange={() => onToggle(o)}
              className="accent-rose-gold"
              aria-label={o}
            />
            <span
              className={
                selected.includes(o) ? "text-foreground font-medium" : "text-muted-foreground"
              }
            >
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
