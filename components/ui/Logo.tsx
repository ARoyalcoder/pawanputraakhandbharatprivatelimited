'use client';

import React from 'react';
import { PPABLogo3D } from '@/components/3d/PPABLogo3D';
import { cn } from '@/lib/utils';

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
  compact?: boolean;
  variant?: 'header' | 'hero' | 'footer' | 'intro';
  interactive?: boolean;
}

/**
 * PPAB Brand Logo Component
 * Upgraded with dynamic 3D WebGL metallic gold emblem,
 * pointer-driven tilt interaction, specular sheen sweep,
 * and robust static accessible fallback for non-WebGL/SSR.
 */
export function Logo({
  tone = 'dark',
  className,
  compact = false,
  variant = 'header',
  interactive = true,
}: LogoProps) {
  return (
    <div className={cn('inline-flex items-center', className)}>
      <PPABLogo3D
        size={compact ? 'sm' : 'md'}
        variant={variant}
        showText={!compact}
        tone={tone}
        interactive={interactive}
      />
    </div>
  );
}

export default Logo;
