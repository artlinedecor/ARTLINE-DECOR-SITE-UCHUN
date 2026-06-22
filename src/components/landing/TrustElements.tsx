'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Ruler, FileCheck, Download, CheckCircle } from 'lucide-react';
import TiltCard from '@/components/effects/TiltCard';
import { useT } from '@/lib/i18n';

const TRUST_KEYS = [
  { icon: <Cpu size={22} />, titleKey: 'trust.item1.title', descKey: 'trust.item1.desc', badgeKey: 'trust.item1.badge' },
  { icon: <Shield size={22} />, titleKey: 'trust.item2.title', descKey: 'trust.item2.desc', badgeKey: 'trust.item2.badge' },
  { icon: <Ruler size={22} />, titleKey: 'trust.item3.title', descKey: 'trust.item3.desc', badgeKey: 'trust.item3.badge' },
  { icon: <FileCheck size={22} />, titleKey: 'trust.item4.title', descKey: 'trust.item4.desc', badgeKey: 'trust.item4.badge' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOut
        setCount(Math.round(target * eased));
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          setCount(target); // guarantee final value
        }
      };
      requestAnimationFrame(tick);
    };

    // No IntersectionObserver support -> run immediately
    if (!el || typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    // Fallback: if the observer never fires within 1.5s, animate anyway
    const fallback = setTimeout(run, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [target]);

  return <div ref={ref} className="stat-value">{count}{suffix}</div>;
}

export default function TrustElements() {
  const { t } = useT();
  const TRUST_ITEMS = TRUST_KEYS.map(it => ({
    icon: it.icon, title: t(it.titleKey), desc: t(it.descKey), badge: t(it.badgeKey),
  }));
  return (
    <section className="section" id="trust" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>{t('trust.badge')}</div>
          <h2 className="section-title" style={{ display: 'inline-block' }}>{t('trust.title')}</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            {t('trust.subtitle')}
          </p>
        </div>

        <div className="trust-grid">
          {TRUST_ITEMS.map((item, idx) => (
            <TiltCard
              key={idx}
              max={7}
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
            </TiltCard>
          ))}
        </div>

        {/* Stats counters */}
        <div className="stats-grid" style={{ marginTop: 64 }}>
          <TiltCard className="stat-card" max={5} scale={1.03} style={{ textAlign: 'center' }}>
            <div className="stat-label">{t('trust.stat.warranty')}</div>
            <AnimatedCounter target={10} suffix={t('trust.stat.warranty.suffix')} />
          </TiltCard>
          <TiltCard className="stat-card" max={5} scale={1.03} style={{ textAlign: 'center' }}>
            <div className="stat-label">{t('trust.stat.density')}</div>
            <AnimatedCounter target={35} suffix=" kg/m³" />
          </TiltCard>
          <TiltCard className="stat-card" max={5} scale={1.03} style={{ textAlign: 'center' }}>
            <div className="stat-label">{t('trust.stat.ready')}</div>
            <AnimatedCounter target={3} suffix={t('trust.stat.ready.suffix')} />
          </TiltCard>
          <TiltCard className="stat-card" max={5} scale={1.03} style={{ textAlign: 'center' }}>
            <div className="stat-label">{t('trust.stat.acrylic')}</div>
            <AnimatedCounter target={4} suffix=" mm+" />
          </TiltCard>
        </div>

        {/* Download certifications */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download className="btn btn-outline">
            <Download size={16} />
            {t('trust.dl')}
          </a>
        </div>

        {/* Montaj rules highlight */}
        <div className="glass-card" style={{ marginTop: 48, display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={{ marginBottom: 12, color: 'var(--accent-gold)' }}>{t('trust.mont.title')}</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                t('trust.mont.r1'),
                t('trust.mont.r2'),
                t('trust.mont.r3'),
                t('trust.mont.r4'),
                t('trust.mont.r5'),
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
            <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1.1rem', marginTop: 16 }}>{t('trust.angle.title')}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>{t('trust.angle.sub')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
