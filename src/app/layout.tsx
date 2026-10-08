import type { Metadata, Viewport } from "next";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";
import { LangProvider } from "@/lib/i18n";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // Nisbiy OG/canonical manzillar shu domen bo'yicha to'liq URL'ga aylanadi.
  metadataBase: new URL("https://artlinedecor.uz"),
  title: "Artline Decor: fasad dekor, travertin, izolyatsiya, Toshkent",
  description:
    "Artline Decor — fasad panellari, travertin qoplama, issiqlik izolyatsiyasi, karniz va molding. 3-in-1: dekor + izolyatsiya + himoya, 10 yillik kafolat.",
  keywords: "fasad dekor, fasad panellari, travertin, travertin qoplama, issiqlik izolyatsiya, fasad izolyatsiya, karniz, molding, ustun, pilyastr, penoplast dekor, artline decor, fasad dizayn, fasad tizimi, termo panel, fasad bezak, dekorativ karniz, arxitektura dekor, fasad Toshkent, fasad O'zbekiston, фасад декор, травертин, карниз, молдинг, фасадные панели, утепление фасада, термопанели, декор фасада Ташкент",
  applicationName: "Artline Decor",
  openGraph: {
    title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya | Toshkent",
    description: "Fasad panellari, travertin, karniz, molding — 10 yillik kafolat. 3-in-1: dekor + izolyatsiya + himoya.",
    siteName: "Artline Decor",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU"],
    type: "website",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Artline Decor" }],
  },
  twitter: {
    card: "summary",
    title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya | Toshkent",
    description: "Fasad panellari, travertin, karniz, molding — 10 yillik kafolat. 3-in-1: dekor + izolyatsiya + himoya.",
    images: ["/logo.png"],
  },
  // Canonical bu yerda berilmaydi: aks holda o'z canonical'i yo'q har qanday
  // sahifa (masalan 404) bosh sahifaga "canonical" bo'lib qolardi. Har bir
  // ommaviy sahifa canonical'ini o'zi belgilaydi.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    // Google public/googleeb653e1b8a542f6c.html fayli orqali tasdiqlangan.
    // Kod berilmasa teg chiqmaydi — soxta "placeholder" teg qidiruvchilarni chalg'itadi.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || "12e1a28bd3783e96",
    other: {
      "facebook-domain-verification": "dy5861pz6txmweo70s36l123ldnwbg",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <LangProvider>
          <CursorGlow />
          {children}
        </LangProvider>
        <img src="https://vercel-dashboard-amber-pi.vercel.app/api/track?site=artlinedecor" style={{ display: "none" }} alt="" aria-hidden="true" />
      </body>
    </html>
  );
}
