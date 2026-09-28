'use client';

import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { DigitalCluster } from '@/data/divisions/digital';
import type { ServiceItem } from '@/types/content';
import { cn } from '@/lib/utils';

const r2 = (n: number) => Math.round(n * 100) / 100;
const RADIUS = 40;

/** Services orbiting the business; cluster tabs highlight how they work together. */
export function DigitalEcosystem({ clusters, services }: { clusters: DigitalCluster[]; services: ServiceItem[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const cluster = clusters[active];
  const highlighted = new Set(cluster.serviceIds);

  // Order services by cluster so each group sits together on the orbit.
  const ordered = clusters.flatMap((c) => c.serviceIds.map((id) => services.find((s) => s.id === id)!)).filter(Boolean);
  const positioned = ordered.map((service, i) => {
    const angle = (i / ordered.length) * Math.PI * 2 - Math.PI / 2;
    return { service, x: r2(50 + Math.cos(angle) * RADIUS), y: r2(50 + Math.sin(angle) * RADIUS) };
  });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = clusters.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Digital service groups" aria-orientation="vertical" className="grid gap-3">
          {clusters.map((c, i) => {
            const selected = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${baseId}-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-card border px-6 py-5 text-left transition-all duration-500 ease-out-expo',
                  selected ? 'border-digital/60 bg-digital/12' : 'border-white/10 hover:border-white/25'
                )}
              >
                <span>
                  <span className={cn('block text-h4', selected ? 'text-white' : 'text-white/75')}>{c.label}</span>
                  <span className="mt-1 block text-small text-white/55">{c.description}</span>
                </span>
                <span className={cn('font-mono text-caption', selected ? 'text-digital' : 'text-white/35')}>
                  {String(c.serviceIds.length).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${cluster.id}`} className="lg:col-span-7">
        {/* Orbit (tablet and up) */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-[36rem] md:block">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="#8c73f7" strokeOpacity="0.25" strokeWidth="0.2" strokeDasharray="0.6 1.4" />
            {positioned.map(({ service, x, y }) => {
              const on = highlighted.has(service.id);
              return (
                <line
                  key={service.id}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={on ? '#8c73f7' : '#ffffff'}
                  strokeOpacity={on ? 0.9 : 0.08}
                  strokeWidth={on ? 0.35 : 0.2}
                  strokeDasharray={on ? '1 1.5' : undefined}
                  className={cn('transition-all duration-500', on && 'motion-safe:animate-[dash-flow_9s_linear_infinite]')}
                />
              );
            })}
          </svg>
          <div className="absolute left-1/2 top-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-digital/40 bg-navy-950 text-center shadow-[0_0_60px_-10px_rgb(140_115_247/0.6)]">
            <div>
              <Image src="/brand/ppab-mark.png" alt="" width={331} height={320} sizes="40px" className="mx-auto h-9 w-auto" />
              <p className="mt-2 text-[0.8rem] font-semibold text-white">Your business</p>
            </div>
          </div>
          <ul>
            {positioned.map(({ service, x, y }) => {
              const on = highlighted.has(service.id);
              return (
                <li
                  key={service.id}
                  className={cn(
                    'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.78rem] font-medium transition-all duration-500 ease-out-expo',
                    on ? 'scale-105 border-digital bg-digital text-white shadow-[0_8px_24px_-8px_rgb(140_115_247/0.8)]' : 'border-white/12 bg-navy-900 text-white/55'
                  )}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <Icon name={service.icon} size={14} />
                  {service.name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* List (mobile) */}
        <ul className="grid gap-3 md:hidden">
          {cluster.serviceIds.map((id) => {
            const service = services.find((s) => s.id === id)!;
            return (
              <li key={id} className="flex items-start gap-4 rounded-card border border-white/10 bg-navy-900 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-digital/15 text-digital">
                  <Icon name={service.icon} size={18} />
                </span>
                <span>
                  <span className="block font-semibold text-white">{service.name}</span>
                  <span className="mt-1 block text-small text-white/60">{service.summary}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
