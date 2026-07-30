import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { occasions } from "@/lib/shop-data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/occasions")({
  head: () => ({
    meta: [
      { title: "المناسبات — YasRose" },
      { name: "description", content: "زهور مختارة لكل مناسبة: الحب، الأعراس، الذكرى، والمواليد." },
      { property: "og:title", content: "المناسبات — YasRose" },
      { property: "og:description", content: "لكل لحظة زهرتها الخاصة." },
    ],
  }),
  component: Occasions,
});

function Occasions() {
  return (
    <Layout>
      <section className="container-luxe pt-8 pb-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="eyebrow mb-4">المناسبات</div>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">لكل لحظة زهرتها</h1>
          <p className="mt-6 text-muted-foreground leading-loose">
            اختر مناسبتك وستنفتح لك صفحة مخصصة بأجمل الزهور المناسبة لها.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {occasions.map((o, i) => (
            <Link
              key={o.slug}
              to="/occasion/$slug"
              params={{ slug: o.slug }}
              className={`group relative overflow-hidden rounded-3xl text-right transition-all duration-500 hover:scale-[1.02] hover:shadow-luxe ${
                i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/5]"
              }`}
            >
              <img
                src={o.image}
                alt={o.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
                <span className="absolute top-4 right-4 font-display text-[11px] tracking-[0.3em] text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-rose-gold/0 group-hover:bg-rose-gold grid place-items-center transition-all duration-300 scale-75 group-hover:scale-100">
                  <ArrowLeft className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="font-display text-2xl md:text-3xl">{o.name}</div>
                  <div className="text-sm text-white/70 mt-1.5 leading-relaxed">{o.desc}</div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs tracking-[0.15em] text-rose-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    اكتشف الزهور المناسبة <ArrowLeft className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">اضغط على أي مناسبة لعرض الزهور المناسبة لها</p>
        </div>
      </section>
    </Layout>
  );
}
