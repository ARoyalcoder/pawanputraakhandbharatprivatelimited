'use client';

import React, { lazy, Suspense } from 'react';
import { LogoFallback } from '@/components/3d/LogoFallback';
import { useDeferredStart } from '@/hooks/useDeferredStart';
import { cn } from '@/lib/utils';

// The WebGL emblem pulls in three.js, so it is fetched only after the visitor first interacts.
const PPABLogo3D = lazy(() => import('@/components/3d/PPABLogo3D').then((mod) => ({ default: mod.PPABLogo3D })));

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
  compact?: boolean;
  variant?: 'header' | 'hero' | 'footer' | 'intro';
  interactive?: boolean;
}

/**
 * PPAB Brand Logo Component
 * Server-renders the static, accessible mark, then upgrades it to the 3D WebGL metallic gold
 * emblem (pointer-driven tilt, specular sheen sweep) once the page is interactive.
 */
export function Logo({
  tone = 'dark',
  className,
  compact = false,
  variant = 'header',
  interactive = true,
}: LogoProps) {
  const enhance = useDeferredStart();
  const size = compact ? 'sm' : 'md';
  const fallback = <LogoFallback size={size} showText={!compact} tone={tone} />;

  return (
    <div className={cn('inline-flex items-center', className)}>
      {enhance ? (
        <Suspense fallback={fallback}>
          <PPABLogo3D size={size} variant={variant} showText={!compact} tone={tone} interactive={interactive} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

export default Logo;
