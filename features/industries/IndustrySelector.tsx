'use client';

import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { AIImageView } from '@/components/media/AIImageView';
import { Icon } from '@/components/ui/Icon';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { cn } from '@/lib/utils';
import type { IndustryCardData } from './types';

/** Industry tabs that swap imagery, needs, relevant solutions and CTAs. */
export function IndustrySelector({ items }: { items: IndustryCardData[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = items[active];

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
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-12 xl:grid-cols-[19rem_1fr]">
      <div
        role="tablist"
        aria-label="Industries"
        aria-orientation="vertical"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
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
                'group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-all duration-300',
                'lg:rounded-none lg:border-0 lg:border-b lg:border-navy-900/10 lg:px-1 lg:py-4',
                selected
                  ? 'border-navy-900 bg-navy-900 text-white lg:bg-transparent lg:text-navy-900'
                  : 'border-navy-900/15 text-navy-900/70 hover:text-navy-900'
              )}
            >
              <span className="hidden font-mono text-caption text-navy-900/35 lg:inline">{item.index}</span>
              <span
                className={cn(
                  'hidden size-9 place-items-center rounded-full transition-colors lg:grid',
                  selected ? 'bg-gold-500 text-navy-950' : 'bg-navy-900/5 text-navy-900/60 group-hover:bg-navy-900/10'
                )}
              >
                <Icon name={item.icon} size={17} />
              </span>
              <span className="whitespace-nowrap text-[0.95rem] font-semibold lg:text-[1.05rem]">{item.name}</span>
              <span
                aria-hidden="true"
                className={cn('ml-auto hidden h-px bg-gold-500 transition-all duration-500 lg:block', selected ? 'w-8' : 'w-0')}
              />
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className="grid overflow-hidden rounded-panel bg-white shadow-card lg:grid-cols-2"
      >
        <div key={`img-${current.id}`} className="relative aspect-[4/3] animate-[page-in_0.6s_var(--ease-out-expo)_both] lg:aspect-auto lg:min-h-[32rem]">
          <AIImageView image={current.image} sizes="(min-width: 1024px) 35vw, 100vw" />
          <div className="absolute left-4 top-4 rounded-full bg-navy-950/75 px-3 py-1.5 text-[0.78rem] font-medium text-white backdrop-blur-sm">
            {current.audience}
          </div>
        </div>

        <div key={`copy-${current.id}`} className="flex flex-col p-7 animate-[page-in_0.6s_var(--ease-out-expo)_both] sm:p-9">
          <p className="font-mono text-caption uppercase text-gold-700">
            {current.index} / {String(items.length).padStart(2, '0')} · {current.name}
          </p>
          <h3 className="mt-3 text-h3 text-navy-900">{current.headline}</h3>
          <p className="mt-3 text-body text-muted">{current.summary}</p>

          <h4 className="mt-7 text-small font-semibold text-navy-900">Typical needs</h4>
          <ul className="mt-3 grid gap-2">
            {current.needs.slice(0, 4).map((need) => (
              <li key={need} className="flex items-start gap-2.5 text-small text-ink-soft">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-600" />
                {need}
              </li>
            ))}
          </ul>

          <h4 className="mt-7 text-small font-semibold text-navy-900">Relevant solutions</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {current.solutions.map((s) => (
              <li key={s.division}>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 px-3 py-1.5 text-[0.8rem] font-medium text-navy-900 transition-colors hover:border-navy-900/40"
                >
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: s.accent }} />
                  {s.divisionName.replace('Pawan Putra ', '')}
                  <span className="text-muted">· {s.services.slice(0, 2).join(', ')}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
            <QuoteButton size="md" source={`industry-${current.id}`}>
              Discuss your requirement
            </QuoteButton>
            <Link href={current.href} className="group inline-flex items-center gap-1.5 text-small font-semibold text-navy-900">
              <span className="link-underline">{current.name} solutions</span>
              <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
