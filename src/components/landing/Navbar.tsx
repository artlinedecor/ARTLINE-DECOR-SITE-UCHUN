'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#trust', label: 'Texnologiya' },
  { href: '#facade', label: 'Fasad' },
  { href: '#calculator', label: 'Kalkulyator' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Aloqa' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" style={{
      padding: scrolled ? '10px 0' : '16px 0',
      borderBottomColor: scrolled ? 'var(--border-gold)' : 'var(--border)',
      background: '#000'
    }}>
      <div className="container navbar-inner">
        <a href="#hero" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/logo.png" alt="Artline Decor Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
          <span>ARTLINE DECOR</span>
        </a>

        <ul className="navbar-links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 16 }}>
            <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download className="btn btn-outline btn-sm">
              Katalog (PDF)
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm">Dashboard</a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: 'var(--text-primary)', cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
          padding: 16,
        }}>
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px 16px', color: 'var(--text-secondary)' }}>
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 12, padding: '12px 16px' }}>
            <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>
              Katalog (PDF)
            </a>
            <a href="/dashboard" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
              Dashboard
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
