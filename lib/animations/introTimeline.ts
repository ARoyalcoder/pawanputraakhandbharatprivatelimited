import { gsap } from '@/lib/animations/gsap';

export interface IntroTimelineTargets {
  container: HTMLElement | null;
  logoDom: HTMLElement | null;
  logoSheen: HTMLElement | null;
  rings: HTMLElement | null;
  companyName: HTMLElement | null;
  tagline: HTMLElement | null;
  progressBar: HTMLElement | null;
  counterText: HTMLElement | null;
  statusText: HTMLElement | null;
  skipBtn: HTMLElement | null;
  flashOverlay?: HTMLElement | null;
}

export interface IntroTimelineOptions {
  isMobile?: boolean;
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: string) => void;
  onTransitionStart?: () => void;
  onComplete?: () => void;
}

const STATUS_STEPS = [
  'INITIALIZING SECURE SYSTEMS',
  'CALIBRATING ENTERPRISE PLATFORM',
  'SYNCHRONIZING INFRASTRUCTURE',
  'PPAB ENTERPRISE READY',
];

/**
 * High-performance GSAP Intro Timeline.
 * Snappy, luxurious ~1.85s executive presentation with 60 FPS hardware acceleration.
 */
export function buildIntroTimeline(
  targets: IntroTimelineTargets,
  callbacks: IntroTimelineOptions
): gsap.core.Timeline {
  const isMobile = !!callbacks.isMobile;
  const speedMultiplier = isMobile ? 0.85 : 1.0;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.out' },
    onComplete: callbacks.onComplete,
  });

  const t = (sec: number) => sec * speedMultiplier;

  // Set initial element states
  if (targets.container) gsap.set(targets.container, { autoAlpha: 1 });
  if (targets.logoDom) gsap.set(targets.logoDom, { autoAlpha: 0, scale: 0.88, filter: 'blur(10px)' });
  if (targets.rings) gsap.set(targets.rings, { autoAlpha: 0, scale: 0.75, rotation: -20 });
  if (targets.logoSheen) gsap.set(targets.logoSheen, { xPercent: -150, opacity: 0 });
  if (targets.companyName) gsap.set(targets.companyName, { autoAlpha: 0, y: 14 });
  if (targets.tagline) gsap.set(targets.tagline, { autoAlpha: 0, y: 10 });
  if (targets.progressBar) gsap.set(targets.progressBar, { width: '0%' });
  if (targets.skipBtn) gsap.set(targets.skipBtn, { autoAlpha: 0 });
  if (targets.flashOverlay) gsap.set(targets.flashOverlay, { autoAlpha: 0 });

  // 0.1s - Logo & Orbital Rings Emergence
  if (targets.rings) {
    tl.to(
      targets.rings,
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: t(0.65),
        ease: 'power3.out',
      },
      t(0.08)
    );
  }

  if (targets.logoDom) {
    tl.to(
      targets.logoDom,
      {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: t(0.6),
        ease: 'power3.out',
      },
      t(0.12)
    );
  }

  // 0.35s - Metallic Light Sheen Sweep Across Logo
  if (targets.logoSheen) {
    tl.to(
      targets.logoSheen,
      {
        opacity: 0.8,
        xPercent: 150,
        duration: t(0.7),
        ease: 'power2.inOut',
      },
      t(0.35)
    );
  }

  // 0.25s - Company Name and Tagline Smooth Rise
  if (targets.companyName) {
    tl.to(
      targets.companyName,
      {
        autoAlpha: 1,
        y: 0,
        duration: t(0.5),
        ease: 'power3.out',
      },
      t(0.25)
    );
  }

  if (targets.tagline) {
    tl.to(
      targets.tagline,
      {
        autoAlpha: 1,
        y: 0,
        duration: t(0.45),
        ease: 'power3.out',
      },
      t(0.35)
    );
  }

  // Skip button appears smoothly after initial beat
  if (targets.skipBtn) {
    tl.to(
      targets.skipBtn,
      {
        autoAlpha: 1,
        duration: t(0.4),
        ease: 'power1.out',
      },
      t(0.4)
    );
  }

  // 0.2s - 1.45s: Smooth Progress Fill & Telemetry Counter
  const progressObj = { value: 0 };
  let lastStatusIdx = -1;

  tl.to(
    progressObj,
    {
      value: 100,
      duration: t(1.25),
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(progressObj.value);
        callbacks.onProgress?.(val);

        if (targets.progressBar) {
          targets.progressBar.style.width = `${val}%`;
        }
        if (targets.counterText) {
          targets.counterText.textContent = `${String(val).padStart(2, '0')}%`;
        }

        // Cycle through status messages
        const statusIdx =
          val < 30 ? 0 : val < 65 ? 1 : val < 92 ? 2 : 3;

        if (statusIdx !== lastStatusIdx) {
          lastStatusIdx = statusIdx;
          const statusMsg = STATUS_STEPS[statusIdx];
          callbacks.onStatusChange?.(statusMsg);
          if (targets.statusText) {
            targets.statusText.textContent = statusMsg;
          }
        }
      },
    },
    t(0.2)
  );

  // 1.50s - Golden Flash / Readiness Glow
  if (targets.flashOverlay) {
    tl.to(
      targets.flashOverlay,
      {
        autoAlpha: 0.35,
        duration: t(0.12),
        ease: 'power2.in',
      },
      t(1.48)
    ).to(
      targets.flashOverlay,
      {
        autoAlpha: 0,
        duration: t(0.35),
        ease: 'power2.out',
      },
      t(1.6)
    );
  }

  // 1.58s - Handover signal to Hero
  tl.call(() => callbacks.onTransitionStart?.(), [], t(1.58));

  // 1.62s - 1.95s: Silk-smooth Curtain Dissolve into Homepage
  if (targets.container) {
    tl.to(
      targets.container,
      {
        autoAlpha: 0,
        scale: 1.04,
        filter: 'blur(8px)',
        duration: t(0.42),
        ease: 'power3.inOut',
      },
      t(1.62)
    );
  }

  return tl;
}
