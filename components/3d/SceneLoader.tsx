import type { ReactNode } from 'react';

/** Shown while a scene chunk loads: the static fallback with a soft pulse, so nothing shifts. */
export function SceneLoader({ children }: { children: ReactNode }) {
  return (
    <div className="relative size-full" aria-busy="true">
      {children}
      <div aria-hidden="true" className="absolute inset-0 animate-pulse-soft bg-gradient-to-t from-navy-950/30 to-transparent" />
    </div>
  );
}
