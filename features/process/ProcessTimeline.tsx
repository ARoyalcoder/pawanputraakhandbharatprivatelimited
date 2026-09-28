'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import type { NumberedPoint } from '@/types/content';
import { cn } from '@/lib/utils';

/**
 * Horizontal timeline on desktop, vertical stepper on smaller screens. The connecting
 * line fills with scroll and steps light up as it reaches them. Without motion, all
 * steps are shown active.
 */
export function ProcessTimeline({ steps, tone = 'light' }: { steps: NumberedPoint[]; tone?: 'light' | 'dark' }) {
  const root = useRef<HTMLDivElement>(null);
  const reachedRef = useRef(steps.length);
  const [reached, setReached] = useState(steps.length);
  const dark = tone === 'dark';

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      const update = (progress: number) => {
        const next = progress <= 0.01 ? 0 : Math.min(steps.length, Math.floor(progress * (steps.length - 1) + 1.0001));
        if (next !== reachedRef.current) {
          reachedRef.current = next;
          setReached(next);
        }
      };
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)' }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const fill = desktop ? '[data-fill-x]' : '[data-fill-y]';
        const axis = desktop ? 'scaleX' : 'scaleY';
        update(0);
        gsap.fromTo(fill, { [axis]: 0 }, {
          [axis]: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: desktop ? 'top 70%' : 'top 75%',
            end: desktop ? 'bottom 60%' : 'bottom 65%',
            scrub: 0.4,
            onUpdate: (self) => update(self.progress),
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      {/* Desktop rail */}
      <div aria-hidden="true" className={cn('absolute left-6 right-6 top-6 hidden h-px lg:block', dark ? 'bg-white/12' : 'bg-navy-900/12')}>
        <span data-fill-x className="absolute inset-0 origin-left bg-gold-500" />
      </div>
      {/* Mobile rail */}
      <div aria-hidden="true" className={cn('absolute bottom-6 left-6 top-6 w-px lg:hidden', dark ? 'bg-white/12' : 'bg-navy-900/12')}>
        <span data-fill-y className="absolute inset-0 origin-top bg-gold-500" />
      </div>

      <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-6">
        {steps.map((step, i) => {
          const on = i < reached;
          return (
            <li key={step.id} className="grid grid-cols-[3rem_1fr] gap-5 lg:block">
              <span
                className={cn(
                  'relative z-10 grid size-12 place-items-center rounded-full border transition-all duration-500 ease-out-expo',
                  on
                    ? 'border-gold-500 bg-gold-500 text-navy-950 shadow-gold'
                    : dark
                      ? 'border-white/20 bg-navy-950 text-white/60'
                      : 'border-navy-900/15 bg-surface text-navy-900/50'
                )}
              >
                <Icon name={step.icon} size={20} />
              </span>
              <div className={cn('transition-opacity duration-500 lg:mt-7', on ? 'opacity-100' : 'opacity-55')}>
                <p className={cn('font-mono text-caption', dark ? 'text-gold-300' : 'text-gold-700')}>Step {step.index}</p>
                <h3 className={cn('mt-2 text-h4', dark ? 'text-white' : 'text-navy-900')}>{step.title}</h3>
                <p className={cn('mt-2 text-small', dark ? 'text-white/65' : 'text-muted')}>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
