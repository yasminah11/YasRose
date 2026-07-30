# YasRose — ملاحظات للمطورين

## هيكل المشروع

```
src/
  routes/      # صفحات التطبيق (TanStack Router file-based routing)
  components/  # مكونات React
  contexts/    # CartContext, AuthContext, WishlistContext
  hooks/       # custom hooks
  lib/         # shop-data, flowerApi
```

## قواعد مهمة

- لا تعدل `routeTree.gen.ts` يدوياً — يتولد تلقائياً
- الـ Contexts الثلاثة محقونة في `__root.tsx`
- كل صفحة تحتاج auth تتحقق من `useAuth().isLoggedIn`
