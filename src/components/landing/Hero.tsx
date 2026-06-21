'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Zap, ChevronDown, CloudRain, Sun, Snowflake, Leaf } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFancyEffects } from '@/lib/use-fancy-effects';

const SEASONS = [
  { 
    id: 'winter', 
    name: 'Qish', 
    color: '#00d2ff', 
    glow: 'rgba(0, 210, 255, 0.15)',
    icon: <Snowflake size={18} />
  },
  { 
    id: 'spring', 
    name: 'Bahor', 
    color: '#00e676', 
    glow: 'rgba(0, 230, 118, 0.15)',
    icon: <CloudRain size={18} />
  },
  { 
    id: 'summer', 
    name: 'Yoz', 
    color: '#ffaa00', 
    glow: 'rgba(255, 170, 0, 0.15)',
    icon: <Sun size={18} />
  },
  { 
    id: 'autumn', 
    name: 'Kuz', 
    color: '#ff6600', 
    glow: 'rgba(255, 102, 0, 0.15)',
    icon: <Leaf size={18} />
  }
];

const SEASON_IMAGES = [
  '/hero_winter.png?v=4',
  '/hero_spring.png?v=4',
  '/hero_summer.png?v=4',
  '/hero_autumn.png?v=4'
];

export default function Hero() {
  const [currentSeason, setCurrentSeason] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const currentSeasonRef = useRef(0);
  currentSeasonRef.current = currentSeason;

  // 3D mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 60, damping: 18 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), springCfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), springCfg);
  const contentX = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), springCfg);
  const contentY = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), springCfg);
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [25, -25]), springCfg);
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), springCfg);
  const fancy = useFancyEffects();
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!fancy) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  useEffect(() => {
    SEASON_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentSeason((prev) => (prev + 1) % 4);
    }, 8000); // 8 seconds per season for a majestic feel

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      swaySpeed: number;
      swayAmount: number;
      swayOffset: number;
      angle?: number;
      rotSpeed?: number;
      type?: 'rain' | 'leaf' | 'snow' | 'sun';
    }

    let particles: Particle[] = [];
    // Lighten the particle field on small / low-power screens.
    const maxParticles = width < 768 ? 90 : 250;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          swaySpeed: Math.random() * 0.015 + 0.005,
          swayAmount: Math.random() * 1.5 + 0.5,
          swayOffset: Math.random() * Math.PI * 2,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: Math.random() * 0.04 - 0.02,
          type: Math.random() > 0.8 ? 'leaf' : 'rain'
        });
      }
    };
    initParticles();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const seasonIdx = currentSeasonRef.current;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.globalAlpha = p.opacity;

        if (seasonIdx === 0) {
          // Winter: Snowflakes
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = 'white';
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          p.vy = 1.0 + p.size * 0.4;
          p.vx = 0.3 + Math.sin(time * p.swaySpeed + p.swayOffset) * 0.4;

        } else if (seasonIdx === 1) {
          // Spring: Rain
          ctx.strokeStyle = 'rgba(200, 220, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.size, p.y + p.size * 4);
          ctx.stroke();

          p.vy = 8 + p.size * 1.5;
          p.vx = -1.5;

        } else if (seasonIdx === 2) {
          // Summer: Sun Dust / Lens Flares
          ctx.fillStyle = 'rgba(255, 220, 150, 0.6)';
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = '#ffcc00';
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          p.vy = -(0.3 + p.size * 0.1);
          p.vx = Math.sin(time * p.swaySpeed + p.swayOffset) * 0.2;

        } else if (seasonIdx === 3) {
          // Autumn: Rain & Leaves
          if (p.type === 'leaf') {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle || 0);
            
            ctx.fillStyle = p.size > 2 ? 'rgba(217, 100, 30, 0.85)' : 'rgba(242, 160, 50, 0.85)';
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 2.5);
            ctx.lineTo(p.size * 1.2, 0);
            ctx.lineTo(0, p.size * 2.5);
            ctx.lineTo(-p.size * 1.2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            p.vy = 2.0 + p.size * 0.5;
            p.vx = 2.5 + Math.sin(time * p.swaySpeed + p.swayOffset) * 1.5;
            p.angle = (p.angle || 0) + (p.rotSpeed || 0.02);
          } else {
            // Rain mixed with leaves
            ctx.strokeStyle = 'rgba(200, 220, 255, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.lineCap = 'round';
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.size * 0.8, p.y + p.size * 3);
            ctx.stroke();

            p.vy = 7 + p.size;
            p.vx = -1.2;
          }
        }

        p.y += p.vy;
        p.x += p.vx;

        if (seasonIdx === 2) {
          if (p.y < -20 || p.x < -20 || p.x > width + 20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
        } else {
          if (p.y > height + 20 || p.x > width + 20 || p.x < -20) {
            p.y = -20;
            p.x = Math.random() * width;
            if (seasonIdx === 1) p.x += width * 0.3; // Offset for slanted rain
            if (seasonIdx === 3 && p.type === 'rain') p.x += width * 0.3;
          }
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (!prefersReduced) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeSeason = SEASONS[currentSeason];

  return (
    <section className="hero" id="hero" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', perspective: '1200px' }}>

      {/* Background System */}
      <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', x: bgX, y: bgY, scale: 1.06 }}>
        
        {/* Blurred Full-Bleed Background for Edges */}
        {SEASON_IMAGES.map((img, idx) => (
          <motion.div 
            key={`blur-${idx}`}
            initial={false}
            animate={{ opacity: idx === currentSeason ? 1 : 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', inset: -20, 
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) brightness(0.4) saturate(1.2)',
              zIndex: 0
            }}
          />
        ))}

        {/* Sharp Center Background */}
        {SEASON_IMAGES.map((img, idx) => (
          <motion.div 
            key={`sharp-${idx}`}
            initial={false}
            animate={{ opacity: idx === currentSeason ? 1 : 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{ 
              position: 'absolute', inset: 0, 
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover', // Using cover but keeping the aspect centered
              backgroundPosition: 'center center',
              zIndex: 1
            }}
          />
        ))}

        {/* Ambient Color Glow Overlay */}
        <motion.div 
          animate={{ background: `radial-gradient(circle at 50% 40%, ${activeSeason.glow} 0%, transparent 75%)` }}
          transition={{ duration: 2.0 }}
          style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
        />

        {/* Lighting adjustments based on season */}
        <motion.div 
          animate={{ 
            background: currentSeason === 2 
              ? 'linear-gradient(to bottom, rgba(255,200,100,0.1) 0%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.85) 100%)' // Summer: warmer top
              : 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.5) 50%, rgba(10,10,15,0.9) 100%)'
          }}
          transition={{ duration: 2.5 }}
          style={{ position: 'absolute', inset: 0, zIndex: 2 }} 
        />

        {/* Dynamic Canvas Particles (Rain/Snow/Leaves/Sun) */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}
        />
      </motion.div>

      {/* Main Content Overlay */}
      <motion.div className="container" style={{ zIndex: 10, position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '100px', rotateX, rotateY, x: contentX, y: contentY, transformStyle: 'preserve-3d' }}>
        
        {/* Season Indicator Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(10, 15, 25, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '100px',
            padding: '6px 6px 6px 16px',
            marginBottom: '40px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
        >
          <span style={{ fontSize: '0.9rem', color: '#a0aec0', fontWeight: 500, letterSpacing: '0.02em' }}>
            Yilning har qanday faslida ishonchli
          </span>
          <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
            {SEASONS.map((s, idx) => {
              const isActive = idx === currentSeason;
              return (
                <div 
                  key={s.id}
                  onClick={() => setCurrentSeason(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '100px',
                    cursor: 'pointer', transition: 'all 0.4s ease',
                    background: isActive ? s.color : 'transparent',
                    color: isActive ? '#000' : '#a0aec0',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? `0 0 20px ${s.color}66` : 'none'
                  }}
                >
                  <motion.div
                    animate={{ rotate: isActive && idx === 2 ? 180 : 0 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    {s.icon}
                  </motion.div>
                  {isActive && <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.name}</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Transparent Text Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            marginBottom: '48px',
            maxWidth: '960px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Hero Title */}
          <h1 
            style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '24px',
              textShadow: '0 4px 20px rgba(0,0,0,0.85)',
              letterSpacing: '-0.02em',
            }}
          >
            Uyingiz Uchun Premium Fasad <br />
            <motion.span 
              animate={{ color: activeSeason.color }}
              transition={{ duration: 1.5 }}
              style={{ 
                display: 'inline-block',
                textShadow: '0 4px 30px rgba(0,0,0,0.95)'
              }}
            >
              Termo-Panellari va Arxitektura Dekorlari
            </motion.span>
          </h1>

          {/* Hero Subtitle */}
          <p 
            style={{ 
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '850px',
              lineHeight: 1.6,
              margin: '0',
              fontWeight: 500,
              textShadow: '0 2px 12px rgba(0,0,0,0.85)'
            }}
          >
            Panellarimiz qishda sovuqdan, yozda issiqdan, kuz va bahorda esa namlikdan <strong style={{ color: '#ffffff', fontWeight: 700 }}>100% himoya qiladi</strong>. G'isht ustiga to'g'ridan-to'g'ri montaj qilinadi — suvoq talab etilmaydi.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.a 
            href="#calculator" 
            className="btn btn-lg"
            onClick={(e) => {
              e.preventDefault();
              (window as any).openEstimateModal?.();
            }}
            animate={{ 
              boxShadow: `0 0 30px ${activeSeason.color}40`,
              borderColor: activeSeason.color,
            }}
            style={{ 
              background: '#fff', 
              color: '#050811', 
              fontSize: '1.05rem', 
              fontWeight: 700,
              padding: '16px 40px',
              borderRadius: '100px',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05, background: activeSeason.color }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={20} style={{ marginRight: '8px' }} />
            Bepul hisob-kitob
          </motion.a>
          
          <a 
            href="/ARTLINE_DECOR_Architectural_Catalog.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              fontSize: '1.05rem',
              fontWeight: 600,
              padding: '16px 40px',
              borderRadius: '100px'
            }}
          >
            Katalog (PDF)
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            width: '100%',
            maxWidth: '1000px',
            marginTop: '80px'
          }}
        >
          {[
            { value: "10 yil", label: "Rasmiy kafolat" },
            { value: "500+", label: "Bajarilgan uylar" },
            { value: "100%", label: "Ekologik toza" },
            { value: "Premium", label: "AMK Ximoya qatlami", icon: <Shield size={24} style={{ marginRight: '10px' }} /> }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              animate={{ borderColor: `${activeSeason.color}33` }}
              style={{
                background: 'rgba(10, 15, 25, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid',
                borderRadius: '24px',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <motion.div 
                animate={{ color: activeSeason.color }}
                style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center' }}
              >
                {stat.icon}{stat.value}
              </motion.div>
              <div style={{ fontSize: '0.9rem', color: '#a0aec0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#trust" 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.6)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}
