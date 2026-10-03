'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animations/gsap';

let lenisInstance: Lenis | null = null;

/** Scroll to an element or offset using Lenis when active, native scrolling otherwise. */
export function smoothScrollTo(target: string | HTMLElement | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -96 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Lenis smooth scrolling for fine-pointer devices only. Touch devices keep native
 * momentum scrolling, and reduced-motion users are never smoothed.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer || prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      anchors: { offset: -96 },
      prevent: (node) => node.closest('dialog') !== null,
    });
    lenisInstance = lenis;
    document.documentElement.classList.add('lenis', 'lenis-smooth');
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
