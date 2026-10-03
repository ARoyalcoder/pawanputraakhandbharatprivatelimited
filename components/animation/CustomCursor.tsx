'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Interactive Ambient Custom Cursor with Framer Motion spring physics.
 * Provides micro-interactive feedback on hoverable elements (links, buttons, inputs).
 * Auto-hides on touch screens and prefers-reduced-motion environments.
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth lagging follower
  const springConfig = { damping: 25, stiffness: 350, mass: 0.15 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse/trackpad) and not reduced motion
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasPointer || prefersReducedMotion) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHoverTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(
        target.closest('a, button, input, textarea, select, [role="button"], [data-interactive]')
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkHoverTarget);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkHoverTarget);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ambient glow follower */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-gold-400/40 bg-gold-400/10 backdrop-blur-[1px] mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 56 : isClicking ? 28 : 36,
          height: isHovered ? 56 : isClicking ? 28 : 36,
          borderColor: isHovered ? 'rgba(234, 179, 8, 0.7)' : 'rgba(216, 166, 42, 0.35)',
          backgroundColor: isHovered ? 'rgba(234, 179, 8, 0.15)' : 'rgba(216, 166, 42, 0.06)',
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.1 }}
      />

      {/* Inner precise dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(216,166,42,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.6 : isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.9 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
