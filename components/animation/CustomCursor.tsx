'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type CursorMode = 'default' | 'hover' | 'view';

/** Diameter of the follower at full size; the smaller states are scaled down from it. */
const SIZE = 72;
const scaleFor: Record<CursorMode, number> = { default: 0.5, hover: 0.78, view: 1 };

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [data-interactive]';

/**
 * Custom cursor: a precise dot and a ring that trails it on a spring. Over links and buttons
 * the ring grows; over anything marked `data-cursor="view"` it becomes a gold disc with an
 * arrow, inviting a click. Only transforms and opacity animate, so it never causes layout.
 * Hidden on touch screens and with reduced motion.
 */
export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.2 });
  const ringY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.2 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      setMode(target?.closest('[data-cursor="view"]') ? 'view' : target?.closest(INTERACTIVE) ? 'hover' : 'default');
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  const view = mode === 'view';

  return (
    <>
      {/* Trailing ring; a filled disc with an arrow over "view" targets */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] grid place-items-center rounded-full border will-change-transform"
        style={{ x: ringX, y: ringY, width: SIZE, height: SIZE, marginLeft: -SIZE / 2, marginTop: -SIZE / 2 }}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: scaleFor[mode] * (pressed ? 0.85 : 1),
          backgroundColor: view ? 'rgba(231, 184, 67, 0.96)' : mode === 'hover' ? 'rgba(231, 184, 67, 0.14)' : 'rgba(216, 166, 42, 0.06)',
          borderColor: view ? 'rgba(231, 184, 67, 0)' : mode === 'hover' ? 'rgba(231, 184, 67, 0.7)' : 'rgba(216, 166, 42, 0.35)',
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 300, mass: 0.3 }}
      >
        <motion.span
          className="text-navy-950"
          initial={false}
          animate={{ opacity: view ? 1 : 0, scale: view ? 1 : 0.4, rotate: view ? 0 : -45 }}
          transition={{ type: 'spring', damping: 20, stiffness: 320 }}
        >
          <ArrowUpRight className="size-6" strokeWidth={2.25} />
        </motion.span>
      </motion.div>

      {/* Precise dot; steps aside while the disc is showing */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 size-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(216,166,42,0.8)] will-change-transform"
        style={{ x, y }}
        initial={false}
        animate={{ opacity: visible && !view ? 1 : 0, scale: pressed ? 0.6 : mode === 'hover' ? 1.4 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
