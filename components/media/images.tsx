import Image, { type ImageProps } from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Neutral navy blur used while any image loads. */
export const NAVY_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDYiPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwZDJhNTUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMjBiMWQiLz48L2xpbmVhckdyYWRpZW50PjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

type BaseImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'>;

/** next/image with sensible defaults: lazy, blur placeholder, responsive sizes. */
export function OptimizedImage({ alt, className, sizes = '(min-width: 1024px) 50vw, 100vw', ...rest }: BaseImageProps) {
  return <Image alt={alt} placeholder="blur" blurDataURL={NAVY_BLUR} sizes={sizes} className={cn('object-cover', className)} {...rest} />;
}

/** Fills its (relatively positioned) parent. */
export function ResponsiveImage({ className, ...rest }: Omit<BaseImageProps, 'fill' | 'width' | 'height'>) {
  return <OptimizedImage fill className={className} {...rest} />;
}

/** Above-the-fold image: loaded with priority and full-width sizes. */
export function HeroImage(props: Omit<BaseImageProps, 'fill' | 'width' | 'height' | 'priority' | 'sizes'>) {
  return <OptimizedImage fill priority sizes="100vw" {...props} />;
}

/** Decorative full-bleed background image with an optional overlay. */
export function BackgroundImage({ src, overlayClassName, className, children }: { src: string; overlayClassName?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)} aria-hidden="true">
      <OptimizedImage src={src} alt="" fill sizes="100vw" />
      <div className={cn('absolute inset-0 bg-navy-950/60', overlayClassName)} />
      {children}
    </div>
  );
}
