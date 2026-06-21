'use client';

import { useEffect, useRef } from 'react';
import { useFancyEffects } from '@/lib/use-fancy-effects';

/**
 * Soft warm glow that smoothly trails the cursor across the whole page.
 * Uses a single GPU-composited transform (translate3d) on rAF, screen blend
 * mode so it only lightens. Automatically disabled on touch / reduced-motion.
 */
export default function CursorGlow() {
  const enabled = useFancyEffects();
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, primed: false });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const loop = () => {
      const s = state.current;
      s.x += (s.tx - s.x) * 0.14;
      s.y += (s.ty - s.y) * 0.14;
      el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      if (Math.abs(s.tx - s.x) > 0.4 || Math.abs(s.ty - s.y) > 0.4) {
        raf.current = requestAnimationFrame(loop);
      } else {
        raf.current = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      const s = state.current;
      s.tx = e.clientX;
      s.ty = e.clientY;
      if (!s.primed) {
        s.primed = true;
        s.x = s.tx;
        s.y = s.ty;
        el.style.opacity = '1';
      }
      if (!raf.current) raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="cursor-glow-layer">
      <div ref={ref} className="cursor-glow" />
    </div>
  );
}
