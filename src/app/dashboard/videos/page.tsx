'use client';

import { useState, useEffect } from 'react';
import { Film, Plus, Edit2, Trash2, X, Check, Search, Save } from 'lucide-react';
import { getVideos, saveVideo, deleteVideo, generateId } from '@/lib/store';
import { ShowcaseVideo } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

export default function VideosDashboard() {
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ShowcaseVideo | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [src, setSrc] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    setVideos(getVideos());
  }, []);

  const handleOpenModal = (video?: ShowcaseVideo) => {
    if (video) {
      setEditingVideo(video);
      setTitle(video.title);
      setDesc(video.desc);
      setSrc(video.src);
      setDuration(video.duration || '');
    } else {
      setEditingVideo(null);
      setTitle('');
      setDesc('');
      setSrc('');
      setDuration('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleSave = () => {
    if (!title.trim() || !src.trim() || !desc.trim()) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const newVideo: ShowcaseVideo = {
      id: editingVideo ? editingVideo.id : generateId(),
      title: title.trim(),
      desc: desc.trim(),
      src: src.trim(),
      duration: duration.trim() || 'Noma\'lum',
    };

    saveVideo(newVideo);
    setVideos(getVideos());
    toast.success(editingVideo ? "Video muvaffaqiyatli yangilandi!" : "Yangi video qo'shildi!");
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Ushbu videoni haqiqatan ham o'chirmoqchimisiz?")) {
      deleteVideo(id);
      setVideos(getVideos());
      toast.success("Video o'chirildi!");
    }
  };

  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '24px' }}>
      <Toaster position="top-right" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Videolar boshqaruvi
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Saytning asosiy qismida mijozlarga ko'rinadigan videolarni shu yerdan boshqarasiz.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <Plus size={18} /> Yangi Video
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div className="form-group" style={{ flex: 1, margin: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Videoni nomi orqali izlash..." 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredVideos.map((video) => (
          <div key={video.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Video preview dummy/real */}
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
              <video 
                src={video.src}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                muted
                preload="metadata"
              />
              <div style={{ 
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)'
              }}>
                <Film size={32} color="rgba(255,255,255,0.8)" />
              </div>
              <span className="badge badge-gold" style={{ position: 'absolute', top: 12, right: 12 }}>
                {video.duration}
              </span>
            </div>
            
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                {video.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                {video.desc}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button 
                  onClick={() => handleOpenModal(video)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  <Edit2 size={16} /> Tahrirlash
                </button>
                <button 
                  onClick={() => handleDelete(video.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} /> O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredVideos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Film size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Hozircha videolar topilmadi.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ 
            width: '100%', maxWidth: '560px', padding: 0, 
            animation: 'fadeInUp 0.3s ease forwards',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {editingVideo ? "Videoni tahrirlash" : "Yangi video qo'shish"}
              </h2>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Video sarlavhasi (Title) *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Masalan: Fasad montaj jarayoni..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Qisqacha tasnif (Description) *</label>
                <textarea 
                  className="form-control" 
                  placeholder="Video haqida qisqacha ma'lumot..."
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Video havolasi (URL) *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="URL: .mp4 fayl yoki boshqa video manzil"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Hozircha serverga to'g'ridan-to'g'ri MP4 havolasini kiritish tavsiya etiladi.
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Davomiyligi (Duration)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Masalan: 02:45 yoki 'Jarayon'"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={handleCloseModal}>
                Bekor qilish
              </button>
              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Save size={18} /> Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
