'use client';

import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ThreeScene } from '@/components/3d/ThreeScene';
import { SceneLoader } from '@/components/3d/SceneLoader';
import { ConceptArt } from '@/components/media/ConceptArt';
import { Icon } from '@/components/ui/Icon';
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery';
import type { SpaceStage } from '@/data/divisions/space';
import { cn } from '@/lib/utils';

const fallback = <ConceptArt variant="space" />;

const SpaceJourneyScene = dynamic(() => import('@/components/3d/scenes/SpaceJourneyScene'), {
  ssr: false,
  loading: () => <SceneLoader>{fallback}</SceneLoader>,
});

const STAGE_MS = 4200;

/** Plot → Design → Construction → Interior → Finished Space, as an interactive 3D journey. */
export function SpaceJourney({ stages }: { stages: SpaceStage[] }) {
  const [stage, setStage] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  useEffect(() => {
    if (interacted || reduced) return;
    const timer = setTimeout(() => setStage((s) => (s + 1) % stages.length), STAGE_MS);
    return () => clearTimeout(timer);
  }, [stage, interacted, reduced, stages.length]);

  const select = (i: number) => {
    setInteracted(true);
    setStage(i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = stages.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index === 0 ? last : index - 1)
      : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const current = stages[stage];

  return (
    <div className="grid overflow-hidden rounded-panel border border-white/10 bg-navy-900 lg:grid-cols-12">
      <div className="relative aspect-[4/3] bg-[radial-gradient(70%_70%_at_50%_45%,#12305c,#020b1d)] lg:col-span-8 lg:aspect-auto lg:min-h-[34rem]">
        <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-40" />
        <ThreeScene
          splineUrl={process.env.NEXT_PUBLIC_SPLINE_SPACE_URL || undefined}
          fallback={fallback}
          render={(ctx) => <SpaceJourneyScene {...ctx} stage={stage} pointer={finePointer} />}
        />
        <p
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${current.id}`}
          aria-live="polite"
          className="absolute bottom-4 left-4 right-4 rounded-card border border-white/10 bg-navy-950/75 p-4 text-small text-white/80 backdrop-blur-md sm:right-auto sm:max-w-sm"
        >
          <span className="block font-serif text-[1.2rem] italic text-space">{current.label}</span>
          {current.description}
        </p>
      </div>

      <div role="tablist" aria-label="Project stages" aria-orientation="vertical" className="flex flex-col border-t border-white/10 lg:col-span-4 lg:border-l lg:border-t-0">
        {stages.map((s, i) => {
          const selected = i === stage;
          const done = i < stage;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${baseId}-tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'group flex flex-1 items-center gap-4 border-b border-white/10 px-6 py-4 text-left transition-colors last:border-b-0 lg:py-0',
                selected ? 'bg-space/10' : 'hover:bg-white/[0.03]'
              )}
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500',
                  selected ? 'border-space bg-space text-navy-950' : done ? 'border-space/60 text-space' : 'border-white/15 text-white/50'
                )}
              >
                <Icon name={s.icon} size={18} />
              </span>
              <span>
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/40">{s.index}</span>
                <span className={cn('block font-semibold', selected ? 'text-white' : 'text-white/65')}>{s.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
