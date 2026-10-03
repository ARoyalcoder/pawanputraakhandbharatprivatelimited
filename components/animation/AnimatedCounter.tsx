'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  direction?: 'up' | 'down';
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Animated number ticker using Framer Motion springs.
 * Counts up smoothly when the element scrolls into view.
 */
export function AnimatedCounter({
  value,
  direction = 'up',
  className = '',
  decimals = 0,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(direction === 'down' ? value : 0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      if (ref.current) {
        const formatted = latest.toFixed(decimals);
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });
  }, [springVal, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
