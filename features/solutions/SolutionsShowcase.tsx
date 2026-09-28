'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AIImageView } from '@/components/media/AIImageView';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import type { SolutionCardData } from './types';

/** Expanding panels on desktop; a swipeable card rail below lg. */
export function SolutionsShowcase({ items }: { items: SolutionCardData[] }) {
  return (
    <>
      <ExpandingPanels items={items} />
      <CardRail items={items} />
    </>
  );
}

function ExpandingPanels({ items }: { items: SolutionCardData[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <div className="hidden h-[37rem] gap-3 lg:flex">
      {items.map((item, i) => {
        const open = i === active;
        const regionId = `${baseId}-${item.id}`;
        return (
          <article
            key={item.id}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            className="group relative isolate min-w-0 overflow-hidden rounded-card border border-white/10 bg-navy-900 transition-[flex-grow] duration-700 ease-out-expo"
            style={{ flexGrow: open ? 4.4 : 1, flexBasis: 0 }}
          >
            <div
              className={cn(
                'absolute inset-0 -z-10 transition-[transform,opacity] duration-1000 ease-out-expo',
                open ? 'scale-100 opacity-100' : 'scale-110 opacity-45'
              )}
            >
              <AIImageView image={item.image} sizes="(min-width: 1024px) 60vw, 100vw" showLabel={open} />
            </div>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/10" />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left transition-transform duration-700 ease-out-expo"
              style={{ backgroundColor: item.accent, transform: `scaleX(${open ? 1 : 0})` }}
            />

            <h3 className="absolute inset-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="flex size-full flex-col items-start justify-between p-6 text-left focus-visible:outline-offset-[-4px]"
              >
                <span className="flex w-full items-center justify-between">
                  <span className="font-mono text-caption text-white/60">{item.index}</span>
                  <span
                    className={cn(
                      'grid size-10 place-items-center rounded-full border transition-colors duration-500',
                      open ? 'border-transparent text-navy-950' : 'border-white/15 text-white/80'
                    )}
                    style={open ? { backgroundColor: item.accent } : undefined}
                  >
                    <Icon name={item.icon} size={18} />
                  </span>
                </span>
                <span
                  className={cn(
                    'whitespace-nowrap text-[1.35rem] font-semibold tracking-tight text-white transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180',
                    open ? 'opacity-0' : 'opacity-100 delay-200'
                  )}
                >
                  {item.name}
                </span>
              </button>
            </h3>

            <div
              id={regionId}
              inert={!open}
              className={cn(
                'absolute bottom-0 left-0 w-[29rem] p-8 transition-[opacity,translate] duration-500 ease-out-expo xl:w-[37rem] xl:p-10 2xl:w-[40rem]',
                open ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-6 opacity-0'
              )}
            >
              <p className="font-serif text-[1.3rem] italic" style={{ color: item.accent }}>
                {item.tagline}
              </p>
              <p className="mt-1 text-h2 font-display text-white">{item.name}</p>
              <p className="mt-3 max-w-xl text-body text-white/70">{item.summary}</p>
              <ul className="mt-5 flex max-w-xl flex-wrap gap-2">
                {item.services.map((service) => (
                  <li key={service} className="rounded-full border border-white/15 bg-navy-950/40 px-3 py-1 text-[0.8rem] text-white/80 backdrop-blur-sm">
                    {service}
                  </li>
                ))}
              </ul>
              <ButtonLink href={item.href} className="mt-7" withArrow>
                Explore {item.short}
              </ButtonLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function CardRail({ items }: { items: SolutionCardData[] }) {
  return (
    <div className="-mx-5 sm:-mx-8 lg:hidden">
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8" aria-label="PPAB solutions">
        {items.map((item) => (
          <li key={item.id} className="w-[84%] shrink-0 snap-start xs:w-[70%] sm:w-[46%]">
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-navy-900">
              <div className="relative aspect-[4/3]">
                <AIImageView image={item.image} sizes="(min-width: 640px) 46vw, 84vw" />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: item.accent }} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-caption text-white/50">{item.index}</p>
                <h3 className="mt-2 text-h3 text-white">{item.name}</h3>
                <p className="mt-1 font-serif text-[1.1rem] italic" style={{ color: item.accent }}>
                  {item.tagline}
                </p>
                <p className="mt-3 text-small text-white/70">{item.summary}</p>
                <Link href={item.href} className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-semibold text-gold-300">
                  Explore {item.short}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
