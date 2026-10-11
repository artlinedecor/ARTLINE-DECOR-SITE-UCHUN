// ============================================================
// Artline Decor — xizmat / mahsulot sahifalari (SEO landing)
// ------------------------------------------------------------
// FAQAT repoda mavjud faktlar ishlatiladi: bosh sahifa matnlari
// (src/lib/i18n.tsx), public/llms.txt, blog maqolalari va portfolio.
// Narx, manzil, telefon, sharh, mijoz nomlarini O'ZINGIZDAN to'qimang.
// Yangi sahifa qo'shish: SERVICE_PAGES ga obyekt qo'shing — marshrut,
// sitemap va "tegishli sahifalar" havolalari avtomatik ishlaydi.
// Reja: docs/seo-kalitlar.md
// ============================================================

export type L = 'uz' | 'ru';
export interface Bi { uz: string; ru: string }

export interface ServiceSection {
  h2: Bi;
  paras: Bi[];
  bullets?: { uz: string[]; ru: string[] };
}

export interface ServicePage {
  slug: string;
  date: string; // oxirgi tahrir sanasi (YYYY-MM-DD), sitemap lastmod uchun
  image: string; // /public ichidagi rasm
  imageAlt: Bi;
  metaTitle: Bi;
  metaDescription: Bi;
  keywords: Bi;
  h1: Bi;
  breadcrumbName: Bi;
  intro: Bi;
  sections: ServiceSection[];
  faq: { q: Bi; a: Bi }[];
  related: string[];
  blogLinks: string[]; // blog slug'lari
}

export const SERVICE_PAGES: ServicePage[] = [
  // ------------------------------------------------------------------
  {
    slug: 'fasad-dekor-toshkent',
    date: '2026-10-11',
    image: '/facade-main.webp',
    imageAlt: {
      uz: "Toshkentda termo panel, karniz va ustun bilan bezatilgan uy fasadi, Artline Decor",
      ru: "Фасад дома в Ташкенте, оформленный термопанелями, карнизами и колоннами, Artline Decor",
    },
    metaTitle: {
      uz: "Fasad dekor Toshkent: termo panel, karniz, ustun | Artline Decor",
      ru: "Фасадный декор в Ташкенте: термопанели, карнизы, колонны | Artline Decor",
    },
    metaDescription: {
      uz: "Toshkentda fasad dekor: termo panel, travertin qoplama, karniz va ustun. O'z ishlab chiqarishimiz, g'isht ustiga suvoqsiz montaj, 10 yillik kafolat.",
      ru: "Фасадный декор в Ташкенте: термопанели, травертин, карнизы и колонны. Собственное производство, монтаж на кирпич без штукатурки, гарантия 10 лет.",
    },
    keywords: {
      uz: "fasad dekor toshkent, dekor fasad, fasad dekor, fasad bezak, uy fasadi dekori, penoplast dekor, artline decor",
      ru: "фасадный декор ташкент, декор фасада, фасад декор, декор дома снаружи, пенопласт декор фасад, artline decor",
    },
    h1: {
      uz: "Toshkentda fasad dekor: termo panel, karniz va ustun o'rnatish",
      ru: "Фасадный декор в Ташкенте: термопанели, карнизы и колонны",
    },
    breadcrumbName: { uz: "Fasad dekor Toshkent", ru: "Фасадный декор в Ташкенте" },
    intro: {
      uz: "Artline Decor Toshkentda fasad dekor elementlarini o'zi ishlab chiqaradi: termo panel, travertin qoplama, karniz, molding, ustun va pilyastr. Bitta tizim bir vaqtning o'zida uchta vazifani bajaradi: tashqi bezak, issiqlik izolyatsiyasi va devor himoyasi.",
      ru: "Artline Decor сама производит элементы фасадного декора в Ташкенте: термопанели, травертиновую облицовку, карнизы, молдинги, колонны и пилястры. Одна система выполняет сразу три задачи: наружный декор, теплоизоляция и защита стены.",
    },
    sections: [
      {
        h2: { uz: "Fasad dekorga nimalar kiradi", ru: "Что входит в фасадный декор" },
        paras: [
          {
            uz: "Fasad dekor bu faqat bezak emas. To'g'ri tanlangan elementlar binoning shaklini ta'kidlaydi, gorizontal va vertikal chiziqlarni hosil qiladi, deraza va eshiklarni ajratib ko'rsatadi. Bizning katalogimizda quyidagi asosiy elementlar bor:",
            ru: "Фасадный декор — это не только украшение. Правильно подобранные элементы подчёркивают форму здания, создают горизонтальные и вертикальные линии, выделяют окна и двери. В нашем каталоге есть следующие основные элементы:",
          },
        ],
        bullets: {
          uz: [
            "Termo panel: issiqlikni saqlaydi, ovoz va namlikdan himoya qiladi",
            "Travertin qoplama (o'stirma): tom osti qismi uchun, alkabond o'rniga",
            "Karniz (profil) va reykasimon karniz: bino uslubini to'ldiradi",
            "Oyna karnizlari: deraza atrofini bezatish va ramkalash",
            "Kolonna (kapitel) va pilyastr: binoga ulug'vor, klassik ko'rinish beradi",
          ],
          ru: [
            "Термопанель: сохраняет тепло, защищает от шума и влаги",
            "Травертиновая облицовка (подкровельная часть): вместо алюкобонда",
            "Карниз (профиль) и реечный карниз: дополняют стиль здания",
            "Оконные карнизы: оформление и обрамление окон",
            "Колонна (капитель) и пилястра: придают зданию величественный классический вид",
          ],
        },
      },
      {
        h2: { uz: "Nega penopolistirol asosidagi dekor", ru: "Почему декор на основе пенополистирола" },
        paras: [
          {
            uz: "Mahsulotlarimiz yuqori zichlikdagi penopolistirol (PSB-S-25F va PSB-S-35F markalari) asosida tayyorlanadi va ustidan akril qoplama bilan himoyalanadi. Elementlar avtomatlashtirilgan dastgohlarda kesiladi, shuning uchun o'lchamlari aniq bo'ladi. Material yengil, shu sababli binoning poydevori va devorlariga ortiqcha yuk tushmaydi.",
            ru: "Наши изделия изготавливаются на основе пенополистирола высокой плотности (марки ПСБ-С-25Ф и ПСБ-С-35Ф) и защищаются сверху акриловым покрытием. Элементы изготавливаются на автоматизированных станках, поэтому размеры точные. Материал лёгкий, поэтому на фундамент и стены не ложится лишняя нагрузка.",
          },
        ],
        bullets: {
          uz: [
            "G'isht yoki beton devorga to'g'ridan-to'g'ri o'rnatiladi, suvoq talab etilmaydi",
            "Panellar namlikni o'ziga tortmaydi va shaklini yo'qotmaydi",
            "Burchaklar 45° aniqlikda kesiladi, choklar maxsus pena-kley bilan to'ldiriladi",
            "Panellarga va rang barqarorligiga 10 yillik rasmiy kafolat",
          ],
          ru: [
            "Монтируется прямо на кирпичную или бетонную стену, штукатурка не требуется",
            "Панели не впитывают влагу и не теряют форму",
            "Углы режутся под 45°, швы заполняются специальным пена-клеем",
            "Официальная гарантия 10 лет на панели и стойкость цвета",
          ],
        },
      },
      {
        h2: { uz: "O'rnatish muddati va bajarilgan ishlar", ru: "Сроки монтажа и выполненные работы" },
        paras: [
          {
            uz: "O'rtacha hovli uy (200-300 kv.m) uchun o'rnatish 5 kundan 10 kungacha davom etadi. Saytimizdagi portfolio bo'limida Toshkentdagi uchta obyekt ko'rsatilgan: 170, 190 va 350 kv.m maydonli binolar, ularda termo panel, BK-220/2 karniz va KL-150 ustunlar ishlatilgan.",
            ru: "Для среднего частного дома (200-300 кв.м) монтаж занимает от 5 до 10 дней. В разделе портфолио на сайте показаны три объекта в Ташкенте: здания площадью 170, 190 и 350 кв.м, где использованы термопанели, карниз BK-220/2 и колонны KL-150.",
          },
          {
            uz: "Aniq muddat va narx obyektni ko'rgandan keyin aniqlanadi. Bepul smeta uchun +998 99 102 02 00 raqamiga qo'ng'iroq qiling yoki bosh sahifadagi qayta aloqa formasini to'ldiring.",
            ru: "Точные сроки и стоимость определяются после осмотра объекта. Для бесплатной сметы позвоните по номеру +998 99 102 02 00 или заполните форму обратной связи на главной странице.",
          },
        ],
      },
      {
        h2: { uz: "Showroom va yetkazib berish", ru: "Шоурум и доставка" },
        paras: [
          {
            uz: "Showroom Toshkent shahri, Yashnabod tumani, Iqbol ko'chasida joylashgan. Ish vaqti: dushanba-shanba, 09:00 dan 18:00 gacha. Mahsulotlar butun O'zbekiston bo'ylab yetkazib beriladi.",
            ru: "Шоурум находится в Ташкенте, Яшнабадский район, улица Икбол. Время работы: понедельник-суббота, с 09:00 до 18:00. Продукция доставляется по всему Узбекистану.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Fasad dekor nima va u nima uchun kerak?", ru: "Что такое фасадный декор и зачем он нужен?" },
        a: {
          uz: "Fasad dekor bu binoning tashqi qismini bezaydigan elementlar: karniz, molding, ustun, pilyastr, oyna ramkalari. Ular binoga tugallangan ko'rinish beradi, Artline Decor mahsulotlari esa qo'shimcha ravishda issiqlik izolyatsiyasi va devor himoyasini ham beradi.",
          ru: "Фасадный декор — это элементы, украшающие внешнюю часть здания: карнизы, молдинги, колонны, пилястры, оконные обрамления. Они придают зданию завершённый вид, а продукция Artline Decor дополнительно даёт теплоизоляцию и защиту стены.",
        },
      },
      {
        q: { uz: "Suvoqsiz g'isht ustiga to'g'ridan-to'g'ri o'rnatsa bo'ladimi?", ru: "Можно ли монтировать прямо на кирпич без штукатурки?" },
        a: {
          uz: "Ha. Panellarimiz g'isht yoki beton ustiga to'g'ridan-to'g'ri qotiriladi, uyni suvoq qilish shart emas.",
          ru: "Да. Наши панели крепятся прямо на кирпич или бетон, штукатурить дом не обязательно.",
        },
      },
      {
        q: { uz: "O'rnatish qancha vaqt oladi?", ru: "Сколько времени занимает установка?" },
        a: {
          uz: "Obyekt o'lchamiga bog'liq. O'rtacha hovli uylar (200-300 kv.m) uchun 5 kundan 10 kungacha.",
          ru: "Зависит от размера объекта. Для средних частных домов (200-300 кв.м) — от 5 до 10 дней.",
        },
      },
      {
        q: { uz: "Kafolat muddati qancha?", ru: "Какой срок гарантии?" },
        a: {
          uz: "Panellarga va ularning rangi o'zgarmasligiga 10 yillik rasmiy kafolat beramiz.",
          ru: "Мы даём официальную гарантию 10 лет на панели и сохранение их цвета.",
        },
      },
      {
        q: { uz: "Narxni qanday bilsam bo'ladi?", ru: "Как узнать стоимость?" },
        a: {
          uz: "Narx va muddat obyekt ko'rigidan keyin aniqlanadi. Bepul smeta uchun +998 99 102 02 00 raqamiga qo'ng'iroq qiling yoki saytdagi formani to'ldiring.",
          ru: "Стоимость и сроки определяются после осмотра объекта. Для бесплатной сметы позвоните по номеру +998 99 102 02 00 или заполните форму на сайте.",
        },
      },
    ],
    related: ['karniz-fasad', 'termo-panel-fasad', 'travertin-fasad-qoplama', 'ustun-pilyastr-dekor', 'gips-dekor-alternativi'],
    blogLinks: ['fasad-izolyatsiya-qanday-qilinadi', 'karniz-turlari'],
  },

  // ------------------------------------------------------------------
  {
    slug: 'karniz-fasad',
    date: '2026-10-11',
    image: '/product-cornice.webp',
    imageAlt: {
      uz: "Fasad uchun penoplast karniz profili, Artline Decor, Toshkent",
      ru: "Фасадный карниз-профиль из пенополистирола, Artline Decor, Ташкент",
    },
    metaTitle: {
      uz: "Fasad karniz turlari va o'rnatish, Toshkent | Artline Decor",
      ru: "Фасадные карнизы: виды и монтаж, Ташкент | Artline Decor",
    },
    metaDescription: {
      uz: "Fasad karniz turlari: profil, reykasimon, oyna karnizlari va tom osti qoplamasi. Yengil penopolistirol, akril qoplama, 10 yillik kafolat. Toshkent.",
      ru: "Виды фасадных карнизов: профильный, реечный, оконные и подкровельная облицовка. Лёгкий пенополистирол, акриловое покрытие, гарантия 10 лет. Ташкент.",
    },
    keywords: {
      uz: "karniz turlari, fasad karniz, karniz dekor, karniz toshkent, oyna karnizi, reykasimon karniz, molding fasad",
      ru: "карниз фасадный, виды карнизов, карниз ташкент, оконные карнизы, реечный карниз, молдинг декоративный",
    },
    h1: {
      uz: "Fasad karniz turlari: tanlash va o'rnatish",
      ru: "Фасадные карнизы: виды, выбор и монтаж",
    },
    breadcrumbName: { uz: "Fasad karniz", ru: "Фасадный карниз" },
    intro: {
      uz: "Karniz binoning gorizontal chiziqlarini ta'kidlaydi, qavatlarni ajratadi va tom osti qismini bezatadi. Artline Decor katalogida bir necha xil karniz bor, hammasi yengil penopolistirol asosida tayyorlanadi.",
      ru: "Карниз подчёркивает горизонтальные линии здания, разделяет этажи и оформляет подкровельную часть. В каталоге Artline Decor несколько видов карнизов, все изготавливаются на основе лёгкого пенополистирола.",
    },
    sections: [
      {
        h2: { uz: "Karniz turlari", ru: "Виды карнизов" },
        paras: [
          {
            uz: "Katalogdagi karniz va ularga yaqin elementlar:",
            ru: "Карнизы и близкие к ним элементы из каталога:",
          },
        ],
        bullets: {
          uz: [
            "Karniz (profil): binoning uslubini to'ldiradi va himoya vazifasini bajaradi",
            "Reykasimon karniz: fasadga nafis va zamonaviy ko'rinish beradi",
            "Oyna karnizlari: deraza atrofini bezatish va ramkalash uchun profillar",
            "O'stirma (travertin): tom osti qismi uchun travertinli qoplama, alkabond o'rniga",
          ],
          ru: [
            "Карниз (профиль): дополняет стиль здания и выполняет защитную функцию",
            "Реечный карниз: придаёт фасаду изящный и современный вид",
            "Оконные карнизы: профили для украшения и обрамления окон",
            "Подкровельная облицовка (травертин): травертиновое покрытие для подкровельной части вместо алюкобонда",
          ],
        },
      },
      {
        h2: { uz: "Qaysi karnizni qayerga qo'yish kerak", ru: "Какой карниз куда ставить" },
        paras: [
          {
            uz: "Tom osti karnizi tom va devor tutashgan joyda o'rnatiladi va binoni balandroq ko'rsatadi. Qavatlararo karniz ko'p qavatli uylarda qavatlarni ajratadi. Oyna usti karnizi deraza va eshik teshiklarining yuqori qismini bezaydi. Batafsil tushuntirish blogdagi maqolada bor.",
            ru: "Подкровельный карниз устанавливается на стыке крыши и стены и визуально увеличивает высоту здания. Межэтажный карниз разделяет этажи в многоэтажных домах. Оконный карниз оформляет верхнюю часть оконных и дверных проёмов. Подробное объяснение есть в статье блога.",
          },
        ],
      },
      {
        h2: { uz: "Material va o'rnatish", ru: "Материал и монтаж" },
        paras: [
          {
            uz: "Karnizlar yuqori zichlikdagi penopolistirol asosida, ustki qismi mustahkam akril qoplama bilan tayyorlanadi. Ular yengil, shuning uchun og'ir gips yoki beton elementlardan farqli ravishda binoga katta yuk bermaydi. Burchaklar 45° aniqlikda kesiladi, choklar pena-kley bilan to'ldiriladi. Ustki akril qoplama quyosh ultrabinafsha nurlaridan va qor-yomg'irdan himoya qiladi.",
            ru: "Карнизы изготавливаются на основе пенополистирола высокой плотности с прочным акриловым покрытием сверху. Они лёгкие, поэтому, в отличие от тяжёлых гипсовых или бетонных элементов, не дают большой нагрузки на здание. Углы режутся под 45°, швы заполняются пена-клеем. Верхнее акриловое покрытие защищает от ультрафиолета, снега и дождя.",
          },
          {
            uz: "Portfolio'dagi Toshkent obyektlarida BK-220/2 karniz ishlatilgan. Sizning binongizga qaysi profil mos kelishini mutaxassis ko'rikdan keyin aytadi.",
            ru: "В объектах портфолио в Ташкенте использован карниз BK-220/2. Какой профиль подойдёт вашему зданию, специалист подскажет после осмотра.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Fasad karnizi nima uchun kerak?", ru: "Для чего нужен фасадный карниз?" },
        a: {
          uz: "Karniz binoning gorizontal chiziqlarini ta'kidlaydi, qavatlarni ajratadi, tom osti qismini bezatadi va bino uslubini to'ldiradi.",
          ru: "Карниз подчёркивает горизонтальные линии здания, разделяет этажи, оформляет подкровельную часть и дополняет стиль здания.",
        },
      },
      {
        q: { uz: "Karniz qanday materialdan tayyorlanadi?", ru: "Из какого материала делают карнизы?" },
        a: {
          uz: "Yuqori zichlikdagi penopolistirol (PSB-S-25F va PSB-S-35F) asosida, ustidan akril qoplama bilan.",
          ru: "На основе пенополистирола высокой плотности (ПСБ-С-25Ф и ПСБ-С-35Ф) с акриловым покрытием сверху.",
        },
      },
      {
        q: { uz: "Karniz qor va yomg'irga chidaydimi?", ru: "Выдерживает ли карниз снег и дождь?" },
        a: {
          uz: "Ha, mahsulotlar maxsus himoya qatlami bilan qoplangan, namlikni o'ziga tortmaydi va shaklini yo'qotmaydi.",
          ru: "Да, изделия покрыты специальным защитным слоем, не впитывают влагу и не теряют форму.",
        },
      },
      {
        q: { uz: "Karniz narxi qancha?", ru: "Сколько стоит карниз?" },
        a: {
          uz: "Narx profil turi va hajmga bog'liq va ko'rikdan keyin aniqlanadi. Aniq hisob uchun +998 99 102 02 00 raqamiga qo'ng'iroq qiling.",
          ru: "Цена зависит от типа профиля и объёма и определяется после осмотра. Для точного расчёта позвоните по номеру +998 99 102 02 00.",
        },
      },
    ],
    related: ['fasad-dekor-toshkent', 'ustun-pilyastr-dekor', 'termo-panel-fasad'],
    blogLinks: ['karniz-turlari'],
  },

  // ------------------------------------------------------------------
  {
    slug: 'termo-panel-fasad',
    date: '2026-10-11',
    image: '/product-termopanel.webp',
    imageAlt: {
      uz: "Fasad uchun termo panel, penopolistirol asosli izolyatsiya paneli, Artline Decor",
      ru: "Фасадная термопанель на основе пенополистирола, Artline Decor",
    },
    metaTitle: {
      uz: "Fasad termo panel va izolyatsiya, Toshkent | Artline Decor",
      ru: "Фасадные термопанели и утепление, Ташкент | Artline Decor",
    },
    metaDescription: {
      uz: "Fasad termo panel: dekor, issiqlik izolyatsiyasi va devor himoyasi bitta tizimda. G'isht ustiga suvoqsiz montaj, 5-10 kunda, 10 yillik kafolat.",
      ru: "Фасадные термопанели: декор, теплоизоляция и защита стены в одной системе. Монтаж на кирпич без штукатурки за 5-10 дней, гарантия 10 лет.",
    },
    keywords: {
      uz: "termo panel fasad, termo panellar, fasad izolyatsiya, issiqlik izolyatsiya fasad, fasad panellari, penoplast dekor",
      ru: "фасадные термопанели, термопанели ташкент, утепление фасада, фасадная изоляция, фасадные панели",
    },
    h1: {
      uz: "Fasad termo panel: bezak va issiqlik izolyatsiyasi bitta tizimda",
      ru: "Фасадные термопанели: декор и теплоизоляция в одной системе",
    },
    breadcrumbName: { uz: "Termo panel", ru: "Термопанели" },
    intro: {
      uz: "Termo panel yuqori zichlikdagi penopolistirol asosiga ega bo'lib, ustida akril dekorativ qoplama bor. Shu sababli bitta mahsulot bino ko'rinishini yangilaydi va devorni issiqlik yo'qotilishidan himoya qiladi.",
      ru: "Термопанель имеет основу из пенополистирола высокой плотности и декоративное акриловое покрытие сверху. Поэтому один материал обновляет вид здания и защищает стену от потерь тепла.",
    },
    sections: [
      {
        h2: { uz: "Termo panel qanday tuzilgan", ru: "Как устроена термопанель" },
        paras: [
          {
            uz: "Asos qatlami PSB-S-25F yoki PSB-S-35F markali penopolistirol. Ustida kamida 4 mm akril qoplama bor. Mahsulot o'z-o'zidan o'chuvchi xususiyatga ega va tarkibida zaharli kimyoviy moddalar yo'q. Panel qirrasidagi qulf (zamok) tizimi birikmalarni aniq qiladi.",
            ru: "Основа — пенополистирол марки ПСБ-С-25Ф или ПСБ-С-35Ф. Сверху нанесено акриловое покрытие толщиной от 4 мм. Продукт обладает свойством самозатухания, в составе нет токсичных химических веществ. Замковая система по краю панели делает стыки точными.",
          },
        ],
        bullets: {
          uz: [
            "Qishda issiqni, yozda salqinni saqlaydi, energiya sarfini kamaytiradi",
            "Issiqlik va ovoz izolyatsiyasi",
            "Ob-havo sharoitiga chidamli: qor, yomg'ir va kuchli sovuq",
            "AMK himoya qatlami zarbalardan va tashqi haroratdan himoya qiladi",
          ],
          ru: [
            "Сохраняет тепло зимой и прохладу летом, снижает расход энергии",
            "Тепло- и звукоизоляция",
            "Устойчива к погодным условиям: снег, дождь и сильные морозы",
            "Защитный слой AMK защищает от ударов и внешней температуры",
          ],
        },
      },
      {
        h2: { uz: "Montaj tartibi", ru: "Порядок монтажа" },
        paras: [
          {
            uz: "Panellar g'isht yoki beton devorga to'g'ridan-to'g'ri o'rnatiladi, suvoq talab etilmaydi. Maxsus sovuqqa va issiqqa chidamli yelimlar ishlatiladi, burchaklar 45° da kesiladi, har bir chok pena-kley bilan zich to'ldiriladi. Hovli uy (200-300 kv.m) uchun o'rtacha 5-10 kun ketadi. Izolyatsiya jarayoni haqida batafsil maqola blogimizda bor.",
            ru: "Панели монтируются прямо на кирпичную или бетонную стену, штукатурка не требуется. Используются специальные морозо- и жаростойкие клеи, углы режутся под 45°, каждый шов плотно заполняется пена-клеем. Для частного дома (200-300 кв.м) в среднем уходит 5-10 дней. Подробная статья о процессе утепления есть в нашем блоге.",
          },
        ],
      },
      {
        h2: { uz: "Termo panel va tabiiy travertin", ru: "Термопанель и натуральный травертин" },
        paras: [
          {
            uz: "Tabiiy tosh og'ir va issiqlikni saqlamaydi. Travertin ko'rinishidagi termo panel esa yengil va izolyatsiya vazifasini ham bajaradi. Taqqoslash jadvali blog maqolasida berilgan.",
            ru: "Натуральный камень тяжёлый и не сохраняет тепло. Термопанель с видом травертина лёгкая и одновременно выполняет функцию утепления. Сравнительная таблица приведена в статье блога.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Termo panel nima?", ru: "Что такое термопанель?" },
        a: {
          uz: "Termo panel bu penopolistirol asosli, ustida dekorativ akril qoplamasi bor fasad paneli. U ham bezak, ham issiqlik izolyatsiyasi vazifasini bajaradi.",
          ru: "Термопанель — это фасадная панель на основе пенополистирола с декоративным акриловым покрытием. Она выполняет функцию и декора, и теплоизоляции.",
        },
      },
      {
        q: { uz: "Panellar uyning issiqlikni saqlashiga yordam beradimi?", ru: "Помогают ли панели сохранять тепло в доме?" },
        a: {
          uz: "Ha, penoplast asosi issiqlik izolyatsiyasini ta'minlaydi: qishda issiqni, yozda salqinni saqlaydi.",
          ru: "Да, основа из пенопласта обеспечивает теплоизоляцию: сохраняет тепло зимой и прохладу летом.",
        },
      },
      {
        q: { uz: "Suvoq qilish kerakmi?", ru: "Нужна ли штукатурка?" },
        a: {
          uz: "Yo'q, panellar g'isht yoki beton ustiga to'g'ridan-to'g'ri o'rnatiladi.",
          ru: "Нет, панели монтируются прямо на кирпич или бетон.",
        },
      },
      {
        q: { uz: "Panellar yonadimi?", ru: "Горят ли панели?" },
        a: {
          uz: "Mahsulot o'z-o'zidan o'chuvchi (samozatuxayushchiy) xususiyatga ega.",
          ru: "Продукт обладает свойством самозатухания.",
        },
      },
      {
        q: { uz: "Termo panel narxi qancha?", ru: "Сколько стоят термопанели?" },
        a: {
          uz: "Narx obyekt maydoni va tanlangan elementlarga bog'liq, ko'rikdan keyin aniqlanadi. Bepul smeta uchun +998 99 102 02 00.",
          ru: "Цена зависит от площади объекта и выбранных элементов и определяется после осмотра. Для бесплатной сметы: +998 99 102 02 00.",
        },
      },
    ],
    related: ['fasad-dekor-toshkent', 'travertin-fasad-qoplama', 'gips-dekor-alternativi'],
    blogLinks: ['fasad-izolyatsiya-qanday-qilinadi', 'travertin-vs-penoplast'],
  },

  // ------------------------------------------------------------------
  {
    slug: 'travertin-fasad-qoplama',
    date: '2026-10-11',
    image: '/product-travertin.webp',
    imageAlt: {
      uz: "Fasad uchun travertin ko'rinishidagi qoplama, Artline Decor",
      ru: "Фасадная облицовка под травертин, Artline Decor",
    },
    metaTitle: {
      uz: "Travertin fasad qoplama, Toshkent | Artline Decor",
      ru: "Травертин для фасада: облицовка, Ташкент | Artline Decor",
    },
    metaDescription: {
      uz: "Travertin fasad qoplama: tabiiy tosh ko'rinishi, lekin yengil va issiqlikni saqlaydi. Akril-travertin qoplamali penopolistirol panellar. Toshkent.",
      ru: "Травертиновая облицовка фасада: вид натурального камня, но лёгкая и сохраняет тепло. Панели из пенополистирола с акриловым травертиновым покрытием. Ташкент.",
    },
    keywords: {
      uz: "travertin fasad, travertin qoplama, travertin fasad toshkent, travertin termo panel, suyuq travertin",
      ru: "травертин фасад, облицовка фасада травертином, травертин ташкент, термопанели с травертином",
    },
    h1: {
      uz: "Travertin fasad qoplama: tosh ko'rinishi, yengil og'irlik",
      ru: "Травертиновая облицовка фасада: вид камня, малый вес",
    },
    breadcrumbName: { uz: "Travertin qoplama", ru: "Травертин" },
    intro: {
      uz: "Travertin fasadga issiq, tabiiy ko'rinish beradi. Artline Decor panellarining ustki qatlami tabiiy marmar va travertin kukunidan tayyorlangan akril qoplama bilan qoplangan, asosi esa penopolistirol.",
      ru: "Травертин придаёт фасаду тёплый, естественный вид. Верхний слой панелей Artline Decor — акриловое покрытие с добавлением мраморной и травертиновой крошки, основа — пенополистирол.",
    },
    sections: [
      {
        h2: { uz: "Tabiiy travertin va tayyor panel farqi", ru: "Чем натуральный травертин отличается от готовой панели" },
        paras: [
          {
            uz: "Tabiiy travertin og'ir, uni o'rnatish uchun yuqori malakali usta va ko'p vaqt kerak, o'zi issiqlikni saqlamaydi. Tayyor travertin ko'rinishidagi panel yengil, zavodda tayyor holda keladi va izolyatsiya vazifasini ham bajaradi. Batafsil taqqoslash blogdagi maqolada.",
            ru: "Натуральный травертин тяжёлый, для его монтажа нужен опытный мастер и много времени, сам он не сохраняет тепло. Готовая панель с видом травертина лёгкая, приходит с завода в готовом виде и выполняет ещё и функцию утепления. Подробное сравнение — в статье блога.",
          },
        ],
        bullets: {
          uz: [
            "Binoning poydevoriga deyarli yuk bermaydi",
            "Penopolistirol asosi issiqlik izolyatsiyasini beradi",
            "Akril qoplama quyosh nuri va qor-yomg'irdan himoya qiladi",
            "AMK qoplamasi dekorativ bo'yoq yoki suyuq travertin bilan yaxshi birikadi",
          ],
          ru: [
            "Почти не нагружает фундамент здания",
            "Основа из пенополистирола даёт теплоизоляцию",
            "Акриловое покрытие защищает от солнца, снега и дождя",
            "Покрытие AMK хорошо сочетается с декоративной краской или жидким травертином",
          ],
        },
      },
      {
        h2: { uz: "Tom osti qismi uchun travertin (o'stirma)", ru: "Травертин для подкровельной части" },
        paras: [
          {
            uz: "Katalogimizda tom osti qismi uchun maxsus travertinli qoplama bor, u alkabond o'rniga ishlatiladi. U karniz bilan birga binoga tugallangan ko'rinish beradi.",
            ru: "В нашем каталоге есть специальная травертиновая облицовка для подкровельной части, которая применяется вместо алюкобонда. Вместе с карнизом она придаёт зданию завершённый вид.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Travertin qoplama issiqlikni saqlaydimi?", ru: "Сохраняет ли травертиновая облицовка тепло?" },
        a: {
          uz: "Tabiiy tosh saqlamaydi. Bizning travertin ko'rinishidagi panellarimizning asosi penopolistirol, shuning uchun ular issiqlik izolyatsiyasini ham beradi.",
          ru: "Натуральный камень не сохраняет. Основа наших панелей с видом травертина — пенополистирол, поэтому они дают и теплоизоляцию.",
        },
      },
      {
        q: { uz: "Travertin panel og'ir bo'ladimi?", ru: "Тяжёлая ли травертиновая панель?" },
        a: {
          uz: "Yo'q, penopolistirol asosi sababli panellar yengil va binoga ortiqcha yuk tushirmaydi.",
          ru: "Нет, благодаря основе из пенополистирола панели лёгкие и не создают лишней нагрузки на здание.",
        },
      },
      {
        q: { uz: "Rangi vaqt o'tishi bilan o'zgaradimi?", ru: "Меняется ли цвет со временем?" },
        a: {
          uz: "Panellarga va ularning rangi o'zgarmasligiga 10 yillik rasmiy kafolat beriladi.",
          ru: "На панели и стойкость их цвета предоставляется официальная гарантия 10 лет.",
        },
      },
      {
        q: { uz: "Suyuq travertin bilan birga ishlatsa bo'ladimi?", ru: "Можно ли сочетать с жидким травертином?" },
        a: {
          uz: "Ha, AMK qoplamasi dekorativ bo'yoq yoki suyuq travertin bilan yaxshi birikadi.",
          ru: "Да, покрытие AMK хорошо сочетается с декоративной краской или жидким травертином.",
        },
      },
    ],
    related: ['termo-panel-fasad', 'fasad-dekor-toshkent', 'karniz-fasad'],
    blogLinks: ['travertin-vs-penoplast'],
  },

  // ------------------------------------------------------------------
  {
    slug: 'ustun-pilyastr-dekor',
    date: '2026-10-11',
    image: '/product-column.webp',
    imageAlt: {
      uz: "Fasad uchun dekorativ ustun va kapitel, Artline Decor, Toshkent",
      ru: "Декоративная колонна с капителью для фасада, Artline Decor, Ташкент",
    },
    metaTitle: {
      uz: "Ustun va pilyastr dekor fasad uchun, Toshkent | Artline Decor",
      ru: "Фасадные колонны и пилястры, Ташкент | Artline Decor",
    },
    metaDescription: {
      uz: "Fasad uchun dekorativ ustun (kolonna, kapitel) va pilyastr. Yengil penopolistirol, akril qoplama, tez montaj, 10 yillik kafolat. Toshkent.",
      ru: "Декоративные колонны (капитель) и пилястры для фасада. Лёгкий пенополистирол, акриловое покрытие, быстрый монтаж, гарантия 10 лет. Ташкент.",
    },
    keywords: {
      uz: "ustun dekor, pilyastr, kolonna fasad, kapitel, arxitektura dekor, ustun va pilyastr",
      ru: "колонны декоративные, пилястры фасадные, капитель, колонны для фасада, архитектурный декор",
    },
    h1: {
      uz: "Fasad uchun dekorativ ustun va pilyastr",
      ru: "Декоративные колонны и пилястры для фасада",
    },
    breadcrumbName: { uz: "Ustun va pilyastr", ru: "Колонны и пилястры" },
    intro: {
      uz: "Ustun va pilyastr binoga ulug'vor, klassik ko'rinish beradi. Ular ko'pincha kirish guruhi, peshtoq, terassa va balkonlarda ishlatiladi.",
      ru: "Колонны и пилястры придают зданию величественный классический вид. Чаще всего их применяют для входных групп, портиков, террас и балконов.",
    },
    sections: [
      {
        h2: { uz: "Ustun va pilyastr farqi", ru: "Чем колонна отличается от пилястры" },
        paras: [
          {
            uz: "Ustun (kolonna) to'liq aylana shaklidagi element, zamonaviy qurilishda u ko'pincha dekorativ vazifa bajaradi. Pilyastr devordan biroz bo'rtib chiqqan yassi \"yarim ustun\" bo'lib, yuk ko'tarmaydi, lekin devor yuzasini qismlarga bo'ladi va burchaklarni vizual mustahkamlaydi.",
            ru: "Колонна — полностью круглый элемент, в современном строительстве чаще всего выполняет декоративную роль. Пилястра — плоский «полуколонна», слегка выступающий из стены; она не несёт нагрузки, но делит поверхность стены на части и визуально усиливает углы.",
          },
        ],
        bullets: {
          uz: [
            "Kolonna (kapitel) binoning ulug'vorligini ta'kidlaydi",
            "Pilyastr klassik saroy uslubini yaratadi",
            "Karniz bilan birga ishlatilganda fasad bir butun ko'rinadi",
          ],
          ru: [
            "Колонна (капитель) подчёркивает величественность здания",
            "Пилястра создаёт классический дворцовый стиль",
            "В сочетании с карнизом фасад выглядит цельно",
          ],
        },
      },
      {
        h2: { uz: "Og'ir gips yoki betonga qarshi yengil yechim", ru: "Лёгкая альтернатива тяжёлому гипсу и бетону" },
        paras: [
          {
            uz: "Ilgari bunday elementlar og'ir gips yoki beton qorishmasidan tayyorlanardi, ularni o'rnatish uzoq cho'zilar va devorga katta yuk berardi. Artline Decor ustunlari yuqori zichlikdagi penopolistirol asosida, ustki qismi mustahkam akril qoplamali, shuning uchun yengil va tez o'rnatiladi. Toshkent portfolio obyektlarida KL-150 ustunlar ishlatilgan.",
            ru: "Раньше такие элементы делали из тяжёлого гипса или бетонного раствора, их монтаж затягивался и сильно нагружал стену. Колонны Artline Decor изготавливаются на основе пенополистирола высокой плотности с прочным акриловым покрытием, поэтому они лёгкие и быстро монтируются. В объектах портфолио в Ташкенте использованы колонны KL-150.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Ustun yuk ko'taradimi?", ru: "Несёт ли колонна нагрузку?" },
        a: {
          uz: "Bizning ustunlar dekorativ element. Pilyastr ham yuk ko'tarmaydi, u devor yuzasini bezaydi.",
          ru: "Наши колонны — декоративный элемент. Пилястра тоже не несёт нагрузки, она украшает поверхность стены.",
        },
      },
      {
        q: { uz: "Ustun qayerlarda ishlatiladi?", ru: "Где используются колонны?" },
        a: {
          uz: "Kirish guruhlari, peshtoqlar, terassalar va balkonlarda.",
          ru: "Во входных группах, портиках, на террасах и балконах.",
        },
      },
      {
        q: { uz: "Ustun qor, yomg'ir va quyoshga chidaydimi?", ru: "Выдерживает ли колонна снег, дождь и солнце?" },
        a: {
          uz: "Ha, ustki akril qoplama quyosh ultrabinafsha nurlaridan va qor-yomg'irdan himoya qiladi.",
          ru: "Да, верхнее акриловое покрытие защищает от ультрафиолета, снега и дождя.",
        },
      },
      {
        q: { uz: "Narxi qancha?", ru: "Сколько стоит?" },
        a: {
          uz: "Narx o'lcham va miqdorga bog'liq, ko'rikdan keyin aniqlanadi. Aloqa: +998 99 102 02 00.",
          ru: "Цена зависит от размера и количества и определяется после осмотра. Контакт: +998 99 102 02 00.",
        },
      },
    ],
    related: ['karniz-fasad', 'fasad-dekor-toshkent', 'gips-dekor-alternativi'],
    blogLinks: ['karniz-turlari'],
  },

  // ------------------------------------------------------------------
  {
    slug: 'gips-dekor-alternativi',
    date: '2026-10-11',
    image: '/portfolio/termo-panel-razrezi.jpg',
    imageAlt: {
      uz: "Termo panel kesimi: penopolistirol asos va akril qoplama, gips dekor o'rniga yengil alternativa",
      ru: "Срез термопанели: основа из пенополистирола и акриловое покрытие, лёгкая альтернатива гипсовому декору",
    },
    metaTitle: {
      uz: "Gips dekor o'rniga penoplast dekor: fasad uchun | Artline Decor",
      ru: "Пенопластовый декор вместо гипсового для фасада | Artline Decor",
    },
    metaDescription: {
      uz: "Fasad uchun gips yoki poliuretan dekor o'rniga yengil penopolistirol dekor. Og'irligi, namlikka chidamliligi va o'rnatish farqi. Toshkent.",
      ru: "Лёгкий пенополистирольный декор для фасада вместо гипсового или полиуретанового. Разница в весе, влагостойкости и монтаже. Ташкент.",
    },
    keywords: {
      uz: "gips dekor, gips o'rniga penoplast, poliuretan dekor, penoplast dekor, fasad lepnina, arxitektura dekor",
      ru: "гипсовый декор фасад, пенопласт вместо гипса, полиуретановый декор, лепнина для фасада, пенопласт декор фасад",
    },
    h1: {
      uz: "Fasad uchun gips yoki poliuretan dekor o'rniga penoplast dekor",
      ru: "Пенопластовый декор для фасада вместо гипсового или полиуретанового",
    },
    breadcrumbName: { uz: "Gips dekor alternativi", ru: "Альтернатива гипсовому декору" },
    intro: {
      uz: "Fasad uchun dekor izlaganlar ko'pincha gips, beton yoki poliuretan haqida so'rashadi. Bu sahifada Artline Decor ishlatadigan material, yuqori zichlikdagi penopolistirol akril qoplama bilan, bu variantlardan nimasi bilan farq qilishini tushuntiramiz.",
      ru: "Тем, кто ищет декор для фасада, часто интересны гипс, бетон или полиуретан. На этой странице мы объясняем, чем материал Artline Decor — пенополистирол высокой плотности с акриловым покрытием — отличается от этих вариантов.",
    },
    sections: [
      {
        h2: { uz: "Og'irlik va montaj", ru: "Вес и монтаж" },
        paras: [
          {
            uz: "Gips va beton elementlar og'ir. Ularni o'rnatish uzoq davom etadi va devor hamda poydevorga katta yuk beradi. Penopolistirol asosidagi elementlar yengil, ularni o'rnatish tez va kranlar kerak bo'lmaydi.",
            ru: "Гипсовые и бетонные элементы тяжёлые. Их монтаж занимает много времени и сильно нагружает стену и фундамент. Элементы на основе пенополистирола лёгкие, монтируются быстро, и кран не требуется.",
          },
        ],
      },
      {
        h2: { uz: "Ob-havoga chidamlilik", ru: "Устойчивость к погоде" },
        paras: [
          {
            uz: "Bizning mahsulotlar suv o'tkazmaydi, namlikni o'ziga tortmaydi va shaklini yo'qotmaydi. Ustki akril qoplama quyosh nuri va qor-yomg'irdan himoya qiladi. Panellarga va rangiga 10 yillik rasmiy kafolat beriladi.",
            ru: "Наши изделия не пропускают воду, не впитывают влагу и не теряют форму. Верхнее акриловое покрытие защищает от солнца, снега и дождя. На панели и их цвет даётся официальная гарантия 10 лет.",
          },
        ],
      },
      {
        h2: { uz: "Poliuretan haqida", ru: "О полиуретане" },
        paras: [
          {
            uz: "Artline Decor mahsulotlari poliuretandan emas, penopolistirol (PSB-S-25F va PSB-S-35F) asosida tayyorlanadi. Poliuretan bilan to'g'ridan-to'g'ri taqqoslash uchun bizda ma'lumot yo'q, shuning uchun uni baholamaymiz. Qaysi material sizning obyektingizga mosligini mutaxassis ko'rikda aytib beradi.",
            ru: "Продукция Artline Decor изготавливается не из полиуретана, а на основе пенополистирола (ПСБ-С-25Ф и ПСБ-С-35Ф). Данных для прямого сравнения с полиуретаном у нас нет, поэтому мы не даём его оценку. Какой материал подойдёт вашему объекту, специалист подскажет при осмотре.",
          },
        ],
      },
      {
        h2: { uz: "Gips kabi shakllar, yengil material", ru: "Формы как у гипса, лёгкий материал" },
        paras: [
          {
            uz: "Karniz, molding, ustun va pilyastrlar klassik gips bezaklarning o'rnini bosadi. Katalogdagi shakllarni ko'rish uchun PDF katalogni yuklab oling yoki Iqbol ko'chasidagi showroomga keling.",
            ru: "Карнизы, молдинги, колонны и пилястры заменяют классические гипсовые украшения. Чтобы посмотреть формы из каталога, скачайте PDF-каталог или приезжайте в шоурум на улице Икбол.",
          },
        ],
      },
    ],
    faq: [
      {
        q: { uz: "Gips dekor o'rniga penoplast dekor qo'yish mumkinmi?", ru: "Можно ли заменить гипсовый декор пенопластовым?" },
        a: {
          uz: "Fasad uchun ha: karniz, molding, ustun va pilyastr shakllari penopolistirol asosida tayyorlanadi, ular gipsdan ancha yengil.",
          ru: "Для фасада да: формы карнизов, молдингов, колонн и пилястр изготавливаются на основе пенополистирола, он значительно легче гипса.",
        },
      },
      {
        q: { uz: "Penoplast dekor namlikdan buzilmaydimi?", ru: "Не разрушается ли пенопластовый декор от влаги?" },
        a: {
          uz: "Mahsulot namlikni o'ziga tortmaydi va shaklini yo'qotmaydi, ustida akril himoya qatlami bor.",
          ru: "Продукция не впитывает влагу и не теряет форму, сверху есть акриловый защитный слой.",
        },
      },
      {
        q: { uz: "Poliuretan dekorga nisbatan qanday?", ru: "А по сравнению с полиуретановым декором?" },
        a: {
          uz: "Poliuretan bilan solishtirma ma'lumotimiz yo'q. Biz penopolistirol asosida ishlaymiz; tanlovda mutaxassis yordam beradi.",
          ru: "Сравнительных данных с полиуретаном у нас нет. Мы работаем на основе пенополистирола; с выбором поможет специалист.",
        },
      },
      {
        q: { uz: "Ichki (interyer) dekor ham qilasizmi?", ru: "Делаете ли вы интерьерный декор?" },
        a: {
          uz: "Bu sahifa fasad uchun. Interyer mahsulotlari haqida ma'lumotni +998 99 102 02 00 raqamida aniqlashtiring.",
          ru: "Эта страница о фасаде. Информацию об интерьерной продукции уточняйте по номеру +998 99 102 02 00.",
        },
      },
    ],
    related: ['fasad-dekor-toshkent', 'karniz-fasad', 'ustun-pilyastr-dekor', 'termo-panel-fasad'],
    blogLinks: ['karniz-turlari', 'travertin-vs-penoplast'],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}
