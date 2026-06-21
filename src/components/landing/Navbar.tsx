'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X, Lock, MapPin, Phone, ChevronDown, FileText, Presentation } from 'lucide-react';
import { useT, type Lang } from '@/lib/i18n';

const NAV_LINKS = [
  { href: '#trust', key: 'nav.tech' },
  { href: '#facade', key: 'nav.facade' },
  { href: '#calculator', key: 'nav.callback' },
  { href: '#portfolio', key: 'nav.portfolio' },
  { href: '#contact', key: 'nav.contact' },
];

const CATALOGS = [
  { href: '/ARTLINE_DECOR_Architectural_Catalog.pdf', key: 'nav.cat.arch', meta: 'PDF · 14 MB', icon: <FileText size={18} /> },
  { href: '/ARTLINE_DECOR_Catalog.pptx', key: 'nav.cat.main', meta: 'PPTX · 24 MB', icon: <Presentation size={18} /> },
];

const SOCIALS: { href: string; label: string; svg: React.ReactNode }[] = [
  {
    href: 'https://t.me/Art_linedecor', label: 'Telegram',
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>,
  },
  {
    href: 'https://www.instagram.com/artlinedecor.uz?igsh=MWR4c2JoaGtobTl1Nw==', label: 'Instagram',
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  },
  {
    href: 'https://www.youtube.com/@art.linedecor', label: 'YouTube',
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9"/></svg>,
  },
  {
    href: 'https://wa.me/998991020200', label: 'WhatsApp',
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.15-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.306 1.266.489 1.699.626.714.226 1.363.194 1.876.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>,
  },
];

export default function Navbar() {
  const { t, lang, setLang } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLLIElement>(null);

  const LangSwitch = () => (
    <div role="group" aria-label="Language" style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px', borderRadius: '100px',
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(217,154,108,0.18)',
      gap: '2px',
    }}>
      {(['uz', 'ru'] as Lang[]).map(l => {
        const active = lang === l;
        return (
          <button key={l} type="button" onClick={() => setLang(l)}
            style={{
              padding: '4px 10px', borderRadius: '100px', cursor: 'pointer',
              background: active ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))' : 'transparent',
              color: active ? '#0a0a0a' : '#a0aec0',
              border: 'none', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.04em', transition: 'all 0.2s ease',
            }}>
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );

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
              <span>{t('top.showroom')} </span>
              <a href="https://yandex.uz/maps/org/artlinedecor/138602828044/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>{t('top.map')}</a>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} style={{ color: 'var(--accent-gold)' }} />
              <a href="tel:+998991020200" style={{ color: '#fff' }}>+998 99 102 02 00</a>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('top.hours')} <span style={{ color: '#fff' }}>09:00 — 19:00</span></span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{
                    color: '#a0aec0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-warm)'; e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.background = 'rgba(217,154,108,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#a0aec0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
            <LangSwitch />
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
                  {t(link.key)}
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
                {t('nav.catalogs')}
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
                        <div style={{ fontWeight: 600 }}>{t(c.key)}</div>
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
                {t(link.key)}
              </a>
            ))}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', marginTop: 8, display: 'flex', justifyContent: 'center' }}>
              <LangSwitch />
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('nav.catalogs')}</div>
              {CATALOGS.map(c => (
                <a key={c.href} href={c.href} download target="_blank" rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--accent-gold)' }}>{c.icon}</span>
                  <span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t(c.key)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{c.meta}</div>
                  </span>
                </a>
              ))}
              <a href="/dashboard" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 12, padding: '8px 14px', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.82rem' }}>
                <Lock size={13} /> {t('nav.dashboard')}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
