"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import TiltCard from '@/components/effects/TiltCard';
import { useT } from '@/lib/i18n';

const faqKeys = [
  { qKey: 'faq.q1', aKey: 'faq.a1' },
  { qKey: 'faq.q2', aKey: 'faq.a2' },
  { qKey: 'faq.q3', aKey: 'faq.a3' },
  { qKey: 'faq.q4', aKey: 'faq.a4' },
  { qKey: 'faq.q5', aKey: 'faq.a5' },
];

export default function FAQ() {
  const { t } = useT();
  const faqs = faqKeys.map(f => ({ question: t(f.qKey), answer: t(f.aKey) }));
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
            {t('faq.title.1')} <span style={{ color: 'rgba(255,255,255,0.4)' }}>{t('faq.title.2')}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {t('faq.subtitle')}
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
