import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة — YasRose" },
      {
        name: "description",
        content: "إجابات لأكثر الأسئلة تكراراً حول التوصيل، التغليف، والطلبات الخاصة.",
      },
      { property: "og:title", content: "الأسئلة الشائعة — YasRose" },
      { property: "og:description", content: "كل ما تحتاجين معرفته." },
    ],
  }),
  component: FAQ,
});

const groups = [
  {
    title: "الطلبات والتوصيل",
    items: [
      [
        "هل تُوصلون في نفس اليوم؟",
        "نعم، جميع الطلبات المستلمة قبل الساعة ٥ مساءً تُوصل في نفس اليوم داخل بني سويف.",
      ],
      [
        "ما هي مدن التوصيل المتاحة؟",
        "نغطي حالياً بني سويف، القاهرة، المنصورة، وأسيوط. مدن أخرى قريباً.",
      ],
      [
        "هل يمكنني تحديد وقت توصيل معين؟",
        "بالتأكيد، يمكنك اختيار وقت توصيل محدد أثناء إتمام الطلب.",
      ],
    ],
  },
  {
    title: "المنتجات والزهور",
    items: [
      ["كم تدوم الباقة؟", "الزهور طازجة يومياً، وتدوم عادةً من ٥ إلى ٧ أيام مع العناية المناسبة."],
      ["هل يمكنني طلب تصميم مخصص؟", "نعم، يسعدنا استقبال طلباتك المخصصة عبر صفحة تواصل معنا."],
      ["من أين تأتي الزهور؟", "نستوردها ثلاث مرات أسبوعياً من هولندا، إكوادور، وكينيا."],
    ],
  },
  {
    title: "الدفع والإرجاع",
    items: [
      ["ما طرق الدفع المتاحة؟", "بطاقات ائتمانية، مدى، Apple Pay، والدفع عند الاستلام."],
      [
        "ما سياسة الإرجاع؟",
        "نضمن جودة كل باقة. في حال وجود أي خلل، تواصلي معنا خلال ٢٤ ساعة لاستبدالها.",
      ],
    ],
  },
];

function FAQ() {
  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-2xl mx-auto text-center border-b border-border pb-10">
          <div className="eyebrow mb-3">الدعم</div>
          <h1 className="font-display text-5xl md:text-6xl">الأسئلة الشائعة</h1>
        </div>

        <div className="max-w-3xl mx-auto py-16 space-y-16">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="font-display text-2xl mb-6">{g.title}</div>
              <div className="border-t border-border">
                {g.items.map(([q, a]) => (
                  <FAQItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-right"
      >
        <span className="font-display text-lg">{q}</span>
        {open ? (
          <Minus className="w-4 h-4 shrink-0 text-rose-gold" />
        ) : (
          <Plus className="w-4 h-4 shrink-0" />
        )}
      </button>
      <div
        className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden text-muted-foreground leading-loose">{a}</div>
      </div>
    </div>
  );
}
