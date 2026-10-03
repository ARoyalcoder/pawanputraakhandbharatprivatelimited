'use client';

import { useState, useEffect } from 'react';
import { useInViewLoad, UseInViewLoadOptions } from './useInViewLoad';

export interface UseLazyLoadOptions extends UseInViewLoadOptions {
  delayMs?: number;
  useIdleCallback?: boolean;
}

/**
 * Enhanced lazy load hook combining viewport proximity with idle browser scheduling.
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseLazyLoadOptions = {}
) {
  const { delayMs = 0, useIdleCallback = true, ...inViewOptions } = options;
  const [ref, inView] = useInViewLoad<T>(inViewOptions);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!inView || shouldLoad) return;

    if (delayMs > 0) {
      const timer = setTimeout(() => setShouldLoad(true), delayMs);
      return () => clearTimeout(timer);
    }

    if (useIdleCallback && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        setShouldLoad(true);
      });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    }

    setShouldLoad(true);
  }, [inView, shouldLoad, delayMs, useIdleCallback]);

  return { ref, shouldLoad };
}
