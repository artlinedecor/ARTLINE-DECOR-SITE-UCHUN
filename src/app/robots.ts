import { MetadataRoute } from 'next';

// Yagona robots manbai shu fayl (public/robots.txt olib tashlangan — ikkalasi
// bo'lsa qaysi biri berilishi noaniq edi). /_next/ statik fayllari ataylab
// yopilmagan: Google sahifani to'g'ri render qilishi uchun JS/CSS kerak.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/portal/', '/tijorat-taklifi.html'],
    },
    sitemap: 'https://artlinedecor.uz/sitemap.xml',
    // Yandex uchun asosiy ko'zgu (Host direktivasi).
    host: 'https://artlinedecor.uz',
  };
}
