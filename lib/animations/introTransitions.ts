import { gsap } from '@/lib/animations/gsap';

export interface TransitionConfig {
  container: HTMLElement | null;
  heroTarget?: HTMLElement | null;
  onComplete?: () => void;
}

/**
 * Handles smooth mask/opacity/scale transition from cinematic darkness into the website hero.
 * Avoids jarring white flashes or abrupt cutoffs.
 */
export function executeIntroTransition({
  container,
  heroTarget,
  onComplete,
}: TransitionConfig) {
  if (!container) {
    onComplete?.();
    return;
  }

  const tl = gsap.timeline({
    onComplete,
    defaults: { ease: 'power3.inOut' },
  });

  tl.to(container, {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(8px)',
    duration: 0.85,
  });

  if (heroTarget) {
    tl.fromTo(
      heroTarget,
      { opacity: 0.8, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.85 },
      '<'
    );
  }
}
