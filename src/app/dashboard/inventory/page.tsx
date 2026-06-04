"use client";

import React, { useState } from 'react';
import { Package, Plus, Search, AlertCircle } from 'lucide-react';

const initialInventory = [
  { id: 1, name: 'Karniz K-12', type: 'Tayyor mahsulot', quantity: 450, unit: 'm', threshold: 100 },
  { id: 2, name: 'Molding M-05', type: 'Tayyor mahsulot', quantity: 80, unit: 'm', threshold: 150 },
  { id: 3, name: 'Penoplast 25 zichlik', type: 'Xom-ashyo', quantity: 50, unit: 'm3', threshold: 20 },
  { id: 4, name: 'Suyuq shpatlyovka', type: 'Xom-ashyo', quantity: 200, unit: 'kg', threshold: 300 },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dash-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={28} />
            Omborxona
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Xom-ashyo va tayyor mahsulotlar qoldig'i</p>
        </div>
        
        <button className="btn btn-primary">
          <Plus size={16} />
          Mahsulot Qo'shish
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Mahsulot qidirish..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingLeft: '40px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Mahsulot Nomi</th>
                <th>Turi</th>
                <th>Qoldiq</th>
                <th>Holat</th>
                <th>Harakat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.type}</td>
                  <td style={{ color: 'var(--text-primary)' }}>
                    {item.quantity} <span style={{ color: 'var(--text-muted)' }}>{item.unit}</span>
                  </td>
                  <td>
                    {item.quantity <= item.threshold ? (
                      <span className="badge badge-error" style={{ display: 'inline-flex' }}>
                        <AlertCircle size={12} /> Kam qoldi
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ display: 'inline-flex' }}>
                        Yeterli
                      </span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-gold)' }}>Tahrirlash</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
