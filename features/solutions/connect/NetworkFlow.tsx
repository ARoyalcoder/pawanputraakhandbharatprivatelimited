'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import type { NetworkNode } from '@/data/divisions/connect';
import { cn } from '@/lib/utils';

const PACKETS = 4;
const CYCLE_MS = 2600;

/**
 * Internet → Fiber → Router → Switch → Server → Devices, with packets travelling the line.
 * Nodes are tabs; the active node's role is explained below.
 */
export function NetworkFlow({ nodes }: { nodes: NetworkNode[] }) {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const reduced = useReducedMotion();
  const baseId = useId();

  useEffect(() => {
    if (interacted || reduced) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % nodes.length), CYCLE_MS);
    return () => clearTimeout(timer);
  }, [active, interacted, reduced, nodes.length]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)' }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop);
        const selector = desktop ? '[data-packet="x"]' : '[data-packet="y"]';
        gsap.utils.toArray<HTMLElement>(selector).forEach((packet, i) => {
          gsap.to(packet, {
            keyframes: desktop
              ? { left: ['0%', '100%'], opacity: [0, 1, 1, 0], easeEach: 'none' }
              : { top: ['0%', '100%'], opacity: [0, 1, 1, 0], easeEach: 'none' },
            duration: 4.2,
            ease: 'none',
            repeat: -1,
            delay: (i * 4.2) / PACKETS,
          });
        });
      });
    },
    { scope: root }
  );

  const select = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = nodes.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const current = nodes[active];

  return (
    <div ref={root} className="rounded-panel border border-white/10 bg-navy-900/60 p-6 sm:p-10">
      <div className="relative">
        {/* Line + packets */}
        <div aria-hidden="true" className="absolute inset-x-[8%] top-9 hidden h-px bg-white/15 lg:block">
          <span className="absolute inset-0 bg-gradient-to-r from-connect/0 via-connect/60 to-connect/0" />
          {Array.from({ length: PACKETS }, (_, i) => (
            <span key={i} data-packet="x" className="absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-connect opacity-0 shadow-[0_0_14px_4px_rgb(74_144_255/0.6)]" />
          ))}
        </div>
        <div aria-hidden="true" className="absolute bottom-9 left-9 top-9 w-px bg-white/15 lg:hidden">
          {Array.from({ length: PACKETS }, (_, i) => (
            <span key={i} data-packet="y" className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-connect opacity-0 shadow-[0_0_14px_4px_rgb(74_144_255/0.6)]" />
          ))}
        </div>

        <div role="tablist" aria-label="How your network is connected" className="relative grid gap-6 lg:grid-cols-6 lg:gap-4">
          {nodes.map((node, i) => {
            const selected = i === active;
            return (
              <button
                key={node.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${baseId}-tab-${node.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group flex items-center gap-4 text-left lg:flex-col lg:gap-3 lg:text-center"
              >
                <span
                  className={cn(
                    'relative grid size-[4.5rem] shrink-0 place-items-center rounded-full border bg-navy-950 transition-all duration-500 ease-out-expo',
                    selected ? 'border-connect text-connect shadow-[0_0_0_6px_rgb(74_144_255/0.12)]' : 'border-white/15 text-white/60 group-hover:border-white/40'
                  )}
                >
                  <Icon name={node.icon} size={26} />
                </span>
                <span>
                  <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/40">0{i + 1}</span>
                  <span className={cn('mt-0.5 block text-[1.05rem] font-semibold transition-colors', selected ? 'text-white' : 'text-white/70')}>{node.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        aria-live="polite"
        className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-baseline sm:gap-6"
      >
        <p className="shrink-0 font-serif text-[1.4rem] italic text-connect">{current.label}</p>
        <p className="text-body text-white/75">{current.description}</p>
      </div>
    </div>
  );
}
