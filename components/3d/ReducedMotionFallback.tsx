import type { ReactNode } from 'react';

/**
 * Static stand-in for a 3D scene, used for reduced-motion, low-power and no-WebGL visitors.
 * The surrounding page always carries the same information as real DOM text.
 */
export function ReducedMotionFallback({ children }: { children: ReactNode }) {
  return <div className="relative size-full">{children}</div>;
}
