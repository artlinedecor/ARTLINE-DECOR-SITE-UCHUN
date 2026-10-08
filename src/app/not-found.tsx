import type { Metadata } from 'next';
import Link from 'next/link';

// 404 sahifa: Next.js o'zi noindex qo'yadi; bu sahifa foydalanuvchini
// asosiy sahifalarga qaytaradi.
export const metadata: Metadata = {
  title: 'Sahifa topilmadi (404) — Artline Decor',
  description: "So'ralgan sahifa topilmadi. Artline Decor bosh sahifasiga yoki blogga qayting.",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px 20px',
        textAlign: 'center',
        background: 'var(--bg-primary, #050811)',
        color: '#fff',
      }}
    >
      <p style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-gold)', margin: 0 }}>404</p>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: 0 }}>
        Sahifa topilmadi / Страница не найдена
      </h1>
      <p style={{ color: '#a0aec0', maxWidth: '520px', margin: 0 }}>
        Siz qidirgan sahifa mavjud emas yoki ko&apos;chirilgan.
      </p>
      <nav style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
        <Link href="/" style={{ color: 'var(--accent-gold)' }}>Bosh sahifa</Link>
        <Link href="/blog" style={{ color: 'var(--accent-gold)' }}>Blog</Link>
        <Link href="/?lang=ru" style={{ color: 'var(--accent-gold)' }}>Главная</Link>
      </nav>
    </main>
  );
}
