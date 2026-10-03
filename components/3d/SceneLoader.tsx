'use client';

import React, { type ReactNode } from 'react';
import { ThreeLoader } from '@/components/loading/ThreeLoader';

export interface SceneLoaderProps {
  children?: ReactNode;
  label?: string;
}

/**
 * Shown while a 3D scene chunk loads.
 * Renders static fallback with ambient pulse or branded ThreeLoader so nothing shifts.
 */
export function SceneLoader({ children, label = 'Preparing 3D Experience' }: SceneLoaderProps) {
  if (!children) {
    return <ThreeLoader label={label} />;
  }

  return (
    <div className="relative size-full" aria-busy="true">
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-pulse-soft bg-gradient-to-t from-navy-950/40 via-transparent to-transparent"
      />
    </div>
  );
}
