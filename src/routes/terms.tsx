import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام — YasRose" },
      { name: "description", content: "شروط وأحكام الاستخدام لدى دار YasRose." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-3xl mx-auto py-16">
          <div className="eyebrow mb-4">القانونية</div>
          <h1 className="font-display text-5xl md:text-6xl leading-tight mb-12">
            الشروط والأحكام
          </h1>

          <div className="space-y-10 text-muted-foreground leading-loose">
            <Article title="قبول الشروط">
              باستخدامك لموقع YasRose، توافقين على الالتزام بهذه الشروط والأحكام. إن لم توافقي على أي بند، يُرجى التوقف عن استخدام الموقع.
            </Article>
            <Article title="الطلبات والمدفوعات">
              يُعد طلبك مؤكداً بعد استلام رسالة التأكيد. نحتفظ بحق رفض الطلبات في حالات استثنائية. الأسعار معروضة بالريال السعودي ويشمل ذلك ضريبة القيمة المضافة.
            </Article>
            <Article title="سياسة الإلغاء والاسترجاع">
              يمكن إلغاء الطلب خلال ساعة من الشراء. نظراً لطبيعة المنتجات الطازجة، لا يمكن الاسترجاع بعد التوصيل إلا في حالات العيوب الموثقة. في حالة وجود مشكلة، تواصلي معنا خلال ٢٤ ساعة.
            </Article>
            <Article title="الملكية الفكرية">
              جميع الصور والتصاميم والمحتوى الموجود في الموقع هي ملكية حصرية لدار YasRose ولا يجوز نسخها أو إعادة استخدامها دون إذن كتابي مسبق.
            </Article>
            <Article title="حدود المسؤولية">
              دار YasRose غير مسؤولة عن أي ضرر غير مباشر ناتج عن استخدام موقعنا أو خدماتنا. مسؤوليتنا القصوى محدودة بقيمة الطلب المدفوع.
            </Article>
            <Article title="القانون المطبق">
              تخضع هذه الشروط لأحكام القانون المصري وتختص المحاكم المصرية بالنظر في أي نزاع ينشأ عنها.
            </Article>
            <p className="text-xs text-muted-foreground/60 pt-4 border-t border-border">
              آخر تحديث: يناير ٢٠٢٦ · للاستفسار: hello@yasrose.eg
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground mb-3">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
