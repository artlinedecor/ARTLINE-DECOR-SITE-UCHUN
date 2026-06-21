"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import TiltCard from '@/components/effects/TiltCard';

function getYouTubeEmbedUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}

const testimonials = [
  {
    id: 1,
    name: "Alisher U.",
    location: "Toshkent viloyati",
    videoThumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/shorts/wp686HcUraw",
    text: "Termo panellar 3sm va 5sm qalinlikda ajoyib sifatda o'rnatildi. Uydagi issiqlik izolyatsiyasi sezilarli darajada yaxshilandi, sifatiga gap bo'lishi mumkin emas!"
  },
  {
    id: 2,
    name: "Murod N.",
    location: "Samarqand",
    videoThumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://youtu.be/ta8G7WeojKQ",
    text: "Tabiiy toshga juda o'xshashligi va g'isht ustiga to'g'ridan-to'g'ri o'rnatilishi bizga juda ma'qul keldi. Fasad dizayni ajoyib ko'rinish oldi!"
  },
  {
    id: 3,
    name: "Jamshid B.",
    location: "Buxoro",
    videoThumbnail: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://youtu.be/hDJ1Kw_a8tE",
    text: "Karniz va kalonalar bilan fasadga termo panellar o'rnatilgandan so'ng uy butunlay premium ko'rinishga kirdi. 10 yillik kafolat berilgani ishonchli."
  }
];

const AUTOPLAY_MS = 6000;

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const count = testimonials.length;
  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + count) % count);
  }, [count]);

  // Auto-advance (pauses on hover / when a video modal is open)
  useEffect(() => {
    if (paused || activeVideo) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, activeVideo, go, index]);

  const active = testimonials[index];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className="section" style={{ background: '#0A0A0A', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Haqiqiy mijozlar, haqiqiy uylar. Bizning ishimiz haqida ular nima deyishini o'zlaridan eshiting.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ position: 'relative' }}
        >
          <div style={{ overflow: 'hidden', borderRadius: '28px' }}>
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
                  className="testimonial-card"
                  max={5}
                  scale={1.01}
                  glare
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
                    gap: '0',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '28px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Video side */}
                  <div
                    className="testimonial-media"
                    style={{ position: 'relative', minHeight: '320px', cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => setActiveVideo(active.videoUrl)}
                  >
                    <img
                      src={active.videoThumbnail}
                      alt={active.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(10,10,10,0.1), rgba(10,10,10,0.55))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                          width: '72px', height: '72px', background: 'rgba(255,255,255,0.18)',
                          backdropFilter: 'blur(6px)', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.6)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Play color="#fff" size={28} style={{ marginLeft: '5px' }} fill="#fff" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="testimonial-body" style={{ padding: 'clamp(24px, 4vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Quote size={36} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '16px' }} />
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '18px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} color="#f5a623" fill="#f5a623" />
                      ))}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '28px' }}>
                      “{active.text}”
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#0A0A0A', fontSize: '1.2rem',
                      }}>
                        {active.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '1.05rem', margin: 0 }}>{active.name}</h4>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{active.location}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '28px' }}>
            <button
              onClick={() => go(-1)}
              aria-label="Oldingi"
              style={ctrlBtn}
            >
              <ChevronLeft size={22} />
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`${i + 1}-sharh`}
                  style={{
                    width: i === index ? '28px' : '10px',
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

            <button
              onClick={() => go(1)}
              aria-label="Keyingi"
              style={ctrlBtn}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)', padding: '16px'
          }}>
            <button
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute', top: '24px', right: '24px', color: '#fff',
                background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%', maxWidth: '900px', aspectRatio: '16/9', background: '#000',
                borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
              }}
            >
              {getYouTubeEmbedUrl(activeVideo) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo)! + "?autoplay=1"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <video
                  src={activeVideo}
                  style={{ width: '100%', height: '100%' }}
                  controls
                  autoPlay
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

const ctrlBtn: React.CSSProperties = {
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};
