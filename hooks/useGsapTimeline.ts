'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';

type Build = (tl: gsap.core.Timeline, root: HTMLElement) => void;

/**
 * Build a GSAP timeline scoped to a container. Pass `scrollTrigger` vars to tie it to
 * scroll; the timeline and its trigger are reverted when the component unmounts.
 */
export function useGsapTimeline<T extends HTMLElement>(
  build: Build,
  { scrollTrigger, dependencies = [] }: { scrollTrigger?: ScrollTrigger.Vars; dependencies?: unknown[] } = {}
) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: scrollTrigger ? { trigger: ref.current, ...scrollTrigger } : undefined,
      });
      build(tl, ref.current);
    },
    { scope: ref, dependencies }
  );

  return ref;
}
