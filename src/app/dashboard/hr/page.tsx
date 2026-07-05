"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, RefreshCw, DollarSign, Calendar, Clock, Award, Trash2, ArrowDownLeft, ShieldAlert, TrendingUp, TrendingDown, FileText, CheckCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Employee, AdvancePayment, WorkLog, Order } from '@/lib/types';

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<'employees' | 'worklogs' | 'advances' | 'payroll'>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [advances, setAdvances] = useState<AdvancePayment[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [soldOrders, setSoldOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  // Form States
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ishchi', salaryType: 'fixed' as 'fixed' | 'piece' | 'kpi', rate: 4000000, kpiPercent: 0, active: true });
  const [newLog, setNewLog] = useState({ employeeId: '', hoursOrPieces: 0, description: '' });
  const [newAdv, setNewAdv] = useState({ employeeId: '', amount: 0, notes: '', type: 'advance' as 'advance' | 'bonus' | 'penalty' });

  // Load All HR Data
  const loadHRData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hr');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees || []);
        setAdvances(data.advances || []);
        setWorkLogs(data.workLogs || []);
        setSoldOrders(data.orders || []);
      }
    } catch {
      toast.error("Xodimlar ma'lumotlarini yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHRData();
  }, []);

  // Save Employee
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || newEmp.rate <= 0) {
      toast.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring!");
      return;
    }

    try {
      const employee: Employee = {
        id: 'emp_' + Math.random().toString(36).substring(2, 9),
        ...newEmp
      };

      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_employee', employee })
      });

      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
        setShowEmployeeModal(false);
        setNewEmp({ name: '', role: 'Ishchi', salaryType: 'fixed', rate: 4000000, kpiPercent: 0, active: true });
        toast.success("Xodim muvaffaqiyatli qo'shildi!");
      }
    } catch {
      toast.error("Saqlashda xatolik!");
    }
  };

  // Add Daily Work Log
  const handleAddWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.employeeId || newLog.hoursOrPieces <= 0) {
      toast.error("Xodim va bajarilgan hajmni kiriting!");
      return;
    }

    try {
      const workLog: WorkLog = {
        id: 'wl_' + Math.random().toString(36).substring(2, 9),
        ...newLog,
        date: new Date().toISOString()
      };

      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_worklog', workLog })
      });

      const data = await res.json();
      if (data.success) {
        setWorkLogs(data.workLogs);
        setShowWorkLogModal(false);
        setNewLog({ employeeId: '', hoursOrPieces: 0, description: '' });
        toast.success("Ish kuni/vazifasi muvaffaqiyatli qayd etildi!");
      }
    } catch {
      toast.error("Qayd etishda xatolik!");
    }
  };

  // Add Financial Action (Advance, Bonus, Penalty)
  const handleAddAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdv.employeeId || newAdv.amount <= 0) {
      toast.error("Xodim va summani kiriting!");
      return;
    }

    try {
      const advance: AdvancePayment = {
        id: 'adv_' + Math.random().toString(36).substring(2, 9),
        ...newAdv,
        date: new Date().toISOString()
      };

      const res = await fetch('/api/hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_advance', advance })
      });

      const data = await res.json();
      if (data.success) {
        setAdvances(data.advances);
        setShowAdvanceModal(false);
        setNewAdv({ employeeId: '', amount: 0, notes: '', type: 'advance' });
        
        const label = newAdv.type === 'bonus' ? 'Bonus' : newAdv.type === 'penalty' ? 'Jarima' : 'Avans';
        toast.success(`${label} muvaffaqiyatli saqlandi!`);
      }
    } catch {
      toast.error("Saqlashda xatolik!");
    }
  };

  // Delete Action Helpers
  const handleDeleteItem = async (id: string, action: 'delete_employee' | 'delete_advance' | 'delete_worklog') => {
    if (!window.confirm("Ushbu ma'lumotni butunlay o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/hr?action=${action}&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (action === 'delete_employee') setEmployees(data.employees);
        if (action === 'delete_advance') setAdvances(data.advances);
        if (action === 'delete_worklog') setWorkLogs(data.workLogs);
        toast.success("Muvaffaqiyatli o'chirildi!");
      }
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  // Payroll Calculation Engine
  const calculatePayroll = () => {
    // Current month sales total for KPI managers
    const totalSales = soldOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    return employees.map(emp => {
      let earned = 0;
      let breakdown = "";

      // 1. Calculate Gross Earnings based on salary type
      if (emp.salaryType === 'fixed') {
        earned = emp.rate;
        breakdown = "Oylik o'zgarmas maosh";
      } else if (emp.salaryType === 'piece') {
        const empLogs = workLogs.filter(wl => wl.employeeId === emp.id);
        const totalPieces = empLogs.reduce((sum, log) => sum + log.hoursOrPieces, 0);
        earned = totalPieces * emp.rate;
        breakdown = `Ishbay: ${totalPieces} dona × ${emp.rate.toLocaleString()} so'm`;
      } else if (emp.salaryType === 'kpi') {
        const commission = (totalSales * emp.kpiPercent) / 100;
        earned = emp.rate + commission;
        breakdown = `Savdo foizi (${emp.kpiPercent}%): ${commission.toLocaleString()} so'm + stavka`;
      }

      // 2. Sum up Advances, Bonuses, and Penalties
      const empFinances = advances.filter(a => a.employeeId === emp.id);
      
      const totalAdvances = empFinances
        .filter(a => !a.type || a.type === 'advance')
        .reduce((sum, a) => sum + a.amount, 0);

      const totalBonuses = empFinances
        .filter(a => a.type === 'bonus')
        .reduce((sum, a) => sum + a.amount, 0);

      const totalPenalties = empFinances
        .filter(a => a.type === 'penalty')
        .reduce((sum, a) => sum + a.amount, 0);

      // 3. Final Net Pay Calculation
      // Net Pay = Gross Earnings + Bonuses - Penalties - Advances
      const netPay = Math.max(0, earned + totalBonuses - totalPenalties - totalAdvances);

      return {
        ...emp,
        grossEarnings: earned,
        breakdown,
        totalAdvances,
        totalBonuses,
        totalPenalties,
        netPay
      };
    });
  };

  const calculatedPayrollList = calculatePayroll();

  // Search filter
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* CSS overrides for print */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, .dash-header, .tab-container, .btn, .search-box {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .glass-card {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          table th, table td {
            border: 1px solid #000 !important;
            color: #000 !important;
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={28} style={{ color: 'var(--accent-gold)' }} />
            Kadrlar va Oylik maoshlar
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Xodimlar bazasi, kunlik ish hisobi, avans, bonus va jarimalar hamda oylik maoshlar hisoboti.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }} className="no-print">
          {activeTab === 'payroll' && (
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Chop etish
            </button>
          )}
          {activeTab === 'employees' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowEmployeeModal(true)}>
              <Plus size={14} /> Yangi Xodim
            </button>
          )}
          {activeTab === 'worklogs' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowWorkLogModal(true)}>
              <Plus size={14} /> Ish qayd etish
            </button>
          )}
          {activeTab === 'advances' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdvanceModal(true)}>
              <Plus size={14} /> Moliya (Avans/Bonus/Jarima)
            </button>
          )}
        </div>
      </div>

      {/* Print only header */}
      <div className="print-only" style={{ display: 'none', marginBottom: 20 }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>ARTLINE DECOR — ERP & CRM SYSTEM</h2>
        <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#555' }}>Xodimlar Oylik Maoshlari Hisoboti</h3>
        <p style={{ fontSize: '12px' }}><strong>Chop etilgan sana:</strong> {new Date().toLocaleString('uz-UZ')}</p>
        <hr style={{ border: 'none', borderBottom: '1px solid #ccc', margin: '15px 0' }} />
      </div>

      {/* Tabs */}
      <div className="tab-container" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('employees')}
          className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Users size={16} style={{ marginRight: 8 }} />
          Xodimlar Ro&apos;yxati
        </button>
        <button 
          onClick={() => setActiveTab('worklogs')}
          className={`btn ${activeTab === 'worklogs' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <Clock size={16} style={{ marginRight: 8 }} />
          Ish Kunlari / Ishbay
        </button>
        <button 
          onClick={() => setActiveTab('advances')}
          className={`btn ${activeTab === 'advances' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          <DollarSign size={16} style={{ marginRight: 8 }} />
          Moliya & Avanslar
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`btn ${activeTab === 'payroll' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '0.9rem', color: activeTab === 'payroll' ? '#050811' : 'var(--accent-gold)', borderColor: 'var(--border-gold)' }}
        >
          <Award size={16} style={{ marginRight: 8 }} />
          Maoshlar Hisoboti
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <RefreshCw className="spin" size={32} style={{ color: 'var(--accent-gold)' }} />
        </div>
      ) : (
        <>
          {/* TAB 1: EMPLOYEE LIST */}
          {activeTab === 'employees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Search Bar */}
              <div className="glass-card search-box" style={{ padding: 12, display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="text" 
                    placeholder="Xodim ismi yoki lavozimi bo'yicha qidiruv..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', paddingLeft: 36 }}
                  />
                </div>
              </div>

              <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Xodim Ismi</th>
                        <th>Lavozimi</th>
                        <th>Oylik Turi</th>
                        <th>Stavka / Tarif</th>
                        <th>KPI Komissiya</th>
                        <th>Holat</th>
                        <th>Amal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{emp.role}</td>
                          <td>
                            <span className={`badge ${emp.salaryType === 'fixed' ? 'badge-success' : emp.salaryType === 'piece' ? 'badge-info' : 'badge-gold'}`}>
                              {emp.salaryType === 'fixed' ? "O'zgarmas maosh" : emp.salaryType === 'piece' ? "Ishbay (dona)" : "Savdo komissiyasi"}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {emp.rate.toLocaleString()} so&apos;m
                          </td>
                          <td style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                            {emp.salaryType === 'kpi' ? `${emp.kpiPercent}%` : '—'}
                          </td>
                          <td>
                            <span className={`badge ${emp.active ? 'badge-success' : 'badge-error'}`}>
                              {emp.active ? 'Faol' : 'Nofaol'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--error)' }} onClick={() => handleDeleteItem(emp.id, 'delete_employee')}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Xodimlar topilmadi.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMESHEETS / WORKLOGS */}
          {activeTab === 'worklogs' && (
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Sana</th>
                      <th>Xodim</th>
                      <th>Bajarilgan hajm</th>
                      <th>Tavsif / Eslatma</th>
                      <th>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workLogs.map((log) => {
                      const emp = employees.find(e => e.id === log.employeeId);
                      return (
                        <tr key={log.id}>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {new Date(log.date).toLocaleDateString('uz-UZ')}
                          </td>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{emp?.name || 'Noma\'lum xodim'}</td>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {log.hoursOrPieces} {emp?.salaryType === 'piece' ? 'dona' : 'soat'}
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{log.description}</td>
                          <td>
                            <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--error)' }} onClick={() => handleDeleteItem(log.id, 'delete_worklog')}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {workLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Hali ish hisoboti kiritilmagan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADVANCES, BONUSES & PENALTIES */}
          {activeTab === 'advances' && (
            <div className="glass-card" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Sana</th>
                      <th>Xodim</th>
                      <th>Kategoriya</th>
                      <th style={{ textAlign: 'right' }}>Summa</th>
                      <th>Izoh / Sababi</th>
                      <th>Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advances.map((adv) => {
                      const emp = employees.find(e => e.id === adv.employeeId);
                      const type = adv.type || 'advance';
                      
                      let typeLabel = "Avans";
                      let typeColor = "var(--warning)";
                      let sign = "-";

                      if (type === 'bonus') {
                        typeLabel = "Bonus / Rag'bat";
                        typeColor = "var(--success)";
                        sign = "+";
                      } else if (type === 'penalty') {
                        typeLabel = "Jarima";
                        typeColor = "var(--error)";
                        sign = "-";
                      }

                      return (
                        <tr key={adv.id}>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {new Date(adv.date).toLocaleDateString('uz-UZ')}
                          </td>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{emp?.name || 'Noma\'lum xodim'}</td>
                          <td>
                            <span className="badge" style={{ background: `rgba(255,255,255,0.03)`, color: typeColor, border: `1px solid ${typeColor}`, fontSize: '0.72rem' }}>
                              {typeLabel}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: typeColor }}>
                            {sign}{adv.amount.toLocaleString()} so&apos;m
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{adv.notes}</td>
                          <td>
                            <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--error)' }} onClick={() => handleDeleteItem(adv.id, 'delete_advance')}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {advances.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Moliya tarixi bo&apos;sh.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYROLL REPORT */}
          {activeTab === 'payroll' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Sales Summary Card for KPI info */}
              <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(217, 154, 108, 0.05)', border: '1px solid rgba(217, 154, 108, 0.2)' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Komissiya hisoboti uchun jami sotuvlar</h4>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
                    {soldOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()} so&apos;m
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }} className="no-print">
                  <Calendar size={16} />
                  <span>Joriy oydagi sotuv shartnomalari yakuni</span>
                </div>
              </div>

              {/* Payroll Calculation Table */}
              <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Xodim Ismi</th>
                        <th>Lavozimi</th>
                        <th style={{ textAlign: 'right' }}>Topilgan maosh (Gross)</th>
                        <th style={{ textAlign: 'right', color: 'var(--success)' }}>Bonuslar (+)</th>
                        <th style={{ textAlign: 'right', color: 'var(--error)' }}>Jarimalar (-)</th>
                        <th style={{ textAlign: 'right', color: 'var(--warning)' }}>Olingan avans (-)</th>
                        <th style={{ textAlign: 'right', color: 'var(--accent-gold)' }}>Qoldiq (To&apos;lanadi)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedPayrollList.map((emp) => (
                        <tr key={emp.id}>
                          <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{emp.role}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {emp.grossEarnings.toLocaleString()} so&apos;m
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success)' }}>
                            {emp.totalBonuses > 0 ? `+${emp.totalBonuses.toLocaleString()}` : "0"}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--error)' }}>
                            {emp.totalPenalties > 0 ? `-${emp.totalPenalties.toLocaleString()}` : "0"}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--warning)' }}>
                            {emp.totalAdvances > 0 ? `-${emp.totalAdvances.toLocaleString()}` : "0"}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1.05rem' }}>
                            {emp.netPay.toLocaleString()} so&apos;m
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* MODAL 1: NEW EMPLOYEE */}
      {showEmployeeModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>Yangi Xodim Qo&apos;shish</h2>
              <button onClick={() => setShowEmployeeModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Xodim Ism-Familiyasi *</label>
                <input 
                  type="text" 
                  value={newEmp.name} 
                  onChange={e => setNewEmp(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Masalan: Dilshod Sharipov"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Lavozimi *</label>
                  <input 
                    type="text" 
                    value={newEmp.role} 
                    onChange={e => setNewEmp(prev => ({ ...prev, role: e.target.value }))}
                    className="input-field"
                    placeholder="Masalan: Usta / Menejer"
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Oylik To&apos;lov Turi *</label>
                  <select 
                    value={newEmp.salaryType} 
                    onChange={e => setNewEmp(prev => ({ ...prev, salaryType: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="fixed">O&apos;zgarmas oylik maosh</option>
                    <option value="piece">Ishbay (dona hisobi)</option>
                    <option value="kpi">Menejer komissiyasi (%)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>{newEmp.salaryType === 'piece' ? 'Har bir dona uchun tarif (so\'m) *' : 'Baza oylik stavkasi (so\'m) *'}</label>
                  <input 
                    type="number" 
                    value={newEmp.rate} 
                    onChange={e => setNewEmp(prev => ({ ...prev, rate: +e.target.value }))}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                
                {newEmp.salaryType === 'kpi' && (
                  <div className="input-group">
                    <label>Sotuvdan foiz (%) *</label>
                    <input 
                      type="number" 
                      value={newEmp.kpiPercent} 
                      onChange={e => setNewEmp(prev => ({ ...prev, kpiPercent: +e.target.value }))}
                      className="input-field"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Saqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD WORKLOG */}
      {showWorkLogModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>Ish va bajarilgan hajmni qayd etish</h2>
              <button onClick={() => setShowWorkLogModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleAddWorkLog} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Xodimni tanlang</label>
                <select 
                  value={newLog.employeeId} 
                  onChange={e => setNewLog(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">— Xodimni tanlang —</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>
                  {newLog.employeeId && employees.find(e => e.id === newLog.employeeId)?.salaryType === 'piece' 
                    ? "Tayyorlagan tovarlari soni (dona)" 
                    : "Ishlagan vaqti (soat / kun)"}
                </label>
                <input 
                  type="number" 
                  value={newLog.hoursOrPieces === 0 ? '' : newLog.hoursOrPieces} 
                  onChange={e => setNewLog(prev => ({ ...prev, hoursOrPieces: +e.target.value }))}
                  className="input-field"
                  min="1"
                  required
                />
              </div>

              <div className="input-group">
                <label>Bajarilgan ish tavsifi</label>
                <input 
                  type="text" 
                  value={newLog.description} 
                  onChange={e => setNewLog(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  placeholder="Masalan: 40 ta termo panel quyildi"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Saqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD FINANCIAL TRANSACTION (ADVANCE, BONUS, PENALTY) */}
      {showAdvanceModal && (
        <div className="modal-backdrop">
          <div className="glass-card modal-content" style={{ maxWidth: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem' }}>Moliya & To&apos;lov Kiritish</h2>
              <button onClick={() => setShowAdvanceModal(false)} className="btn btn-ghost" style={{ padding: 4 }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <form onSubmit={handleAddAdvance} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Xodimni tanlang *</label>
                <select 
                  value={newAdv.employeeId} 
                  onChange={e => setNewAdv(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">— Xodimni tanlang —</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Amaliyot Turi *</label>
                  <select 
                    value={newAdv.type} 
                    onChange={e => setNewAdv(prev => ({ ...prev, type: e.target.value as any }))}
                    className="input-field"
                  >
                    <option value="advance">💸 Avans to&apos;lovi</option>
                    <option value="bonus">🎁 Rag&apos;batlantirish / Bonus</option>
                    <option value="penalty">⚠️ Jarima / Chegirib qolish</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Summa (so&apos;m) *</label>
                  <input 
                    type="number" 
                    value={newAdv.amount === 0 ? '' : newAdv.amount} 
                    onChange={e => setNewAdv(prev => ({ ...prev, amount: +e.target.value }))}
                    className="input-field"
                    min="1000"
                    placeholder="Masalan: 500000"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Izoh / Sabab *</label>
                <input 
                  type="text" 
                  value={newAdv.notes} 
                  onChange={e => setNewAdv(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  placeholder="Batafsil sababini yozing..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Amalni Saqlash</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
