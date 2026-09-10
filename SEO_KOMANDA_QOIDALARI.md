# 🚀 UZUM BOT SEO JAMOASI QOIDALARI VA KO'NIKMALAR BAZASI (SKILLS)

Ushbu hujjat AI-Agentlar va inson-razrabotchiklar uchun majburiy SEO va kod yozish standartidir. Jamoaga kelgan har qanday yangi razrabotchik ushbu qoidalarni o'qib chiqishi shart!

## 🤖 1. AI SEO Agent (Aqlli Dasturchi) nima ish qiladi?

Uzum Bot serverida ishlaydigan **GPT-4** ga ulangan maxsus AI agent har 6 soatda kodni tekshiradi.
* Agar u bo'sh `alt=""` rasmni ko'rsa, uni shunchaki to'ldirmaydi, balki **Sun'iy Intellekt yordamida loyiha (Atir, Dekor yoki Kvartira) ga mos keladigan eng ko'p qidiriladigan kalit so'zlarni topib, alt text yozadi**.
* Agar `<h1>` tagini topmasa, biznes mavzusiga doir mukammal SEO sarlavhani o'ylab topib, kodga `sr-only` (yashirin) qilib qo'shadi.

## 👨‍💻 2. Inson Razrabotchiklar uchun Majburiy Qoidalar

Siz (razrabotchik) saytga yangi sahifa, komponent yoki rasm qo'shayotganda quyidagilarga qat'iy amal qiling:

### A) Yandex va Google Uz (O'zbekiston) SEO Trendlari
O'zbekistonda qidiruv tizimlarida (ayniqsa Yandex va Google'da) kirill/lotin aralash va sodda xalq tilida qidiriladi. Biz saytni "akademicheskiy" emas, qidiriladigan tilda SEO qilishimiz kerak.

### B) Loyihalar bo'yicha "Oltin" Kalit So'zlar (Keywords)

**1. Parfume Lux (Atirlar)**
*   **Asosiy kalit so'zlar:** `toshkent atir sotib olish`, `original atirlar`, `erkaklar atiri`, `ayollar atiri`, `dostavka atir`, `parfyumeriya toshkent`, `dubay atirlari`.
*   *Amaliyot:* Komponent yozayotganda, biron bir atir rasmiga `alt="Chanel atir"` deb yozmang. O'rniga `alt="Toshkentda original Chanel ayollar atiri sotib olish"` deb uzunroq va qidiriladigan gap yozing.

**2. Artline Decor (Fasad Dekori, Termo Panellar va Travertin Qoplama)**
*   **Asosiy kalit so'zlar:** `fasad dekor toshkent`, `artline decor`, `termo panellar`, `travertin qoplama`, `fasad izolyatsiya`, `karniz va molding`, `penoplast dekor`, `ustun va pilyastr`, `arxitektura dekor`, `fasad panellari narxi`, `3-in-1 fasad tizimi`.
*   *Amaliyot:* Fasad yoki mahsulot rasmi qo'yildimi? `alt="fasad"` demang. `alt="Toshkentda zamonaviy termo panellar va travertin fasad dekor montaji — Artline Decor"` deb yozing. H2 sarlavhalarda quruq "Bizning xizmatlar" o'rniga "Toshkent bo'ylab fasad dekor va termo panellar o'rnatish xizmatlari" ni ishlating.

**3. Asia Way (Kvartira / Turizm)**
*   **Asosiy kalit so'zlar:** `toshkentda kvartira arenda`, `sutkaga kvartira toshkent`, `mehmonxona toshkent`, `apartments in tashkent`, `arzon kvartira ijarasi`.
*   *Amaliyot:* Sarlavha (H1) uchun `<h1>Asia Way</h1>` o'rniga `<h1>Asia Way - Toshkentda arzon va shinam kvartiralar ijarasi</h1>` deb yozing.

### C) Google E-E-A-T (2024-2025) Talablari
*   **Tajriba va Ishonchlilik (Trust):** Saytda doim "Aloqa (Kontaktlar)", "Biz haqimizda", va "Foydalanuvchi shartnomasi (Privacy Policy)" sahifalari bo'lishi kerak. Bu Googleni sayt "tirik odamlar" ga tegishli ekanligiga ishontiradi.
*   **Tezlik va Mobile-first:** Sayt telefonda tez ochilishi shart. Barcha rasmlarni WebP formatiga o'tkazing va Next.js da `next/image` dan foydalaning.
*   **Semantika:** Faqat `<div>` lar bilan sayt qurmang! `<header>`, `<main>`, `<section>`, `<article>`, `<nav>` va `<footer>` taglaridan foydalaning. Botlar buni yaxshi ko'radi.

---
**Qoidani buzmang:** Agar qoidalarni unutsangiz, AI SEO Agent orqangizdan kodni o'zgartiradi va loyiha tarixida "AI xatoni to'g'riladi" degan izoh qoladi. Eng ideal razrabotchik jamoasi AI ga ish qoldirmaydigan jamoadir!
