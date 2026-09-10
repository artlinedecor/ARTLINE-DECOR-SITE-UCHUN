import { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artlinedecor.uz';
  const languages = ['uz', 'ru'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Homepage URLs
  sitemapEntries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: {
      languages: {
        uz: baseUrl,
        ru: `${baseUrl}/?lang=ru`,
      },
    },
  });
  sitemapEntries.push({
    url: `${baseUrl}/?lang=ru`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // 2. Blog list page URLs
  sitemapEntries.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: {
      languages: {
        uz: `${baseUrl}/blog`,
        ru: `${baseUrl}/blog?lang=ru`,
      },
    },
  });
  sitemapEntries.push({
    url: `${baseUrl}/blog?lang=ru`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  });

  // 3. Blog articles URLs
  ARTICLES.forEach(article => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          uz: `${baseUrl}/blog/${article.slug}`,
          ru: `${baseUrl}/blog/${article.slug}?lang=ru`,
        },
      },
    });
    sitemapEntries.push({
      url: `${baseUrl}/blog/${article.slug}?lang=ru`,
      lastModified: new Date(article.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
