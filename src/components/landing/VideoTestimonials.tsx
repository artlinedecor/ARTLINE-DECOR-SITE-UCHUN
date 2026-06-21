"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import TiltCard from '@/components/effects/TiltCard';

const testimonials = [
  {
    id: 1,
    name: "Alisher U.",
    location: "Toshkent viloyati",
    role: "Uy egasi",
    text: "Termo panellar 3sm va 5sm qalinlikda ajoyib sifatda o'rnatildi. Uydagi issiqlik izolyatsiyasi sezilarli darajada yaxshilandi, sifatiga gap bo'lishi mumkin emas!"
  },
  {
    id: 2,
    name: "Murod N.",
    location: "Samarqand",
    role: "Quruvchi",
    text: "Tabiiy toshga juda o'xshashligi va g'isht ustiga to'g'ridan-to'g'ri o'rnatilishi bizga juda ma'qul keldi. Fasad dizayni ajoyib ko'rinish oldi!"
  },
  {
    id: 3,
    name: "Jamshid B.",
    location: "Buxoro",
    role: "Uy egasi",
    text: "Karniz va kalonalar bilan fasadga termo panellar o'rnatilgandan so'ng uy butunlay premium ko'rinishga kirdi. 10 yillik kafolat berilgani ishonchli."
  },
  {
    id: 4,
    name: "Sherzod R.",
    location: "Andijon",
    role: "Tijorat binosi egasi",
    text: "Do'konim peshtoqiga arxitektura dekoridan kalonalar qo'ydim — mijozlarim ko'paydi. Premium ko'rinish savdoga ham ijobiy ta'sir qildi."
  }
];

const AUTOPLAY_MS = 6500;

export default function VideoTestimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const count = testimonials.length;
  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, go, index]);

  const active = testimonials[index];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className="section" style={{ background: '#0A0A0A', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px',
        background: 'radial-gradient(closest-side, rgba(217,154,108,0.08), transparent)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px',
        background: 'radial-gradient(closest-side, rgba(242,181,140,0.07), transparent)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="container" style={{ maxWidth: '900px', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span className="badge badge-gold" style={{ marginBottom: '16px', display: 'inline-block' }}>Haqiqiy mijozlar</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Mijozlarimiz <span style={{ color: 'var(--accent-gold)' }}>Fikri</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Bizning ishimiz haqida ular nima deyishini o'zlaridan eshiting.
          </p>
        </motion.div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ position: 'relative' }}
        >
          <div style={{ overflow: 'hidden', borderRadius: '24px', minHeight: '340px' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard
                  max={4}
                  scale={1.01}
                  glare
                  style={{
                    position: 'relative',
                    padding: 'clamp(36px, 5vw, 64px) clamp(28px, 5vw, 72px)',
                    background: 'linear-gradient(135deg, rgba(217,154,108,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(217,154,108,0.18)',
                    borderRadius: '24px',
                    textAlign: 'center',
                  }}
                >
                  <Quote size={56} style={{
                    color: 'var(--accent-gold)', opacity: 0.35,
                    margin: '0 auto 20px', display: 'block',
                  }} />

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', justifyContent: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} color="#f5a623" fill="#f5a623" />
                    ))}
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
                    lineHeight: 1.55, fontStyle: 'italic', fontWeight: 400,
                    marginBottom: '36px', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto',
                  }}>
                    “{active.text}”
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#0A0A0A', fontSize: '1.3rem',
                      boxShadow: '0 6px 18px rgba(217,154,108,0.35)',
                    }}>
                      {active.name.charAt(0)}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '1.05rem', margin: 0 }}>{active.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {active.role} · {active.location}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '32px' }}>
            <button onClick={() => go(-1)} aria-label="Oldingi" style={ctrlBtn}>
              <ChevronLeft size={22} />
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`${i + 1}-sharh`}
                  style={{
                    width: i === index ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '100px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: i === index ? 'var(--accent-gold)' : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </div>

            <button onClick={() => go(1)} aria-label="Keyingi" style={ctrlBtn}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const ctrlBtn: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  border: '1px solid rgba(217,154,108,0.25)',
  background: 'rgba(217,154,108,0.06)',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.25s ease',
};
