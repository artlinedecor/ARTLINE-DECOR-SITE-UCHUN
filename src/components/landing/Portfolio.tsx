'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  X, MapPin, Clock, Ruler, Star, ChevronLeft, ChevronRight,
  Zap, CheckCircle2, Quote, ArrowRight, FileText, Maximize2,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, STYLE_LABELS } from '@/lib/portfolio-data';
import { getPortfolioProjects } from '@/lib/store';
import type { PortfolioProject } from '@/lib/types';
import BeforeAfterSlider from './BeforeAfterSlider';
import { useFancyEffects } from '@/lib/use-fancy-effects';
import { useT } from '@/lib/i18n';

// YouTube linkini embed formatga o'giradi
function getYouTubeEmbedUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}


// ---- Star rating ----
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={16}
          fill={i <= rating ? '#d9a07a' : 'none'}
          stroke={i <= rating ? '#d9a07a' : '#4e5a72'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ---- Image carousel for modal ----
function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = React.useRef<number | null>(null);

  const next = useCallback(() => setCurrent(p => (p === images.length - 1 ? 0 : p + 1)), [images.length]);
  const prev = useCallback(() => setCurrent(p => (p === 0 ? images.length - 1 : p - 1)), [images.length]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, next, prev]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
    },
  };

  if (!images.length) return null;

  return (
    <>
      <div className="portfolio-modal-img-wrapper" {...swipe}>
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="portfolio-modal-img"
          onClick={() => setFullscreen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              className="portfolio-carousel-btn portfolio-carousel-prev"
              onClick={prev}
              aria-label="Oldingi"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              className="portfolio-carousel-btn portfolio-carousel-next"
              onClick={next}
              aria-label="Keyingi"
            >
              <ChevronRight size={22} />
            </button>
            <div className="portfolio-carousel-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`portfolio-carousel-dot ${idx === current ? 'active' : ''}`}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
          </>
        )}
        <button
          className="img-fullscreen-close"
          style={{ top: 12, left: 12, right: 'auto', position: 'absolute' }}
          onClick={() => setFullscreen(true)}
          aria-label="Kattalashtirish"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {fullscreen && (
        <div className="img-fullscreen-overlay" onClick={() => setFullscreen(false)} {...swipe}>
          <button className="img-fullscreen-close" onClick={() => setFullscreen(false)} aria-label="Yopish">
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="img-fullscreen-nav img-fullscreen-prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Oldingi"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                className="img-fullscreen-nav img-fullscreen-next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Keyingi"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}
          <img
            src={images[current].src}
            alt={images[current].alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ---- Project Detail Modal ----
function ProjectModal({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="portfolio-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Close button */}
        <button className="portfolio-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="portfolio-modal-scroll">
          {/* Visual Hook */}
          {project.beforeImage && (project.afterImage || project.afterVideo) ? (
            <div>
              <div className="portfolio-modal-tab-bar">
                <button
                  className={`portfolio-modal-tab ${!showBeforeAfter ? 'active' : ''}`}
                  onClick={() => setShowBeforeAfter(false)}
                >
                  📸 Galereya
                </button>
                <button
                  className={`portfolio-modal-tab ${showBeforeAfter ? 'active' : ''}`}
                  onClick={() => setShowBeforeAfter(true)}
                >
                  🔄 Oldin / Keyin
                </button>
              </div>
              {showBeforeAfter ? (
                project.afterVideo ? (
                  <div className="portfolio-modal-video-compare">
                    <div className="video-compare-box">
                      <img src={project.beforeImage} alt="Oldingi holat" className="video-compare-media" />
                      <span className="video-compare-badge badge-oldin">OLDIN (G'isht)</span>
                    </div>
                    <div className="video-compare-box">
                      {getYouTubeEmbedUrl(project.afterVideo) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(project.afterVideo)!}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="video-compare-media"
                          style={{ border: 'none', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <video src={project.afterVideo} controls autoPlay loop muted playsInline className="video-compare-media" />
                      )}
                      <span className="video-compare-badge badge-keyin">KEYIN (Video)</span>
                    </div>
                  </div>
                ) : (
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage || ''}
                  />
                )
              ) : (
                <ImageCarousel images={project.images} />
              )}
            </div>
          ) : (
            <ImageCarousel images={project.images} />
          )}

          {/* Header */}
          <div className="portfolio-modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 className="portfolio-modal-title">{project.title}</h2>
            </div>
            <div className="portfolio-modal-location">
              <MapPin size={14} /> {project.location}
            </div>
          </div>

          {/* Professional Description */}
          <p className="portfolio-modal-desc">{project.description}</p>

          {/* Smart Details */}
          <div className="portfolio-stats-grid">
            <div className="portfolio-stat">
              <Clock size={20} className="portfolio-stat-icon" />
              <div className="portfolio-stat-value">{project.completionDays} kun</div>
              <div className="portfolio-stat-label">Bitkazish muddati</div>
            </div>
            <div className="portfolio-stat">
              <Ruler size={20} className="portfolio-stat-icon" />
              <div className="portfolio-stat-value">{project.area} m²</div>
              <div className="portfolio-stat-label">Fasad maydoni</div>
            </div>
            <div className="portfolio-stat">
              <Zap size={20} className="portfolio-stat-icon" />
              <div className="portfolio-stat-value">10 yil</div>
              <div className="portfolio-stat-label">Kafolat</div>
            </div>
          </div>

          {/* Elements Used */}
          <div className="portfolio-section">
            <h4 className="portfolio-section-title">🏗️ Ishlatilgan elementlar</h4>
            <div className="portfolio-tags">
              {project.elementsUsed.map((el, i) => (
                <span key={i} className="portfolio-tag">{el}</span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="portfolio-section">
            <h4 className="portfolio-section-title">✅ Smart Facade afzalliklari</h4>
            <div className="portfolio-benefits">
              {project.benefits.map((b, i) => (
                <div key={i} className="portfolio-benefit">
                  <CheckCircle2 size={16} className="portfolio-benefit-icon" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="portfolio-testimonial">
              <Quote size={24} className="portfolio-testimonial-quote" />
              <p className="portfolio-testimonial-text">
                &ldquo;{project.testimonial.text}&rdquo;
              </p>
              <div className="portfolio-testimonial-footer">
                <div>
                  <div className="portfolio-testimonial-name">{project.testimonial.name}</div>
                  <StarRating rating={project.testimonial.rating} />
                </div>
              </div>
            </div>
          )}

          {/* Lead-Funnel CTA */}
          <a href="#calculator" className="portfolio-cta" onClick={(e) => {
            e.preventDefault();
            onClose();
            (window as any).openEstimateModal?.();
          }}>
            <span>Mening uyim uchun ham shunday smeta hisoblab ber</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- 3D Tilt Portfolio Card ----
function PortfolioCard({ project, onClick }: { project: PortfolioProject; onClick: () => void }) {
  const fancy = useFancyEffects();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), cfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), cfg);
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useTransform(
    [glareX, glareY] as unknown as import('framer-motion').MotionValue<string>[],
    ([x, y]: string[]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 45%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fancy) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      className="portfolio-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
      onMouseMove={fancy ? onMove : undefined}
      onMouseLeave={fancy ? onLeave : undefined}
      whileHover={fancy ? { scale: 1.03 } : undefined}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <div className="portfolio-card-img-wrapper" style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}>
        <img
          src={project.images[0].src}
          alt={project.images[0].alt}
          className="portfolio-card-img"
        />
        {/* Cursor glare */}
        {fancy && (
          <motion.div
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
              background: glareBg,
            }}
          />
        )}
        {/* Overlay */}
        <div className="portfolio-card-overlay">
          <span className="portfolio-card-view">Batafsil ko&apos;rish →</span>
        </div>
        {/* Featured badge */}
        {project.featured && (
          <span className="portfolio-card-featured">⭐ TOP</span>
        )}
      </div>

      <div className="portfolio-card-body" style={{ transform: 'translateZ(22px)' }}>
        <h3 className="portfolio-card-title">{project.title}</h3>
        <div className="portfolio-card-location">
          <MapPin size={13} /> {project.location}
        </div>
        <div className="portfolio-card-meta">
          <span><Clock size={13} /> {project.completionDays} kun</span>
          <span><Ruler size={13} /> {project.area} m²</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Main Portfolio Component ----
export default function Portfolio() {
  const { t } = useT();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProjects(getPortfolioProjects());
  }, []);

  if (!isClient) {
    return null;
  }

  const filtered = projects;

  return (
    <section className="section" id="portfolio" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-gold" style={{ marginBottom: 16 }}>
            {t('pf.badge')}
          </div>
          <h2 className="section-title" style={{ display: 'inline-block' }}>
            {t('pf.title')}
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            {t('pf.subtitle')}
          </p>
        </div>

        {/* Filters removed to avoid segmentation */}

        {/* Portfolio Grid */}
        <div className="portfolio-grid">
          {filtered.map(project => (
            <PortfolioCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="portfolio-bottom-cta" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
          <div>
            <p style={{ marginBottom: 16 }}>{t('pf.cta.text')}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#calculator" className="btn btn-primary btn-lg" onClick={(e) => {
                e.preventDefault();
                (window as any).openEstimateModal?.();
              }}>
                <Zap size={18} />
                {t('pf.cta.btn')}
              </a>
              <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <FileText size={18} />
                {t('pf.cta.catalog')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
