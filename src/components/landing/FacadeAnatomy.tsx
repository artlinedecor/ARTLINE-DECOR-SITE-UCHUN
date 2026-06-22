'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Thermometer, CloudRain, Hammer } from 'lucide-react';
import { useT } from '@/lib/i18n';

const PRODUCT_KEYS = [
  { id: 'ostirma', titleKey: 'fa.p1.title', subKey: 'fa.p1.sub', img: '/product-travertin.webp', hotspot: { x: 23, y: 23 }, side: 'left' as const },
  { id: 'karniz', titleKey: 'fa.p2.title', subKey: 'fa.p2.sub', img: '/product-cornice.webp', hotspot: { x: 37, y: 51 }, side: 'left' as const },
  { id: 'pianino', titleKey: 'fa.p3.title', subKey: 'fa.p3.sub', img: '/product-fluted-cornice.webp', hotspot: { x: 18, y: 53 }, side: 'left' as const },
  { id: 'oyna', titleKey: 'fa.p4.title', subKey: 'fa.p4.sub', img: '/product-window.webp', hotspot: { x: 86, y: 31 }, side: 'right' as const },
  { id: 'kolonna', titleKey: 'fa.p5.title', subKey: 'fa.p5.sub', img: '/product-column.webp', hotspot: { x: 66, y: 36 }, side: 'right' as const },
  { id: 'termopanel', titleKey: 'fa.p6.title', subKey: 'fa.p6.sub', img: '/portfolio/termo-panel-razrezi.jpg', hotspot: { x: 62, y: 44 }, side: 'right' as const },
];

export default function FacadeAnatomy() {
  const { t, lang } = useT();
  const products = useMemo(() => PRODUCT_KEYS.map(p => ({
    id: p.id, title: t(p.titleKey), subtitle: t(p.subKey),
    img: p.img, hotspot: p.hotspot, side: p.side,
  })), [lang, t]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [arrowCoords, setArrowCoords] = useState<Record<string, { x1: number; y1: number; x2: number; y2: number }>>({});

  const leftProducts = products.filter(p => p.side === 'left');
  const rightProducts = products.filter(p => p.side === 'right');

  /* Strelka koordinatalarini hisoblash */
  const recalcArrows = useCallback(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const sectionRect = section.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    const newCoords: typeof arrowCoords = {};

    PRODUCT_KEYS.forEach((prod) => {
      const circleEl = circleRefs.current[prod.id];
      if (!circleEl) return;

      const circleRect = circleEl.getBoundingClientRect();
      const x1 = circleRect.left + circleRect.width / 2 - sectionRect.left;
      const y1 = circleRect.top + circleRect.height / 2 - sectionRect.top;
      const x2 = imageRect.left + (imageRect.width * prod.hotspot.x / 100) - sectionRect.left;
      const y2 = imageRect.top + (imageRect.height * prod.hotspot.y / 100) - sectionRect.top;

      newCoords[prod.id] = { x1, y1, x2, y2 };
    });

    setArrowCoords(prev => {
      const keys = Object.keys(newCoords);
      const same = keys.length === Object.keys(prev).length && keys.every(k => {
        const a = newCoords[k]; const b = prev[k];
        return b && a.x1 === b.x1 && a.y1 === b.y1 && a.x2 === b.x2 && a.y2 === b.y2;
      });
      return same ? prev : newCoords;
    });
  }, []);

  useEffect(() => {
    recalcArrows();
    window.addEventListener('resize', recalcArrows);
    window.addEventListener('scroll', recalcArrows, { passive: true });
    const timer = setTimeout(recalcArrows, 500);
    return () => {
      window.removeEventListener('resize', recalcArrows);
      window.removeEventListener('scroll', recalcArrows);
      clearTimeout(timer);
    };
  }, [recalcArrows]);

  // Recalculate immediately when selection changes so arrow lands on freshly-laid-out hotspot
  useEffect(() => {
    if (activeId) {
      const raf = requestAnimationFrame(() => recalcArrows());
      return () => cancelAnimationFrame(raf);
    }
  }, [activeId, recalcArrows]);

  const handleClick = (id: string) => {
    setActiveId(prev => prev === id ? null : id);
  };

  /* ── Mahsulot kartochkasi ── */
  const renderCard = (prod: typeof products[0], align: 'left' | 'right') => (
    <div
      key={prod.id}
      onClick={() => handleClick(prod.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        textAlign: align === 'left' ? 'right' : 'left',
        cursor: 'pointer',
        opacity: activeId && activeId !== prod.id ? 0.3 : 1,
        transform: activeId === prod.id ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.35s ease',
      }}
    >
      {align === 'left' && (
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontFamily: 'var(--font-heading)', color: activeId === prod.id ? '#fff' : 'var(--accent-gold)',
            fontSize: '1rem', fontWeight: 700, marginBottom: '4px', transition: 'color 0.3s'
          }}>
            {prod.title}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {prod.subtitle}
          </p>
        </div>
      )}

      <motion.div
        ref={(el) => { circleRefs.current[prod.id] = el; }}
        animate={
          activeId !== prod.id 
            ? { boxShadow: ['0 0 0px rgba(217,154,108,0)', '0 0 15px rgba(217,154,108,0.4)', '0 0 0px rgba(217,154,108,0)'] } 
            : { boxShadow: '0 0 30px rgba(217,154,108,0.5), inset 0 0 20px rgba(217,154,108,0.15)' }
        }
        transition={activeId !== prod.id ? { repeat: Infinity, duration: 2 } : {}}
        style={{
          width: '90px', height: '90px', borderRadius: '50%', flexShrink: 0,
          border: `2.5px solid ${activeId === prod.id ? 'var(--accent-gold)' : 'rgba(217,154,108,0.15)'}`,
          background: '#111', overflow: 'hidden',
          transition: 'border 0.35s ease',
        }}
      >
        <img src={prod.img} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>

      {align === 'right' && (
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontFamily: 'var(--font-heading)', color: activeId === prod.id ? '#fff' : 'var(--accent-gold)',
            fontSize: '1rem', fontWeight: 700, marginBottom: '4px', transition: 'color 0.3s'
          }}>
            {prod.title}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {prod.subtitle}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <section className="section" id="facade" style={{
      background: '#060810', position: 'relative', overflow: 'hidden', padding: '100px 0'
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '90%', height: '90%',
        background: 'radial-gradient(ellipse at center, rgba(217,154,108,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ 
            display: 'inline-block',
            color: 'var(--accent-gold)', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            {t('fa.section')}
          </div>
          <br />
          <h2 className="section-title" style={{ display: 'inline-block', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: 0 }}>
            {t('fa.title')}
          </h2>
          <p className="section-subtitle" style={{ margin: '14px auto 0', color: 'var(--text-secondary)', maxWidth: '560px' }}>
            {t('fa.subtitle.1')} <strong style={{ color: 'var(--accent-gold)' }}>{t('fa.subtitle.2')}</strong>
          </p>
        </div>

        <div
          ref={sectionRef}
          className="desktop-anatomy-grid"
          style={{
            display: 'flex', alignItems: 'stretch', justifyContent: 'center',
            gap: '24px', position: 'relative', minHeight: '620px',
          }}
        >
          {/* ══ SVG STRELKALAR ══ */}
          <svg
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 20, overflow: 'visible',
            }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <polygon points="0 0, 10 4, 0 8" fill="#ffffff" />
              </marker>
              <filter id="arrow-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <AnimatePresence>
              {activeId && arrowCoords[activeId] && (() => {
                const c = arrowCoords[activeId];
                const prod = products.find(p => p.id === activeId)!;
                const midX = (c.x1 + c.x2) / 2;
                const midY = (c.y1 + c.y2) / 2;
                const curveOffset = prod.side === 'left' ? -40 : 40;
                const pathD = `M ${c.x1} ${c.y1} Q ${midX + curveOffset} ${midY - 30} ${c.x2} ${c.y2}`;

                return (
                  <motion.g
                    key={`arrow-${activeId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="4"
                      filter="url(#arrow-glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </svg>

          {/* ── CHAP USTUN ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: '60px', width: '26%', zIndex: 2,
          }}>
            {leftProducts.map(p => renderCard(p, 'left'))}
          </div>

          {/* ── MARKAZ RASM ── */}
          <div style={{
            width: '42%', position: 'relative',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1,
          }}>
            <div
              ref={imageRef}
              style={{
                width: '100%', aspectRatio: '3/4', borderRadius: '20px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)', position: 'relative',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src="/facade-main.webp"
                alt="Hashamatli fasad"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(6,8,16,0.1) 0%, transparent 30%, transparent 65%, rgba(6,8,16,0.7) 100%)',
              }} />

              {/* ── NUQTALAR ── */}
              {products.map((prod) => (
                <button
                  key={`dot-${prod.id}`}
                  type="button"
                  onClick={() => handleClick(prod.id)}
                  aria-label={prod.title}
                  style={{
                    position: 'absolute',
                    left: `${prod.hotspot.x}%`, top: `${prod.hotspot.y}%`,
                    transform: 'translate(-50%,-50%)',
                    zIndex: 10,
                    width: '32px', height: '32px',
                    padding: 0,
                    border: 'none', background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span aria-hidden style={{
                    width: activeId === prod.id ? '20px' : '14px',
                    height: activeId === prod.id ? '20px' : '14px',
                    borderRadius: '50%',
                    background: '#d99a6c',
                    border: '2px solid #fff',
                    boxShadow: activeId === prod.id
                      ? '0 0 24px rgba(217,154,108,1)'
                      : '0 0 14px rgba(217,154,108,0.7)',
                    transition: 'all 0.25s ease',
                    animation: activeId === prod.id ? 'none' : 'fa-pulse 2s ease-in-out infinite',
                  }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── O'NG USTUN ── */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: '32px', width: '26%', zIndex: 2,
          }}>
            {rightProducts.map(p => renderCard(p, 'right'))}

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(217,154,108,0.1)',
              borderRadius: '16px', padding: '18px', marginTop: '8px',
            }}>
              <h5 style={{
                fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)',
                fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '12px',
              }}>
                {t('fa.adv.title')}
              </h5>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { icon: <Shield size={15} />, text: t('fa.adv.1') },
                  { icon: <Thermometer size={15} />, text: t('fa.adv.2') },
                  { icon: <CloudRain size={15} />, text: t('fa.adv.3') },
                  { icon: <Hammer size={15} />, text: t('fa.adv.4') },
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
