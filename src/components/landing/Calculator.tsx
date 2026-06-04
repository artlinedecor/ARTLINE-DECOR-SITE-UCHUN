'use client';

import { useState } from 'react';
import { Plus, Trash2, Download, Calculator as CalcIcon } from 'lucide-react';
import { FACADE_ELEMENTS, calculateEstimate } from '@/lib/calculator';
import { generateEstimatePDF } from '@/lib/pdf-generator';
import type { FacadeElementType, CalculatorInput, CalculatorResult } from '@/lib/types';

const EMPTY_INPUT: CalculatorInput = {
  elementType: 'cornice',
  length: 1,
  width: 0.15,
  height: 0.15,
  quantity: 1,
};

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInput[]>([{ ...EMPTY_INPUT }]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');

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

  const handleDownloadPDF = async () => {
    if (!result) return;
    await generateEstimatePDF(result, clientName ? {
      name: clientName, phone: clientPhone, address: clientAddress,
    } : undefined);
  };

  return (
    <section className="section" id="calculator" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="section-title" style={{ display: 'inline-block' }}>Smeta Kalkulyatori</h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            O&apos;lchamlarni kiriting — tizim avtomatik material sarfini hisoblab, PDF smeta shakllantiradi.
          </p>
        </div>

        <div className="calc-wrapper">
          {/* Form */}
          <div className="calc-form">
            {/* Client info */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--accent-gold)' }}>
                Mijoz ma&apos;lumotlari (ixtiyoriy)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="input-group">
                  <label>Ism</label>
                  <input className="input-field" placeholder="Mijoz ismi" value={clientName}
                    onChange={e => setClientName(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label>Telefon</label>
                    <input className="input-field" placeholder="+998..." value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Manzil</label>
                    <input className="input-field" placeholder="Shahar, ko'cha" value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="calc-items">
              {inputs.map((input, idx) => (
                <div key={idx} className="glass-card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-gold">Element #{idx + 1}</span>
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
                        <option key={key} value={key}>{el.nameUz} ({el.nameRu})</option>
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
                    <label>Soni</label>
                    <input type="number" className="input-field" min="1"
                      value={input.quantity} onChange={e => updateInput(idx, 'quantity', +e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={addItem}>
                <Plus size={16} /> Element qo&apos;shish
              </button>
              <button className="btn btn-primary" onClick={handleCalculate}>
                <CalcIcon size={16} /> Hisoblash
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="calc-result">
            <h3 style={{ fontSize: '1.2rem', marginBottom: 24, color: 'var(--accent-gold)' }}>
              Smeta natijasi
            </h3>

            {!result ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <CalcIcon size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p>O&apos;lchamlarni kiriting va &quot;Hisoblash&quot; tugmasini bosing</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {result.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-glass)', fontSize: '0.9rem',
                    }}>
                      <div>
                        <strong>{item.name}</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '0.8rem' }}>
                          {item.dimensions} × {item.quantity} шт
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
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

                <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, justifyContent: 'center' }}
                  onClick={handleDownloadPDF}>
                  <Download size={16} /> PDF Smeta yuklab olish
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
