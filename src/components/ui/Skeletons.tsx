// ─── Skeleton primitives ─────────────────────────────────────────
function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-muted animate-pulse rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

// ─── Product Card Skeleton ────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div aria-busy="true" aria-label="جارٍ تحميل المنتج">
      <Bone className="aspect-[4/5] rounded-2xl w-full" />
      <div className="pt-5 space-y-2">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/2" />
        <Bone className="h-4 w-1/3" />
      </div>
    </div>
  );
}

// ─── Shop Grid Skeleton (12 cards) ───────────────────────────────
export function ShopGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="جارٍ تحميل المنتجات"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
      <span className="sr-only">جارٍ التحميل...</span>
    </div>
  );
}

// ─── Product Detail Skeleton ─────────────────────────────────────
export function ProductDetailSkeleton() {
  return (
    <div
      className="grid lg:grid-cols-[1.15fr_1fr] gap-16"
      role="status"
      aria-label="جارٍ تحميل تفاصيل المنتج"
    >
      <Bone className="aspect-[4/5] rounded-3xl w-full" />
      <div className="space-y-4 pt-6">
        <Bone className="h-4 w-24" />
        <Bone className="h-10 w-3/4" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-2/3" />
        <Bone className="h-10 w-1/3 mt-6" />
        <Bone className="h-20 w-full mt-4 rounded-2xl" />
        <div className="flex gap-3 mt-6">
          <Bone className="h-12 flex-1 rounded-full" />
          <Bone className="h-12 w-12 rounded-full" />
        </div>
      </div>
      <span className="sr-only">جارٍ التحميل...</span>
    </div>
  );
}

// ─── Profile Skeleton ─────────────────────────────────────────────
export function ProfileSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="جارٍ تحميل الملف الشخصي">
      <Bone className="h-10 w-1/2" />
      <Bone className="h-4 w-1/3" />
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {[1, 2, 3, 4].map((i) => <Bone key={i} className="h-12 rounded-xl" />)}
      </div>
      <span className="sr-only">جارٍ التحميل...</span>
    </div>
  );
}

// ─── Cart Skeleton ────────────────────────────────────────────────
export function CartItemSkeleton() {
  return (
    <div className="flex gap-6 pb-8 border-b border-border" aria-hidden="true">
      <Bone className="w-32 h-40 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3 pt-2">
        <Bone className="h-4 w-24" />
        <Bone className="h-6 w-1/2" />
        <Bone className="h-4 w-1/3" />
        <Bone className="h-10 w-32 rounded-full mt-4" />
      </div>
    </div>
  );
}
