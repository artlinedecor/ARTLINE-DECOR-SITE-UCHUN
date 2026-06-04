'use client';

import { useState } from 'react';
import { Plus, Trash2, Download, Calculator as CalcIcon, Ruler, Save, User, Phone, MapPin } from 'lucide-react';
import { FACADE_ELEMENTS, calculateEstimate } from '@/lib/calculator';
import { generateEstimatePDF } from '@/lib/pdf-generator';
import { saveOrder, generateId } from '@/lib/store';
import type { FacadeElementType, CalculatorInput, CalculatorResult, Order } from '@/lib/types';

const EMPTY_INPUT: CalculatorInput = {
  elementType: 'cornice',
  length: 1,
  width: 0.15,
  height: 0.15,
  quantity: 1,
};

export default function ZamerPage() {
  const [inputs, setInputs] = useState<CalculatorInput[]>([{ ...EMPTY_INPUT }]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const updateInput = (idx: number, field: keyof CalculatorInput, value: string | number) => {
    setInputs(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addItem = () => setInputs(prev => [...prev, { ...EMPTY_INPUT }]);
  const removeItem = (idx: number) => {
    if (inputs.length <= 1) return;
    setInputs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCalculate = () => {
    const res = calculateEstimate(inputs);
    setResult(res);
  };

  const handleSaveToKanban = () => {
    if (!result || !clientName || !clientPhone) return;
    const order: Order = {
      id: generateId(),
      clientName,
      phone: clientPhone,
      address: clientAddress,
      status: 'measurement',
      items: result.items.map(item => ({
        id: generateId(),
        elementType: item.elementType,
        name: item.name,
        length: inputs.find(i => i.elementType === item.elementType)?.length ?? 1,
        width: inputs.find(i => i.elementType === item.elementType)?.width ?? 0.15,
        height: inputs.find(i => i.elementType === item.elementType)?.height ?? 0.15,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      totalPrice: result.total,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveOrder(order);

    // Send Telegram notification
    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    await generateEstimatePDF(result, clientName ? {
      name: clientName, phone: clientPhone, address: clientAddress,
    } : undefined);
    setPdfLoading(false);
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
            <Ruler size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', lineHeight: 1 }}>Zamer & Smeta</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 3 }}>
              O&apos;lchamlarni kiritib avtomatik smeta hisoblang
            </p>
          </div>
        </div>

        {result && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {saved && (
              <span className="badge badge-success" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                ✓ Kanban&apos;ga qo&apos;shildi
              </span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleDownloadPDF} disabled={pdfLoading}>
              <Download size={15} />
              {pdfLoading ? 'Yuklanmoqda...' : 'PDF'}
            </button>
            {clientName && clientPhone && (
              <button className="btn btn-primary btn-sm" onClick={handleSaveToKanban}>
                <Save size={15} /> Kanban&apos;ga saqlash
              </button>
            )}
          </div>
        )}
      </div>

      {/* Gallery: portfolio photos for inspiration */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8, marginBottom: 32, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        {[
          { src: '/portfolio/classic-villa.png', label: 'Klassik Villa' },
          { src: '/portfolio/classic-mansion.png', label: 'Klassik Mansion' },
          { src: '/portfolio/modern-house.png', label: 'Modern' },
          { src: '/portfolio/hitech-facade.png', label: 'Hi-Tech' },
          { src: '/portfolio/before.png', label: 'Oldin' },
          { src: '/portfolio/after.png', label: 'Keyin' },
        ].map(img => (
          <div key={img.src} style={{
            position: 'relative', aspectRatio: '4/3',
            overflow: 'hidden', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
            onClick={() => window.open(img.src, '_blank')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '4px 8px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600,
            }}>
              {img.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28 }}>
        {/* LEFT — Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Client info */}
          <div className="glass-card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} /> Mijoz ma&apos;lumotlari
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="input-group">
                <label>Ism Familiya *</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input-field" placeholder="Mijoz ismi" value={clientName}
                    onChange={e => setClientName(e.target.value)} style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Telefon *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-field" placeholder="+998 90 123 45 67" value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)} style={{ paddingLeft: 36 }} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Manzil</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-field" placeholder="Shahar, ko'cha" value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)} style={{ paddingLeft: 36 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inputs.map((input, idx) => (
              <div key={idx} className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-gold">
                    <Ruler size={11} /> Element #{idx + 1}
                  </span>
                  {inputs.length > 1 && (
                    <button onClick={() => removeItem(idx)} className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', color: 'var(--error)' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="input-group" style={{ marginBottom: 12 }}>
                  <label>Element turi</label>
                  <select className="input-field" value={input.elementType}
                    onChange={e => updateInput(idx, 'elementType', e.target.value as FacadeElementType)}>
                    {Object.entries(FACADE_ELEMENTS).map(([key, el]) => (
                      <option key={key} value={key}>{el.nameUz} — {el.nameRu}</option>
                    ))}
                  </select>
                </div>
                <div className="calc-row">
                  <div className="input-group">
                    <label>Uzunlik (m)</label>
                    <input type="number" className="input-field" step="0.01" min="0.01"
                      value={input.length} onChange={e => updateInput(idx, 'length', +e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Kenglik (m)</label>
                    <input type="number" className="input-field" step="0.01" min="0.01"
                      value={input.width} onChange={e => updateInput(idx, 'width', +e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Balandlik (m)</label>
                    <input type="number" className="input-field" step="0.01" min="0.01"
                      value={input.height} onChange={e => updateInput(idx, 'height', +e.target.value)} />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: 12 }}>
                  <label>Soni (dona)</label>
                  <input type="number" className="input-field" min="1"
                    value={input.quantity} onChange={e => updateInput(idx, 'quantity', +e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost" onClick={addItem} style={{ flex: 1, justifyContent: 'center' }}>
              <Plus size={16} /> Element qo&apos;shish
            </button>
            <button className="btn btn-primary" onClick={handleCalculate} style={{ flex: 1, justifyContent: 'center' }}>
              <CalcIcon size={16} /> Hisoblash
            </button>
          </div>
        </div>

        {/* RIGHT — Result */}
        <div style={{ position: 'sticky', top: 32, alignSelf: 'flex-start' }}>
          <div className="calc-result">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 24, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalcIcon size={18} /> Smeta natijasi
            </h3>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <Ruler size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                <p style={{ fontSize: '0.9rem' }}>O&apos;lchamlarni kiriting va<br />&quot;Hisoblash&quot; tugmasini bosing</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {result.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-glass)', fontSize: '0.88rem',
                    }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>
                          {item.dimensions} × {item.quantity} dona
                        </div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 700 }}>
                        ${item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div className="calc-total-row">
                    <span>Jami:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>${result.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="calc-total-row">
                    <span>QQS (12%):</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>${result.vat.toLocaleString()}</span>
                  </div>
                  <div className="calc-total-row grand">
                    <span>UMUMIY:</span>
                    <span>${result.total.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                  >
                    <Download size={16} />
                    {pdfLoading ? 'Yuklanmoqda...' : 'PDF Smeta yuklab olish'}
                  </button>

                  {clientName && clientPhone ? (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handleSaveToKanban}
                    >
                      <Save size={16} /> Kanban&apos;ga saqlash (Zamer bosqichi)
                    </button>
                  ) : (
                    <div style={{
                      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-glass)', border: '1px solid var(--border)',
                      fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center',
                    }}>
                      Kanban&apos;ga saqlash uchun mijoz ismi va telefonini kiriting
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
