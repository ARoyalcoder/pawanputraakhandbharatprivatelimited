'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useInViewLoad } from '@/hooks/useInViewLoad';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useDeferredStart } from '@/hooks/useDeferredStart';
import type { SolutionCardData } from './types';

// Imports three.js, so it is fetched only once the canvas is actually going to mount.
const SolutionEnvironment3D = dynamic(() => import('./SolutionEnvironment3D').then((mod) => mod.SolutionEnvironment3D), {
  ssr: false,
  loading: () => null,
});

interface CinematicBackgroundProps {
  items: SolutionCardData[];
  activeIndex: number;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  items,
  activeIndex,
}) => {
  const [containerRef, isInView] = useInViewLoad<HTMLDivElement>({
    rootMargin: '350px',
    once: false,
  });

  const { canRender3D, isLowPower } = useDeviceCapability();
  const sceneEnabled = useDeferredStart();
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0]));

  const activeItem = items[activeIndex] || items[0];

  // Progressive prefetch: keep active + next likely solution in memory
  useEffect(() => {
    setLoadedIndices((prev) => {
      const next = new Set(prev);
      next.add(activeIndex);
      // Preload next likely solution
      next.add((activeIndex + 1) % items.length);
      return next;
    });
  }, [activeIndex, items.length]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Base Layer: Deep Navy Atmosphere & Blueprint Grid */}
      <div className="absolute inset-0 bg-[#020b1d]" />
      <div className="absolute inset-0 bg-blueprint mask-fade-radial opacity-35" />

      {/* 2. Realistic Environmental Imagery Layers (Progressively Loaded) */}
      {items.map((item, idx) => {
        const isActive = idx === activeIndex;
        const isLoaded = loadedIndices.has(idx);

        // Do not render DOM for images that have never been requested or preloaded
        if (!isLoaded && !isActive) return null;

        const imageSrc =
          item.imageUrl ||
          (item.image.src ? item.image.src : `/images/solutions/${item.id}.jpg`);

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out-expo ${
              isActive
                ? 'opacity-35 scale-100 z-1'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <Image
              src={imageSrc}
              alt={`Illustrative image for ${item.name}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : 'lazy'}
              sizes="100vw"
              className="object-cover object-center filter brightness-[0.75] contrast-[1.1] saturate-[1.1]"
            />
            {/* Cinematic Gradient Veil (Ensures content readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020b1d] via-[#020b1d]/80 to-[#020b1d]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020b1d] via-[#020b1d]/60 to-transparent" />
          </div>
        );
      })}

      {/* 3. Three.js Interactive 3D Lighting & Particle Depth Canvas (Viewport-Lazy) */}
      {sceneEnabled && isInView && canRender3D && !isLowPower && (
        <SolutionEnvironment3D
          accentColor={activeItem.accent}
          activeId={activeItem.id}
          className="opacity-75 z-2"
        />
      )}

      {/* 4. Dynamic Practical Lights & Soft Rim Reflections */}
      <div
        className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full blur-[140px] opacity-25 transition-all duration-1000 z-3"
        style={{ backgroundColor: activeItem.accent }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-[400px] w-[600px] rounded-full blur-[160px] opacity-20 transition-all duration-1000 z-3"
        style={{ backgroundColor: activeItem.accent }}
      />

      {/* Subtle Gold Corporate Horizon Glow */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gold-500/5 to-transparent z-3" />
    </div>
  );
};
