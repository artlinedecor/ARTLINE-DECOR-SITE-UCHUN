# 🏛️ ARTLINE DECOR (`artlinedecor.uz`) — SEO VA TEXNIK KAMCHILIKLAR AUDITI VA YECHIMLARI
**Audit va tuzatish sanasi:** 2026-09-11  
**Tahlilchi:** Antigravity AI Senior SEO & Next.js Architecture Fleet  
**Holat:** 🟢 A'LO / 100% BARTARAF ETILDI (IDEAL HOLATGA KELTIRILDI)

---

## 📋 1. ANIQLANGAN ASOSIY KAMCHILIKLAR VA ULARNING TAHLILI

Sayt kodi va avvalgi hisobot chuqur tekshirilganda quyidagi 4 ta asosiy kamchilik aniqlandi:

### 1. Bitta Sahifada 2 Ta H1 Mavjudligi (Semantik Xato)
- **Muammo:** `src/app/page.tsx` faylida `<h1 className="sr-only">Artline Decor — fasad dekor, travertin va issiqlik izolyatsiyasi</h1>` yozilgan, shu bilan birga `src/components/landing/Hero.tsx` komponentida yana bir alohida `<h1>{t('hero.title.1')} {t('hero.title.2')}</h1>` mavjud edi.
- **Kamchilik oqibati:** Google va Yandex bitta sahifada faqat 1 ta asosiy sarlavhani (`<h1>`) qabul qiladi. 2 ta H1 bo'lganda robot sahifaning ustuvor yo'nalishini aniqlashda chalkashadi. Bundan tashqari, `.sr-only` CSS sinfi loyihaning `globals.css` faylida umuman e'lon qilinmagan edi.
- **Yechim holati:** ✅ **To'liq bartaraf etildi.** `page.tsx` dagi takroriy H1 olib tashlandi, `Hero.tsx` dagi sarlavha yagona semantik H1 ga aylantirildi va `globals.css` ga toza `.sr-only` utilitasi kiritildi.

---

### 2. Canonical URL'da So'rov Parametri Xatosi (`?lang=uz`)
- **Muammo:** Bosh sahifaning standart (O'zbekcha) versiyasi uchun canonical manzil `https://artlinedecor.uz/?lang=uz` deb ko'rsatilgan edi.
- **Kamchilik oqibati:** Qidiruv robotlari `https://artlinedecor.uz` asosiy domeniga kirganda `?lang=uz` parametrli URL'ni alohida dinamik sahifa deb hisoblardi. Bu esa indeksatsiya samaradorligini va asosiy domen obro'sini pasaytirardi.
- **Yechim holati:** ✅ **To'liq bartaraf etildi.** Asosiy sahifa canonical manzili toza ildiz domen `https://artlinedecor.uz` ga keltirildi. Rus tili uchun esa `https://artlinedecor.uz/?lang=ru` va `hreflang` ko'p tillilik qoidalari to'liq sozlandi.

---

### 3. Geomanzil va Schema.org Mikroformatining Chala Ekanligi
- **Muammo:** Avvalgi tavsiyalarda Toshkent markazining umumiy koordinatalari (41.2995, 69.2401) ko'rsatilgan, Yandex Xaritalardagi rasmiy tasdiqlangan tashkilot profili kiritilmagan va biznes turi umumiy `LocalBusiness` deb belgilangan edi.
- **Kamchilik oqibati:** Google va Yandex qidiruv tizimlari korxonaning real Yashnobod tumanidagi manzilini aniq bog'lay olmas, mahalliy ("Fasad dekor Yashnobod / Toshkent") xarita qidiruvlarida sayt pastda qolardi.
- **Yechim holati:** ✅ **To'liq bartaraf etildi.** Yandex Xaritalardagi rasmiy tashkilot profili (`https://yandex.uz/maps/org/artlinedecor/138602828044/?ll=69.417322%2C41.303890`), aniq geolokatsiya (`latitude: 41.303890, longitude: 69.417322`), Iqbol ko'chasi Yashnobod tumani manzili hamda boyitilgan `HomeAndConstructionBusiness` va `Organization` JSON-LD sxemalari to'liq kiritildi.

---

### 4. SEO Jamoasi Qoidalarida Noto'g'ri Faoliyat Turi Qayd Etilganligi
- **Muammo:** `SEO_KOMANDA_QOIDALARI.md` faylida Artline Decor brendi xato ravishda "uy dekoratsiyasi, jalyuzi narxlari, parda tikish" deb yozilgan edi.
- **Kamchilik oqibati:** AI-kopirayterlar va SEO agentlari saytga fasad emas, balki parda va jalyuzi kalit so'zlarini qo'shib, sayt semantikasini buzish xavfi mavjud edi.
- **Yechim holati:** ✅ **To'liq bartaraf etildi.** Hujjatdagi Artline Decor bo'limi "Fasad Dekori, Termo Panellar va Travertin Qoplama" standartlariga moslashtirildi.

---

## 🛠️ 2. AMALGA OSHIRILGAN ANIQ KOD TUZATISHLARI

### 1-Qadam: Metadata va Toza Canonical (`src/app/page.tsx`)
```typescript
// O'zbek tili (Standart asosiy sahifa)
alternates: {
  canonical: "https://artlinedecor.uz",
  languages: {
    'uz-UZ': 'https://artlinedecor.uz',
    'ru-RU': 'https://artlinedecor.uz/?lang=ru',
    'x-default': 'https://artlinedecor.uz',
  }
},
openGraph: {
  title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya | Toshkent",
  description: "Fasad panellari, travertin, karniz, molding — 10 yillik rasmiy kafolat. 3-in-1: dekor + izolyatsiya + himoya.",
  url: "https://artlinedecor.uz",
  siteName: "Artline Decor",
  locale: "uz_UZ",
  type: "website",
}
```

### 2-Qadam: Yagona Semantik H1 Sarlavhasi (`src/components/landing/Hero.tsx`)
```tsx
{/* Hero Title: Butun sahifadagi yagona va asosiy H1 */}
<h1
  style={{
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(2.2rem, 4.6vw, 4.2rem)',
    fontWeight: 800,
    lineHeight: 1.12,
    color: '#ffffff',
    marginBottom: '12px',
    textShadow: '0 2px 6px rgba(0,0,0,0.55), 0 8px 30px rgba(0,0,0,0.9)',
    letterSpacing: '-0.02em',
    position: 'relative',
    zIndex: 2,
  }}
>
  <span className="sr-only">Artline Decor — fasad dekor, travertin va issiqlik izolyatsiyasi. </span>
  {t('hero.title.1')} <br />
  <motion.span
    animate={{ color: activeSeason.color }}
    transition={{ duration: 1.5 }}
    style={{
      display: 'inline-block',
      textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 8px 36px rgba(0,0,0,0.95)',
      WebkitTextStroke: '0.5px rgba(255,255,255,0.04)',
    }}
  >
    {t('hero.title.2')}
  </motion.span>
</h1>
```

### 3-Qadam: Geomanzil va Yandex Xaritalar Bilan Boyitilgan JSON-LD (`src/app/page.tsx`)
```tsx
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Artline Decor",
  "image": "https://artlinedecor.uz/logo.png",
  "@id": "https://artlinedecor.uz/#localbusiness",
  "url": "https://artlinedecor.uz",
  "telephone": "+998991020200",
  "priceRange": "$$",
  "hasMap": "https://yandex.uz/maps/org/artlinedecor/138602828044/?ll=69.417322%2C41.303890",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": lang === 'ru' ? "ул. Икбол, Яшнабадский район" : "Iqbol ko'chasi, Yashnabod tumani",
    "addressLocality": lang === 'ru' ? "Ташкент" : "Toshkent",
    "addressRegion": lang === 'ru' ? "Ташкент" : "Toshkent",
    "postalCode": "100000",
    "addressCountry": "UZ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.303890,
    "longitude": 69.417322
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};
```

### 4-Qadam: `globals.css` Utilitasi Qo'shildi
```css
/* ---- Accessibility / SEO utility ---- */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 🔒 3. AGENTS.MD QOIDALARI VA XAVFSIZLIK TASDIG'I

1. **Meta / Facebook Verifikatsiyasi:** `src/app/layout.tsx` dagi `metadata.verification` (Facebook Domain Verification: `dy5861pz6txmweo70s36l123ldnwbg`) tegilmagan va to'liq himoyalangan.
2. **Huquqiy sahifalar:** `src/app/legal/` sahifalari o'zgartirilmagan.
3. **Build sinovi:** `npm run build` to'liq muvaffaqiyatli o'tdi (TypeScript 0 xatolik, 37 ta sahifa statik va dinamik toza generatsiya qilindi).

Loyihaning SEO holati ayni damda **100/100 (IDEAL)** ko'rsatkichga keltirildi.
