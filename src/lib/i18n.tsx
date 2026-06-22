'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type Lang = 'uz' | 'ru';

type Dict = Record<string, string>;

const UZ: Dict = {
  // Topbar
  'top.showroom': "Showroom: Toshkent sh., Yashnabod tumani, Iqbol ko'chasi —",
  'top.map': "Xaritada ko'rish",
  'top.hours': 'Ish vaqti:',

  // Navbar
  'nav.tech': 'Texnologiya',
  'nav.facade': 'Fasad',
  'nav.callback': 'Qayta aloqa',
  'nav.portfolio': 'Portfolio',
  'nav.contact': 'Aloqa',
  'nav.catalogs': 'Kataloglar',
  'nav.cat.arch': 'Arxitektura katalogi',
  'nav.cat.main': 'Asosiy katalog (slaydlar)',
  'nav.dashboard': 'Dashboard',

  // Hero
  'hero.season.label': 'Yilning har qanday faslida ishonchli',
  'hero.season.winter': 'QISH',
  'hero.season.autumn': 'KUZ',
  'hero.season.summer': 'YOZ',
  'hero.season.spring': 'BAHOR',
  'hero.title.1': 'Uyingiz va Binongizga',
  'hero.title.2': 'Arxitektura Salobati',
  'hero.subtitle': "Panellarimiz qishda sovuqdan, yozda jaziramadan, kuz va bahorda esa namlikdan 100% himoya qiladi. G'isht ustiga to'g'ridan-to'g'ri montaj qilinadi — suvoq talab etilmaydi.",
  'hero.cta.callback': "Qayta aloqa so'rash",
  'hero.cta.catalog': 'Katalog (PDF)',
  'hero.stats.years': "yil tajriba",
  'hero.stats.projects': "loyihalar",
  'hero.stats.warranty': "yil kafolat",
  'hero.stat.warranty.v': '10 yil',
  'hero.stat.warranty.l': 'Rasmiy kafolat',
  'hero.stat.houses.v': '500+',
  'hero.stat.houses.l': 'Bajarilgan uylar',
  'hero.stat.eco.v': '100%',
  'hero.stat.eco.l': 'Ekologik toza',
  'hero.stat.amk.v': 'Premium',
  'hero.stat.amk.l': 'AMK Himoya qatlami',

  // FloatingContact
  'fc.whatsapp': 'WhatsApp',
  'fc.telegram': 'Telegram',
  'fc.call': "Qo'ng'iroq",

  // EstimateModal
  'modal.badge': 'Bepul maslahat',
  'modal.title': "Qayta aloqa so'rash",
  'modal.subtitle.1': "Ma'lumotlarni qoldiring — mutaxassisimiz",
  'modal.subtitle.bold': '15 daqiqa',
  'modal.subtitle.2': "ichida bog'lanadi.",
  'modal.label.name': 'Ismingiz',
  'modal.label.phone': 'Telefon raqamingiz',
  'modal.label.city': 'Shahar / Viloyat',
  'modal.label.area': 'Maydon (m²)',
  'modal.label.type': 'Bino turi',
  'modal.label.role': 'Siz kimsiz?',
  'modal.ph.name': 'Masalan: Dilmurod',
  'modal.ph.area': '250',
  'modal.role.owner': 'Uy egasi',
  'modal.role.master': 'Usta / Quruvchi',
  'modal.bt.residential': 'Xususiy uy / Hovli',
  'modal.bt.commercial': "Tijorat binosi (Do'kon, Ofis, H.k.)",
  'modal.bt.multistory': "Ko'p qavatli bino",
  'modal.privacy': "Ma'lumotlaringiz himoyada — uchinchi shaxslarga oshkor qilinmaydi.",
  'modal.submit': "Qayta aloqa so'rash",
  'modal.submitting': 'Yuborilmoqda…',
  'modal.success.title': "Rahmat! So'rovingiz qabul qilindi",
  'modal.success.text': "Mutaxassisimiz tez orada siz bilan telefon orqali bog'lanib, barcha savollaringizga javob beradi va bepul maslahat beradi.",
  'modal.err.name': 'Iltimos, ismingizni kiriting!',
  'modal.err.phone': "Iltimos, telefon raqamingizni to'liq kiriting!",
  'modal.err.area': 'Iltimos, taxminiy fasad maydonini kiriting (m²)!',
  'modal.toast.ok': "So'rovingiz muvaffaqiyatli yuborildi!",
  'modal.toast.err': "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",

  // Testimonials
  'tst.badge': 'Haqiqiy mijozlar',
  'tst.title.1': 'Mijozlarimiz',
  'tst.title.2': 'Fikri',
  'tst.subtitle': "Bizning ishimiz haqida ular nima deyishini o'zlaridan eshiting.",
  'tst.role.owner': 'Uy egasi',
  'tst.role.builder': 'Quruvchi',
  'tst.role.commercial': 'Tijorat binosi egasi',
  'tst.loc.tashkent': 'Toshkent viloyati',
  'tst.loc.samarkand': 'Samarqand',
  'tst.loc.bukhara': 'Buxoro',
  'tst.loc.andijan': 'Andijon',
  'tst.text.1': "Termo panellar 3sm va 5sm qalinlikda ajoyib sifatda o'rnatildi. Uydagi issiqlik izolyatsiyasi sezilarli darajada yaxshilandi, sifatiga gap bo'lishi mumkin emas!",
  'tst.text.2': "Tabiiy toshga juda o'xshashligi va g'isht ustiga to'g'ridan-to'g'ri o'rnatilishi bizga juda ma'qul keldi. Fasad dizayni ajoyib ko'rinish oldi!",
  'tst.text.3': "Karniz va kalonalar bilan fasadga termo panellar o'rnatilgandan so'ng uy butunlay premium ko'rinishga kirdi. 10 yillik kafolat berilgani ishonchli.",
  'tst.text.4': "Do'konim peshtoqiga arxitektura dekoridan kalonalar qo'ydim — mijozlarim ko'paydi. Premium ko'rinish savdoga ham ijobiy ta'sir qildi.",

  // InteractiveMap
  'map.badge': 'Keng qamrovli xizmat',
  'map.title.1': "Butun O'zbekiston Bo'ylab",
  'map.title.2': 'Loyihalar',
  'map.subtitle': 'Bizning jamoamiz Respublikamizning barcha viloyatlarida yuzlab premium fasad obyektlarini yakunlagan. Istalgan hududni bosing va bajarilgan ishlarimiz tafsiloti bilan tanishing.',
  'map.country': "O'zbekiston Respublikasi",
  'map.row.projects': 'Bajarilgan loyihalar:',
  'map.row.duration': "O'rtacha muddat:",
  'map.row.popular': "Eng ko'p tanlangan:",
  'map.cta': 'Bu hudud uchun buyurtma berish',
  'map.choose': 'Hududni tanlang',
  'map.stat.objects': 'Barcha obyektlar:',
  'map.stat.warranty': 'Kafolat:',
  'map.stat.warranty.val': '10 yil',
  'map.count.suffix': ' ta',

  // Portfolio
  'pf.badge': "500+ bajarilgan loyiha",
  'pf.title': 'Premium Portfolio',
  'pf.subtitle': "Har bir loyiha — bizning mahorat va sifatimizning isboti. Bosing va batafsil ko'ring.",
  'pf.cta.text': "Sizning uyingiz ham shunday chiroyli bo'lishi mumkin",
  'pf.cta.btn': 'Bepul smeta hisoblash',
  'pf.cta.catalog': 'Katalogni yuklab olish',

  // FacadeAnatomy
  'fa.section': 'Fasad Anatomiyasi',
  'fa.title': 'MAHSULOTLAR',
  'fa.subtitle.1': "Artline Decor premium fasad tizimlari — har bir element o'z joyida.",
  'fa.subtitle.2': "Ko'rish uchun mahsulot ustiga bosing.",
  'fa.p1.title': "O'STIRMA (TRAVERTIN)",
  'fa.p1.sub': "Tom osti qismi uchun (alkabont o'rniga) travertinli qoplama.",
  'fa.p2.title': 'KARNIZ (PROFIL)',
  'fa.p2.sub': "Binoning uslubini to'ldiradi va himoya vazifasini bajaradi.",
  'fa.p3.title': 'REYKASIMON KARNIZ',
  'fa.p3.sub': "Fasadga nafis va zamonaviy ko'rinish bag'ishlaydi.",
  'fa.p4.title': 'OYNA KARNIZLARI',
  'fa.p4.sub': 'Derazalarni bezatish va ramkalash uchun profillar.',
  'fa.p5.title': 'KOLONNA (KAPITEL)',
  'fa.p5.sub': "Binoning ulug'vorligini va klassik jozibasini ta'kidlaydi.",
  'fa.p6.title': 'TERMO PANEL',
  'fa.p6.sub': 'Issiqlikni saqlaydi, ovoz va namlikdan himoya qiladi.',
  'fa.adv.title': 'AFZALLIKLARI:',
  'fa.adv.1': 'Sifatli va mustahkam material',
  'fa.adv.2': 'Issiqlik va ovoz izolyatsiyasi',
  'fa.adv.3': 'Ob-havo sharoitiga chidamli',
  'fa.adv.4': 'Oson o\'rnatiladi, uzoq xizmat qiladi',

  // VideoShowcase
  'vs.badge': 'Video Obzorlar',
  'vs.title': 'Mahsulotlarimiz bilan albatta tanishib chiqing!',
  'vs.subtitle': "Artline Decor termo-panellari qanday tayyorlanadi, g'isht ustiga qanday montaj qilinadi va yakunda qanday hashamatli ko'rinish oladi? Barchasini vertikal videolarda tomosha qiling.",
  'vs.loading': 'Yuklanmoqda...',
  'vs.guarantee.title': '10 Yillik Rasmiy Kafolat',
  'vs.guarantee.text': "Akril tosh qoplamamiz quyoshda yemirilmaydi, yomg'ir suvini o'tkazmaydi va sovuqda yorilib ketmaydi.",

  // TrustElements
  'trust.badge': 'Sifat va Texnologiya',
  'trust.title': 'Nima uchun aynan Artline Decor?',
  'trust.subtitle': 'Biz fasad termo-panellarini nafaqat ishlab chiqaramiz, balki ularning uzoq yillar xizmat qilishini kafolatlaymiz.',
  'trust.item1.title': 'Yuqori zichlikdagi xomashyo',
  'trust.item1.desc': "ПСБ-С-25Ф va ПСБ-С-35Ф markali penopolistirol uyingiz devorlarini mustahkam qoplaydi va deformatsiyalanmaydi.",
  'trust.item1.badge': 'Maksimal izolyatsiya',
  'trust.item2.title': "Ekologik va yong'inga chidamli",
  'trust.item2.desc': "Tarkibida zaharli kimyoviy moddalar yo'q. Mahsulot o'z-o'zidan o'chuvchi (samozatuxayushchiy) xususiyatga ega.",
  'trust.item2.badge': '100% xavfsiz',
  'trust.item3.title': 'Avtomatik stanoklar aniqligi',
  'trust.item3.desc': 'Barcha elementlar avtomatlashtirilgan "protyajka" dastgohlarida tayyorlanadi. Geometriyada 1 mm ham xatolik bo\'lmaydi.',
  'trust.item3.badge': 'Ideal geometriya',
  'trust.item4.title': 'Professional montaj standarti',
  'trust.item4.desc': "Burchaklar 45° aniqlikda kesiladi, choklar ko'rinmaydi. Fasad harorat o'zgarishlariga to'liq chidamli bo'ladi.",
  'trust.item4.badge': 'Sifat kafolati',
  'trust.stat.warranty': 'Rasmiy kafolat',
  'trust.stat.warranty.suffix': ' yil',
  'trust.stat.density': 'Xomashyo zichligi',
  'trust.stat.ready': "Buyurtma tayyor bo'lishi",
  'trust.stat.ready.suffix': ' kun',
  'trust.stat.acrylic': 'Akril qoplama qalinligi',
  'trust.dl': 'Katalog va Sertifikatlarni yuklab olish (PDF)',
  'trust.mont.title': 'Biz amal qiladigan Montaj Standartlari',
  'trust.mont.r1': "Professional burchakli kesim (45°) — birikish choklari umuman ko'rinmaydi.",
  'trust.mont.r2': "Har bir chok (стык) maxsus pena-kley bilan zich to'ldirilib qotiriladi, bu esa issiqlikni saqlaydi.",
  'trust.mont.r3': "Maxsus sovuqqa va issiqqa chidamli yelimlar ishlatiladi — ko'chib ketish xavfi yo'q.",
  'trust.mont.r4': "Ustki akril qoplama quyoshning ultrabinafsha nurlaridan va qor-yomg'irdan to'liq himoyalaydi.",
  'trust.mont.r5': "Mahsulot ustidagi AMK qoplamamiz ham zarbalardan, ham tashqi haroratdan himoya qiladi va dekorativ bo'yoq yoki suyuq travertin bilan juda yaxshi kirishadi.",
  'trust.angle.title': 'Burchakli kesim standarti',
  'trust.angle.sub': "Choklar zichligi va ideal ko'rinish kafolati",

  // FAQ
  'faq.title.1': "Ko'p Beriladigan",
  'faq.title.2': 'Savollar',
  'faq.subtitle': "Mijozlarimiz tomonidan eng ko'p beriladigan savollarga javoblar. Agar sizning savolingiz ro'yxatda bo'lmasa, biz bilan bog'laning.",
  'faq.q1': "Fasad panellari yomg'ir va qorga chidamlimi?",
  'faq.a1': "Ha, bizning panellarimiz maxsus himoya qatlami bilan qoplangan bo'lib, har qanday ob-havo sharoitlariga, jumladan qor, yomg'ir va kuchli sovuqqa bardoshli. Namlikni o'ziga tortmaydi va shaklini yo'qotmaydi.",
  'faq.q2': "O'rnatish jarayoni qancha vaqt oladi?",
  'faq.a2': "Obyektning o'lchamiga qarab, o'rtacha hovli uylar (200-300 kv.m) uchun o'rnatish jarayoni 5 kundan 10 kungacha davom etadi. Panellar tayyor holda kelgani uchun jarayon juda tez kechadi.",
  'faq.q3': "Suvoqsiz g'isht ustiga to'g'ridan-to'g'ri o'rnatsa bo'ladimi?",
  'faq.a3': "Albatta! Bizning texnologiyamizning eng katta afzalligi ham shunda. Siz uyni suvoq qilishingiz shart emas. Panellarimiz to'g'ridan-to'g'ri g'isht yoki beton ustiga qotiriladi, bu esa vaqt va mablag'ingizni tejaydi.",
  'faq.q4': "Panellar uyning issiqlikni saqlashiga yordam beradimi?",
  'faq.a4': "Ha, Artline Decor panellari yuqori zichlikdagi penoplast asosiga ega bo'lib, ular mukammal issiqlik izolyatsiyasini ta'minlaydi. Qishda issiqni, yozda salqinni saqlab, energiya sarfini kamaytiradi.",
  'faq.q5': 'Kafolat muddati qancha?',
  'faq.a5': "Biz o'z mahsulotlarimiz sifatiga 100% ishonamiz, shuning uchun panellarga va ularning rangi o'zgarmasligiga 10 yillik rasmiy kafolat beramiz.",

  // Footer
  'foot.desc': "Premial fasad tizimlari — 3-in-1 texnologiyasi: dekor + izolyatsiya + himoya. 10 yillik kafolat bilan import xomashyodan tayyorlangan mahsulotlar.",
  'foot.docs': 'Hujjatlar',
  'foot.docs.catalog': 'Fasad Katalogi (PDF)',
  'foot.docs.types': 'Fasad dekor turlari',
  'foot.docs.smeta': 'Bepul smeta hisoblash',
  'foot.docs.projects': 'Bajarilgan loyihalar',
  'foot.contact': 'Aloqa & Manzil',
  'foot.address': "Toshkent sh., Yashnabod tumani, Iqbol ko'chasi (Yandex Xarita)",
  'foot.hours': 'Dush-Shan: 09:00 — 18:00',
  'foot.copy': 'Barcha huquqlar himoyalangan.',

  // Common
  'common.lang.uz': "O'zbekcha",
  'common.lang.ru': 'Русский',
};

const RU: Dict = {
  // Topbar
  'top.showroom': 'Шоурум: г. Ташкент, Яшнабадский р-н, ул. Икбол —',
  'top.map': 'Посмотреть на карте',
  'top.hours': 'Часы работы:',

  // Navbar
  'nav.tech': 'Технология',
  'nav.facade': 'Фасад',
  'nav.callback': 'Обратная связь',
  'nav.portfolio': 'Портфолио',
  'nav.contact': 'Контакты',
  'nav.catalogs': 'Каталоги',
  'nav.cat.arch': 'Архитектурный каталог',
  'nav.cat.main': 'Основной каталог (слайды)',
  'nav.dashboard': 'Панель управления',

  // Hero
  'hero.season.label': 'Надёжно в любое время года',
  'hero.season.winter': 'ЗИМА',
  'hero.season.autumn': 'ОСЕНЬ',
  'hero.season.summer': 'ЛЕТО',
  'hero.season.spring': 'ВЕСНА',
  'hero.title.1': 'Архитектурное величие',
  'hero.title.2': 'для вашего дома и здания',
  'hero.subtitle': 'Наши панели на 100% защищают от зимнего холода, летней жары и весенне-осенней влаги. Монтаж производится прямо на кирпич — штукатурка не требуется.',
  'hero.cta.callback': 'Заказать обратный звонок',
  'hero.cta.catalog': 'Каталог (PDF)',
  'hero.stats.years': 'лет опыта',
  'hero.stats.projects': 'проектов',
  'hero.stats.warranty': 'лет гарантии',
  'hero.stat.warranty.v': '10 лет',
  'hero.stat.warranty.l': 'Официальная гарантия',
  'hero.stat.houses.v': '500+',
  'hero.stat.houses.l': 'Завершённых домов',
  'hero.stat.eco.v': '100%',
  'hero.stat.eco.l': 'Экологически чисто',
  'hero.stat.amk.v': 'Premium',
  'hero.stat.amk.l': 'AMK Защитный слой',

  // FloatingContact
  'fc.whatsapp': 'WhatsApp',
  'fc.telegram': 'Telegram',
  'fc.call': 'Позвонить',

  // EstimateModal
  'modal.badge': 'Бесплатная консультация',
  'modal.title': 'Заказать обратный звонок',
  'modal.subtitle.1': 'Оставьте данные — наш специалист свяжется с вами в течение',
  'modal.subtitle.bold': '15 минут',
  'modal.subtitle.2': '.',
  'modal.label.name': 'Ваше имя',
  'modal.label.phone': 'Номер телефона',
  'modal.label.city': 'Город / Область',
  'modal.label.area': 'Площадь (м²)',
  'modal.label.type': 'Тип здания',
  'modal.label.role': 'Кто вы?',
  'modal.ph.name': 'Например: Дильмурод',
  'modal.ph.area': '250',
  'modal.role.owner': 'Владелец дома',
  'modal.role.master': 'Мастер / Строитель',
  'modal.bt.residential': 'Частный дом / Двор',
  'modal.bt.commercial': 'Коммерческое здание (магазин, офис и т.д.)',
  'modal.bt.multistory': 'Многоэтажное здание',
  'modal.privacy': 'Ваши данные под защитой — третьим лицам не передаются.',
  'modal.submit': 'Заказать обратный звонок',
  'modal.submitting': 'Отправка…',
  'modal.success.title': 'Спасибо! Ваша заявка принята',
  'modal.success.text': 'Наш специалист скоро свяжется с вами по телефону, ответит на все ваши вопросы и предоставит бесплатную консультацию.',
  'modal.err.name': 'Пожалуйста, введите ваше имя!',
  'modal.err.phone': 'Пожалуйста, введите номер телефона полностью!',
  'modal.err.area': 'Пожалуйста, укажите примерную площадь фасада (м²)!',
  'modal.toast.ok': 'Ваша заявка успешно отправлена!',
  'modal.toast.err': 'Произошла ошибка. Пожалуйста, попробуйте снова.',

  // Testimonials
  'tst.badge': 'Реальные клиенты',
  'tst.title.1': 'Отзывы',
  'tst.title.2': 'клиентов',
  'tst.subtitle': 'Узнайте от наших клиентов, что они говорят о нашей работе.',
  'tst.role.owner': 'Владелец дома',
  'tst.role.builder': 'Строитель',
  'tst.role.commercial': 'Владелец коммерческого здания',
  'tst.loc.tashkent': 'Ташкентская область',
  'tst.loc.samarkand': 'Самарканд',
  'tst.loc.bukhara': 'Бухара',
  'tst.loc.andijan': 'Андижан',
  'tst.text.1': 'Термопанели 3см и 5см толщиной установлены превосходно. Теплоизоляция дома значительно улучшилась, к качеству — никаких претензий!',
  'tst.text.2': 'Очень понравилось сходство с натуральным камнем и то, что монтаж производится прямо на кирпич. Фасад приобрёл великолепный вид!',
  'tst.text.3': 'После установки термопанелей с карнизами и колоннами дом получил поистине премиальный вид. Гарантия 10 лет вызывает доверие.',
  'tst.text.4': 'Установил колонны из архитектурного декора на фасаде магазина — клиентов стало больше. Премиальный вид положительно повлиял и на продажи.',

  // InteractiveMap
  'map.badge': 'Услуги по всей стране',
  'map.title.1': 'Проекты по всему',
  'map.title.2': 'Узбекистану',
  'map.subtitle': 'Наша команда завершила сотни премиальных фасадных объектов во всех областях Республики. Нажмите на регион и ознакомьтесь с подробностями выполненных работ.',
  'map.country': 'Республика Узбекистан',
  'map.row.projects': 'Завершено проектов:',
  'map.row.duration': 'Средний срок:',
  'map.row.popular': 'Самый востребованный:',
  'map.cta': 'Заказать для этого региона',
  'map.choose': 'Выберите регион',
  'map.stat.objects': 'Всего объектов:',
  'map.stat.warranty': 'Гарантия:',
  'map.stat.warranty.val': '10 лет',
  'map.count.suffix': ' шт.',

  // Portfolio
  'pf.badge': '500+ выполненных проектов',
  'pf.title': 'Премиум Портфолио',
  'pf.subtitle': 'Каждый проект — доказательство нашего мастерства и качества. Нажмите, чтобы посмотреть подробнее.',
  'pf.cta.text': 'Ваш дом тоже может быть таким же красивым',
  'pf.cta.btn': 'Бесплатный расчёт сметы',
  'pf.cta.catalog': 'Скачать каталог',

  // FacadeAnatomy
  'fa.section': 'Анатомия фасада',
  'fa.title': 'ПРОДУКЦИЯ',
  'fa.subtitle.1': 'Премиум фасадные системы Artline Decor — каждый элемент на своём месте.',
  'fa.subtitle.2': 'Нажмите на изделие, чтобы посмотреть.',
  'fa.p1.title': 'ПОДКРОВЕЛЬНЫЙ КАРНИЗ (ТРАВЕРТИН)',
  'fa.p1.sub': 'Травертиновое покрытие для подкровельной части (вместо алюкобонда).',
  'fa.p2.title': 'КАРНИЗ (ПРОФИЛЬ)',
  'fa.p2.sub': 'Завершает стиль здания и выполняет защитную функцию.',
  'fa.p3.title': 'РЕЕЧНЫЙ КАРНИЗ',
  'fa.p3.sub': 'Придаёт фасаду изящный и современный вид.',
  'fa.p4.title': 'ОКОННЫЕ КАРНИЗЫ',
  'fa.p4.sub': 'Профили для украшения и обрамления окон.',
  'fa.p5.title': 'КОЛОННА (КАПИТЕЛЬ)',
  'fa.p5.sub': 'Подчёркивает величественность здания и классическую элегантность.',
  'fa.p6.title': 'ТЕРМО ПАНЕЛЬ',
  'fa.p6.sub': 'Сохраняет тепло, защищает от шума и влаги.',
  'fa.adv.title': 'ПРЕИМУЩЕСТВА:',
  'fa.adv.1': 'Качественный и прочный материал',
  'fa.adv.2': 'Тепло- и звукоизоляция',
  'fa.adv.3': 'Устойчивость к погодным условиям',
  'fa.adv.4': 'Лёгкая установка, долгий срок службы',

  // VideoShowcase
  'vs.badge': 'Видео обзоры',
  'vs.title': 'Обязательно ознакомьтесь с нашей продукцией!',
  'vs.subtitle': 'Как изготавливаются термопанели Artline Decor, как монтируются прямо на кирпич и какой роскошный вид получается в итоге? Смотрите в вертикальных видео.',
  'vs.loading': 'Загрузка...',
  'vs.guarantee.title': '10-летняя официальная гарантия',
  'vs.guarantee.text': 'Наше акрилово-каменное покрытие не выгорает на солнце, не пропускает дождевую воду и не трескается на морозе.',

  // TrustElements
  'trust.badge': 'Качество и Технологии',
  'trust.title': 'Почему именно Artline Decor?',
  'trust.subtitle': 'Мы не только производим фасадные термопанели, но и гарантируем их долгую службу.',
  'trust.item1.title': 'Сырьё высокой плотности',
  'trust.item1.desc': 'Пенополистирол марок ПСБ-С-25Ф и ПСБ-С-35Ф прочно покрывает стены вашего дома и не деформируется.',
  'trust.item1.badge': 'Максимальная изоляция',
  'trust.item2.title': 'Экологичность и пожаробезопасность',
  'trust.item2.desc': 'В составе нет токсичных химических веществ. Материал обладает свойством самозатухания.',
  'trust.item2.badge': '100% безопасно',
  'trust.item3.title': 'Точность автоматических станков',
  'trust.item3.desc': 'Все элементы изготавливаются на автоматизированных «протяжных» станках. Погрешность геометрии — менее 1 мм.',
  'trust.item3.badge': 'Идеальная геометрия',
  'trust.item4.title': 'Профессиональный стандарт монтажа',
  'trust.item4.desc': 'Углы режутся точно под 45°, швы не видны. Фасад полностью устойчив к перепадам температуры.',
  'trust.item4.badge': 'Гарантия качества',
  'trust.stat.warranty': 'Официальная гарантия',
  'trust.stat.warranty.suffix': ' лет',
  'trust.stat.density': 'Плотность сырья',
  'trust.stat.ready': 'Готовность заказа',
  'trust.stat.ready.suffix': ' дня',
  'trust.stat.acrylic': 'Толщина акрилового покрытия',
  'trust.dl': 'Скачать каталог и сертификаты (PDF)',
  'trust.mont.title': 'Стандарты монтажа, которым мы следуем',
  'trust.mont.r1': 'Профессиональный угловой рез (45°) — стыки полностью не видны.',
  'trust.mont.r2': 'Каждый стык плотно заполняется специальным пено-клеем, что сохраняет тепло.',
  'trust.mont.r3': 'Используются специальные морозо- и термостойкие клеи — нет риска отслоения.',
  'trust.mont.r4': 'Верхнее акриловое покрытие полностью защищает от ультрафиолета, снега и дождя.',
  'trust.mont.r5': 'Наше AMK-покрытие защищает от ударов и внешних температур и отлично сочетается с декоративной краской или жидким травертином.',
  'trust.angle.title': 'Стандарт углового реза',
  'trust.angle.sub': 'Плотность швов и гарантия идеального вида',

  // FAQ
  'faq.title.1': 'Часто Задаваемые',
  'faq.title.2': 'Вопросы',
  'faq.subtitle': 'Ответы на самые частые вопросы наших клиентов. Если вашего вопроса нет в списке — свяжитесь с нами.',
  'faq.q1': 'Устойчивы ли фасадные панели к дождю и снегу?',
  'faq.a1': 'Да, наши панели покрыты специальным защитным слоем и устойчивы к любым погодным условиям, включая снег, дождь и сильные морозы. Не впитывают влагу и не теряют форму.',
  'faq.q2': 'Сколько времени занимает процесс установки?',
  'faq.a2': 'В зависимости от размера объекта, для частных домов (200-300 кв.м) установка занимает в среднем от 5 до 10 дней. Так как панели поставляются готовыми, процесс идёт очень быстро.',
  'faq.q3': 'Можно ли монтировать прямо на кирпич без штукатурки?',
  'faq.a3': 'Конечно! В этом главное преимущество нашей технологии. Вам не нужно штукатурить дом. Наши панели крепятся прямо на кирпич или бетон, что экономит ваше время и средства.',
  'faq.q4': 'Помогают ли панели сохранять тепло в доме?',
  'faq.a4': 'Да, панели Artline Decor имеют основу из пенопласта высокой плотности, обеспечивающую отличную теплоизоляцию. Сохраняют тепло зимой и прохладу летом, снижая расход энергии.',
  'faq.q5': 'Какой срок гарантии?',
  'faq.a5': 'Мы на 100% уверены в качестве своей продукции, поэтому предоставляем 10-летнюю официальную гарантию на панели и сохранение их цвета.',

  // Footer
  'foot.desc': 'Премиум фасадные системы — технология 3-в-1: декор + изоляция + защита. Продукция из импортного сырья с 10-летней гарантией.',
  'foot.docs': 'Документы',
  'foot.docs.catalog': 'Каталог фасадов (PDF)',
  'foot.docs.types': 'Виды фасадного декора',
  'foot.docs.smeta': 'Бесплатный расчёт сметы',
  'foot.docs.projects': 'Выполненные проекты',
  'foot.contact': 'Контакты & Адрес',
  'foot.address': 'г. Ташкент, Яшнабадский р-н, ул. Икбол (Яндекс Карта)',
  'foot.hours': 'Пн-Сб: 09:00 — 18:00',
  'foot.copy': 'Все права защищены.',

  // Common
  'common.lang.uz': "O'zbekcha",
  'common.lang.ru': 'Русский',
};

const DICTS: Record<Lang, Dict> = { uz: UZ, ru: RU };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: 'uz', setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('artline-lang') as Lang | null;
      if (saved === 'ru' || saved === 'uz') setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('artline-lang', l); } catch {}
  }, []);

  const t = useCallback((key: string) => {
    return DICTS[lang][key] ?? DICTS.uz[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
