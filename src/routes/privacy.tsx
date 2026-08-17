import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — YasRose" },
      { name: "description", content: "سياسة الخصوصية وحماية البيانات لدى دار YasRose." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <Layout>
      <section className="container-luxe pt-4">
        <div className="max-w-3xl mx-auto py-16">
          <div className="eyebrow mb-4">القانونية</div>
          <h1 className="font-display text-5xl md:text-6xl leading-tight mb-12">سياسة الخصوصية</h1>

          <div className="prose-luxe space-y-10 text-muted-foreground leading-loose">
            <Article title="المعلومات التي نجمعها">
              عند استخدامك لموقع YasRose، نجمع المعلومات التي تقدمينها طوعاً مثل الاسم والبريد
              الإلكتروني ورقم الجوال وعنوان التوصيل عند إتمام الطلب أو إنشاء حساب. نجمع أيضاً بيانات
              استخدام مجهولة الهوية لتحسين تجربتك.
            </Article>
            <Article title="كيف نستخدم معلوماتك">
              نستخدم بياناتك لمعالجة طلباتك، وإرسال تحديثات التوصيل، والتواصل معك بخصوص طلباتك. لن
              نبيع بياناتك أو نشاركها مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.
            </Article>
            <Article title="الكوكيز">
              يستخدم الموقع كوكيز ضرورية للتشغيل مثل الحفاظ على جلسة تسجيل الدخول وسلة التسوق. لا
              نستخدم كوكيز تتبع خارجية.
            </Article>
            <Article title="أمان البيانات">
              نتخذ تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك. جميع معاملات الدفع تتم عبر بوابات
              آمنة مشفرة بتقنية SSL.
            </Article>
            <Article title="حقوقك">
              يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها في أي وقت بالتواصل معنا عبر
              hello@yasrose.eg.
            </Article>
            <Article title="التعديلات على هذه السياسة">
              قد نحدّث هذه السياسة دورياً. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار
              بارز في الموقع.
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
