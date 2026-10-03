'use client';

import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { IllustrativeLabel } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { AIImageView } from '@/components/media/AIImageView';
import { divisions, divisionAccent } from '@/data/divisions';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import type { NavMedia } from '@/lib/media/nav-media';
import type { DivisionId } from '@/types/content';
import { cn } from '@/lib/utils';

/** One plain line per division: what it does, in the fewest words. */
const oneLine: Record<DivisionId, string> = {
  secure: 'CCTV, door phones and biometric attendance.',
  connect: 'Fiber, LAN, Wi-Fi and IT support.',
  solar: 'On-grid, off-grid and hybrid solar.',
  digital: 'Websites, apps, ERP, CRM and marketing.',
  space: 'Real estate, architecture, interiors and construction.',
};

const MAX_CHIPS = 6;
const CYCLE_SECONDS = 6;

/**
 * "Specialists, working as one." A tab per division and one short panel: tagline, name, a
 * single line, the services as chips, the divisions it works with (tap to jump) and a photo.
 * It steps through the divisions on its own until someone interacts or with reduced motion.
 */
export function AboutDivisionsSection({ media }: { media?: NavMedia }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const baseId = useId();

  const division = divisions[active];
  const accent = divisionAccent[division.id].hex;
  const cycling = auto && !reduced;
  const extra = division.services.length - MAX_CHIPS;

  const select = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = divisions.length - 1;
    const target =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    select(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <Section tone="darker" id="divisions" aria-labelledby="divisions-title" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-blueprint opacity-35 mask-fade-radial" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[60rem] max-w-full -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: accent }}
      />

      <Container>
        <SectionHeading
          id="divisions-title"
          tone="dark"
          eyebrow="Five divisions"
          title={
            <>
              Specialists, <em>working as one.</em>
            </>
          }
          description="Five teams. One plan. One point of contact."
          className="mb-7"
        />

        <div
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
        >
          {/* Division tabs */}
          <div role="tablist" aria-label="PPAB divisions" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
            {divisions.map((d, i) => {
              const selected = i === active;
              const tone = divisionAccent[d.id].hex;
              return (
                <button
                  key={d.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`${baseId}-tab-${d.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    'group relative flex min-h-14 shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-2.5 text-left transition-colors duration-300',
                    selected ? 'border-white/25 bg-white/[0.07] text-white' : 'border-white/10 text-white/65 hover:border-white/20 hover:text-white'
                  )}
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300"
                    style={{ color: tone, borderColor: selected ? tone : `${tone}40`, backgroundColor: `${tone}1f` }}
                  >
                    <Icon name={d.icon} size={18} />
                  </span>
                  <span>
                    <span className="block type-index text-white/55">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-0.5 block whitespace-nowrap type-h5">{d.short}</span>
                  </span>
                  {/* Progress to the next division while it is stepping through on its own */}
                  {selected && cycling && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                      <span
                        key={active}
                        className="block h-full origin-left animate-progress"
                        style={{ backgroundColor: tone, animationPlayState: paused ? 'paused' : 'running', ['--progress-duration' as string]: `${CYCLE_SECONDS}s` }}
                        onAnimationEnd={() => setActive((n) => (n + 1) % divisions.length)}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Division panel */}
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${division.id}`}
            className="mt-3 grid overflow-hidden rounded-panel border border-white/10 bg-navy-900 lg:grid-cols-2"
          >
            {/* Re-keyed so the copy rises in again for each division */}
            <div key={division.id} className="flex flex-col p-6 sm:p-8">
              <p className="menu-rise type-tagline" style={{ color: accent }}>
                {division.tagline}
              </p>
              <h3 className="menu-rise mt-0.5 type-h3 text-white" style={{ animationDelay: '40ms' }}>
                {division.name}
              </h3>
              <p className="menu-rise mt-2 type-body text-white/75" style={{ animationDelay: '80ms' }}>
                {oneLine[division.id]}
              </p>

              <ul className="menu-rise mt-4 flex flex-wrap gap-1.5" style={{ animationDelay: '120ms' }} aria-label={`${division.short} services`}>
                {division.services.slice(0, MAX_CHIPS).map((service) => (
                  <li key={service.id} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 type-caption text-white/85">
                    {service.name}
                  </li>
                ))}
                {extra > 0 && (
                  <li className="rounded-full px-2 py-1 type-caption" style={{ color: accent }}>
                    +{extra} more
                  </li>
                )}
              </ul>

              <div className="menu-rise mt-5" style={{ animationDelay: '160ms' }}>
                <p className="type-eyebrow text-white/55">Works with</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {divisions.map((partner, i) =>
                    partner.id === division.id ? null : (
                      <button
                        key={partner.id}
                        type="button"
                        onClick={() => select(i)}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/12 px-3.5 type-body-sm font-medium text-white/80 transition-colors hover:border-white/35 hover:text-white"
                      >
                        <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: divisionAccent[partner.id].hex }} />
                        {partner.short}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="menu-rise mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6" style={{ animationDelay: '200ms' }}>
                <ButtonLink href={division.href} size="sm" withArrow>
                  Explore {division.short}
                </ButtonLink>
                <Link href="/contact#quote" className="group inline-flex items-center gap-1.5 type-button text-gold-300 hover:text-gold-200">
                  Talk to our team
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Division photo */}
            <div className="relative min-h-[13rem] sm:min-h-[16rem] lg:min-h-0">
              {divisions.map((d, i) => {
                const image = media?.[d.href];
                return image ? (
                  <div
                    key={d.id}
                    aria-hidden={i !== active}
                    className={cn('absolute inset-0 transition-[opacity,scale] duration-700 ease-out-expo motion-reduce:transition-none', i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0')}
                  >
                    <AIImageView image={image} showLabel={false} sizes="(min-width: 1024px) 45vw, 100vw" imgClassName="object-cover" />
                  </div>
                ) : null;
              })}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-navy-900 lg:via-navy-900/10" />
              {media?.[division.href]?.src && <IllustrativeLabel className="absolute bottom-4 right-4" />}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
