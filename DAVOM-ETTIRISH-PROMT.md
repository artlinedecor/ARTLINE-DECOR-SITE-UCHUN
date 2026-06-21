# Artline Decor — Pro 3D / "Wow" Redesign — Davom ettirish uchun promt

> Quyidagi matnni to'liq nusxalab, kod agentiga (Cowork / Claude Code) bering.
> U ishni shu yerdan davom ettiradi.

---

## VAZIFA (agentga)

Sen Next.js loyihasini professional darajaga ko'taradigan frontend muhandisisan.
Loyiha: **`E:\IT loihalar\ArTLINEDECOER`** (Windows, lokal). Sayt — Artline Decor
fasad dekor kompaniyasi uchun landing + dashboard.

Maqsad: saytni zamonaviy 3D va "wow" effektlar bilan boyitish. **Mavjud kontent,
matn va biznes-logikani O'ZGARTIRMA — faqat vizual/interaktiv qatlamni kuchaytir.**

### ISHNI BOSHLASHDAN OLDIN (majburiy)
1. `AGENTS.md` ni o'qi: bu Next.js'ning yangi versiyasi (16.2.6), API'lar farq qiladi —
   kod yozishdan oldin `node_modules/next/dist/docs/` dagi kerakli qo'llanmani o'qi.
2. Loyiha tuzilishi, `package.json`, `src/app/globals.css` va `src/components/` ni o'rgan.
   Mavjud dizayn tizimini (qora fon + amber/copper, Space Grotesk / Plus Jakarta Sans) BUZMA.
3. **Avval `git` holatini tekshir.** Agar `.git/index.lock` mavjud bo'lsa — uni o'chir
   (stale lock). So'ng `feature/pro-3d-redesign` branch'iga o't (u allaqachon yaratilgan):
   `git checkout feature/pro-3d-redesign`. **Hech qachon `master` yoki `main`ga
   to'g'ridan-to'g'ri yozma va merge qilma** — foydalanuvchi o'zi ko'rib merge qiladi.
4. Har bir KATTA o'zgarishdan oldin qisqacha reja ko'rsat va tasdiq kut.

---

## LOYIHA TEXNIK MA'LUMOTLARI

- **Framework:** Next.js `16.2.6` (App Router), React `19.2.4`, TypeScript.
- **Animatsiya:** `framer-motion@^12.40.0` (allaqachon o'rnatilgan, ishlat).
- **Ikonlar:** `lucide-react`. **Grafiklar:** `recharts`. **Drag:** `@dnd-kit`.
- **Stillar:** Tailwind YO'Q. Dizayn `src/app/globals.css` dagi **CSS o'zgaruvchilari**
  asosida. (Eslatma: dastlabki topshiriqda Tailwind v4 + shadcn so'ralgan, lekin
  ular o'rnatilmagan. O'rnatish katta o'zgarish — buni qilishdan oldin alohida reja
  ko'rsat va tasdiq ol. Tavsiya: hozirgi CSS-variable tizimida davom etish.)
- **Build/Dev:** `npm run build`, `npm run dev` (yoki `LOKALHOST-ISHGA-TUSHIRISH.bat`).
  Build'ni FAQAT shu Windows mashinasida ishga tushir (boshqa muhitda mount sekin).

### Dizayn tizimi (globals.css `:root` — shularga rioya qil)
```
--bg-primary:#050811  --bg-secondary:#0a0f1d  --bg-tertiary:#10172b
--accent-gold:#d99a6c  --accent-warm:#f2b58c  --accent-glow:rgba(217,154,108,0.08)
--text-primary:#f3f1ee  --text-secondary:#a0aec0  --text-muted:#5c6b84
--border:rgba(255,255,255,0.05)  --border-gold:rgba(217,154,108,0.2)
--font-heading:'Space Grotesk'  --font-body:'Plus Jakarta Sans'  --font-mono:'JetBrains Mono'
--transition:0.22s cubic-bezier(0.16,1,0.3,1)
```
Mavjud sinflar: `.glass-card`, `.btn/.btn-primary/.btn-outline`, `.badge`, `.hero`,
`.portfolio-card`, `.trust-card`, `.stat-card`, `.video-card` va h.k.

---

## ALLAQACHON QILINGAN ISHLAR (tekshir, takrorlamA)

Quyidagi fayllar yaratilgan va ishlamoqda — ularni asos qilib davom et:

**Yangi fayllar:**
- `src/lib/use-fancy-effects.ts` — `useFancyEffects()` (fine-pointer + reduced-motion
  tekshiradi) va `usePrefersReducedMotion()` hooklari.
- `src/components/effects/CursorGlow.tsx` — butun sahifa bo'ylab yumshoq kursor
  yoritqichi (rAF + translate3d, `mix-blend-mode:screen`). Mobil/reduced-motion'da o'chadi.
- `src/components/effects/TiltCard.tsx` — qayta ishlatiluvchi 3D tilt + glare wrapper.
  Props: `max`, `scale`, `glare`, `className`, `style`, `onClick`. Sensorli/reduced-motion'da
  oddiy `div`ga aylanadi.
- `src/components/effects/ScrollReveal.tsx` — IntersectionObserver asosidagi scroll-reveal
  (CSS transition; yakuniy holat `transform:none` — fixed overlay'larni buzmaydi).

**Ulangan joylar:**
- `src/app/layout.tsx` — `<CursorGlow />` qo'shilgan.
- `src/app/page.tsx` — Hero'dan keyingi har bo'lim `<ScrollReveal>` bilan o'ralgan.
- `src/components/landing/TrustElements.tsx` — trust kartalar `TiltCard` ichida.
- `src/components/landing/Hero.tsx` — parallax `useFancyEffects()` bilan gate qilingan;
  canvas zarrachalari mobil (`<768px` → 90 ta) va reduced-motion'da yengillashtirilgan.
- `src/components/landing/Portfolio.tsx` — mavjud tilt/glare sensorli ekran va
  reduced-motion'da o'chiriladigan qilingan.
- `src/app/globals.css` — oxiriga "Pro 3D Interaction Layer" bloki qo'shilgan:
  `.cursor-glow*`, `.reveal/.reveal-visible`, `.btn-primary::after` yorug'lik sweep,
  `.stat-card:hover` lift, global `@media (prefers-reduced-motion: reduce)` himoyasi,
  mobil uchun `.cursor-glow-layer` o'chirish.

---

## QOLGAN VAZIFALAR (sen bajarasan)

1. **Build tasdig'i:** `npm run build` ni ishga tushir, har qanday xato/ogohlantirishni
   tuzat. Toza o'tguncha takrorla. (Mavjud kodda TypeScript xatosi bo'lmasligi kerak.)
2. **TiltCard'ni kengaytir** (mavjud dizaynni buzmasdan):
   - `VideoShowcase` / `VideoTestimonials` dagi `.video-card`lar
   - `TrustElements` dagi `.stat-card` raqam kartalari
   - `FAQ` accordion kartalari (yengil `max={4}`)
   - `InteractiveMap` kartalari (agar mos bo'lsa)
   Har birида `position: relative` borligiga ishonch hosil qil (glare uchun).
3. **Hero parallaxни chuqurlashtir:** mavjud qatlamlarга yumshoq, ko'p qatlamli
   (foreground/background turli tezlikda) parallax qo'sh — lekin faqat `useFancyEffects()`
   yoqilganda. Matn va CTA'larни o'qilishini saqlab qol.
4. **Mikro-interaksiyalar:** tugma va kartalar hover'да yengil ko'tarilish + yorug'lik
   (ko'pi `globals.css`да bor — kerak bo'lsa kuchaytir, ortiqcha qilma).
5. **Performance & a11y:** barcha animatsiyalar faqat `transform`/`opacity` (GPU).
   `will-change`ni o'lchovли ishlat. `prefers-reduced-motion` va sensorли qurilmalarда
   og'ir effektlar to'liq o'chsin. Layout shift (CLS) bo'lmasin.
6. **Tekshiruv:** `npm run dev` bilan ishga tushir, asosiy bo'limларни skrinshot qil
   (desktop + mobil), reduced-motion holatини sinab ko'r.

---

## CHEKLOVLAR (qat'iy)

- Matn, kontent, narx, biznes-logika, API'lar — TEGMA. Faqat vizual/interaktiv qatlam.
- `feature/pro-3d-redesign` branch'ида ishla; `master`/`main`ga merge QILMA.
- Har katta o'zgarishдан oldin qisqa reja → tasdiq → keyин kod.
- Har bir o'zgarishдан keyin `npm run build` bilan xatosizликni tasdiqla.
- Restraint: dizайн minimalist va premial qolsин — effektlар "ko'z qamashtiruvчи"
  emas, nafis bo'lsин. Mavjуd amber/copper + obsidian estетикасига sodiq qol.

---

## FOYDALI ESLATMALAR

- `globals.css` ~1300 qator — yangi stilларни faylнинг OXIRIGA qo'sh, mavjудларни buzма.
- Komponентларнинг ko'pi `'use client'`. Yangi interaktив komponентлар ham shунday bo'lsин.
- `framer-motion`да `useMotionValue/useSpring/useTransform` namunаси `TiltCard.tsx` va
  `Portfolio.tsx`да bor — shу uslубни ishlat.
- Server komponент (`page.tsx`, `layout.tsx`)ига client komponентни import qilиш mumkин.
```
