'use client';

import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Rotate3d } from 'lucide-react';
import { ThreeScene } from '@/components/3d/ThreeScene';
import { SceneLoader } from '@/components/3d/SceneLoader';
import type { OrbitInput } from '@/components/3d/scenes/SpaceJourneyScene';
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

const STAGE_SECONDS = 6.5;
/** A drag across the full width of the scene turns the model this far, in radians. */
const TURN_PER_WIDTH = Math.PI * 1.3;

const control = 'grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white';

/**
 * Plot → Design → Construction → Interior → Finished Space as one 3D model that is surveyed,
 * drawn, built, furnished and landscaped in front of the visitor. It plays through on its own;
 * the model can be dragged round, and any stage picked from the list.
 */
export function SpaceJourney({ stages }: { stages: SpaceStage[] }) {
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState({ hover: false, focus: false, drag: false });
  const [inView, setInView] = useState(false);
  const [live, setLive] = useState(false);
  const [rotated, setRotated] = useState(false);
  const reduced = useReducedMotion();
  const vertical = useMediaQuery('(min-width: 1024px)');
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const orbit = useRef<OrbitInput>({ yaw: 0, pitch: 0, velocity: 0, dragging: false, hoverX: 0, hoverY: 0 });
  const drag = useRef<{ id: number; x: number; y: number; time: number } | null>(null);
  const baseId = useId();

  // The walkthrough only runs while the section is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const last = stages.length - 1;
  const current = stages[stage];
  const cycling = auto && !reduced;
  const running = cycling && inView && !hold.hover && !hold.focus && !hold.drag;

  const select = (index: number) => {
    setAuto(false);
    setStage(index);
  };
  const step = (by: number) => select((stage + by + stages.length) % stages.length);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
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

  // Dragging turns the model; a sideways drag on touch does the same and leaves scrolling alone.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!live || (e.pointerType === 'mouse' && e.button !== 0) || (e.target as HTMLElement).closest('button')) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp };
    Object.assign(orbit.current, { dragging: true, velocity: 0, hoverX: 0, hoverY: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
    setHold((h) => ({ ...h, drag: true }));
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!live) return;
    const input = orbit.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const held = drag.current;
    if (held?.id === e.pointerId) {
      const turn = (-(e.clientX - held.x) / rect.width) * TURN_PER_WIDTH;
      const elapsed = Math.max(8, e.timeStamp - held.time);
      input.yaw += turn;
      input.pitch = Math.min(0.55, Math.max(-0.3, input.pitch + ((e.clientY - held.y) / rect.height) * 0.9));
      input.velocity = Math.min(4, Math.max(-4, (turn / elapsed) * 600));
      if (!rotated && Math.abs(e.clientX - held.x) > 2) setRotated(true);
      drag.current = { id: held.id, x: e.clientX, y: e.clientY, time: e.timeStamp };
    } else if (e.pointerType === 'mouse') {
      input.hoverX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      input.hoverY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    orbit.current.dragging = false;
    setHold((h) => ({ ...h, drag: false }));
  };

  const onPointerLeave = () => {
    Object.assign(orbit.current, { hoverX: 0, hoverY: 0 });
  };

  return (
    <div
      ref={root}
      className="grid overflow-hidden rounded-panel border border-white/10 bg-navy-900 lg:grid-cols-12"
      onFocus={() => setHold((h) => ({ ...h, focus: true }))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold((h) => ({ ...h, focus: false }))}
    >
      <div className="relative flex flex-col lg:col-span-8">
        <div
          className={cn(
            'relative aspect-[4/3] select-none overflow-hidden bg-[radial-gradient(70%_70%_at_50%_45%,#12305c,#020b1d)] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[27rem] lg:flex-1',
            live && 'cursor-grab touch-pan-y active:cursor-grabbing'
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={onPointerLeave}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-40" />
          <div className="absolute inset-0">
            <ThreeScene
              splineUrl={process.env.NEXT_PUBLIC_SPLINE_SPACE_URL || undefined}
              fallback={fallback}
              render={(ctx) => <SpaceJourneyScene {...ctx} stage={stage} orbitRef={orbit} onReady={() => setLive(true)} />}
            />
          </div>

          <p
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/70 px-3 py-2 type-caption text-white/80 backdrop-blur-md transition-opacity duration-500',
              live && !rotated ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Rotate3d className="size-4 text-space" />
            Drag to rotate
          </p>

          <div className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-full border border-white/10 bg-navy-950/70 p-1 backdrop-blur-md">
            <button type="button" onClick={() => step(-1)} aria-label="Previous stage" className={control}>
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            {!reduced && (
              <button type="button" onClick={() => setAuto((on) => !on)} aria-label={auto ? 'Pause the walkthrough' : 'Play the walkthrough'} className={control}>
                {auto ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
              </button>
            )}
            <button type="button" onClick={() => step(1)} aria-label="Next stage" className={control}>
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        {/* Stage caption: over the scene on wider screens, under it on phones */}
        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${current.id}`}
          aria-live={cycling ? 'off' : 'polite'}
          className="pointer-events-none border-t border-white/10 p-5 sm:absolute sm:left-4 sm:top-4 sm:max-w-[19rem] sm:rounded-card sm:border sm:bg-navy-950/70 sm:p-4 sm:backdrop-blur-md"
        >
          {/* Re-keyed so the copy rises in again for each stage */}
          <div key={current.id}>
            <p className="menu-rise type-eyebrow text-space">
              Stage {current.index} <span className="text-white/45">/ {stages[last].index}</span>
            </p>
            <h3 className="menu-rise mt-1 type-h4 text-white" style={{ animationDelay: '50ms' }}>
              {current.label}
            </h3>
            <p className="menu-rise mt-1.5 type-body-sm text-white/75" style={{ animationDelay: '100ms' }}>
              {current.description}
            </p>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Project stages"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className="relative grid border-t border-white/10 lg:col-span-4 lg:flex lg:flex-col lg:border-l lg:border-t-0"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`, '--inset': `${50 / stages.length}%`, '--done': `${(stage / last) * 100}%` } as CSSProperties}
        onPointerEnter={() => setHold((h) => ({ ...h, hover: true }))}
        onPointerLeave={() => setHold((h) => ({ ...h, hover: false }))}
      >
        {/* Rail: how far the project has come */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[var(--inset)] right-[var(--inset)] top-8 h-px bg-white/12 lg:bottom-[var(--inset)] lg:left-11 lg:right-auto lg:top-[var(--inset)] lg:h-auto lg:w-px"
        >
          <span className="block h-full w-[var(--done)] bg-space transition-[width,height] duration-700 ease-out-expo motion-reduce:transition-none lg:h-[var(--done)] lg:w-full" />
        </span>

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
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                'group relative flex flex-col items-center gap-1.5 px-1 py-3 text-center transition-colors duration-300 lg:flex-1 lg:flex-row lg:gap-4 lg:border-b lg:border-white/10 lg:px-6 lg:py-0 lg:text-left lg:last:border-b-0',
                selected ? 'bg-space/10' : 'hover:bg-white/[0.04]'
              )}
            >
              <span
                className={cn(
                  'relative grid size-10 shrink-0 place-items-center rounded-full border transition-[color,background-color,border-color,scale] duration-500',
                  selected ? 'scale-110 border-space bg-space text-navy-950' : done ? 'border-space/60 bg-navy-900 text-space' : 'border-white/15 bg-navy-900 text-white/50 group-hover:border-white/35 group-hover:text-white/80'
                )}
              >
                <Icon name={s.icon} size={18} />
              </span>
              <span className="min-w-0">
                <span className="block type-eyebrow text-white/55">{s.index}</span>
                <span className={cn('sr-only transition-colors duration-300 sm:not-sr-only sm:block sm:type-caption lg:type-h5', selected ? 'text-white' : 'text-white/65 group-hover:text-white/90')}>
                  {s.label}
                </span>
              </span>
              {/* Time left on this stage while the walkthrough plays */}
              {selected && cycling && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                  <span
                    key={stage}
                    className="block h-full origin-left animate-progress bg-space"
                    style={{ animationPlayState: running ? 'running' : 'paused', ['--progress-duration' as string]: `${STAGE_SECONDS}s` }}
                    onAnimationEnd={() => setStage((n) => (n + 1) % stages.length)}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
