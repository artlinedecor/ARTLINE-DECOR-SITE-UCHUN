'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Phone, MapPin, X, User, Trash2, Save, Download, FileText, Image as ImageIcon } from 'lucide-react';
import {
  generateId,
  getPricing,
} from '@/lib/store';
import type { Order, OrderStatus } from '@/lib/types';
import { calculateDashboardStats } from '@/lib/stats';
import { generateEstimatePDF } from '@/lib/pdf-generator';
import {
  fetchOrdersClient,
  saveOrderClient,
  patchOrderStatusClient,
  deleteOrderClient,
} from '@/lib/orders-sync';
import toast from 'react-hot-toast';
const COLUMNS: { id: OrderStatus; title: string; color: string }[] = [
  { id: 'new',         title: '🆕 Yangi',   color: 'var(--info)' },
  { id: 'measurement', title: '📐 Zamer',   color: 'var(--warning)' },
  { id: 'design',      title: '🎨 Dizayn',  color: 'var(--accent-gold)' },
  { id: 'sold',        title: '✅ Sotildi', color: 'var(--success)' },
];

/* ---- Draggable card ---- */
function SortableCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: order.id });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="kanban-card-name">{order.clientName}</div>
        <div 
          {...listeners} 
          style={{ cursor: 'grab', color: 'var(--text-muted)', touchAction: 'none' }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </div>
      </div>
      <div className="kanban-card-phone">
        <Phone size={12} style={{ marginRight: 4 }} />
        {order.phone}
      </div>
      {order.address && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <MapPin size={12} /> {order.address}
        </div>
      )}
      <div className="kanban-card-price">{order.totalPrice.toLocaleString()} so&apos;m</div>
      <div className="kanban-card-date">
        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
      </div>
    </div>
  );
}

/* ---- Droppable column wrapper ---- */
function DroppableColumn({
  col, orders, isOver, onCardClick,
}: {
  col: { id: OrderStatus; title: string; color: string };
  orders: Order[];
  isOver: boolean;
  onCardClick: (order: Order) => void;
}) {
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div
      className="kanban-column"
      style={{
        border: isOver ? `2px solid ${col.color}` : undefined,
        boxShadow: isOver ? `0 0 0 3px ${col.color}22` : undefined,
        transition: 'border 0.15s, box-shadow 0.15s',
      }}
    >
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <span style={{ color: col.color }}>{col.title}</span>
        </div>
        <div className="kanban-column-count">{orders.length}</div>
      </div>

      <SortableContext
        id={col.id}
        items={orders.map(o => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="kanban-cards" style={{ minHeight: 80, flex: 1 }}>
          {orders.map(order => (
            <SortableCard key={order.id} order={order} onClick={() => onCardClick(order)} />
          ))}
          {orders.length === 0 && (
            <div style={{
              minHeight: 60, borderRadius: 'var(--radius-sm)',
              border: `2px dashed ${isOver ? col.color : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', color: 'var(--text-muted)',
              transition: 'border-color 0.15s',
            }}>
              {isOver ? '⬇ Bu yerga tashlang' : 'Bo\'sh'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/* ---- Main page ---- */
export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({ clientName: '', phone: '', address: '', totalPrice: 0 });

  // Detail Modal & Edit States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [elements, setElements] = useState<any[]>([]);

  const loadOrders = useCallback(async () => {
    const data = await fetchOrdersClient();
    setOrders(data);
  }, []);

  useEffect(() => {
    loadOrders();
    const pricing = getPricing();
    if (pricing && pricing.elements) {
      setElements(pricing.elements);
    }
  }, [loadOrders]);

  const stats = calculateDashboardStats(orders);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    setOverId(e.over?.id as string ?? null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);
    const { active, over } = e;
    if (!over) return;

    const activeOrderId = active.id as string;
    const overId = over.id as string;

    const notifyTelegram = (orderId: string, newStatusId: OrderStatus) => {
      const order = orders.find(o => o.id === orderId);
      if (!order || order.status === newStatusId) return; // Status didn't actually change
      
      const targetColumn = COLUMNS.find(c => c.id === newStatusId);
      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_change',
          order: {
            id: order.id,
            clientName: order.clientName,
            phone: order.phone,
            statusText: targetColumn?.title || newStatusId
          }
        }),
      }).catch(err => console.error(err));
    };

    // Dropped directly on a column
    const targetColumn = COLUMNS.find(c => c.id === overId);
    if (targetColumn) {
      notifyTelegram(activeOrderId, targetColumn.id);
      await patchOrderStatusClient(activeOrderId, targetColumn.id);
      await loadOrders();
      toast.success("Holat yangilandi!");
      return;
    }

    // Dropped on a card — move to that card's column
    const targetOrder = orders.find(o => o.id === overId);
    if (targetOrder) {
      notifyTelegram(activeOrderId, targetOrder.status);
      await patchOrderStatusClient(activeOrderId, targetOrder.status);
      await loadOrders();
      toast.success("Holat yangilandi!");
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.clientName || !newOrder.phone) return;
    const order: Order = {
      id: generateId(),
      ...newOrder,
      status: 'new',
      items: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveOrderClient(order);
    await loadOrders();
    setShowModal(false);
    setNewOrder({ clientName: '', phone: '', address: '', totalPrice: 0 });
    toast.success("Yangi buyurtma qo'shildi!");

    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});
  };

  const handleCardClick = (order: Order) => {
    setSelectedOrder(order);
    setEditOrder({ ...order });
  };

  const handleDownloadPDF = async (order: Order) => {
    setPdfLoading(true);
    const result = {
      items: order.items.map(item => ({
        elementType: item.elementType,
        name: item.name,
        dimensions: `${item.length}x${item.width}x${item.height}m`,
        volume: item.length * item.width * item.height,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      subtotal: order.totalPrice / 1.12,
      vat: (order.totalPrice / 1.12) * 0.12,
      total: order.totalPrice
    };
    await generateEstimatePDF(result, {
      name: order.clientName,
      phone: order.phone,
      address: order.address
    });
    setPdfLoading(false);
  };

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

  const handleDetailImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'object' | 'calc') => {
    const files = e.target.files;
    if (!files || !editOrder) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const compressed = await compressImage(base64);
          setEditOrder((prev) => {
            if (!prev) return null;
            const currentList = type === 'object' ? (prev.objectImages || []) : (prev.calcImages || []);
            return {
              ...prev,
              [type === 'object' ? 'objectImages' : 'calcImages']: [...currentList, compressed],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveEdits = async () => {
    if (!editOrder) return;
    await saveOrderClient(editOrder);
    await loadOrders();
    setSelectedOrder(null);
    setEditOrder(null);
    toast.success("Buyurtma ma'lumotlari saqlandi!");
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Haqiqatan ham bu buyurtmani o'chirmoqchimisiz?")) return;
    await deleteOrderClient(id);
    await loadOrders();
    setSelectedOrder(null);
    setEditOrder(null);
    toast.success("Buyurtma o'chirildi!");
  };

  const activeOrder = orders.find(o => o.id === activeId);

  // Which column is being hovered?
  const getHoveredColumn = (id: string | null): OrderStatus | null => {
    if (!id) return null;
    if (COLUMNS.find(c => c.id === id)) return id as OrderStatus;
    const card = orders.find(o => o.id === id);
    return card?.status ?? null;
  };

  const hoveredCol = getHoveredColumn(overId);

  return (
    <>
      <div className="dash-header">
        <h1>Kanban Board</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Yangi buyurtma
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Jami buyurtmalar</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Umumiy savdo</div>
          <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">O&apos;rtacha chek</div>
          <div className="stat-value">${Math.round(stats.averageCheck).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Yangi leadlar</div>
          <div className="stat-value">{stats.statusCounts.new}</div>
        </div>
      </div>

      {/* Kanban */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const columnOrders = orders.filter(o => o.status === col.id);
            return (
              <DroppableColumn
                key={col.id}
                col={col}
                orders={columnOrders}
                isOver={hoveredCol === col.id}
                onCardClick={handleCardClick}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeOrder && (
            <div className="kanban-card" style={{ boxShadow: 'var(--shadow-lg)', opacity: 0.95, cursor: 'grabbing' }}>
              <div className="kanban-card-name">{activeOrder.clientName}</div>
              <div className="kanban-card-phone">
                <Phone size={12} style={{ marginRight: 4 }} />
                {activeOrder.phone}
              </div>
              <div className="kanban-card-price">{activeOrder.totalPrice.toLocaleString()}&nbsp;so&apos;m</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Yangi buyurtma qo&apos;shish</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Mijoz ismi *</label>
                <input className="input-field" placeholder="Ism Familiya" value={newOrder.clientName}
                  onChange={e => setNewOrder(p => ({ ...p, clientName: e.target.value }))} autoFocus />
              </div>
              <div className="input-group">
                <label>Telefon *</label>
                <input className="input-field" placeholder="+998 90 123 45 67" value={newOrder.phone}
                  onChange={e => setNewOrder(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Manzil</label>
                <input className="input-field" placeholder="Shahar, ko'cha" value={newOrder.address}
                  onChange={e => setNewOrder(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="input-group">
                <label>Buyurtma summasi (so&apos;m)</label>
                <input type="number" className="input-field" placeholder="0" value={newOrder.totalPrice || ''}
                  onChange={e => setNewOrder(p => ({ ...p, totalPrice: +e.target.value }))} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Bekor qilish</button>
              <button className="btn btn-primary" onClick={handleAddOrder}>Qo&apos;shish</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && editOrder && (
        <div className="modal-overlay" onClick={() => { setSelectedOrder(null); setEditOrder(null); }}>
          <div className="modal" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Buyurtma Tafsilotlari</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedOrder(null); setEditOrder(null); }} style={{ padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Left Column: Client Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="input-group">
                  <label>Mijoz ismi *</label>
                  <input className="input-field" value={editOrder.clientName}
                    onChange={e => setEditOrder(prev => prev ? { ...prev, clientName: e.target.value } : null)} />
                </div>
                <div className="input-group">
                  <label>Telefon *</label>
                  <input className="input-field" value={editOrder.phone}
                    onChange={e => setEditOrder(prev => prev ? { ...prev, phone: e.target.value } : null)} />
                </div>
                <div className="input-group">
                  <label>Manzil</label>
                  <input className="input-field" value={editOrder.address || ''}
                    onChange={e => setEditOrder(prev => prev ? { ...prev, address: e.target.value } : null)} />
                </div>
                <div className="input-group">
                  <label>Izoh / Eslatmalar</label>
                  <textarea className="input-field" style={{ minHeight: 80, resize: 'vertical' }} value={editOrder.notes || ''}
                    onChange={e => setEditOrder(prev => prev ? { ...prev, notes: e.target.value } : null)} />
                </div>
                <div className="input-group">
                  <label>Jami summa (so&apos;m)</label>
                  <input type="number" className="input-field" value={editOrder.totalPrice || 0}
                    onChange={e => setEditOrder(prev => prev ? { ...prev, totalPrice: +e.target.value } : null)} />
                </div>
              </div>

              {/* Right Column: Element Details & Images */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Element details */}
                {editOrder.items && editOrder.items.length > 0 && (
                  <div className="glass-card" style={{ padding: 12 }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={14} /> Elementlar ro&apos;yxati
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto', fontSize: '0.78rem' }}>
                      {editOrder.items.map((item, idx) => {
                        const elMeta = elements.find(el => el.id === item.elementType);
                        const isUnit = elMeta ? elMeta.calculationType === 'unit' : false;
                        const specText = isUnit ? (elMeta.unit || 'dona') : `${item.length}x${item.width}x${item.height}m`;
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                            <span>{item.name} ({specText})</span>
                            <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>{item.quantity} dona - {item.totalPrice.toLocaleString()} so&apos;m</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Photos upload & galleries */}
                <div className="glass-card" style={{ padding: 12 }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ImageIcon size={14} /> Biriktirilgan Rasmlar
                  </h4>

                  {/* Object Photos */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Obyekt rasmlari ({(editOrder.objectImages || []).length})</span>
                      <button className="btn btn-ghost btn-xs" style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => document.getElementById('detail-object-upload')?.click()}>
                        Yuklash
                      </button>
                      <input id="detail-object-upload" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleDetailImageUpload(e, 'object')} />
                    </div>
                    {editOrder.objectImages && editOrder.objectImages.length > 0 ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: 80, overflowY: 'auto', padding: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
                        {editOrder.objectImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: 40, height: 40, borderRadius: 4, overflow: 'hidden' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Obyekt" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(img, '_blank')} />
                            <button
                              style={{
                                position: 'absolute', top: 0, right: 0,
                                width: 14, height: 14, borderRadius: '50%',
                                background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 8
                              }}
                              onClick={() => setEditOrder(prev => {
                                if (!prev) return null;
                                return { ...prev, objectImages: (prev.objectImages || []).filter((_, i) => i !== idx) };
                              })}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Rasm yo&apos;q</div>
                    )}
                  </div>

                  {/* Calculation / Sketch Photos */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Hisob-kitob / Chizma ({(editOrder.calcImages || []).length})</span>
                      <button className="btn btn-ghost btn-xs" style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => document.getElementById('detail-calc-upload')?.click()}>
                        Yuklash
                      </button>
                      <input id="detail-calc-upload" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleDetailImageUpload(e, 'calc')} />
                    </div>
                    {editOrder.calcImages && editOrder.calcImages.length > 0 ? (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: 80, overflowY: 'auto', padding: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
                        {editOrder.calcImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: 40, height: 40, borderRadius: 4, overflow: 'hidden' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Chizma" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(img, '_blank')} />
                            <button
                              style={{
                                position: 'absolute', top: 0, right: 0,
                                width: 14, height: 14, borderRadius: '50%',
                                background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 8
                              }}
                              onClick={() => setEditOrder(prev => {
                                if (!prev) return null;
                                return { ...prev, calcImages: (prev.calcImages || []).filter((_, i) => i !== idx) };
                              })}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Rasm yo&apos;q</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={() => handleDeleteOrder(editOrder.id)}>
                <Trash2 size={16} /> O&apos;chirish
              </button>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => handleDownloadPDF(editOrder)} disabled={pdfLoading}>
                  <Download size={16} /> {pdfLoading ? 'Kutilmoqda...' : 'Smeta PDF'}
                </button>
                <button className="btn btn-primary" onClick={handleSaveEdits}>
                  <Save size={16} /> Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
