"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const monthlyRevenue = [
  { name: 'Yanvar', revenue: 15000 * 12650 },
  { name: 'Fevral', revenue: 18000 * 12650 },
  { name: 'Mart', revenue: 25000 * 12650 },
  { name: 'Aprel', revenue: 22000 * 12650 },
  { name: 'May', revenue: 30000 * 12650 },
  { name: 'Iyun', revenue: 35000 * 12650 },
];

const elementsSold = [
  { name: 'Karniz', value: 400 },
  { name: 'Ustun', value: 300 },
  { name: 'Molding', value: 300 },
  { name: 'Rustik', value: 200 },
];

const COLORS = ['#D4AF37', '#ffffff', '#888888', '#444444'];

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dash-header">
        <div>
          <h1>Analitika</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Biznesning umumiy ko'rsatkichlari va savdo statistikasi.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">Umumiy Daromad (Yil bo'yicha)</div>
          <div className="stat-value">1 834 250 000 so&apos;m</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bajarilgan Loyihalar</div>
          <div className="stat-value">124</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">O'rtacha Chek</div>
          <div className="stat-value">14 787 850 so&apos;m</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '16px' }}>
        {/* Revenue Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#fff', fontFamily: 'var(--font-heading)' }}>Oylik Daromad (so&apos;m)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: '#fff' }}
                  itemStyle={{ color: 'var(--accent-gold)' }}
                />
                <Bar dataKey="revenue" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elements Pie Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', color: '#fff', fontFamily: 'var(--font-heading)' }}>Eng Ko'p Sotilgan Elementlar</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={elementsSold}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {elementsSold.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
