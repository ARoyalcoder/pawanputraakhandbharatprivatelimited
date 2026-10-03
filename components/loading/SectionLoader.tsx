'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

export interface SectionLoaderProps {
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

/**
 * Luxury section loading container for below-the-fold modules.
 * Prevents layout jumps while dynamic chunks are streamed.
 */
export function SectionLoader({
  children,
  className,
  minHeight = 'min-h-[400px]',
}: SectionLoaderProps) {
  return (
    <section
      aria-busy="true"
      className={cn(
        'relative flex size-full flex-col items-center justify-center overflow-hidden bg-[#020b1d] p-6',
        minHeight,
        className
      )}
    >
      {/* Background blueprint grid & radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(216,166,42,0.06),transparent_70%)]"
      />

      <div className="relative z-10 w-full max-w-7xl">
        {children || (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-8 w-72 rounded-lg" />
              <Skeleton className="h-4 w-96 max-w-full rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
