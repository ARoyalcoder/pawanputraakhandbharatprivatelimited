'use client';

import type { ReactNode } from 'react';
import { CanvasWrapper, type SceneContext } from './CanvasWrapper';
import { SplineScene } from './SplineScene';
import { useQualityTier } from './useQualityTier';

interface ThreeSceneProps {
  fallback: ReactNode;
  /** Built-in React Three Fiber scene. */
  render: (ctx: SceneContext) => ReactNode;
  /** Optional Spline scene; when set (and the device supports 3D) it replaces the R3F scene. */
  splineUrl?: string;
  className?: string;
}

/** Single entry point for 3D on the site: Spline when configured, otherwise React Three Fiber. */
export function ThreeScene({ fallback, render, splineUrl, className }: ThreeSceneProps) {
  const tier = useQualityTier();
  if (splineUrl && tier && tier !== 'OFF') {
    return <SplineScene scene={splineUrl} fallback={fallback} className={className} />;
  }
  return <CanvasWrapper fallback={fallback} render={render} className={className} />;
}
