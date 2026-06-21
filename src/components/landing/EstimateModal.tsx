'use client';

import { useState, useEffect } from 'react';
import { X, Send, Check } from 'lucide-react';
import { generateId } from '@/lib/store';
import { Order } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

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

const BUILDING_TYPES = [
  { value: 'residential', label: 'Xususiy uy / Hovli' },
  { value: 'commercial', label: 'Tijorat binosi (Do\'kon, Ofis, H.k.)' },
  { value: 'multistory', label: 'Ko\'p qavatli bino' }
];

const USER_ROLES = [
  { value: 'owner', label: 'Uy egasi' },
  { value: 'master', label: 'Usta / Quruvchi' }
];

export default function EstimateModal() {
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
      toast.error('Iltimos, ismingizni kiriting!');
      return;
    }
    if (phone.length < 17) {
      toast.error('Iltimos, telefon raqamingizni to\'liq kiriting!');
      return;
    }
    if (!area.trim() || isNaN(Number(area)) || Number(area) <= 0) {
      toast.error('Iltimos, taxminiy fasad maydonini kiriting (m²)!');
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
        notes: `So'rov turi: Bepul hisob-kitob modal. Rol: ${rolLabel}. Maydon: ${area.trim()} m².`
      };
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      setIsSuccess(true);
      toast.success('So\'rovingiz muvaffaqiyatli yuborildi!');
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      padding: '16px', overflowY: 'auto'
    }} onClick={() => setIsOpen(false)}>
      <Toaster position="top-right" />
      <div className="glass-card" style={{
        width: '100%', maxWidth: '520px', padding: 0,
        background: '#0a0d16', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '1.25rem', fontWeight: 700, margin: 0,
            fontFamily: 'var(--font-heading)', color: '#fff',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ color: 'var(--accent-gold)' }}>🏛</span> Bepul Hisob-Kitob Olish
          </h3>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'rgba(255,255,255,0.05)', border: 'none',
            color: '#a0aec0', cursor: 'pointer', padding: '6px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
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
              Rahmat! Ariza Qabul Qilindi
            </h4>
            <p style={{ color: '#a0aec0', fontSize: '0.95rem', maxWidth: '360px', margin: 0, lineHeight: 1.6 }}>
              Mutaxassisimiz tez orada siz bilan bog'lanib, bepul smeta hisob-kitobini taqdim etadi va savollaringizga javob beradi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ color: '#a0aec0', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              Quyidagi ma'lumotlarni to'ldiring. Mutaxassislarimiz siz uchun maxsus 3 xil variantdagi smetani bepul tayyorlab berishadi.
            </p>

            {/* Ism */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ismingiz *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Masalan: Dilmurod"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Telefon */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Telefon Raqamingiz *</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 (90) 123-45-67"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Shahar / Viloyat */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shahar / Viloyat</label>
              <select
                className="form-control"
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{ background: '#0a0d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              >
                {REGIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Maydon */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maydon (m²) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Masalan: 250"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Bino turi */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bino turi</label>
                <select
                  className="form-control"
                  value={buildingType}
                  onChange={e => setBuildingType(e.target.value)}
                  style={{ background: '#0a0d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
                >
                  {BUILDING_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* User Role */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Siz kimsiz?</label>
              <select
                className="form-control"
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                style={{ background: '#0a0d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              >
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                marginTop: '12px', justifyContent: 'center', gap: '8px',
                padding: '14px', borderRadius: '12px', width: '100%',
                fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(201, 168, 76, 0.25)'
              }}
            >
              {isSubmitting ? (
                <>Yuborilmoqda...</>
              ) : (
                <>
                  <Send size={18} /> Smeta So'rash
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
