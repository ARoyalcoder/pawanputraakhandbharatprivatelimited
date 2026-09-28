/** Shared motion language. Keep durations short so navigation never feels slow. */

export const ease = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  soft: 'power2.out',
} as const;

export const duration = {
  fast: 0.35,
  base: 0.8,
  slow: 1.2,
} as const;

export type RevealVariant = 'up' | 'fade' | 'scale' | 'left' | 'right' | 'mask';

export const revealFrom: Record<RevealVariant, gsap.TweenVars> = {
  up: { autoAlpha: 0, y: 32 },
  fade: { autoAlpha: 0 },
  scale: { autoAlpha: 0, scale: 0.96, y: 16 },
  left: { autoAlpha: 0, x: -36 },
  right: { autoAlpha: 0, x: 36 },
  mask: { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 1 },
};

export const revealTo: Record<RevealVariant, gsap.TweenVars> = {
  up: { autoAlpha: 1, y: 0 },
  fade: { autoAlpha: 1 },
  scale: { autoAlpha: 1, scale: 1, y: 0 },
  left: { autoAlpha: 1, x: 0 },
  right: { autoAlpha: 1, x: 0 },
  mask: { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 },
};

export const staggerEach = 0.08;

/** Viewport position at which scroll reveals fire. */
export const revealStart = 'top 86%';
