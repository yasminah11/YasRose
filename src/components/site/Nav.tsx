import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Search, ShoppingBag, User, Menu, X, Truck, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/lib/shop-data";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/categories", label: "التصنيفات" },
  { to: "/occasions", label: "المناسبات" },
  { to: "/design", label: "صمم باقتك", highlight: true },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل" },
];

const announcements = [
  { icon: Truck, text: "توصيل مجاني على الطلبات فوق ٥٠٠ ج.م" },
  { icon: Sparkles, text: "مجموعة ربيع ٢٠٢٦ متاحة الآن — محدود" },
  { icon: Truck, text: "توصيل في نفس اليوم داخل بني سويف" },
];

function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % announcements.length), 4000);
    return () => clearInterval(t);
  }, []);
  const a = announcements[idx];
  return (
    <div className="bg-charcoal text-primary-foreground text-center py-2.5 text-xs tracking-[0.15em] flex items-center justify-center gap-2 transition-all">
      <a.icon className="w-3.5 h-3.5 text-rose-gold shrink-0" />
      <span key={idx} className="animate-fade-in-up inline-block">
        {a.text}
      </span>
    </div>
  );
}

export function Nav({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  const solid = !transparent || scrolled;

  // Client-side search against products
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.occasion.some((o) => o.includes(q)),
      )
      .slice(0, 5);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      setQuery("");
      navigate({ to: "/shop", search: { q: query.trim(), page: 1 } });
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setSearchOpen(false);
    setQuery("");
    navigate({ to: "/product/$slug", params: { slug } });
  };

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 inset-x-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-soft/30"
            : "bg-transparent"
        }`}
      >
        <div
          className="container-luxe flex items-center justify-between h-18"
          style={{ height: "4.5rem" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blush to-rose-gold grid place-items-center text-charcoal font-display text-lg shadow-soft transition-transform duration-500 group-hover:rotate-[20deg]">
              ف
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg tracking-tight">YasRose</div>
              <div className="text-[9px] tracking-[0.32em] text-muted-foreground uppercase hidden sm:block">
                YasRose · Beni Suef
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="التنقل الرئيسي">
            {links.map((l) =>
              l.highlight ? (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-blush to-rose-gold/20 border border-rose-gold/30 text-rose-gold hover:bg-rose-gold hover:text-white transition-all duration-300 font-medium shadow-soft/20"
                  activeProps={{ className: "!bg-rose-gold !text-white border-rose-gold" }}
                >
                  ✦ {l.label}
                </Link>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-foreground/75 hover:text-foreground transition-colors relative after:absolute after:bottom-[-5px] after:right-0 after:h-px after:w-0 hover:after:w-full after:bg-rose-gold after:transition-all after:duration-500"
                  activeProps={{ className: "!text-foreground after:!w-full" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button
              aria-label="بحث"
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2.5 hover:bg-muted rounded-full transition"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist with real count */}
            <Link
              to="/wishlist"
              aria-label="المفضلة"
              className="p-2.5 hover:bg-muted rounded-full transition inline-flex relative"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-rose-gold text-white text-[10px] grid place-items-center font-medium">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Profile / login */}
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              aria-label="حسابي"
              className="p-2.5 hover:bg-muted rounded-full transition inline-flex"
            >
              <User className={`w-[18px] h-[18px] ${isLoggedIn ? "text-rose-gold" : ""}`} />
            </Link>

            {/* Cart with real count */}
            <Link
              to="/cart"
              aria-label="السلة"
              className="p-2.5 hover:bg-muted rounded-full transition relative"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-rose-gold text-white text-[10px] grid place-items-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              aria-label="القائمة"
              className="p-2.5 hover:bg-muted rounded-full transition lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl animate-reveal">
            <div className="container-luxe py-4">
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl mx-auto"
                role="search"
                aria-label="البحث في المتجر"
              >
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحثي عن باقة، مناسبة، أو نوع زهرة..."
                  aria-label="البحث"
                  className="w-full h-12 pr-11 pl-5 rounded-2xl bg-muted border border-border outline-none focus:border-rose-gold transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:text-rose-gold transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Live results */}
              {searchResults.length > 0 ? (
                <ul
                  className="mt-3 max-w-xl mx-auto border border-border rounded-2xl bg-background overflow-hidden shadow-soft divide-y divide-border"
                  role="listbox"
                  aria-label="نتائج البحث"
                >
                  {searchResults.map((p) => (
                    <li key={p.slug}>
                      <button
                        onClick={() => handleSuggestionClick(p.slug)}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-muted transition text-right"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-display text-sm truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.category} · {p.price} {p.currency}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-3 flex gap-2 flex-wrap max-w-xl mx-auto">
                  {["ورد أحمر", "باقة عيد الأم", "علب هدايا", "أوركيد"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="text-xs border border-border rounded-full px-3 py-1.5 hover:border-rose-gold hover:text-rose-gold transition"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl animate-reveal lg:hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
        >
          <div className="container-luxe flex items-center justify-between h-20 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-rose-gold grid place-items-center text-charcoal font-display">
                ف
              </span>
              <div className="font-display text-lg">YasRose</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
              className="p-2.5 hover:bg-muted rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="container-luxe flex flex-col gap-1 mt-8 flex-1">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`text-2xl font-display py-4 border-b border-border/40 flex items-center justify-between group transition-colors ${
                  l.highlight ? "text-rose-gold" : "hover:text-rose-gold"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span>{l.label}</span>
                <span className="text-border text-base group-hover:text-rose-gold transition">
                  ←
                </span>
              </Link>
            ))}
          </nav>
          <div className="container-luxe pb-10 pt-6 border-t border-border/40 mt-6">
            <div className="text-xs text-muted-foreground">📍 بني سويف، مصر</div>
            <div className="text-xs text-muted-foreground mt-1">📞 +20 82 234 5678</div>
          </div>
        </div>
      )}
    </>
  );
}
