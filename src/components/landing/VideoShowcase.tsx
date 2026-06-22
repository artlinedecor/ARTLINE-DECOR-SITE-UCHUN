'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, ChevronLeft, ChevronRight, Film, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';
import { getVideos } from '@/lib/store';
import type { ShowcaseVideo } from '@/lib/types';
import TiltCard from '@/components/effects/TiltCard';
import { useT } from '@/lib/i18n';

// Extract YouTube ID from various YouTube URL formats
function getYouTubeId(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
}

// Convert YouTube links (regular and Shorts) to embed format
function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}

// Retrieve high quality YouTube video thumbnail
function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png';
}

export default function VideoShowcase() {
  const { t } = useT();
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const lightboxRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const loadedVideos = getVideos();
    setVideos(loadedVideos);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeIdx === null || videos.length === 0) return;
    setActiveIdx((prevIdx) => (prevIdx === null ? 0 : (prevIdx - 1 + videos.length) % videos.length));
  }, [activeIdx, videos.length]);

  const handleNext = useCallback(() => {
    if (activeIdx === null || videos.length === 0) return;
    setActiveIdx((prevIdx) => (prevIdx === null ? 0 : (prevIdx + 1) % videos.length));
  }, [activeIdx, videos.length]);

  const handleClose = useCallback(() => {
    setActiveIdx(null);
  }, []);

  // Bulletproof scroll lock: position:fixed body + html overflow hidden
  const isOpen = activeIdx !== null;
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const html = document.documentElement;
    const body = document.body;
    const orig = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverflow: html.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
    };
    // Disable smooth scrolling so restore is instant
    html.style.scrollBehavior = 'auto';
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      body.style.position = orig.bodyPosition;
      body.style.top = orig.bodyTop;
      body.style.left = orig.bodyLeft;
      body.style.right = orig.bodyRight;
      body.style.width = orig.bodyWidth;
      body.style.overflow = orig.bodyOverflow;
      body.style.paddingRight = orig.bodyPaddingRight;
      html.style.overflow = orig.htmlOverflow;
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = orig.htmlScrollBehavior;
    };
  }, [isOpen]);

  // Listen for keyboard controls inside lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, handleClose, handlePrev, handleNext]);

  if (!isClient) {
    return (
      <section className="section" id="videos" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>{t('vs.badge')}</div>
          <h2 className="section-title">{t('vs.loading')}</h2>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  const activeVideo = activeIdx !== null ? videos[activeIdx] : null;

  return (
    <section className="section" id="videos" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>{t('vs.badge')}</div>
          <h2 className="section-title">{t('vs.title')}</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0', maxWidth: '750px' }}>
            {t('vs.subtitle')}
          </p>
        </div>

        {/* 9:16 Vertical Video Grid */}
        <div className="video-grid">
          {videos.map((video, idx) => (
            <TiltCard
              key={video.id}
              className="video-card"
              max={6}
              scale={1.03}
              onClick={() => setActiveIdx(idx)}
            >
              <img
                src={getYouTubeThumbnail(video.src)} 
                alt={video.title} 
                className="video-card-img" 
                loading="lazy"
              />
              <div className="video-card-overlay">
                <span className="video-card-badge">{video.duration}</span>
                <div className="video-card-play-btn">
                  <Play size={24} fill="currentColor" style={{ marginLeft: 4 }} />
                </div>
                <div className="video-card-info">
                  <h4 className="video-card-title">{video.title}</h4>
                  <p className="video-card-desc">{video.desc}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Immersive Lightbox Modal — portal to body */}
        {activeVideo && typeof window !== 'undefined' && createPortal(
          <div
            className="video-lightbox"
            onClick={handleClose}
            ref={lightboxRef}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) > 60) { if (dx < 0) handleNext(); else handlePrev(); }
            }}
          >
            <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>

              {/* Fullscreen Button */}
              <button
                type="button"
                className="lightbox-fullscreen-btn"
                aria-label="Fullscreen"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const el = lightboxRef.current as any;
                  if (!el) return;
                  try {
                    if (!document.fullscreenElement) {
                      await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
                      setIsFullscreen(true);
                    } else {
                      await (document.exitFullscreen?.() ?? (document as any).webkitExitFullscreen?.());
                      setIsFullscreen(false);
                    }
                  } catch {}
                }}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              {/* Close Button */}
              <button type="button" className="lightbox-close" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClose(); }} aria-label="Yopish">
                <X size={20} />
              </button>

              {/* Prev Button */}
              <button type="button" className="lightbox-btn lightbox-btn-prev" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrev(); }} aria-label="Oldingi video">
                <ChevronLeft size={28} />
              </button>

              {/* Main 9:16 Video Wrapper */}
              <div className="lightbox-video-wrapper">
                {getYouTubeEmbedUrl(activeVideo.src) ? (
                  <iframe
                    key={activeVideo.id}
                    src={getYouTubeEmbedUrl(activeVideo.src)!}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <video
                    key={activeVideo.id}
                    src={activeVideo.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Next Button */}
              <button type="button" className="lightbox-btn lightbox-btn-next" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNext(); }} aria-label="Keyingi video">
                <ChevronRight size={28} />
              </button>

              {/* Title & Desc under video */}
              <div className="lightbox-info">
                <h3 className="lightbox-title">{activeVideo.title}</h3>
                <p className="lightbox-desc">{activeVideo.desc}</p>
              </div>

            </div>
          </div>,
          document.body
        )}

        {/* Quick Guarantee Box */}
        <div style={{ maxWidth: '600px', margin: '48px auto 0' }}>
          <div className="glass-card" style={{
            background: 'var(--bg-tertiary)',
            border: '1px dashed var(--border-gold)',
            padding: 20,
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <CheckCircle2 size={28} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6, fontWeight: 600 }}>
                  {t('vs.guarantee.title')}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {t('vs.guarantee.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
