---
name: seo-kontent
description: Artline Decor saytiga yangi SEO sahifa/kontent qo'shish. Ishlatish uchun so'zlar - seo, kontent, kalit so'z, sahifa qo'sh, yangi sahifa, landing, FAQ, sitemap, JSON-LD, indekslash, kunlik SEO vazifa, docs/seo-kalitlar.md.
---

# SEO kontent: kuniga bitta sahifa

Qoida: **kuniga bitta** `yo'q` qatorni tanlang, sahifasini yozing, holatini `bor` qiling. Ortiqcha yugurmang.

## Qadamlar
1. `AGENTS.md`, `CLAUDE.md` ni o'qing. Next.js bu loyihada o'zgargan: kod yozishdan oldin
   `node_modules/next/dist/docs/` dagi tegishli qo'llanmani o'qing (`npm ci` kerak bo'lishi mumkin).
2. `docs/seo-kalitlar.md` ni oching. Holati `yo'q` bo'lgan BIR qatorni tanlang (tijoriy intentlar birinchi;
   narx yoki fakt kerak bo'lgan qatorni o'tkazib yuboring va PR'da Dilmuroddan so'rang).
   Tanlangan qatorni `jarayonda` qiling.
3. Sahifa manbasi: `src/lib/service-pages.ts` ichidagi `SERVICE_PAGES` massiviga yangi obyekt qo'shing
   (slug, uz+ru matn, metaTitle, metaDescription, h1, intro, sections, faq, related, blogLinks).
   Marshrut `/xizmatlar/<slug>` (fayl `src/app/xizmatlar/[slug]/page.tsx`) avtomatik ishlaydi,
   sitemap (`src/app/sitemap.ts`) ham ro'yxatdan oladi, footer havolalari ham.
   `date` maydonini bugungi sanaga qo'ying (sitemap lastmod).
4. Faktlar FAQAT repodan: `src/lib/i18n.tsx`, `public/llms.txt`, `src/lib/blog-data.ts`, `src/lib/portfolio-data.ts`, `public/*.webp`.
   **Narx, manzil, telefon, sharh, mijoz nomi, "500+ uy" kabi raqamlarni to'qimang.** Bilmasangiz yozmang.
   Telefon va manzil: faqat repoda borini (+998 99 102 02 00, Iqbol ko'chasi, Yashnabod) ko'chiring.
5. Har sahifada: noyob title va description, **aynan bitta H1**, kamida 3-4 FAQ savol-javob (FAQPage JSON-LD o'zi chiqadi),
   BreadcrumbList (o'zi chiqadi), ichki havolalar (`related` kamida 2 ta, `blogLinks` bo'lsa), rasmga tavsiflovchi alt.
6. Rasm: faqat `public/` ichidagi mavjud rasm. Yangi rasm o'ylab topmang.
7. Kerak bo'lsa blog maqolasidan yangi sahifaga havola qo'shing (`src/lib/blog-data.ts`, oxirgi "Tegishli sahifalar" abzaci).
8. `public/llms.txt` dagi "Sahifalar" ro'yxatiga yangi URL qo'shing.
9. `docs/seo-kalitlar.md` da qatorni `bor` ga o'zgartiring (target page ni haqiqiy URL bilan).
10. `npm run build` o'tishi shart (pastdagi `seo-texnik` ga qarang), keyin commit/push va PR.
    PR matni oddiy o'zbekcha (lotin), "Oldin / Keyin / Qanday / Dilmurod nima qilishi kerak" bo'limlari bilan.
    Dilmurod uchun: yangi URL'larni Search Console'da "Request indexing" qilish.

## Taqiqlar
- `src/app/layout.tsx` dagi `metadata.verification` ga tegmang.
- `src/app/legal/` ga tegmang.
- Dizaynni (CSS, komponent ko'rinishi) o'zgartirmang, mavjud komponentlarni qayta ishlating.
- master'ga to'g'ridan-to'g'ri push qilmang, PR'ni o'zingiz merge qilmang, `--no-verify` ishlatmang.
