import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import EstimateModal from '@/components/landing/EstimateModal';
import FloatingContact from '@/components/landing/FloatingContact';
import { LangProvider } from '@/lib/i18n';
import { ARTICLES } from '@/lib/blog-data';
import { Metadata } from 'next';
import Image from 'next/image';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';

  if (lang === 'ru') {
    return {
      title: "Статьи о фасадном декоре и утеплении домов | Блог Artline Decor",
      description: "Полезные статьи, руководства и советы по облицовке фасадов травертином, монтажу термопанелей и архитектурного декора в Ташкенте и Узбекистане.",
      keywords: "блог фасадный декор, утепление фасада Ташкент, термопанели с травертином, фасадные работы Ташкент, карниз фасадный Ташкент",
      alternates: {
        canonical: "https://artlinedecor.uz/blog?lang=ru",
        languages: {
          'uz-UZ': 'https://artlinedecor.uz/blog',
          'ru-RU': 'https://artlinedecor.uz/blog?lang=ru',
          'x-default': 'https://artlinedecor.uz/blog',
        }
      }
    };
  } else {
    return {
      title: "Fasad dekoratsiyasi va issiqlik izolyatsiyasi bo'yicha foydali maqolalar | Artline Decor",
      description: "Toshkentda uy fasadini izolyatsiya qilish, travertin qoplama, karniz va pilyastr montaj qilish bo'yicha yo'riqnomalar va professional maslahatlar.",
      keywords: "fasad izolyatsiya, travertin qoplama, fasad montaj Toshkent, penoplast dekor, binolar fasadi dizayni",
      alternates: {
        canonical: "https://artlinedecor.uz/blog",
        languages: {
          'uz-UZ': 'https://artlinedecor.uz/blog',
          'ru-RU': 'https://artlinedecor.uz/blog?lang=ru',
          'x-default': 'https://artlinedecor.uz/blog',
        }
      }
    };
  }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';

  // JSON-LD structured data for CollectionPage (Blog)
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": lang === 'ru' ? "Блог и полезные статьи — Artline Decor" : "Blog va foydali maqolalar — Artline Decor",
    "description": lang === 'ru' 
      ? "Полезные советы и статьи о фасадном декоре, утеплении и монтаже панелей" 
      : "Fasad bezaklari, issiqlik izolyatsiyasi va montaj ishlari bo'yicha maqolalar va maslahatlar",
    "url": `https://artlinedecor.uz/blog?lang=${lang}`,
    "publisher": {
      "@type": "Organization",
      "name": "Artline Decor",
      "logo": "https://artlinedecor.uz/logo.png"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": ARTICLES.map((article, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://artlinedecor.uz/blog/${article.slug}?lang=${lang}`
      }))
    }
  };

  const translations = {
    uz: {
      breadcrumbs: "Bosh sahifa / Blog",
      title: "Kompaniya blogi va maqolalar",
      subtitle: "Fasad izolyatsiyasi, arxitektura dizayni, travertin qoplama va termo panellar bo'yicha eng so'nggi maslahatlar hamda yo'riqnomalar.",
      readMore: "Batafsil o'qish",
      dateLabel: "Sana:",
      timeLabel: "O'qish vaqti:"
    },
    ru: {
      breadcrumbs: "Главная / Блог",
      title: "Блог компании и статьи",
      subtitle: "Самые свежие советы и руководства по утеплению фасадов, архитектурному дизайну, облицовке травертином и термопанелями.",
      readMore: "Читать далее",
      dateLabel: "Дата:",
      timeLabel: "Время чтения:"
    }
  };

  const t = translations[lang];

  return (
    <LangProvider defaultLang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Navbar />
      
      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05070f', color: '#fff' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', fontSize: '0.85rem' }}>
            <ol style={{ listStyle: 'none', display: 'flex', gap: '8px', padding: 0, margin: 0, color: '#a0aec0' }}>
              <li>
                <a href={lang === 'ru' ? '/?lang=ru' : '/'} style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}>
                  {lang === 'ru' ? 'Главная' : 'Bosh sahifa'}
                </a>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.2)' }}>/</li>
              <li style={{ color: '#fff', fontWeight: 600 }}>Blog</li>
            </ol>
          </nav>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '100px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              background: 'rgba(217,154,108,0.1)',
              border: '1px solid rgba(217,154,108,0.18)',
              marginBottom: '16px'
            }}>
              ARTLINE DECOR KNOWLEDGE BASE
            </span>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3.2rem)', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #fff 30%, #a0aec0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              marginBottom: '18px',
              lineHeight: 1.15
            }}>
              {t.title}
            </h1>
            <p style={{ maxWidth: '680px', margin: '0 auto', color: '#a0aec0', fontSize: '1.05rem', lineHeight: '1.6' }}>
              {t.subtitle}
            </p>
          </div>

          {/* Articles Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            {ARTICLES.map(article => {
              const url = `/blog/${article.slug}?lang=${lang}`;
              return (
                <article key={article.slug} className="blog-card" style={{
                  background: 'rgba(10, 15, 30, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(12px)',
                }}>
                  {/* Image Holder */}
                  <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden', background: '#121624' }}>
                    <div style={{
                      position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                      background: 'rgba(5, 7, 15, 0.85)', padding: '6px 12px', borderRadius: '100px',
                      fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(217,154,108,0.25)',
                      color: 'var(--accent-gold)'
                    }}>
                      {t.timeLabel} {article.readTime[lang]}
                    </div>
                    {/* Placeholder image or loaded image */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', fontWeight: 600 }}>
                      {/* For production, users can put their own images, we render a nice architectural gradient fallback with text if file not loaded */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, rgba(21, 26, 48, 0.95), rgba(41, 30, 24, 0.85))',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏛️</span>
                        <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em', color: '#a0aec0', textTransform: 'uppercase' }}>Artline Decor</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                      <span>{article.date}</span>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '14px', lineHeight: '1.4', transition: 'color 0.2s ease' }}>
                      <a href={url} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {article.title[lang]}
                      </a>
                    </h2>

                    <p style={{ color: '#a0aec0', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                      {article.description[lang]}
                    </p>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={url} style={{
                        color: 'var(--accent-gold)',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}>
                        {t.readMore}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
      <EstimateModal />
      <FloatingContact />
    </LangProvider>
  );
}
