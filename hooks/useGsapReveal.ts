'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import { duration, ease, revealFrom, revealStart, revealTo, staggerEach, type RevealVariant } from '@/lib/animations/presets';

interface Options {
  /** Selector for the children to reveal, scoped to the returned ref. */
  selector?: string;
  variant?: RevealVariant;
  stagger?: number;
  /** When false, animates on mount instead of on scroll. */
  onScroll?: boolean;
}

/** Stagger-reveal children of a container. Cleans up automatically via useGSAP. */
export function useGsapReveal<T extends HTMLElement>({
  selector = '[data-reveal-child]',
  variant = 'up',
  stagger = staggerEach,
  onScroll = true,
}: Options = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const targets = ref.current.querySelectorAll(selector);
      if (!targets.length) return;

      gsap.fromTo(targets, revealFrom[variant], {
        ...revealTo[variant],
        duration: duration.base,
        ease: ease.out,
        stagger,
        scrollTrigger: onScroll ? { trigger: ref.current, start: revealStart, once: true } : undefined,
      });
    },
    { scope: ref }
  );

  return ref;
}
