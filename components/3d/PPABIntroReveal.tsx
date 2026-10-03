'use client';

import React, { useState, useEffect } from 'react';
import { PPABLogo3D } from './PPABLogo3D';
import { useReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Premium Page Load 3D Brand Reveal Intro
 * Sequence: Dark Navy -> Golden light -> 3D Logo Assembles -> Gold Reflection -> Fades to site.
 * Completes in ~1.6 seconds and remembers user session to avoid blocking subsequent page visits.
 */
export function PPABIntroReveal() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is requested or intro already played in this session, skip
    if (reducedMotion) return;

    try {
      const alreadySeen = sessionStorage.getItem('ppab_intro_completed');
      if (alreadySeen) return;

      // Start intro
      setShow(true);

      // Begin fade out after 1.3 seconds
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 1300);

      // Fully remove from DOM after 1.8 seconds
      const closeTimer = setTimeout(() => {
        setShow(false);
        try {
          sessionStorage.setItem('ppab_intro_completed', 'true');
        } catch {
          // Ignore storage quota
        }
      }, 1800);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(closeTimer);
      };
    } catch {
      setShow(false);
    }
  }, [reducedMotion]);

  // Allow user to dismiss immediately by clicking or pressing Escape
  const dismiss = () => {
    setFading(true);
    setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('ppab_intro_completed', 'true');
      } catch {
        // Ignore storage quota
      }
    }, 200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      role="status"
      aria-label="Pawan Putra Akhand Bharat Brand Introduction"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020b1d] cursor-pointer transition-opacity duration-500 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(216,166,42,0.18),transparent_70%)] animate-pulse"
      />

      {/* Central 3D Logo Assemble Frame */}
      <div className="relative flex flex-col items-center text-center scale-95 animate-[page-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Golden light spark */}
        <div
          aria-hidden="true"
          className="size-1 rounded-full bg-gold-300 shadow-[0_0_40px_20px_rgba(244,201,93,0.8)] animate-[pulse-soft_1.5s_infinite]"
        />

        <div className="my-4">
          <PPABLogo3D
            size="hero"
            variant="intro"
            showText={false}
            interactive={true}
            isLink={false}
          />
        </div>

        <div className="space-y-1">
          <p className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">
            Pawan Putra Akhand Bharat
          </p>
          <p className="font-serif italic text-xs sm:text-sm text-gold-300">
            Powering Security, Connectivity &amp; Growth
          </p>
        </div>

        <span className="mt-6 text-[10px] font-mono tracking-widest uppercase text-white/30">
          Click or press Esc to skip
        </span>
      </div>
    </div>
  );
}
export default PPABIntroReveal;
