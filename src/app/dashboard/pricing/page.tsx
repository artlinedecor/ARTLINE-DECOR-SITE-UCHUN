'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, HelpCircle, DollarSign, ArrowRight, Layers, Eye } from 'lucide-react';
import { getPricing, savePricing, DEFAULT_PRICING } from '@/lib/store';
import type { PricingConfig, FacadeElement } from '@/lib/types';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newId, setNewId] = useState('');
  const [newNameUz, setNewNameUz] = useState('');
  const [newNameRu, setNewNameRu] = useState('');
  const [newUnit, setNewUnit] = useState('P/M');
  const [newCalcType, setNewCalcType] = useState<'volume' | 'unit'>('volume');
  
  // Dimensions and costing for volume based
  const [newWidth, setNewWidth] = useState<number>(0.30);
  const [newHeight, setNewHeight] = useState<number>(0.12);
  const [newLength, setNewLength] = useState<number>(2.0);
  const [newProdCost, setNewProdCost] = useState<number>(250); // USD/m3
  
  // Base price for unit based
  const [newPrice, setNewPrice] = useState<number>(10.0);

  useEffect(() => {
    setConfig(getPricing());
  }, []);

  if (!config) return null;

  // Auto calculations for the form
  const computedVolume = Math.round((newWidth * newHeight * newLength) * 10000) / 10000;
  const computedPrice = newCalcType === 'volume' 
    ? Math.round((computedVolume * newProdCost) * 100) / 100
    : newPrice;
  const computedPricePerMeter = newUnit === 'P/M' && newLength > 0
    ? Math.round((computedPrice / newLength) * 100) / 100
    : computedPrice;

  const handleSave = () => {
    savePricing(config);
    setSaved(true);
    toast.success("Narxlar va valyuta kursi muvaffaqiyatli saqlandi!");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Barcha narxlar va mahsulotlarni standart zavod sozlamalariga qaytarishni xohlaysizmi?")) {
      setConfig({ ...DEFAULT_PRICING });
      toast.success("Zavod sozlamalariga qaytarildi.");
    }
  };

  const handleAddElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameUz || !newNameRu) {
      toast.error("Iltimos, o'zbekcha va ruscha nomlarni kiriting!");
      return;
    }

    const generatedId = newId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || 
                        newNameUz.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') + '_' + Date.now().toString().slice(-4);

    if (config.elements.some(el => el.id === generatedId)) {
      toast.error("Bunday identifikatorli mahsulot allaqachon mavjud. Boshqa nom kiriting.");
      return;
    }

    const volume = newCalcType === 'volume' ? computedVolume : undefined;
    const finalPrice = newCalcType === 'volume' ? computedPrice : newPrice;

    const newElement: FacadeElement = {
      id: generatedId,
      nameUz: newNameUz,
      nameRu: newNameRu,
      description: 'Ishlab chiqarish mahsuloti',
      rules: 'Standart texnik o\'rnatish qoidalari.',
      pricePerUnit: finalPrice,
      unit: newUnit,
      calculationType: newCalcType,
      width: newCalcType === 'volume' ? newWidth : undefined,
      height: newCalcType === 'volume' ? newHeight : undefined,
      defaultLength: newCalcType === 'volume' ? newLength : undefined,
      productionCostPerCubicMeter: newCalcType === 'volume' ? newProdCost : undefined,
      volume: volume
    };

    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        elements: [...prev.elements, newElement]
      };
    });

    toast.success("Yangi mahsulot muvaffaqiyatli qo'shildi!");

    // Reset form
    setNewId('');
    setNewNameUz('');
    setNewNameRu('');
    setNewUnit('P/M');
    setNewCalcType('volume');
    setNewWidth(0.30);
    setNewHeight(0.12);
    setNewLength(2.0);
    setNewProdCost(250);
    setNewPrice(10.0);
    setShowAddForm(false);
  };

  const handleDeleteElement = (id: string) => {
    if (window.confirm("Ushbu mahsulotni o'chirishni xohlaysizmi?")) {
      setConfig(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          elements: prev.elements.filter(el => el.id !== id)
        };
      });
      toast.success("Mahsulot o'chirildi.");
    }
  };

  const handleUpdateElement = (id: string, field: keyof FacadeElement, value: any) => {
    setConfig(prev => {
      if (!prev) return prev;
      const updatedElements = prev.elements.map(el => {
        if (el.id !== id) return el;
        
        const nextEl = { ...el, [field]: value };
        
        // If dimensions or production cost change, recalculate volume and price per unit
        if (nextEl.calculationType === 'volume') {
          const w = Number(nextEl.width) || 0;
          const h = Number(nextEl.height) || 0;
          const l = Number(nextEl.defaultLength) || 0;
          const cost = Number(nextEl.productionCostPerCubicMeter) || 0;
          
          nextEl.volume = Math.round((w * h * l) * 10000) / 10000;
          nextEl.pricePerUnit = Math.round((nextEl.volume * cost) * 100) / 100;
        }
        
        return nextEl;
      });

      return {
        ...prev,
        elements: updatedElements
      };
    });
  };

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>Mahsulotlar va Narx Boshqaruvi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            Har bir mahsulotning individual o&apos;lchamlari va tannarxini sozlash oynasi.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {saved && <span className="badge badge-success">✓ Muvaffaqiyatli saqlandi</span>}
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> O&apos;zgarishlarni Saqlash
          </button>
        </div>
      </div>

      {/* Global Settings (Rate & Raw Material Cost) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <DollarSign size={16} /> Global Tizim Sozlamalari
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1 USD Kursi (so'm)</label>
              <input
                type="number"
                className="input-field"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}
                value={config.usdToUzsRate}
                onChange={e => setConfig(p => p ? { ...p, usdToUzsRate: e.target.value === '' ? 0 : +e.target.value } : p)}
              />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Xomashyo kubi narxi (USD)</label>
              <input
                type="number"
                className="input-field"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}
                value={config.pricePerCubicMeter}
                onChange={e => setConfig(p => p ? { ...p, pricePerCubicMeter: e.target.value === '' ? 0 : +e.target.value } : p)}
              />
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>
            Ushbu kurs va xomashyo narxi o&apos;zgarganda, barcha mahsulotlarning milliy valyutadagi (UZS) narxlari avtomatik ravishda qayta hisoblanadi.
          </p>
        </div>

        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: 8, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>Tizim haqida ma&apos;lumot</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Fasad bezaklarining narxi mahsulot hajmiga (m³) qarab hisoblanadi. Yangi mahsulot qo&apos;shayotganda kenglik, balandlik, standart uzunlik va 1 m³ xomashyo tannarxini kiriting. Tizim oqim metr narxi va dona narxini avtomatik hisoblab chiqadi.
          </p>
        </div>
      </div>

      {/* Elements List */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Mahsulotlar va Xizmatlar Ro&apos;yxati</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Smeta kalkulyatorlarida va ishlab chiqarishda ishlatiladigan mahsulotlarning asosiy narxlari.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={14} /> Yangi Mahsulot Qo&apos;shish
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleResetToDefault} style={{ color: 'var(--text-muted)' }}>
              <RefreshCw size={14} /> Standart Qiymatlar
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <form onSubmit={handleAddElement} className="glass-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-gold)', padding: 20, marginBottom: 24 }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginBottom: 16 }}>Yangi Mahsulot Qo&apos;shish Formasi</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="input-group">
                <label>Mahsulot Nomi (UZ) *</label>
                <input className="input-field" placeholder="Masalan: Karniz K-15" value={newNameUz} onChange={e => setNewNameUz(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Mahsulot Nomi (RU) *</label>
                <input className="input-field" placeholder="Masalan: Карниз К-15" value={newNameRu} onChange={e => setNewNameRu(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Kod / ID (ixtiyoriy)</label>
                <input className="input-field" placeholder="Masalan: cornice_k15" value={newId} onChange={e => setNewId(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="input-group">
                <label>Hisob-kitob turi</label>
                <select className="input-field" value={newCalcType} onChange={e => setNewCalcType(e.target.value as any)}>
                  <option value="volume">Hajmli (Kenglik × Balandlik × Uzunlik bo&apos;yicha)</option>
                  <option value="unit">O&apos;lchovli (Fiksirlangan narx)</option>
                </select>
              </div>
              <div className="input-group">
                <label>O&apos;lchov Birligi</label>
                <select className="input-field" value={newUnit} onChange={e => setNewUnit(e.target.value)}>
                  <option value="P/M">P/M (Metr oqimi)</option>
                  <option value="DONA">DONA (Soni)</option>
                  <option value="M²">M² (Kvadrat metr)</option>
                </select>
              </div>
            </div>

            {/* If Volume-based */}
            {newCalcType === 'volume' ? (
              <div style={{ padding: '16px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', marginBottom: 20, border: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: 12 }}>Hajm va Ishlab chiqarish parametrlari</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div className="input-group">
                    <label>Kenglik (W - metr)</label>
                    <input type="number" step="0.01" className="input-field" value={newWidth} onChange={e => setNewWidth(Math.max(0, +e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Balandlik (H - metr)</label>
                    <input type="number" step="0.01" className="input-field" value={newHeight} onChange={e => setNewHeight(Math.max(0, +e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Uzunlik (L - metr)</label>
                    <input type="number" step="0.01" className="input-field" value={newLength} onChange={e => setNewLength(Math.max(0, +e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>m³ Tannarxi (USD $)</label>
                    <input type="number" className="input-field" value={newProdCost} onChange={e => setNewProdCost(Math.max(0, +e.target.value))} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 4 }}>
                  <div>Hisoblangan Hajm: <strong style={{ color: '#fff' }}>{computedVolume} m³</strong></div>
                  <div>Donalik Narx: <strong style={{ color: 'var(--accent-gold)' }}>${computedPrice}</strong></div>
                  {newUnit === 'P/M' && (
                    <div>1 Metr Narxi: <strong style={{ color: 'var(--accent-gold)' }}>${computedPricePerMeter} / p.m.</strong></div>
                  )}
                  <div>So&apos;mda (taxminan): <strong style={{ color: 'var(--accent-gold)' }}>{(computedPrice * config.usdToUzsRate).toLocaleString()} so&apos;m</strong></div>
                </div>
              </div>
            ) : (
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label>Fiksirlangan Narxi (USD $)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" step="0.01" className="input-field" style={{ width: 150 }} value={newPrice} onChange={e => setNewPrice(Math.max(0, +e.target.value))} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ≈ {(newPrice * config.usdToUzsRate).toLocaleString()} so&apos;m
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Bekor Qilish</button>
              <button type="submit" className="btn btn-primary btn-sm">Ro&apos;yxatga Qo&apos;shish</button>
            </div>
          </form>
        )}

        {/* Pricing List Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Mahsulot Nomi (UZ)</th>
                <th>Turi</th>
                <th>O&apos;lchamlar (W×H×L)</th>
                <th>Hajm (m³)</th>
                <th>m³ Narx (USD)</th>
                <th>Birligi</th>
                <th>USD Narx ($)</th>
                <th>Metr Narx ($/m)</th>
                <th>UZS Narxi (So&apos;m)</th>
                <th style={{ width: 50, textAlign: 'center' }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {config.elements.map((el) => {
                const isVol = el.calculationType === 'volume';
                const finalPricePerUnit = el.pricePerUnit;
                const finalPricePerMeter = el.unit === 'P/M' && el.defaultLength 
                  ? Math.round((finalPricePerUnit / el.defaultLength) * 100) / 100
                  : finalPricePerUnit;
                
                const uzsPrice = Math.round(finalPricePerUnit * config.usdToUzsRate);
                
                return (
                  <tr key={el.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <input
                          type="text"
                          className="input-field"
                          style={{ padding: '4px 8px', fontSize: '0.82rem', width: '100%', minWidth: 140 }}
                          value={el.nameUz}
                          onChange={e => handleUpdateElement(el.id, 'nameUz', e.target.value)}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: 8 }}>{el.nameRu}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isVol ? 'badge-gold' : 'badge-primary'}`} style={{ fontSize: '0.75rem' }}>
                        {isVol ? 'Hajmli' : 'Dona'}
                      </span>
                    </td>
                    <td>
                      {isVol ? (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            style={{ width: 50, padding: 4, textAlign: 'center', fontSize: '0.8rem' }}
                            value={el.width || 0}
                            onChange={e => handleUpdateElement(el.id, 'width', +e.target.value)}
                            title="Kenglik"
                          />
                          <span style={{ color: 'var(--text-muted)' }}>×</span>
                          <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            style={{ width: 50, padding: 4, textAlign: 'center', fontSize: '0.8rem' }}
                            value={el.height || 0}
                            onChange={e => handleUpdateElement(el.id, 'height', +e.target.value)}
                            title="Balandlik"
                          />
                          <span style={{ color: 'var(--text-muted)' }}>×</span>
                          <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            style={{ width: 50, padding: 4, textAlign: 'center', fontSize: '0.8rem' }}
                            value={el.defaultLength || 0}
                            onChange={e => handleUpdateElement(el.id, 'defaultLength', +e.target.value)}
                            title="Uzunlik"
                          />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {isVol ? `${el.volume || 0} m³` : '—'}
                    </td>
                    <td>
                      {isVol ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>$</span>
                          <input
                            type="number"
                            className="input-field"
                            style={{ width: 60, padding: 4, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                            value={el.productionCostPerCubicMeter || 0}
                            onChange={e => handleUpdateElement(el.id, 'productionCostPerCubicMeter', +e.target.value)}
                          />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: 4, fontSize: '0.8rem', cursor: 'pointer', width: 75 }}
                        value={el.unit}
                        onChange={e => handleUpdateElement(el.id, 'unit', e.target.value)}
                      >
                        <option value="P/M">P/M</option>
                        <option value="DONA">DONA</option>
                        <option value="M²">M²</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>$</span>
                        <input
                          type="number"
                          step="0.01"
                          disabled={isVol}
                          className="input-field"
                          style={{ width: 70, padding: 4, fontSize: '0.8rem', fontFamily: 'var(--font-mono)', opacity: isVol ? 0.6 : 1 }}
                          value={el.pricePerUnit}
                          onChange={e => handleUpdateElement(el.id, 'pricePerUnit', +e.target.value)}
                        />
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      ${finalPricePerMeter}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      {uzsPrice.toLocaleString()} so&apos;m
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="btn btn-ghost"
                        style={{ padding: '4px', color: 'var(--error)' }}
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 16 }}>
        <HelpCircle size={15} style={{ color: 'var(--accent-gold)' }} />
        <span>Tushuntirish: O&apos;lchamlar yoki m³ tannarxi tahrirlanganda, mahsulotning individual USD narxi avtomatik tarzda qayta hisoblanadi. Milliy valyutadagi narxlar esa global valyuta kursi bo&apos;yicha real vaqtda ko&apos;rsatiladi.</span>
      </div>
    </>
  );
}
