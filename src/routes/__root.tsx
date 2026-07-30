import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4" dir="rtl">
      <div className="max-w-md text-center">
        <div className="eyebrow mb-4">404</div>
        <h1 className="font-display text-5xl">هذه الزاوية فارغة</h1>
        <p className="mt-4 text-sm text-muted-foreground leading-loose">
          الصفحة التي تبحث عنها لم تعد متاحة، أو ربما تغيّر مسارها.
        </p>
        <Link to="/" className="btn-luxe mt-8">
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">حدث خطأ غير متوقع</h1>
        <p className="mt-3 text-sm text-muted-foreground">حاولي التحديث أو العودة إلى الرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-luxe"
          >
            المحاولة مرة أخرى
          </button>
          <a href="/" className="btn-ghost-luxe">
            الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YasRose — دار الزهور الفاخرة" },
      {
        name: "description",
        content:
          "دار تنسيق زهور فاخرة في بني سويف. باقات وعلب هدايا مُصممة يدوياً من أرقى المزارع الأوروبية، مع توصيل في نفس اليوم.",
      },
      { name: "author", content: "YasRose" },
      { property: "og:title", content: "YasRose — دار الزهور الفاخرة" },
      { property: "og:description", content: "زهور فاخرة، تنسيق يدوي، توصيل بلمسة استثنائية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Outlet />
            {/* Global Toast Notifications */}
            <Toaster
              position="top-center"
              dir="rtl"
              richColors
              closeButton
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: "var(--font-arabic, 'Alexandria', sans-serif)",
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
