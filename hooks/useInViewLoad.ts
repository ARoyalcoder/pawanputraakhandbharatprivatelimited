'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseInViewLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

/**
 * High-performance viewport loading hook.
 * By default starts loading 300px before reaching the viewport,
 * ensuring assets are ready by the time the visitor reaches the element.
 */
export function useInViewLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewLoadOptions = {}
): [RefObject<T | null>, boolean] {
  const { rootMargin = '300px', threshold = 0.01, once = true } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return [ref, isInView];
}
