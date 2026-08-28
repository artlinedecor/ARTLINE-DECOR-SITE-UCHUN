import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "48px 20px 96px",
        lineHeight: 1.7,
        fontSize: 16,
        color: "#1c1c1c",
        background: "#fff",
      }}
    >
      {children}
      <hr style={{ margin: "48px 0 24px", border: 0, borderTop: "1px solid #e5e5e5" }} />
      <p style={{ fontSize: 14, color: "#666" }}>
        «IDRIS TEX» MCHJ · STIR 309 088 342 · Namangan viloyati, Namangan shahri,
        Davlatobod tumani, Yuksalish MFY, Yuksalish kichik sanoat zonasi ·{" "}
        <a href="mailto:mamatkuloff@bk.ru">mamatkuloff@bk.ru</a> · +998 99 102 02 00
      </p>
    </main>
  );
}
