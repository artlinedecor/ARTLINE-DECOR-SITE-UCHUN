import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import EstimateModal from '@/components/landing/EstimateModal';
import FloatingContact from '@/components/landing/FloatingContact';
import JsonLd from '@/components/seo/JsonLd';
import { LangProvider } from '@/lib/i18n';
import { SERVICE_PAGES } from '@/lib/service-pages';
import { Metadata } from 'next';

const BASE = 'https://artlinedecor.uz';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

const TEXT = {
  uz: {
    title: "Fasad dekor mahsulotlari va xizmatlari, Toshkent | Artline Decor",
    description: "Artline Decor mahsulotlari: fasad dekor, karniz, termo panel, travertin qoplama, ustun va pilyastr. Har bir mahsulot bo'yicha batafsil sahifalar.",
    keywords: "fasad dekor toshkent, karniz, termo panel, travertin qoplama, ustun, pilyastr, artline decor",
    h1: "Fasad dekor mahsulotlari va xizmatlari",
    intro: "Artline Decor Toshkentda fasad dekor elementlarini ishlab chiqaradi va o'rnatadi. Quyida har bir mahsulot turi bo'yicha batafsil sahifalar bor.",
    home: 'Bosh sahifa',
    crumb: 'Mahsulot va xizmatlar',
    blog: 'Blogdagi maqolalar',
  },
  ru: {
    title: "Продукция и услуги по фасадному декору, Ташкент | Artline Decor",
    description: "Продукция Artline Decor: фасадный декор, карнизы, термопанели, травертиновая облицовка, колонны и пилястры. Подробные страницы по каждому виду.",
    keywords: "фасадный декор ташкент, карниз, термопанели, травертин, колонны, пилястры, artline decor",
    h1: "Продукция и услуги по фасадному декору",
    intro: "Artline Decor производит и монтирует элементы фасадного декора в Ташкенте. Ниже собраны подробные страницы по каждому виду продукции.",
    home: 'Главная',
    crumb: 'Продукция и услуги',
    blog: 'Статьи в блоге',
  },
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const lang = sp.lang === 'ru' ? 'ru' : 'uz';
  const t = TEXT[lang];
  const uzUrl = `${BASE}/xizmatlar`;
  const ruUrl = `${uzUrl}?lang=ru`;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: lang === 'ru' ? ruUrl : uzUrl,
      languages: { 'uz-UZ': uzUrl, 'ru-RU': ruUrl, 'x-default': uzUrl },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: lang === 'ru' ? ruUrl : uzUrl,
      type: 'website',
      siteName: 'Artline Decor',
      locale: lang === 'ru' ? 'ru_RU' : 'uz_UZ',
      images: [{ url: `${BASE}/logo.png`, width: 1024, height: 1024, alt: 'Artline Decor' }],
    },
  };
}

export default async function ServicesHub({ searchParams }: PageProps) {
  const sp = await searchParams;
  const lang = sp.lang === 'ru' ? 'ru' : 'uz';
  const q = lang === 'ru' ? '?lang=ru' : '';
  const t = TEXT[lang];
  const linkStyle: React.CSSProperties = { color: 'var(--accent-gold)', textDecoration: 'underline' };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: lang === 'ru' ? `${BASE}/?lang=ru` : BASE },
      { '@type': 'ListItem', position: 2, name: t.crumb, item: `${BASE}/xizmatlar${q}` },
    ],
  };

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SERVICE_PAGES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.h1[lang],
      url: `${BASE}/xizmatlar/${p.slug}${q}`,
    })),
  };

  return (
    <LangProvider defaultLang={lang}>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={listSchema} />
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05070f', color: '#fff' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto', padding: '0 20px' }}>
          <nav aria-label="breadcrumb" style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '28px' }}>
            <a href={lang === 'ru' ? '/?lang=ru' : '/'} style={linkStyle}>{t.home}</a>
            {' / '}
            <span>{t.crumb}</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>{t.h1}</h1>
          <p style={{ fontSize: '1.1rem', color: '#a0aec0', lineHeight: 1.6, marginBottom: '36px' }}>{t.intro}</p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '20px' }}>
            {SERVICE_PAGES.map((p) => (
              <li key={p.slug} style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-gold)', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                  <a href={`/xizmatlar/${p.slug}${q}`} style={linkStyle}>{p.h1[lang]}</a>
                </h2>
                <p style={{ color: '#a0aec0', lineHeight: 1.6 }}>{p.metaDescription[lang]}</p>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '36px' }}>
            <a href={`/blog${q}`} style={linkStyle}>{t.blog}</a>
          </p>
        </div>
      </main>
      <Footer />
      <EstimateModal />
      <FloatingContact />
    </LangProvider>
  );
}
