'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { calculateDashboardStats } from '@/lib/stats';
import { fetchOrdersClient, deleteOrderClient } from '@/lib/orders-sync';
import toast from 'react-hot-toast';

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  new: { label: 'Yangi', badge: 'badge-info' },
  measurement: { label: 'Zamer', badge: 'badge-warning' },
  design: { label: 'Dizayn', badge: 'badge-gold' },
  sold: { label: 'Sotildi', badge: 'badge-success' },
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const loadOrders = async () => {
    const data = await fetchOrdersClient();
    setOrders(data);
  };

  useEffect(() => { void loadOrders(); }, []);

  const stats = calculateDashboardStats(orders);
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleDelete = async (id: string) => {
    if (confirm('Bu buyurtmani o\'chirmoqchimisiz?')) {
      await deleteOrderClient(id);
      await loadOrders();
      toast.success("Buyurtma o'chirildi!");
    }
  };

  return (
    <>
      <div className="dash-header">
        <h1>Buyurtmalar Tarixi</h1>
        <span className="badge badge-gold">{orders.length} ta buyurtma</span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Umumiy savdo</div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString()} so&apos;m</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">O&apos;rtacha chek</div>
          <div className="stat-value">{Math.round(stats.averageCheck).toLocaleString()} so&apos;m</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sotilgan</div>
          <div className="stat-value">{stats.statusCounts.sold}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Jarayonda</div>
          <div className="stat-value">{stats.statusCounts.measurement + stats.statusCounts.design}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'new', 'measurement', 'design', 'sold'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}>
            {s === 'all' ? 'Barchasi' : STATUS_LABELS[s].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mijoz</th>
              <th>Telefon</th>
              <th>Manzil</th>
              <th>Summa</th>
              <th>Status</th>
              <th>Sana</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <FileText size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <div>Buyurtmalar topilmadi</div>
                </td>
              </tr>
            ) : (
              filtered.map((order, idx) => (
                <tr key={order.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{order.clientName}</td>
                  <td>{order.phone}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.address || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
                    {order.totalPrice.toLocaleString()} so&apos;m
                  </td>
                  <td>
                    <span className={`badge ${STATUS_LABELS[order.status]?.badge}`}>
                      {STATUS_LABELS[order.status]?.label}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--error)' }}
                      onClick={() => handleDelete(order.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
