'use client';

import { useState, useEffect } from 'react';
import { X, Send, Check, User, MapPin, Ruler, Building2, ShieldCheck, Phone } from 'lucide-react';
import { generateId } from '@/lib/store';
import { Order } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';
import { useT } from '@/lib/i18n';

const REGIONS = [
  'Toshkent sh.',
  'Toshkent vil.',
  'Samarqand',
  'Buxoro',
  'Andijon',
  'Farg\'ona',
  'Namangan',
  'Qashqadaryo',
  'Surxondaryo',
  'Xorazm',
  'Jizzax',
  'Sirdaryo',
  'Navoiy',
  'Qoraqalpog\'iston res.'
];

export default function EstimateModal() {
  const { t } = useT();
  const BUILDING_TYPES = [
    { value: 'residential', label: t('modal.bt.residential') },
    { value: 'commercial', label: t('modal.bt.commercial') },
    { value: 'multistory', label: t('modal.bt.multistory') },
  ];
  const USER_ROLES = [
    { value: 'owner', label: t('modal.role.owner') },
    { value: 'master', label: t('modal.role.master') },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [city, setCity] = useState(REGIONS[0]);
  const [area, setArea] = useState('');
  const [buildingType, setBuildingType] = useState(BUILDING_TYPES[0].value);
  const [userRole, setUserRole] = useState(USER_ROLES[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Global ochiq funksiya orqali modalni ochish
    (window as any).openEstimateModal = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setName('');
      setPhone('+998 ');
      setCity(REGIONS[0]);
      setArea('');
      setBuildingType(BUILDING_TYPES[0].value);
      setUserRole(USER_ROLES[0].value);
    };

    // Hash orqali ham ochilishi uchun (#calculator bosilganda)
    const handleHashChange = () => {
      if (window.location.hash === '#calculator' || window.location.hash === '#estimate') {
        (window as any).openEstimateModal();
        // Hashni tozalaymiz
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Yuklanganda tekshirish
    if (window.location.hash === '#calculator' || window.location.hash === '#estimate') {
      handleHashChange();
    }

    return () => {
      delete (window as any).openEstimateModal;
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998 ')) {
      val = '+998 ';
    }
    // Faqat raqamlar va bo'shliqlarni qoldiramiz
    const suffix = val.slice(5).replace(/[^\d]/g, '');
    setName(prev => prev); // dummy to trigger re-renders
    
    // Telefon formati: +998 (90) 123-45-67
    let formatted = '+998 ';
    if (suffix.length > 0) {
      formatted += suffix.slice(0, 2);
    }
    if (suffix.length > 2) {
      formatted += ' ' + suffix.slice(2, 5);
    }
    if (suffix.length > 5) {
      formatted += '-' + suffix.slice(5, 7);
    }
    if (suffix.length > 7) {
      formatted += '-' + suffix.slice(7, 9);
    }
    
    setPhone(formatted.slice(0, 19));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('modal.err.name'));
      return;
    }
    if (phone.length < 17) {
      toast.error(t('modal.err.phone'));
      return;
    }
    if (!area.trim() || isNaN(Number(area)) || Number(area) <= 0) {
      toast.error(t('modal.err.area'));
      return;
    }

    setIsSubmitting(true);

    try {
      const binoLabel = BUILDING_TYPES.find(b => b.value === buildingType)?.label || buildingType;
      const rolLabel = USER_ROLES.find(r => r.value === userRole)?.label || userRole;

      // 1. Telegram botga yuborish
      const telegramPayload = {
        type: 'estimate_modal',
        clientName: name.trim(),
        phone: phone.trim(),
        city: city,
        area: area.trim(),
        buildingType: binoLabel,
        userRole: rolLabel
      };

      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramPayload)
      });

      // 2. CRM Orders API ga saqlash
      const newOrder: Order = {
        id: generateId(),
        clientName: name.trim(),
        phone: phone.trim(),
        address: `${city} (Fasad: ${area.trim()} m², ${binoLabel})`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'new',
        items: [],
        totalPrice: 0,
        notes: `So'rov turi: Qayta aloqa (callback). Rol: ${rolLabel}. Maydon: ${area.trim()} m².`
      };
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      setIsSuccess(true);
      toast.success(t('modal.toast.ok'));
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(t('modal.toast.err'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const labelStyle: React.CSSProperties = {
    color: '#cbd5e0', fontSize: '0.78rem', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
  };
  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(217,154,108,0.18)',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '0.98rem',
    color: '#fff',
    width: '100%',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      padding: '20px', overflowY: 'auto'
    }} onClick={() => setIsOpen(false)}>
      <Toaster position="top-right" />
      <div style={{
        width: '100%', maxWidth: '600px', padding: 0,
        background: 'linear-gradient(180deg, #0d1119 0%, #06080e 100%)',
        border: '1px solid rgba(217,154,108,0.22)',
        borderRadius: '28px', overflow: 'hidden',
        boxShadow: '0 32px 120px rgba(0,0,0,0.7), 0 0 80px rgba(217,154,108,0.08)',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>

        {/* Gold accent gradient at top */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--accent-gold), var(--accent-warm), var(--accent-gold), transparent)',
        }} />
        {/* Decorative gold glow */}
        <div aria-hidden style={{
          position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px',
          background: 'radial-gradient(closest-side, rgba(217,154,108,0.18), transparent)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '16px', position: 'relative',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 12px', borderRadius: '100px',
              background: 'rgba(217,154,108,0.12)', border: '1px solid rgba(217,154,108,0.3)',
              color: 'var(--accent-warm)', fontSize: '0.72rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px',
            }}>
              <Phone size={11} /> {t('modal.badge')}
            </div>
            <h3 style={{
              fontSize: '1.55rem', fontWeight: 700, margin: 0,
              fontFamily: 'var(--font-heading)', color: '#fff',
              lineHeight: 1.2,
            }}>
              {t('modal.title')}
            </h3>
            <p style={{ color: '#a0aec0', fontSize: '0.88rem', margin: '8px 0 0', lineHeight: 1.55, maxWidth: '420px' }}>
              {t('modal.subtitle.1')} <strong style={{ color: '#fff' }}>{t('modal.subtitle.bold')}</strong> {t('modal.subtitle.2')}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} aria-label="Yopish" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#a0aec0', cursor: 'pointer', padding: '8px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div style={{
            padding: '48px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '64px', height: '64px', background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid #4CAF50', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'
            }}>
              <Check size={32} color="#4CAF50" />
            </div>
            <h4 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
              {t('modal.success.title')}
            </h4>
            <p style={{ color: '#a0aec0', fontSize: '0.95rem', maxWidth: '360px', margin: 0, lineHeight: 1.6 }}>
              {t('modal.success.text')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px 32px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Ism */}
            <div>
              <label style={labelStyle}><User size={13} style={{ color: 'var(--accent-gold)' }} /> {t('modal.label.name')}</label>
              <input type="text" placeholder={t('modal.ph.name')} value={name} onChange={e => setName(e.target.value)} style={fieldStyle} />
            </div>

            {/* Telefon */}
            <div>
              <label style={labelStyle}><Phone size={13} style={{ color: 'var(--accent-gold)' }} /> {t('modal.label.phone')}</label>
              <input type="text" value={phone} onChange={handlePhoneChange} placeholder="+998 (90) 123-45-67"
                style={{ ...fieldStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }} />
            </div>

            {/* Shahar */}
            <div>
              <label style={labelStyle}><MapPin size={13} style={{ color: 'var(--accent-gold)' }} /> {t('modal.label.city')}</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                style={{ ...fieldStyle, background: '#0a0d16', cursor: 'pointer' }}>
                {REGIONS.map(reg => (<option key={reg} value={reg}>{reg}</option>))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}><Ruler size={13} style={{ color: 'var(--accent-gold)' }} /> {t('modal.label.area')}</label>
                <input type="number" placeholder={t('modal.ph.area')} value={area} onChange={e => setArea(e.target.value)} style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}><Building2 size={13} style={{ color: 'var(--accent-gold)' }} /> {t('modal.label.type')}</label>
                <select value={buildingType} onChange={e => setBuildingType(e.target.value)}
                  style={{ ...fieldStyle, background: '#0a0d16', cursor: 'pointer' }}>
                  {BUILDING_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                </select>
              </div>
            </div>

            {/* Role pills */}
            <div>
              <label style={labelStyle}>{t('modal.label.role')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {USER_ROLES.map(role => {
                  const isActive = userRole === role.value;
                  return (
                    <button key={role.value} type="button" onClick={() => setUserRole(role.value)}
                      style={{
                        padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                        background: isActive ? 'linear-gradient(135deg, rgba(217,154,108,0.18), rgba(242,181,140,0.08))' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}`,
                        color: isActive ? '#fff' : '#a0aec0',
                        fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                      }}>
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust line */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(62,207,142,0.06)', border: '1px solid rgba(62,207,142,0.15)',
              color: '#a0aec0', fontSize: '0.8rem',
            }}>
              <ShieldCheck size={14} style={{ color: '#3ecf8e', flexShrink: 0 }} />
              <span>{t('modal.privacy')}</span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{
              marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '16px', borderRadius: '14px', width: '100%',
              fontWeight: 700, fontSize: '1.02rem',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-warm) 100%)',
              color: '#0a0a0a', border: 'none', cursor: isSubmitting ? 'wait' : 'pointer',
              boxShadow: '0 12px 32px rgba(217,154,108,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(217,154,108,0.45), 0 0 0 1px rgba(255,255,255,0.05) inset'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 12px 32px rgba(217,154,108,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset'; }}
            >
              {isSubmitting ? t('modal.submitting') : (<><Send size={18} /> {t('modal.submit')}</>)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
