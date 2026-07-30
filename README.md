# YasRose — دار الزهور الفاخرة

متجر زهور فاخر مبني بـ React + TanStack Start + Tailwind CSS.

## المتطلبات
- Node.js 18+
- npm

## التشغيل المحلي

```bash
# نسخ ملف البيئة
cp .env.example .env
# أضف مفاتيح API في .env

npm install
npm run dev
```

## مفاتيح API

| المفتاح | الاستخدام | رابط الحصول |
|---|---|---|
| `VITE_UNSPLASH_KEY` | صور الزهور الحقيقية | [unsplash.com/developers](https://unsplash.com/developers) |
| `VITE_GROQ_KEY` | توصيات AI (اختياري) | [console.groq.com](https://console.groq.com) |
| `VITE_PERENUAL_KEY` | معلومات النباتات (اختياري) | [perenual.com](https://perenual.com/docs/api) |

## البناء للإنتاج

```bash
npm run build
```

## التقنيات المستخدمة

- **React 19** + **TanStack Router** + **TanStack Start**
- **Tailwind CSS v4**
- **Anthropic Claude AI** — توصيات ذكية
- **Unsplash API** — صور زهور
- **Perenual API** — معلومات النباتات
