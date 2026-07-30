import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { User, Package, Heart, MapPin, LogOut, ChevronLeft, Plus, Pencil, Trash2, Check } from "lucide-react";
import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/lib/schemas";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/site/ProductCard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "الملف الشخصي — YasRose" },
      { name: "description", content: "إدارة حسابك، طلباتك، وعناوينك." },
    ],
  }),
  component: Profile,
});

const TABS = [
  { id: "profile",   label: "الحساب",   icon: User },
  { id: "orders",    label: "طلباتي",   icon: Package },
  { id: "wishlist",  label: "المفضلة",  icon: Heart },
  { id: "addresses", label: "العناوين", icon: MapPin },
];

// Demo orders data (replace with API call when backend is ready)
const DEMO_ORDERS = [
  { id: "FN-2841", status: "قيد التوصيل",  date: "٢٩ يناير ٢٠٢٦", price: "٩١٠ ج.م", active: true },
  { id: "FN-2790", status: "تم التوصيل",   date: "١٥ يناير ٢٠٢٦", price: "٤٩٥ ج.م", active: false },
  { id: "FN-2712", status: "تم التوصيل",   date: "٢ يناير ٢٠٢٦",  price: "٦٢٠ ج.م", active: false },
];

type AddressEntry = AddressFormData & { id: string };

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { user: authUser, isLoading } = useRequireAuth();
  const { items: wishItems } = useWishlist();
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [profileSaved, setProfileSaved] = useState(false);

  // Addresses state (replace with API calls when backend ready)
  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: "1", label: "المنزل",  city: "بني سويف", district: "وسط المدينة", street: "شارع الجمهورية", building: "", isDefault: true },
    { id: "2", label: "المكتب", city: "بني سويف", district: "منطقة الأعمال", street: "برج النيل، شارع جمال عبد الناصر", building: "", isDefault: false },
  ]);
  const [editingAddr, setEditingAddr] = useState<AddressEntry | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.name.split(" ")[0] ?? "",
      lastName:  user?.name.split(" ")[1] ?? "",
      phone:     user?.phone ?? "",
    },
  });

  const addrForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container-luxe py-32 text-center">
          <div className="font-display text-2xl text-muted-foreground">جارٍ التحميل...</div>
        </div>
      </Layout>
    );
  }

  if (!authUser) return null;

  const handleProfileSave = profileForm.handleSubmit((data) => {
    updateUser({ name: `${data.firstName} ${data.lastName}`, phone: data.phone });
    setProfileSaved(true);
    toast.success("تم حفظ التعديلات");
    setTimeout(() => setProfileSaved(false), 2000);
  });

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const openAddAddr = () => {
    setEditingAddr(null);
    addrForm.reset({ label: "", city: "", district: "", street: "", building: "", isDefault: false });
    setShowAddrForm(true);
  };

  const openEditAddr = (addr: AddressEntry) => {
    setEditingAddr(addr);
    addrForm.reset(addr);
    setShowAddrForm(true);
  };

  const saveAddress = addrForm.handleSubmit((data) => {
    const formData: AddressFormData = {
      label:     data.label,
      city:      data.city,
      district:  data.district,
      street:    data.street,
      building:  data.building,
      isDefault: data.isDefault ?? false,
    };
    if (editingAddr) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddr.id ? { ...formData, id: editingAddr.id } : a)),
      );
      toast.success("تم تحديث العنوان");
    } else {
      const newAddr: AddressEntry = { ...formData, id: crypto.randomUUID() };
      setAddresses((prev) => [...prev, newAddr]);
      toast.success("تم إضافة العنوان");
    }
    setShowAddrForm(false);
  });

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.info("تم حذف العنوان");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
    toast.success("تم تعيين العنوان الافتراضي");
  };

  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="border-b border-border pb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow mb-3">أهلاً بعودتك</div>
            <h1 className="font-display text-5xl md:text-6xl">{user?.name}</h1>
            <p className="text-muted-foreground mt-2">
              عضوة الدار منذ {user?.memberSince} · {user?.email}
            </p>
          </div>
          <div className="glass rounded-full px-5 py-2.5 text-sm">
            رصيد نقاط الدار:{" "}
            <span className="font-display text-rose-gold">
              {user?.loyaltyPoints.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-12 py-12">
          <aside>
            <ul className="space-y-1">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm transition ${
                      tab === t.id ? "bg-charcoal text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                    {t.id === "wishlist" && wishItems.length > 0 && (
                      <span className="mr-auto text-xs bg-rose-gold text-white rounded-full w-5 h-5 grid place-items-center">
                        {wishItems.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm hover:bg-muted text-destructive transition"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </aside>

          <div>
            {/* ── Account Info ────────────────────────────── */}
            {tab === "profile" && (
              <form onSubmit={handleProfileSave} className="p-10 rounded-3xl border border-border space-y-4">
                <div className="font-display text-2xl mb-2">بيانات الحساب</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <SimpleField label="الاسم الأول" {...profileForm.register("firstName")} />
                  <SimpleField label="اسم العائلة" {...profileForm.register("lastName")} />
                  <SimpleField label="البريد الإلكتروني" value={user?.email ?? ""} disabled />
                  <SimpleField label="الجوال" {...profileForm.register("phone")} />
                </div>
                <button type="submit" className="btn-luxe mt-4">
                  {profileSaved ? "✓ تم الحفظ" : "حفظ التعديلات"}
                </button>
              </form>
            )}

            {/* ── Orders ─────────────────────────────────── */}
            {tab === "orders" && (
              <div className="space-y-4">
                {DEMO_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border border-border flex items-center justify-between flex-wrap gap-4"
                  >
                    <div>
                      <div className="font-display text-lg">#{order.id}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.date}</div>
                    </div>
                    <span
                      className="text-xs tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                      style={{
                        background: order.active
                          ? "var(--blush)"
                          : "color-mix(in oklab, var(--sage,#9cb899) 30%, white)",
                      }}
                    >
                      {order.status}
                    </span>
                    <div className="font-display">{order.price}</div>
                    <Link to="/track" className="btn-ghost-luxe">
                      تفاصيل <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* ── Wishlist ───────────────────────────────── */}
            {tab === "wishlist" && (
              wishItems.length === 0 ? (
                <div className="text-center p-16 rounded-3xl bg-cream">
                  <Heart className="w-10 h-10 mx-auto text-border mb-4" />
                  <div className="font-display text-2xl mt-4">لا توجد عناصر في المفضلة</div>
                  <p className="text-muted-foreground mt-2 mb-6">اضغطي على القلب في أي منتج لحفظه.</p>
                  <Link to="/shop" className="btn-luxe">تصفحي المتجر</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-8">
                  {wishItems.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              )
            )}

            {/* ── Addresses ─────────────────────────────── */}
            {tab === "addresses" && (
              <div className="space-y-6">
                {!showAddrForm ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="p-6 rounded-2xl border border-border relative">
                          {addr.isDefault && (
                            <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase text-rose-gold">
                              افتراضي
                            </span>
                          )}
                          <div className="font-display text-lg">{addr.label}</div>
                          <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {addr.street}، {addr.district}، {addr.city}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-5">
                            <button
                              onClick={() => openEditAddr(addr)}
                              className="btn-ghost-luxe flex items-center gap-1.5 !text-xs"
                            >
                              <Pencil className="w-3 h-3" /> تعديل
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefaultAddress(addr.id)}
                                className="btn-ghost-luxe flex items-center gap-1.5 !text-xs"
                              >
                                <Check className="w-3 h-3" /> تعيين افتراضي
                              </button>
                            )}
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="btn-ghost-luxe flex items-center gap-1.5 !text-xs !text-destructive"
                            >
                              <Trash2 className="w-3 h-3" /> حذف
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={openAddAddr}
                        className="p-6 rounded-2xl border border-dashed border-border hover:border-rose-gold transition text-sm text-muted-foreground flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> إضافة عنوان جديد
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={saveAddress} className="p-8 rounded-3xl border border-border space-y-4" noValidate>
                    <div className="font-display text-xl mb-2">
                      {editingAddr ? "تعديل العنوان" : "عنوان جديد"}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <AddrField label="اسم العنوان (مثال: المنزل)" error={addrForm.formState.errors.label?.message} {...addrForm.register("label")} />
                      <AddrField label="المدينة" error={addrForm.formState.errors.city?.message} {...addrForm.register("city")} />
                      <AddrField label="الحي" error={addrForm.formState.errors.district?.message} {...addrForm.register("district")} />
                      <AddrField label="الشارع" error={addrForm.formState.errors.street?.message} {...addrForm.register("street")} />
                      <AddrField label="رقم المبنى (اختياري)" {...addrForm.register("building")} />
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" className="accent-rose-gold" {...addrForm.register("isDefault")} />
                      تعيين كعنوان افتراضي
                    </label>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="btn-luxe">حفظ العنوان</button>
                      <button type="button" onClick={() => setShowAddrForm(false)} className="btn-ghost-luxe">إلغاء</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

const SimpleField = forwardRef<
  HTMLInputElement,
  { label: string; disabled?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, disabled, ...rest }, ref) => (
  <label className="block">
    <span className="text-xs text-muted-foreground">{label}</span>
    <input
      ref={ref}
      disabled={disabled}
      className="mt-1.5 w-full h-12 px-4 rounded-xl border border-border bg-transparent outline-none focus:border-rose-gold transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      {...rest}
    />
  </label>
));
SimpleField.displayName = "SimpleField";

const AddrField = forwardRef<
  HTMLInputElement,
  { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, error, ...rest }, ref) => (
  <label className="block">
    <span className="text-xs text-muted-foreground">{label}</span>
    <input
      ref={ref}
      aria-invalid={!!error}
      className={`mt-1.5 w-full h-12 px-4 rounded-xl border bg-transparent outline-none focus:border-rose-gold transition text-sm ${
        error ? "border-destructive" : "border-border"
      }`}
      {...rest}
    />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </label>
));
AddrField.displayName = "AddrField";
