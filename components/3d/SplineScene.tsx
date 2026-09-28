'use client';

import { lazy, Suspense, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SceneLoader } from './SceneLoader';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  /** Public .splinecode URL exported from Spline. */
  scene: string;
  fallback: ReactNode;
  className?: string;
}

/**
 * Spline scene with the static fallback visible until the runtime has loaded the scene.
 * The runtime is only downloaded when a scene URL is configured.
 */
export function SplineScene({ scene, fallback, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn('relative size-full', className)}>
      {!loaded && (
        <div className="absolute inset-0">
          <SceneLoader>{fallback}</SceneLoader>
        </div>
      )}
      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={() => setLoaded(true)}
          className={cn('size-full transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0')}
        />
      </Suspense>
    </div>
  );
}
