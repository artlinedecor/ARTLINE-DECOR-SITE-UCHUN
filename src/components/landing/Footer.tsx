'use client';

import { Phone, MapPin, Clock, Send, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/logo.png" alt="Artline Decor Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
              ARTLINE DECOR
            </div>
            <p className="footer-desc">
              Premial fasad tizimlari — 3-in-1 texnologiyasi: dekor + izolyatsiya + himoya.
              10 yillik kafolat bilan import xomashyodan tayyorlangan mahsulotlar.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              <a href="https://t.me/Art_linedecor" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Send size={14} /> Telegram
              </a>
              <a href="https://www.instagram.com/artlinedecor.uz?igsh=MWR4c2JoaGtobTl1Nw==" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg> Instagram
              </a>
              <a href="https://www.youtube.com/@art.linedecor" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9" fill="currentColor" />
                </svg> YouTube
              </a>
              <a href="https://www.tiktok.com/@art.line.decor?_r=1&_t=ZS-969yPYgAOgh" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-sm" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg> TikTok
              </a>
            </div>
          </div>

          <div>
            <h4>Hujjatlar</h4>
            <ul className="footer-links">
              <li>
                <a href="/ARTLINE_DECOR_Architectural_Catalog.pdf" download style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={14} /> Fasad Katalogi (PDF)
                </a>
              </li>
              <li><a href="#facade">Fasad dekor turlari</a></li>
              <li><a href="#calculator">Bepul smeta hisoblash</a></li>
              <li><a href="#portfolio">Bajarilgan loyihalar</a></li>
            </ul>
          </div>

          <div>
            <h4>Aloqa & Manzil</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--accent-gold)' }} />
                <a href="https://yandex.uz/maps/org/artlinedecor/138602828044/?ll=69.414157,41.308519&mode=search&sctx=ZAAAAAgBEAAaKAoSCTWaXIyBWlFAEemY84x9p0RAEhIJ2exI9Z1fhD8R%2Bs%2BaH39pcT8iBgABAgMEBSgKOABA31BIAWoCdXqdAc3MzD2gAQCoAQC9AWs7gGLCAQaMov2qhASCAgxBcnRsaW5lRGVjb3KKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=69.414157,41.308519&sspn=0.039793,0.017003&text=ArtlineDecor&utm_source=share&z=15" 
                   target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                  Toshkent sh., Yakkasaroy tumani (Yandex Xarita)
                </a>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
                <a href="tel:+998901234567" style={{ color: 'var(--text-primary)' }}>+998 90 123 45 67</a>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Clock size={16} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
                <span>Dush-Shan: 09:00 — 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Artline Decor. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
