'use client';

import Link from 'next/link';
import { useId, useRef, useState, useEffect, type KeyboardEvent } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIImageView } from '@/components/media/AIImageView';
import { Icon } from '@/components/ui/Icon';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { preloadNextIndustry } from '@/lib/loading/preload';
import { cn } from '@/lib/utils';
import type { IndustryCardData } from './types';

/** Industry tabs with Framer Motion fluid tab sliding and cross-fade panel transitions. */
export function IndustrySelector({ items }: { items: IndustryCardData[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = items[active];

  // Predictive prefetch: prefetch the next likely industry photography
  useEffect(() => {
    const nextItem = items[(active + 1) % items.length];
    if (nextItem?.image?.src) {
      preloadNextIndustry(nextItem.image.src);
    }
  }, [active, items]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Sleek Horizontal Industry Navigation Rail */}
      <div
        role="tablist"
        aria-label="Industry Sectors"
        className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {items.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-300 select-none cursor-pointer',
                selected
                  ? 'text-white'
                  : 'bg-white text-navy-900/70 border border-line hover:border-navy-900/30 hover:text-navy-900 shadow-sm'
              )}
            >
              {selected && (
                <motion.span
                  layoutId="active-industry-tab-pill"
                  className="absolute inset-0 rounded-full bg-navy-900 shadow-md ring-1 ring-gold-500/50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span
                className={cn(
                  'relative z-10 grid size-5 place-items-center rounded-full text-[10px] font-mono transition-colors',
                  selected ? 'bg-gold-500 text-navy-950 font-bold' : 'bg-navy-900/5 text-navy-900/60'
                )}
              >
                {item.index}
              </span>
              <Icon
                name={item.icon}
                size={14}
                className={cn(
                  'relative z-10 transition-colors',
                  selected ? 'text-gold-300' : 'text-navy-900/60 group-hover:text-navy-900'
                )}
              />
              <span className="relative z-10">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Refined Industry Showcase Card with Fluid Crossfade */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="overflow-hidden rounded-3xl border border-line bg-white shadow-card"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-12 items-stretch min-h-[22rem] lg:min-h-[24rem]"
          >
            {/* Left: Photorealistic Commercial Photography Frame */}
            <div className="relative lg:col-span-5 aspect-[16/10] lg:aspect-auto h-full min-h-[16rem] lg:min-h-full overflow-hidden bg-navy-950">
              <AIImageView
                image={current.image}
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/20 pointer-events-none" />
              <div className="absolute left-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md border border-white/10 shadow-sm">
                {current.audience}
              </div>
            </div>

            {/* Right: Focused Content */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-9">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-700">
                    {current.index} / {String(items.length).padStart(2, '0')} · {current.name}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
                    <ShieldCheck className="size-3.5 text-success" /> Turnkey PPAB Deployment
                  </span>
                </div>

                <h3 className="mt-3.5 text-xl sm:text-2xl font-bold font-heading text-navy-900 leading-snug">
                  {current.headline}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed max-w-xl">
                  {current.summary}
                </p>

                {/* Delivered PPAB Capabilities */}
                <div className="mt-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">
                    Delivered PPAB Capabilities:
                  </div>
                  <ul className="flex flex-wrap gap-2" aria-label={`${current.name} solutions`}>
                    {current.solutions.map((s) => (
                      <li key={s.division}>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-surface px-3 py-1 text-xs font-medium text-navy-900 transition-colors hover:border-navy-900/30">
                          <span className="size-1.5 rounded-full" style={{ backgroundColor: s.accent }} />
                          <span className="font-semibold">{s.divisionName.replace('Pawan Putra ', '')}:</span>
                          <span className="text-muted">{s.services.slice(0, 2).join(', ')}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="mt-7 flex flex-wrap items-center gap-3 pt-4 border-t border-line">
                <Link
                  href={current.href}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-950 transition-all duration-300 shadow-md active:scale-[0.98]"
                >
                  <span>Explore {current.name} Solutions</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <QuoteButton size="sm" variant="outline-dark" source={`industry-${current.id}`}>
                  Discuss Requirement
                </QuoteButton>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
