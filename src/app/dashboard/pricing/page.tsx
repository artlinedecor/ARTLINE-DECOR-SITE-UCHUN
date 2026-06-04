'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { getPricing, savePricing } from '@/lib/store';
import { FACADE_ELEMENTS } from '@/lib/calculator';
import type { PricingConfig, FacadeElementType } from '@/lib/types';

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setConfig(getPricing()); }, []);

  if (!config) return null;

  const handleSave = () => {
    savePricing(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="dash-header">
        <h1>Narx Boshqaruvi</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {saved && <span className="badge badge-success">✓ Saqlandi</span>}
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Saqlash
          </button>
        </div>
      </div>

      {/* Global price */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Global narx</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-secondary)' }}>1 m³ narxi:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '1.2rem' }}>$</span>
            <input
              type="number"
              className="input-field"
              style={{ width: 140, fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700 }}
              value={config.pricePerCubicMeter}
              onChange={e => setConfig(p => p ? { ...p, pricePerCubicMeter: +e.target.value } : p)}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            (Kalkulyatorda ishlatiladi)
          </span>
        </div>
      </div>

      {/* Element prices */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3>Element narxlari</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const def = { cornice: 15, column: 25, pilaster: 20, archivolt: 30, bracket: 12, molding: 10, rustik: 18, medallion: 35, balustrade: 28, keystone: 22 };
            setConfig(p => p ? { ...p, elements: def as Record<FacadeElementType, number> } : p);
          }}>
            <RefreshCw size={14} /> Standart narxlar
          </button>
        </div>

        <table className="pricing-table">
          <thead>
            <tr>
              <th>Element</th>
              <th>Nomi (Rus)</th>
              <th>O&apos;lchov birligi</th>
              <th>Narx ($)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(FACADE_ELEMENTS).map(([key, el]) => (
              <tr key={key}>
                <td style={{ fontWeight: 600 }}>{el.nameUz}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{el.nameRu}</td>
                <td><span className="badge badge-gold">{el.unit}</span></td>
                <td>
                  <input
                    type="number"
                    value={config.elements[key as FacadeElementType] ?? el.pricePerUnit}
                    onChange={e => setConfig(p => {
                      if (!p) return p;
                      return { ...p, elements: { ...p.elements, [key]: +e.target.value } };
                    })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Oxirgi yangilanish: {config.updatedAt ? new Date(config.updatedAt).toLocaleString('uz-UZ') : '—'}
      </div>
    </>
  );
}
