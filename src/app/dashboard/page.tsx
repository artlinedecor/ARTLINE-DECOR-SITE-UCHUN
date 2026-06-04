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
import { Plus, GripVertical, Phone, MapPin } from 'lucide-react';
import {
  getOrders,
  saveOrder,
  updateOrderStatus,
  generateId,
  getDashboardStats,
} from '@/lib/store';
import type { Order, OrderStatus } from '@/lib/types';

const COLUMNS: { id: OrderStatus; title: string; color: string }[] = [
  { id: 'new',         title: '🆕 Yangi',   color: 'var(--info)' },
  { id: 'measurement', title: '📐 Zamer',   color: 'var(--warning)' },
  { id: 'design',      title: '🎨 Dizayn',  color: 'var(--accent-gold)' },
  { id: 'sold',        title: '✅ Sotildi', color: 'var(--success)' },
];

/* ---- Draggable card ---- */
function SortableCard({ order }: { order: Order }) {
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
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="kanban-card-name">{order.clientName}</div>
        <div {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', touchAction: 'none' }}>
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
      <div className="kanban-card-price">${order.totalPrice.toLocaleString()}</div>
      <div className="kanban-card-date">
        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
      </div>
    </div>
  );
}

/* ---- Droppable column wrapper ---- */
function DroppableColumn({
  col, orders, isOver,
}: {
  col: { id: OrderStatus; title: string; color: string };
  orders: Order[];
  isOver: boolean;
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
            <SortableCard key={order.id} order={order} />
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const loadOrders = useCallback(() => setOrders(getOrders()), []);
  useEffect(() => { loadOrders(); }, [loadOrders]);

  const stats = getDashboardStats();

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    setOverId(e.over?.id as string ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
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
      updateOrderStatus(activeOrderId, targetColumn.id);
      loadOrders();
      return;
    }

    // Dropped on a card — move to that card's column
    const targetOrder = orders.find(o => o.id === overId);
    if (targetOrder) {
      notifyTelegram(activeOrderId, targetOrder.status);
      updateOrderStatus(activeOrderId, targetOrder.status);
      loadOrders();
    }
  };

  const handleAddOrder = () => {
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
    saveOrder(order);
    loadOrders();
    setShowModal(false);
    setNewOrder({ clientName: '', phone: '', address: '', totalPrice: 0 });

    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    }).catch(() => {});
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
              <div className="kanban-card-price">${activeOrder.totalPrice.toLocaleString()}</div>
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
                <label>Buyurtma summasi ($)</label>
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
    </>
  );
}
