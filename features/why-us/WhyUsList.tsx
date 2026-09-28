'use client';

import { useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import type { NumberedPoint } from '@/types/content';

/** Numbered pillars with a scroll-driven progress line and per-item highlight. */
export function WhyUsList({ items }: { items: NumberedPoint[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      gsap.fromTo(
        '[data-progress]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 70%', scrub: true } }
      );
      gsap.utils.toArray<HTMLElement>('[data-item]').forEach((item) => {
        gsap.fromTo(
          item,
          { '--active': 0.35 },
          {
            '--active': 1,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top 75%', end: 'top 45%', scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <ol ref={root} className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-[1.35rem] top-0 w-px bg-white/10 sm:left-[1.85rem]" />
      <span
        aria-hidden="true"
        data-progress
        className="absolute bottom-0 left-[1.35rem] top-0 w-px origin-top bg-gradient-to-b from-gold-300 to-gold-600 sm:left-[1.85rem] motion-reduce:hidden"
      />
      {items.map((item) => (
        <li
          key={item.id}
          data-item
          className="relative grid grid-cols-[2.75rem_1fr] gap-5 py-8 [--active:1] sm:grid-cols-[3.75rem_1fr] sm:gap-8 sm:py-10"
          style={{ opacity: 'var(--active)' }}
        >
          <span className="relative z-10 grid size-11 place-items-center rounded-full border border-gold-500/50 bg-navy-950 text-gold-300 sm:size-15">
            <Icon name={item.icon} size={20} />
          </span>
          <div>
            <p className="font-serif text-[2.4rem] italic leading-none text-gold-300/80 sm:text-[3rem]">{item.index}</p>
            <h3 className="mt-3 text-h3 text-white">{item.title}</h3>
            <p className="mt-3 max-w-xl text-body text-white/65">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
