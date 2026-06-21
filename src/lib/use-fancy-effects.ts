'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only when rich pointer-driven effects should run:
 * a fine pointer (mouse) is available AND the user has not requested
 * reduced motion. Falls back to false on the server and on touch devices.
 */
export function useFancyEffects(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const compute = () => setEnabled(!motion.matches && pointer.matches);
    compute();
    motion.addEventListener('change', compute);
    pointer.addEventListener('change', compute);
    return () => {
      motion.removeEventListener('change', compute);
      pointer.removeEventListener('change', compute);
    };
  }, []);

  return enabled;
}

/** Tracks the user's prefers-reduced-motion setting (false on the server). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
