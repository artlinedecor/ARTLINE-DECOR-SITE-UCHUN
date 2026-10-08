import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustElements from '@/components/landing/TrustElements';
import FacadeAnatomy from '@/components/landing/FacadeAnatomy';
import VideoShowcase from '@/components/landing/VideoShowcase';

import Portfolio from '@/components/landing/Portfolio';
import InteractiveMap from '@/components/landing/InteractiveMap';
import VideoTestimonials from '@/components/landing/VideoTestimonials';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import EstimateModal from '@/components/landing/EstimateModal';
import FloatingContact from '@/components/landing/FloatingContact';
import ScrollReveal from '@/components/effects/ScrollReveal';

import { LangProvider } from '@/lib/i18n';
import { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';

  if (lang === 'ru') {
    return {
      title: "Artline Decor: фасадный декор, травертин, утепление, Ташкент",
      description: "Производство и монтаж фасадных панелей, облицовка травертином, утепление фасада, карнизы и молдинги в Ташкенте. Технология 3-в-1, гарантия 10 лет.",
      keywords: "фасадный декор Ташкент, травертин фасад, термопанели цена Узбекистан, утепление фасада Ташкент, карниз фасадный, молдинг декоративный, фасадные панели купить, пенопласт декор фасад, колонны декоративные, пилястры фасадные, архитектурный декор, облицовка фасада травертином, фасадная изоляция, декор дома снаружи, термопанели с травертином, фасадные работы Ташкент",
      alternates: {
        canonical: "https://artlinedecor.uz/?lang=ru",
        languages: {
          'uz-UZ': 'https://artlinedecor.uz',
          'ru-RU': 'https://artlinedecor.uz/?lang=ru',
          'x-default': 'https://artlinedecor.uz',
        }
      },
      openGraph: {
        title: "Artline Decor — Фасадный Декор, Травертин, Утепление Фасада | Ташкент",
        description: "Фасадные панели, облицовка травертином, карнизы, молдинги с гарантией 10 лет. 3-в-1: декор + изоляция + защита.",
        url: "https://artlinedecor.uz/?lang=ru",
        siteName: "Artline Decor",
        locale: "ru_RU",
        type: "website",
        images: [
          {
            url: "https://artlinedecor.uz/logo.png",
            width: 1024,
            height: 1024,
            alt: "Artline Decor",
          }
        ]
      },
      twitter: {
        card: "summary",
        title: "Artline Decor — Фасадный Декор, Травертин, Утепление Фасада",
        description: "Фасадные панели, облицовка травертином, карнизы, молдинги с гарантией 10 лет. 3-в-1: декор + изоляция + защита.",
        images: ["https://artlinedecor.uz/logo.png"],
      }
    };
  } else {
    return {
      title: "Artline Decor: fasad dekor, travertin, izolyatsiya, Toshkent",
      description: "Artline Decor — fasad panellari, travertin, issiqlik izolyatsiyasi, karniz, molding ishlab chiqaruvchi. 3-in-1: dekor + izolyatsiya + himoya, 10 yillik kafolat.",
      keywords: "fasad dekor Toshkent, fasad panellari narxi, travertin qoplama, travertin fasad, issiqlik izolyatsiya fasad, termo panel narxi, karniz dekor, molding fasad, ustun dekor, pilyastr, penoplast dekor, fasad bezak, fasad dizayn, uy fasadi, binolar fasadi, arxitektura dekor, fasad ta'mirlash, fasad montaj",
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
        images: [
          {
            url: "https://artlinedecor.uz/logo.png",
            width: 1024,
            height: 1024,
            alt: "Artline Decor",
          }
        ]
      },
      twitter: {
        card: "summary",
        title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya | Toshkent",
        description: "Fasad panellari, travertin, karniz, molding — 10 yillik rasmiy kafolat. 3-in-1: dekor + izolyatsiya + himoya.",
        images: ["https://artlinedecor.uz/logo.png"],
      }
    };
  }
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://artlinedecor.uz/#website",
    "name": "Artline Decor",
    "url": "https://artlinedecor.uz",
    "inLanguage": ["uz", "ru"],
    "publisher": { "@id": "https://artlinedecor.uz/#organization" }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://artlinedecor.uz/#organization",
    "name": "Artline Decor",
    "url": "https://artlinedecor.uz",
    "logo": "https://artlinedecor.uz/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998-99-102-02-00",
      "contactType": "sales",
      "areaServed": "UZ",
      "availableLanguage": ["Uzbek", "Russian"]
    },
    "sameAs": [
      "https://t.me/Art_linedecor",
      "https://www.instagram.com/artlinedecor.uz?igsh=MWR4c2JoaGtobTl1Nw==",
      "https://www.youtube.com/@art.linedecor",
      "https://yandex.uz/maps/org/artlinedecor/138602828044/?ll=69.417322%2C41.303890"
    ]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Artline Decor",
    "image": "https://artlinedecor.uz/logo.png",
    "@id": "https://artlinedecor.uz/#localbusiness",
    "url": "https://artlinedecor.uz",
    "parentOrganization": { "@id": "https://artlinedecor.uz/#organization" },
    "areaServed": { "@type": "City", "name": lang === 'ru' ? "Ташкент" : "Toshkent" },
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
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": lang === 'ru' ? "Фасадные Термопанели и Декор" : "Fasad Termo Panellari va Dekor",
    "image": "https://artlinedecor.uz/logo.png",
    "description": lang === 'ru' 
      ? "Качественные фасадные термопанели и архитектурный декор от производителя в Ташкенте с гарантией 10 лет."
      : "Toshkentda ishlab chiqaruvchidan 10 yillik kafolatli sifatli fasad termo panellari va arxitektura dekorativ elementlari.",
    "brand": {
      "@type": "Brand",
      "name": "Artline Decor"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "UZS",
      "lowPrice": "65000",
      "highPrice": "150000",
      "offerCount": "20",
      "areaServed": "UZ"
    }
  };

  return (
    <LangProvider defaultLang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <Navbar />
      <main>
        <Hero />
        <ScrollReveal><FacadeAnatomy /></ScrollReveal>
        <ScrollReveal><TrustElements /></ScrollReveal>
        <ScrollReveal><VideoShowcase /></ScrollReveal>

        <ScrollReveal><Portfolio /></ScrollReveal>
        <ScrollReveal><InteractiveMap /></ScrollReveal>
        <ScrollReveal><VideoTestimonials /></ScrollReveal>
        <ScrollReveal><FAQ /></ScrollReveal>
      </main>
      <Footer />
      <EstimateModal />
      <FloatingContact />
    </LangProvider>
  );
}
