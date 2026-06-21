'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Download, Calculator as CalcIcon, Ruler, Save, User, Phone, MapPin } from 'lucide-react';
import { calculateEstimate } from '@/lib/calculator';
import { generateEstimatePDF } from '@/lib/pdf-generator';
import { generateId, getPricing } from '@/lib/store';
import type { CalculatorInput, CalculatorResult, Order } from '@/lib/types';
import { saveOrderClient } from '@/lib/orders-sync';
import toast from 'react-hot-toast';

export default function ZamerPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [inputs, setInputs] = useState<CalculatorInput[]>([{
    elementType: 'cornice',
    length: 1,
    width: 0.15,
    height: 0.15,
    quantity: 1,
  }]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const pricing = getPricing();
    if (pricing && pricing.elements) {
      setElements(pricing.elements);
      if (pricing.elements.length > 0) {
        setInputs([{
          elementType: pricing.elements[0].id,
          length: 1,
          width: 0.15,
          height: 0.15,
          quantity: 1,
        }]);
      }
    }
  }, []);

  // Image Upload States
  const [objectImages, setObjectImages] = useState<string[]>([]);
  const [calcImages, setCalcImages] = useState<string[]>([]);

  // Client-side image compression down to 800px max dimension
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'object' | 'calc') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const compressed = await compressImage(base64);
          if (type === 'object') {
            setObjectImages((prev) => [...prev, compressed]);
          } else {
            setCalcImages((prev) => [...prev, compressed]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateInput = (idx: number, field: keyof CalculatorInput, value: string | number) => {
    setInputs(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addItem = () => {
    const defaultType = elements[0]?.id || 'cornice';
    setInputs(prev => [...prev, {
      elementType: defaultType,
      length: 1,
      width: 0.15,
      height: 0.15,
      quantity: 1,
    }]);
  };
  const removeItem = (idx: number) => {
    if (inputs.length <= 1) return;
    setInputs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCalculate = () => {
    const res = calculateEstimate(inputs);
    setResult(res);
  };

  const handleSaveToKanban = async () => {
    if (!result || !clientName || !clientPhone) return;
    const order: Order = {
      id: generateId(),
      clientName,
      phone: clientPhone,
      address: clientAddress,
      status: 'measurement',
      items: result.items.map((item, idx) => {
        const correspondingInput = inputs[idx];
        return {
          id: generateId(),
          elementType: item.elementType,
          name: item.name,
          length: Number(correspondingInput?.length) || 1,
          width: Number(correspondingInput?.width) || 0.15,
          height: Number(correspondingInput?.height) || 0.15,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        };
      }),
      totalPrice: result.total,
      notes: '',
      objectImages,
      calcImages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveOrderClient(order);
      toast.success("Mijoz va hisob-kitob Kanban taxtasiga (Zamer bosqichi) saqlandi!");
    } catch (err) {
      console.error(err);
      toast.error("Saqlashda xatolik yuz berdi!");
    }

    // Send Telegram notification
    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});
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

          {/* Photos Upload Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: 16, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Obyekt va Hisob-kitob rasmlari
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Object Photos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Obyekt rasmlari ({objectImages.length})</label>
                <div style={{
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.01)'
                }} onClick={() => document.getElementById('object-upload')?.click()}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yuklash uchun bosing</span>
                  <input
                    id="object-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'object')}
                  />
                </div>
                {objectImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {objectImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 60, height: 60, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Obyekt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          style={{
                            position: 'absolute', top: 2, right: 2,
                            width: 16, height: 16, borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.9)', color: '#fff',
                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 10, lineHeight: 1
                          }}
                          onClick={() => setObjectImages(prev => prev.filter((_, i) => i !== idx))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calculation Photos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hisob-kitob / Chizma ({calcImages.length})</label>
                <div style={{
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.01)'
                }} onClick={() => document.getElementById('calc-upload')?.click()}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yuklash uchun bosing</span>
                  <input
                    id="calc-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'calc')}
                  />
                </div>
                {calcImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {calcImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 60, height: 60, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="Chizma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          style={{
                            position: 'absolute', top: 2, right: 2,
                            width: 16, height: 16, borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.9)', color: '#fff',
                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 10, lineHeight: 1
                          }}
                          onClick={() => setCalcImages(prev => prev.filter((_, i) => i !== idx))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Elements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inputs.map((input, idx) => {
              const elMeta = elements.find(e => e.id === input.elementType);
              const isVolumeBased = elMeta ? elMeta.calculationType === 'volume' : true;

              return (
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
                      onChange={e => updateInput(idx, 'elementType', e.target.value)}>
                      {elements.map((el) => (
                        <option key={el.id} value={el.id}>{el.nameUz} — {el.nameRu}</option>
                      ))}
                    </select>
                  </div>
                  {isVolumeBased && (
                    <div className="calc-row">
                      <div className="input-group">
                        <label>Uzunlik (m)</label>
                        <input type="number" className="input-field" step="0.01"
                          value={input.length} onChange={e => updateInput(idx, 'length', e.target.value === '' ? '' : +e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Kenglik (m)</label>
                        <input type="number" className="input-field" step="0.01"
                          value={input.width} onChange={e => updateInput(idx, 'width', e.target.value === '' ? '' : +e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Balandlik (m)</label>
                        <input type="number" className="input-field" step="0.01"
                          value={input.height} onChange={e => updateInput(idx, 'height', e.target.value === '' ? '' : +e.target.value)} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                    <div className="input-group">
                      <label>Miqdori / Soni {elMeta ? `(${elMeta.unit})` : ''}</label>
                      <input type="number" className="input-field"
                        value={input.quantity} onChange={e => updateInput(idx, 'quantity', e.target.value === '' ? '' : +e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label>Birlik narxi (so&apos;m, ixtiyoriy)</label>
                      <input type="number" className="input-field" placeholder="Standart narx"
                        value={input.customPrice ?? ''} onChange={e => updateInput(idx, 'customPrice', e.target.value === '' ? '' : +e.target.value)} />
                    </div>
                  </div>
                </div>
              );
            })}
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
                        {item.totalPrice.toLocaleString()}&nbsp;so&apos;m
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  <div className="calc-total-row grand" style={{ borderTop: 'none', paddingTop: 8, marginTop: 0 }}>
                    <span>UMUMIY:</span>
                    <span>{result.total.toLocaleString()}&nbsp;so&apos;m</span>
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
