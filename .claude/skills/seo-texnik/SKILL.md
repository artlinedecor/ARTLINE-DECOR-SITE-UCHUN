---
name: seo-texnik
description: Artline Decor sayti texnik SEO tekshiruvi va xavfsiz o'zgartirish qoidalari. Ishlatish uchun so'zlar - seo, texnik seo, sitemap, JSON-LD, canonical, hreflang, robots, indekslash, build, metadata, h1, schema, structured data.
---

# Texnik SEO: Artline Decor

## Joylashuv xaritasi
- Sitemap: `src/app/sitemap.ts` (blog va `SERVICE_PAGES` dan avtomatik; huquqiy sahifalar qo'lda). Sahifa matni o'zgarganda `SITE_UPDATED` yoki sahifaning `date` ni yangilang. Har buildda `new Date()` bermang.
- Robots: `src/app/robots.ts` (`/dashboard/`, `/api/`, `/portal/` yopiq).
- Sahifalar: bosh sahifa `src/app/page.tsx`, blog `src/app/blog/`, mahsulot/xizmat `src/app/xizmatlar/`.
- Sahifa ma'lumotlari: `src/lib/service-pages.ts`, `src/lib/blog-data.ts`.
- JSON-LD: `src/components/seo/JsonLd.tsx` (`<` ni `<` ga almashtiradi). Ishlatilayotgan turlar:
  WebSite, Organization, HomeAndConstructionBusiness, Product (bosh sahifa); BlogPosting + BreadcrumbList (blog);
  Service + FAQPage + BreadcrumbList (xizmatlar); ItemList + BreadcrumbList (`/xizmatlar`).
- Til: `?lang=ru` qidiruv parametri. Har sahifa `alternates.canonical` va `alternates.languages` (uz-UZ, ru-RU, x-default) beradi.
- Kalit so'zlar rejasi: `docs/seo-kalitlar.md`.

## Har o'zgartirishdan keyin tekshiring
1. Sahifada aynan bitta `<h1>`; title/description noyob; canonical to'g'ri (uz: parametrsiz, ru: `?lang=ru`).
2. JSON-LD sintaksisi to'g'ri, FAQPage savollari sahifada ko'rinib turgan matn bilan bir xil.
3. Yangi sahifa sitemap'da va bosh sahifadan/footer'dan ichki havola oladi.
4. JSX tahrirdan keyin o'zgargan joyni qayta o'qing (ochilish tegi to'liq yopilganini tekshiring).
5. `npm run build` MAJBURIY, push oldidan. Yiqilsa push qilmang. Iloji bo'lsa: `npm start` va
   `curl localhost:3000/sitemap.xml` bilan yangi URL'lar chiqayotganini ko'ring.
6. `npm run lint`: repoda eski xatolar bor (taxminan 75 error), faqat o'zingiz qo'shgan fayllarni tekshiring:
   `npx eslint <fayllar>`.

## Taqiqlar
- `src/app/layout.tsx` dagi `metadata.verification` (Google/Yandex/facebook-domain-verification) ga tegmang.
- `src/app/legal/` (privacy, terms, data-deletion) yo'li va mazmuniga tegmang: Meta App Review'ga bog'liq.
- `git push --no-verify` yo'q; master'ga to'g'ridan-to'g'ri push yo'q; sirlar (token, kalit) commit qilinmaydi.
- Narx/manzil/telefon/sharh to'qimang. Haqiqiy faktlar repoda bor (`public/llms.txt`, `src/lib/i18n.tsx`).

## Kunlik tartib (bitta qator qoidasi)
`docs/seo-kalitlar.md` dan bitta `yo'q` qatorni oling va yuboring. Batafsil qadamlar: `.claude/skills/seo-kontent/SKILL.md`.
Search Console'da indekslash (Request indexing) va sitemap'ni qayta yuborishni faqat Dilmurod qiladi.
