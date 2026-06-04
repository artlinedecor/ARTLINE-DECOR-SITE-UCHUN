'use client';

import { Video, Camera } from 'lucide-react';

const YOUTUBE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Fasad dekor o\'rnatish jarayoni' },
  { id: 'dQw4w9WgXcQ', title: 'Karniz va ustun montaji' },
];

export default function SocialFeed() {
  return (
    <section className="section" id="social" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="section-title" style={{ display: 'inline-block' }}>Ijtimoiy Tarmoqlar</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Bizni kuzatib boring — yangi loyihalar va video darsliklar
          </p>
        </div>

        {/* YouTube */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '1.1rem' }}>
            <Video size={20} style={{ color: '#ff0000' }} />
            YouTube — Video darsliklar
          </h3>
          <div className="social-grid">
            {YOUTUBE_VIDEOS.map((video, idx) => (
              <div key={idx} className="social-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{video.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '1.1rem' }}>
            <Camera size={20} style={{ color: '#e1306c' }} />
            Instagram — Loyihalar galereyasi
          </h3>
          <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
            <Camera size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Instagram feed bu yerda ko&apos;rinadi. API kalitlarini .env.local faylga qo&apos;shing.
            </p>
            <a href="https://instagram.com/artlinedecor" target="_blank" rel="noopener noreferrer"
              className="btn btn-outline btn-sm">
              <Camera size={14} /> @artlinedecor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
