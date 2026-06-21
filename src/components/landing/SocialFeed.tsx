'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const LUXURY_VIDEOS = [
  {
    id: '1',
    title: 'Fasad tayyorlash bosqichi',
    desc: 'Devorlarni tozalash va termo panellarni montajga tayyorlash jarayoni.',
    src: '/portfolio/video-process-1.mp4',
  },
  {
    id: '2',
    title: 'Termo panellar montaji',
    desc: "Premium termo panellarni g'isht ustidan suvoqsiz o'rnatish jarayoni.",
    src: '/portfolio/video-process-2.mp4',
  },
  {
    id: '3',
    title: "Dekor va karniz o'rnatilishi",
    desc: 'Loyiha asosida karniz va kalonnalarni fasadga joylashtirish.',
    src: '/portfolio/video-process-3.mp4',
  },
  {
    id: '4',
    title: 'Yakunlangan premium villa',
    desc: "Artline Decor termo panellari va dekorativ elementlari bilan yakunlangan hashamatli villa ko'rinishi.",
    src: '/portfolio/1-after-video.mp4',
  }
];

export default function SocialFeed() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="section" id="social" style={{ background: '#08090d', color: '#fff', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '16px' }}>Hashamatli Loyiha</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            Xashamatli Proyektimiz <span style={{ color: 'var(--accent-gold)' }}>Jarayonlari</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '16px auto 0', maxWidth: '650px' }}>
            Toshkent shahrida yakunlangan premium villa fasadining montaj jarayonlari va yakuniy natijasini real videolarda tomosha qiling.
          </p>
        </div>

        {/* Video Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {LUXURY_VIDEOS.map((video) => (
            <div 
              key={video.id}
              onClick={() => setActiveVideo(video.src)}
              className="luxury-video-card"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Video Preview */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
                <video 
                  src={video.src} 
                  preload="metadata"
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Play Button Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease'
                }} className="video-overlay">
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
                    transition: 'transform 0.3s ease'
                  }} className="play-btn-wrapper">
                    <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    {video.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {video.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)', padding: '16px'
          }}>
            <button 
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute', top: '24px', right: '24px', color: '#fff',
                background: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={24} />
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%', maxWidth: '960px', aspectRatio: '16/9', background: '#000',
                borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)'
              }}
            >
              <video 
                src={activeVideo} 
                style={{ width: '100%', height: '100%' }}
                controls 
                autoPlay 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .luxury-video-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.3) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
        .luxury-video-card:hover .video-overlay {
          background: rgba(0, 0, 0, 0.2) !important;
        }
        .luxury-video-card:hover .play-btn-wrapper {
          transform: scale(1.1);
          background: #fff !important;
        }
      `}</style>
    </section>
  );
}
