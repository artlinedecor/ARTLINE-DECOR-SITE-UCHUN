'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, Save, Star, MapPin, Ruler, Clock } from 'lucide-react';
import { getPortfolioProjects, savePortfolioProject, deletePortfolioProject, generateId } from '@/lib/store';
import { PortfolioProject, PortfolioStyle } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

// Rasm siqish va Base64 formatga o'tkazish (localStorage to'lib qolmasligi uchun)
const compressAndGetBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
    };
  });
};

export default function PortfolioDashboard() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | PortfolioStyle>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [style, setStyle] = useState<PortfolioStyle>('classic');
  const [description, setDescription] = useState('');
  const [completionDays, setCompletionDays] = useState(10);
  const [area, setArea] = useState(150);
  const [featured, setFeatured] = useState(false);
  
  // Lists
  const [elementsUsed, setElementsUsed] = useState(''); // Textarea (one per line)
  const [benefits, setBenefits] = useState('');         // Textarea (one per line)
  const [imagesText, setImagesText] = useState('');     // Textarea (one per line)
  
  // Before / After Media
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [afterVideo, setAfterVideo] = useState('');

  // Testimonial
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSetter: any, isAppend = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading("Rasm yuklanmoqda va siqilmoqda...");
    try {
      const base64 = await compressAndGetBase64(file);
      if (isAppend) {
        targetSetter((prev: string) => prev ? `${prev}\n${base64}` : base64);
      } else {
        targetSetter(base64);
      }
      toast.success("Rasm muvaffaqiyatli yuklandi!", { id: toastId });
    } catch (err) {
      toast.error("Rasm yuklashda xatolik!", { id: toastId });
    }
  };

  useEffect(() => {
    setProjects(getPortfolioProjects());
  }, []);

  const handleOpenModal = (project?: PortfolioProject) => {
    if (project) {
      setEditingProject(project);
      setTitle(project.title);
      setLocation(project.location);
      setStyle(project.style);
      setDescription(project.description);
      setCompletionDays(project.completionDays);
      setArea(project.area);
      setFeatured(project.featured);
      
      // Load lists
      setElementsUsed(project.elementsUsed.join('\n'));
      setBenefits(project.benefits.join('\n'));
      setImagesText(project.images.map(img => img.src).join('\n'));
      
      // Media
      setBeforeImage(project.beforeImage || '');
      setAfterImage(project.afterImage || '');
      setAfterVideo(project.afterVideo || '');

      // Testimonial
      if (project.testimonial) {
        setTestimonialName(project.testimonial.name);
        setTestimonialText(project.testimonial.text);
        setTestimonialRating(project.testimonial.rating);
      } else {
        setTestimonialName('');
        setTestimonialText('');
        setTestimonialRating(5);
      }
    } else {
      setEditingProject(null);
      setTitle('');
      setLocation('');
      setStyle('classic');
      setDescription('');
      setCompletionDays(10);
      setArea(150);
      setFeatured(false);
      setElementsUsed('Termo panel\nBK-220/2 korniz\nKL-150 ustunlar');
      setBenefits('Issiqlik izolyatsiyasini 30% ga oshiradi\nYengil va mustahkam, binoga ortiqcha yuk tushirmaydi');
      setImagesText('/portfolio/classic-villa.png');
      setBeforeImage('');
      setAfterImage('');
      setAfterVideo('');
      setTestimonialName('');
      setTestimonialText('');
      setTestimonialRating(5);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSave = () => {
    if (!title.trim() || !location.trim() || !description.trim() || !imagesText.trim()) {
      toast.error("Iltimos, sarlavha, manzil, tavsif va rasmlarni kiriting!");
      return;
    }

    // Process lists
    const parsedImages = imagesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(src => ({ src, alt: title.trim() }));

    if (parsedImages.length === 0) {
      toast.error("Kamida bitta loyiha rasmi URLini kiriting!");
      return;
    }

    const parsedElements = elementsUsed
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const parsedBenefits = benefits
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Build project object
    const updatedProject: PortfolioProject = {
      id: editingProject ? editingProject.id : generateId(),
      title: title.trim(),
      location: location.trim(),
      style,
      description: description.trim(),
      completionDays: Number(completionDays) || 10,
      area: Number(area) || 150,
      elementsUsed: parsedElements,
      benefits: parsedBenefits,
      images: parsedImages,
      featured,
    };

    if (beforeImage.trim()) updatedProject.beforeImage = beforeImage.trim();
    if (afterImage.trim()) updatedProject.afterImage = afterImage.trim();
    if (afterVideo.trim()) updatedProject.afterVideo = afterVideo.trim();

    if (testimonialName.trim() && testimonialText.trim()) {
      updatedProject.testimonial = {
        name: testimonialName.trim(),
        text: testimonialText.trim(),
        rating: testimonialRating,
      };
    }

    savePortfolioProject(updatedProject);
    const allProjects = getPortfolioProjects();
    setProjects(allProjects);
    
    // Server file systemiga saqlash (mahalliy ishlab chiqish muhiti uchun)
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allProjects)
    }).catch(err => console.error("Faylga yozishda xatolik:", err));

    toast.success(editingProject ? "Loyiha muvaffaqiyatli tahrirlandi!" : "Yangi loyiha qo'shildi!");
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Ushbu loyihani portfolio ro'yxatidan o'chirmoqchimisiz?")) {
      deletePortfolioProject(id);
      const allProjects = getPortfolioProjects();
      setProjects(allProjects);

      // Server file systemiga saqlash
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allProjects)
      }).catch(err => console.error("Faylga yozishda xatolik:", err));

      toast.success("Loyiha o'chirib tashlandi!");
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.style === activeFilter;
    return matchesFilter;
  });

  return (
    <div style={{ padding: '24px' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Portfolio boshqaruvi
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Saytning portfolio (bajarilgan ishlar) bo'limini shu yerdan boshqarasiz.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <Plus size={18} /> Yangi Loyiha
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredProjects.map((project) => (
          <div key={project.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Project Cover Image */}
            <div style={{ width: '100%', aspectRatio: '16/10', background: '#000', position: 'relative' }}>
              <img 
                src={project.images[0]?.src || '/portfolio/classic-villa.png'} 
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {project.featured && (
                <span className="badge badge-gold" style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent-warm)', border: 'none' }}>
                  ⭐ TOP
                </span>
              )}
            </div>

            {/* Project Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                {project.title}
              </h3>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {project.location}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} style={{ color: 'var(--accent-warm)' }} /> {project.completionDays} kun
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ruler size={14} style={{ color: 'var(--accent-warm)' }} /> {project.area} m²
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                {project.description.slice(0, 120)}...
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button 
                  onClick={() => handleOpenModal(project)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  <Edit2 size={16} /> Tahrirlash
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} /> O'chirish
                </button>
              </div>
            </div>

          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Briefcase size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Hozircha mos keladigan loyihalar topilmadi.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ 
            width: '100%', maxWidth: '640px', padding: 0, 
            animation: 'fadeInUp 0.3s ease forwards',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {editingProject ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}
              </h2>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Loyiha sarlavhasi (Title) *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Manzil (Location) *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Muddati (Kun) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={completionDays}
                    onChange={(e) => setCompletionDays(Number(e.target.value))}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Maydoni (m²) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Batafsil tavsif (Description) *</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Galereya rasmlari (Image URLs - har bir qatorda bitta URL) *</label>
                  <label style={{ 
                    background: 'var(--accent-glow)', color: '#fff', padding: '4px 10px', 
                    borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '4px' 
                  }}>
                    📁 Galereyadan yuklash
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e, setImagesText, true)} 
                    />
                  </label>
                </div>
                <textarea 
                  className="form-control" 
                  rows={3}
                  placeholder="/portfolio/classic-villa.png&#10;/portfolio/termo-panel-montaj.jpg"
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                />
              </div>

              {/* Before/After Media */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  🔄 Oldin / Keyin (Before & After Slider) — Ixtiyoriy
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>Oldingi rasm (Before Image)</label>
                      <label style={{ 
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', 
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', cursor: 'pointer' 
                      }}>
                        📁 Galereyadan yuklash
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleFileUpload(e, setBeforeImage)} 
                        />
                      </label>
                    </div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masalan: /portfolio/1-before.jpg"
                      value={beforeImage}
                      onChange={(e) => setBeforeImage(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>Keyingi rasm (After Image)</label>
                      <label style={{ 
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', 
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', cursor: 'pointer' 
                      }}>
                        📁 Galereyadan yuklash
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleFileUpload(e, setAfterImage)} 
                        />
                      </label>
                    </div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masalan: /portfolio/2-after.jpg"
                      value={afterImage}
                      onChange={(e) => setAfterImage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Keyingi video (After Video - MP4 / YouTube)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Masalan: /portfolio/1-after-video.mp4"
                    value={afterVideo}
                    onChange={(e) => setAfterVideo(e.target.value)}
                  />
                </div>
              </div>

              {/* Lists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Ishlatilgan elementlar (Har qatorda bittadan)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Termo panel&#10;Korniz&#10;Ustunlar"
                    value={elementsUsed}
                    onChange={(e) => setElementsUsed(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Afzalliklar (Har qatorda bittadan)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Energiya tejamkorligi&#10;Tezkor montaj"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  💬 Mijoz fikri (Testimonial) — Ixtiyoriy
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Mijoz ismi</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Sherzod Karimov"
                      value={testimonialName}
                      onChange={(e) => setTestimonialName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Baholash (Yulduzcha)</label>
                    <select
                      className="form-control"
                      value={testimonialRating}
                      onChange={(e) => setTestimonialRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} ⭐</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Fikr matni</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    placeholder="Ular uyni judayam ajoyib holatga keltirib berishdi..."
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '4px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  Loyihani TOP (Saralangan) ro'yxatga chiqarish (Featured Project)
                </label>
              </div>

            </div>

            {/* Modal Footer */}
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
