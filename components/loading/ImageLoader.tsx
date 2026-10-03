'use client';

import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';
import { Shield } from 'lucide-react';

export interface ImageLoaderProps extends Omit<ImageProps, 'onLoadingComplete' | 'onLoad'> {
  aspectRatio?: string; // e.g. "aspect-[16/9]", "aspect-square"
  containerClassName?: string;
  fallbackIcon?: boolean;
}

const DEFAULT_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDYiPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwZDJhNTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjBiMWQiLz48L2xpbmVhckdyYWRpZW50PjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

/**
 * Production-grade Next/Image wrapper.
 * Features:
 * - Zero Layout Shift (CLS = 0) with reserved container dimensions.
 * - Branded navy/gold skeleton during asset transfer.
 * - Smooth 300ms fade-in upon load.
 * - Graceful fallback on broken image sources.
 */
export function ImageLoader({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  fallbackIcon = true,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  fill,
  width,
  height,
  ...props
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#020b1d]',
        aspectRatio,
        fill ? 'size-full' : '',
        containerClassName
      )}
    >
      {/* 1. PPAB Branded Navy Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 size-full">
          <Skeleton className="size-full rounded-none" />
        </div>
      )}

      {/* 2. Error Fallback (Branded security placeholder) */}
      {hasError ? (
        <div
          role="img"
          aria-label={alt || 'Image unavailable'}
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#040e22] text-center p-4 text-white/40"
        >
          {fallbackIcon && <Shield className="size-8 text-gold-400/40 mb-2" />}
          <span className="font-mono text-[11px] tracking-wider uppercase text-white/50">
            PPAB Asset Secured
          </span>
        </div>
      ) : (
        /* 3. Next.js Optimized Image with Smooth Fade */
        <Image
          src={src}
          alt={alt}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'transition-opacity duration-400 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
