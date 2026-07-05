"use client";

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertCircle, RefreshCw, FileText, ClipboardList, Layers, Settings, ArrowUpRight, ArrowDownLeft, CheckCircle, Play, Tag, Truck, DollarSign, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import type { InventoryItem, InventoryTransaction, BOMRecipe, ProductionOrder } from '@/lib/types';
import { getPricing } from '@/lib/store';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'bom' | 'production'>('stock');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [boms, setBoms] = useState<BOMRecipe[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'raw' | 'production' | 'finished'>('all');

  // Modals
  const [showStockModal, setShowStockModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBOMModal, setShowBOMModal] = useState(false);
  const [showProductionModal, setShowProductionModal] = useState(false);

  // Modal Form States
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'raw' as 'raw' | 'production' | 'finished',
    quantity: 0,
    unit: 'kg',
    threshold: 10,
    cost: 0,
    supplier: ''
  });
  const [newTx, setNewTx] = useState({
    itemId: '',
    type: 'inbound' as 'inbound' | 'outbound' | 'production_use' | 'correction',
    quantity: 0,
    notes: ''
  });
  const [newBOM, setNewBOM] = useState<Partial<BOMRecipe>>({ productId: '', materials: [], steps: [] });
  const [newProd, setNewProd] = useState({ recipeId: '', quantity: 0, notes: '' });

  // Load All Data
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch Inventory & Transactions
      const invRes = await fetch('/api/inventory');
      const invData = await invRes.json();
      if (invData.success) {
        setInventory(invData.inventory || []);
        setTransactions(invData.transactions || []);
      }

      // Fetch BOMs & Production Orders
      const bomRes = await fetch('/api/bom');
      const bomData = await bomRes.json();
      if (bomData.success) {
        setBoms(bomData.boms || []);
        setProductionOrders(bomData.productionOrders || []);
      }

      // Fetch Products list from local pricing config
      const pricing = getPricing();
      if (pricing && pricing.elements) {
        setCatalogProducts(pricing.elements);
      } else {
        setCatalogProducts([
          { id: 'cornice', nameUz: 'Karniz' },
          { id: 'column', nameUz: 'Ustun' },
          { id: 'pilaster', nameUz: 'Pilyastr' },
          { id: 'termopanel_3sm', nameUz: 'Termo panel - 3sm' }
        ]);
      }

    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Inventory Item
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.quantity < 0) {
      toast.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring!");
      return;
    }

    try {
      const item: InventoryItem = {
        id: 'inv_' + Math.random().toString(36).substring(2, 9),
        ...newItem
      };

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_item', item })
      });
      
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
        setShowStockModal(false);
        setNewItem({ name: '', type: 'raw', quantity: 0, unit: 'kg', threshold: 10, cost: 0, supplier: '' });
        toast.success("Ombor mahsuloti muvaffaqiyatli qo'shildi!");
      }
    } catch {
      toast.error("Mahsulot qo'shishda xatolik!");
    }
  };

  // Add Manual Stock Transaction
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.itemId || newTx.quantity < 0) {
      toast.error("Iltimos, mahsulot va miqdorni to'g'ri tanlang!");
      return;
    }

    try {
      const transaction: InventoryTransaction = {
        id: 'tx_' + Math.random().toString(36).substring(2, 9),
        ...newTx,
        date: new Date().toISOString()
      };

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_transaction', transaction })
      });

      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setInventory(data.inventory);
        setShowTransactionModal(false);
        setNewTx({ itemId: '', type: 'inbound', quantity: 0, notes: '' });
        toast.success("Ombor harakati muvaffaqiyatli saqlandi!");
      }
    } catch {
      toast.error("Harakat saqlashda xatolik!");
    }
  };

  // Save BOM Recipe
  const handleSaveBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBOM.productId || !newBOM.materials || newBOM.materials.length === 0) {
      toast.error("Resept uchun mahsulot va kamida bitta xom-ashyo tanlang!");
      return;
    }

    try {
      const bom: BOMRecipe = {
        id: newBOM.id || 'bom_' + Math.random().toString(36).substring(2, 9),
        productId: newBOM.productId,
        materials: newBOM.materials,
        steps: newBOM.steps || [],
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_bom', bom })
      });

      const data = await res.json();
      if (data.success) {
        setBoms(data.boms);
        setShowBOMModal(false);
        setNewBOM({ productId: '', materials: [], steps: [] });
        toast.success("BOM resepti muvaffaqiyatli saqlandi!");
      }
    } catch {
      toast.error("Resept saqlashda xato!");
    }
  };

  // Delete BOM
  const handleDeleteBOM = async (id: string) => {
    if (!window.confirm("Ushbu reseptni o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/bom?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBoms(data.boms);
        toast.success("Resept o'chirildi");
      }
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  // Start & Complete Production Order
  const handleCreateProduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.recipeId || newProd.quantity <= 0) {
      toast.error("Iltimos, resept va miqdorni to'g'ri tanlang!");
      return;
    }

    const selectedBOM = boms.find(b => b.id === newProd.recipeId);
    if (!selectedBOM) return;

    let canProduce = true;
    const shortages: string[] = [];

    selectedBOM.materials.forEach(req => {
      const material = inventory.find(i => i.id === req.itemId);
      const needed = req.quantityRequired * newProd.quantity;
      if (!material || material.quantity < needed) {
        canProduce = false;
        shortages.push(`${material?.name || 'Noma\'lum'} (Kerak: ${needed} ${material?.unit || ''}, Omborda: ${material?.quantity || 0})`);
      }
    });

    if (!canProduce) {
      toast.error(`Xomashyo yetishmaydi:\n${shortages.join('\n')}`, { duration: 6000 });
      return;
    }

    try {
      const finishedProduct = catalogProducts.find(p => p.id === selectedBOM.productId)?.nameUz || 'Tayyor Mahsulot';
      
      const productionOrder: ProductionOrder = {
        id: 'pr_' + Math.random().toString(36).substring(2, 9),
        recipeId: newProd.recipeId,
        productName: finishedProduct,
        quantity: newProd.quantity,
        status: 'completed',
        date: new Date().toISOString(),
        notes: newProd.notes
      };

      const res = await fetch('/api/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_production', productionOrder })
      });

      const data = await res.json();
      if (data.success) {
        setProductionOrders(data.productionOrders);
        setInventory(data.inventory);
        loadData();
        setShowProductionModal(false);
        setNewProd({ recipeId: '', quantity: 0, notes: '' });
        toast.success("Ishlab chiqarish yakunlandi, xomashyo kamaytirildi va tayyor mahsulot qo'shildi!");
      }
    } catch {
      toast.error("Ishlab chiqarish buyrug'ida xatolik!");
    }
  };

  // Filter Inventory items
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div className="dash-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Package size={28} style={{ color: 'var(--accent-gold)' }} />
            Omborxona va Ishlab chiqarish
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Xomashyolar, ishlab chiqarish jihozlari, tayyor mahsulotlar va ishlab chiqarish bosqichlari boshqaruvi.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {activeTab === 'stock' && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowTransactionModal(true)}>
                <Plus size={14} /> Harakat Kiritish (Kirim/Chiqim)
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowStockModal(true)}>
                <Plus size={14} /> Yangi Tovar Qo&apos;shish
              </button>
            </>
          )}
          {activeTab === 'bom' && (
            <button className="btn btn-primary btn-sm" onClick={() => {
              setNewBOM({ productId: '', materials: [{ itemId: '', quantityRequired: 0 }], steps: [''] });
              setShowBOMModal(true);
            }}>
              <Plus size={14} /> Yangi Resept (BOM) Yaratish
            </button>
          )}
          {activeTab === 'production' && (
            <button className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #d99a6c 0%, #b27245 100%)', color: '#050811' }} onClick={() => setShowProductionModal(true)}>
              <Play size={14} fill="#050811" /> Ishlab chiqarishni rejalashtirish
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-container" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`btn ${activeTab === 'stock' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Layers size={16} style={{ marginRight: 8 }} />
          Ombor Qoldiqlari
        </button>
        <button 
          onClick={() => setActiveTab('bom')}
          className={`btn ${activeTab === 'bom' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Settings size={16} style={{ marginRight: 8 }} />
          BOM - Reseptlar
        </button>
        <button 
          onClick={() => setActiveTab('production')}
          className={`btn ${activeTab === 'production' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <ClipboardList size={16} style={{ marginRight: 8 }} />
          Ishlab chiqarish tarixi
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--accent-gold)' }} />
        </div>
      ) : (
        <>
          {/* TAB 1: STOCK LEVELS */}
          {activeTab === 'stock' && (
            <div style={{ display: 'grid', gridTemplateColumns: '3.1fr 1.3fr', gap: '24px', alignItems: 'flex-start' }}>
              
              {/* Inventory Table */}
              <div className="glass-card" style={{ padding: 0 }}>
                {/* Search Bar */}
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                      type="text" 
                      placeholder="Tovar yoki material nomini yozing..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '40px' }}
                    />
                  </div>
                  <select 
                    value={typeFilter} 
                    onChange={e => setTypeFilter(e.target.value as any)}
                    className="input-field" 
                    style={{ width: '190px' }}
                  >
                    <option value="all">Barcha turlar</option>
                    <option value="raw">Xomashyolar (Raw)</option>
                    <option value="production">Ishlab chiqarish jihozlari</option>
                    <option value="finished">Tayyor mahsulotlar</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Material / Tovar</th>
                        <th>Kategoriya</th>
                        <th>Birligi</th>
                        <th style={{ textAlign: 'right' }}>Joriy Qoldiq</th>
                        <th style={{ textAlign: 'right' }}>Tannarx ($)</th>
                        <th>Yetkazib beruvchi</th>
                        <th>Minimal Chegara</th>
                        <th>Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map(item => {
                        // Calculate status automatically
                        let statusColor = 'var(--success)';
                        let statusText = 'Yetarli';
                        
                        if (item.quantity === 0) {
                          statusColor = 'var(--error)';
                          statusText = 'Tugagan';
                        } else if (item.quantity <= item.threshold) {
                          statusColor = 'var(--warning)';
                          statusText = 'Kam qoldi';
                        }

                        return (
                          <tr key={item.id}>
                            <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</td>
                            <td>
                              <span className={`badge ${item.type === 'raw' ? 'badge-info' : item.type === 'production' ? 'badge-primary' : 'badge-gold'}`}>
                                {item.type === 'raw' ? 'Xomashyo' : item.type === 'production' ? 'Jihoz/Material' : 'Tayyor mahsulot'}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-secondary)' }}>{item.unit}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                              {item.quantity.toLocaleString()}
                            </td>
                            <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                              {item.cost ? `$${item.cost.toLocaleString()}` : '—'}
                            </td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.supplier || '—'}</td>
                            <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {item.threshold}
                            </td>
                            <td>
                              <span 
                                className="badge" 
                                style={{ 
                                  background: `rgba(${statusColor === 'var(--success)' ? '34,197,94' : statusColor === 'var(--warning)' ? '234,179,8' : '239,68,68'}, 0.1)`, 
                                  color: statusColor,
                                  borderColor: statusColor,
                                  border: '1px solid',
                                  fontSize: '0.78rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                {statusText === 'Tugagan' && <ShieldAlert size={12} />}
                                {statusText === 'Kam qoldi' && <AlertCircle size={12} />}
                                {statusText === 'Yetarli' && <CheckCircle size={12} />}
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredInventory.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Tovar topilmadi.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inbound/Outbound logs */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                  <FileText size={18} /> Oxirgi ombor harakatlari
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '550px', overflowY: 'auto' }}>
                  {transactions.slice(0, 15).map((tx) => {
                    const matchedItem = inventory.find(i => i.id === tx.itemId);
                    const itemName = matchedItem?.name || 'O\'chirilgan tovar';
                    const unit = matchedItem?.unit || '';
                    
                    let typeColor = 'var(--success)';
                    let typeLabel = 'Kirim';
                    let Icon = ArrowDownLeft;

                    if (tx.type === 'outbound') {
                      typeColor = 'var(--error)';
                      typeLabel = 'Chiqim';
                      Icon = ArrowUpRight;
                    } else if (tx.type === 'production_use') {
                      typeColor = 'var(--accent-gold)';
                      typeLabel = 'Ishlab chiqarish sarfi';
                      Icon = ArrowUpRight;
                    } else if (tx.type === 'correction') {
                      typeColor = '#3b82f6';
                      typeLabel = 'Tuzatish';
                      Icon = Settings;
                    }

                    return (
                      <div key={tx.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                        <div>
                          <Icon size={20} style={{ color: typeColor }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{itemName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tx.notes}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: '4px' }}>
                            <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                              {typeLabel}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {new Date(tx.date).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 700, color: typeColor }}>
                          {tx.type === 'inbound' ? '+' : tx.type === 'correction' ? '=' : '-'}{tx.quantity.toLocaleString()} {unit}
                        </div>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>Ombor harakatlari tarixi bo&apos;sh.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOM RECIPES */}
          {activeTab === 'bom' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
              {boms.map((bom) => {
                const prodName = catalogProducts.find(p => p.id === bom.productId)?.nameUz || bom.productId;
                return (
                  <div key={bom.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(217, 154, 108, 0.15)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.15rem', fontWeight: 700 }}>{prodName}</h3>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', padding: '4px 8px' }} onClick={() => handleDeleteBOM(bom.id)}>O&apos;chirish</button>
                      </div>
                      
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Kerakli xomashyo (1 birlik uchun):</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {bom.materials.map((m, idx) => {
                            const material = inventory.find(i => i.id === m.itemId);
                            return (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px dashed var(--border)', paddingBottom: 4 }}>
                                <span style={{ color: 'var(--text-primary)' }}>• {material?.name || 'Noma\'lum xomashyo'}</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{m.quantityRequired} {material?.unit}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {bom.steps && bom.steps.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tayyorlash bosqichlari:</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {bom.steps.map((step, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{idx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      Oxirgi tahrirlash: {new Date(bom.updatedAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                );
              })}
              {boms.length === 0 && (
                <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>BOM reseptlari topilmadi. Yangi resept yaratish tugmasini bosing.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTION LOGS */}
          {activeTab === 'production' && (
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Hujjat ID</th>
                      <th>Mahsulot nomi</th>
                      <th style={{ textAlign: 'right' }}>Miqdor</th>
                      <th>Holati</th>
                      <th>Sana</th>
                      <th>Mas&apos;ul shaxs / Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productionOrders.map((po) => (
                      <tr key={po.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>#{po.id}</td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{po.productName}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {po.quantity.toLocaleString()} dona
                        </td>
                        <td>
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle size={12} /> Yakunlandi & Ombordan ayrildi
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(po.date).toLocaleString('uz-UZ')}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{po.notes || '—'}</td>
                      </tr>
                    ))}
                    {productionOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Ishlab chiqarish buyruqlari topilmadi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL 1: NEW MATERIAL */}
      {showStockModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={20} style={{ color: 'var(--accent-gold)' }} />
                Yangi Tovar Qo&apos;shish
              </h2>
              <button onClick={() => setShowStockModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Tovar / Material Nomi *</label>
                <input 
                  type="text" 
                  value={newItem.name} 
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Masalan: Penoplast 25 zichlik (3sm)"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Kategoriya *</label>
                  <select 
                    value={newItem.type} 
                    onChange={e => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="raw">Xomashyo (Raw)</option>
                    <option value="production">Ishlab chiqarish jihozi</option>
                    <option value="finished">Tayyor mahsulot (Finished)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>O&apos;lchov Birligi *</label>
                  <select 
                    value={newItem.unit} 
                    onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="input-field"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="m³">m³ (Kup metr)</option>
                    <option value="dona">dona (Soni)</option>
                    <option value="m">m (Metr oqimi)</option>
                    <option value="m²">m² (Kvadrat metr)</option>
                    <option value="litr">litr (Luyqa)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Boshlang&apos;ich Qoldiq *</label>
                  <input 
                    type="number" 
                    value={newItem.quantity} 
                    onChange={e => setNewItem(prev => ({ ...prev, quantity: Math.max(0, +e.target.value) }))}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Minimal Chegara *</label>
                  <input 
                    type="number" 
                    value={newItem.threshold} 
                    onChange={e => setNewItem(prev => ({ ...prev, threshold: Math.max(0, +e.target.value) }))}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Yetkazib Beruvchi (Supplier)</label>
                  <div style={{ position: 'relative' }}>
                    <Truck size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      value={newItem.supplier} 
                      onChange={e => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                      className="input-field"
                      style={{ paddingLeft: 32 }}
                      placeholder="Firma / Kishi nomi"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Tannarxi (USD - $)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="number" 
                      step="0.01"
                      value={newItem.cost === 0 ? '' : newItem.cost} 
                      onChange={e => setNewItem(prev => ({ ...prev, cost: Math.max(0, +e.target.value) }))}
                      className="input-field"
                      style={{ paddingLeft: 32 }}
                      placeholder="1 birlik narxi"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Saqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANUAL TRANSACTION */}
      {showTransactionModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>Ombor Harakati Kiritish</h2>
              <button onClick={() => setShowTransactionModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleSaveTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Tovar / Materialni Tanlang *</label>
                <select 
                  value={newTx.itemId} 
                  onChange={e => setNewTx(prev => ({ ...prev, itemId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">— Tanlang —</option>
                  {inventory.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.unit}) - Omborda: {i.quantity}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Harakat Turi *</label>
                  <select 
                    value={newTx.type} 
                    onChange={e => setNewTx(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="inbound">📥 Kirim (Omborga qo&apos;shish)</option>
                    <option value="outbound">📤 Chiqim (Sotuv / Boshqa)</option>
                    <option value="production_use">⚙️ Ishlab chiqarish sarfi</option>
                    <option value="correction">⚖️ Tuzatish (Miqdorni to&apos;g&apos;irlash)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Miqdori *</label>
                  <input 
                    type="number" 
                    value={newTx.quantity === 0 ? '' : newTx.quantity} 
                    onChange={e => setNewTx(prev => ({ ...prev, quantity: Math.max(0, +e.target.value) }))}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Harakat Hujjati / Izoh *</label>
                <input 
                  type="text" 
                  value={newTx.notes} 
                  onChange={e => setNewTx(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  placeholder="Masalan: A-12 transport kirimi"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Harakatni Tasdiqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE/EDIT BOM */}
      {showBOMModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 550, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>BOM Resepti Yaratish</h2>
              <button onClick={() => setShowBOMModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleSaveBOM} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Fasad mahsuloti</label>
                <select 
                  value={newBOM.productId} 
                  onChange={e => setNewBOM(prev => ({ ...prev, productId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">— Tanlang —</option>
                  {catalogProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.nameUz}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tarkibiy xomashyolar sarfi (1 birlik mahsulot uchun)</label>
                  <button 
                    type="button" 
                    onClick={() => setNewBOM(prev => ({ ...prev, materials: [...(prev.materials || []), { itemId: '', quantityRequired: 0 }] }))}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--accent-gold)' }}
                  >
                    + Xomashyo qo&apos;shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {newBOM.materials?.map((mat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <select 
                        value={mat.itemId}
                        onChange={e => {
                          const updated = [...(newBOM.materials || [])];
                          updated[idx].itemId = e.target.value;
                          setNewBOM(prev => ({ ...prev, materials: updated }));
                        }}
                        className="input-field"
                        style={{ flex: 1.5 }}
                        required
                      >
                        <option value="">— Xomashyo —</option>
                        {inventory.filter(i => i.type === 'raw').map(i => (
                          <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                        ))}
                      </select>
                      
                      <input 
                        type="number" 
                        step="0.0001"
                        placeholder="Miqdori"
                        value={mat.quantityRequired === 0 ? '' : mat.quantityRequired}
                        onChange={e => {
                          const updated = [...(newBOM.materials || [])];
                          updated[idx].quantityRequired = +e.target.value;
                          setNewBOM(prev => ({ ...prev, materials: updated }));
                        }}
                        className="input-field"
                        style={{ flex: 1 }}
                        required
                      />

                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = (newBOM.materials || []).filter((_, i) => i !== idx);
                          setNewBOM(prev => ({ ...prev, materials: updated }));
                        }}
                        className="btn btn-ghost"
                        style={{ color: 'var(--error)', padding: '6px' }}
                      >
                        O&apos;chirish
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ishlab chiqarish bosqichlari (ketma-ketlikda)</label>
                  <button 
                    type="button" 
                    onClick={() => setNewBOM(prev => ({ ...prev, steps: [...(prev.steps || []), ''] }))}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--accent-gold)' }}
                  >
                    + Bosqich qo&apos;shish
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {newBOM.steps?.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{idx + 1}.</span>
                      <input 
                        type="text" 
                        value={step}
                        onChange={e => {
                          const updated = [...(newBOM.steps || [])];
                          updated[idx] = e.target.value;
                          setNewBOM(prev => ({ ...prev, steps: updated }));
                        }}
                        className="input-field"
                        placeholder="Masalan: Tarkibni qolipga solib quritish"
                        style={{ flex: 1 }}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = (newBOM.steps || []).filter((_, i) => i !== idx);
                          setNewBOM(prev => ({ ...prev, steps: updated }));
                        }}
                        className="btn btn-ghost"
                        style={{ color: 'var(--error)', padding: '6px' }}
                      >
                        O&apos;chirish
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Reseptni Saqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: START PRODUCTION */}
      {showProductionModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>Ishlab chiqarish buyrug&apos;i</h2>
              <button onClick={() => setShowProductionModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleCreateProduction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Ishlab chiqariladigan mahsulot (BOM resepti)</label>
                <select 
                  value={newProd.recipeId} 
                  onChange={e => setNewProd(prev => ({ ...prev, recipeId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">— Reseptni tanlang —</option>
                  {boms.map(b => {
                    const name = catalogProducts.find(p => p.id === b.productId)?.nameUz || b.productId;
                    return (
                      <option key={b.id} value={b.id}>{name}</option>
                    );
                  })}
                </select>
              </div>

              <div className="input-group">
                <label>Ishlab chiqarish miqdori (dona / m²)</label>
                <input 
                  type="number" 
                  value={newProd.quantity === 0 ? '' : newProd.quantity} 
                  onChange={e => setNewProd(prev => ({ ...prev, quantity: Math.max(1, +e.target.value) }))}
                  className="input-field"
                  min="1"
                  placeholder="Masalan: 100"
                  required
                />
              </div>

              {newProd.recipeId && newProd.quantity > 0 && (
                <div className="glass-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 12 }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: 8 }}>Xomashyo sarfi va ombor hisobi:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {boms.find(b => b.id === newProd.recipeId)?.materials.map((m, idx) => {
                      const material = inventory.find(i => i.id === m.itemId);
                      const totalNeeded = m.quantityRequired * newProd.quantity;
                      const hasEnough = material && material.quantity >= totalNeeded;
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                          <span style={{ color: hasEnough ? 'var(--text-secondary)' : 'var(--error)' }}>
                            • {material?.name || 'Xomashyo'}
                          </span>
                          <span style={{ fontWeight: 700, color: hasEnough ? 'var(--success)' : 'var(--error)' }}>
                            Kerak: {totalNeeded.toLocaleString()} / Omborda: {material?.quantity || 0} {material?.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Mas&apos;ul shaxs / Usta / Izoh</label>
                <input 
                  type="text" 
                  value={newProd.notes} 
                  onChange={e => setNewProd(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  placeholder="Masalan: Doston usta guruhi"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Ishni yakunlash va tovar qo&apos;shish</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
