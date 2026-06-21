'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Film, CheckCircle2, Maximize2 } from 'lucide-react';
import { getVideos } from '@/lib/store';
import type { ShowcaseVideo } from '@/lib/types';
import TiltCard from '@/components/effects/TiltCard';

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
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

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
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Video Obzorlar</div>
          <h2 className="section-title">Yuklanmoqda...</h2>
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
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Video Obzorlar</div>
          <h2 className="section-title">Mahsulotlarimiz bilan albatta tanishib chiqing!</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0', maxWidth: '750px' }}>
            Artline Decor termo-panellari qanday tayyorlanadi, g&apos;isht ustiga qanday montaj qilinadi va yakunda qanday hashamatli ko&apos;rinish oladi? Barchasini vertikal videolarda tomosha qiling.
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

        {/* Immersive Lightbox Modal */}
        {activeVideo && (
          <div className="video-lightbox" onClick={handleClose}>
            <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
              
              {/* Close Button */}
              <button className="lightbox-close" onClick={handleClose} aria-label="Yopish">
                <X size={20} />
              </button>

              {/* Prev Button */}
              <button className="lightbox-btn lightbox-btn-prev" onClick={handlePrev} aria-label="Oldingi video">
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
              <button className="lightbox-btn lightbox-btn-next" onClick={handleNext} aria-label="Keyingi video">
                <ChevronRight size={28} />
              </button>

              {/* Title & Desc under video */}
              <div className="lightbox-info">
                <h3 className="lightbox-title">{activeVideo.title}</h3>
                <p className="lightbox-desc">{activeVideo.desc}</p>
              </div>

            </div>
          </div>
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
                  10 Yillik Rasmiy Kafolat
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Akril tosh qoplamamiz quyoshda yemirilmaydi, yomg&apos;ir suvini o&apos;tkazmaydi va sovuqda yorilib ketmaydi.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
