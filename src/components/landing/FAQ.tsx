"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import TiltCard from '@/components/effects/TiltCard';

const faqs = [
  {
    question: "Fasad panellari yomg'ir va qorga chidamlimi?",
    answer: "Ha, bizning panellarimiz maxsus himoya qatlami bilan qoplangan bo'lib, har qanday ob-havo sharoitlariga, jumladan qor, yomg'ir va kuchli sovuqqa bardoshli. Namlikni o'ziga tortmaydi va shaklini yo'qotmaydi."
  },
  {
    question: "O'rnatish jarayoni qancha vaqt oladi?",
    answer: "Obyektning o'lchamiga qarab, o'rtacha hovli uylar (200-300 kv.m) uchun o'rnatish jarayoni 5 kundan 10 kungacha davom etadi. Panellar tayyor holda kelgani uchun jarayon juda tez kechadi."
  },
  {
    question: "Suvoqsiz g'isht ustiga to'g'ridan-to'g'ri o'rnatsa bo'ladimi?",
    answer: "Albatta! Bizning texnologiyamizning eng katta afzalligi ham shunda. Siz uyni suvoq qilishingiz shart emas. Panellarimiz to'g'ridan-to'g'ri g'isht yoki beton ustiga qotiriladi, bu esa vaqt va mablag'ingizni tejaydi."
  },
  {
    question: "Panellar uyning issiqlikni saqlashiga yordam beradimi?",
    answer: "Ha, Artline Decor panellari yuqori zichlikdagi penoplast asosiga ega bo'lib, ular mukammal issiqlik izolyatsiyasini ta'minlaydi. Qishda issiqni, yozda salqinni saqlab, energiya sarfini kamaytiradi."
  },
  {
    question: "Kafolat muddati qancha?",
    answer: "Biz o'z mahsulotlarimiz sifatiga 100% ishonamiz, shuning uchun panellarga va ularning rangi o'zgarmasligiga 10 yillik rasmiy kafolat beramiz."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section" style={{ background: '#0A0A0A', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Ko'p Beriladigan <span style={{ color: 'rgba(255,255,255,0.4)' }}>Savollar</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Mijozlarimiz tomonidan eng ko'p beriladigan savollarga javoblar. Agar sizning savolingiz ro'yxatda bo'lmasa, biz bilan bog'laning.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
            <TiltCard
              className="faq-tilt"
              max={4}
              scale={1.01}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.02)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                style={{
                  width: '100%', textAlign: 'left', padding: '20px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                  fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-body)'
                }}
              >
                <span style={{ paddingRight: '32px' }}>{faq.question}</span>
                <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {openIndex === index ? <Minus size={24} /> : <Plus size={24} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{
                      padding: '0 24px 24px 24px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: '16px'
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
