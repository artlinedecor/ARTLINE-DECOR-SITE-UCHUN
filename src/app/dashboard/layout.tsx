'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, DollarSign, History, LogOut, Home, Ruler, PieChart, Package, Film, Briefcase, Settings, Users } from 'lucide-react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Kanban Board' },
  { href: '/dashboard/zamer', icon: <Ruler size={18} />, label: 'Zamer & Smeta' },
  { href: '/dashboard/pricing', icon: <DollarSign size={18} />, label: 'Narxlar' },
  { href: '/dashboard/analytics', icon: <PieChart size={18} />, label: 'Analitika' },
  { href: '/dashboard/inventory', icon: <Package size={18} />, label: 'Omborxona' },
  { href: '/dashboard/hr', icon: <Users size={18} />, label: 'Kadrlar & Oylik' },
  { href: '/dashboard/history', icon: <History size={18} />, label: 'Tarix' },
  { href: '/dashboard/settings', icon: <Settings size={18} />, label: 'Sozlamalar' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (pathname === '/dashboard/login') {
      setReady(true);
      return;
    }

    // Set page title for all CRM/ERP routes
    document.title = 'ERP va CRM ARTLINE DECOR';

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        if (cancelled) return;
        if (!session.authenticated) {
          router.push('/dashboard/login');
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) router.push('/dashboard/login');
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) return null;
  if (pathname === '/dashboard/login') return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
    router.refresh();
  };

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        {/* Brand Logo & Name */}
        <div style={{ padding: '8px 12px', marginBottom: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0 6px 0',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(217,154,108,0.2) 0%, rgba(178,114,69,0.05) 100%)',
              border: '1px solid rgba(217,154,108,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(217,154,108,0.15)'
            }}>
              <Image src="/logo.png" alt="Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                ARTLINE
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-warm)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                DECOR
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '0.66rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            paddingLeft: 2,
            marginTop: 6,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.85
          }}>
            ERP & CRM SYSTEM
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--border) 0%, transparent 100%)', margin: '4px 12px 14px' }} />

        {NAV_ITEMS.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={`dash-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            {item.icon} {item.label}
          </a>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--border) 0%, transparent 100%)', margin: '4px 12px 12px' }} />

        <a href="/" className="dash-nav-item">
          <Home size={18} /> Saytga o&apos;tish
        </a>
        <button className="dash-nav-item" onClick={handleLogout} style={{ color: 'var(--error)' }}>
          <LogOut size={18} /> Chiqish
        </button>
      </aside>

      <main className="dash-main">
        {children}
        <Toaster position="top-right" />
      </main>
    </div>
  );
}
