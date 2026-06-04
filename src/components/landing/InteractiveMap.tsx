"use client";

import React from 'react';
import { motion } from 'framer-motion';

const locations = [
  { id: 1, name: "Tashkent City", top: "35%", left: "65%" },
  { id: 2, name: "Samarkand", top: "55%", left: "45%" },
  { id: 3, name: "Bukhara", top: "65%", left: "30%" },
  { id: 4, name: "Fergana", top: "40%", left: "80%" },
  { id: 5, name: "Andijan", top: "35%", left: "85%" },
  { id: 6, name: "Namangan", top: "30%", left: "75%" },
  { id: 7, name: "Navoi", top: "50%", left: "35%" },
];

export default function InteractiveMap() {
  return (
    <section className="section" style={{ background: '#000', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none'
      }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Butun O'zbekiston Bo'ylab <span style={{ color: 'rgba(255,255,255,0.4)' }}>Loyihalar</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Bizning jamoamiz O'zbekistonning turli viloyatlarida yuzlab fasad loyihalarini muvaffaqiyatli yakunlagan. Har bir nuqta bizning sifatimiz va mijozlar ishonchi belgisidir.
          </p>
        </motion.div>

        <div style={{
          position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto',
          aspectRatio: '21/9', background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          
          {/* Abstract SVG Map of Uzbekistan (Simplified) */}
          <svg style={{ width: '100%', height: '100%', opacity: 0.2 }} viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 300 Q 300 150 500 200 T 800 250 Q 900 350 850 450 T 600 500 Q 400 550 250 400 Z" fill="currentColor" />
          </svg>

          {/* Map Pins */}
          {locations.map((loc, index) => (
            <div
              key={loc.id}
              style={{ position: 'absolute', top: loc.top, left: loc.left }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                {/* Pulse effect */}
                <div style={{
                  position: 'absolute', top: '-8px', left: '-8px', right: '-8px', bottom: '-8px',
                  background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                  animation: 'pulse 2s infinite', opacity: 0.75
                }}></div>
                <div style={{
                  position: 'relative', width: '16px', height: '16px', background: '#fff',
                  borderRadius: '50%', boxShadow: '0 0 15px rgba(255,255,255,0.8)',
                  border: '2px solid #000'
                }} />
                
                {/* Tooltip */}
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginBottom: '12px', padding: '6px 12px', background: '#fff', color: '#000',
                  fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                  borderRadius: '8px', whiteSpace: 'nowrap', pointerEvents: 'none'
                }}>
                  {loc.name}
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    marginTop: '-1px', border: '4px solid transparent', borderTopColor: '#fff'
                  }} />
                </div>
              </motion.div>
            </div>
          ))}

          {/* Floating Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              position: 'absolute', bottom: '48px', left: '48px',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Bajarilgan Obyektlar</div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff' }}>500+</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Hududlar Qamrovi</div>
                <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff' }}>12 Viloyat</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
