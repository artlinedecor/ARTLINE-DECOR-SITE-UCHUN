import { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artlinedecor.uz';
  const languages = ['uz', 'ru'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Homepage URLs
  languages.forEach(lang => {
    sitemapEntries.push({
      url: `${baseUrl}?lang=${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  });

  // 2. Blog list page URLs
  languages.forEach(lang => {
    sitemapEntries.push({
      url: `${baseUrl}/blog?lang=${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 3. Blog articles URLs
  ARTICLES.forEach(article => {
    languages.forEach(lang => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${article.slug}?lang=${lang}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
