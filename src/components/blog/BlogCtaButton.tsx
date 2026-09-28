'use client';

import React from 'react';

/**
 * Blog maqolasi oxiridagi smeta tugmasi.
 *
 * NEGA ALOHIDA FAYL: bu tugma avval `src/app/blog/[slug]/page.tsx`
 * ichida, to'g'ridan-to'g'ri Server Component ichida turardi. Server
 * Component'da `onClick` / `onMouseEnter` bo'lishi mumkin emas - React
 * render vaqtida xato tashlaydi va sahifa HTTP 500 qaytaradi.
 *
 * Natijada uchta blog maqolasi ham ochilmasdi: `/blog/...` URL lari
 * `sitemap.xml` da reklama qilinardi, lekin brauzerga ham, Google va AI
 * botlariga ham 500 ketardi. Bosh sahifa ishlagani uchun nosozlik
 * ko'zga tashlanmagan.
 *
 * Sahifaning qolgan qismi ataylab serverda chiziladi: maqola matni
 * HTML'da bo'lishi kerak, aks holda JavaScript ishlatmaydigan botlar
 * (GPTBot, ClaudeBot, PerplexityBot) hech narsa ko'rmaydi.
 */
export default function BlogCtaButton({ label }: { label: string }) {
  return (
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
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 154, 108, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(217, 154, 108, 0.3)';
      }}
    >
      {label}
    </button>
  );
}
