'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
  'hero.season.rain': 'YOMG\'IR',
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
  'hero.season.rain': 'ДОЖДЬ',
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

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
