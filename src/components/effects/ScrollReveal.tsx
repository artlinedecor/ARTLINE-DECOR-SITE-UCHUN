'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Cinematic on-scroll reveal. Pure CSS transition (opacity + transform) driven
 * by IntersectionObserver, so the final state is `transform: none` and never
 * creates a containing block for fixed-position overlays once revealed.
 * Respects prefers-reduced-motion (renders immediately, no transform).
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  amount = 0.12,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(el);

    // Safety net: never leave content hidden.
    const fallback = setTimeout(() => setVisible(true), 1800);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [amount]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
