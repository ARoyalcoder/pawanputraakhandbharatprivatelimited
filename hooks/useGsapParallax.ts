'use client';

import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';

/** Scrubbed parallax on a single element. `speed` is the fraction of travel (0.1–0.4 reads well). */
export function useGsapParallax<T extends HTMLElement>(speed = 0.2) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { yPercent: speed * 50 },
        {
          yPercent: speed * -50,
          ease: 'none',
          scrollTrigger: { trigger: ref.current.parentElement || ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    },
    { dependencies: [speed] }
  );

  return ref;
}
