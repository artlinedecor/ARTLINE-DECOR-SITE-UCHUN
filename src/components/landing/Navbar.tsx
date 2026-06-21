'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, Lock, MapPin, Phone, ChevronDown, FileText, Presentation } from 'lucide-react';

const NAV_LINKS = [
  { href: '#trust', label: 'Texnologiya' },
  { href: '#facade', label: 'Fasad' },
  { href: '#calculator', label: 'Qayta aloqa' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#contact', label: 'Aloqa' },
];

const CATALOGS = [
  { href: '/ARTLINE_DECOR_Architectural_Catalog.pdf', label: 'Arxitektura katalogi', meta: 'PDF · 14 MB', icon: <FileText size={18} /> },
  { href: '/ARTLINE_DECOR_Catalog.pptx', label: 'Asosiy katalog (slaydlar)', meta: 'PPTX · 24 MB', icon: <Presentation size={18} /> },
  { href: '/ARTLINE_Termopanel_Presentation.pptx', label: 'Termopanel taqdimoti', meta: 'PPTX · 1 MB', icon: <Presentation size={18} /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, transition: 'all 0.3s ease' }}>
      {/* Top Bar */}
      <div style={{
        background: '#05070f', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8rem', color: '#a0aec0',
        padding: scrolled ? '0px' : '8px 0', maxHeight: scrolled ? '0px' : '40px',
        opacity: scrolled ? 0 : 1, overflow: 'hidden', transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: 'var(--accent-gold)' }} />
              <span>Showroom: Toshkent sh., Yashnabod tumani, Iqbol ko'chasi — </span>
              <a href="https://yandex.uz/maps/org/artlinedecor/138602828044/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Xaritada ko'rish</a>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} style={{ color: 'var(--accent-gold)' }} />
              <a href="tel:+998991020200" style={{ color: '#fff' }}>+998 99 102 02 00</a>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ish vaqti: <span style={{ color: '#fff' }}>09:00 — 19:00</span></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" style={{
        position: 'relative',
        padding: scrolled ? '8px 0' : '14px 0',
        borderBottomColor: scrolled ? 'var(--border-gold)' : 'var(--border)',
        background: scrolled ? 'rgba(5,8,17,0.85)' : 'rgba(10,10,15,0.55)',
        backdropFilter: 'blur(24px) saturate(140%)',
      }}>
        {/* Gold accent bar */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(217,154,108,0.5), transparent)',
          opacity: scrolled ? 1 : 0.35, transition: 'opacity 0.3s ease', pointerEvents: 'none',
        }} />

        <div className="container navbar-inner">
          <a href="#hero" className="navbar-logo" aria-label="Artline Decor">
            <Image
              src="/logo.png"
              alt="Artline Decor"
              width={scrolled ? 56 : 68}
              height={scrolled ? 56 : 68}
              priority
              style={{ objectFit: 'contain', transition: 'width 0.3s ease, height 0.3s ease' }}
            />
          </a>

          <ul className="navbar-links">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === '#calculator') {
                      e.preventDefault();
                      (window as any).openEstimateModal?.();
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="cat-dropdown" ref={catRef}>
              <button
                type="button"
                className="cat-trigger"
                onClick={() => setCatOpen(v => !v)}
                aria-expanded={catOpen}
                aria-haspopup="true"
              >
                Kataloglar
                <ChevronDown size={14} style={{ transform: catOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease' }} />
              </button>
              {catOpen && (
                <div className="cat-menu" role="menu">
                  {CATALOGS.map(c => (
                    <a
                      key={c.href}
                      href={c.href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cat-item"
                      onClick={() => setCatOpen(false)}
                    >
                      <span style={{ color: 'var(--accent-gold)', display: 'flex' }}>{c.icon}</span>
                      <span>
                        <div style={{ fontWeight: 600 }}>{c.label}</div>
                        <div className="cat-item-meta">{c.meta}</div>
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </li>
            <li>
              <a href="/dashboard" title="Admin Dashboard" style={{
                color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <Lock size={14} />
              </a>
            </li>
          </ul>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(5,8,17,0.97)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-gold)', padding: 16,
          }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (link.href === '#calculator') {
                    e.preventDefault();
                    (window as any).openEstimateModal?.();
                  }
                }}
                style={{ display: 'block', padding: '12px 16px', color: 'var(--text-secondary)' }}>
                {link.label}
              </a>
            ))}
            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Kataloglar</div>
              {CATALOGS.map(c => (
                <a key={c.href} href={c.href} download target="_blank" rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent-gold)' }}>{c.icon}</span>
                  <span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{c.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{c.meta}</div>
                  </span>
                </a>
              ))}
              <a href="/dashboard" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 12, padding: '8px 14px', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.82rem' }}>
                <Lock size={13} /> Dashboard
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
