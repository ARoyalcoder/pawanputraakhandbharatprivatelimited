'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Muted looping background video. Only loads when on screen, never autoplays for
 * reduced-motion users (the poster is shown instead), and pauses when off screen.
 */
export function VideoBackground({ src, poster, className }: VideoBackgroundProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={cn('absolute inset-0 -z-10 size-full object-cover', className)}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      {load && <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />}
    </video>
  );
}
