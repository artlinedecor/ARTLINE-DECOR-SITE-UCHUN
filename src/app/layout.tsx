import type { Metadata } from "next";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";

export const metadata: Metadata = {
  title: "Artline Decor — Premial Fasad Tizimlari | 10 Yillik Kafolat",
  description:
    "Artline Decor — 3-in-1 texnologiyasi: dekor + izolyatsiya + himoya. PSB-S-25F/35F import xomashyo, 10 yillik kafolat. Buyurtma tayyorligi 1-3 ish kuni.",
  keywords: "fasad dekor, fasad tizimlari, karniz, ustun, pilyastr, penoplast dekor, artline decor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
