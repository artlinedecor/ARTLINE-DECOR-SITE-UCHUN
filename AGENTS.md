<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Agentlar uchun qoidalar

Bu loyihada ishlaydigan har qanday AI agent quyidagilarga rioya qilishi shart.

## 1. Push oldidan build MAJBURIY

```bash
npm run build
```

Build o'tmasa — **push qilmang**. Kod yozilgani, commit qilingani va "to'g'ri ko'ringani"
yetarli emas. Sintaksis xatolari faqat kompilyatsiyada chiqadi.

Repoda `pre-push` hook o'rnatilgan (`.githooks/pre-push`) — u buni avtomatik tekshiradi
va build yiqilsa pushni to'xtatadi. Hookni `--no-verify` bilan chetlab o'tmang.

**Nima uchun bu qoida bor:** 2026-08-28 da bir agent `<h1>` tegini `<main` ochilish
tegining ichiga joylashtirdi:

```jsx
<main
<h1 className="sr-only">...</h1>     ← JSX buni parse qila olmaydi
>
```

Build tekshirilmagani uchun bu GitHub'ga chiqdi va **production deploylari 11 soat
davomida yiqilib turdi**. Aynan o'sha xato ikkinchi loyihada ham takrorlandi.

## 2. JSX tahrirlashda

Element qo'shayotganda **ochilish tegi to'liq yopilganiga** ishonch hosil qiling:

```jsx
// NOTO'G'RI
<main
<h1>...</h1>
 className="flex-1">

// TO'G'RI
<main className="flex-1">
  <h1>...</h1>
```

Tahrirdan keyin o'zgargan joyni **o'qib chiqing** — faqat "replace muvaffaqiyatli"
degan javobga ishonmang.

## 3. Matn qo'yayotganda

Placeholder yoki papka nomini qoldirmang. Masalan `sr-only` h1 ichiga
`ArTLINEDECOER - Asosiy Sahifa` deb yozish — bu papka nomi, brend emas, va
SEO uchun zarar. Haqiqiy brend nomi: **Artline Decor**.

## 4. Meta / Facebook sozlamalari

`src/app/layout.tsx` dagi `metadata.verification` blokiga tegmang. Unda
`facebook-domain-verification` metategi bor — u Meta biznes verifikatsiyasi uchun
kerak va o'chirilsa domen tasdig'i buziladi.

## 5. Huquqiy sahifalar

`src/app/legal/` ostidagi sahifalar (`privacy`, `terms`, `data-deletion`) Meta App
Review uchun majburiy. Ularning URL'lari Meta App Settings'ga kiritilgan. Yo'lni
o'zgartirmang — o'zgartirsangiz Meta tomonidagi havolalar ham yangilanishi kerak.
