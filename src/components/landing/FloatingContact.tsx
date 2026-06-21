'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Send, X, MessageCircle } from 'lucide-react';

const PHONE = '998991020200';
const WA_TEXT = encodeURIComponent("Assalomu alaykum! Fasad / termo-panel bo'yicha ma'lumot va narx olmoqchiman.");

const ACTIONS = [
  {
    label: 'WhatsApp',
    href: `https://wa.me/${PHONE}?text=${WA_TEXT}`,
    bg: '#25D366',
    icon: <MessageCircle size={22} />,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/Art_linedecor',
    bg: '#229ED9',
    icon: <Send size={20} />,
  },
  {
    label: "Qo'ng'iroq",
    href: `tel:+${PHONE}`,
    bg: '#d99a6c',
    icon: <Phone size={20} />,
  },
];

export default function FloatingContact() {
  // Kontaktlar ko'rinib tursin — standart holatda ochiq (bizni topish oson bo'lsin)
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 14,
      }}
    >
      <AnimatePresence>
        {open &&
          ACTIONS.map((a, i) => (
            <motion.a
              key={a.label}
              href={a.href}
              target={a.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={a.label}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: a.bg,
                color: '#fff',
                padding: '11px 18px 11px 16px',
                borderRadius: 100,
                fontSize: '0.92rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                textDecoration: 'none',
              }}
            >
              {a.icon}
              {a.label}
            </motion.a>
          ))}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Yopish' : "Biz bilan bog'lanish"}
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'relative',
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: open ? '#1a1f2e' : '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Pulsing ring (only when closed) */}
        {!open && (
          <motion.span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #25D366',
            }}
            animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.span
          key={open ? 'x' : 'chat'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          style={{ display: 'flex' }}
        >
          {open ? <X size={26} /> : <MessageCircle size={28} />}
        </motion.span>
      </motion.button>
    </div>
  );
}
