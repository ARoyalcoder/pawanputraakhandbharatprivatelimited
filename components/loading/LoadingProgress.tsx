'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingProgressProps {
  progress?: number; // 0 to 100, or undefined for indeterminate
  className?: string;
  height?: string;
}

/**
 * High-precision gold gradient progress line with glowing spark head.
 * When indeterminate, displays a smooth, silky scanning pulse.
 */
export function LoadingProgress({
  progress,
  className,
  height = 'h-1',
}: LoadingProgressProps) {
  const isIndeterminate = progress === undefined;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : Math.round(progress)}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-white/10 p-[0.5px] backdrop-blur-md border border-gold-400/20',
        height,
        className
      )}
    >
      {isIndeterminate ? (
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#f4c95d] to-transparent shadow-[0_0_12px_rgba(244,201,93,0.8)] animate-[shimmer_1.6s_ease-in-out_infinite]" />
      ) : (
        <div
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          className="relative h-full rounded-full bg-gradient-to-r from-[#997017] via-[#f4c95d] to-[#ffe699] shadow-[0_0_12px_rgba(244,201,93,0.85)] transition-all duration-300 ease-out"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
        </div>
      )}
    </div>
  );
}
