'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-fancy-effects';

/**
 * Reusable 3D tilt + glare wrapper. GPU-only (rotate/scale on transform).
 * Works with both a mouse (hover) and touch (finger drag), so the 3D "wow"
 * is felt on mobile too. Falls back to a plain div only when the user has
 * requested reduced motion, so it never fights accessibility.
 */
export default function TiltCard({
  children,
  className = '',
  style,
  onClick,
  max = 8,
  scale = 1.02,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const enabled = !reduced;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 150, damping: 18 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), cfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), cfg);
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useTransform(
    [glareX, glareY] as unknown as MotionValue<string>[],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 50%)`
  );

  if (!enabled) {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  const setFromPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    mx.set((clientX - rect.left) / rect.width - 0.5);
    my.set((clientY - rect.top) / rect.height - 0.5);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setFromPoint(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (!t) return;
    setFromPoint(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onTouchStart={onTouchMove}
      onTouchMove={onTouchMove}
      onTouchEnd={reset}
      whileHover={{ scale }}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            zIndex: 3,
            background: glareBg,
          }}
        />
      )}
    </motion.div>
  );
}
