'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, DollarSign, History, LogOut, Home, Ruler, PieChart, Package, Film, Briefcase, Settings } from 'lucide-react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

const NAV_ITEMS = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Kanban Board' },
  { href: '/dashboard/zamer', icon: <Ruler size={18} />, label: 'Zamer & Smeta' },
  { href: '/dashboard/pricing', icon: <DollarSign size={18} />, label: 'Narxlar' },
  { href: '/dashboard/portfolio', icon: <Briefcase size={18} />, label: 'Portfolio' },
  { href: '/dashboard/videos', icon: <Film size={18} />, label: 'Videolar' },
  { href: '/dashboard/analytics', icon: <PieChart size={18} />, label: 'Analitika' },
  { href: '/dashboard/inventory', icon: <Package size={18} />, label: 'Omborxona' },
  { href: '/dashboard/history', icon: <History size={18} />, label: 'Tarix' },
  { href: '/dashboard/integrations', icon: <Settings size={18} />, label: 'Integratsiyalar' },
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
        {/* Logo */}
        <div style={{ padding: '8px 12px', marginBottom: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-glow)', border: '1px solid var(--border-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <Image src="/logo.png" alt="Logo" width={30} height={30} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)', lineHeight: 1.1 }}>
                ARTLINE
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-warm)', lineHeight: 1.1 }}>
                DECOR
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: 2, marginTop: 4 }}>
            Admin Panel
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '4px 12px 12px' }} />

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

        <div style={{ height: 1, background: 'var(--border)', margin: '4px 12px 12px' }} />

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
