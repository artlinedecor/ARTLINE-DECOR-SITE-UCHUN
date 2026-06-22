import type { Metadata } from "next";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya, Karniz, Molding | Toshkent",
  description:
    "Artline Decor — fasad panellari, travertin qoplama, issiqlik izolyatsiyasi, karniz, molding, ustun, pilyastr. 3-in-1 texnologiya: dekor + izolyatsiya + himoya. PSB-S-25F/35F import xomashyo, 10 yillik kafolat. Toshkent, O'zbekiston.",
  keywords: "fasad dekor, fasad panellari, travertin, travertin qoplama, issiqlik izolyatsiya, fasad izolyatsiya, karniz, molding, ustun, pilyastr, penoplast dekor, artline decor, fasad dizayn, fasad tizimi, termo panel, fasad bezak, dekorativ karniz, arxitektura dekor, fasad Toshkent, fasad O'zbekiston, фасад декор, травертин, карниз, молдинг, фасадные панели, утепление фасада, термопанели, декор фасада Ташкент",
  openGraph: {
    title: "Artline Decor — Fasad Dekor, Travertin, Izolyatsiya | Toshkent",
    description: "Fasad panellari, travertin, karniz, molding — 10 yillik kafolat. 3-in-1: dekor + izolyatsiya + himoya.",
    url: "https://artlinedecor.uz",
    siteName: "Artline Decor",
    locale: "uz_UZ",
    type: "website",
  },
  alternates: {
    canonical: "https://artlinedecor.uz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
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
      </body>
    </html>
  );
}
