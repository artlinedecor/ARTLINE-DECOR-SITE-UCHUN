'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Lock, MapPin, Phone, Send } from 'lucide-react';

const YoutubeIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const InstagramIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const NAV_LINKS = [
  { href: '#trust', label: 'Texnologiya' },
  { href: '#facade', label: 'Fasad' },
  { href: '#calculator', label: 'Bepul hisob-kitob' },
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      {/* Top Bar */}
      <div style={{
        background: '#05070f',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8rem',
        color: '#a0aec0',
        padding: scrolled ? '0px' : '8px 0',
        maxHeight: scrolled ? '0px' : '40px',
        opacity: scrolled ? 0 : 1,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: 'var(--accent-gold)' }} />
              <span>Showroom: Toshkent sh., Yashnabod tumani, Iqbol ko'chasi — </span>
              <a href="https://yandex.uz/maps/org/artlinedecor/138602828044/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>
                Xaritada ko'rish
              </a>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} style={{ color: 'var(--accent-gold)' }} />
              <a href="tel:+998991020200" style={{ color: '#fff' }}>+998 99 102 02 00</a>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="https://t.me/Art_linedecor" target="_blank" rel="noopener noreferrer" style={{ color: '#a0aec0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
              <Send size={13} />
            </a>
            <a href="https://www.instagram.com/artlinedecor.uz?igsh=MWR4c2JoaGtobTl1Nw==" target="_blank" rel="noopener noreferrer" style={{ color: '#a0aec0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
              <InstagramIcon size={13} />
            </a>
            <a href="https://www.youtube.com/@art.linedecor" target="_blank" rel="noopener noreferrer" style={{ color: '#a0aec0', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#a0aec0'}>
              <YoutubeIcon size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" style={{
        position: 'static',
        padding: scrolled ? '10px 0' : '16px 0',
        borderBottomColor: scrolled ? 'var(--border-gold)' : 'var(--border)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="container navbar-inner">
          <a
            href="#hero"
            className="navbar-logo"
            style={{ display: 'flex', alignItems: 'center', gap: 12, perspective: '600px' }}
            onMouseEnter={e => {
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transform = 'rotateY(28deg) scale(1.08)';
                img.style.filter = 'drop-shadow(0 6px 16px rgba(224,168,120,0.55))';
              }
            }}
            onMouseLeave={e => {
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transform = '';
                img.style.filter = '';
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="Artline Decor Logo"
              width={48}
              height={48}
              style={{ objectFit: 'contain', transition: 'transform 0.4s ease, filter 0.4s ease', transformStyle: 'preserve-3d' }}
            />
            <span>ARTLINE DECOR</span>
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
            <li style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 16 }}>
              <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Katalog (PDF)
              </a>
              <a href="/dashboard" title="Admin Dashboard" style={{
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }} onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }} onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}>
                <Lock size={14} />
              </a>
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
            <div style={{ display: 'flex', gap: 12, padding: '12px 16px', alignItems: 'center' }}>
              <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                Katalog (PDF)
              </a>
              <a href="/dashboard" title="Admin Dashboard" style={{
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <Lock size={14} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
