// ============================================================
// Artline Decor — Portfolio Data
// ============================================================
import type { PortfolioProject, PortfolioStyle } from './types';

export const STYLE_LABELS: Record<PortfolioStyle, { uz: string; ru: string; color: string }> = {
  classic: { uz: 'Klassik', ru: 'Классический', color: '#c0835a' },
  modern:  { uz: 'Zamonaviy', ru: 'Современный', color: '#60a5fa' },
  hitech:  { uz: 'Hi-Tech', ru: 'Хай-тек', color: '#34d399' },
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'klassik-villa-toshkent',
    title: 'Termo Panel Montaji va Klassik Villa — Toshkent',
    location: 'Toshkent, Yunusobod tumani',
    style: 'classic',
    description:
      'G\'isht ustiga to\'g\'ridan-to\'g\'ri termo panel montaj qilish orqali ham hashamatli klassik fasad dizayni yaratilgan, ham bino to\'liq issiqlik va sovuq izolyatsiyasi bilan ta\'minlangan. Zamokli panellar tizimi orqali sovuq ko\'priklar butunlay yo\'qotilgan.',
    completionDays: 12,
    area: 240,
    elementsUsed: ['Termo panel', 'BK-220/2 korniz', 'KL-150 ustunlar', 'PL-80 pilyastrlar'],
    benefits: [
      'Issiqlik izolyatsiyasini 30% ga oshiradi',
      'Ham g\'ishtga, ham suvoq ustiga o\'rnatish mumkin',
      'Termo panellar o\'zaro zamok bo\'lib birlashadi',
      'Yengil va mustahkam, binoga ortiqcha yuk tushirmaydi',
    ],
    images: [
      { src: '/portfolio/1-materyallar.png', alt: 'Ishlatilgan materiallar tarkibi' },
      { src: '/portfolio/termo-panel-montaj.jpg', alt: 'Termo panel montaj qilish jarayoni' },
    ],
    beforeImage: '/portfolio/1-before.jpg',
    afterVideo: '/portfolio/1-after-video.mp4',
    testimonial: {
      name: 'Sherzod Karimov',
      text: 'Artline jamoasi termo panellarni to\'g\'ridan-to\'g\'ri g\'isht ustiga tezda montaj qilib berishdi. Ham uy issiq bo\'ldi, ham ko\'rinishi juda hashamatli!',
      rating: 5,
    },
    featured: true,
  },
  {
    id: 'zamonaviy-villa-samarqand',
    title: 'Zamonaviy Villa — Samarqand',
    location: 'Samarqand, Bogishamol ko\'chasi',
    style: 'modern',
    description:
      'Minimalistik geometrik dizayn bilan qurilgan zamonaviy villa. Oldingi va keyingi holatda ko\'rish mumkinki, fasad bezaklaridan so\'ng bino butunlay yangi qiyofaga kirdi. Toza chiziqlar va oq-kulrang kombinatsiyasi uyni o\'ta hashamatli ko\'rsatadi.',
    completionDays: 8,
    area: 180,
    elementsUsed: ['ML-60 molding', 'ML-25 molding', 'RK-30 rustik panellar'],
    benefits: [
      'Minimal xarajat — maksimal premium effekt',
      'UV nurlariga chidamli akril qoplama',
      'Montaj tezligi: 1 m² / 20 daqiqa',
      'Qishda issiq, yozda salqin saqlaydi',
    ],
    images: [
      { src: '/portfolio/2-after.jpg', alt: 'Zamonaviy villa fasadi — Samarqand' },
    ],
    beforeImage: '/portfolio/2-before.png',
    afterImage: '/portfolio/2-after.jpg',
    testimonial: {
      name: 'Dilnoza Rahimova',
      text: 'Samarqandda bunday sifatli fasad ishlarini qiluvchi topilmas edi. Artline jamoasi Toshkentdan kelib, uyni oldingi holatidan tanib bo\'lmaydigan darajada ajoyib qilib berishdi.',
      rating: 5,
    },
    featured: true,
  },
  {
    id: 'hitech-biznes-markaz',
    title: 'Hi-Tech Biznes Markaz & Termo Panel Texnologiyasi',
    location: 'Toshkent, Mirzo Ulug\'bek tumani',
    style: 'hitech',
    description:
      'Premium tijorat binosi uchun termo panel kesimi va zamok tizimi yordamida o\'rnatilgan mukammal fasad. Termo panel ko\'ndalang kesimida uning mustahkam armaturalangan qatlami va quyuq ko\'pik qatlami yaqqol ko\'rinadi.',
    completionDays: 18,
    area: 520,
    elementsUsed: ['Termo panel razrezi', 'GP-100 geometrik panellar', 'Zamokli panel ulanishi'],
    benefits: [
      'Qalin armaturalangan akril himoya qatlami',
      'Mutloq gidroizolyatsiya va shamol himoyasi',
      'Kechasi yoritish bilan fasad nafis ko\'rinadi',
      '10 yillik kafolat metallar va qoplamalar uchun',
    ],
    images: [
      { src: '/portfolio/hitech-facade.png', alt: 'Hi-Tech biznes markaz — Toshkent' },
      { src: '/portfolio/termo-panel-razrezi.jpg', alt: 'Termo panel ko\'ndalang kesimi' },
      { src: '/portfolio/termo-panel-zamok.png', alt: 'Termo panel zamok tizimi' },
    ],
    testimonial: {
      name: 'Jahongir Aliyev',
      text: 'Biznes markazimiz fasadi uchun termo panellardan foydalandik. Ham energiya tejash darajasi ortdi, ham fasad juda futuristik ko\'rinishga ega bo\'ldi.',
      rating: 5,
    },
    featured: true,
  },
  {
    id: 'klassik-qasr-namangan',
    title: 'Hashamatli Klassik Qasr — Namangan',
    location: 'Namangan, Dehqonobod ko\'chasi',
    style: 'classic',
    description:
      'G\'isht xolatidagi uyni klassik Yevropa qasri ko\'rinishiga keltirgan premium fasad ishi. Loyihaning har bir detali, ustunlar va karnizlar millimetrigacha aniqlikda, ideal darajada tayyorlangan va o\'rnatilgan.',
    completionDays: 22,
    area: 380,
    elementsUsed: [
      'KL-200 Korinf ustunlar', 'BL-90 balyustrada', 'AR-120 archivolt',
      'ZK-30 zamkoviy tosh', 'BK-280 karniz',
    ],
    benefits: [
      'Klassik Yevropa hashamati O\'zbekistonda',
      'G\'ishtdan boshlab yakuniy ideal natijagacha bo\'lgan jarayon',
      'Har bir detal millimetrigacha mukammal ishlangan',
      'Issiqlik izolyatsiya + dekor — 2 in 1',
    ],
    images: [
      { src: '/portfolio/3-after.png', alt: 'Hashamatli qasr yakuniy natijasi' },
      { src: '/portfolio/3-after-detail.png', alt: 'Fasad detallarining ideal ko\'rinishi' },
    ],
    beforeImage: '/portfolio/3-before.png',
    afterImage: '/portfolio/3-after.png',
    testimonial: {
      name: 'Baxtiyor To\'rayev',
      text: 'Uyimning g\'isht devorlarini shunday ajoyib qasrga aylantirishganiga hali ham ishonolmayman. Detallar sifati, chiziqlari mutloq ideal!',
      rating: 5,
    },
    featured: false,
  },
  {
    id: 'modern-townhouse-fergana',
    title: 'Modern Townhouse — Farg\'ona',
    location: 'Farg\'ona, Mustaqllik ko\'chasi',
    style: 'modern',
    description:
      'Ikki qavatli townhouse loyihasining minimal va zamonaviy fasad yechimi. RK-30 rustik panellar va ML-40 moldinglar bilan qurilgan toza, ravshan ko\'rinish. Oq va kulrang ranglar kombinatsiyasi binoga nafislik beradi.',
    completionDays: 6,
    area: 120,
    elementsUsed: ['RK-30 rustik panellar', 'ML-40 molding', 'BK-120 karniz'],
    benefits: [
      'Byudjetga mos narx — $3,600 dan',
      'Tez montaj — 6 kunda tayyor',
      'Qisqa muddat — uzun umr (10 yil kafolat)',
      'Namga va shamolga chidamli',
    ],
    images: [
      { src: '/portfolio/modern-house.png', alt: 'Modern townhouse — Farg\'ona' },
    ],
    featured: false,
  },
  {
    id: 'premium-villa-buxoro',
    title: 'Premium Villa — Buxoro',
    location: 'Buxoro, Navoiy ko\'chasi',
    style: 'classic',
    description:
      'Buxoro shahrining an\'anaviy arxitekturasi bilan zamonaviy fasad dekor texnologiyasini uyg\'unlashtirgan noyob loyiha. BK-220 karniz va KL-150 ustunlar Markaziy Osiyoning o\'ziga xos madaniy ko\'rinishiga yangi nafas beradi.',
    completionDays: 15,
    area: 290,
    elementsUsed: ['BK-220 karniz', 'KL-150 ustunlar', 'AR-80 archivolt', 'KR-40 kronshteyn'],
    benefits: [
      'Mahalliy va Yevropa uslublarining uyg\'unligi',
      'Maxsus terrakota rang formulasi',
      'Zilzilaga chidamli yengil material',
      'Import xomashyodan O\'zbekistonda ishlanadi',
    ],
    images: [
      { src: '/portfolio/classic-villa.png', alt: 'Premium villa — Buxoro' },
    ],
    testimonial: {
      name: 'Rustam Xolmatov',
      text: 'Buxorodagi eng chiroyli uy deb atashyapti. Artline jamoasi mahalliy uslubimizni tushunib, zamonaviy texnologiya bilan birlashtirdi.',
      rating: 5,
    },
    featured: false,
  },
];
