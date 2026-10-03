'use client';

import React from 'react';

export interface IntroTextProps {
  companyRef?: React.RefObject<HTMLDivElement | null>;
  taglineRef?: React.RefObject<HTMLDivElement | null>;
}

export function IntroText({ companyRef, taglineRef }: IntroTextProps) {
  return (
    <div className="pointer-events-none mt-6 flex flex-col items-center text-center select-none">
      {/* Official Company Name */}
      <div
        ref={companyRef}
        className="opacity-0 font-heading text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
      >
        <span>PAWAN PUTRA </span>
        <span className="text-gold-300">AKHAND BHARAT</span>
      </div>

      {/* Master Tagline */}
      <div
        ref={taglineRef}
        className="opacity-0 mt-2 font-serif text-sm sm:text-base md:text-lg italic tracking-wide text-gold-200/90 drop-shadow-[0_2px_10px_rgba(216,166,42,0.5)]"
      >
        Powering Security, Connectivity &amp; Growth
      </div>
    </div>
  );
}
