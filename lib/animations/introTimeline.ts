import { gsap } from '@/lib/animations/gsap';

export interface IntroTimelineOptions {
  onParticlesStart?: () => void;
  onObjectEnter?: () => void;
  onImpactPrep?: () => void;
  onImpact?: () => void;
  onParticleBurst?: () => void;
  onLogoReveal?: () => void;
  onCompanyReveal?: () => void;
  onTaglineReveal?: () => void;
  onTransitionStart?: () => void;
  onComplete?: () => void;
  isMobile?: boolean;
}

/**
 * Builds the Master GSAP Intro Timeline according to the choreography specification:
 * 0.0 - Darkness (Deep Navy #020B1D)
 * 0.5 - Warm Gold Particles begin drifting
 * 1.5 - Environment & lighting atmospheric depth awaken
 * 2.5 - Mysterious 3D Gold Emblem emerges in distant haze
 * 4.0 - Controlled cinematic approach & energy buildup
 * 5.0 - Tension climax / Impact preparation
 * 5.5 - DRAMATIC IMPACT (Flash, shockwave ripple, camera tremor)
 * 6.0 - Golden particle explosion
 * 6.8 - Official PPAB 3D brand logo emerges from light
 * 7.8 - PAWAN PUTRA AKHAND BHARAT typography revelation
 * 8.5 - MASTER TAGLINE ("Powering Security, Connectivity & Growth")
 * 9.2 - Seamless cinematic transition into homepage hero
 */
export function buildIntroTimeline(
  targets: {
    container: HTMLElement | null;
    canvasWrap: HTMLElement | null;
    flashOverlay: HTMLElement | null;
    rippleWave: HTMLElement | null;
    logoDom: HTMLElement | null;
    companyName: HTMLElement | null;
    tagline: HTMLElement | null;
    skipBtn: HTMLElement | null;
  },
  callbacks: IntroTimelineOptions
): gsap.core.Timeline {
  const isMobile = !!callbacks.isMobile;
  const speedMultiplier = isMobile ? 0.8 : 1.0;

  // Initialize master timeline
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.out' },
    onComplete: callbacks.onComplete,
  });

  const t = (sec: number) => sec * speedMultiplier;

  // Initial states
  if (targets.flashOverlay) gsap.set(targets.flashOverlay, { autoAlpha: 0 });
  if (targets.rippleWave) gsap.set(targets.rippleWave, { autoAlpha: 0, scale: 0.1 });
  if (targets.logoDom) gsap.set(targets.logoDom, { autoAlpha: 0, scale: 0.88, filter: 'blur(12px)' });
  if (targets.companyName) gsap.set(targets.companyName, { autoAlpha: 0, y: 16 });
  if (targets.tagline) gsap.set(targets.tagline, { autoAlpha: 0, y: 12 });
  if (targets.skipBtn) gsap.set(targets.skipBtn, { autoAlpha: 0 });

  // 0.0s - Darkness (Anticipation)
  // 0.5s - Gold Particles Appear
  tl.call(() => callbacks.onParticlesStart?.(), [], t(0.5));
  if (targets.skipBtn) {
    tl.to(targets.skipBtn, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, t(0.8));
  }

  // 2.5s - Mysterious Gold Object enters
  tl.call(() => callbacks.onObjectEnter?.(), [], t(2.2));

  // 4.8s - Energy buildup / Tension Climax
  tl.call(() => callbacks.onImpactPrep?.(), [], t(4.8));

  // 5.5s - IMPACT (Flash & Shockwave Ripple)
  tl.call(() => {
    callbacks.onImpact?.();
  }, [], t(5.5));

  if (targets.flashOverlay) {
    tl.to(targets.flashOverlay, {
      autoAlpha: 0.95,
      duration: 0.12,
      ease: 'power4.in',
    }, t(5.5))
    .to(targets.flashOverlay, {
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, t(5.62));
  }

  if (targets.rippleWave) {
    tl.to(targets.rippleWave, {
      autoAlpha: 0.8,
      scale: 1,
      duration: 0.1,
      ease: 'power2.out',
    }, t(5.5))
    .to(targets.rippleWave, {
      scale: 3.5,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, t(5.6));
  }

  // 6.0s - Particle Explosion burst
  tl.call(() => callbacks.onParticleBurst?.(), [], t(6.0));

  // 6.8s - Logo reveal
  tl.call(() => callbacks.onLogoReveal?.(), [], t(6.8));
  if (targets.logoDom) {
    tl.to(targets.logoDom, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.0,
      ease: 'expo.out',
    }, t(6.8));
  }

  // 7.8s - Company Name
  tl.call(() => callbacks.onCompanyReveal?.(), [], t(7.8));
  if (targets.companyName) {
    tl.to(targets.companyName, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, t(7.8));
  }

  // 8.5s - Master Tagline
  tl.call(() => callbacks.onTaglineReveal?.(), [], t(8.5));
  if (targets.tagline) {
    tl.to(targets.tagline, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, t(8.5));
  }

  // 9.4s - Transition into Homepage Hero
  tl.call(() => callbacks.onTransitionStart?.(), [], t(9.4));
  if (targets.container) {
    tl.to(targets.container, {
      autoAlpha: 0,
      scale: 1.04,
      duration: 0.9,
      ease: 'power3.inOut',
    }, t(9.5));
  }

  return tl;
}
