'use client';

import { useState, useEffect } from 'react';
import { Play, Film, CheckCircle2 } from 'lucide-react';
import { getVideos } from '@/lib/store';
import type { ShowcaseVideo } from '@/lib/types';

export default function VideoShowcase() {
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadedVideos = getVideos();
    setVideos(loadedVideos);
    if (loadedVideos.length > 0) {
      setActiveVideo(loadedVideos[0]);
    }
  }, []);

  // Avoid hydration mismatch by not rendering video player until client-side loads
  if (!isClient) {
    return null; // Yoki qandaydir skeleton
  }

  if (videos.length === 0 || !activeVideo) {
    return null;
  }

  return (
    <section className="section" id="videos" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>Video Obzorlar</div>
          <h2 className="section-title">Mahsulotlarimiz bilan albatta tanishib chiqing!</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0', maxWidth: '750px' }}>
            Artline Decor termo-panellari qanday tayyorlanadi, g&apos;isht ustiga qanday montaj qilinadi va yakunda qanday hashamatli ko&apos;rinish oladi? Barchasini grafikalar emas, haqiqiy videolarda tomosha qiling.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start' }} className="facade-container">
          {/* Active Video Player */}
          <div className="glass-card" style={{ padding: 12, borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
              <video
                key={activeVideo.id}
                src={activeVideo.src}
                controls
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '20px 12px 12px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, color: 'var(--accent-warm)', fontFamily: 'var(--font-heading)' }}>
                {activeVideo.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {activeVideo.desc}
              </p>
            </div>
          </div>

          {/* Video List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {videos.map((video) => {
              const isActive = video.id === activeVideo.id;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: isActive ? '1px solid var(--accent-gold)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    boxShadow: isActive ? 'var(--shadow-gold)' : 'none',
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'var(--accent-glow)' : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {isActive ? <Play size={20} fill="currentColor" /> : <Film size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      marginBottom: 4,
                      fontFamily: 'var(--font-heading)',
                    }}>
                      {video.title}
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 500,
                    }}>
                      {video.duration}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Guarantee Box */}
            <div className="glass-card" style={{
              background: 'var(--bg-tertiary)',
              border: '1px dashed var(--border-gold)',
              padding: 20,
              marginTop: 12,
            }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4, fontWeight: 600 }}>
                    10 Yillik Rasmiy Kafolat
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Akril tosh qoplamamiz quyoshda yemirilmaydi, yomg&apos;ir suvini o&apos;tkazmaydi va sovuqda yorilib ketmaydi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
