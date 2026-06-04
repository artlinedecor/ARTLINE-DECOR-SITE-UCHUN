"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrders } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { Package, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import Image from 'next/image';

const STATUS_STEPS: { id: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { id: 'new', label: 'Yangi buyurtma', icon: <Package size={20} /> },
  { id: 'measurement', label: 'O\'lchov (Zamer)', icon: <Clock size={20} /> },
  { id: 'design', label: 'Dizayn', icon: <Truck size={20} /> },
  { id: 'sold', label: 'O\'rnatish', icon: <CheckCircle size={20} /> },
];

export default function ClientPortal() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const orders = getOrders();
      const found = orders.find(o => o.id === id);
      if (found) setOrder(found);
    }
  }, [id]);

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--error)', marginBottom: '8px' }}>Buyurtma topilmadi</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tekshirib qaytadan urinib ko'ring.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'var(--accent-glow)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/logo.png" alt="Logo" width={20} height={20} style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
              ARTLINE DECOR
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>Mijoz Portali</div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '48px', paddingBottom: '48px', maxWidth: '800px' }}>
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '32px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '8px' }}>Buyurtma Holati</h1>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>ID: {order.id}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Sana: {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
              </div>
            </div>

            {/* Stepper */}
            <div style={{ position: 'relative', marginTop: '48px', marginBottom: '32px' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', background: 'var(--border)', transform: 'translateY(-50%)', borderRadius: '2px' }} />
              <div 
                style={{ 
                  position: 'absolute', top: '50%', left: 0, height: '4px', background: 'var(--accent-gold)', 
                  transform: 'translateY(-50%)', borderRadius: '2px', transition: 'width 0.5s ease',
                  width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` 
                }}
              />
              
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                {STATUS_STEPS.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  return (
                    <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                        style={{
                          width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '4px solid var(--bg-tertiary)', position: 'relative', zIndex: 10, transition: 'var(--transition)',
                          background: isActive ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                          color: isActive ? '#000' : 'var(--text-muted)'
                        }}
                      >
                        {step.icon}
                      </div>
                      <span style={{
                        fontSize: '0.8rem', marginTop: '12px', fontFamily: 'var(--font-body)', fontWeight: 500, textAlign: 'center',
                        position: 'absolute', top: '44px', width: '90px',
                        color: isActive ? '#fff' : 'var(--text-muted)'
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ height: '40px' }} /> {/* Spacer */}
          </div>

          <div style={{ padding: '32px', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '24px' }}>Mijoz Ma'lumotlari</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Ism</div>
                <div style={{ color: '#fff', fontWeight: 500 }}>{order.clientName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Telefon</div>
                <div style={{ color: '#fff', fontWeight: 500 }}>{order.phone}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Manzil</div>
                <div style={{ color: '#fff', fontWeight: 500 }}>{order.address}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>Umumiy Summa</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-gold)', fontFamily: 'var(--font-heading)' }}>${order.totalPrice.toFixed(2)}</div>
              </div>
              <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} />
                Smetani PDF yuklab olish
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
