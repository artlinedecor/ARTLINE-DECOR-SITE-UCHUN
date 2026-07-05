export interface Article {
  slug: string;
  date: string;
  image: string;
  readTime: {
    uz: string;
    ru: string;
  };
  title: {
    uz: string;
    ru: string;
  };
  description: {
    uz: string;
    ru: string;
  };
  keywords: {
    uz: string;
    ru: string;
  };
  content: {
    uz: string;
    ru: string;
  };
}

export const ARTICLES: Article[] = [
  {
    slug: 'fasad-izolyatsiya-qanday-qilinadi',
    date: '2026-06-20',
    image: '/blog/insulation.jpg',
    readTime: { uz: '5 daqiqa', ru: '5 минут' },
    title: {
      uz: "Fasad izolyatsiyasi qanday qilinadi? Issiqlik va energiya tejash sirlari",
      ru: "Как делается фасадная изоляция? Секреты утепления и энергосбережения"
    },
    description: {
      uz: "Uy fasadini issiqlik izolyatsiya qilish jarayoni, ishlatiladigan materiallar va zamonaviy termo panellar yordamida montaj qilish tartibi haqida batafsil ma'lumot.",
      ru: "Подробное руководство по утеплению фасада дома в Ташкенте. Технологии фасадной изоляции, материалы и этапы монтажа термопанелей."
    },
    keywords: {
      uz: "issiqlik izolyatsiya fasad, fasad montaj, fasad ta'mirlash, fasad dekor Toshkent, penoplast dekor, termo panel narxi",
      ru: "утепление фасада Ташкент, фасадная изоляция, фасадные работы Ташкент, термопанели цена Узбекистан, фасадный декор Ташкент"
    },
    content: {
      uz: `
        <p>Hozirgi vaqtda energiya resurslarini tejash va uyni qishda issiq, yozda esa salqin saqlash har bir uy egasi uchun dolzarb masaladir. Binoning issiqlik yo'qotishining deyarli 30-40% qismi aynan devorlar orqali sodir bo'ladi. Shuning uchun <strong>issiqlik izolyatsiya fasad</strong> tizimlarini to'g'ri o'rnatish muhim ahamiyatga ega.</p>
        
        <h2>Fasadni izolyatsiya qilishning afzalliklari</h2>
        <ul>
          <li><strong>Energiya tejash:</strong> Isitish va sovutish tizimlari uchun sarflanadigan xarajatlar 40-50% gacha kamayadi.</li>
          <li><strong>Mog'or va namlikdan himoya:</strong> Devorlar muzlab qolmaydi va xonadon ichida kondensat hosil bo'lmaydi.</li>
          <li><strong>Tovush izolyatsiyasi:</strong> Ko'chadagi shovqinlar uy ichiga kamroq kiradi.</li>
          <li><strong>Estetik ko'rinish:</strong> Zamonaviy termo panellar yordamida bino ham izolyatsiya qilinadi, ham chiroyli <strong>fasad dizayn</strong> ko'rinishiga ega bo'ladi.</li>
        </ul>

        <h2>Fasad montaj va izolyatsiya jarayoni bosqichlari</h2>
        <p>Fasadni sifatli izolyatsiya qilish va uzoq yillar xizmat ko'rsatishini ta'minlash uchun montaj ishlari quyidagi tartibda amalga oshirilishi lozim:</p>
        
        <h3>1. Tayyorgarlik ishlari</h3>
        <p>Har qanday <strong>fasad montaj</strong> jarayoni sirtni tayyorlashdan boshlanadi. Agar devorda eski ko'chayotgan suvoq, bo'yoq yoki chang bo'lsa, ularni tozalash zarur. Artline Decor termo panellarining eng katta afzalligi shundaki, ularni to'g'ridan-to'g'ri g'isht ustiga montaj qilish mumkin — qo'shimcha suvoq ishlari talab etilmaydi.</p>

        <h3>2. Yelimlash va mustahkamlash</h3>
        <p>Izolyatsiya materiali (penoplast yoki termo panel) devorga maxsus sovuqqa va issiqqa chidamli yelim (pena-kley yoki quruq qorishma yelim) yordamida yopishtiriladi. Panellar devorga zich holda, burchaklari 45° aniqlikda birlashtirilib joylashtiriladi. Bu esa <em>choklar ko'rinmasligini</em> va sovuq ko'prikchalari hosil bo'lmasligini ta'minlaydi.</p>

        <h3>3. Mexanik mustahkamlash (Duybellash)</h3>
        <p>Panellar yopishtirilgandan so'ng, ularni shamol yuki ta'sirida ko'chib ketmasligi uchun maxsus plastik soyabonsimon duybellar ("gribok") yordamida devorga qo'shimcha mahkamlanadi.</p>

        <h3>4. Choklarni to'ldirish va himoya qatlami</h3>
        <p>Panellar orasidagi masofalar maxsus ko'pik yordamida zichlanadi. Ustidan esa AMK himoya qatlami yoki akril asosli tosh qoplamalari yordamida choklar yopiladi. Bu qadam <strong>fasad ta'mirlash</strong> zaruratini o'n yillar davomida kechiktiradi.</p>

        <h2>Nima uchun tayyor termo panellarni tanlash ma'qul?</h2>
        <p>An'anaviy usulda (penoplast yopishtirib, ustidan setka tortib, suvoq va travertin qilish) juda ko'p vaqt va mehnat talab etiladi. Tayyor <strong>termo panel narxi</strong> dastlab qimmatroq tuyulishi mumkin, lekin montaj tezligi, ustalar haqi va materiallarning chidamliligini hisobga olganda, u ancha tejamkordir. Artline Decor taklif etayotgan 3-in-1 tizimi dekorativ ko'rinish, issiqlik izolyatsiyasi va mexanik himoyani o'zida birlashtiradi.</p>
        
        <p>Agar siz Toshkentda yoki O'zbekistonning boshqa hududlarida uyingiz fasadini ta'mirlamoqchi bo'lsangiz, bizning professional jamoamizga murojaat qiling va bepul smeta xizmatidan foydalaning!</p>
      `,
      ru: `
        <p>В современных условиях экономия энергоресурсов и поддержание комфортной температуры в доме круглый год — приоритетная задача для каждого домовладельца. Около 30-40% тепла уходит именно через неутепленные стены. Поэтому профессиональная <strong>фасадная изоляция</strong> является первой необходимостью при строительстве и реконструкции зданий.</p>
        
        <h2>Преимущества утепления фасада дома</h2>
        <ul>
          <li><strong>Снижение расходов:</strong> Затраты на отопление зимой и кондиционирование летом снижаются до 40-50%.</li>
          <li><strong>Защита от влаги и плесени:</strong> Точка росы смещается наружу, благодаря чему стены не промерзают и не отсыревают изнутри.</li>
          <li><strong>Звукоизоляция:</strong> Снижается уровень уличного шума в комнатах.</li>
          <li><strong>Премиальный внешний вид:</strong> Современные фасадные материалы позволяют совместить утепление и изысканный <strong>декор дома снаружи</strong>.</li>
        </ul>

        <h2>Этапы проведения фасадных работ</h2>
        <p>Чтобы <strong>утепление фасада Ташкент</strong> прослужило более 30-50 лет без потери свойств, необходимо строго соблюдать технологический процесс:</p>
        
        <h3>1. Подготовка основания</h3>
        <p>Любые <strong>фасадные работы Ташкент</strong> начинаются с очистки поверхности. Важно убрать старую отслаивающуюся штукатурку, грязь и пыль. Преимущество термопанелей Artline Decor в том, что они могут монтироваться непосредственно на ровную кирпичную кладку или бетонные блоки без предварительного оштукатуривания.</p>

        <h3>2. Нанесение клеевого состава</h3>
        <p>Термопанели крепятся на стену с помощью морозо- и влагостойкого полиуретанового клея-пены или цементных клеевых смесей. Панели укладываются со смещением швов. Для идеального примыкания на углах элементы подрезаются под углом 45 градусов.</p>

        <h3>3. Дополнительное дюбелирование</h3>
        <p>После высыхания клея плиты утеплителя дополнительно фиксируются тарельчатыми дюбелями («грибками»). Это гарантирует устойчивость фасада при сильных ветровых нагрузках.</p>

        <h3>4. Герметизация стыков и финишная отделка</h3>
        <p>Стыки между термопанелями заполняются фасадным герметиком или затирочной пастой в цвет швов. Поверхность термопанелей Artline Decor уже имеет защитное акрилово-каменное покрытие, которое защищает пенополистирол от ультрафиолета и механических повреждений.</p>

        <h2>Почему выгодно купить готовые фасадные панели?</h2>
        <p>Классический «мокрый фасад» состоит из 5-6 слоев, каждый из которых требует времени на высыхание. Готовые <strong>термопанели с травертином</strong> или мраморной крошкой монтируются в 3 раза быстрее. Изучая <strong>термопанели цена Узбекистан</strong>, помните, что вы платите за готовое решение: утеплитель + защитный слой + декоративный вид под ключ. Это снижает затраты на оплату работы строителей и исключает риск технологических ошибок.</p>
        
        <p>Если вы ищете качественный <strong>фасадный декор Ташкент</strong> и профессиональный монтаж, свяжитесь со специалистами Artline Decor. Мы сделаем расчет сметы бесплатно!</p>
      `
    }
  },
  {
    slug: 'travertin-vs-penoplast',
    date: '2026-06-21',
    image: '/blog/travertine-vs-polystyrene.jpg',
    readTime: { uz: '6 daqiqa', ru: '6 минут' },
    title: {
      uz: "Travertin qoplama yoki penoplast dekor? Uyingiz uchun qaysi biri yaxshiroq?",
      ru: "Травертин или пенопластовый декор? Что лучше выбрать для фасада?"
    },
    description: {
      uz: "Tabiiy travertin fasad va penoplast asosidagi tayyor fasad panellarini solishtirish. Ularning narxi, montaji, chidamliligi va afzalliklari.",
      ru: "Сравнение классической облицовки травертином и готового пенопластового декора. Цены, долговечность, вес и скорость монтажа в Узбекистане."
    },
    keywords: {
      uz: "travertin qoplama, travertin fasad, penoplast dekor, fasad dekor Toshkent, fasad dizayn, uy fasadi",
      ru: "облицовка фасада травертином, травертин фасад, пенопласт декор фасад, термопанели с травертином, фасадные панели купить, фасадные работы Ташкент"
    },
    content: {
      uz: `
        <p>O'zbekistonda uylarni bezashda eng ko'p ishlatiladigan ikki xil usul mavjud: an'anaviy <strong>travertin qoplama</strong> (suyuq yoki tabiiy tosh shaklida) va zamonaviy <strong>penoplast dekor</strong> asosidagi tayyor fasad tizimlari. Ko'pchilik mijozlarimiz ushbu ikki material orasida qaysi birini tanlashni bilmay ikkilanishadi. Keling, ularni asosiy parametrlar bo'yicha solishtiramiz.</p>
        
        <h2>1. Og'irlik va binoga tushadigan yuklama</h2>
        <p>Tabiiy travertin toshi juda og'ir materialdir. Uni devorga o'rnatish poydevor va devorlarga katta og'irlik yuki beradi. Bu esa eski binolarni ta'mirlashda xavfli bo'lishi mumkin. Penoplast asosidagi tayyor <strong>travertin fasad</strong> panellari esa juda yengil bo'lib, bino poydevoriga deyarli og'irlik yuklamaydi va seysmik jihatdan ancha xavfsizdir.</p>
        
        <h2>2. Issiqlik izolyatsiyasi</h2>
        <ul>
          <li><strong>Travertin toshi:</strong> O'zidan sovuq va issiqni osongina o'tkazadi, ya'ni bino devorlarini izolyatsiya qilmaydi. Shovqinni to'sish xususiyati ham past.</li>
          <li><strong>Penoplast dekor (Termo panellar):</strong> Tarkibida yuqori zichlikdagi penopolistirol (PSB-S-25F yoki 35F) bo'lgani uchun uyni qishda muzlab qolishdan, yozda esa qizib ketishdan 100% himoya qiladi. Bu haqiqiy <em>issiqlik izolyatsiyasi</em> demakdir.</li>
        </ul>

        <h2>3. Montaj tezligi va murakkabligi</h2>
        <p>Tabiiy travertinni kesish, silliqlash va devorga qotirish (ayniqsa, baland qavatlarda) juda ko'p vaqt va yuqori malakali ustalarni talab qiladi. Suyuq travertin suvoq qilish ham havoning harorati va namligiga o'ta sezgir jarayondir. Tayyor penoplast panellar esa zavodda tayyor qoplangan holda keladi va ularni <strong>fasad montaj</strong> qilish 3-4 barobar tezroq tugaydi.</p>

        <h2>4. Narxlar solishtiruvi (Fasad panellari narxi)</h2>
        <p>Tabiiy tosh va uni o'rnatish ishlari juda qimmat turadi. Tayyor <strong>fasad panellari narxi</strong> tabiiy travertindan 2-3 baravar arzonroq. Shu bilan birga, siz uyni issiqlik izolyatsiyasi qilish xarajatlaridan ham tejaysiz, chunki panellarimiz dekor va izolyatsiyani bitta mahsulotda taqdim etadi.</p>

        <h2>Muqobil yechim: Travertin qoplamali termo panellar</h2>
        <p>Agar sizga tabiiy travertin jozibasi yoqsa va shu bilan birga uyingiz issiq bo'lishini xohlasangiz, eng yaxshi yechim — <strong>travertinli termo panellar</strong>. Artline Decor zavodida ishlab chiqariladigan panellarning ustki qatlami tabiiy marmar va travertin kukunidan tayyorlangan akril qoplama bilan qoplangan. Tashqi ko'rinishidan u tabiiy travertindan umuman farq qilmaydi, lekin u yengil, issiq va arzon!</p>

        <h2>Qiyosiy jadval:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--accent-gold); text-align: left;">
              <th style="padding: 10px;">Xususiyati</th>
              <th style="padding: 10px;">Tabiiy Travertin</th>
              <th style="padding: 10px;">Artline Decor Panellari</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Issiqlik saqlash</strong></td>
              <td style="padding: 10px; color: #f56565;">Yo'q (0%)</td>
              <td style="padding: 10px; color: #48bb78;">A'lo (100%)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Vazni</strong></td>
              <td style="padding: 10px; color: #f56565;">O'ta og'ir</td>
              <td style="padding: 10px; color: #48bb78;">Juda yengil</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>O'rnatish muddati</strong></td>
              <td style="padding: 10px; color: #f56565;">20-30 kun</td>
              <td style="padding: 10px; color: #48bb78;">5-10 kun</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Kafolat</strong></td>
              <td style="padding: 10px;">Ustaga bog'liq</td>
              <td style="padding: 10px; color: #48bb78;">10 yil rasmiy</td>
            </tr>
          </tbody>
        </table>

        <p>Xulosa qilib aytganda, zamonaviy texnologiyalar uyingizni ham chiroyli, ham tejamkor qilish imkonini beradi. Artline Decor shourumiga tashrif buyurib, namunalarimizni o'z ko'zingiz bilan ko'ring.</p>
      `,
      ru: `
        <p>В Узбекистане при отделке фасадов наиболее популярны два направления: классическая <strong>облицовка фасада травертином</strong> (в виде плитки или жидкого нанесения) и современный <strong>пенопласт декор фасад</strong> (готовые термопанели). Каждый материал имеет свои особенности. Давайте объективно сравним их по ключевым показателям.</p>
        
        <h2>1. Нагрузка на конструкцию дома</h2>
        <p>Натуральный травертин — тяжелый камень. Его монтаж создает колоссальную нагрузку на стены и фундамент дома, что требует точных расчетов и укрепления конструкции. В то же время готовый декор из пенополистирола весит в 15-20 раз меньше. Он идеален как для новых домов, так и для реконструкции старых зданий, не создавая угроз усадки.</p>
        
        <h2>2. Теплоизоляционные свойства</h2>
        <ul>
          <li><strong>Травертин камень:</strong> Не обладает теплоизоляционными характеристиками. Стены будут промерзать зимой так же, как и без облицовки.</li>
          <li><strong>Термопанели с травертином:</strong> За счет основы из пенопласта высокой плотности (ПСБ-С) они создают надежный тепловой барьер. Это полноценное утепление и защита дома от перепадов температур.</li>
        </ul>

        <h2>3. Сложность и сроки монтажа</h2>
        <p>Укладка плитки травертина — долгий и пыльный процесс, требующий высокой квалификации мастеров. Стоимость ошибок высока (плитка может отвалиться при плохом клее). Напротив, готовые панели Artline Decor изготавливаются на заводе и собираются на объекте как конструктор. Сроки фасадных работ сокращаются в несколько раз.</p>

        <h2>4. Цена вопроса (купить фасадные панели)</h2>
        <p>Натуральный травертин стоит дорого как в закупке, так и в монтаже. В то же время, решая <strong>фасадные панели купить</strong> от производителя Artline Decor, вы экономите до 60% бюджета. При этом вы получаете одновременно и великолепную фактуру натурального камня, и готовое утепление.</p>

        <h2>Оптимальный выбор: Термопанели с травертиновым напылением</h2>
        <p>Зачем идти на компромисс, выбирая между красотой камня и теплом? Специально для этого разработаны термопанели с акрилово-травертиновым покрытием. На пенопластовую основу наносится слой натуральной травертиновой и мраморной крошки на акриловом связующем. На вид это 100% натуральный <strong>травертин фасад</strong>, но при этом теплый, легкий и экономичный.</p>

        <h2>Сравнительная таблица:</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.9rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--accent-gold); text-align: left;">
              <th style="padding: 10px;">Характеристика</th>
              <th style="padding: 10px;">Натуральный травертин</th>
              <th style="padding: 10px;">Панели Artline Decor</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Теплоизоляция</strong></td>
              <td style="padding: 10px; color: #f56565;">Отсутствует (0%)</td>
              <td style="padding: 10px; color: #48bb78;">Отличная (100%)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Вес облицовки</strong></td>
              <td style="padding: 10px; color: #f56565;">Тяжелый (до 40 кг/м²)</td>
              <td style="padding: 10px; color: #48bb78;">Очень легкий (до 4 кг/м²)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Сроки установки</strong></td>
              <td style="padding: 10px; color: #f56565;">Долгая работа (2-4 недели)</td>
              <td style="padding: 10px; color: #48bb78;">Быстрый монтаж (5-10 дней)</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="padding: 10px;"><strong>Официальная гарантия</strong></td>
              <td style="padding: 10px;">Нет</td>
              <td style="padding: 10px; color: #48bb78;">10 лет от завода</td>
            </tr>
          </tbody>
        </table>

        <p>Свяжитесь с нами сегодня, чтобы узнать актуальные цены на термопанели и получить профессиональную консультацию по отделке вашего дома в Узбекистане.</p>
      `
    }
  },
  {
    slug: 'karniz-turlari',
    date: '2026-06-22',
    image: '/blog/cornice-types.jpg',
    readTime: { uz: '4 daqiqa', ru: '4 минут' },
    title: {
      uz: "Fasad uchun karniz va molding turlari: To'g'ri tanlash bo'yicha tavsiyalar",
      ru: "Виды фасадных карнизов и молдингов: советы по выбору декора"
    },
    description: {
      uz: "Arxitektura bezaklarining asosiy elementlari: karniz dekor, molding fasad, ustun va pilyastrlar. Ularning bino ko'rinishidagi o'rni va turlari.",
      ru: "Классификация архитектурного декора для фасада дома. Фасадные карнизы, декоративные молдинги, колонны и пилястры в дизайне здания."
    },
    keywords: {
      uz: "karniz dekor, molding fasad, ustun dekor, pilyastr, arxitektura dekor, binolar fasadi, fasad bezak",
      ru: "карниз фасадный, молдинг декоративный, колонны декоративные, пилястры фасадные, архитектурный декор, декор дома снаружи"
    },
    content: {
      uz: `
        <p>Bino fasadiga tugallangan va hashamatli ko'rinish berishda dekorativ elementlarning o'rni beqiyosdir. Biz ko'pincha tekis devorlarni chiroyli chiziqlar, naqshlar va bo'rtma shakllar bilan bezatilganini ko'ramiz. Bu bezaklar <strong>arxitektura dekor</strong> san'atining ajralmas qismi hisoblanadi. Bugun biz eng ommabop dekor turlari: karniz, molding, ustun va pilyastrlar haqida gaplashamiz.</p>
        
        <h2>Fasad karnizlari (Karniz dekor)</h2>
        <p>Karnizlar binoning gorizontal chiziqlarini ta'kidlash, qavatlarni ajratish va tom osti qismini chiroyli bezash uchun ishlatiladi. Vazifasiga ko'ra karnizlar quyidagi turlarga bo'linadi:</p>
        <ul>
          <li><strong>Tom osti karnizlari:</strong> Binoning eng yuqori qismida, tom va devor tutashgan joyda o'rnatiladi. Ular binoni vizual ravishda balandroq va salobatli ko'rsatadi.</li>
          <li><strong>Qavatlararo karnizlar:</strong> Ko'p qavatli uylarda qavatlarni bir-biridan ajratish va fasadga dinamika berish uchun xizmat qiladi.</li>
          <li><strong>Oyna usti karnizlari:</strong> Deraza va eshik teshiklarining yuqori qismini bezash uchun qo'llaniladi.</li>
        </ul>

        <h2>Fasad moldinglari (Molding fasad)</h2>
        <p>Molding — bu devor yuzasida naqshlar, ramkalar yaratish va tekis yuzalarni vizual bo'lish uchun ishlatiladigan dekorativ chiziqdir. <strong>Molding fasad</strong> bezaklarida ko'pincha derazalarni ramkalash (obnalichka), burchaklarni ajratish va turli rangdagi qoplamalarni chiroyli tutashtirish uchun xizmat qiladi. Ular uyni yanada nafis va klassik ko'rsatadi.</p>

        <h2>Ustunlar va Pilyastrlar (Ustun dekor & Pilyastr)</h2>
        <p>Uylar va <strong>binolar fasadi</strong> ulug'vor ko'rinishi uchun qadim zamonlardan beri ustunlardan foydalanib kelingan:</p>
        <ul>
          <li><strong>Ustun (Kolonna):</strong> To'liq aylanma bo'lgan arxitektura elementi bo'lib, u ham yuk ko'taruvchi, ham sof dekorativ vazifani bajarishi mumkin. <strong>Ustun dekor</strong> elementlari kirish guruhlari (porch), peshtoqlar va terassalarda juda go'zal turadi.</li>
          <li><strong>Pilyastr (Pilaster):</strong> Devordan biroz bo'rtib chiqqan, to'rtburchak shakldagi "yarim ustun" dir. Pilyastrlar yuk ko'tarmaydi, lekin devor yuzasini qismlarga bo'lib, klassik saroy uslubini yaratadi.</li>
        </ul>

        <h2>Artline Decor dekorativ profillarining afzalligi</h2>
        <p>Ilgari bunday elementlar og'ir gips yoki beton qorishmalardan tayyorlanar edi. Ularni tayyorlash va o'rnatish oylar davomida cho'zilib, bino devorlariga katta yuk berardi. Artline Decor kompaniyasi yuqori zichlikdagi penoplastdan tayyorlangan va usti mustahkam akril-klinker qoplamali yengil profillarni taklif etadi. Ular:</p>
        <ul>
          <li>Suv o'tkazmaydi, quyoshda yemirilmaydi va yorilmaydi;</li>
          <li>Juda yengil, montaji oddiy va tez;</li>
          <li>Narxi an'anaviy gipsli bezaklardan bir necha barobar tejamkor.</li>
        </ul>
        
        <p>Uyingizning <strong>fasad bezak</strong> ishlarini rejalashtirishda bizning arxitektorlarimiz bilan maslahatlashing. Biz sizga uyingiz dizayniga mos keladigan eng chiroyli profil turlarini tanlashda yordam beramiz!</p>
      `,
      ru: `
        <p>Декоративные элементы играют решающую роль в придании фасаду здания завершенного, гармоничного и роскошного вида. Именно они превращают обычную кирпичную или бетонную коробку в произведение искусства. Этот стиль формирует <strong>архитектурный декор</strong>, основными элементами которого являются карнизы, молдинги, колонны и пилястры.</p>
        
        <h2>Фасадные карнизы (Карниз фасадный)</h2>
        <p>Карнизы служат для зонирования фасада по горизонтали, разделения этажей и оформления подкровельного пространства. По месту установки они делятся на:</p>
        <ul>
          <li><strong>Подкровельные карнизы:</strong> Устанавливаются на стыке стены и крыши. Они защищают стены от осадков и визуально увеличивают высоту здания.</li>
          <li><strong>Межэтажные карнизы:</strong> Разделяют этажи, придавая строению соразмерность и выразительность.</li>
          <li><strong>Оконные карнизы:</strong> Оформляют верхнюю часть оконных проемов, выделяя их на плоскости стены.</li>
        </ul>

        <h2>Декоративные молдинги (Молдинг декоративный)</h2>
        <p>Молдинг — это накладная объемная планка, которая используется для декорирования стен, создания рамок и обрамлений. На фасаде молдинги незаменимы при оформлении окон (наличники), создании фальш-панелей и зонировании различных типов отделки. Молдинг придает зданию элегантность и утонченность.</p>

        <h2>Колонны и пилястры (Колонны декоративные & Пилястры фасадные)</h2>
        <p>Для придания фасадам монументальности и дворцового величия используются вертикальные элементы:</p>
        <ul>
          <li><strong>Колонны декоративные:</strong> Отдельно стоящие круглые опоры, которые в современном строительстве чаще всего выполняют декоративную роль, украшая входные группы, балконы и террасы.</li>
          <li><strong>Пилястры фасадные:</strong> Плоские вертикальные выступы, имитирующие колонну, но утопленные в стену. Пилястры визуально укрепляют углы здания и расставляют классические акценты.</li>
        </ul>

        <h2>Преимущества легкого декора из пенополистирола от Artline Decor</h2>
        <p>Раньше весь <strong>декор дома снаружи</strong> изготавливался из тяжелого бетона или хрупкого гипса. Их монтаж занимал недели, требовал кранов и нагружал фундамент. Продукция Artline Decor производится из пенопласта высокой плотности с защитным армирующим слоем из акрила и мраморной крошки. Это обеспечивает:</p>
        <ul>
          <li>Легкий вес элементов — безопасность и быстрый монтаж;</li>
          <li>Стойкость к растрескиванию на морозе и выгоранию на солнце;</li>
          <li>Экономию бюджета — производство и установка обходятся гораздо дешевле аналогов из бетона или гипса.</li>
        </ul>
        
        <p>Сделайте облик вашего дома неповторимым с помощью архитектурного декора Artline Decor. Позвоните нам, и мы поможем подобрать идеальные элементы под ваш дизайн-проект.</p>
      `
    }
  }
];
