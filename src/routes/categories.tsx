import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { categories } from "@/lib/shop-data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "التصنيفات — YasRose" },
      { name: "description", content: "استعرض التصنيفات: الورد الجوري، الفاوانيا، الأوركيد، والتنسيقات الفاخرة." },
      { property: "og:title", content: "التصنيفات — YasRose" },
      { property: "og:description", content: "ست عائلات من الزهور الفاخرة." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">تصنيفات الدار</div>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            استكشفي عوالم الزهور
          </h1>
          <p className="mt-6 text-muted-foreground leading-loose">
            كل عائلة تحمل جمالها وقصتها. اختر ما يعبّر عن اللحظة التي تريدين احتضانها.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              className={`group relative overflow-hidden rounded-3xl ${i % 5 === 0 ? "md:col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
            >
              <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8 text-primary-foreground">
                <div className="text-xs tracking-[0.25em] uppercase opacity-70">{c.count} قطعة</div>
                <div className="font-display text-3xl md:text-4xl mt-2">{c.name}</div>
                <div className="mt-4 flex items-center gap-2 text-sm tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-500">
                  اكتشف التشكيلة <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
