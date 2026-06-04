'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Clock, Ruler, Star, ChevronLeft, ChevronRight,
  Zap, CheckCircle2, Quote, ArrowRight, FileText,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, STYLE_LABELS } from '@/lib/portfolio-data';
import type { PortfolioProject, PortfolioStyle } from '@/lib/types';
import BeforeAfterSlider from './BeforeAfterSlider';

type FilterKey = 'all' | PortfolioStyle;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Barchasi' },
  { key: 'classic', label: '🏛️ Klassik' },
  { key: 'modern', label: '🔷 Zamonaviy' },
  { key: 'hitech', label: '⚡ Hi-Tech' },
];

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

  if (images.length <= 1) {
    return (
      <div className="portfolio-modal-img-wrapper">
        <img src={images[0]?.src} alt={images[0]?.alt} className="portfolio-modal-img" />
      </div>
    );
  }

  return (
    <div className="portfolio-modal-img-wrapper">
      <img src={images[current].src} alt={images[current].alt} className="portfolio-modal-img" />
      <button
        className="portfolio-carousel-btn portfolio-carousel-prev"
        onClick={() => setCurrent(p => (p === 0 ? images.length - 1 : p - 1))}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="portfolio-carousel-btn portfolio-carousel-next"
        onClick={() => setCurrent(p => (p === images.length - 1 ? 0 : p + 1))}
      >
        <ChevronRight size={20} />
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
    </div>
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
  const styleInfo = STYLE_LABELS[project.style];
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
                      <video src={project.afterVideo} controls autoPlay loop muted playsInline className="video-compare-media" />
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
              <span
                className="badge"
                style={{
                  background: `${styleInfo.color}20`,
                  color: styleInfo.color,
                  fontSize: '0.7rem',
                }}
              >
                {styleInfo.uz}
              </span>
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
          <a href="#calculator" className="portfolio-cta" onClick={onClose}>
            <span>Mening uyim uchun ham shunday smeta hisoblab ber</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- Main Portfolio Component ----
export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filtered =
    activeFilter === 'all'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter(p => p.style === activeFilter);

  return (
    <section className="section" id="portfolio" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-gold" style={{ marginBottom: 16 }}>
            500+ bajarilgan loyiha
          </div>
          <h2 className="section-title" style={{ display: 'inline-block' }}>
            Premium Portfolio
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Har bir loyiha — bizning mahorat va sifatimizning isboti. Bosing va batafsil ko&apos;ring.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="portfolio-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`portfolio-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div className="portfolio-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map(project => {
              const styleInfo = STYLE_LABELS[project.style];
              return (
                <motion.div
                  key={project.id}
                  className="portfolio-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="portfolio-card-img-wrapper">
                    <img
                      src={project.images[0].src}
                      alt={project.images[0].alt}
                      className="portfolio-card-img"
                    />
                    {/* Overlay */}
                    <div className="portfolio-card-overlay">
                      <span className="portfolio-card-view">Batafsil ko&apos;rish →</span>
                    </div>
                    {/* Style badge */}
                    <span
                      className="portfolio-card-badge"
                      style={{ background: `${styleInfo.color}cc`, color: '#fff' }}
                    >
                      {styleInfo.uz}
                    </span>
                    {/* Featured badge */}
                    {project.featured && (
                      <span className="portfolio-card-featured">⭐ TOP</span>
                    )}
                  </div>

                  <div className="portfolio-card-body">
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
            })}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <div className="portfolio-bottom-cta" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center' }}>
          <div>
            <p style={{ marginBottom: 16 }}>Sizning uyingiz ham shunday chiroyli bo&apos;lishi mumkin</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#calculator" className="btn btn-primary btn-lg">
                <Zap size={18} />
                Bepul smeta hisoblash
              </a>
              <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download className="btn btn-outline btn-lg" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <FileText size={18} />
                Fasad katalogini yuklab olish (PDF)
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
