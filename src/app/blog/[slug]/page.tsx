import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import EstimateModal from '@/components/landing/EstimateModal';
import FloatingContact from '@/components/landing/FloatingContact';
import { LangProvider } from '@/lib/i18n';
import { ARTICLES } from '@/lib/blog-data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const article = ARTICLES.find(a => a.slug === resolvedParams.slug);
  if (!article) return {};

  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';
  return {
    title: `${article.title[lang]} | Artline Decor`,
    description: article.description[lang],
    keywords: article.keywords[lang],
    alternates: {
      canonical: lang === 'ru' 
        ? `https://artlinedecor.uz/blog/${article.slug}?lang=ru` 
        : `https://artlinedecor.uz/blog/${article.slug}`,
      languages: {
        'uz-UZ': `https://artlinedecor.uz/blog/${article.slug}`,
        'ru-RU': `https://artlinedecor.uz/blog/${article.slug}?lang=ru`,
        'x-default': `https://artlinedecor.uz/blog/${article.slug}`,
      }
    },
    openGraph: {
      title: article.title[lang],
      description: article.description[lang],
      url: lang === 'ru' 
        ? `https://artlinedecor.uz/blog/${article.slug}?lang=ru` 
        : `https://artlinedecor.uz/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: ['Artline Decor'],
      images: [
        {
          url: "https://artlinedecor.uz/og-image.jpg",
          width: 1200,
          height: 630,
          alt: article.title[lang],
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title[lang],
      description: article.description[lang],
      images: ["https://artlinedecor.uz/og-image.jpg"],
    }
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const article = ARTICLES.find(a => a.slug === resolvedParams.slug);
  
  if (!article) {
    notFound();
  }

  const lang = resolvedSearchParams.lang === 'ru' ? 'ru' : 'uz';

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title[lang],
    "image": "https://artlinedecor.uz/og-image.jpg",
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Organization",
      "name": "Artline Decor",
      "url": "https://artlinedecor.uz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Artline Decor",
      "logo": {
        "@type": "ImageObject",
        "url": "https://artlinedecor.uz/logo.png"
      }
    },
    "description": article.description[lang],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://artlinedecor.uz/blog/${article.slug}?lang=${lang}`
    }
  };

  const translations = {
    uz: {
      back: "Orqaga, barcha maqolalarga",
      ctaTitle: "Bepul smeta hisoblatmoqchimisiz?",
      ctaText: "Mutaxassisimiz 15 daqiqa ichida siz bilan bog'lanib, fasad maydonini hisoblab beradi va bepul maslahat beradi.",
      ctaBtn: "Bepul smeta va loyiha",
      readTime: "O'qish vaqti:",
      date: "Nashr etilgan sana:"
    },
    ru: {
      back: "Назад, ко всем статьям",
      ctaTitle: "Хотите бесплатный расчет сметы?",
      ctaText: "Наш специалист свяжется с вами в течение 15 минут, сделает расчет площади фасада и проконсультирует бесплатно.",
      ctaBtn: "Получить расчет бесплатно",
      readTime: "Время чтения:",
      date: "Дата публикации:"
    }
  };

  const t = translations[lang];

  return (
    <LangProvider defaultLang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <Navbar />

      <main style={{ minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px', background: '#05070f', color: '#fff' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Back button and breadcrumbs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <a href={`/blog?lang=${lang}`} style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {t.back}
            </a>

            <span style={{ fontSize: '0.82rem', color: '#a0aec0' }}>
              {t.readTime} {article.readTime[lang]}
            </span>
          </div>

          {/* Article Header */}
          <header style={{ marginBottom: '40px' }}>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              {t.date} {article.date}
            </div>
            
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: '1.25',
              marginBottom: '20px',
              letterSpacing: '-0.015em'
            }}>
              {article.title[lang]}
            </h1>
            
            <p style={{
              fontSize: '1.15rem',
              color: '#a0aec0',
              lineHeight: '1.6',
              borderLeft: '3px solid var(--accent-gold)',
              paddingLeft: '18px',
              margin: '24px 0 0 0',
              fontStyle: 'italic'
            }}>
              {article.description[lang]}
            </p>
          </header>

          {/* Hero Banner fallback */}
          <div style={{
            width: '100%',
            height: '350px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '48px',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(21, 26, 48, 0.95), rgba(41, 30, 24, 0.85))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '16px' }}>🏢</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Artline Decor</span>
            <span style={{ fontSize: '0.82rem', color: '#a0aec0', marginTop: '6px' }}>Premium Facade and Insulation Systems</span>
          </div>

          {/* Article Body */}
          <article className="blog-content" style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#e2e8f0',
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              .blog-content p {
                margin-bottom: 24px;
              }
              .blog-content h2 {
                font-size: 1.65rem;
                font-weight: 700;
                color: #fff;
                margin-top: 48px;
                margin-bottom: 18px;
                letter-spacing: -0.01em;
              }
              .blog-content h3 {
                font-size: 1.3rem;
                font-weight: 700;
                color: #fff;
                margin-top: 36px;
                margin-bottom: 12px;
              }
              .blog-content ul {
                margin-bottom: 28px;
                padding-left: 24px;
              }
              .blog-content li {
                margin-bottom: 8px;
              }
              .blog-content strong {
                color: var(--accent-gold);
                font-weight: 600;
              }
              .blog-content table {
                color: #e2e8f0;
              }
            `}} />
            <div dangerouslySetInnerHTML={{ __html: article.content[lang] }} />
          </article>

          {/* CTA Conversion Box */}
          <section style={{
            marginTop: '60px',
            padding: '40px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(217, 154, 108, 0.1) 0%, rgba(10, 15, 30, 0.8) 100%)',
            border: '1px solid var(--border-gold)',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
              {t.ctaTitle}
            </h2>
            <p style={{ color: '#a0aec0', fontSize: '1rem', lineHeight: '1.6', marginBottom: '28px', maxWidth: '580px', margin: '0 auto 28px' }}>
              {t.ctaText}
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  (window as any).openEstimateModal?.();
                }
              }}
              style={{
                padding: '14px 32px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
                color: '#0a0a0a',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(217, 154, 108, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 154, 108, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(217, 154, 108, 0.3)';
              }}
            >
              {t.ctaBtn}
            </button>
          </section>

          {/* Quick link back */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <a href={`/blog?lang=${lang}`} style={{ color: '#a0aec0', textDecoration: 'underline', fontSize: '0.92rem' }}>
              {lang === 'ru' ? 'Вернуться в блог' : 'Blog sahifasiga qaytish'}
            </a>
          </div>

        </div>
      </main>

      <Footer />
      <EstimateModal />
      <FloatingContact />
    </LangProvider>
  );
}
