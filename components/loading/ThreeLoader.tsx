'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LoadingProgress } from './LoadingProgress';

export interface ThreeLoaderProps {
  label?: string;
  className?: string;
  progress?: number; // Only display if actual progress is passed!
}

/**
 * Premium PPAB Branded 3D Scene Loader.
 * Features:
 * - Authentic brand typography & gold light pulse.
 * - Honest progress handling: never fakes percentages!
 * - Zero CLS, reserves complete scene bounds.
 */
export function ThreeLoader({
  label = 'Preparing 3D Experience',
  className,
  progress,
}: ThreeLoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className={cn(
        'relative flex size-full flex-col items-center justify-center overflow-hidden bg-[#020b1d] p-6 text-center select-none',
        className
      )}
    >
      {/* 1. Subtle Radial Ambient Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-72 rounded-full bg-[radial-gradient(circle,rgba(216,166,42,0.14)_0%,transparent_70%)] blur-2xl animate-pulse"
      />

      {/* 2. Brand Core Medallion */}
      <div className="relative mb-4 size-16 sm:size-20">
        <Image
          src="/brand/ppab-mark.png"
          alt="PPAB 3D Engine"
          width={80}
          height={80}
          priority
          className="size-full object-contain filter drop-shadow-[0_0_20px_rgba(216,166,42,0.5)]"
        />
      </div>

      {/* 3. Branded Status Indicator */}
      <div className="space-y-1.5 z-10">
        <span className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-white">
          PPAB
        </span>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gold-300">
          <span className="inline-block size-1.5 rounded-full bg-gold-400 animate-ping" />
          <span>{label}</span>
        </div>
      </div>

      {/* 4. Honest Progress Indicator */}
      <div className="mt-5 w-44 sm:w-56 z-10">
        <LoadingProgress progress={progress} height="h-1" />
      </div>
    </div>
  );
}
