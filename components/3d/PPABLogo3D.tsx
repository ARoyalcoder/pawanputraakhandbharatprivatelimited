'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { LogoFallback } from './LogoFallback';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { LogoWordmark } from '@/components/ui/LogoWordmark';
import { cn } from '@/lib/utils';
import type { PPABLogoSceneProps } from './PPABLogoScene';

const PPABLogoScene = dynamic(() => import('./PPABLogoScene'), {
  ssr: false,
  loading: () => null,
});

export interface PPABLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'header' | 'hero' | 'footer' | 'intro';
  interactive?: boolean;
  showText?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
  isLink?: boolean;
}

const canvasDimensions = {
  sm: 'size-10',
  md: 'size-12 sm:size-13',
  lg: 'size-16',
  hero: 'size-32 sm:size-40 lg:size-48',
};

/**
 * Premium 3D PPAB Brand Logo
 * Features metallic gold PBR materials, pointer tilt interaction,
 * dynamic specular sweep, and full accessible fallbacks.
 */
export function PPABLogo3D({
  size = 'md',
  variant = 'header',
  interactive = true,
  showText = true,
  tone = 'dark',
  className,
  isLink = true,
}: PPABLogo3DProps) {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    // Simple WebGL feature detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const dims = canvasDimensions[size];

  // If not mounted yet (SSR), reduced motion is preferred, or WebGL is unsupported, render static fallback
  if (!mounted || !webglSupported || reducedMotion) {
    return (
      <LogoFallback
        size={size}
        showText={showText}
        tone={tone}
        className={className}
        isLink={isLink}
      />
    );
  }

  const logoNode = (
    <div className={cn('group relative inline-flex items-center gap-3 select-none', className)}>
      <div className={cn('relative grid place-items-center', dims)}>
        {/* Static fallback remains underneath until 3D Canvas smoothly loads */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-700 pointer-events-none',
            sceneLoaded ? 'opacity-0' : 'opacity-100'
          )}
        >
          <LogoFallback
            size={size}
            showText={false}
            tone={tone}
            isLink={false}
          />
        </div>

        {/* 3D WebGL Canvas Stage */}
        <div
          className={cn(
            'relative size-full cursor-pointer transition-opacity duration-700',
            sceneLoaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Canvas
            dpr={[1, 2.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [0, 0, 4.2], fov: 36, near: 0.1, far: 50 }}
            className="size-full"
            aria-hidden="true"
          >
            <Suspense fallback={null}>
              <PPABLogoScene
                size={size}
                variant={variant}
                interactive={interactive}
                reducedMotion={reducedMotion}
                onLoaded={() => setSceneLoaded(true)}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {showText && <LogoWordmark tone={tone} />}
    </div>
  );

  if (!isLink) return logoNode;

  return (
    <Link href="/" aria-label="Pawan Putra Akhand Bharat - Return to Homepage">
      {logoNode}
    </Link>
  );
}

export default PPABLogo3D;
