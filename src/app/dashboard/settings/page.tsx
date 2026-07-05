'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, Save, AlertCircle, CheckCircle, Send, HelpCircle, 
  Briefcase, Plus, Edit2, Trash2, X, Star, MapPin, Ruler, Clock, 
  Film, Check, Search, Globe 
} from 'lucide-react';
import { 
  getPortfolioProjects, savePortfolioProject, deletePortfolioProject, 
  getVideos, saveVideo, deleteVideo, generateId 
} from '@/lib/store';
import { PortfolioProject, PortfolioStyle, ShowcaseVideo } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

// Instagram icon helper
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// YouTube link parser
function getYouTubeEmbedUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}

// Base64 image compression helper
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

export default function SettingsDashboard() {
  const [subTab, setSubTab] = useState<'integrations' | 'portfolio' | 'videos'>('integrations');

  // ---- INTEGRATIONS STATE ----
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mockLoading, setMockLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  // ---- PORTFOLIO STATE ----
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [portfolioFilter, setPortfolioFilter] = useState<'all' | PortfolioStyle>('all');
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  // Portfolio Form
  const [pTitle, setPTitle] = useState('');
  const [pLocation, setPLocation] = useState('');
  const [pStyle, setPStyle] = useState<PortfolioStyle>('classic');
  const [pDescription, setPDescription] = useState('');
  const [pCompletionDays, setPCompletionDays] = useState(10);
  const [pArea, setPArea] = useState(150);
  const [pFeatured, setPFeatured] = useState(false);
  const [pElementsUsed, setPElementsUsed] = useState('');
  const [pBenefits, setPBenefits] = useState('');
  const [pImagesText, setPImagesText] = useState('');
  const [pBeforeImage, setPBeforeImage] = useState('');
  const [pAfterImage, setPAfterImage] = useState('');
  const [pAfterVideo, setPAfterVideo] = useState('');
  const [pTestimonialName, setPTestimonialName] = useState('');
  const [pTestimonialText, setPTestimonialText] = useState('');
  const [pTestimonialRating, setPTestimonialRating] = useState(5);

  // ---- VIDEOS STATE ----
  const [videos, setVideos] = useState<ShowcaseVideo[]>([]);
  const [videoSearch, setVideoSearch] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ShowcaseVideo | null>(null);

  // Video Form
  const [vTitle, setVTitle] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vSrc, setVSrc] = useState('');
  const [vDuration, setVDuration] = useState('');

  // Load configuration and data
  useEffect(() => {
    // Generate current origin webhook URL
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhooks/instagram`);
    }

    // Load Telegram config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          setTelegramBotToken(data.config.telegramBotToken || '');
          setTelegramChatId(data.config.telegramChatId || '');
        }
      })
      .catch(err => console.error('Error loading config:', err));

    // Load Portfolio & Videos
    setProjects(getPortfolioProjects());
    setVideos(getVideos());
  }, []);

  // Save Telegram config
  const handleSaveTelegram = async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramBotToken, telegramChatId }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('success');
        toast.success("Telegram sozlamalari muvaffaqiyatli saqlandi!");
      } else {
        setSaveStatus('error');
        toast.error("Saqlashda xatolik yuz berdi.");
      }
    } catch {
      setSaveStatus('error');
      toast.error("Server bilan ulanishda xato.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Instagram Mock webhook lead generator
  const handleSendMockLead = async () => {
    setMockLoading(true);
    const mockNames = ['Jahongir Olimov', 'Sardor Rahmonov', 'Madina Shodieva', 'Dilshod Karimov', 'Nodira Alieva'];
    const mockPhones = ['+998 90 321 45 76', '+998 93 555 12 34', '+998 97 101 02 03', '+998 99 888 77 66', '+998 94 444 33 22'];
    const mockAddresses = ['Toshkent sh., Yunusobod tumani', 'Samarqand sh., Registon ko\'chasi', 'Toshkent sh., Chilonzor 9-daha', 'Buxoro sh., mustaqillik ko\'chasi', 'Farg\'ona sh., Sayilgoh ko\'chasi'];
    const mockNotes = [
      'Instagram Ads orqali "Termo panellar" reklamasidan.',
      'Instagram Direct: Fasad narxlari haqida so\'radi.',
      'Yangi qurilayotgan kottej uchun smeta kerak.',
      'Profil sarlavhasidagi havola orqali kirdi.',
      'Instagram Story: Klassik fasad dizayniga qiziqyapti.'
    ];

    const idx = Math.floor(Math.random() * mockNames.length);

    try {
      const res = await fetch('/api/webhooks/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: mockNames[idx],
          phone: mockPhones[idx],
          address: mockAddresses[idx],
          totalPrice: Math.floor(Math.random() * 8 + 3) * 500, // $1500 to $5000
          notes: mockNotes[idx]
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Mock Lead: ${mockNames[idx]} Kanban CRM "Yangi" bosqichiga qo'shildi!`);
      } else {
        toast.error('Webhook simulyatsiyasida xatolik.');
      }
    } catch {
      toast.error('Ulanishda xato.');
    } finally {
      setMockLoading(false);
    }
  };

  // ---- PORTFOLIO ACTIONS ----
  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetSetter: any, isAppend = false) => {
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

  const handleOpenPortfolioModal = (project?: PortfolioProject) => {
    if (project) {
      setEditingProject(project);
      setPTitle(project.title);
      setPLocation(project.location);
      setPStyle(project.style);
      setPDescription(project.description);
      setPCompletionDays(project.completionDays);
      setPArea(project.area);
      setPFeatured(project.featured);
      setPElementsUsed(project.elementsUsed.join('\n'));
      setPBenefits(project.benefits.join('\n'));
      setPImagesText(project.images.map(img => img.src).join('\n'));
      setPBeforeImage(project.beforeImage || '');
      setPAfterImage(project.afterImage || '');
      setPAfterVideo(project.afterVideo || '');
      if (project.testimonial) {
        setPTestimonialName(project.testimonial.name);
        setPTestimonialText(project.testimonial.text);
        setPTestimonialRating(project.testimonial.rating);
      } else {
        setPTestimonialName('');
        setPTestimonialText('');
        setPTestimonialRating(5);
      }
    } else {
      setEditingProject(null);
      setPTitle('');
      setPLocation('');
      setPStyle('classic');
      setPDescription('');
      setPCompletionDays(10);
      setPArea(150);
      setPFeatured(false);
      setPElementsUsed('Termo panel\nK-12 korniz\nM-05 molding');
      setPBenefits('Issiqlik izolyatsiyasini 30% ga oshiradi\nYengil va sifatli dekorativ jilo');
      setPImagesText('/portfolio/classic-villa.png');
      setPBeforeImage('');
      setPAfterImage('');
      setPAfterVideo('');
      setPTestimonialName('');
      setPTestimonialText('');
      setPTestimonialRating(5);
    }
    setIsPortfolioModalOpen(true);
  };

  const handleSavePortfolio = () => {
    if (!pTitle.trim() || !pLocation.trim() || !pDescription.trim() || !pImagesText.trim()) {
      toast.error("Sarlavha, manzil, tavsif va rasmlarni to'liq to'ldiring!");
      return;
    }

    const parsedImages = pImagesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(src => ({ src, alt: pTitle.trim() }));

    if (parsedImages.length === 0) {
      toast.error("Kamida bitta loyiha rasmi URLini kiriting!");
      return;
    }

    const updated: PortfolioProject = {
      id: editingProject ? editingProject.id : generateId(),
      title: pTitle.trim(),
      location: pLocation.trim(),
      style: pStyle,
      description: pDescription.trim(),
      completionDays: Number(pCompletionDays) || 10,
      area: Number(pArea) || 150,
      elementsUsed: pElementsUsed.split('\n').map(line => line.trim()).filter(Boolean),
      benefits: pBenefits.split('\n').map(line => line.trim()).filter(Boolean),
      images: parsedImages,
      featured: pFeatured
    };

    if (pBeforeImage.trim()) updated.beforeImage = pBeforeImage.trim();
    if (pAfterImage.trim()) updated.afterImage = pAfterImage.trim();
    if (pAfterVideo.trim()) updated.afterVideo = pAfterVideo.trim();

    if (pTestimonialName.trim() && pTestimonialText.trim()) {
      updated.testimonial = {
        name: pTestimonialName.trim(),
        text: pTestimonialText.trim(),
        rating: pTestimonialRating
      };
    }

    savePortfolioProject(updated);
    const all = getPortfolioProjects();
    setProjects(all);

    // Save to backend JSON file
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all)
    }).catch(err => console.error("Error saving portfolio:", err));

    toast.success(editingProject ? "Loyiha yangilandi!" : "Yangi loyiha qo'shildi!");
    setIsPortfolioModalOpen(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (!window.confirm("Loyihani portfoliodan o'chirib yubormoqchimisiz?")) return;
    deletePortfolioProject(id);
    const all = getPortfolioProjects();
    setProjects(all);
    
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all)
    }).catch(err => console.error(err));
    
    toast.success("Loyiha o'chirib yuborildi!");
  };

  // ---- VIDEOS ACTIONS ----
  const handleOpenVideoModal = (video?: ShowcaseVideo) => {
    if (video) {
      setEditingVideo(video);
      setVTitle(video.title);
      setVDesc(video.desc);
      setVSrc(video.src);
      setVDuration(video.duration || '');
    } else {
      setEditingVideo(null);
      setVTitle('');
      setVDesc('');
      setVSrc('');
      setVDuration('');
    }
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = () => {
    if (!vSrc.trim()) {
      toast.error("Video havolasini (URL) kiriting!");
      return;
    }

    const nextVideo: ShowcaseVideo = {
      id: editingVideo ? editingVideo.id : generateId(),
      title: vTitle.trim() || 'Fasad video obzor',
      desc: vDesc.trim() || 'Artline Decor dekorativ qoplamalari',
      src: vSrc.trim(),
      duration: vDuration.trim() || 'Video'
    };

    saveVideo(nextVideo);
    const all = getVideos();
    setVideos(all);

    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all)
    }).catch(err => console.error(err));

    toast.success(editingVideo ? "Video tahrirlandi!" : "Video qo'shildi!");
    setIsVideoModalOpen(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (!window.confirm("Videoni o'chirishni tasdiqlaysizmi?")) return;
    deleteVideo(id);
    const all = getVideos();
    setVideos(all);

    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all)
    }).catch(err => console.error(err));

    toast.success("Video o'chirildi!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="dash-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)', border: '1px solid var(--border-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-gold)',
          }}>
            <Settings size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', lineHeight: 1 }}>Sozlamalar va Kontent</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
              Sayt portfoliosi, video obzorlar va tashqi tizimlar ulanishlari sozlamalari
            </p>
          </div>
        </div>
        
        {subTab === 'portfolio' && (
          <button className="btn btn-primary btn-sm" onClick={() => handleOpenPortfolioModal()}>
            <Plus size={14} /> Yangi Loyiha
          </button>
        )}
        {subTab === 'videos' && (
          <button className="btn btn-primary btn-sm" onClick={() => handleOpenVideoModal()}>
            <Plus size={14} /> Yangi Video
          </button>
        )}
      </div>

      {/* Sub Tabs Navigation */}
      <div className="tab-container" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setSubTab('integrations')}
          className={`btn ${subTab === 'integrations' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Globe size={16} style={{ marginRight: 8 }} />
          Ulanishlar (API & Bots)
        </button>
        <button 
          onClick={() => setSubTab('portfolio')}
          className={`btn ${subTab === 'portfolio' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Briefcase size={16} style={{ marginRight: 8 }} />
          Portfolio Sozlamalari
        </button>
        <button 
          onClick={() => setSubTab('videos')}
          className={`btn ${subTab === 'videos' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Film size={16} style={{ marginRight: 8 }} />
          Media & Videolar
        </button>
      </div>

      {/* TAB 1: API INTEGRATIONS */}
      {subTab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Telegram Config */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 6, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={18} /> Telegram Bot Integratsiyasi
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                Yangi lead yoki zamer buyurtmalari olinganda ma'lumotlarni Telegram guruhingizga real vaqtda yuborish
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Telegram Bot Token</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    value={telegramBotToken}
                    onChange={e => setTelegramBotToken(e.target.value)}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    @BotFather orqali yaratilgan bot tokeni
                  </span>
                </div>

                <div className="input-group">
                  <label>Telegram Chat ID</label>
                  <input
                    className="input-field"
                    placeholder="Masalan: -100123456789"
                    value={telegramChatId}
                    onChange={e => setTelegramChatId(e.target.value)}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Bot xabarlarni yuborishi kerak bo'lgan guruh yoki chat ID raqami
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveTelegram}
                    disabled={saving}
                  >
                    <Save size={16} style={{ marginRight: 6 }} />
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </div>
            </div>

            {/* Instagram Webhook */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 6, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <InstagramIcon size={18} /> Instagram Leads Webhook
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                Instagram Lead Ads va Direct orqali kelgan buyurtmalarni avtomatik ravishda Kanban CRM-ga kiritish
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Webhook URL (Callback URL)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="input-field"
                      readOnly
                      value={webhookUrl}
                      style={{ background: 'rgba(0,0,0,0.15)', cursor: 'text' }}
                      onClick={e => (e.currentTarget.select())}
                    />
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        toast.success('Webhook URL nusxalandi!');
                      }}
                    >
                      Nusxa olish
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Verify Token (Tasdiqlash kaliti)</label>
                  <input
                    className="input-field"
                    readOnly
                    value="artline_verify_token"
                    style={{ background: 'rgba(0,0,0,0.15)' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Webhookni test qilish (Simulyatsiya):</h4>
                  <button
                    className="btn btn-ghost"
                    onClick={handleSendMockLead}
                    disabled={mockLoading}
                    style={{ border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', fontSize: '0.85rem' }}
                  >
                    <Send size={14} style={{ marginRight: 6 }} />
                    {mockLoading ? 'Yuborilmoqda...' : 'Instagram-dan test lead yuborish'}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* FAQ Docs */}
          <div className="glass-card" style={{ padding: 24, height: 'fit-content' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={16} /> Tezkor Qo'llanma
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              <div>
                <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>1. Telegram boti:</h4>
                <p>Bot yaratish uchun Telegram-da <b>@BotFather</b> boti orqali yangi token oling. So'ngra guruh chat ID raqamini aniqlash uchun botni guruhga qo'shib admin qiling.</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>2. Meta Facebook Webhook:</h4>
                <p>Meta Developers (developers.facebook.com) portaliga kirib, Callback URL ga chapdagi webhook havolasini kiritib tasdiqlang.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO LISTING */}
      {subTab === 'portfolio' && (
        <div>
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <button className={`btn btn-sm ${portfolioFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPortfolioFilter('all')}>Barchasi</button>
            <button className={`btn btn-sm ${portfolioFilter === 'classic' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPortfolioFilter('classic')}>Klassik</button>
            <button className={`btn btn-sm ${portfolioFilter === 'modern' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPortfolioFilter('modern')}>Modern</button>
            <button className={`btn btn-sm ${portfolioFilter === 'hitech' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPortfolioFilter('hitech')}>Hi-Tech</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {projects.filter(p => portfolioFilter === 'all' || p.style === portfolioFilter).map(project => (
              <div key={project.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '16/10', background: '#000', position: 'relative' }}>
                  <img src={project.images[0]?.src} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {project.featured && <span className="badge badge-gold" style={{ position: 'absolute', top: 10, left: 10 }}>TOP ⭐</span>}
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{project.title}</h3>
                  <div style={{ display: 'flex', gap: 10, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    <span>📍 {project.location}</span>
                    <span>📐 {project.area} m²</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleOpenPortfolioModal(project)} style={{ flex: 1 }}><Edit2 size={14} /> Tahrirlash</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeletePortfolio(project.id)} style={{ flex: 1, color: 'var(--error)' }}><Trash2 size={14} /> O'chirish</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VIDEOS LISTING */}
      {subTab === 'videos' && (
        <div>
          <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Videolar sarlavhasi bo'yicha qidirish..." 
                className="input-field" 
                style={{ width: '100%', paddingLeft: 36 }}
                value={videoSearch}
                onChange={e => setVideoSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {videos.filter(v => v.title.toLowerCase().includes(videoSearch.toLowerCase())).map(video => (
              <div key={video.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                  {getYouTubeEmbedUrl(video.src) ? (
                    <iframe src={getYouTubeEmbedUrl(video.src)!} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  ) : (
                    <video src={video.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{video.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{video.desc}</p>
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleOpenVideoModal(video)} style={{ flex: 1 }}><Edit2 size={14} /> Tahrirlash</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteVideo(video.id)} style={{ flex: 1, color: 'var(--error)' }}><Trash2 size={14} /> O'chirish</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTFOLIO CRUD MODAL */}
      {isPortfolioModalOpen && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem' }}>{editingProject ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h2>
              <button onClick={() => setIsPortfolioModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label>Loyiha Nomi (Sarlavha)</label>
                <input type="text" className="input-field" value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Masalan: Chilonzor kotteji" />
              </div>
              <div className="input-group">
                <label>Loyiha manzili (Location)</label>
                <input type="text" className="input-field" value={pLocation} onChange={e => setPLocation(e.target.value)} placeholder="Masalan: Toshkent shahri" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div className="input-group">
                  <label>Uslubi (Style)</label>
                  <select className="input-field" value={pStyle} onChange={e => setPStyle(e.target.value as any)}>
                    <option value="classic">Klassik</option>
                    <option value="modern">Modern</option>
                    <option value="hitech">Hi-Tech</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Muddati (Kun)</label>
                  <input type="number" className="input-field" value={pCompletionDays} onChange={e => setPCompletionDays(+e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Maydoni (m²)</label>
                  <input type="number" className="input-field" value={pArea} onChange={e => setPArea(+e.target.value)} />
                </div>
              </div>

              <div className="input-group">
                <label>Tavsif (Description)</label>
                <textarea className="input-field" rows={3} value={pDescription} onChange={e => setPDescription(e.target.value)} placeholder="Loyiha haqida batafsil..." />
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label>Loyihaning asosiy rasmlari (Image URLs - har qatorda 1 ta)</label>
                  <label style={{ background: 'var(--accent-glow)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', cursor: 'pointer' }}>
                    📁 Rasm yuklash
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePortfolioFileUpload(e, setPImagesText, true)} />
                  </label>
                </div>
                <textarea className="input-field" rows={3} value={pImagesText} onChange={e => setPImagesText(e.target.value)} />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12, borderRadius: 8 }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: 10 }}>Oldin & Keyin Rasmlari (Slider)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="input-group">
                    <label>Oldin (Before image URL)</label>
                    <input type="text" className="input-field" value={pBeforeImage} onChange={e => setPBeforeImage(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Keyin (After image URL)</label>
                    <input type="text" className="input-field" value={pAfterImage} onChange={e => setPAfterImage(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={pFeatured} onChange={e => setPFeatured(e.target.checked)} />
                  Loyiha Top-10 ro'yxatda chiqsin
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleSavePortfolio} style={{ marginTop: 10 }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO CRUD MODAL */}
      {isVideoModalOpen && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.2rem' }}>{editingVideo ? 'Videoni tahrirlash' : 'Yangi video'}</h2>
              <button onClick={() => setIsVideoModalOpen(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label>Video sarlavhasi</label>
                <input type="text" className="input-field" value={vTitle} onChange={e => setVTitle(e.target.value)} placeholder="Masalan: Klinker g'isht o'rnatish" />
              </div>
              <div className="input-group">
                <label>Qisqacha tavsif (Description)</label>
                <input type="text" className="input-field" value={vDesc} onChange={e => setVDesc(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Video havolasi (URL - YouTube / MP4)</label>
                <input type="text" className="input-field" value={vSrc} onChange={e => setVSrc(e.target.value)} placeholder="YouTube video silkasi" />
              </div>
              <div className="input-group">
                <label>Davomiyligi (Duration)</label>
                <input type="text" className="input-field" value={vDuration} onChange={e => setVDuration(e.target.value)} placeholder="01:30 yoki Jarayon" />
              </div>

              <button className="btn btn-primary" onClick={handleSaveVideo} style={{ marginTop: 10 }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
