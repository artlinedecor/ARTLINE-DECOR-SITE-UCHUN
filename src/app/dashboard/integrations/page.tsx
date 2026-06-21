'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Send, HelpCircle } from 'lucide-react';

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

export default function IntegrationsPage() {
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mockLoading, setMockLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    // Generate current origin webhook URL
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhooks/instagram`);
    }

    // Load saved settings
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          setTelegramBotToken(data.config.telegramBotToken || '');
          setTelegramChatId(data.config.telegramChatId || '');
        }
      })
      .catch(err => console.error('Error loading config:', err));
  }, []);

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
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

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
        alert(`Muvaffaqiyatli yuborildi!\nLead: ${mockNames[idx]} Kanban taxtasiga ("Yangi" kolonnasi) qo'shildi.`);
      } else {
        alert('Simulyatsiya yuborishda xatolik yuz berdi.');
      }
    } catch {
      alert('Webhook aloqasida xatolik.');
    } finally {
      setMockLoading(false);
    }
  };

  return (
    <>
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
            <h1 style={{ fontSize: '1.6rem', lineHeight: 1 }}>Tizim Integratsiyalari</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
              Telegram bot bildirishnomalari va Instagram Lead Ads webhook sozlamalari
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28, marginTop: 8 }}>
        
        {/* LEFT — Configuration Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Telegram Config */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 6, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Send size={18} /> Telegram Bot Integratsiyasi
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Yangi lead yoki buyurtma olinganda ma&apos;lumotlarni darhol Telegram guruhingizga yuborish
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Telegram Bot Token</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Masalan: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
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
                  placeholder="Masalan: -100123456789 yoki 987654321"
                  value={telegramChatId}
                  onChange={e => setTelegramChatId(e.target.value)}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Bot xabarlarni yuborishi kerak bo&apos;lgan guruh yoki admin chat ID raqami
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveTelegram}
                  disabled={saving}
                  style={{ minWidth: 160, justifyContent: 'center' }}
                >
                  <Save size={16} />
                  {saving ? 'Saqlanmoqda...' : 'Sozlamalarni saqlash'}
                </button>

                {saveStatus === 'success' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontSize: '0.82rem' }}>
                    <CheckCircle size={16} />
                    Muvaffaqiyatli saqlandi!
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--error)', fontSize: '0.82rem' }}>
                    <AlertCircle size={16} />
                    Saqlashda xatolik yuz berdi.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instagram Webhook Config */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 6, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <InstagramIcon size={18} /> Instagram Leads & Webhook ulanishi
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              Instagram / Facebook reklamalaridan kelayotgan mijozlarni (Lead form) avtomatik CRM-ga kiritish
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
                    className="btn btn-ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('Webhook URL nusxalandi!');
                    }}
                  >
                    Nusxalash
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Ushbu havolani Facebook Webhook sozlamalariga joylashtiring.
                </span>
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
                <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Integratsiyani simulyatsiya qilish:</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Ushbu tugmani bosish orqali Instagram reklamasidan kelgan yangi mijoz leadini simulyatsiya qilasiz. Bu webhookning to&apos;g&apos;ri ishlashini va Telegram bildirishnomasini tekshirish imkonini beradi.
                </p>
                <button
                  className="btn btn-ghost"
                  onClick={handleSendMockLead}
                  disabled={mockLoading}
                  style={{ border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}
                >
                  <Send size={15} style={{ marginRight: 6 }} />
                  {mockLoading ? 'Yuborilmoqda...' : 'Mock Lead yuborish (Instagram Ads)'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT — Documentation & Guidance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24, position: 'sticky', top: 32 }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={16} /> Qo&apos;llanma
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.82rem', lineHeight: 1.5 }}>
              <div>
                <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>1. Telegram boti yaratish:</h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Telegram-da <a href="https://t.me/BotFather" target="_blank" style={{ color: 'var(--accent-gold)' }}>@BotFather</a> kanaliga kiring, <code>/newbot</code> buyrug&apos;ini yuboring va ko&apos;rsatmalarni bajaring. Yaratilgan bot tokenini chapdagi maydonga kiring.
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>2. Guruh Chat ID aniqlash:</h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Botni Telegram guruhingizga qo&apos;shing va unga adminlik bering. Keyin guruhga biror xabar yozing. Guruh chat ID sini olish uchun <a href="https://t.me/userinfobot" target="_blank" style={{ color: 'var(--accent-gold)' }}>@userinfobot</a> yoki maxsus botlardan foydalaning (guruh ID lari odatda <code>-100</code> bilan boshlanadi).
                </p>
              </div>

              <div>
                <h4 style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>3. Instagram Ads ulanishi:</h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Meta Developers portali (developers.facebook.com) orqali Webhook sozlamasiga kiring. &quot;Instagram Lead Ads&quot; yoki &quot;Leadgen&quot; obunalarini faollashtiring, chapdagi Callback URL va Verify Token kalitlarini kiriting va saqlang.
                </p>
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
                marginTop: 8
              }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-gold)', display: 'block', marginBottom: 4 }}>Maslahat:</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Agar loyiha localhostda bo&apos;lsa, webhookni tashqaridan chaqirish uchun <b>ngrok</b> yoki <b>localtunnel</b> yordamida tashqi havola (https) hosil qilishingiz zarur.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
