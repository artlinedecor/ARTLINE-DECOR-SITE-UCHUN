'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, Trash2, HelpCircle } from 'lucide-react';
import { getPricing, savePricing, DEFAULT_PRICING } from '@/lib/store';
import type { PricingConfig, FacadeElement } from '@/lib/types';

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newId, setNewId] = useState('');
  const [newNameUz, setNewNameUz] = useState('');
  const [newNameRu, setNewNameRu] = useState('');
  const [newUnit, setNewUnit] = useState('M²');
  const [newCalcType, setNewCalcType] = useState<'volume' | 'unit'>('unit');
  const [newPrice, setNewPrice] = useState(5.0);

  useEffect(() => {
    setConfig(getPricing());
  }, []);

  if (!config) return null;

  const handleSave = () => {
    savePricing(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Barcha narxlar va mahsulotlarni standart zavod sozlamalariga qaytarishni xohlaysizmi?")) {
      setConfig({ ...DEFAULT_PRICING });
    }
  };

  const handleAddElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameUz || !newNameRu) {
      alert("Iltimos, o'zbekcha va ruscha nomlarni kiriting!");
      return;
    }

    // Generate safe id from name
    const generatedId = newId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || 
                        newNameUz.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') + '_' + Date.now().toString().slice(-4);

    if (config.elements.some(el => el.id === generatedId)) {
      alert("Bunday identifikatorli mahsulot allaqachon mavjud. Iltimos, boshqa nom kiriting.");
      return;
    }

    const newElement: FacadeElement = {
      id: generatedId,
      nameUz: newNameUz,
      nameRu: newNameRu,
      description: 'Foydalanuvchi tomonidan qo\'shilgan mahsulot',
      rules: 'Standart tartibda o\'rnatiladi.',
      pricePerUnit: Number(newPrice) || 0,
      unit: newUnit,
      calculationType: newCalcType
    };

    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        elements: [...prev.elements, newElement]
      };
    });

    // Reset form
    setNewId('');
    setNewNameUz('');
    setNewNameRu('');
    setNewUnit('M²');
    setNewCalcType('unit');
    setNewPrice(5.0);
    setShowAddForm(false);
  };

  const handleDeleteElement = (id: string) => {
    if (window.confirm("Ushbu mahsulotni ro'yxatdan o'chirishni xohlaysizmi?")) {
      setConfig(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          elements: prev.elements.filter(el => el.id !== id)
        };
      });
    }
  };

  const handleUpdateElement = (id: string, field: keyof FacadeElement, value: any) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        elements: prev.elements.map(el => el.id === id ? { ...el, [field]: value } : el)
      };
    });
  };

  return (
    <>
      <div className="dash-header">
        <h1>Narx va Mahsulotlar Boshqaruvi</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {saved && <span className="badge badge-success">✓ Muvaffaqiyatli saqlandi</span>}
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Saqlash
          </button>
        </div>
      </div>

      {/* Global price & Exchange Rate */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: 16, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>Global xomashyo narxi ($)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--text-secondary)' }}>1 m³ ko&apos;pik narxi:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>$</span>
              <input
                type="number"
                className="input-field"
                style={{ width: 120, fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}
                value={config.pricePerCubicMeter}
                onChange={e => setConfig(p => p ? { ...p, pricePerCubicMeter: e.target.value === '' ? 0 : +e.target.value } : p)}
              />
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 12 }}>
            Kompaniya standartlari bo&apos;yicha hajmga asoslangan (Hajmli) fasad bezaklarining narxini hisoblashda qo&apos;llaniladi.
          </p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: 16, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>Valyuta kursi (UZS)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--text-secondary)' }}>1 USD Kursi:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                className="input-field"
                style={{ width: 140, fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700 }}
                value={config.usdToUzsRate}
                onChange={e => setConfig(p => p ? { ...p, usdToUzsRate: e.target.value === '' ? 0 : +e.target.value } : p)}
              />
              <span style={{ color: 'var(--text-muted)' }}>so&apos;m</span>
            </div>
          </div>
          {config.usdToUzsRate && config.pricePerCubicMeter && (
            <p style={{ color: 'var(--accent-gold)', fontSize: '0.78rem', marginTop: 12, fontWeight: 600 }}>
              1 m³ so&apos;mda: {(config.pricePerCubicMeter * config.usdToUzsRate).toLocaleString()} so&apos;m
            </p>
          )}
        </div>
      </div>

      {/* Elements List */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Mahsulotlar va xizmatlar ro&apos;yxati</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Smeta kalkulyatorlarida tanlanadigan mahsulotlar ro&apos;yxati va ularning narxlari.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={14} /> Yangi mahsulot qo&apos;shish
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleResetToDefault} style={{ color: 'var(--text-muted)' }}>
              <RefreshCw size={14} /> Zavod sozlamalari
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <form onSubmit={handleAddElement} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-gold)', padding: 20, marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: 16 }}>Yangi mahsulot ma&apos;lumotlari</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="input-group">
                <label>Mahsulot Nomi (UZ)</label>
                <input className="input-field" placeholder="Masalan: Termo panel - 3sm" value={newNameUz} onChange={e => setNewNameUz(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Mahsulot Nomi (RU)</label>
                <input className="input-field" placeholder="Masalan: Термопанель - 3см" value={newNameRu} onChange={e => setNewNameRu(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Identifikator (ID - inglizcha/kodi)</label>
                <input className="input-field" placeholder="Masalan: termo_panel_3" value={newId} onChange={e => setNewId(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="input-group">
                <label>O&apos;lchov birligi</label>
                <select className="input-field" value={newUnit} onChange={e => setNewUnit(e.target.value)}>
                  <option value="M²">M² (Kvadrat metr)</option>
                  <option value="P/M">P/M (Metr oqimi)</option>
                  <option value="DONA">DONA (Dona/Soni)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Hisob-kitob turi</label>
                <select className="input-field" value={newCalcType} onChange={e => setNewCalcType(e.target.value as any)}>
                  <option value="unit">Dona / Kvadrat / Metr bo&apos;yicha to&apos;g&apos;ridan-to&apos;g&apos;ri ko&apos;paytirish</option>
                  <option value="volume">Hajmli (Uzunlik × Kenglik × Balandlik × m³ narxi)</option>
                </select>
              </div>
              <div className="input-group">
                <label>Baza Narxi (USD - $)</label>
                <input type="number" step="0.01" className="input-field" value={newPrice} onChange={e => setNewPrice(+e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Bekor qilish</button>
              <button type="submit" className="btn btn-primary btn-sm">Qo&apos;shish</button>
            </div>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Mahsulot Nomi (UZ)</th>
                <th>Nomi (RU)</th>
                <th>Turi</th>
                <th>Birligi</th>
                <th>Baza Narxi (USD $)</th>
                <th>So&apos;mdagi Narxi</th>
                <th style={{ width: 60, textAlign: 'center' }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {config.elements.map((el) => {
                const priceInUzs = Math.round(el.pricePerUnit * config.usdToUzsRate);
                return (
                  <tr key={el.id}>
                    <td>
                      <input
                        type="text"
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: '0.85rem', width: '100%', minWidth: 150 }}
                        value={el.nameUz}
                        onChange={e => handleUpdateElement(el.id, 'nameUz', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: '0.85rem', width: '100%', minWidth: 150 }}
                        value={el.nameRu}
                        onChange={e => handleUpdateElement(el.id, 'nameRu', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: '0.85rem', cursor: 'pointer' }}
                        value={el.calculationType}
                        onChange={e => handleUpdateElement(el.id, 'calculationType', e.target.value)}
                      >
                        <option value="volume">Hajmli (m³)</option>
                        <option value="unit">O&apos;lchovli</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="input-field"
                        style={{ padding: '6px 10px', fontSize: '0.85rem', cursor: 'pointer', width: 90 }}
                        value={el.unit}
                        onChange={e => handleUpdateElement(el.id, 'unit', e.target.value)}
                      >
                        <option value="M²">M²</option>
                        <option value="P/M">P/M</option>
                        <option value="DONA">DONA</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>$</span>
                        <input
                          type="number"
                          step="0.01"
                          style={{ width: 80, padding: '6px 10px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                          value={el.pricePerUnit}
                          onChange={e => handleUpdateElement(el.id, 'pricePerUnit', +e.target.value)}
                        />
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                      {el.calculationType === 'volume' ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hajmga bog&apos;liq</span>
                      ) : (
                        `${priceInUzs.toLocaleString()} so'm`
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteElement(el.id)}
                        className="btn btn-ghost"
                        style={{ padding: '6px', color: 'var(--error)' }}
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <HelpCircle size={14} />
        <span>Hajmli elementlar narxi global m³ narxi asosida o&apos;lchamlariga ko&apos;paytirilib hisoblanadi. O&apos;lchovli elementlar (termo panel, xizmatlar) esa bevosita o&apos;zining baza narxini kursga ko&apos;paytirib hisoblanadi.</span>
      </div>

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Oxirgi yangilanish: {config.updatedAt ? new Date(config.updatedAt).toLocaleString('uz-UZ') : '—'}
      </div>
    </>
  );
}
