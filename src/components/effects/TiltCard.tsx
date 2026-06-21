'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { useFancyEffects } from '@/lib/use-fancy-effects';

/**
 * Reusable 3D tilt + cursor glare wrapper. GPU-only (rotate/scale on transform).
 * Falls back to a plain div on touch / reduced-motion so it never interferes
 * with tap targets or accessibility.
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
  const enabled = useFancyEffects();
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

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
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
