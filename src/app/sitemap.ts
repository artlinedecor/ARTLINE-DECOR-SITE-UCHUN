import { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/blog-data';
import { SERVICE_PAGES } from '@/lib/service-pages';

const baseUrl = 'https://artlinedecor.uz';

// Sahifa matni haqiqatan o'zgarganda shu sanani yangilang. Har buildda
// `new Date()` berish qidiruvchilarga "hamma narsa har kuni o'zgaradi" degan
// noto'g'ri signal beradi va lastmod ishonchini pasaytiradi.
const SITE_UPDATED = new Date('2026-10-08');
const LEGAL_UPDATED = new Date('2026-08-18');

function latestArticleDate(): Date {
  const times = ARTICLES.map((a) => new Date(a.date).getTime()).filter((t) => !Number.isNaN(t));
  return times.length ? new Date(Math.max(...times)) : SITE_UPDATED;
}

function latestServiceDate(): Date {
  const times = SERVICE_PAGES.map((p) => new Date(p.date).getTime()).filter((t) => !Number.isNaN(t));
  return new Date(Math.max(SITE_UPDATED.getTime(), ...times));
}

function langAlternates(uzUrl: string, ruUrl: string) {
  return {
    languages: {
      'uz-UZ': uzUrl,
      'ru-RU': ruUrl,
      'x-default': uzUrl,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const blogUpdated = latestArticleDate();

  // 1. Bosh sahifa (uz + ru)
  const homeAlt = langAlternates(baseUrl, `${baseUrl}/?lang=ru`);
  entries.push(
    { url: baseUrl, lastModified: SITE_UPDATED, changeFrequency: 'weekly', priority: 1.0, alternates: homeAlt },
    { url: `${baseUrl}/?lang=ru`, lastModified: SITE_UPDATED, changeFrequency: 'weekly', priority: 0.9, alternates: homeAlt },
  );

  // 2. Blog ro'yxati (uz + ru)
  const blogAlt = langAlternates(`${baseUrl}/blog`, `${baseUrl}/blog?lang=ru`);
  entries.push(
    { url: `${baseUrl}/blog`, lastModified: blogUpdated, changeFrequency: 'weekly', priority: 0.8, alternates: blogAlt },
    { url: `${baseUrl}/blog?lang=ru`, lastModified: blogUpdated, changeFrequency: 'weekly', priority: 0.7, alternates: blogAlt },
  );

  // 3. Blog maqolalari (uz + ru)
  ARTICLES.forEach((article) => {
    const uzUrl = `${baseUrl}/blog/${article.slug}`;
    const ruUrl = `${uzUrl}?lang=ru`;
    const alt = langAlternates(uzUrl, ruUrl);
    entries.push(
      { url: uzUrl, lastModified: new Date(article.date), changeFrequency: 'monthly', priority: 0.7, alternates: alt },
      { url: ruUrl, lastModified: new Date(article.date), changeFrequency: 'monthly', priority: 0.6, alternates: alt },
    );
  });

  // 3b. Mahsulot / xizmat sahifalari (uz + ru). Ro'yxat src/lib/service-pages.ts dan olinadi.
  // Hub sahifasi xizmat sahifalari ro'yxatini ko'rsatadi: lastmod eng yangi
  // xizmat sahifasi sanasidan oldin bo'lmasin (aks holda sahifa yaratilishidan
  // oldingi sana chiqardi).
  const hubAlt = langAlternates(`${baseUrl}/xizmatlar`, `${baseUrl}/xizmatlar?lang=ru`);
  const hubUpdated = latestServiceDate();
  entries.push(
    { url: `${baseUrl}/xizmatlar`, lastModified: hubUpdated, changeFrequency: 'weekly', priority: 0.8, alternates: hubAlt },
    { url: `${baseUrl}/xizmatlar?lang=ru`, lastModified: hubUpdated, changeFrequency: 'weekly', priority: 0.7, alternates: hubAlt },
  );
  SERVICE_PAGES.forEach((page) => {
    const uzUrl = `${baseUrl}/xizmatlar/${page.slug}`;
    const ruUrl = `${uzUrl}?lang=ru`;
    const alt = langAlternates(uzUrl, ruUrl);
    const modified = new Date(page.date);
    entries.push(
      { url: uzUrl, lastModified: modified, changeFrequency: 'monthly', priority: 0.8, alternates: alt },
      { url: ruUrl, lastModified: modified, changeFrequency: 'monthly', priority: 0.7, alternates: alt },
    );
  });

  // 4. Huquqiy sahifalar (E-E-A-T: ishonch sahifalari indeksda bo'lishi kerak)
  ['/legal/privacy', '/legal/terms', '/legal/data-deletion'].forEach((path) => {
    entries.push({ url: `${baseUrl}${path}`, lastModified: LEGAL_UPDATED, changeFrequency: 'yearly', priority: 0.3 });
  });

  return entries;
}
