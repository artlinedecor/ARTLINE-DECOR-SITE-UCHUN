"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Alisher U.",
    location: "Tashkent City",
    videoThumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    text: "Uyimni suvoq qilmasdan to'g'ridan-to'g'ri panellar o'rnatishdi. Vaqt va pulimni tejadim. Sifati a'lo darajada!"
  },
  {
    id: 2,
    name: "Murod N.",
    location: "Samarkand",
    videoThumbnail: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    text: "Dizayn juda zamonaviy chiqdi. Qishda uyimiz ancha issiq bo'lib qoldi. Artline jamoasiga rahmat."
  },
  {
    id: 3,
    name: "Jamshid B.",
    location: "Bukhara",
    videoThumbnail: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    text: "10 yillik kafolat berishgani ishonchimni oqladi. O'rnatish jarayoni atigi 6 kun davom etdi."
  }
];

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="section" style={{ background: '#0A0A0A', color: '#fff' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Mijozlarimiz <span style={{ color: 'rgba(255,255,255,0.4)' }}>Fikri</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Haqiqiy mijozlar, haqiqiy uylar. Bizning ishimiz haqida ular nima deyishini o'zlaridan eshiting.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px'
        }}>
          {testimonials.map((testial, index) => (
            <motion.div
              key={testial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', overflow: 'hidden',
                transition: 'background 0.3s ease'
              }}
            >
              {/* Video Thumbnail Area */}
              <div 
                style={{ position: 'relative', aspectRatio: '16/9', cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => setActiveVideo(testial.videoUrl)}
              >
                <img 
                  src={testial.videoThumbnail} 
                  alt={testial.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'transform 0.7s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.8'; }}
                />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{
                    width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}>
                    <Play color="#fff" size={24} style={{ marginLeft: '4px' }} />
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} color="#f5a623" fill="#f5a623" />
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{testial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontWeight: 700
                  }}>
                    {testial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: '1rem', margin: 0 }}>{testial.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{testial.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
    </section>
  );
}
