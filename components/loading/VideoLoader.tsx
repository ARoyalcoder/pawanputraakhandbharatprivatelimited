'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useInViewLoad } from '@/hooks/useInViewLoad';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { canPreloadHeavyAssets } from '@/lib/loading/assetLoader';

export interface VideoLoaderProps {
  src: string;
  poster: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  title?: string;
}

/**
 * Intelligent Viewport-Aware Video Loader.
 * Features:
 * - Mounts and streams video ONLY when approaching viewport (rootMargin: 300px).
 * - Displays high-resolution poster immediately (zero layout shifts).
 * - Pauses execution when scrolled out of view to preserve battery & CPU.
 * - Respects `prefers-reduced-motion` and data-saver connections.
 * - Graceful fallback to poster on connection failures.
 */
export function VideoLoader({
  src,
  poster,
  className,
  containerClassName,
  aspectRatio = 'aspect-video',
  title = 'PPAB Video Player',
}: VideoLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [containerRef, isInView] = useInViewLoad<HTMLDivElement>({
    rootMargin: '300px',
    once: false,
  });

  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const reducedMotion = useReducedMotion();
  const canStreamVideo = canPreloadHeavyAssets() && !reducedMotion;

  useEffect(() => {
    if (isInView && canStreamVideo && !hasStartedLoading) {
      setHasStartedLoading(true);
    }
  }, [isInView, canStreamVideo, hasStartedLoading]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasStartedLoading) return;

    if (isInView) {
      video.play().catch(() => {
        // Autoplay may be restricted by browser policy
      });
    } else {
      video.pause();
    }
  }, [isInView, hasStartedLoading]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-[#020b1d]',
        aspectRatio,
        containerClassName
      )}
    >
      {/* 1. Base Poster Layer (Always present for instant paint) */}
      <Image
        src={poster}
        alt={title}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn(
          'size-full object-cover transition-opacity duration-700 ease-out',
          isVideoReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      />

      {/* 2. Video Player Layer (Loaded strictly on demand) */}
      {hasStartedLoading && !hasError && canStreamVideo && (
        <video
          ref={videoRef}
          aria-label={title}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlayThrough={() => setIsVideoReady(true)}
          onError={() => setHasError(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out',
            isVideoReady ? 'opacity-100' : 'opacity-0',
            className
          )}
        >
          <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}
    </div>
  );
}
