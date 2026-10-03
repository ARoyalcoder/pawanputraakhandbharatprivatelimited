'use client';

import React, { lazy, Suspense, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ThreeLoader } from './ThreeLoader';
import { useInViewLoad } from '@/hooks/useInViewLoad';

const Spline = lazy(() => import('@splinetool/react-spline'));

export interface SplineLoaderProps {
  scene: string;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}

/**
 * Production-grade Spline Viewport-Based Lazy Loader.
 * Never downloads or compiles Spline runtimes until the element approaches the viewport.
 */
export function SplineLoader({
  scene,
  fallback,
  className,
  rootMargin = '300px',
}: SplineLoaderProps) {
  const [containerRef, isInView] = useInViewLoad<HTMLDivElement>({
    rootMargin,
    once: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={containerRef} className={cn('relative size-full overflow-hidden', className)}>
      {/* Fallback while approaching or loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 size-full">
          {fallback || <ThreeLoader label="Loading Spline Scene" />}
        </div>
      )}

      {/* Dynamic Spline Runtime */}
      {isInView && (
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              'size-full transition-opacity duration-700 ease-out',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </Suspense>
      )}
    </div>
  );
}
