import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import EstimateModal from '@/components/landing/EstimateModal';
import FloatingContact from '@/components/landing/FloatingContact';
import BlogCtaButton from '@/components/blog/BlogCtaButton';
import JsonLd from '@/components/seo/JsonLd';
import { LangProvider } from '@/lib/i18n';
import { ARTICLES } from '@/lib/blog-data';
import { SERVICE_PAGES, getServicePage } from '@/lib/service-pages';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const BASE = 'https://artlinedecor.uz';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const page = getServicePage(slug);
  if (!page) return {};
  const lang = sp.lang === 'ru' ? 'ru' : 'uz';
  const uzUrl = `${BASE}/xizmatlar/${page.slug}`;
  const ruUrl = `${uzUrl}?lang=ru`;
  const url = lang === 'ru' ? ruUrl : uzUrl;
  return {
    title: page.metaTitle[lang],
    description: page.metaDescription[lang],
    keywords: page.keywords[lang],
    alternates: {
      canonical: url,
      languages: { 'uz-UZ': uzUrl, 'ru-RU': ruUrl, 'x-default': uzUrl },
    },
    openGraph: {
      title: page.metaTitle[lang],
      description: page.metaDescription[lang],
      url,
      type: 'website',
      siteName: 'Artline Decor',
      locale: lang === 'ru' ? 'ru_RU' : 'uz_UZ',
      images: [{ url: `${BASE}${page.image}`, alt: page.imageAlt[lang] }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle[lang],
      description: page.metaDescription[lang],
      images: [`${BASE}${page.image}`],
    },
  };
}

export default async function ServicePageRoute({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = getServicePage(slug);
  if (!page) notFound();

  const lang = sp.lang === 'ru' ? 'ru' : 'uz';
  const q = lang === 'ru' ? '?lang=ru' : '';
  const pageUrl = `${BASE}/xizmatlar/${page.slug}${q}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.q[lang],
      acceptedAnswer: { '@type': 'Answer', text: f.a[lang] },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'ru' ? 'Главная' : 'Bosh sahifa', item: lang === 'ru' ? `${BASE}/?lang=ru` : BASE },
      { '@type': 'ListItem', position: 2, name: lang === 'ru' ? 'Продукция и услуги' : 'Mahsulot va xizmatlar', item: `${BASE}/xizmatlar${q}` },
      { '@type': 'ListItem', position: 3, name: page.breadcrumbName[lang], item: pageUrl },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1[lang],
    description: page.metaDescription[lang],
    url: pageUrl,
    inLanguage: lang,
    image: `${BASE}${page.image}`,
    provider: { '@id': `${BASE}/#organization` },
    areaServed: { '@type': 'City', name: lang === 'ru' ? 'Ташкент' : 'Toshkent' },
  };

  const t = {
    uz: {
      home: 'Bosh sahifa', hub: 'Mahsulot va xizmatlar',
      faq: "Ko'p beriladigan savollar",
      related: 'Tegishli sahifalar', blog: "Blogdagi maqolalar",
      ctaTitle: 'Bepul smeta hisoblatmoqchimisiz?',
      ctaText: "Mutaxassisimiz siz bilan bog'lanib, obyektni hisoblab beradi va bepul maslahat beradi. Telefon: +998 99 102 02 00.",
      ctaBtn: 'Bepul smeta va loyiha',
    },
    ru: {
      home: 'Главная', hub: 'Продукция и услуги',
      faq: 'Часто задаваемые вопросы',
      related: 'Связанные страницы', blog: 'Статьи в блоге',
      ctaTitle: 'Хотите бесплатный расчёт сметы?',
      ctaText: 'Наш специалист свяжется с вами, рассчитает объект и бесплатно проконсультирует. Телефон: +998 99 102 02 00.',
      ctaBtn: 'Получить расчёт бесплатно',
    },
  }[lang];

  const relatedPages = page.related.map(getServicePage).filter((p): p is NonNullable<typeof p> => !!p);
  const blogArticles = page.blogLinks
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => !!a);

  const linkStyle: React.CSSProperties = { color: 'var(--accent-gold)', textDecoration: 'underline' };

  return (
    <LangProvider defaultLang={lang}>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05070f', color: '#fff' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto', padding: '0 20px' }}>
          <nav aria-label="breadcrumb" style={{ fontSize: '0.85rem', color: '#a0aec0', marginBottom: '28px' }}>
            <a href={lang === 'ru' ? '/?lang=ru' : '/'} style={linkStyle}>{t.home}</a>
            {' / '}
            <a href={`/xizmatlar${q}`} style={linkStyle}>{t.hub}</a>
            {' / '}
            <span>{page.breadcrumbName[lang]}</span>
          </nav>

          <header style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '20px', letterSpacing: '-0.015em' }}>
              {page.h1[lang]}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#a0aec0', lineHeight: 1.6, borderLeft: '3px solid var(--accent-gold)', paddingLeft: '18px' }}>
              {page.intro[lang]}
            </p>
          </header>

          <img
            src={page.image}
            alt={page.imageAlt[lang]}
            width={800}
            height={800}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.06)' }}
          />

          <article className="service-content" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#e2e8f0' }}>
            <style dangerouslySetInnerHTML={{ __html: `
              .service-content p { margin-bottom: 20px; }
              .service-content h2 { font-size: 1.55rem; font-weight: 700; color: #fff; margin-top: 44px; margin-bottom: 16px; }
              .service-content h3 { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
              .service-content ul { margin-bottom: 24px; padding-left: 24px; }
              .service-content li { margin-bottom: 8px; }
            ` }} />
            {page.sections.map((s, i) => (
              <section key={i}>
                <h2>{s.h2[lang]}</h2>
                {s.paras.map((p, j) => (
                  <p key={j}>{p[lang]}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets[lang].map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section>
              <h2>{t.faq}</h2>
              {page.faq.map((f, i) => (
                <div key={i} style={{ marginBottom: '22px' }}>
                  <h3>{f.q[lang]}</h3>
                  <p>{f.a[lang]}</p>
                </div>
              ))}
            </section>

            <section>
              <h2>{t.related}</h2>
              <ul>
                {relatedPages.map((r) => (
                  <li key={r.slug}>
                    <a href={`/xizmatlar/${r.slug}${q}`} style={linkStyle}>{r.h1[lang]}</a>
                  </li>
                ))}
                <li>
                  <a href={lang === 'ru' ? '/?lang=ru' : '/'} style={linkStyle}>{t.home}</a>
                </li>
              </ul>
              {blogArticles.length > 0 && (
                <>
                  <h3>{t.blog}</h3>
                  <ul>
                    {blogArticles.map((a) => (
                      <li key={a.slug}>
                        <a href={`/blog/${a.slug}${q}`} style={linkStyle}>{a.title[lang]}</a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </article>

          <section style={{ marginTop: '56px', padding: '40px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(217, 154, 108, 0.1) 0%, rgba(10, 15, 30, 0.8) 100%)', border: '1px solid var(--border-gold)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>{t.ctaTitle}</h2>
            <p style={{ color: '#a0aec0', lineHeight: 1.6, margin: '0 auto 28px', maxWidth: '580px' }}>{t.ctaText}</p>
            <BlogCtaButton label={t.ctaBtn} />
          </section>
        </div>
      </main>

      <Footer />
      <EstimateModal />
      <FloatingContact />
    </LangProvider>
  );
}
