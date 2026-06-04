'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Ruler, FileCheck, Download, CheckCircle } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: <Cpu size={22} />,
    title: 'Yuqori zichlikdagi xomashyo',
    desc: 'ПСБ-С-25Ф va ПСБ-С-35Ф markali penopolistirol uyingiz devorlarini mustahkam qoplaydi va deformatsiyalanmaydi.',
    badge: 'Maksimal izolyatsiya',
  },
  {
    icon: <Shield size={22} />,
    title: 'Ekologik va yong\'inga chidamli',
    desc: 'Tarkibida zaharli kimyoviy moddalar yo\'q. Mahsulot o\'z-o\'zidan o\'chuvchi (samozatuxayushchiy) xususiyatga ega.',
    badge: '100% xavfsiz',
  },
  {
    icon: <Ruler size={22} />,
    title: 'Avtomatik stanoklar aniqligi',
    desc: 'Barcha elementlar avtomatlashtirilgan "protyajka" dastgohlarida tayyorlanadi. Geometriyada 1 mm ham xatolik bo\'lmaydi.',
    badge: 'Ideal geometriya',
  },
  {
    icon: <FileCheck size={22} />,
    title: 'Professional montaj standarti',
    desc: 'Burchaklar 45° aniqlikda kesiladi, choklar ko\'rinmaydi. Fasad harorat o\'zgarishlariga to\'liq chidamli bo\'ladi.',
    badge: 'Sifat kafolati',
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const step = target / 40;
          const interval = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="stat-value">{count}{suffix}</div>;
}

export default function TrustElements() {
  return (
    <section className="section" id="trust" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Sifat va Texnologiya</div>
          <h2 className="section-title" style={{ display: 'inline-block' }}>Nima uchun aynan Artline Decor?</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Biz fasad termo-panellarini nafaqat ishlab chiqaramiz, balki ularning uzoq yillar xizmat qilishini kafolatlaymiz.
          </p>
        </div>

        <div className="trust-grid">
          {TRUST_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="glass-card trust-card animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <motion.div
                  className="trust-icon"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--accent-gold)',
                    position: 'relative',
                    boxShadow: 'inset 0 0 20px rgba(217,154,108,0.03)',
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: 'rgba(217,154,108,0.3)',
                    boxShadow: 'inset 0 0 30px rgba(217,154,108,0.1)',
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: '0px',
                      borderRadius: '18px',
                      background: 'radial-gradient(circle at center, rgba(217,154,108,0.2) 0%, transparent 60%)',
                      zIndex: 0,
                    }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + idx * 0.4,
                      ease: "easeInOut",
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>{item.icon}</div>
                </motion.div>

                <div style={{
                  background: 'rgba(217,154,108,0.08)',
                  border: '1px solid rgba(217,154,108,0.15)',
                  color: 'var(--accent-gold)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </div>
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{item.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats counters */}
        <div className="stats-grid" style={{ marginTop: 64 }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Rasmiy kafolat</div>
            <AnimatedCounter target={10} suffix=" yil" />
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Xomashyo zichligi</div>
            <AnimatedCounter target={35} suffix=" kg/m³" />
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Buyurtma tayyor bo&apos;lishi</div>
            <AnimatedCounter target={3} suffix=" kun" />
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-label">Akril qoplama qalinligi</div>
            <AnimatedCounter target={4} suffix=" mm+" />
          </div>
        </div>

        {/* Download certifications */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download className="btn btn-outline">
            <Download size={16} />
            Katalog va Sertifikatlarni yuklab olish (PDF)
          </a>
        </div>

        {/* Montaj rules highlight */}
        <div className="glass-card" style={{ marginTop: 48, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ marginBottom: 12, color: 'var(--accent-gold)' }}>Biz amal qiladigan Montaj Standartlari</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Professional burchakli kesim (45°) — birikish choklari umuman ko\'rinmaydi.',
                'Har bir chok (стык) maxsus pena-kley bilan zich to\'ldirilib qotiriladi, bu esa issiqlikni saqlaydi.',
                'Maxsus sovuqqa va issiqqa chidamli yelimlar ishlatiladi — ko\'chib ketish xavfi yo\'q.',
                'Ustki akril qoplama quyoshning ultrabinafsha nurlaridan va qor-yomg\'irdan toliq himoyalaydi.',
                'Mahsulot ustidagi AMK qoplamamiz ham zarbalardan, ham tashqi haroratdan himoya qiladi va dekorativ bo\'yoq yoki suyuq travertin bilan juda yaxshi kirishadi (kontakt zo\'r bo\'ladi).',
              ].map((rule, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 4 }} />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div style={{
            flex: 1, minWidth: 280, background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)', padding: 36, textAlign: 'center',
            border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 700, color: 'var(--accent-gold)', lineHeight: 1 }}>
              45°
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.1rem', marginTop: 16 }}>Burchakli kesim standarti</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Choklar zichligi va ideal ko&apos;rinish kafolati</div>
          </div>
        </div>
      </div>
    </section>
  );
}
