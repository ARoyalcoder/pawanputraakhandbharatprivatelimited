'use client';

import React from 'react';

export interface IntroTransitionProps {
  flashRef?: React.RefObject<HTMLDivElement | null>;
  rippleRef?: React.RefObject<HTMLDivElement | null>;
}

export function IntroTransition({ flashRef, rippleRef }: IntroTransitionProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* 1. Dramatic Impact Flash */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="absolute inset-0 bg-white opacity-0"
      />

      {/* 2. Concentric Circular Energy Ripple / Shockwave */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={rippleRef}
          aria-hidden="true"
          className="size-72 rounded-full border-2 border-gold-300 bg-gold-400/10 opacity-0 shadow-[0_0_60px_rgba(244,201,93,0.6)]"
        />
      </div>
    </div>
  );
}
