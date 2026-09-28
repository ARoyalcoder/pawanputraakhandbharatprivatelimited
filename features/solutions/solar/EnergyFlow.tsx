'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import type { SolarSystemType } from '@/data/divisions/solar';
import { cn } from '@/lib/utils';

type Flow = SolarSystemType['flows'][number];

const nodes = {
  sun: { x: 90, y: 72, label: 'Sun' },
  panels: { x: 240, y: 140, label: 'Solar panels' },
  inverter: { x: 400, y: 220, label: 'Inverter' },
  home: { x: 630, y: 110, label: 'Your property' },
  battery: { x: 400, y: 370, label: 'Battery' },
  grid: { x: 630, y: 330, label: 'Grid / net meter' },
} as const;

const paths: Record<Flow, string> = {
  'panels-inverter': 'M252 148 C 320 150, 340 220, 386 220',
  'inverter-home': 'M414 220 C 500 220, 540 112, 612 110',
  'inverter-grid': 'M414 220 C 500 220, 540 330, 612 330',
  'grid-home': 'M630 312 C 668 260, 668 170, 630 128',
  'inverter-battery': 'M400 236 L 400 352',
  'battery-home': 'M416 370 C 520 370, 560 190, 618 124',
};

function Glyph({ id }: { id: keyof typeof nodes }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'sun':
      return (
        <g {...s}>
          <circle r="9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="0" y1="-14" x2="0" y2="-18" transform={`rotate(${a})`} />
          ))}
        </g>
      );
    case 'panels':
      return <g {...s}><path d="M-14 8 L-9 -8 H14 L9 8 Z M-11 0 H11 M-1 -8 L-4 8 M6 -8 L3 8" /></g>;
    case 'inverter':
      return <g {...s}><rect x="-12" y="-10" width="24" height="20" rx="3" /><path d="M-6 3 Q -3 -4 0 0 T 6 -3" /></g>;
    case 'home':
      return <g {...s}><path d="M-13 1 L0 -11 L13 1 M-9 -2 V11 H9 V-2 M-3 11 V4 H3 V11" /></g>;
    case 'battery':
      return <g {...s}><rect x="-12" y="-7" width="22" height="14" rx="2" /><path d="M12 -3 V3 M-7 0 H3 M-2 -4 V4" /></g>;
    default:
      return <g {...s}><path d="M0 -13 L-8 13 M0 -13 L8 13 M-5 3 H5 M-7 8 H7 M-10 -6 H10" /></g>;
  }
}

/** Solar energy-flow diagram driven by system-type tabs. */
export function EnergyFlow({ systems }: { systems: SolarSystemType[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const system = systems[active];
  const activeFlows = new Set(system.flows);
  const usesBattery = activeFlows.has('inverter-battery');
  const usesGrid = activeFlows.has('inverter-grid');

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = systems.length - 1;
    const next = e.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const dimmed = (id: keyof typeof nodes) => (id === 'battery' && !usesBattery) || (id === 'grid' && !usesGrid);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Solar system types" className="inline-flex rounded-full border border-navy-900/10 bg-white p-1 shadow-card">
          {systems.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'h-11 rounded-full px-5 text-small font-semibold transition-colors duration-300 sm:px-6',
                i === active ? 'bg-navy-900 text-white' : 'text-navy-900/70 hover:text-navy-900'
              )}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${system.id}`} aria-live="polite" className="mt-8">
          <h3 className="text-h3 text-navy-900">{system.headline}</h3>
          <p className="mt-3 text-body text-muted">{system.description}</p>
          <p className="mt-5 text-small">
            <span className="font-semibold text-navy-900">Best suited for: </span>
            <span className="text-ink-soft">{system.suitedFor}</span>
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {system.components.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-small text-ink-soft">
                <Check aria-hidden="true" className="size-4 text-solar" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="relative overflow-hidden rounded-panel bg-navy-950 p-3 sm:p-6">
          <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-60" />
          <svg viewBox="0 0 720 440" className="relative w-full" role="img" aria-label={`Energy flow for ${system.name} solar: ${system.description}`}>
            <defs>
              <radialGradient id={`${baseId}-sun`}>
                <stop offset="0" stopColor="#f4c95d" stopOpacity="0.55" />
                <stop offset="1" stopColor="#f4c95d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={nodes.sun.x} cy={nodes.sun.y} r="80" fill={`url(#${baseId}-sun)`} />
            <path d="M104 84 L 226 132" stroke="#f4c95d" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="3 7" className="motion-safe:animate-[dash-flow_6s_linear_infinite]" />

            {(Object.keys(paths) as Flow[]).map((flow) => {
              const on = activeFlows.has(flow);
              return (
                <g key={flow}>
                  <path d={paths[flow]} fill="none" stroke="#ffffff" strokeOpacity={on ? 0.12 : 0.05} strokeWidth="6" strokeLinecap="round" />
                  <path
                    d={paths[flow]}
                    fill="none"
                    stroke={flow.includes('grid') ? '#6aa5ff' : '#f2a516'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="6 12"
                    className={cn('transition-opacity duration-500', on && 'motion-safe:animate-[dash-flow_4.5s_linear_infinite]')}
                    opacity={on ? 1 : 0}
                  />
                </g>
              );
            })}

            {(Object.keys(nodes) as (keyof typeof nodes)[]).map((id) => {
              const n = nodes[id];
              const off = dimmed(id);
              return (
                <g key={id} transform={`translate(${n.x} ${n.y})`} className="transition-opacity duration-500" opacity={off ? 0.25 : 1}>
                  <circle r="26" fill="#0b2347" stroke={id === 'sun' ? '#f4c95d' : off ? '#ffffff33' : '#d8a62a'} strokeWidth="1.5" />
                  <g className={id === 'grid' ? 'text-[#6aa5ff]' : 'text-[#f4c95d]'}>
                    <Glyph id={id} />
                  </g>
                  <text y="46" textAnchor="middle" fill="#ffffff" fillOpacity="0.8" fontSize="13" fontFamily="var(--font-manrope)">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
