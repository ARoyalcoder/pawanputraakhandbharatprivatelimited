import { gsap, ScrollTrigger, SplitText } from '@/lib/animations/gsap';
import { duration, ease, revealFrom, revealStart, revealTo, staggerEach, type RevealVariant } from './presets';

const VARIANTS = Object.keys(revealFrom) as RevealVariant[];

function variantOf(el: Element): RevealVariant {
  const value = el.getAttribute('data-reveal') as RevealVariant | null;
  return value && VARIANTS.includes(value) ? value : 'up';
}

function delayOf(el: Element): number {
  const raw = el.getAttribute('data-reveal-delay');
  return raw ? Number.parseFloat(raw) || 0 : 0;
}

/** Reveal a single element immediately (used for late-mounted content). */
export function revealNow(el: Element) {
  const variant = variantOf(el);
  gsap.fromTo(el, revealFrom[variant], {
    ...revealTo[variant],
    duration: duration.base,
    ease: ease.out,
    delay: delayOf(el),
    overwrite: true,
  });
}

/**
 * Batch scroll reveals for every [data-reveal] element under root. Elements entering
 * together are staggered, which gives card grids a natural cascade without extra markup.
 */
export function initBatchReveals(root: ParentNode, seen: WeakSet<Element>) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter((el) => !seen.has(el));
  elements.forEach((el) => seen.add(el));

  for (const variant of VARIANTS) {
    const group = elements.filter((el) => variantOf(el) === variant);
    if (!group.length) continue;

    gsap.set(group, revealFrom[variant]);
    ScrollTrigger.batch(group, {
      start: revealStart,
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          ...revealTo[variant],
          duration: variant === 'mask' ? duration.slow : duration.base,
          ease: ease.out,
          stagger: staggerEach,
          delay: delayOf(batch[0]),
          overwrite: true,
        }),
    });
  }
}

/** Scrubbed vertical parallax for [data-parallax="0.15"] elements. */
export function initParallax(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number.parseFloat(el.dataset.parallax || '0.15');
    gsap.fromTo(
      el,
      { yPercent: speed * 50 },
      {
        yPercent: speed * -50,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/** Line-by-line masked heading reveals for [data-split] elements. */
export function initSplitHeadings(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { autoAlpha: 1 });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: duration.slow,
          ease: ease.out,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: revealStart, once: true },
        });
      },
    });
  });
}

/** Make every motion-managed element visible without animating (reduced motion). */
export function showAllStatic(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-reveal], [data-split]').forEach((el) => {
    gsap.set(el, { clearProps: 'all', autoAlpha: 1 });
  });
}
