'use client';

import React from 'react';
import Image from 'next/image';

export interface IntroLogoRevealProps {
  logoRef?: React.RefObject<HTMLDivElement | null>;
  revealed?: boolean;
}

/**
 * 2D/3.5D high-fidelity logo presentation that emerges seamlessly after the impact flash.
 * Preserves exact official lettering, emblem proportions, spacing, and brand identity.
 */
export function IntroLogoReveal({ logoRef }: IntroLogoRevealProps) {
  return (
    <div
      ref={logoRef}
      className="relative flex flex-col items-center justify-center opacity-0 transition-transform duration-700 select-none"
    >
      {/* Golden rim volumetric back-glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-44 sm:size-56 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.3)_0%,rgba(6,21,47,0.1)_60%,transparent_80%)] blur-xl"
      />

      {/* Official PPAB Mark with metallic drop shadow */}
      <div className="relative size-28 sm:size-36 md:size-44">
        <Image
          src="/brand/ppab-mark.png"
          alt="Pawan Putra Akhand Bharat Logo"
          width={180}
          height={180}
          priority
          className="size-full object-contain filter drop-shadow-[0_8px_32px_rgba(216,166,42,0.55)]"
        />
      </div>
    </div>
  );
}
