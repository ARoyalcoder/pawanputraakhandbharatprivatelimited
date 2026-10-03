'use client';

import React from 'react';
import Image from 'next/image';

export interface IntroFallbackProps {
  onDismiss: () => void;
  isLoading?: boolean;
}

/**
 * High-performance fallback for non-WebGL devices or low-power modes.
 * Displays the real PPAB logo with luxury gold atmospheric pulse and minimal CPU overhead.
 */
export function IntroFallback({ onDismiss, isLoading = false }: IntroFallbackProps) {
  return (
    <div
      role="status"
      aria-label="PPAB Intro loading screen"
      className="relative flex size-full flex-col items-center justify-center bg-[#020b1d] px-6 text-center"
    >
      {/* Background radiant ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-96 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.18)_0%,transparent_70%)] blur-2xl animate-pulse"
      />

      {/* Official PPAB Brand Mark */}
      <div className="relative mb-6 size-24 sm:size-28">
        <Image
          src="/brand/ppab-mark.png"
          alt="PPAB Official Logo"
          width={112}
          height={112}
          priority
          className="size-full object-contain filter drop-shadow-[0_0_24px_rgba(216,166,42,0.45)]"
        />
      </div>

      {/* Brand Typography */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
          Pawan Putra Akhand Bharat
        </h2>
        <p className="font-serif italic text-sm sm:text-base text-gold-300">
          Powering Security, Connectivity &amp; Growth
        </p>
      </div>

      {/* Gold loading indicator line if assets are loading */}
      {isLoading && (
        <div className="mt-8 h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-[shimmer_1.4s_infinite]" />
        </div>
      )}

      {/* Quick proceed action */}
      <button
        type="button"
        onClick={onDismiss}
        className="mt-8 rounded-full border border-gold-400/40 bg-[#06152f] px-6 py-2 text-xs font-semibold tracking-wider text-gold-200 transition-colors hover:border-gold-300 hover:text-white"
      >
        Enter Website
      </button>
    </div>
  );
}
